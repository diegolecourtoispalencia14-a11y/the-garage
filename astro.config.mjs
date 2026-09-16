import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://the-garage-dw4.pages.dev',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  integrations: [icon()]
});
