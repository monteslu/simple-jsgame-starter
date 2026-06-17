import { defineConfig } from 'vite';
import jsgame from './vite-plugin-jsgame.js';

// Build the game to a single, stably-named ES-module bundle, then pack dist/
// into a .jsgame (the jsgame plugin runs after the build). The stable name lets
// package.json "main" point at the built entry so the libretro core / launcher
// can resolve it. base: './' keeps asset URLs relative inside the package.
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    modulePreload: false,
    // Single self-contained bundle so the loader has one entry file.
    rollupOptions: {
      output: {
        entryFileNames: 'game.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  plugins: [jsgame()],
});
