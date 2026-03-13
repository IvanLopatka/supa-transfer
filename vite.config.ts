import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Шлях до головного файлу вашої бібліотеки
      entry: resolve(__current_time, 'src/index.ts'),
      name: 'MySupabaseUtils',
      // Формати, які будуть згенеровані (ESM та CommonJS)
      fileName: (format) => `my-supabase-utils.${format}.js`,
    },
    rollupOptions: {
      // Важливо: не запихуйте React та Supabase всередину вашого файлу
      external: ['react', '@supabase/supabase-js'],
      output: {
        globals: {
          react: 'React',
          '@supabase/supabase-js': 'Supabase'
        },
      },
    },
  },
});