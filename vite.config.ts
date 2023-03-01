import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

///在React17里JSX转换器经过了修改 
// React.createElement() jsx()
export default defineConfig({
  resolve: {
    alias: [
      { find: /^~/, replacement: '' }
    ]
  },
  plugins: [react(
    {
      jsxRuntime: 'classic'
    }
  )],
  css: {
    preprocessorOptions: {
      less: {// less3.0后 less的javascriptEnabled默认是false
        javascriptEnabled: true
      }
    }
  }
})
