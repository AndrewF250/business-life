/**
 * Full rebuild: clean slugs, all resident cards+profiles, atmosphere photos,
 * remove preloader, face-centered CSS, SEO/contact updates, link renames.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const root = path.join(__dirname, '..');
const peoplePath = path.join(__dirname, 'people.json');
let people = JSON.parse(fs.readFileSync(peoplePath, 'utf8'));

const MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
};

function slugify(name) {
  return name
    .toLowerCase()
    .split('')
    .map((ch) => (MAP[ch] !== undefined ? MAP[ch] : /[a-z0-9]/.test(ch) ? ch : '-'))
    .join('')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) return resolve(dest);
    const file = fs.createWriteStream(dest);
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        try { fs.unlinkSync(dest); } catch (_) {}
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch (_) {}
        return reject(new Error('HTTP ' + res.statusCode));
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    });
    req.on('error', (e) => {
      try { fs.unlinkSync(dest); } catch (_) {}
      reject(e);
    });
  });
}

// --- Clean people slugs / rename photos ---
const imgDir = path.join(root, 'assets', 'images', 'residents');
const atmDir = path.join(root, 'assets', 'images', 'atmosphere');
fs.mkdirSync(atmDir, { recursive: true });

for (const p of people) {
  const clean = slugify(p.name);
  const oldLocal = p.localPhoto;
  const ext = oldLocal && fs.existsSync(path.join(root, oldLocal))
    ? path.extname(oldLocal)
    : (p.photoUrl.match(/\.(jpe?g|png|webp)/i) || ['.jpg'])[0].toLowerCase();
  const newRel = `assets/images/residents/${clean}${ext}`;
  const newAbs = path.join(root, newRel);
  if (oldLocal) {
    const oldAbs = path.join(root, oldLocal);
    if (fs.existsSync(oldAbs) && oldAbs !== newAbs) {
      try {
        if (!fs.existsSync(newAbs)) fs.renameSync(oldAbs, newAbs);
        else if (oldAbs !== newAbs) fs.unlinkSync(oldAbs);
      } catch (_) {
        try { fs.copyFileSync(oldAbs, newAbs); } catch (__) {}
      }
    }
  }
  p.slug = clean;
  p.localPhoto = fs.existsSync(newAbs) ? newRel : (oldLocal || '');
  p.page = `${clean}.html`;
}

// Deduplicate by name
const uniq = [];
const seen = new Set();
for (const p of people) {
  const k = p.name.toLowerCase();
  if (seen.has(k)) continue;
  seen.add(k);
  uniq.push(p);
}
people = uniq;
fs.writeFileSync(peoplePath, JSON.stringify(people, null, 2), 'utf8');
console.log('People:', people.length);

// Atmosphere images from delolife (event / group photos — not noroot placeholders)
const ATMOSPHERE = [
  'https://static.tildacdn.com/tild3538-3332-4265-b433-346433366634/0184-ED1T3798.JPG',
  'https://static.tildacdn.com/tild3063-3363-4232-b637-633339653364/IMG_1370.JPEG',
  'https://static.tildacdn.com/tild3232-3762-4664-b465-613662396638/IMG_2350.JPG',
  'https://static.tildacdn.com/tild3433-3333-4165-b931-633336393835/IMG_0376.JPG',
  'https://static.tildacdn.com/tild3565-3239-4563-b238-646535373634/IMG_0132.JPG',
  'https://static.tildacdn.com/tild3532-3134-4431-b738-383436303231/photo_2025-11-12_20-.jpg',
  'https://static.tildacdn.com/tild3334-3861-4962-a361-336562633439/2025-11-24_103742.jpg',
  'https://static.tildacdn.com/tild3832-6561-4839-b161-393166656237/2025-11-24_104921.jpg',
  'https://static.tildacdn.com/tild3265-3332-4534-b764-393330346465/photo_2025-06-15_22-.jpg',
  'https://static.tildacdn.com/tild3465-6162-4438-b936-363332656135/photo_2025-12-13_12-.jpg',
  'https://static.tildacdn.com/tild3530-3537-4631-b131-623563393663/photo_2025-12-29_22-.jpg',
  'https://static.tildacdn.com/tild3633-3833-4330-b033-363937353338/photo_2025-12-30_12-.jpg',
  // VK community photos
  'https://sun3-8.vkuserphoto.ru/impg/BVI0Sca-W68KWKTthXnKCql5XFuq418o6gjiaQ/G1sOf1HdrIc.jpg',
  'https://sun9-57.vkuserphoto.ru/impg/0ZrF-ECbSWkdwdel4nvSi6LvxnUtGO1B0rT5XA/a4AiEJcNSEA.jpg',
  'https://sun3-22.vkuserphoto.ru/impg/I2GAghcb07mdf33BoPFo9GTJDHFuV1p250A9Ag/GxdD5WmAR7E.jpg',
  'https://sun9-9.vkuserphoto.ru/impg/Dwbfu6mMmFasi_kj2L82MSDqrCgn0GtmsTLNiQ/ICElA5objRU.jpg',
  'https://sun3-6.vkuserphoto.ru/impg/IJWZWi1w-ekI_HpQYsQ97a2BFGfUSL8PxH18qA/O_EZYq0dg40.jpg',
  'https://sun9-64.vkuserphoto.ru/impg/VqcWLY5T7PO3CszqAnQata9M3B4U2Klbu4jzyQ/2NlmFCSDS30.jpg',
  'https://sun9-84.vkuserphoto.ru/impg/P7OMjXl-uT8Vjyw2FSQo4kw0dHJ2fNF3Fhmwdw/9UV6t1Q1fsE.jpg'
];

async function downloadAtmosphere() {
  const out = [];
  for (let i = 0; i < ATMOSPHERE.length; i++) {
    const url = ATMOSPHERE[i];
    const ext = (url.match(/\.(jpe?g|png|webp)/i) || ['.jpg'])[0].toLowerCase();
    const dest = path.join(atmDir, `atm-${String(i + 1).padStart(2, '0')}${ext}`);
    try {
      await download(url, dest);
      out.push(`assets/images/atmosphere/${path.basename(dest)}`);
      console.log('ATM OK', path.basename(dest));
    } catch (e) {
      console.log('ATM FAIL', e.message);
    }
  }
  return out;
}

function qaFor(p) {
  const company = p.company || 'бизнеса';
  return [
    {
      q: 'Чем вы занимаетесь?',
      a: `${p.name} — ${p.position.toLowerCase()} в сфере «${company}». ${p.description}`
    },
    {
      q: 'Что даёт клуб «Деловая жизнь»?',
      a: `Сообщество предпринимателей Пермского края — это окружение, в котором можно быстро найти партнёра, эксперта или поддержку. Для ${p.name.split(' ')[0]} клуб — рабочий инструмент роста и нетворкинга.`
    },
    {
      q: 'Почему «Покупай у своих» важен?',
      a: 'Когда резиденты выбирают товары и услуги друг друга, деньги остаются внутри сообщества, растёт доверие и появляются долгосрочные сделки.'
    },
    {
      q: 'Кому рекомендуете гостевой визит?',
      a: 'Действующим предпринимателям и руководителям, которые готовы к открытому диалогу, партнёрству и регулярному участию в жизни клуба.'
    }
  ];
}

function profileTemplate(p) {
  const qa = qaFor(p)
    .map(
      (item) => `          <div class="resident-qa__item">
            <div class="resident-qa__question">${escapeHtml(item.q)}</div>
            <p class="resident-qa__answer">${escapeHtml(item.a)}</p>
          </div>`
    )
    .join('\n');
  const photo = p.localPhoto
    ? `<img src="${p.localPhoto}" alt="${escapeHtml(p.name)}" class="resident-photo">`
    : `<div class="photo-zone"><span class="photo-zone__label">[Фото]</span></div>`;
  const title = `${p.name} — Деловая жизнь`;
  const desc = escapeHtml((p.description || `${p.position}, ${p.company}`).slice(0, 160));
  const url = `https://andrewf250.github.io/business-life/${p.page}`;
  const ogImg = p.localPhoto
    ? `https://andrewf250.github.io/business-life/${p.localPhoto}`
    : 'https://andrewf250.github.io/business-life/assets/images/og-default.png';

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:site_name" content="Деловая жизнь">
  <meta property="og:image" content="${ogImg}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${ogImg}">
  <script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: p.name,
  jobTitle: p.position,
  worksFor: { '@type': 'Organization', name: p.company },
  description: p.description,
  image: ogImg,
  url
}, null, 2)}
  </script>
  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
  <script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
  <link rel="stylesheet" href="css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="header" id="header">
    <div class="header__container">
      <a href="index.html" class="header__logo">ДЕЛОВАЯ ЖИЗНЬ</a>
      <nav class="header__nav" id="nav">
        <a href="about.html" class="header__link">О клубе</a>
        <a href="team.html" class="header__link">Команда</a>
        <a href="residents.html" class="header__link header__link--active">Резиденты</a>
        <a href="blog.html" class="header__link">Блог</a>
        <a href="ecosystem.html" class="header__link">Экосистема</a>
        <a href="events.html" class="header__link">События</a>
        <a href="contacts.html" class="header__link">Контакты</a>
      </nav>
      <div class="header__actions" id="actions">
        <a href="visit.html" class="btn btn--outline">Гостевой визит</a>
      </div>
      <button class="header__burger" id="burger" aria-label="Меню">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  </header>
  <main>
    <div class="container">
      <nav class="breadcrumb">
        <a href="index.html">Главная</a>
        <span class="breadcrumb__sep">/</span>
        <a href="residents.html">Резиденты</a>
        <span class="breadcrumb__sep">/</span>
        <span class="breadcrumb__current">${escapeHtml(p.name)}</span>
      </nav>
    </div>
    <section class="resident-profile">
      <div class="container">
        <div class="resident-profile__grid">
          <div class="resident-profile__photo">${photo}</div>
          <div class="resident-profile__info">
            <h1 class="resident-profile__name">${escapeHtml(p.name)}</h1>
            <p class="resident-profile__company">${escapeHtml(p.company)}</p>
            <p class="resident-profile__position">${escapeHtml(p.position)}</p>
            <p class="resident-profile__bio">${escapeHtml(p.description)}</p>
            <a href="visit.html" class="btn btn--primary" style="margin-top: var(--space-lg);">Гостевой визит</a>
          </div>
        </div>
      </div>
    </section>
    <section class="resident-qa">
      <div class="container">
        <div class="residents-preview__header">
          <span class="residents-preview__label">Интервью</span>
          <h2 class="residents-preview__title">Вопросы и ответы</h2>
          <div class="section-divider section-divider--center"></div>
        </div>
        <div class="resident-qa__list">
${qa}
        </div>
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="footer__container">
      <div><div class="footer__logo">ДЕЛОВАЯ ЖИЗНЬ</div><p class="footer__tagline">Крупнейшее бизнес-сообщество Пермского края.</p></div>
      <div class="footer__contacts"><h4>Контакты</h4><p>г. Пермь, ул. 25 Октября, 4</p><p><a href="tel:+79630170017">+7 (963) 017-00-17</a></p><p><a href="mailto:club@delolife.club">club@delolife.club</a></p></div>
      <div class="footer__nav"><h4>Навигация</h4><div class="footer__nav-links"><a href="index.html">Главная</a><a href="about.html">О клубе</a><a href="team.html">Команда</a><a href="residents.html">Резиденты</a><a href="blog.html">Блог</a><a href="ecosystem.html">Экосистема</a><a href="events.html">События</a><a href="contacts.html">Контакты</a></div></div>
      <div><h4>Социальные сети</h4><div class="footer__social"><a href="https://t.me/delolife_club" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://wa.me/79630170017" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="https://vk.com/delolife.club" target="_blank" rel="noopener noreferrer">VK</a></div></div>
      <div class="footer__bottom"><span class="footer__copy">&copy; 2026 Деловая жизнь.</span><div class="footer__legal"><a href="privacy.html">Политика конфиденциальности</a><a href="terms.html">Пользовательское соглашение</a></div></div>
    </div>
  </footer>
  <div class="theme-transition-overlay" id="themeOverlay"></div>
  <button class="scroll-top" id="scrollTop" aria-label="Наверх"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
  <button class="theme-toggle" id="themeToggle" aria-label="Переключить тему"><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></button>
  <script src="js/site-config.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
`;
}

function writeProfiles() {
  for (const p of people) {
    fs.writeFileSync(path.join(root, p.page), profileTemplate(p), 'utf8');
  }
  console.log('Profiles written:', people.length);
}

function rebuildResidents(atm) {
  let html = fs.readFileSync(path.join(root, 'residents.html'), 'utf8');
  const cards = people
    .map((p) => {
      const photo = p.localPhoto
        ? `<img src="${p.localPhoto}" alt="${escapeHtml(p.name)}" class="resident-photo" loading="lazy">`
        : `<div class="photo-zone"><span class="photo-zone__label">[Фото]</span></div>`;
      return `        <a href="${p.page}" class="resident-card resident-card--clickable" data-category="${p.category}">
          <div class="resident-card__photo">${photo}</div>
          <div class="resident-card__info">
            <h3 class="resident-card__name">${escapeHtml(p.name)}</h3>
            <p class="resident-card__position">${escapeHtml(p.position)}</p>
            <p class="resident-card__company">${escapeHtml(p.company)}</p>
            <p class="resident-card__description">${escapeHtml(p.description)}</p>
          </div>
        </a>`;
    })
    .join('\n');

  html = html.replace(
    /(<section class="residents-grid">\s*<div class="container">)[\s\S]*?(<\/div>\s*<\/section>\s*<!-- Слайдер)/,
    `$1\n${cards}\n      $2`
  );

  const sliderPeople = people.filter((p) => p.vip).slice(0, 6);
  const slider = sliderPeople
    .map((p) => {
      const photo = p.localPhoto
        ? `<img src="${p.localPhoto}" alt="${escapeHtml(p.name)}" class="resident-photo" loading="lazy">`
        : `<div class="photo-zone"><span class="photo-zone__label">[Фото]</span></div>`;
      return `            <a href="${p.page}" class="resident-card resident-card--clickable">
              <div class="resident-card__photo">${photo}</div>
              <div class="resident-card__info">
                <h3 class="resident-card__name">${escapeHtml(p.name)}</h3>
                <p class="resident-card__position">${escapeHtml(p.position)}</p>
                <p class="resident-card__company">${escapeHtml(p.company)}</p>
              </div>
            </a>`;
    })
    .join('\n');

  html = html.replace(
    /(<div class="slider__track">)[\s\S]*?(<\/div>\s*<button class="slider__btn)/,
    `$1\n${slider}\n          $2`
  );

  html = html.replace(
    /Предприниматели Пермского края|Крупнейшее бизнес-сообщество предпринимателей Пермского края/,
    `${people.length} резидентов — предприниматели Пермского края`
  );

  // gallery strip before CTA if not present
  if (!html.includes('atmosphere-gallery') && atm.length) {
    const gallery = atm
      .slice(0, 6)
      .map((src) => `<img src="${src}" alt="Мероприятие клуба Деловая жизнь" class="atmosphere-gallery__img" loading="lazy">`)
      .join('\n          ');
    html = html.replace(
      /(<!-- CTA -->|<section class="cta-section">)/,
      `    <section class="atmosphere-gallery">
      <div class="container">
        <div class="residents-preview__header">
          <span class="residents-preview__label">Клуб в кадрах</span>
          <h2 class="residents-preview__title">Жизнь сообщества</h2>
          <div class="section-divider section-divider--center"></div>
        </div>
        <div class="atmosphere-gallery__grid">
          ${gallery}
        </div>
      </div>
    </section>

    $1`
    );
  }

  fs.writeFileSync(path.join(root, 'residents.html'), html, 'utf8');
  console.log('residents.html rebuilt with', people.length, 'cards');
}

function removePreloaders() {
  for (const name of fs.readdirSync(root).filter((f) => f.endsWith('.html'))) {
    let html = fs.readFileSync(path.join(root, name), 'utf8');
    const before = html;
    html = html.replace(/<!-- Прелоадер -->\s*<div class="preloader"[\s\S]*?<\/div>\s*<\/div>\s*/g, '');
    html = html.replace(/<div class="preloader"[\s\S]*?<\/div>\s*<\/div>\s*/g, '');
    if (html !== before) {
      fs.writeFileSync(path.join(root, name), html, 'utf8');
      console.log('preloader removed:', name);
    }
  }
}

function updateCss() {
  const cssPath = path.join(root, 'css', 'style.css');
  let css = fs.readFileSync(cssPath, 'utf8');
  const block = `

/* Face-centered resident photos + atmosphere */
.resident-photo,
.resident-card__photo img,
.resident-profile__photo img,
.photo-zone img,
.testimonial-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 18%;
  display: block;
}
.resident-profile__photo {
  overflow: hidden;
  border-radius: var(--radius-lg);
  min-height: 360px;
}
.atmosphere-gallery {
  padding: var(--space-3xl) 0;
  background: var(--bg-main);
}
.atmosphere-gallery__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}
.atmosphere-gallery__img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  object-position: center;
  border-radius: var(--radius-md);
}
@media (max-width: 768px) {
  .atmosphere-gallery__grid { grid-template-columns: 1fr 1fr; }
}
.preloader { display: none !important; }
`;
  if (!css.includes('object-position: center 18%')) {
    css += block;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('CSS updated');
  }
}

function replaceLinksEverywhere() {
  const renames = {
    'founder.html': people.find((p) => p.name.includes('Южанинова'))?.page
  };

  for (const name of fs.readdirSync(root).filter((f) => f.endsWith('.html') || f === 'sitemap.xml')) {
    const full = path.join(root, name);
    let html = fs.readFileSync(full, 'utf8');
    const before = html;
    for (const [from, to] of Object.entries(renames)) {
      if (to) html = html.split(from).join(to);
    }
    // footer tagline
    html = html.replace(
      /Премиальное сообщество предпринимателей\./g,
      'Крупнейшее бизнес-сообщество Пермского края.'
    );
    if (html !== before) {
      fs.writeFileSync(full, html, 'utf8');
      console.log('links updated:', name);
    }
  }

  // delete old profile filenames if different
  for (const [oldName, newName] of Object.entries(renames)) {
    if (newName && oldName !== newName && fs.existsSync(path.join(root, oldName))) {
      // keep redirect stub for SEO
      fs.writeFileSync(
        path.join(root, oldName),
        `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0; url=${newName}"><link rel="canonical" href="https://andrewf250.github.io/business-life/${newName}"><meta name="robots" content="noindex, follow"><title>Redirect</title></head><body><p><a href="${newName}">Перейти</a></p></body></html>\n`,
        'utf8'
      );
      console.log('redirect:', oldName, '->', newName);
    }
  }
}

function updateIndexAndTeam(atm) {
  const irina = people.find((p) => p.name.includes('Южанинова'));
  const katya = people.find((p) => p.name.includes('Волочкова'));
  const sasha = people.find((p) => p.name.includes('Коренякин'));
  const sidor = people.find((p) => p.name.includes('Сидорук'));
  const preview = [katya, sasha, sidor].filter(Boolean);

  let index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  // hero atmosphere as CSS bg via img in about
  if (atm[0]) {
    index = index.replace(
      /(<div class="about__image">)[\s\S]*?(<\/div>\s*<div class="about__content">)/,
      `$1\n            <img src="${atm[0]}" alt="Бизнес-клуб Деловая жизнь" class="about__photo">\n          $2`
    );
  }
  if (irina?.localPhoto) {
    // keep founder mention elsewhere
  }

  // rebuild preview grid
  const previewHtml = preview
    .map((p) => `          <a href="${p.page}" class="resident-card resident-card--clickable">
            <div class="resident-card__photo">
              <img src="${p.localPhoto}" alt="${escapeHtml(p.name)}" class="resident-photo" loading="lazy">
            </div>
            <div class="resident-card__info">
              <h3 class="resident-card__name">${escapeHtml(p.name)}</h3>
              <p class="resident-card__position">${escapeHtml(p.position)}</p>
              <p class="resident-card__company">${escapeHtml(p.company)}</p>
              <p class="resident-card__description">${escapeHtml(p.description)}</p>
            </div>
          </a>`)
    .join('\n');
  index = index.replace(
    /(<div class="residents-preview__grid">)[\s\S]*?(<\/div>\s*<a href="residents.html")/,
    `$1\n${previewHtml}\n        $2`
  );

  // fill remaining photo-zones with atmosphere cycling
  let ai = 1;
  index = index.replace(/<div class="photo-zone[^"]*">[\s\S]*?<\/div>/g, () => {
    const src = atm[ai % atm.length] || atm[0];
    ai++;
    if (!src) return '<div class="photo-zone"><span class="photo-zone__label">[Фото]</span></div>';
    return `<div class="photo-zone photo-zone--filled"><img src="${src}" alt="Деловая жизнь" loading="lazy"></div>`;
  });

  // meta description
  index = index.replace(
    /name="description" content="[^"]*"/,
    'name="description" content="Деловая жизнь — крупнейшее бизнес-сообщество предпринимателей Пермского края. 140 резидентов, нетворкинг, форумы, программа «Покупай у своих»."'
  );

  fs.writeFileSync(path.join(root, 'index.html'), index, 'utf8');

  // team
  let team = fs.readFileSync(path.join(root, 'team.html'), 'utf8');
  const teamPeople = [irina, sasha, katya].filter(Boolean);
  // simple replace of card block if present
  const teamCards = teamPeople
    .map((p) => `        <a href="${p.page}" class="resident-card resident-card--clickable">
          <div class="resident-card__photo">
            <img src="${p.localPhoto}" alt="${escapeHtml(p.name)}" class="resident-photo" loading="lazy">
          </div>
          <div class="resident-card__info">
            <h3 class="resident-card__name">${escapeHtml(p.name)}</h3>
            <p class="resident-card__position">${escapeHtml(p.position)}</p>
            <p class="resident-card__company">${escapeHtml(p.company)}</p>
            <p class="resident-card__description">${escapeHtml(p.description)}</p>
          </div>
        </a>`)
    .join('\n');
  if (team.includes('residents-grid') || team.includes('team-grid') || team.includes('resident-card')) {
    team = team.replace(
      /(<div class="container">\s*)(?:<a href="[^"]+" class="resident-card[\s\S]*?<\/a>\s*)+(<\/div>\s*<\/section>)/,
      `$1\n${teamCards}\n      $2`
    );
  }
  fs.writeFileSync(path.join(root, 'team.html'), team, 'utf8');

  // contacts: add director + Lenin address note
  let contacts = fs.readFileSync(path.join(root, 'contacts.html'), 'utf8');
  if (!contacts.includes('Цаюкова') && !contacts.includes('Ленина')) {
    contacts = contacts.replace(
      /(<h3>Адрес<\/h3>\s*<p>)([^<]*)(<\/p>)/,
      `$1г. Пермь, ул. 25 Октября, 4, Бизнес-дом «Деловая жизнь»$3\n            <p>также: ул. Ленина, 68</p>`
    );
  }
  if (!contacts.includes('Директор бизнес-клуба')) {
    contacts = contacts.replace(
      /(<h3>Email<\/h3>[\s\S]*?<\/div>\s*<\/div>)/,
      `$1
        <div class="contacts-info__item">
          <div class="contacts-info__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div>
            <h3>Директор</h3>
            <p>Наталья Цаюкова</p>
            <p>Директор бизнес-клуба</p>
          </div>
        </div>`
    );
  }
  // fill map/photo zones
  let ci = 0;
  contacts = contacts.replace(/<div class="photo-zone[^"]*">[\s\S]*?<\/div>/g, () => {
    const src = atm[ci++ % atm.length];
    return src
      ? `<div class="photo-zone photo-zone--filled"><img src="${src}" alt="Деловая жизнь" loading="lazy"></div>`
      : '<div class="photo-zone"><span class="photo-zone__label">[Фото]</span></div>';
  });
  fs.writeFileSync(path.join(root, 'contacts.html'), contacts, 'utf8');

  // about fill
  let about = fs.readFileSync(path.join(root, 'about.html'), 'utf8');
  let aj = 2;
  about = about.replace(/<div class="photo-zone[^"]*">[\s\S]*?<\/div>/g, () => {
    const src = atm[aj++ % atm.length];
    return src
      ? `<div class="photo-zone photo-zone--filled"><img src="${src}" alt="О клубе Деловая жизнь" loading="lazy"></div>`
      : '<div class="photo-zone"><span class="photo-zone__label">[Фото]</span></div>';
  });
  fs.writeFileSync(path.join(root, 'about.html'), about, 'utf8');

  console.log('index/team/contacts/about updated');
}

function updateSiteConfig() {
  fs.writeFileSync(
    path.join(root, 'js', 'site-config.js'),
    `window.SITE_CONFIG = {
  baseUrl: 'https://andrewf250.github.io/business-life',
  brand: 'Деловая жизнь',
  phone: '+7 (963) 017-00-17',
  phoneRaw: '79630170017',
  phoneAlt: '+7 (342) 291-95-93',
  email: 'club@delolife.club',
  address: 'г. Пермь, ул. 25 Октября, 4, Бизнес-дом «Деловая жизнь»',
  addressAlt: 'г. Пермь, ул. Ленина, 68',
  director: 'Наталья Цаюкова',
  social: {
    telegram: 'https://t.me/delolife_club',
    whatsapp: 'https://wa.me/79630170017',
    vk: 'https://vk.com/delolife.club'
  },
  analytics: { yandexMetrikaId: '', googleAnalyticsId: '', gtmId: '', vkPixelId: '' },
  formEndpoint: ''
};
`,
    'utf8'
  );
}

function updateSitemap() {
  const urls = [
    '',
    'about.html',
    'team.html',
    'residents.html',
    'blog.html',
    'ecosystem.html',
    'events.html',
    'contacts.html',
    'visit.html',
    'partnership.html',
    'faq.html',
    'privacy.html',
    'terms.html',
    ...people.map((p) => p.page)
  ];
  const body = urls
    .map((u) => {
      const loc = u
        ? `https://andrewf250.github.io/business-life/${u}`
        : 'https://andrewf250.github.io/business-life/';
      const prio = u === '' ? '1.0' : u.includes('-') && u.endsWith('.html') && people.some((p) => p.page === u) ? '0.5' : '0.8';
      return `  <url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>${prio}</priority></url>`;
    })
    .join('\n');
  fs.writeFileSync(
    path.join(root, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    'utf8'
  );
  console.log('sitemap updated');
}

function updateSearchIndex() {
  const jsPath = path.join(root, 'js', 'script.js');
  let js = fs.readFileSync(jsPath, 'utf8');
  const entries = people.map((p) => ({
    title: p.name,
    url: p.page,
    text: `${p.position} ${p.company} ${p.description}`,
    meta: [p.position, p.company].filter(Boolean).join(' · '),
  }));
  const block = `var RESIDENT_SEARCH_INDEX = ${JSON.stringify(entries, null, 2)};`;
  if (js.includes('var RESIDENT_SEARCH_INDEX = [')) {
    js = js.replace(/var RESIDENT_SEARCH_INDEX = \[[\s\S]*?\];/, block);
    fs.writeFileSync(jsPath, js, 'utf8');
    console.log('resident search index updated');
  }
}

function fillEventPhotos(atm) {
  for (const name of fs.readdirSync(root).filter((f) => f.startsWith('event') && f.endsWith('.html'))) {
    let html = fs.readFileSync(path.join(root, name), 'utf8');
    let i = Math.floor(Math.random() * Math.max(atm.length, 1));
    const before = html;
    html = html.replace(/<div class="photo-zone[^"]*">[\s\S]*?<\/div>/g, () => {
      const src = atm[i++ % atm.length];
      return src
        ? `<div class="photo-zone photo-zone--filled"><img src="${src}" alt="Мероприятие" loading="lazy"></div>`
        : '<div class="photo-zone"><span class="photo-zone__label">[Фото]</span></div>';
    });
    if (html !== before) fs.writeFileSync(path.join(root, name), html, 'utf8');
  }
  console.log('event photos filled');
}

(async () => {
  updateSiteConfig();
  const atm = await downloadAtmosphere();
  writeProfiles();
  rebuildResidents(atm);
  removePreloaders();
  updateCss();
  replaceLinksEverywhere();
  updateIndexAndTeam(atm);
  fillEventPhotos(atm);
  updateSitemap();
  updateSearchIndex();

  // about CSS helper
  let css = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
  if (!css.includes('.about__photo')) {
    css += `
.about__photo {
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
  object-position: center;
  border-radius: var(--radius-lg);
  display: block;
}
.photo-zone--filled {
  padding: 0 !important;
  overflow: hidden;
  background: none !important;
}
`;
    fs.writeFileSync(path.join(root, 'css', 'style.css'), css, 'utf8');
  }

  console.log('ALL DONE');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
