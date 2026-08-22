# Sri Aadhya Hospital — Deployment

This repository is a standalone static website.

For Cloudflare Pages, connect the repository and use the repository root as the output directory. No build command is required; `index.html` is the production entry point.

Important: the current image assets are temporarily served from the existing preview asset host. Before final client handover, mirror those assets to a permanent production asset location and update `index.html` references.