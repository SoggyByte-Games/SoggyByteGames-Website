/**
 * Central site configuration.
 *
 * Every studio fact, link and contact detail shown on the website comes from
 * this file. Anything left empty ('' or []) is simply not rendered, so the site
 * never shows a broken link, a fake profile or placeholder people.
 *
 * Run `npm run check:config` to list the values that are still missing.
 */
export default {
  studio: {
    name: 'SoggyByte Games',
    shortName: 'SoggyByte',
    // Public website address, e.g. 'https://www.example.com' (no trailing slash).
    // Needed for canonical URLs, social share previews and the sitemap.
    siteUrl: 'https://soggybytegames.com',
    // Shown in the Studio section. Informal until the business is registered.
    founded: '2026-10-06',
    location: 'Istanbul, Türkiye',
    // Shown in search results and link previews.
    description:
      'SoggyByte Games is an Istanbul-based game studio. Our current game, DoNOTSpill, is a two-player co-op delivery game coming soon to Steam.',
  },

  contact: {
    // Public contact address, e.g. 'hello@example.com'. Renders as a mailto: link.
    email: 'soggybytegames@gmail.com',
    // Address for copyright / IP notices. Falls back to `email` when empty.
    legalEmail: '',
  },

  // Leave a value empty to hide that link everywhere on the site.
  social: {
    youtube: 'https://www.youtube.com/@SoggyByte',
    instagram: 'https://www.instagram.com/soggybytegames/',
    linkedin: 'https://www.linkedin.com/company/soggybytegames/',
  },

  games: [
    {
      slug: 'donotspill',
      title: 'DoNOTSpill',
      // Title split for the typographic treatment: Do · NOT · Spill
      titleParts: ['Do', 'NOT', 'Spill'],
      // The game's own subtitle from its main menu.
      genre: 'Local delivery chaos',
      players: '2 players, co-op',
      status: 'In development',
      platforms: ['PC'],
      tagline: 'Two riders. One scooter. Zero spills.',
      summary:
        'A two-player co-op game about getting hot food across a colourful city in one piece. One of you drives the scooter, the other keeps the order steady, and neither of you can do it alone. Pick your story, as a couple or as two friends, and take on the city one delivery at a time.',
      // Real Steam store URL, e.g. 'https://store.steampowered.com/app/000000/DoNOTSpill/'.
      // While empty, the Steam call-to-action stays locked as "Coming soon".
      steamUrl: '',
      // Approved, spoiler-free media exported for the web. Paths are relative to /public.
      // Example: keyArt: 'media/donotspill/key-art.webp'
      media: {
        keyArt: '',
        keyArtAlt: '',
        trailerMp4: '',
        trailerPoster: '',
        screenshots: [], // [{ src: 'media/donotspill/shot-01.webp', alt: '...' }]
      },
    },
  ],

  // Verified team members only, shown inside the Studio section. Hidden while empty.
  // Name and role captions appear as soon as they are filled in.
  // { name: 'Full Name', role: 'Role', portrait: 'media/team/name.webp', links: [{ label: 'LinkedIn', url: 'https://...' }] }
  team: [
    {
      name: 'Barkın Ali Lüküslü',
      role: '',
      portrait: 'media/team/member-1.webp',
      links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/barkinalilukuslu/' }],
    },
    {
      name: 'Nur Aslan',
      role: '',
      portrait: 'media/team/member-2.webp',
      links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/nuraslan/' }],
    },
  ],

  // Published announcements only. The section stays hidden while this is empty.
  // { date: '2026-01-31', title: 'Headline', summary: 'One or two sentences.', url: 'https://...' }
  news: [],

  legal: {
    // Keep true until the legal pages have been reviewed by a qualified professional.
    // While true, every legal page shows a visible "draft" notice.
    draft: true,
    // Who operates the site. SoggyByte Games is not a registered company yet,
    // so the operators are the two founders as individuals.
    operatorName: 'Barkın Ali Lüküslü and Nur Aslan',
    // True while SoggyByte Games is a name used by individuals, not a registered company.
    unregistered: true,
    // Business address (for KVKK / GDPR controller identification). Left empty: none exists yet.
    operatorAddress: '',
    // Law governing the Terms of Use, and the courts for disputes.
    governingLaw: 'the Republic of Türkiye',
    courts: 'Istanbul (Çağlayan) Courts and Enforcement Offices',
    // Company that hosts the website.
    hostingProvider: 'GitHub, Inc. (GitHub Pages)',
    // Where the domain name is registered.
    domainRegistrar: 'Squarespace',
    // Service that receives mail sent to contact.email.
    emailProvider: 'Google (Gmail)',
    // Date the current versions of the legal pages take effect, e.g. '2026-11-01'.
    effectiveDate: '',
  },
};
