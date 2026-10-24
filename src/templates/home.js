import { lockupSvg, markSvg } from './logo.js';
import {
  esc,
  safeUrl,
  socialLinks,
  extAttrs,
  externalIcon,
  arrowIcon,
  lockIcon,
} from './util.js';

const pad = (n) => String(n).padStart(2, '0');

function hero(cfg) {
  const game = cfg.games[0];
  return `<section class="hero" id="top" aria-labelledby="hero-title" data-hero>
  <canvas class="hero__liquid" aria-hidden="true" data-liquid></canvas>
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="hero__inner">
    <h1 class="hero__title" id="hero-title">
      <span class="visually-hidden">${esc(cfg.studio.name)}</span>
      ${lockupSvg({ className: 'hero__lockup' })}
    </h1>
  </div>
  <div class="hero__foot">
    <p class="hero__kicker" data-hero-fade>Game studio <span class="hero__dash" aria-hidden="true"></span> Now developing <em>${esc(game.title)}</em></p>
    <a class="btn btn--light" href="#games" data-hero-fade>
      <span class="btn__fill" aria-hidden="true"></span>
      <span class="btn__label">Explore our games</span>${arrowIcon}
    </a>
    <p class="hero__scroll" aria-hidden="true" data-hero-fade><span>Scroll</span><i class="hero__drop"></i></p>
  </div>
</section>`;
}

/** Ink drips that run from the section above into the next one (drawn by JS). */
const drips = (variant) =>
  `<div class="drips drips--${variant}" aria-hidden="true" data-drips="${variant}"><svg preserveAspectRatio="none"><path/></svg></div>`;

/** Small fact list under the Studio copy (only facts set in the config). */
function facts(cfg) {
  const rows = [];
  if (cfg.studio.founded) {
    const d = new Date(`${cfg.studio.founded}T12:00:00Z`);
    const label = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
    rows.push(`<div><dt>Founded</dt><dd><time datetime="${esc(cfg.studio.founded)}">${label}</time></dd></div>`);
  }
  if (cfg.studio.location) rows.push(`<div><dt>Based in</dt><dd>${esc(cfg.studio.location)}</dd></div>`);
  if (cfg.games[0]) rows.push(`<div><dt>Now making</dt><dd>${esc(cfg.games[0].title)}</dd></div>`);
  return rows.length ? `<dl class="about__facts" data-reveal>${rows.join('')}</dl>` : '';
}

function about(cfg) {
  const game = cfg.games[0];
  return `<section class="about" id="studio" aria-labelledby="about-title">
  ${drips('ink')}
  <div class="about__ghost" aria-hidden="true" data-parallax="-0.18">${markSvg()}</div>
  <div class="container about__grid">
    <p class="kicker" data-reveal><span class="kicker__num">01</span> The Studio</p>
    <h2 class="about__title" id="about-title">
      <span class="fill-line" data-fill>Games made</span>
      <span class="fill-line" data-fill>with steady hands</span>
      <span class="fill-line" data-fill>and soggy bytes.</span>
    </h2>
    <div class="about__body">
      <p data-reveal>${esc(cfg.studio.name)} is a game studio built around one idea: the best moments in games are the ones you feel in your hands.</p>
      <p data-reveal>We care about feel. Timing, weight and the half-second before everything goes wrong. Our current project, <a class="inline-link" href="#games">${esc(game.title)}</a>, puts all of that on the back of a scooter.</p>
      ${facts(cfg)}
    </div>
  </div>
  ${team(cfg)}
</section>`;
}

/** Team portraits, shown inside the Studio section. Captions appear once names are set. */
function team(cfg) {
  if (!cfg.team.length) return '';
  const people = cfg.team
    .map((m, i) => {
      const links = (m.links || [])
        .map((l) => ({ ...l, url: safeUrl(l.url) }))
        .filter((l) => l.url)
        .map(
          (l) =>
            `<li><a class="footer-link" href="${esc(l.url)}" ${extAttrs}>${esc(l.label)}${externalIcon}<span class="visually-hidden"> (opens in a new tab)</span></a></li>`,
        )
        .join('');
      const alt = m.name
        ? `Portrait of ${m.name}`
        : `Portrait of a member of the ${cfg.studio.name} team`;
      const portrait = m.portrait
        ? `<img src="/${esc(m.portrait)}" alt="${esc(alt)}" loading="lazy" decoding="async" width="720" height="900" />`
        : '';
      const caption =
        m.name || links
          ? `<figcaption class="crew__caption">
            ${m.name ? `<span class="crew__name">${esc(m.name)}</span>` : ''}
            ${m.role ? `<span class="crew__role">${esc(m.role)}</span>` : ''}
            ${links ? `<ul class="crew__links">${links}</ul>` : ''}
          </figcaption>`
          : '';
      return `<li class="crew__member" data-reveal data-drift="${i % 2 ? 0.12 : -0.06}">
        <figure class="crew__figure">
          <div class="crew__portrait crew__portrait--${(i % 3) + 1}">${portrait}</div>
          ${caption}
        </figure>
      </li>`;
    })
    .join('');
  return `<div class="container crew" id="team">
    <div class="crew__head">
      <p class="kicker" data-reveal>The Team</p>
      <h3 class="crew__title" data-reveal>The people behind the&nbsp;mess.</h3>
    </div>
    <ul class="crew__list crew__list--${Math.min(cfg.team.length, 3)}">${people}</ul>
  </div>`;
}

function steamCta(game) {
  const url = safeUrl(game.steamUrl);
  if (url) {
    return `<a class="steam steam--live" href="${esc(url)}" ${extAttrs}>
      <span class="steam__label">Steam</span>
      <span class="steam__state">View ${esc(game.title)} on Steam${externalIcon}</span>
      <span class="visually-hidden"> (opens in a new tab)</span>
    </a>`;
  }
  // Locked state: deliberately not a link or a button, so it can never be activated.
  return `<div class="steam steam--locked" data-steam-locked>
      <p class="visually-hidden">${esc(game.title)} on Steam: coming soon. The store page is not available yet.</p>
      <div class="steam__inner" aria-hidden="true">
        <span class="steam__label">Steam</span>
        <span class="steam__state">${lockIcon}Store page</span>
        <span class="steam__blur">${esc(game.title)}</span>
      </div>
      <div class="steam__tape" aria-hidden="true">
        <div class="steam__tape-track" data-tape>${'<span>Coming soon</span>'.repeat(8)}</div>
      </div>
    </div>`;
}

function gameMedia(game) {
  const m = game.media || {};
  if (m.trailerMp4) {
    return `<figure class="game__media" data-reveal>
      <video controls preload="none" playsinline ${m.trailerPoster ? `poster="/${esc(m.trailerPoster)}"` : ''}>
        <source src="/${esc(m.trailerMp4)}" type="video/mp4" />
      </video>
    </figure>`;
  }
  if (m.keyArt) {
    return `<figure class="game__media" data-reveal>
      <img src="/${esc(m.keyArt)}" alt="${esc(m.keyArtAlt || `${game.title} key art`)}" loading="lazy" decoding="async" />
    </figure>`;
  }
  return '';
}

function games(cfg) {
  const game = cfg.games[0];
  const [a, b, c] = game.titleParts || [game.title];
  const shots = (game.media?.screenshots || [])
    .map(
      (s) =>
        `<figure class="game__shot" data-reveal><img src="/${esc(s.src)}" alt="${esc(s.alt)}" loading="lazy" decoding="async" /></figure>`,
    )
    .join('');
  return `<section class="games" id="games" aria-labelledby="games-title">
  <div class="surface" aria-hidden="true" data-surface><svg preserveAspectRatio="none"><path/></svg></div>
  <div class="container games__head">
    <p class="kicker" data-reveal><span class="kicker__num">02</span> Our Games</p>
    <h2 class="section-title" id="games-title" data-reveal>What we're pouring ourselves into.</h2>
    <p class="games__count" data-reveal>${pad(cfg.games.length)} ${cfg.games.length === 1 ? 'project' : 'projects'}</p>
  </div>

  <article class="game" aria-labelledby="game-${esc(game.slug)}" data-game>
    <div class="game__stage" data-game-stage>
      <div class="game__titles">
        <p class="game__index"><span aria-hidden="true">P—01</span>${game.genre ? `<span class="game__genre">${esc(game.genre)}</span>` : ''}</p>
        <h3 class="game__title" id="game-${esc(game.slug)}" aria-label="${esc(game.title)}">
          <span class="game__word" aria-hidden="true" data-word>${esc(a)}</span>
          ${b ? `<span class="game__word game__word--accent" aria-hidden="true" data-word>${esc(b)}</span>` : ''}
          ${c ? `<span class="game__word" aria-hidden="true" data-word>${esc(c)}</span>` : ''}
        </h3>
        <p class="game__tagline" data-game-tagline>${esc(game.tagline)}</p>
      </div>
      <div class="game__vessel" data-vessel-wrap>
        <canvas class="vessel" data-vessel role="img" aria-label="Illustration: a burger sliding towards the edge of a tilting delivery box, never quite falling out."></canvas>
      </div>
    </div>

    <div class="container game__details">
      <p class="game__summary" data-reveal>${esc(game.summary)}</p>
      <dl class="game__meta">
        ${game.genre ? `<div data-reveal><dt>Genre</dt><dd>Co-op delivery</dd></div>` : ''}
        ${game.players ? `<div data-reveal><dt>Players</dt><dd>${esc(game.players)}</dd></div>` : ''}
        <div data-reveal><dt>Status</dt><dd><span class="pulse" aria-hidden="true"></span>${esc(game.status)}</dd></div>
        <div data-reveal><dt>Platform</dt><dd>${esc(game.platforms.join(', '))}</dd></div>
        <div data-reveal><dt>Store</dt><dd>${safeUrl(game.steamUrl) ? 'Steam' : 'Steam · Coming soon'}</dd></div>
      </dl>
      <div class="game__cta" data-reveal>${steamCta(game)}</div>
    </div>
    ${gameMedia(game)}
    ${shots ? `<div class="container game__shots">${shots}</div>` : ''}
  </article>
</section>`;
}

function news(cfg) {
  if (!cfg.news.length) return '';
  const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const items = [...cfg.news]
    .sort((x, y) => (x.date < y.date ? 1 : -1))
    .map((n) => {
      const url = safeUrl(n.url);
      const inner = `<time datetime="${esc(n.date)}">${esc(fmt.format(new Date(n.date)))}</time>
        <h3 class="news__title">${esc(n.title)}</h3>
        <p class="news__summary">${esc(n.summary)}</p>`;
      return `<li class="news__item" data-reveal>${
        url
          ? `<a class="news__link" href="${esc(url)}" ${extAttrs}>${inner}${externalIcon}<span class="visually-hidden"> (opens in a new tab)</span></a>`
          : `<div class="news__link">${inner}</div>`
      }</li>`;
    })
    .join('');
  return `<section class="news" id="news" aria-labelledby="news-title">
  <div class="container">
    <p class="kicker" data-reveal><span class="kicker__num">—</span> Studio Updates</p>
    <h2 class="section-title" id="news-title" data-reveal>Fresh from the studio.</h2>
    <ul class="news__list">${items}</ul>
  </div>
</section>`;
}

function contact(cfg) {
  const email = cfg.contact.email?.trim();
  const socials = socialLinks(cfg);
  const rows = [];
  if (email) {
    rows.push(`<li><a class="contact-row" href="mailto:${esc(email)}">
      <span class="contact-row__fill" aria-hidden="true"></span>
      <span class="contact-row__label">Email</span>
      <span class="contact-row__value contact-row__value--email">${esc(email)}</span>${arrowIcon}
    </a></li>`);
  }
  for (const s of socials) {
    rows.push(`<li><a class="contact-row" href="${esc(s.url)}" ${extAttrs}>
      <span class="contact-row__fill" aria-hidden="true"></span>
      <span class="contact-row__label">${s.label}</span>
      <span class="contact-row__value">Follow ${esc(cfg.studio.shortName)}<span class="visually-hidden"> on ${s.label} (opens in a new tab)</span></span>${externalIcon}
    </a></li>`);
  }
  const list = rows.length
    ? `<ul class="contact__list">${rows.join('')}</ul>`
    : `<p class="contact__pending" data-reveal>Our contact channels are being set up and will be listed here shortly.</p>`;
  return `<section class="contact" id="contact" aria-labelledby="contact-title">
  ${drips('ink-2')}
  <div class="container contact__grid">
    <p class="kicker" data-reveal><span class="kicker__num">03</span> Contact</p>
    <h2 class="contact__title" id="contact-title">
      <span class="fill-line" data-fill>Got something</span>
      <span class="fill-line" data-fill>to spill?</span>
    </h2>
    <p class="contact__lede" data-reveal>Press, partnerships, or just a hello. We'd love to hear from you.</p>
    ${list}
  </div>
</section>`;
}

export function home(cfg) {
  return [hero(cfg), about(cfg), games(cfg), news(cfg), contact(cfg)].join('\n');
}
