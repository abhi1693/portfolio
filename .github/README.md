# Repository automation

Common CI and image mechanics are maintained in [abhi1693/actions](https://github.com/abhi1693/actions).
Workflows use the released `@v1` reference for centrally maintained compatible updates.
See the [shared release history](https://github.com/abhi1693/actions/releases) for changes.
Repository-owned scripts, triggers, scanner exceptions and application smoke checks
remain alongside the application. Image manifests declare components rather than
copying workflow steps.

Both pull-request CI and release builds validate the native ARM64 runtime image.
The shared workflow generates an SBOM, blocks HIGH/CRITICAL vulnerabilities and
detected secrets, and runs `scripts/smoke-runtime.sh` before image promotion.
The smoke check verifies the standalone application and locked Next.js/Node.js
versions, non-root identity, Sharp's native image processing, HTTP/static assets,
and the Next.js image optimizer using a container-local fixture. It also checks
that unused global package managers are absent from the final image.

All Docker stages use the same pinned Alpine Node.js image so traced Sharp/libvips
dependencies use the runtime's musl ABI. Build stages retain npm; the standalone
runtime does not need it. Published tags stay immutable: a failed release image
is repaired in a new patch release after the PR's native image checks pass.
