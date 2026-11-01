# Chris Cheng, portfolio

The source of [chengboonrong.github.io](https://chengboonrong.github.io): a static, prerendered site with a Three.js city in the hero, case studies for five projects, and a print-ready résumé.

React 19, TypeScript, Vite, Tailwind v4, GSAP and three. Every route is rendered to HTML at build time and hydrated in the browser, so the whole site reads with JavaScript off.

## Local development

```sh
npm install
npm run dev        # Vite dev server, client-rendered
npm run build      # client build, SSR build, then prerender into dist/
npm run preview    # serves dist/ on port 4893
```

`npm run dev` skips prerendering. Use `npm run build && npm run preview` to see what ships.

## Checks

```sh
npm run typecheck
npm run lint
npm test -- --project=chromium-desktop --project=chromium-mobile   # the usual run
npm test           # adds WebKit, desktop and mobile
```

Tests run against the built site, so run `npm run build` first. Tests use port 4893; to pick another, set `PORT`, for example `PORT=4900 npm test`. Browsers come from `npx playwright install chromium webkit`.

## Editing content

Everything the site says lives in `src/content.ts`, and images and video live in `public/media/`. A new project needs an entry in `projects`, and a card composition in the `cards` map in `src/Home.tsx`. Its route, sitemap entry and case study follow from the entry.

Images named `-1600.webp` under `kl-*` or `starlake-*` need an `-800.webp` partner, used for `srcset`.

Two files are generated and committed. Regenerate them after the content changes:

```sh
npm run build && npm run resume && npm run build   # public/Chris-Cheng-Resume.pdf
npm run build && npm run og                        # public/og.png, public/favicon.png
```

The résumé script prints `/resume/`, so the build must come first, and the second build copies the new PDF into `dist/`.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main` and on manual dispatch: it runs `npm ci` and `npm run build`, then publishes `dist/` to GitHub Pages. In the repository settings, set Pages to deploy from GitHub Actions.

The repository must be named exactly `chengboonrong.github.io`. Only that name is served at the domain root, and the site assumes a base path of `/`. Under any other name the assets and links would break.
