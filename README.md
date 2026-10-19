# GitHub Actions Study Hub

A one-stop study site for the GitHub Actions certification, built with Astro and deployed manually to Cloudflare Pages.

## Structure

- `src/content/` — Markdown study notes (one file per topic)
- `src/components/` — Reusable UI components (Mermaid diagrams, quiz cards, copy buttons)
- `src/layouts/` — Page layouts
- `src/pages/` — Site routes

## Deploy manually to Cloudflare Pages

1. Run `npm run build` to generate the `dist/` folder.
2. Log in to Cloudflare → Pages → Create a project → Upload assets.
3. Upload the contents of `dist/`.
