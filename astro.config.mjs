import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://thegarageplaya.pages.dev',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  }
});
