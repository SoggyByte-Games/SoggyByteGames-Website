# SoggyByte Games — website

The official website of SoggyByte Games and DoNOTSpill.

A fast static site: Vite, plain JavaScript, GSAP + ScrollTrigger for scroll choreography,
a small hand-written WebGL shader for the hero, and a Canvas 2D illustration for DoNOTSpill.
No framework, no trackers, no cookies, no third-party requests at runtime.

## Commands

```bash
npm install
npm run dev           # local dev server
npm run build         # production build to dist/ + public-output safety check
npm run preview       # serve the production build locally
npm run check:config  # list the launch values that still need to be supplied
```

## Where things live

| What | Where |
| --- | --- |
| Studio facts, contact email, social links, Steam URL, team, news, legal facts | `site.config.js` |
| Page markup (rendered at build time from the config) | `src/templates/` |
| Styles | `src/styles/` |
| Animations | `src/js/motion.js` (GSAP), `src/js/liquid.js` (hero WebGL), `src/js/vessel.js` (DoNOTSpill glass) |
| Logo vectors (traced from the supplied logo) | `src/brand/logo-paths.json` |
| Favicons, share image, approved public media | `public/` |

Anything left empty in `site.config.js` is not rendered. The site never shows a broken link,
a placeholder person or a fake Steam button.

### Turning on the Steam link

Set `games[0].steamUrl` to the real store URL. The locked "Coming soon" block is replaced by a
live link automatically. While it is empty, the block is plain text: not a link, not a button,
not focusable, and announced to screen readers as "coming soon".

### Adding team members, news, socials

Fill `team`, `news` or `social` in `site.config.js`. The Team and News sections and their menu
entries appear only once they have real content.

## Adding game media safely

The game project is confidential. Only **exported, approved, spoiler-free copies** go into this repo:

1. Export the screenshot or clip from Unity (or capture it) on your own machine.
2. Convert it for the web: `.webp` / `.avif` for images (about 2400 px wide max),
   `.mp4` (H.264) for video, ideally under 8 MB.
3. Put it in `public/media/donotspill/` and reference it in `site.config.js` (`media.keyArt`,
   `media.trailerMp4`, `media.screenshots`).

Never copy project folders, scenes, prefabs, scripts, `.meta` files, source art (PSD, Blender, FBX)
or builds into this repository. `.gitignore` blocks the common Unity file types, and
`npm run build` fails if any such file, a source map, or something that looks like a secret
reaches `dist/`.

**Note: this repository is currently public on GitHub.** Treat everything committed here as public.

## Deployment (GitHub Pages)

`.github/workflows/site.yml` builds every push and pull request. Deploying is opt-in:

1. Settings → Pages → Source: **GitHub Actions**. Add the custom domain there if you have one.
2. Settings → Secrets and variables → Actions → Variables: add `DEPLOY_TO_PAGES` = `true`.
3. Merge to `main`. The site deploys automatically from then on.

The build adapts to the URL it is served from (custom domain or `/<repo>/` sub-path).
The output is plain static files, so any static host (Netlify, Cloudflare Pages, Vercel) also
works with build command `npm run build` and output folder `dist`.

## Privacy and security notes

- Fonts are self-hosted; no Google Fonts, CDNs, analytics or embeds.
- A strict Content Security Policy is added to every page at build time.
- External links open with `rel="noopener noreferrer"`.
- Animations respect `prefers-reduced-motion`; all content is readable without JavaScript.
