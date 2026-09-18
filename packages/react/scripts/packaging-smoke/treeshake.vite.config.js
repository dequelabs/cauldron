import { defineConfig } from 'vite';

// Bundle the Button-only entry as a library so we can inspect exactly what a
// consumer's production bundler (Vite delegates to Rollup) keeps after
// tree-shaking. Unminified so the assertion can match readable module paths.
export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: 'treeshake.entry.js',
      formats: ['es'],
      fileName: 'treeshake.out'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime']
    }
  }
});
