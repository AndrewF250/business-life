# Batch SEO / marketing patch for static HTML pages
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$base = 'https://andrewf250.github.io/business-life'
$ogImage = "$base/assets/images/og-default.png"
$favicon = 'assets/images/favicon.svg'

$noindexPages = @('404.html', 'thank-you.html', 'article.html', 'event.html')

$socialBlock = @'
<div><h4>Социальные сети</h4><div class="footer__social"><a href="https://t.me/delovaya_zhizn" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://wa.me/79991234567" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="https://vk.com/delovaya_zhizn" target="_blank" rel="noopener noreferrer">VK</a></div></div>
'@

$legalBlock = @'
<div class="footer__legal"><a href="privacy.html">Политика конфиденциальности</a><a href="terms.html">Пользовательское соглашение</a></div>
'@

$consentBlock = @'
          <div class="form-group form-group--consent">
            <label class="form-consent">
              <input type="checkbox" name="consent" id="consent" required>
              <span>Я согласен(на) на обработку персональных данных и принимаю <a href="privacy.html" target="_blank" rel="noopener">политику конфиденциальности</a></span>
            </label>
          </div>
'@

$files = Get-ChildItem -Path $root -Filter '*.html' -File

foreach ($file in $files) {
  $name = $file.Name
  $html = Get-Content -Path $file.FullName -Raw -Encoding UTF8
  $original = $html

  # Favicon
  $html = [regex]::Replace($html, "<link rel=`"icon`" href=`"[^`"]*`">", "<link rel=`"icon`" href=`"$favicon`" type=`"image/svg+xml`">")

  # Remove keywords meta (low value)
  $html = [regex]::Replace($html, "\s*<meta name=`"keywords`" content=`"[^`"]*`">\r?\n?", "`n")

  # Ensure og:locale / site_name before favicon or stylesheet if missing
  if ($html -notmatch 'property="og:locale"') {
    $html = $html -replace '(<meta property="og:url"[^>]*>)', "`$1`n  <meta property=`"og:locale`" content=`"ru_RU`">`n  <meta property=`"og:site_name`" content=`"Деловая жизнь`">"
  }

  # OG image + Twitter cards (insert after og:site_name or og:url)
  if ($html -notmatch 'property="og:image"') {
    $ogBlock = @"
  <meta property="og:image" content="$ogImage">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="PLACEHOLDER_TITLE">
  <meta name="twitter:description" content="PLACEHOLDER_DESC">
  <meta name="twitter:image" content="$ogImage">
"@
    if ($html -match 'property="og:site_name"[^>]*>') {
      $html = [regex]::Replace($html, '(<meta property="og:site_name"[^>]*>)', "`$1`n$ogBlock", 1)
    } elseif ($html -match 'property="og:url"[^>]*>') {
      $html = [regex]::Replace($html, '(<meta property="og:url"[^>]*>)', "`$1`n$ogBlock", 1)
    }

    $title = ''
    $desc = ''
    if ($html -match '<meta property="og:title" content="([^"]*)"') { $title = $Matches[1] }
    elseif ($html -match '<title>([^<]*)</title>') { $title = $Matches[1] }
    if ($html -match '<meta property="og:description" content="([^"]*)"') { $desc = $Matches[1] }
    elseif ($html -match '<meta name="description" content="([^"]*)"') { $desc = $Matches[1] }
    $html = $html.Replace('PLACEHOLDER_TITLE', $title).Replace('PLACEHOLDER_DESC', $desc)
  }

  # robots meta
  if ($noindexPages -contains $name) {
    if ($html -match 'name="robots"') {
      $html = [regex]::Replace($html, '<meta name="robots" content="[^"]*">', '<meta name="robots" content="noindex, nofollow">')
    } else {
      $html = $html -replace '(<meta name="viewport"[^>]*>)', "`$1`n  <meta name=`"robots`" content=`"noindex, nofollow`">"
    }
  } else {
    if ($html -notmatch 'name="robots"') {
      $html = $html -replace '(<meta name="viewport"[^>]*>)', "`$1`n  <meta name=`"robots`" content=`"index, follow`">"
    }
  }

  # site-config + analytics loader before script.js
  if ($html -notmatch 'js/site-config\.js') {
    $html = $html -replace '(<script src="js/script\.js"></script>)', "<script src=`"js/site-config.js`"></script>`n  `$1"
  }

  # Social footer links
  $html = [regex]::Replace(
    $html,
    '<div><h4>Социальные сети</h4><div class="footer__social">.*?</div></div>',
    $socialBlock.Trim(),
    [System.Text.RegularExpressions.RegexOptions]::Singleline
  )
  $html = [regex]::Replace(
    $html,
    '(?s)<div class="footer__social">\s*<a href="#">Telegram</a>\s*<a href="#">WhatsApp</a>\s*<a href="#">VK</a>\s*</div>',
    '<div class="footer__social"><a href="https://t.me/delovaya_zhizn" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://wa.me/79991234567" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="https://vk.com/delovaya_zhizn" target="_blank" rel="noopener noreferrer">VK</a></div>'
  )

  # Legal footer links
  $html = $html -replace '<a href="#">Политика конфиденциальности</a>', '<a href="privacy.html">Политика конфиденциальности</a>'
  $html = $html -replace '<a href="#">Пользовательское соглашение</a>', '<a href="terms.html">Пользовательское соглашение</a>'

  if ($html -match 'footer__legal' -and $html -notmatch 'terms\.html') {
    $html = [regex]::Replace(
      $html,
      '<div class="footer__legal">.*?</div>',
      $legalBlock.Trim(),
      [System.Text.RegularExpressions.RegexOptions]::Singleline
    )
  }

  # mailto / tel in footer contacts paragraphs
  $html = $html -replace '<p>\+7 \(999\) 123-45-67</p>', '<p><a href="tel:+79991234567">+7 (999) 123-45-67</a></p>'
  $html = $html -replace '<p>info@delovaya-zhizn\.ru</p>', '<p><a href="mailto:info@delovaya-zhizn.ru">info@delovaya-zhizn.ru</a></p>'

  # Consent checkbox before submit on forms
  if ($html -match 'id="contactForm"' -and $html -notmatch 'name="consent"') {
    $html = $html -replace '(<button type="submit"[^>]*>)', "$consentBlock`n          `$1"
  }

  # Share buttons for articles/events
  if (($name -like 'article-*.html' -or $name -like 'event-*.html') -and $html -notmatch 'class="share-buttons"') {
    $share = @'
        <div class="share-buttons" data-share>
          <span class="share-buttons__label">Поделиться:</span>
          <a class="share-buttons__link" data-share="telegram" href="#" target="_blank" rel="noopener noreferrer">Telegram</a>
          <a class="share-buttons__link" data-share="vk" href="#" target="_blank" rel="noopener noreferrer">VK</a>
          <a class="share-buttons__link" data-share="copy" href="#">Копировать ссылку</a>
        </div>
'@
    if ($html -match '</article>') {
      $html = $html -replace '</article>', "$share`n      </article>"
    } elseif ($html -match 'class="event-detail__description"') {
      $html = [regex]::Replace($html, '(</div>\s*</div>\s*</section>)', "$share`n`$1", 1)
    }
  }

  if ($html -ne $original) {
    [System.IO.File]::WriteAllText($file.FullName, $html, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Updated: $name"
  } else {
    Write-Host "Skip: $name"
  }
}

Write-Host 'Done.'
