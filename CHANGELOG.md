# Release notes

## 0.1.10 (prepared, unreleased)

- Refresh runtime and development dependencies and regenerate the npm lockfile.
- Use Next.js 16.4.2 and React 19.3.1, with Node.js 26.12.1 for container and local validation.
- Keep ESLint 9.39.5 and TypeScript 6.0.3: the latest stable Next.js lint plugins do not yet accept ESLint 10 or TypeScript 7. No peer-dependency checks are bypassed.
- Migrate Tailwind CSS 3 to 4 and its dedicated PostCSS plugin, preserving the existing theme and container spacing.
- Production npm audit reports zero vulnerabilities. Full audit retains the upstream-unpatched development-only Next ESLint/braces chain (five affected package nodes).

This change prepares a patch release only. It does not publish a release, container, database migration, or deployment.
