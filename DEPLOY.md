# Deployment

This repo builds a standalone Next.js container for ARM servers.

## Publish an image

Create and publish a GitHub release. The `Container Image` workflow builds and pushes:

```text
ghcr.io/abhi1693/portfolio:<release-version>
ghcr.io/abhi1693/portfolio:latest
```

Both tags are `linux/arm64` only.

You can also run the workflow manually from GitHub Actions. Manual runs push:

```text
ghcr.io/abhi1693/portfolio:manual
```

## Run on the server

Copy `compose.yaml` to the server, then run:

```bash
docker compose pull
docker compose up -d
```

The container listens on port `3000`.

If the GHCR package is private, authenticate first:

```bash
docker login ghcr.io -u abhi1693
```

## Prepared patch release 0.1.10

The dependency refresh upgrades to Next.js 16.4.2, React 19.3.1, Tailwind CSS 4.3.3, and the patched Node.js 26.12.1 container base. The v4 PostCSS plugin loads the existing theme explicitly and preserves container spacing. Run `npm ci --ignore-scripts`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before release. See [CHANGELOG.md](CHANGELOG.md) for the remaining upstream toolchain constraints. This PR does not publish an image or deploy the site.
