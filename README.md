# Daksh Wadhwa — Portfolio

Personal portfolio site. A single page with a lot of movement in it: a WebGL topographic hero
that bends around the cursor, a counting preloader, stacking project cards, a pinned horizontal
highlights reel and a footer revealed from underneath the page. Everything respects
`prefers-reduced-motion`, and there's a "pause motion" switch in the hero.

**Stack:** React 19 · TypeScript · Vite · WebGL (raw, no library) · [Motion](https://motion.dev) (animation) · [Lenis](https://lenis.darkroom.engineering) (smooth scroll)

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
Set `terminal` on a project to show an animated terminal session instead of the skeleton mock.
Drop the image into `src/assets/` and set `image` on the project:

```ts
import arcadeShot from '../assets/arcade.webp'

{ title: 'Arcade', /* … */ image: { src: arcadeShot, alt: 'Arcade workbench' } }
```

Colours, fonts and spacing are CSS variables at the top of
[`src/styles/global.css`](src/styles/global.css). In `*asterisks*`, words in the intro, statement and
headings are set in the italic serif.

## Structure

```
src/
  data/content.ts         all copy and project data
  components/
    sections.tsx          Hero, Statement, Work, Highlights, About, Toolkit, Footer (contact)
    Header.tsx            fixed header + full-screen menu
    Preloader.tsx         counter + curtain intro (once per session)
    Shader.tsx            WebGL topographic background for the hero
    Visual.tsx            project artwork (image, terminal or CSS placeholder) with parallax
    ui.tsx                Reveal, SplitWords, Magnetic, Cursor, Scramble, Roll, Counter, VelocityMarquee
  context/MotionContext   site-wide "pause motion" switch (respects prefers-reduced-motion)
  context/ReadyContext    tells intro animations when the preloader lifts
  hooks/                  useLenis, useFitText, useClock, useMediaQuery
  styles/global.css
```

## Deploy

Every push to `main` is built and published to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
<https://dakshhhhh-ops.github.io/portfolio-website/>

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The build is fully static (`dist/`), so Vercel or Netlify also work with the default settings.
