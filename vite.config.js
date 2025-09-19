import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = process.env.GITHUB_REPOSITORY?.split('/')?.[1] ?? ''
const isUserSite = repository.toLowerCase().endsWith('.github.io')
const base = process.env.GITHUB_ACTIONS && repository && !isUserSite ? `/${repository}/` : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
