#!/usr/bin/env bash
set -euo pipefail

image=${1:?Usage: smoke-runtime.sh IMAGE PLATFORM [APP_VERSION]}
platform=${2:?Usage: smoke-runtime.sh IMAGE PLATFORM [APP_VERSION]}
app_version=${3:-$(node -p 'require("./package.json").version')}
next_version=$(node -p 'require("./package-lock.json").packages["node_modules/next"].version')
node_version=$(sed -n 's/^FROM node:\([0-9.]*\)-.* AS base$/\1/p' Dockerfile)
test -n "$node_version"

docker run --rm -i --platform "$platform" --network none --read-only \
  --cap-drop ALL --security-opt no-new-privileges --pids-limit 128 --memory 512m \
  --tmpfs /tmp:rw,noexec,nosuid,size=32m \
  --tmpfs /app/public:rw,noexec,nosuid,uid=1001,gid=1001,mode=0755,size=1m \
  --tmpfs /app/.next/cache:rw,noexec,nosuid,uid=1001,gid=1001,mode=0755,size=32m \
  -e EXPECTED_APP_VERSION="$app_version" -e EXPECTED_NEXT_VERSION="$next_version" \
  -e EXPECTED_NODE_VERSION="$node_version" -e EXPECTED_PLATFORM="$platform" \
  --entrypoint node "$image" --input-type=commonjs <<'NODE'
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const sharp = require('sharp');

(async () => {
  assert.equal(process.getuid(), 1001);
  assert.equal(process.getgid(), 1001);
  assert.equal(process.arch, process.env.EXPECTED_PLATFORM.split('/')[1] === 'arm64' ? 'arm64' : 'x64');
  assert.equal(process.versions.node, process.env.EXPECTED_NODE_VERSION);
  assert.equal(require('/app/package.json').version, process.env.EXPECTED_APP_VERSION);
  assert.equal(require('next/package.json').version, process.env.EXPECTED_NEXT_VERSION);
  for (const path of ['/usr/local/lib/node_modules/npm', '/usr/local/lib/node_modules/corepack',
    '/usr/local/bin/npm', '/usr/local/bin/npx', '/usr/local/bin/yarn', '/usr/local/bin/yarnpkg']) {
    assert.equal(fs.existsSync(path), false, `Unexpected runtime package manager: ${path}`);
  }
  const fixture = await sharp({ create: { width: 24, height: 24, channels: 4,
    background: { r: 42, g: 91, b: 137, alpha: 1 } } }).png().toBuffer();
  const transformed = await sharp(fixture).resize(12, 12).webp().toBuffer();
  assert.equal((await sharp(transformed).metadata()).format, 'webp');
  assert.equal((await sharp(transformed).metadata()).width, 12);
  // Only this ephemeral test container receives a public image fixture.
  fs.writeFileSync('/app/public/ci-smoke.png', fixture);

  const server = spawn(process.execPath, ['server.js'], {
    cwd: '/app', env: { ...process.env, HOSTNAME: '0.0.0.0', PORT: '3000' },
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  const get = path => fetch(new URL(path, 'http://127.0.0.1:3000'), {
    headers: { Accept: 'image/webp,text/html,*/*' }, signal: AbortSignal.timeout(5000),
  });
  try {
    let response;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      assert.equal(server.exitCode, null, 'Next.js exited during startup');
      try { response = await get('/'); if (response.ok) break; } catch { /* Wait for startup. */ }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    assert.equal(response?.status, 200, 'Application did not become ready');
    const html = await response.text();
    assert.match(html, /Abhimanyu/i);
    const assets = [...html.matchAll(/(?:src|href)="([^"]*\/_next\/static\/[^\"]+\.(?:js|css)(?:\?[^\"]*)?)"/g)]
      .map(match => match[1].replaceAll('&amp;', '&'));
    for (const extension of ['js', 'css']) {
      const asset = assets.find(path => path.split('?')[0].endsWith(`.${extension}`));
      assert.ok(asset, `Missing real ${extension} asset in page`);
      const result = await get(asset);
      assert.equal(result.status, 200, asset);
      assert.ok((await result.arrayBuffer()).byteLength > 0, asset);
    }
    const optimized = await get('/_next/image?url=%2Fci-smoke.png&w=64&q=75');
    assert.equal(optimized.status, 200, 'Next.js image optimizer failed');
    assert.match(optimized.headers.get('content-type'), /^image\/webp/);
    assert.equal((await sharp(Buffer.from(await optimized.arrayBuffer())).metadata()).format, 'webp');
    console.log(JSON.stringify({ app: process.env.EXPECTED_APP_VERSION, node: process.versions.node,
      next: process.env.EXPECTED_NEXT_VERSION, arch: process.arch, uid: process.getuid(),
      checks: ['sharp-native', 'http', 'javascript', 'css', 'next-image-optimizer', 'no-package-manager'] }));
  } finally {
    server.kill('SIGTERM');
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
NODE
