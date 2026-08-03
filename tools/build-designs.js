/**
 * Builds 5 STRUCTURALLY different design variants + gallery.
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const designs = path.join(root, 'designs');
const A = '../../assets/images';

const head = (title, desc) => `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, follow">
  <title>${title} — Деловая жизнь</title>
  <meta name="description" content="${desc}">
  <link rel="icon" href="${A}/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Instrument+Serif:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>`;

const scripts = `
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="motion.js"></script>
  <script src="../shared-motion.js"></script>
`;

/* ========== V1: LUXURY — split screen, vertical brand, gold rules ========== */
function htmlV1() {
  return `${head('Luxury Gold', 'Премиум split-screen дизайн клуба Деловая жизнь')}
<body class="v1">
  <div class="progress" id="progress"></div>
  <aside class="rail">
    <a class="rail__logo" href="../../index.html">ДЕЛОВАЯ<br>ЖИЗНЬ</a>
    <p class="rail__year">с 2021</p>
    <nav class="rail__nav">
      <a href="../../about.html">О клубе</a>
      <a href="../../residents.html">Резиденты</a>
      <a href="../../events.html">События</a>
      <a href="../../contacts.html">Контакты</a>
    </nav>
    <a class="rail__back" href="../index.html">Все дизайны</a>
  </aside>

  <main class="stage">
    <section class="split">
      <div class="split__copy">
        <p class="eyebrow">Бизнес-клуб · Пермь</p>
        <h1 class="display">
          <span class="display__line">Место</span>
          <span class="display__line">силы для</span>
          <span class="display__line italic">бизнеса</span>
        </h1>
        <p class="lead">Крупнейшее сообщество предпринимателей края. Нетворкинг, поддержка и сделки внутри клуба.</p>
        <div class="actions">
          <a class="btn-gold" href="../../visit.html">Гостевой визит</a>
          <a class="btn-line" href="../../residents.html">Резиденты</a>
        </div>
        <ul class="metrics">
          <li><b>140</b><span>резидентов</span></li>
          <li><b>165+</b><span>событий</span></li>
          <li><b>500 млн₽</b><span>сделок</span></li>
        </ul>
      </div>
      <div class="split__visual">
        <img src="${A}/atmosphere/atm-01.jpg" alt="Атмосфера клуба">
        <div class="split__caption">ул. 25 Октября, 4 · Бизнес-дом</div>
      </div>
    </section>

    <section class="strip">
      <div class="strip__track">
        <article><em>01</em><h3>Форумы</h3><p>Разбор задач между предпринимателями</p></article>
        <article><em>02</em><h3>Мастер-классы</h3><p>Эксперты по продажам и росту</p></article>
        <article><em>03</em><h3>Стажировки</h3><p>В компаниях резидентов</p></article>
        <article><em>04</em><h3>Покупай у своих</h3><p>Сделки внутри сообщества</p></article>
        <article><em>05</em><h3>ОПОРА РОССИИ</h3><p>Шире возможности резидентов</p></article>
      </div>
    </section>

    <section class="duo">
      <figure>
        <img src="${A}/atmosphere/atm-05.jpg" alt="">
      </figure>
      <div>
        <h2>Лица клуба</h2>
        <a class="person" href="../../irina-yuzhaninova.html">
          <img src="${A}/residents/irina-yuzhaninova.jpg" alt="">
          <span>Ирина Южанинова · Президент</span>
        </a>
        <a class="person" href="../../ekaterina-volochkova.html">
          <img src="${A}/residents/ekaterina-volochkova.jpg" alt="">
          <span>Екатерина Волочкова · VIP</span>
        </a>
        <a class="person" href="../../aleksandr-korenyakin.html">
          <img src="${A}/residents/aleksandr-korenyakin.jpg" alt="">
          <span>Александр Коренякин · VIP</span>
        </a>
        <a class="btn-line" href="../../residents.html">Все резиденты →</a>
      </div>
    </section>

    <section class="invite">
      <h2>Увидьте клуб изнутри</h2>
      <a class="btn-gold" href="../../visit.html">Записаться на визит</a>
      <p>+7 (963) 017-00-17 · club@delolife.club</p>
    </section>
  </main>
${scripts}
</body>
</html>`;
}

/* ========== V2: CINEMATIC — full-bleed stacked scenes ========== */
function htmlV2() {
  return `${head('Cinematic Dark', 'Кинематографичный дизайн клуба Деловая жизнь')}
<body class="v2">
  <div class="progress" id="progress"></div>
  <header class="topbar">
    <a href="../../index.html">ДЕЛОВАЯ ЖИЗНЬ</a>
    <span>SCENE 01 / 04</span>
    <a href="../index.html">Дизайны</a>
  </header>

  <section class="scene scene--hero" data-scene="01">
    <img class="scene__bg" src="${A}/atmosphere/atm-01.jpg" alt="">
    <div class="scene__veil"></div>
    <div class="scene__content">
      <p class="tag">Пермь · Бизнес-клуб</p>
      <h1>
        <span>ДЕЛОВАЯ</span>
        <span>ЖИЗНЬ</span>
      </h1>
      <p class="sub">Крупнейшее сообщество предпринимателей Пермского края</p>
      <a class="play" href="../../visit.html"><i></i> Стать гостем</a>
    </div>
    <div class="scene__meta">
      <span>140 резидентов</span>
      <span>165+ событий</span>
      <span>500 млн₽ сделок</span>
    </div>
  </section>

  <section class="scene scene--story" data-scene="02">
    <img class="scene__bg" src="${A}/atmosphere/atm-05.jpg" alt="">
    <div class="scene__veil"></div>
    <div class="scene__content scene__content--side">
      <p class="tag">Глава II</p>
      <h2>Мы объединяем.<br>Мотивируем.<br>Строим связи.</h2>
      <p class="sub">Вместе с «ОПОРА РОССИИ» и программой «Покупай у своих» сделки остаются внутри сообщества.</p>
      <a class="link" href="../../about.html">О клубе →</a>
    </div>
  </section>

  <section class="reel" data-scene="03">
    <header>
      <p class="tag">Форматы</p>
      <h2>Что меняет вас</h2>
    </header>
    <div class="reel__row">
      <a href="../../events.html"><b>01</b><span>Форумы</span></a>
      <a href="../../events.html"><b>02</b><span>Мастер-классы</span></a>
      <a href="../../events.html"><b>03</b><span>Стажировки</span></a>
      <a href="../../ecosystem.html"><b>04</b><span>Покупай у своих</span></a>
    </div>
  </section>

  <section class="cast" data-scene="04">
    <header>
      <p class="tag">Cast</p>
      <h2>Лица клуба</h2>
    </header>
    <div class="cast__grid">
      <a href="../../irina-yuzhaninova.html">
        <img src="${A}/residents/irina-yuzhaninova.jpg" alt="">
        <div><strong>Ирина Южанинова</strong><em>Президент</em></div>
      </a>
      <a href="../../ekaterina-volochkova.html">
        <img src="${A}/residents/ekaterina-volochkova.jpg" alt="">
        <div><strong>Екатерина Волочкова</strong><em>VIP · Планета</em></div>
      </a>
      <a href="../../aleksandr-korenyakin.html">
        <img src="${A}/residents/aleksandr-korenyakin.jpg" alt="">
        <div><strong>Александр Коренякин</strong><em>VIP · ДКИ</em></div>
      </a>
    </div>
    <a class="cta-wide" href="../../visit.html">Записаться на гостевой визит</a>
  </section>

  <footer class="endcard">
    <p>г. Пермь, ул. 25 Октября, 4</p>
    <a href="tel:+79630170017">+7 (963) 017-00-17</a>
    <a href="../index.html">← К выбору дизайнов</a>
  </footer>
${scripts}
</body>
</html>`;
}

/* ========== V3: EDITORIAL — magazine layout ========== */
function htmlV3() {
  return `${head('Editorial Light', 'Magazine-дизайн клуба Деловая жизнь')}
<body class="v3">
  <div class="progress" id="progress"></div>
  <header class="masthead">
    <div class="masthead__top">
      <span>Пермь · №2026</span>
      <a href="../../index.html">ДЕЛОВАЯ ЖИЗНЬ</a>
      <a href="../index.html">5 дизайнов</a>
    </div>
    <nav class="masthead__nav">
      <a href="../../about.html">О клубе</a>
      <a href="../../residents.html">Резиденты</a>
      <a href="../../events.html">События</a>
      <a href="../../blog.html">Блог</a>
      <a href="../../contacts.html">Контакты</a>
      <a href="../../visit.html" class="masthead__cta">Гостевой визит</a>
    </nav>
  </header>

  <article class="issue">
    <header class="cover">
      <p class="kicker">Обложка · Бизнес-сообщество</p>
      <h1>Деловая<br>жизнь</h1>
      <p class="deck">Как крупнейший бизнес-клуб Пермского края строит связи, сделки и поддержку между предпринимателями.</p>
      <figure class="cover__photo">
        <img src="${A}/atmosphere/atm-01.jpg" alt="">
        <figcaption>Фото: атмосфера клуба · ул. 25 Октября, 4</figcaption>
      </figure>
    </header>

    <section class="columns">
      <div class="col col--lead">
        <p class="drop"><span>М</span>ы объединяем, мотивируем и выстраиваем бизнес-коммуникации. Вместе с «ОПОРА РОССИИ» возможности резидентов становятся шире. Программа «Покупай у своих» сохраняет сделки внутри сообщества — уже на сотни миллионов рублей.</p>
        <blockquote>
          «Гостевой визит — лучший способ почувствовать атмосферу клуба»
          <cite>— Наталья Цаюкова, директор</cite>
        </blockquote>
      </div>
      <aside class="col col--side">
        <h3>В цифрах</h3>
        <dl>
          <div><dt>140</dt><dd>резидентов</dd></div>
          <div><dt>165+</dt><dd>мероприятий</dd></div>
          <div><dt>500 млн₽</dt><dd>сделок</dd></div>
          <div><dt>14 000+</dt><dd>сотрудников</dd></div>
        </dl>
        <a href="../../visit.html">Записаться →</a>
      </aside>
    </section>

    <section class="toc">
      <h2>Содержание · Форматы</h2>
      <ol>
        <li><a href="../../events.html"><span>01</span><strong>Форумы</strong><em>Разбор задач и обмен опытом</em></a></li>
        <li><a href="../../events.html"><span>02</span><strong>Мастер-классы</strong><em>Эксперты по точечным темам</em></a></li>
        <li><a href="../../events.html"><span>03</span><strong>Стажировки</strong><em>В компаниях резидентов</em></a></li>
        <li><a href="../../ecosystem.html"><span>04</span><strong>Покупай у своих</strong><em>Сделки внутри клуба</em></a></li>
      </ol>
    </section>

    <section class="profiles">
      <h2>Портреты резидентов</h2>
      <div class="profiles__row">
        <a href="../../irina-yuzhaninova.html">
          <img src="${A}/residents/irina-yuzhaninova.jpg" alt="">
          <h3>Ирина Южанинова</h3>
          <p>Президент · ОПОРА РОССИИ</p>
        </a>
        <a href="../../ekaterina-volochkova.html">
          <img src="${A}/residents/ekaterina-volochkova.jpg" alt="">
          <h3>Екатерина Волочкова</h3>
          <p>VIP · «Планета»</p>
        </a>
        <a href="../../aleksandr-korenyakin.html">
          <img src="${A}/residents/aleksandr-korenyakin.jpg" alt="">
          <h3>Александр Коренякин</h3>
          <p>VIP · ДКИ</p>
        </a>
      </div>
    </section>
  </article>

  <footer class="colophon">
    <p>г. Пермь, ул. 25 Октября, 4 · +7 (963) 017-00-17</p>
    <a href="../index.html">← К выбору дизайнов</a>
  </footer>
${scripts}
</body>
</html>`;
}

/* ========== V4: GLASS — soft floating panels ========== */
function htmlV4() {
  return `${head('Soft Glass', 'Мягкий glass-дизайн клуба Деловая жизнь')}
<body class="v4">
  <div class="blob blob--1"></div>
  <div class="blob blob--2"></div>
  <div class="blob blob--3"></div>
  <div class="progress" id="progress"></div>

  <nav class="dock">
    <a class="dock__logo" href="../../index.html">Деловая жизнь</a>
    <div class="dock__links">
      <a href="../../about.html">О клубе</a>
      <a href="../../residents.html">Резиденты</a>
      <a href="../../events.html">События</a>
    </div>
    <a class="dock__cta" href="../../visit.html">Визит</a>
  </nav>

  <main class="soft">
    <section class="panel panel--hero">
      <p class="soft-label">Бизнес-клуб в Перми</p>
      <h1>Деловая<br>жизнь</h1>
      <p class="soft-text">Сообщество, где предприниматели находят партнёров, опору и новые сделки.</p>
      <div class="soft-actions">
        <a class="pill pill--fill" href="../../visit.html">Стать гостем</a>
        <a class="pill" href="../index.html">Все дизайны</a>
      </div>
      <div class="chips">
        <span>140 резидентов</span>
        <span>165+ событий</span>
        <span>500 млн₽</span>
      </div>
    </section>

    <section class="panel-row">
      <div class="panel">
        <h2>О клубе</h2>
        <p>С 2021 года объединяем бизнес Пермского края. Форумы, стажировки, «Покупай у своих» и партнёрство с ОПОРА РОССИИ.</p>
        <a href="../../about.html">Подробнее →</a>
      </div>
      <div class="panel panel--photo">
        <img src="${A}/atmosphere/atm-05.jpg" alt="">
      </div>
    </section>

    <section class="bubbles">
      <a class="bubble" href="../../events.html"><strong>Форумы</strong><span>Обмен опытом</span></a>
      <a class="bubble" href="../../events.html"><strong>Мастер-классы</strong><span>Эксперты</span></a>
      <a class="bubble" href="../../events.html"><strong>Стажировки</strong><span>В компаниях</span></a>
      <a class="bubble" href="../../ecosystem.html"><strong>Покупай у своих</strong><span>Сделки</span></a>
    </section>

    <section class="circles">
      <h2>Лица клуба</h2>
      <div class="circles__row">
        <a href="../../irina-yuzhaninova.html">
          <img src="${A}/residents/irina-yuzhaninova.jpg" alt="">
          <span>Ирина Южанинова</span>
        </a>
        <a href="../../ekaterina-volochkova.html">
          <img src="${A}/residents/ekaterina-volochkova.jpg" alt="">
          <span>Екатерина Волочкова</span>
        </a>
        <a href="../../aleksandr-korenyakin.html">
          <img src="${A}/residents/aleksandr-korenyakin.jpg" alt="">
          <span>Александр Коренякин</span>
        </a>
      </div>
    </section>

    <section class="panel panel--cta">
      <h2>Приходите в гости</h2>
      <p>Почувствуйте атмосферу клуба на гостевом визите.</p>
      <a class="pill pill--fill" href="../../visit.html">Записаться</a>
      <p class="soft-mini">+7 (963) 017-00-17 · club@delolife.club</p>
    </section>
  </main>
${scripts}
</body>
</html>`;
}

/* ========== V5: KINETIC — broken grid, huge type ========== */
function htmlV5() {
  return `${head('Bold Kinetic', 'Кинетический дизайн клуба Деловая жизнь')}
<body class="v5">
  <div class="progress" id="progress"></div>
  <div class="sticky-year">2021→</div>

  <header class="k-nav">
    <a href="../../index.html" class="k-logo">ДЖ</a>
    <a href="../../about.html">клуб</a>
    <a href="../../residents.html">люди</a>
    <a href="../../events.html">события</a>
    <a href="../index.html" class="k-all">5 дизайнов</a>
    <a href="../../visit.html" class="k-go">ВИЗИТ</a>
  </header>

  <section class="blast">
    <p class="blast__tag">пермь / бизнес-клуб</p>
    <h1 class="blast__title">
      <span class="t1">ДЕЛО</span>
      <span class="t2">ВАЯ</span>
      <span class="t3">ЖИЗНЬ</span>
    </h1>
    <p class="blast__sub">140 резидентов · 165+ событий · 500 млн₽ сделок внутри сообщества</p>
    <a class="blast__cta" href="../../visit.html">Стать гостем →</a>
    <img class="blast__img" src="${A}/atmosphere/atm-01.jpg" alt="">
  </section>

  <section class="band">
    <div class="band__inner">
      <span>Покупай у своих</span>
      <span>Форумы</span>
      <span>Стажировки</span>
      <span>ОПОРА РОССИИ</span>
      <span>РБК Пермь</span>
      <span>Покупай у своих</span>
      <span>Форумы</span>
      <span>Стажировки</span>
    </div>
  </section>

  <section class="rows">
    <a class="row" href="../../events.html"><b>01</b><h2>Форумы</h2><p>Разбор задач</p><i>→</i></a>
    <a class="row" href="../../events.html"><b>02</b><h2>Мастер-классы</h2><p>Эксперты</p><i>→</i></a>
    <a class="row" href="../../events.html"><b>03</b><h2>Стажировки</h2><p>В компаниях</p><i>→</i></a>
    <a class="row" href="../../ecosystem.html"><b>04</b><h2>Покупай у своих</h2><p>Сделки</p><i>→</i></a>
  </section>

  <section class="stack">
    <h2 class="stack__title">ЛИЦА</h2>
    <div class="stack__people">
      <a href="../../irina-yuzhaninova.html" style="--n:0">
        <img src="${A}/residents/irina-yuzhaninova.jpg" alt="">
        <span>Ирина Южанинова</span>
      </a>
      <a href="../../ekaterina-volochkova.html" style="--n:1">
        <img src="${A}/residents/ekaterina-volochkova.jpg" alt="">
        <span>Екатерина Волочкова</span>
      </a>
      <a href="../../aleksandr-korenyakin.html" style="--n:2">
        <img src="${A}/residents/aleksandr-korenyakin.jpg" alt="">
        <span>Александр Коренякин</span>
      </a>
    </div>
  </section>

  <section class="punch">
    <h2>УВИДЬТЕ<br>КЛУБ</h2>
    <a href="../../visit.html">ЗАПИСАТЬСЯ</a>
    <p>+7 (963) 017-00-17</p>
  </section>

  <footer class="k-foot">
    <a href="../index.html">← дизайны</a>
    <span>ул. 25 Октября, 4</span>
  </footer>
${scripts}
</body>
</html>`;
}

function galleryHtml() {
  const items = [
    { id: 'v1-luxury', name: 'Luxury Gold', tag: 'Split', desc: 'Боковая рейка + split-screen, золотые линии, горизонтальная лента' },
    { id: 'v2-cinematic', name: 'Cinematic Dark', tag: 'Cinema', desc: 'Полноэкранные сцены как в кино, veil, cast' },
    { id: 'v3-editorial', name: 'Editorial Light', tag: 'Magazine', desc: 'Журнальная вёрстка: колонки, цитата, содержание' },
    { id: 'v4-glass', name: 'Soft Glass', tag: 'Soft', desc: 'Плавающие панели, круги лиц, мягкие blob' },
    { id: 'v5-kinetic', name: 'Bold Kinetic', tag: 'Kinetic', desc: 'Ломаный тип, диагональ, строки-кнопки' },
    { id: 'v6-atelier', name: 'Atelier Luxury', tag: 'Mockup', desc: 'Полный сайт в стиле макета: крем, золото, serif, карусель, Lenis+GSAP' },
  ];
  const cards = items
    .map(
      (v, i) => `
    <a class="pick${v.id === 'v6-atelier' ? ' featured' : ''}" href="${v.id}/index.html" style="--i:${i}">
      <div class="pick__visual pick__visual--${i + 1}"></div>
      <div class="pick__meta">
        <span>${v.tag}</span>
        <h2>${v.name}</h2>
        <p>${v.desc}</p>
        <em>Открыть →</em>
      </div>
    </a>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, follow">
  <title>6 дизайнов — Деловая жизнь</title>
  <link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root { --bg:#0e0c0a; --text:#f4efe6; --muted:#b8a99a; --accent:#c9a96e; }
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'DM Sans',sans-serif;background:radial-gradient(1200px 600px at 20% -10%,#3a2a18 0%,var(--bg) 55%);color:var(--text);min-height:100vh;padding:40px 24px 80px}
    .top{max-width:1100px;margin:0 auto 48px;display:flex;justify-content:space-between;gap:20px;align-items:end;flex-wrap:wrap}
    .top a{color:var(--accent);text-decoration:none;font-weight:600}
    h1{font-family:Syne,sans-serif;font-size:clamp(2rem,5vw,3.6rem);letter-spacing:-.03em;line-height:1.05}
    .top p{color:var(--muted);max-width:420px;line-height:1.5}
    .grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
    .pick{display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.08);border-radius:24px;overflow:hidden;text-decoration:none;color:inherit;background:rgba(255,255,255,.03);transition:transform .45s, border-color .3s;animation:rise .7s both;animation-delay:calc(var(--i)*.08s)}
    .pick:hover{transform:translateY(-8px);border-color:rgba(201,169,110,.45)}
    .pick__visual{height:160px}
    .pick__visual--1{background:linear-gradient(90deg,#efe4d3 45%,#1c1610 45%),linear-gradient(135deg,#c9a96e,#8a6a3d)}
    .pick__visual--2{background:linear-gradient(180deg,#1a1510,#000)}
    .pick__visual--3{background:linear-gradient(180deg,#faf7f2 60%,#e8dfd0);border-bottom:3px solid #141414}
    .pick__visual--4{background:radial-gradient(circle at 30% 40%,#c4a574aa,#e9eef1 50%),radial-gradient(circle at 80% 20%,#7a8f7aaa,transparent)}
    .pick__visual--5{background:repeating-linear-gradient(-12deg,#111 0 40px,#e8b86d 40px 44px,#111 44px 90px)}
    .pick__visual--6{background:linear-gradient(135deg,#F8F6F3 0%,#E6E0DA 40%,#D8C5B3 70%,#B89A7A 100%)}
    .pick.featured{border-color:rgba(201,169,110,.4);box-shadow:0 0 0 1px rgba(201,169,110,.15)}
    .pick__meta{padding:22px}
    .pick__meta span{display:inline-block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:8px}
    .pick__meta h2{font-family:Syne,sans-serif;font-size:1.45rem;margin-bottom:8px}
    .pick__meta p{color:var(--muted);font-size:.95rem;line-height:1.45;margin-bottom:16px}
    .pick__meta em{font-style:normal;font-weight:600}
    @keyframes rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
  </style>
</head>
<body>
  <div class="top">
    <div>
      <h1>6 разных<br>дизайнов</h1>
    </div>
    <div>
      <p>V6 Atelier — полный сайт по макету. Остальные — разные концепции.</p>
      <a href="../index.html">← Основной сайт</a>
    </div>
  </div>
  <div class="grid">${cards}</div>
</body>
</html>`;
}

const pages = {
  'v1-luxury': htmlV1,
  'v2-cinematic': htmlV2,
  'v3-editorial': htmlV3,
  'v4-glass': htmlV4,
  'v5-kinetic': htmlV5,
};

fs.writeFileSync(path.join(designs, 'index.html'), galleryHtml(), 'utf8');
for (const [id, fn] of Object.entries(pages)) {
  const dir = path.join(designs, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), fn(), 'utf8');
}
console.log('Built 5 unique layouts + gallery');
