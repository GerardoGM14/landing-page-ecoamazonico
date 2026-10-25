// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Dominio público: se usa para URLs canónicas, Open Graph y el sitemap.
  // Si se cambia a un dominio propio, actualizar también public/robots.txt.
  site: 'https://eco-as.web.app',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      // Igual que las URLs canónicas: sin barra final (excepto la raíz)
      serialize(item) {
        item.url = item.url.replace(/(.)\/$/, '$1');
        return item;
      }
    })
  ]
});
