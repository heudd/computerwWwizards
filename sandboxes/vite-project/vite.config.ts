import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.CUSTOM': [5,3],
    'import.meta.env.CUSTOM2': '"pepito"'
  }
})
