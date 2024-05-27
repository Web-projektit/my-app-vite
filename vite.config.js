import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copy } from 'vite-plugin-copy'

export default defineConfig({
  plugins: [react(),
            copy({
              targets: [
                { src: 'public/.htaccess', dest: 'c:/xampp/htdocs/react-sovellusmalli-ii' }
              ],
              hook: 'writeBundle' // run the plugin after the bundle is written
            })],
  base: '/react-sovellusmalli-ii/',
  build: {
    outDir: 'c:/xampp/htdocs/react-sovellusmalli-ii',
    assetsDir: 'static'
  }
})

