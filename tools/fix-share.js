const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const shareInner = `          <div class="share-buttons" data-share-root>
            <span class="share-buttons__label">Поделиться:</span>
            <a class="share-buttons__link" data-share="telegram" href="#" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a class="share-buttons__link" data-share="vk" href="#" target="_blank" rel="noopener noreferrer">VK</a>
            <a class="share-buttons__link" data-share="copy" href="#">Копировать ссылку</a>
          </div>`;

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith('.html')) continue;
  if (!name.startsWith('event-') && !name.startsWith('article-')) continue;
  const full = path.join(root, name);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  html = html.replace(
    /\s*<div class="container">\s*<div class="share-buttons" data-share-root>[\s\S]*?<\/div>\s*<\/div>\s*/g,
    `\n    <div class="container">\n${shareInner}\n    </div>\n`
  );

  html = html.replace(
    /\s*<div class="share-buttons" data-share-root>[\s\S]*?<\/div>\s*/g,
    `\n${shareInner}\n`
  );

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    console.log('Fixed:', name);
  }
}
console.log('Done.');
