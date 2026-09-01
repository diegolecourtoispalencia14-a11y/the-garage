---
name: web-performance
description: Sub-second load times and Core Web Vitals optimization for mobile connections in tourist and coastal corridors.
---

# Web Performance & Core Web Vitals Skill

## Performance Targets
- **Largest Contentful Paint (LCP)**: < 1.2s on mobile 4G.
- **Interaction to Next Paint (INP)**: < 50ms (achieved via vanilla JS DOM filtering).
- **Cumulative Layout Shift (CLS)**: 0.00 (enforce explicit `width`, `height`, and `aspect-ratio: 1/1` on all bike media).
- **Zero Heavy Framework Runtime**: No React/Vue/Angular shipped to client; purely vanilla DOM manipulation for inventory filters.
- **Cache-Control & Edge CDN**: Leverages Cloudflare global edge caching with immutable asset hashing.
