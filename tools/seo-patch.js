const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const base = 'https://andrewf250.github.io/business-life';
const ogImage = `${base}/assets/images/og-default.png`;
const favicon = 'assets/images/favicon.svg';
const noindexPages = new Set(['404.html', 'thank-you.html', 'article.html', 'event.html']);

const socialInner =
  '<div class="footer__social"><a href="https://t.me/delovaya_zhizn" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://wa.me/79991234567" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="https://vk.com/delovaya_zhizn" target="_blank" rel="noopener noreferrer">VK</a></div>';

const consentBlock = `          <div class="form-group form-group--consent">
            <label class="form-consent">
              <input type="checkbox" name="consent" id="consent" required>
              <span>Я согласен(на) на обработку персональных данных и принимаю <a href="privacy.html" target="_blank" rel="noopener">политику конфиденциальности</a></span>
            </label>
          </div>
`;

const shareBlock = `        <div class="share-buttons" data-share-root>
          <span class="share-buttons__label">Поделиться:</span>
          <a class="share-buttons__link" data-share="telegram" href="#" target="_blank" rel="noopener noreferrer">Telegram</a>
          <a class="share-buttons__link" data-share="vk" href="#" target="_blank" rel="noopener noreferrer">VK</a>
          <a class="share-buttons__link" data-share="copy" href="#">Копировать ссылку</a>
        </div>
`;

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1] : '';
}

function patch(html, name) {
  let out = html;

  out = out.replace(/<link rel="icon" href="[^"]*">/, `<link rel="icon" href="${favicon}" type="image/svg+xml">`);
  out = out.replace(/\s*<meta name="keywords" content="[^"]*">\r?\n?/g, '\n');

  if (!/property="og:locale"/.test(out)) {
    out = out.replace(
      /(<meta property="og:url"[^>]*>)/,
      `$1\n  <meta property="og:locale" content="ru_RU">\n  <meta property="og:site_name" content="Деловая жизнь">`
    );
  }

  if (!/property="og:image"/.test(out)) {
    const title =
      pick(out, /<meta property="og:title" content="([^"]*)"/) ||
      pick(out, /<title>([^<]*)<\/title>/);
    const desc =
      pick(out, /<meta property="og:description" content="([^"]*)"/) ||
      pick(out, /<meta name="description" content="([^"]*)"/);

    const ogBlock = `  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${ogImage}">`;

    if (/property="og:site_name"/.test(out)) {
      out = out.replace(/(<meta property="og:site_name"[^>]*>)/, `$1\n${ogBlock}`);
    } else {
      out = out.replace(/(<meta property="og:url"[^>]*>)/, `$1\n${ogBlock}`);
    }
  }

  if (noindexPages.has(name)) {
    if (/name="robots"/.test(out)) {
      out = out.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
    } else {
      out = out.replace(/(<meta name="viewport"[^>]*>)/, `$1\n  <meta name="robots" content="noindex, nofollow">`);
    }
  } else if (!/name="robots"/.test(out)) {
    out = out.replace(/(<meta name="viewport"[^>]*>)/, `$1\n  <meta name="robots" content="index, follow">`);
  }

  if (!/js\/site-config\.js/.test(out)) {
    out = out.replace(
      /(<script src="js\/script\.js"><\/script>)/,
      '<script src="js/site-config.js"></script>\n  $1'
    );
  }

  out = out.replace(
    /<div class="footer__social">\s*<a href="#">Telegram<\/a>\s*<a href="#">WhatsApp<\/a>\s*<a href="#">VK<\/a>\s*<\/div>/g,
    socialInner
  );

  out = out.replace(/<a href="#">Политика конфиденциальности<\/a>/g, '<a href="privacy.html">Политика конфиденциальности</a>');
  out = out.replace(/<a href="#">Пользовательское соглашение<\/a>/g, '<a href="terms.html">Пользовательское соглашение</a>');

  if (/footer__legal/.test(out) && !/terms\.html/.test(out)) {
    out = out.replace(
      /<div class="footer__legal">[\s\S]*?<\/div>/,
      '<div class="footer__legal"><a href="privacy.html">Политика конфиденциальности</a><a href="terms.html">Пользовательское соглашение</a></div>'
    );
  }

  out = out.replace(/<p>\+7 \(999\) 123-45-67<\/p>/g, '<p><a href="tel:+79991234567">+7 (999) 123-45-67</a></p>');
  out = out.replace(/<p>info@delovaya-zhizn\.ru<\/p>/g, '<p><a href="mailto:info@delovaya-zhizn.ru">info@delovaya-zhizn.ru</a></p>');

  if (/id="contactForm"/.test(out) && !/name="consent"/.test(out)) {
    out = out.replace(/(<button type="submit"[^>]*>)/, `${consentBlock}          $1`);
  }

  if ((/^article-/.test(name) || /^event-/.test(name)) && !/class="share-buttons"/.test(out)) {
    if (/<\/article>/.test(out)) {
      out = out.replace('</article>', `${shareBlock}      </article>`);
    } else if (/event-detail__description/.test(out)) {
      out = out.replace(/(<\/div>\s*<\/div>\s*<\/section>)/, `${shareBlock}$1`);
    } else if (/<\/main>/.test(out)) {
      out = out.replace('</main>', `    <div class="container">${shareBlock}</div>\n  </main>`);
    }
  }

  return out;
}

const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
let updated = 0;
for (const name of files) {
  const full = path.join(root, name);
  const before = fs.readFileSync(full, 'utf8');
  const after = patch(before, name);
  if (after !== before) {
    fs.writeFileSync(full, after, 'utf8');
    console.log('Updated:', name);
    updated++;
  } else {
    console.log('Skip:', name);
  }
}
console.log('Done. Updated', updated, 'files.');
