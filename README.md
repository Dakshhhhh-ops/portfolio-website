# Daksh Wadhwa — Portfolio

Personal portfolio site. A single page with a lot of movement in it.

**Stack:** React 19 · TypeScript · Vite · [Motion](https://motion.dev) (animation) · [Lenis](https://lenis.darkroom.engineering) (smooth scroll)

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Edit the content

Everything the site says lives in [`src/data/content.ts`](src/data/content.ts) — name, intro,
projects, highlights, toolkit, leadership roles, email and social links.

Project artwork is drawn in CSS until you add a real screenshot (SIF-Trace already has one).
Drop the image into `src/assets/` and set `image` on the project:

```ts
import arcadeShot from '../assets/arcade.webp'

{ title: 'Arcade', /* … */ image: { src: arcadeShot, alt: 'Arcade workbench' } }
```

Colours, fonts and spacing are CSS variables at the top of
[`src/styles/global.css`](src/styles/global.css).

## Structure

```
src/
  data/content.ts         all copy and project data
  components/
    sections.tsx          Hero, Marquee, Work, Highlights, About, Toolkit, Contact, Footer
    Header.tsx            fixed header + mobile menu
    Visual.tsx            project artwork (image or CSS placeholder) with parallax
    ui.tsx                Reveal, Magnetic, Cursor
  context/MotionContext   site-wide "pause motion" switch (respects prefers-reduced-motion)
  hooks/                  useLenis, useFitText, useClock, useDragScroll
  styles/global.css
```

## Deploy

Every push to `main` is built and published to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
<https://dakshhhhh-ops.github.io/portfolio-website/>

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The build is fully static (`dist/`), so Vercel or Netlify also work with the default settings.
