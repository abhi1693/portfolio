# Release notes

## 0.1.10

- Refresh runtime and development dependencies and regenerate the npm lockfile.
- Use Next.js 16.4.2 and React 19.3.1, with Node.js 26.12.1 for container and local validation.
- Keep ESLint 9.39.5 and TypeScript 6.0.3: the latest stable Next.js lint plugins do not yet accept ESLint 10 or TypeScript 7. No peer-dependency checks are bypassed.
- Migrate Tailwind CSS 3 to 4 and its dedicated PostCSS plugin, preserving the existing theme and container spacing.

- Apply the reviewed MIT-licensed bounded braces parser/AST patch for CVE-2026-93687 to every transitive consumer, with actual-consumer and malicious-input regression tests; keep the normal audit policy.
