/**
 * Convert remaining pages + resident profiles to Atelier style.
 * Run after: node tools/build-v6.js --root
 */
const fs = require('fs');
const path = require('path');
const { shell, escapeHtml } = require('./atelier-lib');

const root = path.join(__dirname, '..');
const people = JSON.parse(fs.readFileSync(path.join(root, 'tools', 'people.json'), 'utf8'));

const MAIN_DONE = new Set([
  'index.html', 'about.html', 'team.html', 'residents.html', 'blog.html',
  'ecosystem.html', 'events.html', 'contacts.html', 'visit.html', 'faq.html',
  'partnership.html', 'privacy.html', 'terms.html', 'thank-you.html',
  'networking.html', 'cases.html', 'lifhaki.html', 'events-archive.html', 'founder.html',
]);

function qaFor(p) {
  const company = p.company || 'бизнес';
  const first = (p.name || '').split(' ')[0] || 'резидента';
  return [
    { q: 'Чем вы занимаетесь?', a: `${p.name} — ${(p.position || 'резидент').toLowerCase()} в сфере «${company}». ${p.description || ''}` },
    { q: 'Что даёт клуб «Деловая жизнь»?', a: `Сообщество предпринимателей Пермского края — окружение, где можно быстро найти партнёра или поддержку. Для ${first} клуб — инструмент роста и нетворкинга.` },
    { q: 'Почему «Покупай у своих» важен?', a: 'Когда резиденты выбирают товары и услуги друг друга, деньги остаются внутри сообщества и растёт доверие.' },
    { q: 'Кому рекомендуете гостевой визит?', a: 'Действующим предпринимателям и руководителям, готовым к партнёрству и участию в жизни клуба.' },
  ];
}

function writeProfiles() {
  let n = 0;
  for (const p of people) {
    const photo = p.localPhoto
      ? `<img src="${p.localPhoto}" alt="${escapeHtml(p.name)}" data-parallax>`
      : `<div class="photo-zone">Фото</div>`;
    const qa = qaFor(p)
      .map(
        (item) => `<article class="qa-item tilt-card" data-reveal>
            <h3>${escapeHtml(item.q)}</h3>
            <p>${escapeHtml(item.a)}</p>
          </article>`
      )
      .join('\n          ');

    const body = `
    <section class="page-hero" data-bg="people">
      <div class="container">
        <nav class="crumbs" data-reveal>
          <a href="index.html">Главная</a><span>/</span>
          <a href="residents.html">Резиденты</a><span>/</span>
          <em>${escapeHtml(p.name)}</em>
        </nav>
        <p class="eyebrow">${p.vip ? 'VIP-резидент' : 'Резидент'}</p>
        <h1 class="page-hero__title">${escapeHtml(p.name)}</h1>
        <p class="page-hero__text">${escapeHtml(p.position || '')}${p.company ? ' · ' + escapeHtml(p.company) : ''}</p>
      </div>
    </section>
    <section class="section" style="padding-top:10px" data-bg="eco">
      <div class="container profile-grid">
        <div class="profile-photo mouse-dots tilt-card" data-reveal>
          <div class="mouse-dots__canvas" aria-hidden="true"></div>
          ${photo}
        </div>
        <div class="prose" data-reveal>
          <h2>О резиденте</h2>
          <p>${escapeHtml(p.description || '')}</p>
          <a class="btn btn--fill" href="visit.html" style="margin-top:12px" data-cta="profile_visit">Гостевой визит</a>
          <a class="btn btn--line" href="residents.html" style="margin-left:8px">Все резиденты</a>
          <div data-share style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"></div>
        </div>
      </div>
    </section>
    <section class="section section--sand" data-bg="quotes">
      <div class="container">
        <p class="eyebrow" data-reveal>Интервью</p>
        <h2 class="section-title" data-split style="margin-bottom:28px">Вопросы и ответы</h2>
        <div class="qa-grid" data-reveal-stagger>
          ${qa}
        </div>
      </div>
    </section>`;

    const html = shell({
      title: `${p.name} — Деловая жизнь`,
      description: (p.description || `${p.position}, ${p.company}`).slice(0, 160),
      active: 'residents',
      page: 'residents',
      body,
    });
    fs.writeFileSync(path.join(root, p.page), html, 'utf8');
    n++;
  }
  console.log('Profiles:', n);
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1].trim() : '';
}
function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].replace(/\s+/g, ' ').trim() : 'Деловая жизнь';
}
function extractDesc(html) {
  const m = html.match(/name="description"\s+content="([^"]*)"/i);
  return m ? m[1] : 'Бизнес-клуб Деловая жизнь';
}
function guessActive(name) {
  if (/^event|events-archive/.test(name)) return 'events';
  if (/^article|cases|lifhaki|networking|blog/.test(name)) return 'blog';
  if (/founder|team/.test(name)) return 'team';
  if (/resident|petrov|ivanova|kozlov/.test(name)) return 'residents';
  return 'index';
}

function convertLegacy() {
  const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
  let n = 0;
  for (const file of files) {
    if (MAIN_DONE.has(file)) continue;
    if (people.some((p) => p.page === file)) continue; // profiles handled separately

    const full = path.join(root, file);
    const raw = fs.readFileSync(full, 'utf8');

    const title = extractTitle(raw);
    const description = extractDesc(raw);
    let main = extractMain(raw);
    if (!main) {
      console.warn('skip (no main):', file);
      continue;
    }

    // Strip chrome leftovers / keep only inner content for re-shell
    main = main
      .replace(/class="header[^"]*"/g, '')
      .replace(/id="header"/g, '');

    const active = guessActive(file);
    const page =
      active === 'events' ? 'events' : active === 'blog' ? 'blog' : active === 'residents' ? 'residents' : 'page';

    let body;
    if (/class="page-hero"/.test(main) || /class="section"/.test(main)) {
      // Already Atelier structure — refresh shell + ambient attrs
      body = main
        .replace(/<section class="page-hero"(?![^>]*data-bg)/g, '<section class="page-hero" data-bg="news"')
        .replace(/<section class="section"(?![^>]*data-bg)/g, '<section class="section" data-bg="grid"');
    } else {
      body = `
    <section class="page-hero" data-bg="news">
      <div class="container">
        <p class="eyebrow" data-reveal>Деловая жизнь</p>
        <h1 class="page-hero__title">${escapeHtml(title.replace(/ — Деловая жизнь$/, ''))}</h1>
      </div>
    </section>
    <section class="section" style="padding-top:8px" data-bg="grid">
      <div class="container content-legacy" data-reveal>
        ${main}
      </div>
    </section>`;
    }

    const html = shell({
      title,
      description,
      active,
      page,
      body,
    });
    fs.writeFileSync(full, html, 'utf8');
    n++;
  }
  console.log('Legacy converted:', n);
}

function write404() {
  const body = `
    <section class="page-hero" data-bg="cta" style="min-height:60vh;display:flex;align-items:center">
      <div class="container" style="text-align:center;width:100%">
        <p class="eyebrow">Ошибка</p>
        <h1 class="page-hero__title">Страница не найдена</h1>
        <p class="page-hero__text" style="margin:0 auto 24px">Возможно, ссылка устарела. Вернитесь на главную или к резидентам.</p>
        <a class="btn btn--fill" href="index.html">На главную</a>
        <a class="btn btn--line" href="residents.html" style="margin-left:8px">Резиденты</a>
      </div>
    </section>`;
  fs.writeFileSync(
    path.join(root, '404.html'),
    shell({ title: '404 — Деловая жизнь', description: 'Страница не найдена', active: 'index', page: 'index', body, robots: 'noindex' }),
    'utf8'
  );
  console.log('404 written');
}

writeProfiles();
convertLegacy();
write404();
console.log('Atelier rest done');
