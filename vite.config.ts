import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = globalThis.process?.env?.GITHUB_REPOSITORY?.split('/')?.[1] ?? ''
const isUserSite = repository.toLowerCase().endsWith('.github.io')
const base = globalThis.process?.env?.GITHUB_ACTIONS && repository && !isUserSite ? `/${repository}/` : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
