import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import define from '@computerwwwizards/vite-define-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), define()],
})
