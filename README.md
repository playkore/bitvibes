# bitvibes

This repository contains a Vite + React starter generated with Yarn. The app features a single `App` component with inline styling to keep the layout self-contained.

## Available scripts

- `yarn dev` – Start the Vite development server.
- `yarn build` – Create an optimized production build.
- `yarn preview` – Preview the production build locally.

## Deployment

The project is ready to deploy to GitHub Pages via GitHub Actions:

1. Push your changes to the `main` branch or trigger the `Deploy to GitHub Pages` workflow manually.
2. In your repository settings, set **Pages** → **Build and deployment** → **Source** to **GitHub Actions** (only required once).

The workflow installs dependencies with Yarn 4, builds the site, and publishes the `dist/` output using the official `deploy-pages` action. The Vite configuration automatically adjusts the base path so the app works both locally and when served from GitHub Pages.
