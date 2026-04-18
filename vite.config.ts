import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
      tsconfigPath: './tsconfig.app.json',
    })
  ],
  build: {
    lib: {

      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SupaTransfer',
      fileName: (format) => `supa-transfer.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      //libraries that will not be included in the bundle
      external: ['react', 'react-dom', '@supabase/supabase-js'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@supabase/supabase-js': 'Supabase',
        },
      },
    },

    minify: 'esbuild',
  },
});