/** Lists the values in site.config.js that still need to be supplied before launch. */
import cfg from '../site.config.js';

const missing = [];
const need = (cond, label) => !cond && missing.push(label);

need(cfg.studio.siteUrl, 'studio.siteUrl — public website address (canonical URLs, share previews)');
need(cfg.contact.email, 'contact.email — public contact email (mailto link, legal pages)');
need(cfg.social.youtube, 'social.youtube — YouTube channel URL');
need(cfg.social.instagram, 'social.instagram — Instagram profile URL');
need(cfg.social.linkedin, 'social.linkedin — LinkedIn page URL');
for (const g of cfg.games) {
  need(g.steamUrl, `games[${g.slug}].steamUrl — Steam store URL (CTA stays "Coming soon" until set)`);
  need(g.media?.keyArt || g.media?.trailerMp4, `games[${g.slug}].media — approved key art or trailer`);
}
need(cfg.team.length, 'team — verified team members (section hidden until added)');
cfg.team.forEach((m, i) => need(m.name, `team[${i}] — name for ${m.portrait || 'member ' + (i + 1)}`));
need(!cfg.legal.draft, 'legal.draft — set to false only after legal review');
need(cfg.legal.operatorName, 'legal.operatorName — registered legal name');
need(cfg.legal.operatorAddress || cfg.legal.unregistered, 'legal.operatorAddress — registered business address');
need(cfg.legal.governingLaw, 'legal.governingLaw — governing law for the Terms of Use');
need(cfg.legal.hostingProvider, 'legal.hostingProvider — hosting company');
need(cfg.legal.effectiveDate, 'legal.effectiveDate — set to the launch date when the site goes live');

if (!missing.length) console.log('✔ All launch values are set.');
else console.log(`Still to supply (${missing.length}):\n  - ` + missing.join('\n  - '));
