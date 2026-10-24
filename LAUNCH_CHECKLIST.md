# Launch checklist

Internal. Not part of the published website.

Run `npm run check:config` to see which of these are still open.

## 1. Content we still need

- [ ] **Website address** → `studio.siteUrl` (canonical URLs, share previews)
- [x] **Contact email** → `soggybytegames@gmail.com`
- [ ] **YouTube** URL → `social.youtube`
- [ ] **Instagram** URL → `social.instagram`
- [ ] **LinkedIn** URL → `social.linkedin`
- [ ] **Steam store URL** → `games[0].steamUrl` (until then the CTA stays locked as "Coming soon")
- [ ] **DoNOTSpill media**: approved, spoiler-free key art, screenshots and/or a short trailer
      exported from the Unity project (see README → "Adding game media safely")
- [x] **Team portraits**: two photos added (cropped, GPS/EXIF metadata removed, bystanders faded out)
- [ ] **Team names and roles** for `media/team/member-1.webp` and `member-2.webp`, plus optional links
- [ ] Confirm both people agree to their photo being public
- [ ] **News**: only once there is a real announcement

## 2. Copy to approve

These are written for the site but are brand voice, not verified facts. Please confirm or edit:

- [ ] About: "Games made with steady hands and soggy bytes." and the two paragraphs under it
- [ ] DoNOTSpill tagline: "Hold it together."
- [ ] DoNOTSpill summary: "Our current project. We are keeping the details close for now…"
- [ ] DoNOTSpill platform shown as **PC** (based on the Steam release; edit if Mac/Linux/Steam Deck are planned)
- [ ] Contact: "Got something to spill?" / "Press, partnerships, or just a hello."

## 3. Legal facts to confirm (all pages show a "Draft" notice until `legal.draft = false`)

- [ ] Registered legal name of the operator (company or individual) → `legal.operatorName`
- [ ] Registered business address → `legal.operatorAddress`
- [ ] Governing law / competent courts for the Terms of Use → `legal.governingLaw`
- [ ] Hosting provider name → `legal.hostingProvider`; its privacy policy link and log retention
- [ ] Whether hosting logs are processed outside Türkiye, and the KVKK Art. 9 transfer basis
- [x] Email provider: Google (Gmail)
- [ ] How long email correspondence is kept, and the KVKK Art. 9 basis for Gmail's processing abroad
- [ ] Confirm the hosting provider sets no cookies on the domain
- [ ] Effective date → `legal.effectiveDate`
- [ ] Whether a VERBİS registration or a separate KVKK "aydınlatma metni" format is required for your entity
- [ ] **Have a qualified lawyer review all four pages**, then set `legal.draft` to `false`

## 4. Repository and deployment

- [ ] The GitHub repository `Nurasln/SoggyByteGames-Website` is **public**. The brief asked for it to be
      private. Decide whether to keep it public (fine for a website, but treat everything in it as public)
      or switch it to private (GitHub Pages on private repos requires a paid plan).
- [ ] Enable GitHub Pages (Source: GitHub Actions) and set the `DEPLOY_TO_PAGES` variable when ready
- [ ] Point the domain's DNS at GitHub Pages and set the custom domain in Settings → Pages
- [ ] After the first deploy: test the live site on a real phone (iOS Safari + Android Chrome)
