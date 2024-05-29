import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import { copy } from 'vite-plugin-copy'
/* Huom. base määrittää aloituspolun 
   React-kehityspalvelin: ''
   XAMPP: react-sovellusmalli-ii
*/

export default defineConfig({
  plugins: [react()],
  base: '',
  build: {
    outDir: 'dist',
    assetsDir: 'static'
  }
})

