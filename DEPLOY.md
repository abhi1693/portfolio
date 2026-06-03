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
