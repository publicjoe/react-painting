import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    // Run the *.test-d.ts files through tsc as part of `npm test`, so the test
    // script catches type errors instead of leaving them for the build.
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.app.json',
    },
  },
})
