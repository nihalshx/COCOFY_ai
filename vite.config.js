import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';

// Fingerprint every file in public/media so a changed image or video always gets a new URL.
// Without this, browsers keep showing old cached copies after a redeploy.
function mediaHashes() {
  const dir = new URL('./public/media/', import.meta.url);
  const map = {};
  for (const f of readdirSync(dir)) {
    map[f] = createHash('md5').update(readFileSync(new URL(f, dir))).digest('hex').slice(0, 8);
  }
  return map;
}

// VITE_PREVIEW=1 builds a relative-path copy for the shareable preview link.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_PREVIEW ? './' : '/',
  define: { __MEDIA_HASH__: JSON.stringify(mediaHashes()) },
  build: { assetsInlineLimit: 0 }
});
