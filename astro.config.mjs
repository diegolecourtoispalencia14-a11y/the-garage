import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://the-garage-dw4.pages.dev',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  }
});
