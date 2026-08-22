# Sri Aadhya Hospital — Deployment

This repository is a standalone static website.

For Cloudflare Pages, connect the repository and use the repository root as the output directory. No build command is required; `index.html` is the production entry point.

The production page is self-contained and no longer depends on the old Emergent preview asset host. The supplied Justdial hospital photographs are stored in `assets/hospital-gallery.webp` and are used directly by the production page.