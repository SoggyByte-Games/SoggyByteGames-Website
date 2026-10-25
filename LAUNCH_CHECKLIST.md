# Launch checklist

Internal. Not part of the published website.

Run `npm run check:config` to see which of these are still open.

## 1. Content we still need

- [x] **Website address** → https://soggybytegames.com (sitemap and share previews use it)
- [x] **Contact email** → `soggybytegames@gmail.com`
- [x] **YouTube** → https://www.youtube.com/@SoggyByte
- [x] **Instagram** → https://www.instagram.com/soggybytegames/
- [x] **LinkedIn** → https://www.linkedin.com/company/soggybytegames/
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

- [x] Studio headline: "Soaked in the digital world, but never sunk!" (from the team)
- [ ] Studio paragraphs rewritten around DoNOTSpill ("two-person studio from Istanbul…", "…Just don't spill.")
- [ ] DoNOTSpill copy written from the tutorial video (premise only, no twists): tagline "Two riders. One scooter. Zero spills.", genre "Local delivery chaos", players "2 players, co-op" and the summary paragraph
- [ ] DoNOTSpill platform shown as **PC** (based on the Steam release; edit if Mac/Linux/Steam Deck are planned)
- [ ] Contact: "Got something to spill?" / "Press, partnerships, or just a hello."

## 3. Legal facts to confirm (all pages show a "Draft" notice until `legal.draft = false`)

- [x] Operator: Barkın Ali Lüküslü and Nur Aslan as individuals (no company yet). Update when the şahıs şirketi is registered
- [x] No business address yet: the notice identifies the founders by name and the contact email (update when the company is registered)
- [x] Governing law: Türkiye; courts: Istanbul (Çağlayan)
- [x] Hosting: GitHub Pages (domain registered at Squarespace); GitHub processes data in the US
- [x] KVKK Art. 9 (GitHub and Gmail abroad): the team chose to keep both and state the transfer openly in the Privacy Policy. Revisit when the company is founded (business accounts may allow standard contracts)
- [x] Email provider: Google (Gmail)
- [x] Email retention: messages deleted no later than two years after the correspondence ends (the team must actually do this, e.g. a yearly clean-up of the Gmail inbox)
- [ ] Confirm the hosting provider sets no cookies on the domain
- [ ] Effective date → `legal.effectiveDate`: set to the launch date on launch day
- [x] VERBİS: not required (confirmed by the team)
- [x] Draft notice: the team decided to keep it for now (`legal.draft = true`). Revisit after a legal review

## 4. Repository and deployment

- [x] Repository stays **public** (decided by the team). GitHub Pages works on the free plan; nothing confidential is ever committed here.
- [ ] Enable GitHub Pages (Source: GitHub Actions) and set the `DEPLOY_TO_PAGES` variable when ready
- [ ] Point the domain's DNS at GitHub Pages and set the custom domain in Settings → Pages
- [ ] After the first deploy: test the live site on a real phone (iOS Safari + Android Chrome)
