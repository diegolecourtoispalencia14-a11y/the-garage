---
name: astro-master
description: Best practices for Astro 5 static site generation, content collections, image optimization, and zero-JS defaults.
---

# Astro Master Skill

## Core Directives for The Garage
1. **Zero-JS by Default**: Keep pages purely static HTML/CSS. Use client-side JavaScript strictly for instant DOM-based product filtering and search.
2. **Content Collections**: Maintain bike inventory in `src/content/bicis/` with strict Zod schema validation in `src/content.config.ts`.
3. **Image Optimization**: Ensure bike photos use 1:1 aspect ratio, eager loading with high fetch priority on the main above-the-fold image, and lazy loading for subsequent images.
4. **Structured Layouts**: Enforce canonical URLs, OpenGraph tags, and JSON-LD `LocalBusiness` / `Product` schemas across all generated static pages.
