import { esc, safeUrl } from './util.js';
import { LEGAL_PAGES } from './layout.js';

/**
 * Legal page drafts.
 *
 * These are drafts based on what the website actually does today:
 * a static site with no forms, no accounts, no analytics, no advertising,
 * no embedded third-party media and no cookies set by our own code.
 * Missing facts are shown as clearly marked "to be confirmed" notes and
 * every page carries a visible draft notice while `legal.draft` is true.
 */

const tbc = (what) => `<mark class="tbc">[To be confirmed: ${esc(what)}]</mark>`;

function facts(cfg) {
  const l = cfg.legal;
  const email = cfg.contact.email?.trim();
  const legalEmail = cfg.contact.legalEmail?.trim() || email;
  return {
    studio: esc(cfg.studio.name),
    operator: l.operatorName ? esc(l.operatorName) : tbc('legal name of the operator'),
    // Optional: there is no business address while the studio is unregistered.
    address: l.operatorAddress ? `, ${esc(l.operatorAddress)}` : '',
    unregistered: l.unregistered
      ? ` ${esc(cfg.studio.name)} is the name under which they make games together; it is not a registered company.`
      : '',
    owner: l.operatorName
      ? `${esc(cfg.studio.name)} (${esc(l.operatorName)})`
      : esc(cfg.studio.name),
    law: l.governingLaw ? esc(l.governingLaw) : tbc('governing law'),
    courts: l.courts ? esc(l.courts) : tbc('competent courts'),
    host: l.hostingProvider ? esc(l.hostingProvider) : tbc('name of the hosting provider'),
    effective: l.effectiveDate ? esc(l.effectiveDate) : tbc('effective date'),
    mail: l.emailProvider ? esc(l.emailProvider) : tbc('email service provider'),
    contact: email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : tbc('contact email address'),
    legalContact: legalEmail
      ? `<a href="mailto:${esc(legalEmail)}">${esc(legalEmail)}</a>`
      : tbc('email address for legal and copyright notices'),
    site: safeUrl(cfg.studio.siteUrl) ? esc(cfg.studio.siteUrl) : 'this website',
  };
}

const PAGES = {
  privacy: {
    title: 'Privacy Policy',
    description: 'How the SoggyByte Games website handles personal data.',
    body: (f) => `
<p class="legal__lede">This policy explains what personal data is processed when you visit ${f.site}, why, and what rights you have. We have built this website to collect as little as possible.</p>

<h2 id="who-we-are">1. Who is responsible</h2>
<p>This website is operated by ${f.operator} (“${f.studio}”, “we”, “us”)${f.address}.${f.unregistered} For the purposes of the Turkish Personal Data Protection Law No. 6698 (“KVKK”) and, where it applies, the EU/UK General Data Protection Regulation (“GDPR”), we act as the data controllers for the processing described here.</p>
<p>You can reach us about privacy at ${f.contact}.</p>

<h2 id="what-we-collect">2. What this website does and does not do</h2>
<ul>
  <li><strong>No accounts, forms or newsletters.</strong> The website has no sign-up, login or contact form.</li>
  <li><strong>No analytics or advertising.</strong> We do not use analytics tools, advertising networks, tracking pixels or fingerprinting.</li>
  <li><strong>No cookies from our code.</strong> Our website code does not set cookies or store information in your browser. See the <a href="../cookies/">Cookie Policy</a>.</li>
  <li><strong>No third-party embeds.</strong> Fonts, images and scripts are served from our own website. Links to social networks are plain links; nothing from those services loads until you click.</li>
</ul>

<h2 id="server-logs">3. Technical data processed by our hosting provider</h2>
<p>Like every website, ours is delivered by a hosting provider: ${f.host}. When your browser requests a page, the provider’s servers necessarily receive technical information such as your IP address, the date and time of the request, the page requested, and your browser’s user-agent string. This is required to deliver the website and to keep it secure (for example, to detect and block abuse).</p>
<p>We do not use this data to identify you or build a profile. GitHub records visitors’ IP addresses for security purposes and processes this data under its own terms, described in the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub General Privacy Statement</a>.</p>
<p><strong>Legal basis:</strong> our legitimate interest in operating a secure website (KVKK Art. 5(2)(f); GDPR Art. 6(1)(f)).</p>
<p><strong>International transfer:</strong> GitHub, Inc. is based in the United States, so this technical data is processed outside Türkiye. ${tbc('transfer mechanism relied on under KVKK Art. 9')}</p>

<h2 id="email">4. When you email us</h2>
<p>If you contact us by email, we receive your email address, name (if included) and the contents of your message. We use this only to read and reply to you, and we delete messages once we no longer need them for that purpose. Your email is received and stored by our email service provider, ${f.mail}, which may process it on servers outside Türkiye. ${tbc('transfer basis for email data under KVKK Art. 9')}</p>
<p><strong>Legal basis:</strong> processing necessary to respond to your request (KVKK Art. 5(2)(c) and (f); GDPR Art. 6(1)(b) and (f)).</p>

<h2 id="links">5. Links to other websites</h2>
<p>Our website links to external services such as YouTube, Instagram, LinkedIn and Steam. Once you follow a link, the privacy policy of that service applies. We do not control and are not responsible for their data practices.</p>

<h2 id="rights">6. Your rights</h2>
<p>Under KVKK Article 11 you have the right to learn whether your personal data is processed, request information about it, learn the purpose of processing, know the third parties to whom it is transferred, request correction or deletion, object to outcomes of exclusively automated analysis, and claim compensation for damage arising from unlawful processing. Where the GDPR applies, you also have the rights of access, rectification, erasure, restriction, data portability and objection, and the right to lodge a complaint with your local supervisory authority.</p>
<p>To exercise these rights, contact us at ${f.contact}. In Türkiye you may also apply to the Personal Data Protection Authority (KVKK).</p>

<h2 id="children">7. Children</h2>
<p>This website is a general-audience studio website. We do not knowingly collect personal data from children.</p>

<h2 id="changes">8. Changes</h2>
<p>If the website starts doing something new with personal data — for example, adding analytics or a contact form — we will update this policy before that change goes live.</p>
<p class="legal__date">Effective date: ${f.effective}</p>`,
  },

  terms: {
    title: 'Terms of Use',
    description: 'The terms that apply when you use the SoggyByte Games website.',
    body: (f) => `
<p class="legal__lede">These terms apply to your use of ${f.site}, operated by ${f.operator} (“${f.studio}”, “we”, “us”).${f.unregistered} By using the website you agree to them. If you do not agree, please do not use the website.</p>

<h2 id="purpose">1. What this website is</h2>
<p>This website presents our studio and our games for information only. It does not sell products, and nothing on it is an offer to enter into a contract. Purchases of our games, when available, take place on third-party stores under their own terms.</p>

<h2 id="content">2. Our content</h2>
<p>All content on this website — including our name, logos, game titles, artwork, screenshots, video, audio, text and design — belongs to ${f.owner} or is used with permission, and is protected by intellectual property laws. Viewing it does not give you any licence to use it. Please read our <a href="../intellectual-property/">Intellectual Property &amp; Copyright Notice</a> for details.</p>

<h2 id="acceptable-use">3. Acceptable use</h2>
<p>You agree not to:</p>
<ul>
  <li>copy, reproduce, redistribute, sell or create derivative works from our content, except as allowed by law or with our written permission;</li>
  <li>interfere with the website’s operation or security, attempt to gain unauthorised access to it or its systems, or overload it with automated requests;</li>
  <li>use the website for any unlawful purpose or in a way that infringes the rights of others;</li>
  <li>present yourself as affiliated with or endorsed by ${f.studio} when you are not.</li>
</ul>

<h2 id="information">4. Information on the website</h2>
<p>We try to keep the website accurate, but information about games in development — including features, platforms and timing — can change. Nothing on the website is a promise that a game or feature will be released in a particular form or on a particular date.</p>

<h2 id="external">5. External links</h2>
<p>The website contains links to third-party websites and services, such as social networks and game stores. We are not responsible for their content, availability or practices.</p>

<h2 id="liability">6. Availability and liability</h2>
<p>The website is provided “as is” and “as available”. We may change, suspend or discontinue it at any time. To the extent permitted by applicable law, we are not liable for indirect or consequential loss arising from your use of the website. Nothing in these terms limits liability that cannot be limited under applicable law, including mandatory consumer protection rules.</p>

<h2 id="law">7. Governing law</h2>
<p>These terms are governed by the laws of ${f.law}. The ${f.courts} have jurisdiction over any dispute arising from them. This does not affect mandatory rules that allow consumers to bring proceedings in the courts or consumer arbitration committees where they live.</p>

<h2 id="changes">8. Changes and contact</h2>
<p>We may update these terms from time to time. The version published on this page applies from its effective date. Questions: ${f.contact}.</p>
<p class="legal__date">Effective date: ${f.effective}</p>`,
  },

  'intellectual-property': {
    title: 'Intellectual Property & Copyright Notice',
    description: 'Ownership of SoggyByte Games content, and how to report an IP concern.',
    body: (f) => `
<p class="legal__lede">${f.studio} creates original games and creative work. This notice explains what we own, what you may and may not do with it, and how to contact us about intellectual property.</p>

<h2 id="ownership">1. What is protected</h2>
<p>Unless stated otherwise, the following are owned by ${f.owner} or used under licence, and are protected by copyright and other intellectual property laws:</p>
<ul>
  <li>the ${f.studio} name, logos and brand assets;</li>
  <li>the names and logos of our games, including DoNOTSpill;</li>
  <li>artwork, illustrations, screenshots, video, animation, music and sound;</li>
  <li>the text, design, layout and original code of this website.</li>
</ul>
<p>Our names and logos may be protected as unregistered marks or by other applicable laws, whether or not they are registered. Third-party names and marks referred to on this website, such as Steam, YouTube, Instagram and LinkedIn, belong to their respective owners and are used only to identify those services.</p>

<h2 id="no-licence">2. No licence by display</h2>
<p>Showing material on this website does not grant you any licence or right to use it. Except where the law expressly allows it, you may not reproduce, redistribute, publish, modify, sell, use commercially or create derivative works from our material without our prior written permission.</p>

<h2 id="press">3. Press and creators</h2>
<p>If you would like to cover our games or use our material in a review, article or video, please contact us first at ${f.legalContact}. We are happy to help and may provide approved assets.</p>

<h2 id="ideas">4. A note on ideas</h2>
<p>Copyright protects the specific expression of a work — its art, code, audio, text and other concrete material — rather than general ideas, genres or game mechanics in the abstract. We protect our expression and our confidential, unreleased material, and we keep records of our original work.</p>

<h2 id="report">5. Reporting a concern</h2>
<p>If you believe content on this website infringes your rights, or that someone is infringing ours, please email ${f.legalContact} with:</p>
<ul>
  <li>your name and contact details;</li>
  <li>a description of the work or right concerned;</li>
  <li>where the material can be found (for example, a URL);</li>
  <li>a statement that the information in your notice is accurate and that you are the rights holder or authorised to act for them.</li>
</ul>
<p>We will review genuine notices promptly and respond.</p>

<h2 id="copyright">6. Copyright line</h2>
<p>© <span data-year>${new Date().getFullYear()}</span> ${f.studio}. All rights reserved.</p>
<p class="legal__date">Effective date: ${f.effective}</p>`,
  },

  cookies: {
    title: 'Cookie Policy',
    description: 'Cookies and similar technologies on the SoggyByte Games website.',
    body: (f) => `
<p class="legal__lede">Short version: this website does not use cookies. That is why you do not see a cookie banner.</p>

<h2 id="what">1. What cookies are</h2>
<p>Cookies are small text files that a website can store in your browser. Similar technologies include local storage, tracking pixels and device fingerprinting.</p>

<h2 id="ours">2. What we use</h2>
<p>Our website code does not set any cookies and does not use local storage, session storage, tracking pixels or fingerprinting. We do not use analytics, advertising or social media plugins, and we do not embed third-party content that could set cookies.</p>
<p>Our hosting provider (${f.host}) delivers the website’s files. ${tbc('confirm that the hosting provider sets no cookies on this domain')}</p>

<h2 id="links">3. External links</h2>
<p>When you follow a link to another website, such as YouTube, Instagram, LinkedIn or Steam, that website may set its own cookies under its own policy.</p>

<h2 id="changes">4. Changes</h2>
<p>If we ever introduce cookies or similar technologies that are not strictly necessary, we will ask for your consent before using them and update this policy first.</p>
<p>Questions: ${f.contact}.</p>
<p class="legal__date">Effective date: ${f.effective}</p>`,
  },
};

export function legalMeta(slug) {
  const p = PAGES[slug];
  return { title: p.title, description: p.description, path: `/${slug}/` };
}

export function legalPage(cfg, base, slug) {
  const page = PAGES[slug];
  const f = facts(cfg);
  const others = LEGAL_PAGES.map(
    (l) =>
      `<li><a class="legal-nav__link${l.slug === slug ? ' is-current' : ''}" href="${base}${l.slug}/"${
        l.slug === slug ? ' aria-current="page"' : ''
      }>${l.label}</a></li>`,
  ).join('');
  const draft = cfg.legal.draft
    ? `<div class="legal__draft" role="note"><strong>Draft — not yet reviewed.</strong> This page is a working draft prepared for legal review. Highlighted items still need to be confirmed.</div>`
    : '';
  return `<article class="legal" aria-labelledby="legal-title">
  <header class="legal__head">
    <p class="kicker"><span class="kicker__num">§</span> Legal</p>
    <h1 class="legal__title" id="legal-title">${page.title}</h1>
  </header>
  <div class="legal__layout">
    <nav class="legal-nav" aria-label="Legal pages"><ul>${others}</ul></nav>
    <div class="legal__body prose">
      ${draft}
      ${page.body(f)}
    </div>
  </div>
</article>`;
}
