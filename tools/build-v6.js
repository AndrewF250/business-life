/**
 * Build V6 Atelier — full multi-page site.
 * Default → designs/v6-atelier/
 * --root  → project root (third GitHub variant)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const toRoot = process.argv.includes('--root');
const outDir = toRoot ? root : path.join(root, 'designs', 'v6-atelier');
const A = toRoot ? 'assets/images' : '../../assets/images';
const R = toRoot ? '' : '../../'; // prefix for resident profile pages
const cssHref = toRoot ? 'css/atelier.css' : 'style.css';
const motionHref = toRoot ? 'js/atelier-motion.js' : 'motion.js';
const dataHref = toRoot ? 'js/atelier-residents.js' : 'residents-data.js';
const FORM = 'https://forms.yandex.ru/cloud/643659a8c09c0200f93623d0/';

const people = JSON.parse(fs.readFileSync(path.join(root, 'tools', 'people.json'), 'utf8'));

const pagesMeta = {
  index: { title: 'Бизнес-клуб в Перми', file: 'index.html', active: 'index' },
  about: { title: 'О клубе', file: 'about.html', active: 'about' },
  team: { title: 'Команда', file: 'team.html', active: 'team' },
  residents: { title: 'Резиденты', file: 'residents.html', active: 'residents' },
  blog: { title: 'Блог', file: 'blog.html', active: 'blog' },
  ecosystem: { title: 'Экосистема', file: 'ecosystem.html', active: 'ecosystem' },
  events: { title: 'События', file: 'events.html', active: 'events' },
  contacts: { title: 'Контакты', file: 'contacts.html', active: 'contacts' },
  visit: { title: 'Гостевой визит', file: 'visit.html', active: 'visit' },
  faq: { title: 'FAQ', file: 'faq.html', active: 'faq' },
  partnership: { title: 'Партнёрство', file: 'partnership.html', active: 'partnership' },
  privacy: { title: 'Конфиденциальность', file: 'privacy.html', active: 'privacy' },
  terms: { title: 'Соглашение', file: 'terms.html', active: 'terms' },
  'thank-you': { title: 'Спасибо', file: 'thank-you.html', active: 'visit' },
  networking: { title: 'Нетворкинг', file: 'networking.html', active: 'blog' },
  cases: { title: 'Кейсы', file: 'cases.html', active: 'blog' },
  lifhaki: { title: 'Лайфхаки', file: 'lifhaki.html', active: 'blog' },
  'events-archive': { title: 'Архив событий', file: 'events-archive.html', active: 'events' },
  founder: { title: 'Основатель', file: 'founder.html', active: 'team' },
  'event-open-doors': { title: 'День открытых дверей', file: 'event-open-doors.html', active: 'events' },
};

function photoOf(p) {
  const local = (p.localPhoto || '').replace(/^assets\/images\//, '');
  return `${A}/${local || 'og-default.png'}`;
}
function hrefOf(p) {
  return `${R}${p.page || p.slug + '.html'}`;
}

function navLinks(active) {
  return [
    ['about.html', 'about', 'О клубе'],
    ['team.html', 'team', 'Команда'],
    ['residents.html', 'residents', 'Резиденты'],
    ['blog.html', 'blog', 'Блог'],
    ['ecosystem.html', 'ecosystem', 'Экосистема'],
    ['events.html', 'events', 'События'],
    ['contacts.html', 'contacts', 'Контакты'],
  ]
    .map(([href, key, label]) => `<a href="${href}" class="${active === key ? 'is-active' : ''}">${label}</a>`)
    .join('\n          ');
}

function rCard(p) {
  const cat = p.category || 'other';
  return `<a class="r-card" href="${hrefOf(p)}" data-name="${p.name}" data-meta="${p.company || ''}" data-category="${cat}">
            <div class="r-card__photo"><img src="${photoOf(p)}" alt="${p.name}" loading="lazy"></div>
            <div class="r-card__body"><h3>${p.name}</h3><p>${p.position || ''}${p.company ? ' · ' + p.company : ''}</p></div>
          </a>`;
}

const CAT_LABELS = {
  services: 'Услуги',
  trade: 'Торговля',
  consulting: 'Консалтинг',
  production: 'Производство',
  it: 'IT',
  other: 'Другое',
};

function shell(pageKey, body) {
  const meta = pagesMeta[pageKey];
  const active = meta.active;
  const pageUrl = `https://andrewf250.github.io/business-life/${meta.file === 'index.html' ? '' : meta.file}`;
  const desc = `Бизнес-клуб Деловая жизнь в Перми. ${meta.title}.`;
  const title = `${meta.title} — Деловая жизнь`;
  const seoBlock = toRoot ? `
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:site_name" content="Деловая жизнь">
  <meta property="og:image" content="https://andrewf250.github.io/business-life/assets/images/og-default.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="https://andrewf250.github.io/business-life/assets/images/og-default.png">
  ${pageKey === 'index' ? `<script type="application/ld+json">
  {"@context":"https://schema.org","@graph":[
    {"@type":"Organization","@id":"https://andrewf250.github.io/business-life/#organization","name":"Деловая жизнь","url":"https://andrewf250.github.io/business-life/","logo":"https://andrewf250.github.io/business-life/assets/images/favicon.svg","image":"https://andrewf250.github.io/business-life/assets/images/og-default.png","sameAs":["https://t.me/delolife_club","https://vk.com/delolife.club"],"address":{"@type":"PostalAddress","addressLocality":"Пермь","streetAddress":"ул. 25 Октября, 4","addressCountry":"RU"},"contactPoint":{"@type":"ContactPoint","telephone":"+7-963-017-00-17","email":"club@delolife.club","contactType":"customer service","availableLanguage":"Russian"}},
    {"@type":"WebSite","@id":"https://andrewf250.github.io/business-life/#website","url":"https://andrewf250.github.io/business-life/","name":"Деловая жизнь","publisher":{"@id":"https://andrewf250.github.io/business-life/#organization"},"inLanguage":"ru-RU"}
  ]}
  </script>` : ''}` : '';

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="${toRoot ? 'index, follow' : 'noindex, follow'}">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  ${seoBlock}
  <link rel="icon" href="${A}/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${cssHref}">
  <script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
</head>
<body data-page="${pageKey}">
  <div class="preloader" id="preloader" aria-hidden="true">
    <div class="preloader__logo" id="preloaderLogo">ДЕЛОВАЯ ЖИЗНЬ</div>
    <div class="preloader__bar"><i id="preloaderBar"></i></div>
    <div class="preloader__pct" id="preloaderPct">0%</div>
  </div>
  <div class="progress" id="progress"></div>
  <div class="theme-transition-overlay" id="themeOverlay"></div>
  <button class="scroll-top" id="scrollTop" aria-label="Наверх">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
  </button>
  <button class="theme-toggle" id="themeToggle" aria-label="Переключить тему">
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  </button>
  <div class="social-float" aria-label="Связь">
    <a href="https://t.me/delolife_club" target="_blank" rel="noopener" title="Telegram">TG</a>
    <a href="https://wa.me/79630170017" target="_blank" rel="noopener" title="WhatsApp">WA</a>
    <a href="https://vk.com/delolife.club" target="_blank" rel="noopener" title="VK">VK</a>
  </div>

  <header class="header" id="header">
    <div class="container header__inner">
      <a class="header__logo" href="index.html">
        <strong>ДЕЛОВАЯ ЖИЗНЬ</strong>
        <span>бизнес-клуб</span>
      </a>
      <nav class="header__nav">
          ${navLinks(active)}
      </nav>
      <div class="header__actions">
        <div class="site-search" id="siteSearchWrap">
          <button type="button" class="site-search__toggle" id="siteSearchToggle" aria-label="Поиск резидентов" title="Поиск резидентов">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="7.5" r="3.2"/><path d="M3.8 18.5c.6-2.8 2.7-4.5 5.2-4.5s4.6 1.7 5.2 4.5"/><circle cx="17.2" cy="16.2" r="3.3"/><line x1="19.5" y1="18.6" x2="21.4" y2="20.5"/></svg>
          </button>
          <div class="site-search__panel" id="siteSearchPanel" hidden>
            <input type="search" id="siteSearch" class="site-search__input" placeholder="Найти резидента..." autocomplete="off">
            <div class="site-search__results" id="siteSearchResults"></div>
          </div>
        </div>
        <a class="btn btn--fill" href="visit.html">Стать гостем клуба</a>
        <button class="header__burger" id="burger" aria-label="Меню"><span></span></button>
      </div>
    </div>
  </header>

  <div class="mobile-nav" id="mobileNav">
    ${navLinks(active)}
    <a href="visit.html">Стать гостем клуба</a>
    <a href="partnership.html">Партнёрство</a>
  </div>

  <main>
${body}
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <strong>ДЕЛОВАЯ ЖИЗНЬ</strong>
          <p>Крупнейшее бизнес-сообщество предпринимателей Пермского края.</p>
          <p style="margin-top:12px">г. Пермь, ул. 25 Октября, 4</p>
          <p>Пн–Пт: 9:00 — 18:00</p>
        </div>
        <div>
          <h4>Клуб</h4>
          <nav>
            <a href="about.html">О клубе</a>
            <a href="team.html">Команда</a>
            <a href="residents.html">Резиденты</a>
            <a href="blog.html">Блог</a>
            <a href="ecosystem.html">Экосистема</a>
            <a href="events.html">События</a>
            <a href="contacts.html">Контакты</a>
          </nav>
        </div>
        <div>
          <h4>Контакты</h4>
          <nav>
            <a href="tel:+79630170017">+7 (963) 017-00-17</a>
            <a href="tel:+73422919593">+7 (342) 291-95-93</a>
            <a href="mailto:club@delolife.club">club@delolife.club</a>
            <a href="https://t.me/delolife_club" target="_blank" rel="noopener">Telegram</a>
            <a href="https://wa.me/79630170017" target="_blank" rel="noopener">WhatsApp</a>
            <a href="https://vk.com/delolife.club" target="_blank" rel="noopener">VK</a>
          </nav>
        </div>
        <div>
          <h4>Ещё</h4>
          <nav>
            <a href="visit.html">Стать гостем</a>
            <a href="partnership.html">Партнёрство</a>
            <a href="privacy.html">Конфиденциальность</a>
            <a href="terms.html">Соглашение</a>
          </nav>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© Деловая жизнь · Atelier</span>
        <span>Директор: Наталья Цаюкова</span>
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js"></script>
  <script src="${toRoot ? 'js/site-config.js' : '../../js/site-config.js'}"></script>
  <script src="${dataHref}"></script>
  <script src="${motionHref}"></script>
</body>
</html>`;
}

const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${d}</svg>`;
const icons = {
  users: icon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  target: icon('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),
  handshake: icon('<path d="M17 11V5a2 2 0 0 0-2-2H9"/><path d="M7 11V5"/><path d="M12 22v-6"/><path d="M8 16l4 4 4-4"/><path d="M3 11h18"/>'),
  chart: icon('<path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/>'),
  star: icon('<path d="M12 2l2.4 6.8H22l-5.6 4.2 2.2 6.8L12 16.6 5.4 19.8l2.2-6.8L2 8.8h7.6z"/>'),
  spark: icon('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>'),
};

const featured = people.filter((p) => p.vip).slice(0, 8);
const carouselPeople = featured.length ? featured : people.slice(0, 8);

const bodies = {};

bodies.index = `
    <section class="hero" data-bg="hero">
      <div class="container hero__grid">
        <div>
          <p class="hero__label">Бизнес-клуб · Пермь</p>
          <h1 class="hero__title">
            <span class="line">Деловая жизнь</span>
            <span class="line">в Перми</span>
            <span class="line">для роста бизнеса</span>
          </h1>
          <p class="hero__text">Крупнейшее сообщество предпринимателей Пермского края. Нетворкинг, поддержка, форумы и сделки внутри клуба.</p>
          <div class="hero__cta">
            <a class="btn btn--fill" href="visit.html" data-cta="hero_guest">Стать гостем клуба
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            <a class="btn btn--ghost" href="about.html"><i>▶</i> О клубе</a>
          </div>
        </div>
        <div class="hero__visual">
          <img src="${A}/atmosphere/dj-01.jpg" alt="Атмосфера клуба" data-parallax>
          <div class="hero__badge"><strong>с 2021</strong>Место силы для бизнесменов Перми</div>
        </div>
      </div>
    </section>

    <section class="stats" data-bg="stats">
      <div class="container">
        <div class="stats__bar">
          <div class="stats__item"><span class="stats__num" data-count="140" data-suffix="+">0</span><span class="stats__label">предпринимателей</span></div>
          <div class="stats__item"><span class="stats__num" data-count="5">0</span><span class="stats__label">лет сообществу</span></div>
          <div class="stats__item"><span class="stats__num" data-count="165" data-suffix="+">0</span><span class="stats__label">мероприятий</span></div>
          <div class="stats__item"><span class="stats__num" data-count="500" data-suffix=" млн₽">0</span><span class="stats__label">сделок внутри клуба</span></div>
          <div class="stats__item"><span class="stats__num" data-count="14" data-suffix=" тыс+">0</span><span class="stats__label">сотрудников</span></div>
        </div>
      </div>
    </section>

    <section class="section" data-bg="why">
      <div class="container why__grid">
        <div class="why__left" data-reveal>
          <p class="eyebrow">Почему нас выбирают</p>
          <h2 class="section-title" data-split>Сильное окружение — ваше конкурентное преимущество</h2>
          <p>Мы объединяем, мотивируем и выстраиваем бизнес-коммуникации. Вместе с «ОПОРА РОССИИ» возможности резидентов шире.</p>
          <a class="btn btn--ghost" href="about.html"><i>→</i> Подробнее о клубе</a>
        </div>
        <div class="why__cards" data-reveal-stagger>
          <article class="why-card"><div class="why-card__icon">${icons.users}</div><h3>Форум-группы</h3><p>Разбор задач и обмен опытом между предпринимателями.</p></article>
          <article class="why-card"><div class="why-card__icon">${icons.target}</div><h3>Новые клиенты</h3><p>Программа «Покупай у своих» сохраняет сделки в сообществе.</p></article>
          <article class="why-card"><div class="why-card__icon">${icons.handshake}</div><h3>Партнёры</h3><p>Знакомства с первыми лицами и надёжными подрядчиками.</p></article>
          <article class="why-card"><div class="why-card__icon">${icons.chart}</div><h3>Рост бизнеса</h3><p>Мастер-классы, стажировки и поддержка на каждом этапе.</p></article>
          <article class="why-card"><div class="why-card__icon">${icons.star}</div><h3>Статус</h3><p>Закрытое сообщество сильных предпринимателей края.</p></article>
          <article class="why-card"><div class="why-card__icon">${icons.spark}</div><h3>Качество жизни</h3><p>«Разговоры за вином», спорт и полезный досуг.</p></article>
        </div>
      </div>
    </section>

    <section class="section section--sand" data-bg="formats">
      <div class="container">
        <div class="res-head" data-reveal>
          <div>
            <p class="eyebrow">Форматы</p>
            <h2 class="section-title" data-split>Мероприятия клуба</h2>
          </div>
          <a class="btn btn--line" href="events.html">Все события</a>
        </div>
        <div class="grid-3" data-reveal-stagger>
          <article class="event-card"><div class="event-card__date">Ключевой</div><h3>Форумы</h3><p>Разбор задач, обмен опытом и решения, которые помогают бизнесу расти быстрее.</p></article>
          <article class="event-card"><div class="event-card__date">Обучение</div><h3>Мастер-классы</h3><p>Эксперты по продажам, маркетингу, финансам и развитию команд.</p></article>
          <article class="event-card"><div class="event-card__date">Связи</div><h3>Разговоры за вином</h3><p>Живые встречи, где рождаются сильные знакомства и партнёрства.</p></article>
        </div>
      </div>
    </section>

    <section class="section" data-bg="eco">
      <div class="container">
        <div class="eco" data-reveal>
          <div class="eco__media"><img src="${A}/atmosphere/dj-34.jpg" alt="Встреча в клубе" data-parallax></div>
          <div class="eco__copy">
            <p class="eyebrow">Экосистема</p>
            <h2 class="section-title">Все возможности для роста бизнеса в одном месте</h2>
            <p>Форумы, стажировки, нетворкинг и партнёрства — в одной экосистеме клуба.</p>
            <ul class="eco__list">
              <li>Закрытое сообщество резидентов</li>
              <li>Проверенные связи и рекомендации</li>
              <li>События, которые двигают бизнес</li>
              <li>Поддержка ОПОРА РОССИИ</li>
            </ul>
            <a class="btn btn--fill" href="ecosystem.html">Экосистема клуба</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--sand" data-bg="people">
      <div class="container">
        <div class="res-head">
          <div data-reveal>
            <p class="eyebrow">Резиденты</p>
            <h2 class="section-title" data-split>Присоединяйтесь к сильному сообществу</h2>
          </div>
          <div class="res-nav">
            <button type="button" data-carousel-prev aria-label="Назад">←</button>
            <button type="button" data-carousel-next aria-label="Вперёд">→</button>
          </div>
        </div>
        <div class="carousel" data-carousel>
          <div class="carousel__track">
            ${carouselPeople.map(rCard).join('\n            ')}
          </div>
        </div>
        <div style="margin-top:28px" data-reveal>
          <a class="btn btn--line" href="residents.html">Все резиденты</a>
        </div>
      </div>
    </section>

    <section class="section" data-bg="quotes">
      <div class="container">
        <p class="eyebrow" data-reveal>Отзывы</p>
        <h2 class="section-title" data-split style="margin-bottom:28px">Участники о клубе</h2>
        <div class="grid-3" data-reveal-stagger>
          <article class="info-card"><h3>Александр Коренякин</h3><p>«Благодаря клубу я нашёл ключевых партнёров. Форум-группы дают честную обратную связь.»</p></article>
          <article class="info-card"><h3>Екатерина Волочкова</h3><p>«Для меня это развитие, опыт лучших управленцев и мощная помощь в разных вопросах.»</p></article>
          <article class="info-card"><h3>Александр Сидорук</h3><p>«Сообщество даёт уверенность: в любой ситуации можно обратиться к своим.»</p></article>
        </div>
      </div>
    </section>

    <section class="section section--sand" data-bg="news">
      <div class="container">
        <div class="res-head" data-reveal>
          <div>
            <p class="eyebrow">Блог и материалы</p>
            <h2 class="section-title" data-split>Полезное из клуба</h2>
          </div>
          <a class="btn btn--line" href="blog.html">Весь блог</a>
        </div>
        <div class="grid-3" data-reveal-stagger>
          <a class="event-card" href="article-networking-1.html"><div class="event-card__date">Нетворкинг</div><h3>Как работают связи</h3><p>О живых знакомствах и доверии между резидентами.</p></a>
          <a class="event-card" href="article-lifhaki-1.html"><div class="event-card__date">Лайфхаки</div><h3>Практики роста</h3><p>Рабочие приёмы предпринимателей сообщества.</p></a>
          <a class="event-card" href="article-cases-1.html"><div class="event-card__date">Кейсы</div><h3>Сделки внутри клуба</h3><p>Как «Покупай у своих» помогает бизнесу.</p></a>
        </div>
      </div>
    </section>

    <section class="section" data-bg="cta">
      <div class="container">
        <div class="cta-band" data-reveal>
          <p class="eyebrow">Гостевой визит</p>
          <h2 class="section-title">Приходите познакомиться с клубом</h2>
          <p>Один визит — и вы почувствуете атмосферу, людей и возможности «Деловой жизни».</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <a class="btn btn--fill" href="${FORM}" target="_blank" rel="noopener" data-cta="cta_form">Записаться</a>
            <a class="btn btn--line" href="visit.html" data-cta="cta_visit">Подробнее</a>
          </div>
        </div>
      </div>
    </section>
`;

bodies.about = `
    <section class="page-hero" data-bg="why"><div class="container">
      <p class="eyebrow">О клубе</p>
      <h1 class="page-hero__title">Место силы для бизнесменов Пермского края</h1>
      <p class="page-hero__text">«Деловая жизнь» объединяет, мотивирует и выстраивает бизнес-коммуникации с 2021 года.</p>
    </div></section>
    <section class="section" style="padding-top:20px" data-bg="eco"><div class="container split">
      <div class="split__media" data-reveal><img src="${A}/atmosphere/dj-03.jpg" alt="Встреча клуба" data-parallax></div>
      <div class="prose" data-reveal>
        <h2>Кто мы</h2>
        <p>Крупнейшее бизнес-сообщество предпринимателей края. В сотрудничестве с Пермским региональным отделением «ОПОРА РОССИИ» возможности резидентов становятся шире.</p>
        <p>Программа «Покупай у своих» помогает сохранять сделки внутри сообщества — уже на сотни миллионов рублей.</p>
        <p><strong>Директор:</strong> Наталья Цаюкова</p>
        <a class="btn btn--fill" href="visit.html" style="margin-top:12px" data-cta="about_guest">Стать гостем</a>
      </div>
    </div></section>
    <section class="section section--sand" data-bg="quotes"><div class="container">
      <h2 class="section-title" data-split style="margin-bottom:28px">На чём держится клуб</h2>
      <div class="grid-3" data-reveal-stagger>
        <article class="info-card"><h3>Доверие</h3><p>Закрытое сообщество, где ценят репутацию и длинные отношения.</p></article>
        <article class="info-card"><h3>Поддержка</h3><p>Форумы, стажировки и взаимная помощь между резидентами.</p></article>
        <article class="info-card"><h3>Рост</h3><p>Новые клиенты, партнёры и знания — в одной экосистеме.</p></article>
      </div>
    </div></section>
    <section class="section" id="faq" data-bg="grid"><div class="container" style="max-width:800px">
      <p class="eyebrow" data-reveal>FAQ</p>
      <h2 class="section-title" data-split style="margin-bottom:28px">Частые вопросы</h2>
      <div class="faq" data-reveal-stagger>
        <details class="faq-item" open><summary>Какие требования к резиденту?</summary><p>Клуб открыт для действующих предпринимателей и руководителей компаний Пермского края. Важны активность и готовность к партнёрству.</p></details>
        <details class="faq-item"><summary>Что входит в участие?</summary><p>Доступ к форумам, мастер-классам, стажировкам, нетворкингу и программе «Покупай у своих». Тарифы — у директора клуба.</p></details>
        <details class="faq-item"><summary>Как познакомиться с резидентами?</summary><p>Через гостевой визит, форумы и неформальные форматы. Начните с <a href="visit.html">заявки</a>.</p></details>
        <details class="faq-item"><summary>Как вступить?</summary><p>Оставьте заявку, посетите гостевую встречу и примите решение о вступлении.</p></details>
        <details class="faq-item"><summary>Сколько стоит?</summary><p>Актуальные условия: <a href="tel:+79630170017">+7 (963) 017-00-17</a> или club@delolife.club.</p></details>
        <details class="faq-item"><summary>Где проходит клуб?</summary><p>ул. 25 Октября, 4 · Бизнес-дом «Деловая жизнь». Часть встреч — ул. Ленина, 68.</p></details>
      </div>
    </div></section>
`;

bodies.team = `
    <section class="page-hero" data-bg="people"><div class="container">
      <p class="eyebrow">Команда</p>
      <h1 class="page-hero__title">Кто стоит за клубом</h1>
      <p class="page-hero__text">Президиум, VIP-резиденты и директор — люди, которые делают «Деловую жизнь».</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="grid"><div class="container">
      <p class="eyebrow" data-reveal>Президиум</p>
      <h2 class="section-title" data-split style="margin-bottom:28px">Организаторы</h2>
      <div class="residents-grid" data-reveal-stagger>
        ${people.filter((p) => ['irina-yuzhaninova','aleksandr-korenyakin','ekaterina-volochkova'].includes(p.slug)).map(rCard).join('\n        ')}
      </div>
      <div class="info-card" style="margin:40px 0" data-reveal>
        <h3>Директор клуба — Наталья Цаюкова</h3>
        <p><a href="tel:+79630170017">+7 (963) 017-00-17</a> · <a href="mailto:club@delolife.club">club@delolife.club</a></p>
        <p style="margin-top:12px"><a class="btn btn--line" href="founder.html">Страница основателя</a></p>
      </div>
      <p class="eyebrow" data-reveal>VIP</p>
      <h2 class="section-title" data-split style="margin-bottom:28px">Клуб в лицах</h2>
      <div class="residents-grid" data-reveal-stagger>
        ${people.filter((p) => p.vip).slice(0, 12).map(rCard).join('\n        ')}
      </div>
    </div></section>
`;

bodies.residents = `
    <section class="page-hero" data-bg="people"><div class="container">
      <p class="eyebrow">Резиденты</p>
      <h1 class="page-hero__title">Сильные предприниматели рядом</h1>
      <p class="page-hero__text">${people.length}+ резидентов: собственники, руководители и эксперты Пермского края.</p>
      <div style="margin-top:20px;display:grid;gap:14px">
        <input type="search" id="residentsFilter" class="filter-input" placeholder="Фильтр по имени или компании...">
        <div class="filter-chips" id="categoryFilters" data-reveal>
          <button type="button" class="chip is-active" data-cat="all">Все</button>
          ${[...new Set(people.map((p) => p.category).filter(Boolean))]
            .map((c) => `<button type="button" class="chip" data-cat="${c}">${CAT_LABELS[c] || c}</button>`)
            .join('\n          ')}
        </div>
      </div>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="grid"><div class="container">
      <div class="residents-grid" id="residentsGrid" data-reveal-stagger>
        ${people.map(rCard).join('\n        ')}
      </div>
    </div></section>
`;

bodies.blog = `
    <section class="page-hero" data-bg="news"><div class="container">
      <p class="eyebrow">Блог</p>
      <h1 class="page-hero__title">Истории и материалы клуба</h1>
      <p class="page-hero__text">Три раздела: нетворкинг, лайфхаки и кейсы.</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="formats"><div class="container grid-3" data-reveal-stagger>
      <a class="event-card event-card--media" href="${R}networking.html">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-45.jpg" alt="Нетворкинг" loading="lazy"></div>
        <div class="event-card__date">Раздел</div>
        <h3>Нетворкинг</h3>
        <p>Форматы знакомств, спорт, поездки и живые встречи резидентов.</p>
      </a>
      <a class="event-card event-card--media" href="${R}lifhaki.html">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-22.jpg" alt="Лайфхаки" loading="lazy"></div>
        <div class="event-card__date">Раздел</div>
        <h3>Лайфхаки</h3>
        <p>Практики роста, разборы и рабочие приёмы предпринимателей.</p>
      </a>
      <a class="event-card event-card--media" href="${R}cases.html">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-34.jpg" alt="Кейсы" loading="lazy"></div>
        <div class="event-card__date">Раздел</div>
        <h3>Кейсы</h3>
        <p>Сделки, стажировки и результаты программы «Покупай у своих».</p>
      </a>
    </div></section>
`;

bodies.ecosystem = `
    <section class="page-hero" data-bg="eco"><div class="container">
      <p class="eyebrow">Экосистема</p>
      <h1 class="page-hero__title">Всё для роста — в одном клубе</h1>
      <p class="page-hero__text">Форматы, партнёры и сервисы, которые помогают бизнесу двигаться быстрее.</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="why"><div class="container grid-2" data-reveal-stagger>
      <article class="info-card"><h3>Покупай у своих</h3><p>Товары и услуги резидентов — сделки остаются внутри сообщества.</p></article>
      <article class="info-card"><h3>ОПОРА РОССИИ</h3><p>Региональное партнёрство расширяет возможности участников.</p></article>
      <article class="info-card"><h3>Стажировки</h3><p>Экскурсии в компании и знакомство с первыми лицами.</p></article>
      <article class="info-card"><h3>Экспертиза</h3><p>Мастер-классы по продажам, маркетингу и управлению.</p></article>
    </div></section>
    <section class="section" data-bg="people"><div class="container"><div class="eco" data-reveal>
      <div class="eco__media"><img src="${A}/atmosphere/dj-12.jpg" alt="Бизнес-дом" data-parallax></div>
      <div class="eco__copy">
        <h2 class="section-title">Бизнес-дом на 25 Октября</h2>
        <p>Точка притяжения резидентов: встречи, события и рабочие коммуникации.</p>
        <div class="eco__actions">
          <a class="btn btn--fill" href="partnership.html" data-cta="eco_partner">Стать партнёром</a>
          <a class="btn btn--line" href="contacts.html">Как добраться</a>
        </div>
      </div>
    </div></div></section>
`;

bodies.events = `
    <section class="page-hero" data-bg="formats"><div class="container">
      <p class="eyebrow">Календарь</p>
      <h1 class="page-hero__title">События клуба</h1>
      <p class="page-hero__text">Форумы, мастер-классы, стажировки, «Разговоры за вином», спорт и досуг — форматы для роста бизнеса и сильных связей.</p>
    </div></section>

    <section class="section" style="padding-top:10px" data-bg="cta">
      <div class="container">
        <article class="next-event" data-reveal>
          <div class="next-event__badge">Ближайшее событие</div>
          <a class="next-event__main" href="${R}event-open-doors.html">
            <div class="next-event__media"><img src="${A}/atmosphere/dj-03.jpg" alt="День открытых дверей" loading="lazy"></div>
            <div class="next-event__body">
              <div class="next-event__date"><span class="next-event__day">12</span><span class="next-event__month">августа</span></div>
              <div class="next-event__info">
                <h2 class="next-event__title">День открытых дверей «Деловой жизни»</h2>
                <p class="next-event__meta">Бизнес-дом, ул. 25 Октября, 4 · Пермь</p>
                <p class="next-event__desc">Впервые в истории клуба — день открытых дверей. Увидите клуб изнутри, познакомитесь с резидентами и почувствуете атмосферу сообщества.</p>
              </div>
              <span class="next-event__more">Подробнее →</span>
            </div>
          </a>
          <div class="next-event__cta">
            <a class="btn btn--fill" href="visit.html" data-cta="next_event">Записаться</a>
          </div>
        </article>
      </div>
    </section>

    <section class="section section--sand" data-bg="news"><div class="container">
      <div class="res-head" data-reveal>
        <div>
          <p class="eyebrow">Расписание</p>
          <h2 class="section-title" data-split>Ближайшие события</h2>
        </div>
        <a class="btn btn--line" href="${R}events-archive.html">Архив событий</a>
      </div>
      <div class="filter-chips" id="eventFilters" style="margin:8px 0 22px" data-reveal>
        <button type="button" class="chip is-active" data-filter="all">Все</button>
        <button type="button" class="chip" data-filter="forum">Форум-группы</button>
        <button type="button" class="chip" data-filter="breakfast">Бизнес-завтраки</button>
        <button type="button" class="chip" data-filter="masterclass">Мастер-классы</button>
        <button type="button" class="chip" data-filter="networking">Нетворкинг</button>
      </div>
      <div class="events-list" id="eventsGrid" data-reveal-stagger>
        <a class="event-row" href="${R}event-breakfast-15.html" data-type="breakfast">
          <div class="event-row__date"><span>15</span><em>июля</em></div>
          <div class="event-row__body">
            <h3>Бизнес-завтрак</h3>
            <p class="event-row__meta">09:00 — 11:00 · Бизнес-дом, ул. 25 Октября, 4</p>
            <p>Тема: «Как масштабировать бизнес в 2026 году»</p>
          </div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="${R}event-forum-teh.html" data-type="forum">
          <div class="event-row__date"><span>18</span><em>июля</em></div>
          <div class="event-row__body">
            <h3>Форум-группа «Технологии»</h3>
            <p class="event-row__meta">18:00 — 20:00 · Бизнес-дом, переговорная №2</p>
            <p>Обсуждение внедрения AI в бизнес-процессы</p>
          </div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="${R}event-masterclass-prodaji.html" data-type="masterclass">
          <div class="event-row__date"><span>22</span><em>июля</em></div>
          <div class="event-row__body">
            <h3>Мастер-класс «Продажи»</h3>
            <p class="event-row__meta">14:00 — 17:00 · Бизнес-дом, зал мероприятий</p>
            <p>Практические техники повышения конверсии продаж</p>
          </div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="${R}event-networking-25.html" data-type="networking">
          <div class="event-row__date"><span>25</span><em>июля</em></div>
          <div class="event-row__body">
            <h3>Нетворкинг-вечер</h3>
            <p class="event-row__meta">19:00 — 21:00 · Бизнес-дом, ул. 25 Октября, 4</p>
            <p>Неформальное общение и знакомство с новыми резидентами</p>
          </div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="${R}event-forum-marketing.html" data-type="forum">
          <div class="event-row__date"><span>29</span><em>июля</em></div>
          <div class="event-row__body">
            <h3>Форум-группа «Маркетинг»</h3>
            <p class="event-row__meta">18:00 — 20:00 · Бизнес-дом, переговорная №1</p>
            <p>Анализ эффективности маркетинговых каналов</p>
          </div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="${R}event-breakfast-01.html" data-type="breakfast">
          <div class="event-row__date"><span>01</span><em>авг</em></div>
          <div class="event-row__body">
            <h3>Бизнес-завтрак</h3>
            <p class="event-row__meta">09:00 — 11:00 · Бизнес-дом, ул. 25 Октября, 4</p>
            <p>Тема: «Управление финансами в кризис»</p>
          </div>
          <span class="event-row__more">Подробнее →</span>
        </a>
      </div>
      <div style="margin-top:36px;text-align:center" data-reveal>
        <a class="btn btn--fill" href="visit.html" data-cta="events_visit">Стать гостем</a>
      </div>
    </div></section>
`;

const YMAP_LIGHT = 'https://yandex.ru/map-widget/v1/?ll=56.250773%2C58.010456&z=16&pt=56.250773,58.010456,pm2rdm&lang=ru_RU&theme=light';
const YMAP_DARK = 'https://yandex.ru/map-widget/v1/?ll=56.250773%2C58.010456&z=16&pt=56.250773,58.010456,pm2rdm&lang=ru_RU&theme=dark';

bodies.contacts = `
    <section class="page-hero" data-bg="cta"><div class="container">
      <p class="eyebrow">Контакты</p>
      <h1 class="page-hero__title">Будем рады знакомству</h1>
      <p class="page-hero__text">Напишите или позвоните — расскажем о гостевом визите и клубе.</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="grid"><div class="container contacts-layout">
      <div class="contacts-layout__info" data-reveal-stagger>
        <article class="contact-card"><h3>Телефон</h3><p><a href="tel:+79630170017">+7 (963) 017-00-17</a><br><a href="tel:+73422919593">+7 (342) 291-95-93</a></p></article>
        <article class="contact-card"><h3>Email</h3><p><a href="mailto:club@delolife.club">club@delolife.club</a></p></article>
        <article class="contact-card"><h3>Адрес</h3><p>г. Пермь, ул. 25 Октября, 4<br>Бизнес-дом «Деловая жизнь»<br><span style="color:var(--muted)">также: ул. Ленина, 68</span></p></article>
        <article class="contact-card"><h3>Соцсети</h3><p><a href="https://t.me/delolife_club" target="_blank" rel="noopener">Telegram</a> · <a href="https://wa.me/79630170017" target="_blank" rel="noopener">WhatsApp</a> · <a href="https://vk.com/delolife.club" target="_blank" rel="noopener">VK</a></p></article>
      </div>
      <div class="map" data-yandex-map data-reveal>
        <iframe class="map__frame map__frame--light" title="Яндекс Карта — светлая тема" loading="lazy" allowfullscreen src="${YMAP_LIGHT}"></iframe>
        <iframe class="map__frame map__frame--dark" title="Яндекс Карта — тёмная тема" loading="lazy" allowfullscreen src="${YMAP_DARK}"></iframe>
      </div>
    </div></section>
    <section class="section section--sand" id="form" data-bg="cta">
      <div class="container split">
        <div class="prose" data-reveal>
          <p class="eyebrow">Форма обратной связи</p>
          <h2 class="section-title">Напишите нам</h2>
          <p>Оставьте контакты — директор клуба свяжется и ответит на вопросы.</p>
          <p style="margin-top:12px"><a class="btn btn--line" href="${FORM}" target="_blank" rel="noopener" data-cta="contacts_yandex">Официальная анкета клуба</a></p>
        </div>
        <form class="form" id="contactForm" data-reveal>
          <label>Имя<input type="text" id="name" name="name" placeholder="Ваше имя" required></label>
          <label>Телефон<input type="tel" id="phone" name="phone" placeholder="+7 (963) 017-00-17" required></label>
          <label>Email<input type="email" id="email" name="email" placeholder="your@email.com" required></label>
          <label>Компания<input type="text" id="company" name="company" placeholder="Название компании"></label>
          <label>Сообщение<textarea id="message" name="message" rows="5" placeholder="Ваше сообщение или вопрос" required></textarea></label>
          <label class="form-consent"><input type="checkbox" name="consent" id="consent" required> Согласен на <a href="privacy.html">обработку персональных данных</a></label>
          <button class="btn btn--fill" type="submit" data-cta="contacts_submit">Отправить</button>
        </form>
      </div>
    </section>
`;

bodies.visit = `
    <section class="page-hero" data-bg="cta"><div class="container">
      <p class="eyebrow">Гостевой визит</p>
      <h1 class="page-hero__title">Почувствуйте атмосферу клуба</h1>
      <p class="page-hero__text">Приходите в гости: познакомьтесь с резидентами, форматами и командой.</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="eco"><div class="container split">
      <div class="split__media" data-reveal><img src="${A}/atmosphere/dj-12.jpg" alt="Пространство клуба" data-parallax></div>
      <div class="prose" data-reveal>
        <h2>Один визит — и атмосфера становится понятной</h2>
        <p>Вы увидите площадку, познакомитесь с командой и резидентами, зададите вопросы о форматах и резидентстве.</p>
      </div>
    </div></section>
    <section class="section" data-bg="why"><div class="container">
      <p class="eyebrow" data-reveal>Как попасть</p>
      <h2 class="section-title" data-split style="margin-bottom:28px">Три шага к клубу</h2>
      <div class="join-steps" data-reveal-stagger>
        <article class="join-step"><span class="join-step__num">1</span><h3>Заявка</h3><p>Заполните форму ниже или <a href="${FORM}" target="_blank" rel="noopener">официальную анкету клуба</a>.</p></article>
        <article class="join-step"><span class="join-step__num">2</span><h3>Знакомство</h3><p>Мы пригласим на событие или гостевую встречу с резидентами.</p></article>
        <article class="join-step"><span class="join-step__num">3</span><h3>Решение</h3><p>Оцените атмосферу и решите о вступлении вместе с командой клуба.</p></article>
      </div>
    </div></section>
    <section class="section section--sand" id="form" data-bg="cta"><div class="container split">
      <div class="prose" data-reveal>
        <h2>Записаться на гостевой визит</h2>
        <p>Оставьте контакты — свяжемся и подберём удобный формат знакомства.</p>
        <ul class="eco__list" style="margin:20px 0">
          <li>Знакомство с клубом и командой</li>
          <li>Живая атмосфера мероприятий</li>
          <li>Ответы на вопросы о резидентстве</li>
        </ul>
        <a class="btn btn--line" href="${FORM}" target="_blank" rel="noopener" data-cta="visit_form">Открыть анкету Яндекс.Формы</a>
      </div>
      <form class="form" id="contactForm" data-reveal>
        <label>Имя<input type="text" id="name" name="name" placeholder="Как вас зовут?" required></label>
        <label>Телефон<input type="tel" id="phone" name="phone" placeholder="+7 (963) 017-00-17" required></label>
        <label>Email<input type="email" id="email" name="email" placeholder="email@example.com" required></label>
        <label>Компания<input type="text" id="company" name="company" placeholder="Название вашей компании"></label>
        <label class="form-consent"><input type="checkbox" name="consent" id="consent" required> Согласен на <a href="privacy.html">обработку персональных данных</a></label>
        <button class="btn btn--fill" type="submit" data-cta="visit_submit">Отправить заявку</button>
        <p style="font-size:.8rem;color:var(--muted)">Или: club@delolife.club · +7 (963) 017-00-17</p>
      </form>
    </div></section>
`;

bodies.faq = `
    <section class="page-hero" data-bg="quotes"><div class="container">
      <p class="eyebrow">FAQ</p>
      <h1 class="page-hero__title">Частые вопросы</h1>
      <p class="page-hero__text">Коротко о вступлении, форматах и площадке клуба.</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="grid"><div class="container" style="max-width:800px">
      <div class="faq" data-reveal-stagger>
        <details class="faq-item" open><summary>Какие требования к резиденту?</summary><p>Клуб открыт для действующих предпринимателей и руководителей компаний Пермского края. Важны активность и готовность к партнёрству.</p></details>
        <details class="faq-item"><summary>Что входит в участие?</summary><p>Доступ к форумам, мастер-классам, стажировкам, нетворкингу и программе «Покупай у своих». Тарифы — у директора клуба.</p></details>
        <details class="faq-item"><summary>Как познакомиться с резидентами?</summary><p>Через гостевой визит, форумы и неформальные форматы. Начните с <a href="visit.html">заявки</a>.</p></details>
        <details class="faq-item"><summary>Как вступить?</summary><p>Оставьте заявку, посетите гостевую встречу и примите решение о вступлении.</p></details>
        <details class="faq-item"><summary>Сколько стоит?</summary><p>Актуальные условия: <a href="tel:+79630170017">+7 (963) 017-00-17</a> или club@delolife.club.</p></details>
        <details class="faq-item"><summary>Где проходит клуб?</summary><p>ул. 25 Октября, 4 · Бизнес-дом «Деловая жизнь». Часть встреч — ул. Ленина, 68.</p></details>
      </div>
    </div></section>
`;

bodies.partnership = `
    <section class="page-hero" data-bg="eco"><div class="container">
      <p class="eyebrow">Партнёрство</p>
      <h1 class="page-hero__title">Сотрудничество с клубом</h1>
      <p class="page-hero__text">Спонсорство, экспертные выступления и совместные проекты.</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="formats"><div class="container split">
      <div class="split__media" data-reveal><img src="${A}/atmosphere/dj-39.jpg" alt="Бренд клуба" data-parallax></div>
      <div class="prose" data-reveal>
        <h2>Станьте партнёром «Деловой жизни»</h2>
        <p>Предложите экспертизу, продукт или спонсорство — аудитория клуба это действующие предприниматели Пермского края.</p>
        <a class="btn btn--fill" href="mailto:club@delolife.club">Написать о партнёрстве</a>
      </div>
    </div></section>
    <section class="section section--sand" data-bg="why"><div class="container grid-3" data-reveal-stagger>
      <article class="info-card"><h3>События</h3><p>Партнёрство на форумах и мастер-классах клуба.</p></article>
      <article class="info-card"><h3>Экспертиза</h3><p>Выступления для аудитории предпринимателей края.</p></article>
      <article class="info-card"><h3>Комьюнити</h3><p>Доступ к закрытому кругу сильных компаний.</p></article>
    </div></div></section>
`;

bodies.privacy = `
    <section class="page-hero" data-bg="grid"><div class="container">
      <p class="eyebrow">Документы</p>
      <h1 class="page-hero__title">Политика конфиденциальности</h1>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="why"><div class="container prose" data-reveal>
      <p>Мы обрабатываем персональные данные (имя, телефон, email), которые вы оставляете в заявках, только для связи по вопросам клуба и гостевого визита.</p>
      <p>Данные не передаются третьим лицам, за исключением случаев, предусмотренных законом. По вопросам: club@delolife.club.</p>
      <p>Полная версия документов также доступна на основном сайте клуба.</p>
    </div></section>
`;

bodies.terms = `
    <section class="page-hero" data-bg="grid"><div class="container">
      <p class="eyebrow">Документы</p>
      <h1 class="page-hero__title">Пользовательское соглашение</h1>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="why"><div class="container prose" data-reveal>
      <p>Используя сайт, вы соглашаетесь с правилами обработки обращений и корректного использования материалов клуба «Деловая жизнь».</p>
      <p>Контент сайта предназначен для информирования о деятельности сообщества. Актуальные условия резидентства уточняйте у директора клуба.</p>
    </div></section>
`;

bodies['thank-you'] = `
    <section class="page-hero" data-bg="cta"><div class="container" style="text-align:center">
      <p class="eyebrow">Заявка</p>
      <h1 class="page-hero__title">Спасибо!</h1>
      <p class="page-hero__text" style="margin:0 auto">Мы получили обращение и свяжемся с вами.</p>
      <div style="margin-top:28px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a class="btn btn--fill" href="index.html">На главную</a>
        <a class="btn btn--line" href="events.html">События</a>
      </div>
    </div></section>
`;

bodies.networking = `
    <section class="page-hero" data-bg="why"><div class="container">
      <p class="eyebrow">Нетворкинг</p>
      <h1 class="page-hero__title">Знакомства, которые двигают бизнес</h1>
      <p class="page-hero__text">Форматы клуба для живых встреч, доверия и партнёрств между резидентами.</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="formats"><div class="container split">
      <div class="split__media" data-reveal><img src="${A}/atmosphere/dj-45.jpg" alt="Нетворкинг клуба" data-parallax></div>
      <div class="prose" data-reveal>
        <h2>Живые связи сильнее холодных контактов</h2>
        <p>В клубе знакомства рождаются на завтраках, форумах, спорте и поездках — там, где видно человека, а не только визитку.</p>
        <a class="btn btn--fill" href="article-networking-1.html">Читать материал</a>
      </div>
    </div></section>
    <section class="section section--sand" data-bg="news"><div class="container grid-3" data-reveal-stagger>
      <a class="event-card event-card--media" href="article-networking-1.html">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-26.jpg" alt="" loading="lazy"></div>
        <div class="event-card__date">Статья</div><h3>Как работают связи в клубе</h3><p>О пользе живых знакомств и доверия между резидентами.</p>
      </a>
      <article class="event-card event-card--media">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-34.jpg" alt="" loading="lazy"></div>
        <div class="event-card__date">Формат</div><h3>Завтраки и встречи</h3><p>Лёгкий нетворкинг в деловой атмосфере бизнес-дома.</p>
      </article>
      <article class="event-card event-card--media">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-01.jpg" alt="" loading="lazy"></div>
        <div class="event-card__date">Формат</div><h3>Разговоры за вином</h3><p>Неформальный формат, где рождаются сделки и дружба.</p>
      </article>
    </div>
    <div style="margin-top:32px;text-align:center" data-reveal>
      <a class="btn btn--fill" href="visit.html" data-cta="networking_visit">Стать гостем</a>
      <a class="btn btn--line" href="blog.html" style="margin-left:8px">Все разделы блога</a>
    </div></div></section>
`;

bodies.cases = `
    <section class="page-hero" data-bg="eco"><div class="container">
      <p class="eyebrow">Кейсы</p>
      <h1 class="page-hero__title">Результаты внутри сообщества</h1>
      <p class="page-hero__text">Истории сотрудничества и сделок по программе «Покупай у своих».</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="news"><div class="container grid-3" data-reveal-stagger>
      <a class="event-card event-card--media" href="article-cases-1.html">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-34.jpg" alt="" loading="lazy"></div>
        <div class="event-card__date">Кейс</div><h3>Сделки внутри клуба</h3><p>Как резиденты усиливают друг друга заказами и рекомендациями.</p>
      </a>
      <article class="event-card event-card--media">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-03.jpg" alt="" loading="lazy"></div>
        <div class="event-card__date">Результат</div><h3>500 млн₽+</h3><p>Объём сделок внутри сообщества — живой итог доверия.</p>
      </article>
      <article class="event-card event-card--media">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-20.jpg" alt="" loading="lazy"></div>
        <div class="event-card__date">Практика</div><h3>Стажировки в компании</h3><p>Экскурсии к резидентам и знакомство с первыми лицами.</p>
      </article>
    </div>
    <div style="margin-top:32px;text-align:center" data-reveal>
      <a class="btn btn--fill" href="ecosystem.html">Экосистема клуба</a>
      <a class="btn btn--line" href="blog.html" style="margin-left:8px">Все разделы блога</a>
    </div></div></section>
`;

bodies.lifhaki = `
    <section class="page-hero" data-bg="quotes"><div class="container">
      <p class="eyebrow">Лайфхаки</p>
      <h1 class="page-hero__title">Практики для руководителей</h1>
      <p class="page-hero__text">Короткие материалы и рабочие приёмы от участников клуба.</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="grid"><div class="container grid-3" data-reveal-stagger>
      <a class="event-card event-card--media" href="article-lifhaki-1.html">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-22.jpg" alt="" loading="lazy"></div>
        <div class="event-card__date">Практика</div><h3>Лайфхаки роста</h3><p>Приёмы, которые предприниматели применяют каждый день.</p>
      </a>
      <article class="event-card event-card--media">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-24.jpg" alt="" loading="lazy"></div>
        <div class="event-card__date">Разборы</div><h3>Бизнес-разборы</h3><p>Живой разбор задач с экспертами и резидентами клуба.</p>
      </article>
      <a class="event-card event-card--media" href="events.html">
        <div class="event-card__media"><img src="${A}/atmosphere/dj-07.jpg" alt="" loading="lazy"></div>
        <div class="event-card__date">События</div><h3>Учиться вживую</h3><p>Мастер-классы и форумы с разбором реальных задач.</p>
      </a>
    </div>
    <div style="margin-top:32px;text-align:center" data-reveal>
      <a class="btn btn--fill" href="visit.html">Стать гостем</a>
      <a class="btn btn--line" href="blog.html" style="margin-left:8px">Все разделы блога</a>
    </div></div></section>
`;

bodies['events-archive'] = `
    <section class="page-hero" data-bg="formats"><div class="container">
      <p class="eyebrow">Архив</p>
      <h1 class="page-hero__title">Прошедшие события клуба</h1>
      <p class="page-hero__text">Форумы, завтраки, мастер-классы и нетворкинг — что уже состоялось.</p>
    </div></section>
    <section class="section" data-bg="news"><div class="container">
      <div class="events-list" data-reveal-stagger>
        <a class="event-row" href="event-breakfast-15.html" data-type="breakfast">
          <div class="event-row__date"><span>15</span><em>июля</em></div>
          <div class="event-row__body"><h3>Бизнес-завтрак</h3><p class="event-row__meta">09:00 — 11:00 · Бизнес-дом</p><p>Тема: «Как масштабировать бизнес в 2026 году»</p></div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="event-forum-teh.html" data-type="forum">
          <div class="event-row__date"><span>18</span><em>июля</em></div>
          <div class="event-row__body"><h3>Форум-группа «Технологии»</h3><p class="event-row__meta">18:00 — 20:00 · переговорная №2</p><p>Обсуждение внедрения AI в бизнес-процессы</p></div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="event-masterclass-prodaji.html" data-type="masterclass">
          <div class="event-row__date"><span>22</span><em>июля</em></div>
          <div class="event-row__body"><h3>Мастер-класс «Продажи»</h3><p class="event-row__meta">14:00 — 17:00 · зал мероприятий</p><p>Практические техники повышения конверсии продаж</p></div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="event-networking-25.html" data-type="networking">
          <div class="event-row__date"><span>25</span><em>июля</em></div>
          <div class="event-row__body"><h3>Нетворкинг-вечер</h3><p class="event-row__meta">19:00 — 21:00 · Бизнес-дом</p><p>Неформальное общение и знакомство с новыми резидентами</p></div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="event-forum-marketing.html" data-type="forum">
          <div class="event-row__date"><span>29</span><em>июля</em></div>
          <div class="event-row__body"><h3>Форум-группа «Маркетинг»</h3><p class="event-row__meta">18:00 — 20:00 · переговорная №1</p><p>Анализ эффективности маркетинговых каналов</p></div>
          <span class="event-row__more">Подробнее →</span>
        </a>
        <a class="event-row" href="event-breakfast-01.html" data-type="breakfast">
          <div class="event-row__date"><span>01</span><em>авг</em></div>
          <div class="event-row__body"><h3>Бизнес-завтрак</h3><p class="event-row__meta">09:00 — 11:00 · Бизнес-дом</p><p>Тема: «Управление финансами в кризис»</p></div>
          <span class="event-row__more">Подробнее →</span>
        </a>
      </div>
      <div style="margin-top:32px;text-align:center" data-reveal>
        <a class="btn btn--fill" href="events.html">Актуальные форматы</a>
      </div>
    </div></section>
`;

bodies['event-open-doors'] = `
    <section class="page-hero" data-bg="formats"><div class="container">
      <nav class="crumbs" data-reveal>
        <a href="index.html">Главная</a><span>/</span>
        <a href="events.html">События</a><span>/</span>
        <em>День открытых дверей</em>
      </nav>
      <p class="eyebrow">12 августа</p>
      <h1 class="page-hero__title">День открытых дверей «Деловой жизни»</h1>
      <p class="page-hero__text">Впервые в истории клуба — день, когда можно увидеть сообщество изнутри.</p>
    </div></section>
    <section class="section" style="padding-top:10px" data-bg="cta"><div class="container split">
      <div class="split__media" data-reveal><img src="${A}/atmosphere/dj-03.jpg" alt="День открытых дверей" data-parallax></div>
      <div class="prose" data-reveal>
        <p class="eyebrow">Ближайшее событие</p>
        <h2>Знакомство с клубом за один день</h2>
        <p>Бизнес-дом, ул. 25 Октября, 4 · Пермь</p>
        <p>Увидите площадку, познакомитесь с резидентами, узнаете о форматах клуба и программе «Покупай у своих».</p>
        <ul class="eco__list" style="margin:18px 0">
          <li>Экскурсия по бизнес-дому</li>
          <li>Знакомство с командой и резидентами</li>
          <li>Ответы на вопросы о вступлении</li>
        </ul>
        <a class="btn btn--fill" href="visit.html" data-cta="open_doors_visit">Записаться</a>
        <a class="btn btn--line" href="events.html" style="margin-left:8px">Все события</a>
      </div>
    </div></section>
    <section class="section section--sand" data-bg="news"><div class="container">
      <h2 class="section-title" data-split style="margin-bottom:28px">Атмосфера клуба</h2>
      <div class="grid-3" data-reveal-stagger>
        <div class="split__media" style="min-height:220px"><img src="${A}/atmosphere/dj-34.jpg" alt="" loading="lazy"></div>
        <div class="split__media" style="min-height:220px"><img src="${A}/atmosphere/dj-01.jpg" alt="" loading="lazy"></div>
        <div class="split__media" style="min-height:220px"><img src="${A}/atmosphere/dj-12.jpg" alt="" loading="lazy"></div>
      </div>
    </div></section>
`;

bodies.founder = `
    <section class="page-hero" data-bg="people"><div class="container">
      <p class="eyebrow">Президент</p>
      <h1 class="page-hero__title">Ирина Южанинова</h1>
      <p class="page-hero__text">Президент клуба «Деловая жизнь», председатель ПРО «ОПОРА РОССИИ».</p>
    </div></section>
    <section class="section" data-bg="eco"><div class="container split">
      <div class="profile-photo mouse-dots tilt-card" data-reveal>
        <div class="mouse-dots__canvas" aria-hidden="true"></div>
        <img src="${A}/residents/irina-yuzhaninova.jpg" alt="Ирина Южанинова" data-parallax>
      </div>
      <div class="prose" data-reveal>
        <h2>О роли в клубе</h2>
        <p>Ирина Южанинова объединяет предпринимателей края, развивает сообщество и представляет интересы бизнеса вместе с «ОПОРА РОССИИ».</p>
        <a class="btn btn--fill" href="irina-yuzhaninova.html">Полный профиль</a>
        <a class="btn btn--line" href="team.html" style="margin-left:8px">Команда</a>
      </div>
    </div></div></section>
`;

/* Write CSS/JS copies for root mode */
fs.mkdirSync(outDir, { recursive: true });

const srcCss = path.join(root, 'designs', 'v6-atelier', 'style.css');
const srcMotion = path.join(root, 'designs', 'v6-atelier', 'motion.js');

if (toRoot) {
  fs.mkdirSync(path.join(root, 'css'), { recursive: true });
  fs.mkdirSync(path.join(root, 'js'), { recursive: true });
  fs.copyFileSync(srcCss, path.join(root, 'css', 'atelier.css'));
  fs.copyFileSync(srcMotion, path.join(root, 'js', 'atelier-motion.js'));
}

const searchIndex = people.map((p) => ({
  title: p.name,
  meta: [p.position, p.company].filter(Boolean).join(' · '),
  text: [p.name, p.position, p.company, p.description].filter(Boolean).join(' '),
  url: hrefOf(p),
}));

const dataJs = `window.ATELIER_RESIDENTS = ${JSON.stringify(searchIndex)};\n`;
if (toRoot) {
  fs.writeFileSync(path.join(root, 'js', 'atelier-residents.js'), dataJs, 'utf8');
} else {
  fs.writeFileSync(path.join(outDir, 'residents-data.js'), dataJs, 'utf8');
  // keep local style/motion as source of truth (already there)
}

for (const key of Object.keys(pagesMeta)) {
  const html = shell(key, bodies[key]);
  fs.writeFileSync(path.join(outDir, pagesMeta[key].file), html, 'utf8');
}

console.log(`Atelier built → ${toRoot ? 'ROOT (version-atelier)' : 'designs/v6-atelier'} (${Object.keys(pagesMeta).length} pages, ${people.length} residents)`);
