const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function insertSchema(html, json) {
  if (html.includes('application/ld+json')) return html;
  const block = `  <script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n  </script>\n`;
  return html.replace('<link rel="icon"', block + '<link rel="icon"');
}

function fixShare(html) {
  return html.replace(
    /<div class="container">\s*<div class="share-buttons" data-share-root>[\s\S]*?<\/div>\s*<\/div>/,
    `    <div class="container">
      <div class="share-buttons" data-share-root>
        <span class="share-buttons__label">Поделиться:</span>
        <a class="share-buttons__link" data-share="telegram" href="#" target="_blank" rel="noopener noreferrer">Telegram</a>
        <a class="share-buttons__link" data-share="vk" href="#" target="_blank" rel="noopener noreferrer">VK</a>
        <a class="share-buttons__link" data-share="copy" href="#">Копировать ссылку</a>
      </div>
    </div>`
  );
}

const articles = [
  {
    file: 'article-networking-1.html',
    title: 'Как эффективно нетворкить: 5 правил',
    description: 'Практические советы по налаживанию деловых связей от участников бизнес-клуба Деловая жизнь.',
    date: '2026-06-01'
  },
  {
    file: 'article-cases-1.html',
    title: 'Как увеличить оборот на 40% за год',
    description: 'Кейс резидента клуба Деловая жизнь об увеличении оборота за счёт партнёрств.',
    date: '2026-06-10'
  },
  {
    file: 'article-lifhaki-1.html',
    title: 'Тайм-менеджмент для предпринимателей',
    description: '7 проверенных техник тайм-менеджмента от резидентов бизнес-клуба Деловая жизнь.',
    date: '2026-06-20'
  }
];

const events = [
  {
    file: 'event-breakfast-15.html',
    name: 'Бизнес-завтрак «Как масштабировать бизнес в 2026 году»',
    start: '2026-07-15T09:00:00+03:00',
    end: '2026-07-15T11:00:00+03:00'
  },
  {
    file: 'event-forum-teh.html',
    name: 'Форум-группа «Технологии»: Внедрение AI в бизнес',
    start: '2026-07-18T10:00:00+03:00',
    end: '2026-07-18T13:00:00+03:00'
  },
  {
    file: 'event-masterclass-prodaji.html',
    name: 'Мастер-класс «Продажи»: Практические техники повышения конверсии',
    start: '2026-07-22T15:00:00+03:00',
    end: '2026-07-22T18:00:00+03:00'
  },
  {
    file: 'event-networking-25.html',
    name: 'Нетворкинг-вечер',
    start: '2026-07-25T19:00:00+03:00',
    end: '2026-07-25T22:00:00+03:00'
  },
  {
    file: 'event-forum-marketing.html',
    name: 'Форум-группа «Маркетинг»: Анализ эффективности каналов',
    start: '2026-07-29T10:00:00+03:00',
    end: '2026-07-29T13:00:00+03:00'
  },
  {
    file: 'event-breakfast-01.html',
    name: 'Бизнес-завтрак «Управление финансами в кризис»',
    start: '2026-08-01T09:00:00+03:00',
    end: '2026-08-01T11:00:00+03:00'
  }
];

for (const a of articles) {
  const full = path.join(root, a.file);
  let html = fs.readFileSync(full, 'utf8');
  html = fixShare(html);
  html = insertSchema(html, {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    author: { '@type': 'Organization', name: 'Деловая жизнь' },
    publisher: {
      '@type': 'Organization',
      name: 'Деловая жизнь',
      logo: {
        '@type': 'ImageObject',
        url: 'https://andrewf250.github.io/business-life/assets/images/favicon.svg'
      }
    },
    image: 'https://andrewf250.github.io/business-life/assets/images/og-default.png',
    mainEntityOfPage: `https://andrewf250.github.io/business-life/${a.file}`,
    inLanguage: 'ru-RU'
  });
  fs.writeFileSync(full, html, 'utf8');
  console.log('Article schema:', a.file);
}

for (const e of events) {
  const full = path.join(root, e.file);
  let html = fs.readFileSync(full, 'utf8');
  html = fixShare(html);
  html = insertSchema(html, {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.name,
    startDate: e.start,
    endDate: e.end,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Бизнес-дом',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Примерная, 1',
        addressLocality: 'Москва',
        addressCountry: 'RU'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: 'Деловая жизнь',
      url: 'https://andrewf250.github.io/business-life/'
    },
    image: 'https://andrewf250.github.io/business-life/assets/images/og-default.png',
    url: `https://andrewf250.github.io/business-life/${e.file}`
  });
  fs.writeFileSync(full, html, 'utf8');
  console.log('Event schema:', e.file);
}

// FAQ schema
{
  const full = path.join(root, 'faq.html');
  let html = fs.readFileSync(full, 'utf8');
  html = insertSchema(html, {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Как вступить в клуб?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Оставьте заявку на гостевой визит, пройдите короткое собеседование с организатором и посетите мероприятие как гость.'
        }
      },
      {
        '@type': 'Question',
        name: 'Сколько стоит участие?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Стоимость абонемента зависит от формата участия. Свяжитесь с нами для получения актуальных тарифов.'
        }
      },
      {
        '@type': 'Question',
        name: 'Какие требования к участникам?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Клуб открыт для действующих предпринимателей и руководителей компаний.'
        }
      },
      {
        '@type': 'Question',
        name: 'Как часто проходят мероприятия?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Форум-группы еженедельно, бизнес-завтраки и мастер-классы несколько раз в месяц.'
        }
      },
      {
        '@type': 'Question',
        name: 'Можно ли привести гостя?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Да, вы можете пригласить одного гостя на мероприятие. Гость должен быть предпринимателем или руководителем.'
        }
      }
    ]
  });
  fs.writeFileSync(full, html, 'utf8');
  console.log('FAQ schema: faq.html');
}

// BreadcrumbList for key pages
const breadcrumbs = {
  'about.html': [['Главная', 'index.html'], ['О клубе', 'about.html']],
  'contacts.html': [['Главная', 'index.html'], ['Контакты', 'contacts.html']],
  'events.html': [['Главная', 'index.html'], ['События', 'events.html']],
  'blog.html': [['Главная', 'index.html'], ['Блог', 'blog.html']],
  'visit.html': [['Главная', 'index.html'], ['Гостевой визит', 'visit.html']]
};

for (const [file, crumbs] of Object.entries(breadcrumbs)) {
  const full = path.join(root, file);
  let html = fs.readFileSync(full, 'utf8');
  if (html.includes('"@type": "BreadcrumbList"') || html.includes('"@type":"BreadcrumbList"')) continue;
  const itemListElement = crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c[0],
    item: c[1] === 'index.html'
      ? 'https://andrewf250.github.io/business-life/'
      : `https://andrewf250.github.io/business-life/${c[1]}`
  }));
  html = insertSchema(html, {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  });
  fs.writeFileSync(full, html, 'utf8');
  console.log('Breadcrumb:', file);
}

console.log('Done schemas.');
