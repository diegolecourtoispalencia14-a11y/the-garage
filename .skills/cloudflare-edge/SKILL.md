---
name: cloudflare-edge
description: Edge hosting, zero-cost architecture, Pages deployment, and secure GitHub OAuth proxy workers.
---

# Cloudflare Edge & Serverless Skill

## Architecture Guidelines
1. **Cloudflare Pages**: Free tier commercial usage with unlimited bandwidth and fast static edge routing.
2. **Build Configuration**:
   - Framework: `Astro`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: `20`
3. **OAuth Worker Proxy**: Standalone Cloudflare Worker (`cloudflare-worker/worker.js`) that exchanges GitHub OAuth tokens securely for Sveltia CMS mobile logins.
4. **Security**: Only the repository owner (`diegolecourtoispalencia14-a11y`) is authorized to commit and update content.
