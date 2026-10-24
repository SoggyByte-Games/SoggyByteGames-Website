# Launch checklist

Internal. Not part of the published website.

Run `npm run check:config` to see which of these are still open.

## 1. Content we still need

- [x] **Website address** → https://soggybytegames.com (sitemap and share previews use it)
- [x] **Contact email** → `soggybytegames@gmail.com`
- [x] **YouTube** → https://www.youtube.com/@SoggyByte
- [x] **Instagram** → https://www.instagram.com/soggybytegames/
- [ ] **LinkedIn** URL → `social.linkedin`
- [ ] **Steam store URL** → `games[0].steamUrl` (until then the CTA stays locked as "Coming soon")
- [ ] **DoNOTSpill media**: approved, spoiler-free key art, screenshots and/or a short trailer
      exported from the Unity project (see README → "Adding game media safely")
- [x] **Team portraits**: two photos added (cropped, GPS/EXIF metadata removed, bystanders faded out)
- [x] **Team names and LinkedIn**: Barkın Ali Lüküslü, Nur Aslan
- [x] Team roles: not needed for now (field stays empty)
- [x] Both people agreed to their photo being public
- [ ] **News**: only once there is a real announcement

## 2. Copy to approve

These are written for the site but are brand voice, not verified facts. Please confirm or edit:

- [ ] About: "Games made with steady hands and soggy bytes." and the two paragraphs under it
- [ ] DoNOTSpill copy written from the tutorial video (premise only, no twists): tagline "Two riders. One scooter. Zero spills.", genre "Local delivery chaos", players "2 players, co-op" and the summary paragraph
- [ ] Studio paragraph: "…puts all of that on the back of a scooter."
- [ ] DoNOTSpill platform shown as **PC** (based on the Steam release; edit if Mac/Linux/Steam Deck are planned)
- [ ] Contact: "Got something to spill?" / "Press, partnerships, or just a hello."

## 3. Legal facts to confirm (all pages show a "Draft" notice until `legal.draft = false`)

- [x] Operator: Barkın Ali Lüküslü and Nur Aslan as individuals (no company yet). Update when the şahıs şirketi is registered
- [ ] No business address exists yet. Ask the lawyer whether a contact address is needed for the KVKK notice
- [x] Governing law: Türkiye; courts: Istanbul (Çağlayan). Lawyer to confirm
- [x] Hosting: GitHub Pages (domain registered at Squarespace); GitHub processes data in the US
- [ ] KVKK Art. 9 transfer basis for GitHub (US) and Gmail
- [x] Email provider: Google (Gmail)
- [x] Email retention: no fixed period; the policy says messages are deleted once no longer needed
- [ ] Confirm the hosting provider sets no cookies on the domain
- [ ] Effective date → `legal.effectiveDate`: set to the launch date on launch day
- [x] VERBİS: not required (confirmed by the team)
- [ ] **Have a qualified lawyer review all four pages**, then set `legal.draft` to `false`

## 4. Repository and deployment

- [ ] The GitHub repository `Nurasln/SoggyByteGames-Website` is **public**. The brief asked for it to be
      private. Decide whether to keep it public (fine for a website, but treat everything in it as public)
      or switch it to private (GitHub Pages on private repos requires a paid plan).
- [ ] Enable GitHub Pages (Source: GitHub Actions) and set the `DEPLOY_TO_PAGES` variable when ready
- [ ] Point the domain's DNS at GitHub Pages and set the custom domain in Settings → Pages
- [ ] After the first deploy: test the live site on a real phone (iOS Safari + Android Chrome)
