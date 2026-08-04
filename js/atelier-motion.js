/* V6 Atelier — motionsites + animations.txt + kokonut/anime inspired */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;

  /* Preloader (animations.txt) */
  (function initPreloader() {
    var pre = document.getElementById('preloader');
    var logo = document.getElementById('preloaderLogo');
    var bar = document.getElementById('preloaderBar');
    var pct = document.getElementById('preloaderPct');
    if (!pre) return;
    if (reduce) { pre.classList.add('is-done'); pre.style.display = 'none'; return; }
    if (logo) {
      var text = logo.textContent.trim();
      logo.innerHTML = text.split('').map(function (c) {
        return c === ' ' ? ' ' : '<span class="char">' + c + '</span>';
      }).join('');
      if (window.gsap) {
        gsap.to(logo.querySelectorAll('.char'), {
          opacity: 1, y: 0, duration: 0.55, stagger: 0.035, ease: 'power3.out', delay: 0.1
        });
      }
    }
    var progress = 0;
    var timer = setInterval(function () {
      progress += Math.random() * 14 + 6;
      if (progress > 100) progress = 100;
      if (bar) bar.style.width = progress + '%';
      if (pct) pct.textContent = Math.round(progress) + '%';
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(function () {
          pre.classList.add('is-done');
          setTimeout(function () { pre.style.display = 'none'; }, 650);
        }, 120);
      }
    }, 70);
  })();

  /* Theme toggle + ripple */
  (function initTheme() {
    var themeToggle = document.getElementById('themeToggle');
    var overlay = document.getElementById('themeOverlay');
    if (!themeToggle) return;
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      var rect = themeToggle.getBoundingClientRect();
      var x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      var y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      if (overlay) {
        overlay.style.background = next === 'dark' ? '#121110' : '#F8F6F3';
        overlay.style.setProperty('--ripple-x', x + '%');
        overlay.style.setProperty('--ripple-y', y + '%');
        overlay.classList.remove('theme-transition-overlay--active');
        void overlay.offsetWidth;
        overlay.classList.add('theme-transition-overlay--active');
        setTimeout(function () {
          document.documentElement.setAttribute('data-theme', next);
          try { localStorage.setItem('theme', next); } catch (e) {}
          setTimeout(function () {
            overlay.classList.remove('theme-transition-overlay--active');
            overlay.style.background = 'transparent';
          }, 50);
        }, 600);
      } else {
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
      }
    });
  })();

  /* Resident search in header */
  (function initSearch() {
    var wrap = document.getElementById('siteSearchWrap');
    var toggle = document.getElementById('siteSearchToggle');
    var panel = document.getElementById('siteSearchPanel');
    var input = document.getElementById('siteSearch');
    var results = document.getElementById('siteSearchResults');
    var index = window.ATELIER_RESIDENTS || [];
    if (!toggle || !panel || !input || !results) return;

    function run() {
      var q = input.value.trim().toLowerCase();
      results.innerHTML = '';
      if (q.length < 2) return;
      var matches = index.filter(function (item) {
        return (item.title + ' ' + item.text).toLowerCase().indexOf(q) !== -1;
      }).slice(0, 10);
      if (!matches.length) {
        results.innerHTML = '<div class="site-search__empty">Резидент не найден</div>';
        return;
      }
      matches.forEach(function (item) {
        var a = document.createElement('a');
        a.href = item.url;
        a.className = 'site-search__item';
        a.innerHTML = '<span class="site-search__name">' + item.title + '</span>' +
          (item.meta ? '<span class="site-search__meta">' + item.meta + '</span>' : '');
        results.appendChild(a);
      });
    }

    var timer;
    toggle.addEventListener('click', function () {
      var open = !panel.hasAttribute('hidden');
      if (open) panel.setAttribute('hidden', '');
      else { panel.removeAttribute('hidden'); input.focus(); }
    });
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(run, 180);
    });
    document.addEventListener('click', function (e) {
      if (wrap && !wrap.contains(e.target)) panel.setAttribute('hidden', '');
    });
  })();

  /* Helpers from main root site */
  function getStoredUtm() {
    try { return JSON.parse(localStorage.getItem('bl_utm') || '{}'); } catch (e) { return {}; }
  }

  function showNotification(message, type) {
    var existing = document.querySelector('.notification');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.className = 'notification notification--' + (type || 'success');
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-hide');
      setTimeout(function () { el.remove(); }, 320);
    }, 4800);
  }

  function showFieldError(field, message) {
    if (!field) return;
    field.classList.add('error');
    var parent = field.closest('label') || field.parentNode;
    var existing = parent.querySelector('.error-message');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.className = 'error-message';
    div.textContent = message;
    parent.appendChild(div);
  }

  function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('error');
    var parent = field.closest('label') || field.parentNode;
    var existing = parent.querySelector('.error-message');
    if (existing) existing.remove();
  }

  function validateField(field) {
    var value = (field.value || '').trim();
    var ok = true;
    var msg = '';
    if (field.name === 'name' && value.length < 2) { ok = false; msg = 'Минимум 2 символа'; }
    if (field.name === 'phone' && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) { ok = false; msg = 'Введите корректный номер'; }
    if (field.name === 'email' && field.required && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { ok = false; msg = 'Введите корректный email'; }
    if (field.name === 'message' && field.required && value.length < 10) { ok = false; msg = 'Минимум 10 символов'; }
    if (!ok) showFieldError(field, msg);
    else clearFieldError(field);
    return ok;
  }

  window.blFormShake = function (btn) {
    if (btn && window.gsap) gsap.fromTo(btn, { x: -8 }, { x: 0, duration: 0.45, ease: 'elastic.out(1,0.35)' });
  };

  function trackEvent(name, payload) {
    var data = payload || {};
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, data);
      var ymId = window.SITE_CONFIG && window.SITE_CONFIG.analytics && window.SITE_CONFIG.analytics.yandexMetrikaId;
      if (ymId && typeof window.ym === 'function') window.ym(ymId, 'reachGoal', name, data);
      if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, data));
    } catch (e) {}
  }

  /* Residents + events filters (from main) */
  (function initFilter() {
    var input = document.getElementById('residentsFilter');
    var grid = document.getElementById('residentsGrid');
    var chips = document.getElementById('categoryFilters');
    var cat = 'all';
    function applyResidents() {
      if (!grid) return;
      var q = input ? input.value.trim().toLowerCase() : '';
      grid.querySelectorAll('.r-card').forEach(function (card) {
        var hay = ((card.getAttribute('data-name') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
        var c = card.getAttribute('data-category') || '';
        card.classList.toggle('is-hidden', !((cat === 'all' || c === cat) && (!q || hay.indexOf(q) !== -1)));
      });
    }
    if (input) input.addEventListener('input', applyResidents);
    if (chips) {
      chips.addEventListener('click', function (e) {
        var btn = e.target.closest('.chip');
        if (!btn) return;
        chips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
        btn.classList.add('is-active');
        cat = btn.getAttribute('data-cat') || 'all';
        applyResidents();
      });
    }

    var eventChips = document.getElementById('eventFilters');
    var eventGrid = document.getElementById('eventsGrid');
    if (eventChips && eventGrid) {
      eventChips.addEventListener('click', function (e) {
        var btn = e.target.closest('.chip,[data-filter]');
        if (!btn || btn.tagName === 'A') return;
        eventChips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var filter = btn.getAttribute('data-filter') || 'all';
        eventGrid.querySelectorAll('[data-type]').forEach(function (card) {
          var t = card.getAttribute('data-type') || '';
          card.classList.toggle('is-hidden', !(filter === 'all' || t === filter));
        });
      });
    }
  })();

  /* Yandex map theme sync */
  (function initYandexMapTheme() {
    function syncMaps() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.querySelectorAll('[data-yandex-map]').forEach(function (wrap) {
        wrap.classList.toggle('is-dark', dark);
      });
    }
    syncMaps();
    var obs = new MutationObserver(syncMaps);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  })();

  /* Analytics + UTM + CTA (full main root) */
  (function initTracking() {
    try {
      var params = new URLSearchParams(window.location.search);
      var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      var stored = {};
      var has = false;
      keys.forEach(function (key) {
        var val = params.get(key);
        if (val) { stored[key] = val; has = true; }
      });
      if (has) localStorage.setItem('bl_utm', JSON.stringify(stored));
    } catch (e) {}

    var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.analytics) || {};

    if (cfg.gtmId) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var f = d.getElementsByTagName(s)[0];
        var j = d.createElement(s);
        var dl = l !== 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', cfg.gtmId);
    }

    if (cfg.googleAnalyticsId) {
      var ga = document.createElement('script');
      ga.async = true;
      ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.googleAnalyticsId;
      document.head.appendChild(ga);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', cfg.googleAnalyticsId);
    }

    if (cfg.yandexMetrikaId && !window.ym) {
      (function (m, e, t, r, i) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
        m[i].l = 1 * new Date();
        var k = e.createElement(t);
        var a = e.getElementsByTagName(t)[0];
        k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
      window.ym(cfg.yandexMetrikaId, 'init', {
        clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true
      });
    }

    if (cfg.vkPixelId) {
      var t = document.createElement('script');
      t.async = true;
      t.src = 'https://vk.com/js/api/openapi.js?169';
      t.onload = function () {
        if (window.VK && window.VK.Retargeting) {
          window.VK.Retargeting.Init(cfg.vkPixelId);
          window.VK.Retargeting.Hit();
        }
      };
      document.head.appendChild(t);
    }

    document.querySelectorAll('a.btn, button.btn, [data-cta]').forEach(function (el) {
      el.addEventListener('click', function () {
        trackEvent(el.getAttribute('data-cta') || 'cta_click', {
          text: (el.textContent || '').trim().slice(0, 80),
          href: el.getAttribute('href') || ''
        });
      });
    });
  })();

  /* Share buttons — profile box + article/event roots */
  (function initShare() {
    var url = window.location.href;
    var encUrl = encodeURIComponent(url);
    var encTitle = encodeURIComponent(document.title);

    var wrap = document.querySelector('div[data-share]');
    if (wrap && !wrap.getAttribute('data-share')) {
      wrap.innerHTML =
        '<a class="btn btn--line" target="_blank" rel="noopener" href="https://t.me/share/url?url=' + encUrl + '&text=' + encTitle + '">Telegram</a>' +
        '<a class="btn btn--line" target="_blank" rel="noopener" href="https://vk.com/share.php?url=' + encUrl + '">VK</a>';
    }

    var root = document.querySelector('[data-share-root]') || document.querySelector('.share-buttons');
    if (!root) return;
    root.querySelectorAll('[data-share]').forEach(function (link) {
      var type = link.getAttribute('data-share');
      if (type === 'telegram') {
        link.setAttribute('href', 'https://t.me/share/url?url=' + encUrl + '&text=' + encTitle);
      } else if (type === 'vk') {
        link.setAttribute('href', 'https://vk.com/share.php?url=' + encUrl);
      } else if (type === 'copy') {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              var prev = link.textContent;
              link.textContent = 'Скопировано';
              showNotification('Ссылка скопирована', 'success');
              setTimeout(function () { link.textContent = prev; }, 1600);
            });
          }
        });
      }
    });
  })();

  /* Contact / visit form — full main root logic */
  (function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var hasMessage = !!form.querySelector('[name="message"]');

    form.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      var ok = true;
      if (!data.name || String(data.name).trim().length < 2) {
        showFieldError(form.querySelector('[name="name"]'), 'Пожалуйста, введите ваше имя');
        ok = false;
      }
      if (!data.phone || !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(String(data.phone))) {
        showFieldError(form.querySelector('[name="phone"]'), 'Пожалуйста, введите корректный номер');
        ok = false;
      }
      var emailField = form.querySelector('[name="email"]');
      if (emailField && emailField.required) {
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
          showFieldError(emailField, 'Пожалуйста, введите корректный email');
          ok = false;
        }
      }
      if (hasMessage && (!data.message || String(data.message).trim().length < 10)) {
        showFieldError(form.querySelector('[name="message"]'), 'Сообщение: минимум 10 символов');
        ok = false;
      }
      var consent = form.querySelector('[name="consent"]');
      if (consent && !consent.checked) {
        showNotification('Нужно согласие на обработку персональных данных', 'error');
        ok = false;
      }
      var submitBtn = form.querySelector('button[type="submit"]');
      if (!ok) {
        window.blFormShake(submitBtn);
        return;
      }

      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }

      var utm = getStoredUtm();
      Object.keys(utm).forEach(function (key) { formData.append(key, utm[key]); });
      formData.append('page', window.location.href);
      formData.append('submittedAt', new Date().toISOString());

      var cfg = window.SITE_CONFIG || {};
      var endpoint = cfg.formEndpoint || '';

      function finishOk() {
        try {
          var leads = JSON.parse(localStorage.getItem('bl_leads') || '[]');
          leads.push(Object.fromEntries(formData.entries()));
          localStorage.setItem('bl_leads', JSON.stringify(leads.slice(-50)));
        } catch (err) {}
        trackEvent('lead', { form: form.id || 'contactForm' });
        window.location.href = 'thank-you.html';
      }

      function finishFail() {
        showNotification('Не удалось отправить. Попробуйте ещё раз или напишите на email.', 'error');
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
      }

      if (endpoint) {
        fetch(endpoint, { method: 'POST', body: formData, headers: { Accept: 'application/json' } })
          .then(function (res) { if (!res.ok) throw new Error('fail'); finishOk(); })
          .catch(finishFail);
        return;
      }
      setTimeout(finishOk, 600);
    });
  })();

  /* Smooth scroll for #anchors (Lenis-aware) */
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var header = document.querySelector('.header');
        var offset = header ? header.offsetHeight + 12 : 0;
        if (window.lenis && typeof window.lenis.scrollTo === 'function') {
          window.lenis.scrollTo(target, { offset: -offset });
        } else {
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  })();

  /* Scroll to top */
  (function initScrollTop() {
    var btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('scroll-top--visible', window.pageYOffset > window.innerHeight * 0.7);
    }, { passive: true });
    btn.addEventListener('click', function () {
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  })();

  /* Progress */
  var progress = document.getElementById('progress');
  function onScrollProgress() {
    if (!progress) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (window.pageYOffset / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScrollProgress, { passive: true });

  /* Sticky header */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('is-solid', window.pageYOffset > 24);
  }, { passive: true });

  /* Mobile menu */
  var burger = document.getElementById('burger');
  var mobile = document.getElementById('mobileNav');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      mobile.classList.toggle('is-open');
      document.body.style.overflow = mobile.classList.contains('is-open') ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobile.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Residents carousel */
  (function initCarousel() {
    var root = document.querySelector('[data-carousel]');
    if (!root) return;
    var track = root.querySelector('.carousel__track');
    var prev = document.querySelector('[data-carousel-prev]');
    var next = document.querySelector('[data-carousel-next]');
    if (!track) return;
    var x = 0;
    var max = 0;
    function measure() {
      max = Math.max(0, track.scrollWidth - root.clientWidth);
      x = Math.min(x, max);
      track.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
    }
    function go(dir) {
      x = Math.max(0, Math.min(max, x + dir * 300));
      if (window.gsap) gsap.to(track, { x: -x, duration: 0.7, ease: 'power3.out' });
      else track.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
    }
    measure();
    window.addEventListener('resize', measure);
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    var dragging = false, startX = 0, startOff = 0;
    root.addEventListener('pointerdown', function (e) {
      dragging = true; startX = e.clientX; startOff = x; root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      x = Math.max(0, Math.min(max, startOff - (e.clientX - startX)));
      track.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
      if (window.gsap) gsap.set(track, { x: -x });
    });
    root.addEventListener('pointerup', function () { dragging = false; });
  })();

  if (!window.gsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger);

  /* Lenis smooth scroll */
  if (window.Lenis) {
    var lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }
    });
    window.lenis = lenis;
    document.documentElement.classList.add('lenis');
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* Hero title words */
  document.querySelectorAll('.hero__title .line').forEach(function (line) {
    var text = line.textContent.trim();
    line.innerHTML = text.split(/\s+/).map(function (w) {
      return '<span class="word">' + w + '</span>';
    }).join(' ');
  });
  gsap.from('.hero__title .word', {
    yPercent: 120, rotate: 4, opacity: 0, duration: 1.05, stagger: 0.06, ease: 'power4.out', delay: 0.15
  });
  gsap.from('.hero__label,.hero__text,.hero__cta', {
    y: 28, opacity: 0, duration: 0.85, stagger: 0.1, delay: 0.45, ease: 'power3.out'
  });
  gsap.from('.hero__visual', { y: 40, opacity: 0, scale: 1.04, duration: 1.2, delay: 0.35, ease: 'power3.out' });
  if (document.querySelector('.hero__visual img')) {
    gsap.to('.hero__visual img', {
      scale: 1.18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* Page hero */
  gsap.from('.page-hero__title,.page-hero__text', {
    y: 36, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out'
  });

  /* Stats count-up */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: target, duration: 1.6, ease: 'power2.out',
          onUpdate: function () {
            el.textContent = (target % 1 ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix;
          }
        });
      }
    });
  });
  gsap.from('.stats__item', {
    y: 24, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.stats__bar', start: 'top 85%' }
  });

  /* Reveal generic */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.from(el, {
      y: 48, opacity: 0, duration: 0.9, ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true, toggleActions: 'play none none none' }
    });
  });
  gsap.utils.toArray('[data-reveal-stagger]').forEach(function (wrap) {
    var kids = wrap.children;
    gsap.from(kids, {
      y: 36, opacity: 0, stagger: 0.08, duration: 0.75, ease: 'power3.out',
      immediateRender: false,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: wrap, start: 'top 82%', once: true, toggleActions: 'play none none none' }
    });
  });

  /* Split chars for section titles */
  document.querySelectorAll('[data-split]').forEach(function (title) {
    var text = title.textContent.trim();
    title.innerHTML = text.split('').map(function (c) {
      return c === ' ' ? ' ' : '<span class="ch">' + c + '</span>';
    }).join('');
    gsap.from(title.querySelectorAll('.ch'), {
      y: 40, opacity: 0, rotateX: -60, stagger: 0.016, duration: 0.55, ease: 'power3.out',
      scrollTrigger: { trigger: title, start: 'top 85%' }
    });
  });

  /* Parallax images */
  gsap.utils.toArray('[data-parallax]').forEach(function (img) {
    gsap.to(img, {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* Magnetic buttons */
  if (fine) {
    document.querySelectorAll('.btn--fill,.btn--line').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * 0.18,
          y: (e.clientY - r.top - r.height / 2) * 0.18,
          duration: 0.3
        });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  /* Animated palette background — different motion per page */
  (function initBgFx() {
    if (document.querySelector('.bg-fx') || reduce) return;
    var page = document.body.getAttribute('data-page') || 'index';
    var fx = document.createElement('div');
    fx.className = 'bg-fx';
    fx.setAttribute('aria-hidden', 'true');
    fx.innerHTML =
      '<div class="bg-fx__wash"></div>' +
      '<div class="bg-fx__blob bg-fx__blob--1"></div>' +
      '<div class="bg-fx__blob bg-fx__blob--2"></div>' +
      '<div class="bg-fx__blob bg-fx__blob--3"></div>' +
      '<div class="bg-fx__blob bg-fx__blob--4"></div>' +
      '<div class="bg-fx__spot"></div>';
    document.body.insertBefore(fx, document.body.firstChild);

    var presets = {
      index: { d1: 10, d2: 12, d3: 14, d4: 9, a: 90, rot: 8, scale: 1.15 },
      residents: { d1: 14, d2: 18, d3: 11, d4: 16, a: 120, rot: 14, scale: 1.25 },
      events: { d1: 8, d2: 10, d3: 9, d4: 11, a: 70, rot: 20, scale: 1.1 },
      'events-archive': { d1: 8, d2: 10, d3: 9, d4: 11, a: 70, rot: 18, scale: 1.1 },
      visit: { d1: 16, d2: 13, d3: 17, d4: 12, a: 60, rot: 6, scale: 1.3 },
      contacts: { d1: 12, d2: 15, d3: 10, d4: 14, a: 50, rot: 10, scale: 1.08 },
      about: { d1: 13, d2: 11, d3: 15, d4: 12, a: 80, rot: 12, scale: 1.18 },
      blog: { d1: 11, d2: 14, d3: 12, d4: 13, a: 75, rot: 16, scale: 1.12 },
      networking: { d1: 9, d2: 11, d3: 13, d4: 10, a: 85, rot: 22, scale: 1.2 },
      cases: { d1: 12, d2: 16, d3: 10, d4: 14, a: 95, rot: 9, scale: 1.22 },
      lifhaki: { d1: 15, d2: 12, d3: 16, d4: 11, a: 65, rot: 15, scale: 1.14 },
      ecosystem: { d1: 14, d2: 17, d3: 13, d4: 15, a: 100, rot: 11, scale: 1.28 },
      team: { d1: 13, d2: 12, d3: 14, d4: 11, a: 70, rot: 7, scale: 1.16 },
      founder: { d1: 15, d2: 13, d3: 16, d4: 12, a: 55, rot: 5, scale: 1.2 },
      faq: { d1: 11, d2: 13, d3: 12, d4: 10, a: 45, rot: 8, scale: 1.1 },
      partnership: { d1: 12, d2: 14, d3: 11, d4: 13, a: 80, rot: 13, scale: 1.17 },
      privacy: { d1: 18, d2: 16, d3: 20, d4: 15, a: 35, rot: 4, scale: 1.05 },
      terms: { d1: 18, d2: 16, d3: 20, d4: 15, a: 35, rot: 4, scale: 1.05 },
      'thank-you': { d1: 10, d2: 12, d3: 11, d4: 9, a: 60, rot: 10, scale: 1.2 }
    };
    var p = presets[page] || presets.index;
    if (window.gsap) {
      gsap.to('.bg-fx__blob--1', { x: p.a * 0.7, y: p.a * 0.4, duration: p.d1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.bg-fx__blob--2', { x: -p.a * 0.55, y: -p.a * 0.3, duration: p.d2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.bg-fx__blob--3', { x: p.a * 0.35, y: -p.a * 0.45, duration: p.d3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.bg-fx__blob--1', { opacity: 0.34, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to('.bg-fx__blob--2', { opacity: 0.26, duration: 6.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.8 });
      gsap.to('.bg-fx__blob--3', { opacity: 0.2, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.1 });
    }

    /* One global smooth cursor glow — no per-section staircase */
    if (fine) {
      var spot = fx.querySelector('.bg-fx__spot');
      var layer = document.createElement('div');
      layer.className = 'bg-fx__mouse';
      fx.appendChild(layer);
      /* Move animated blobs into mouse layer so cursor offset never fights GSAP tweens */
      fx.querySelectorAll('.bg-fx__blob').forEach(function (b) { layer.appendChild(b); });

      var tx = window.innerWidth * 0.5;
      var ty = window.innerHeight * 0.35;
      var cx = tx;
      var cy = ty;
      var mx = 0;
      var my = 0;
      var tmx = 0;
      var tmy = 0;
      window.addEventListener('pointermove', function (e) {
        tx = e.clientX;
        ty = e.clientY;
        tmx = (e.clientX / window.innerWidth - 0.5) * 40;
        tmy = (e.clientY / window.innerHeight - 0.5) * 28;
        fx.classList.add('is-cursor');
      }, { passive: true });
      document.documentElement.addEventListener('mouseleave', function () {
        fx.classList.remove('is-cursor');
        tmx = 0;
        tmy = 0;
      });
      (function tick() {
        cx += (tx - cx) * 0.1;
        cy += (ty - cy) * 0.1;
        mx += (tmx - mx) * 0.06;
        my += (tmy - my) * 0.06;
        if (spot) spot.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0) translate(-50%,-50%)';
        layer.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
        requestAnimationFrame(tick);
      })();
    }
  })();

  /* 3D tilt cards (animations.txt / motion feel) */
  if (fine) {
    document.querySelectorAll('.tilt-card,.why-card,.r-card,.info-card,.event-card,.qa-item').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotateY: px * 10, rotateX: -py * 10, transformPerspective: 900, duration: 0.3, ease: 'power2.out'
        });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.55, ease: 'power3.out' });
      });
    });
  }

  /* Hero mouse orb + dot grid */
  (function initHeroFx() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var orb = document.createElement('div');
    orb.className = 'hero__orb-follow';
    hero.appendChild(orb);
    gsap.to(orb, { opacity: 1, duration: 1.6, ease: 'power2.out' });
    var ox = 0, oy = 0, tx = 0, ty = 0;
    if (fine) {
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        tx = e.clientX - r.left;
        ty = e.clientY - r.top;
      });
      (function loop() {
        ox += (tx - ox) * 0.06;
        oy += (ty - oy) * 0.06;
        orb.style.left = ox + 'px';
        orb.style.top = oy + 'px';
        requestAnimationFrame(loop);
      })();
    }

    var grid = document.createElement('div');
    grid.className = 'hero__dots';
    for (var i = 0; i < 169; i++) {
      var d = document.createElement('i');
      d.className = 'dot';
      grid.appendChild(d);
    }
    hero.appendChild(grid);
    var dots = grid.querySelectorAll('.dot');
    var center = 6;
    dots.forEach(function (dot, i) {
      var row = Math.floor(i / 13);
      var col = i % 13;
      var dist = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
      gsap.fromTo(dot, { scale: 0.4, opacity: 0 }, {
        scale: 1.3, opacity: 0.65, duration: 0.45, delay: 0.4 + dist * 0.035,
        ease: 'power2.inOut', yoyo: true, repeat: 1,
        onComplete: function () { gsap.set(dot, { scale: 0.75, opacity: 0.28 }); }
      });
    });
    if (fine) {
      hero.addEventListener('mousemove', function (e) {
        dots.forEach(function (dot) {
          var rect = dot.getBoundingClientRect();
          var dx = e.clientX - (rect.left + rect.width / 2);
          var dy = e.clientY - (rect.top + rect.height / 2);
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            gsap.to(dot, {
              scale: gsap.utils.mapRange(0, 110, 2.4, 0.75, dist),
              opacity: gsap.utils.mapRange(0, 110, 0.9, 0.28, dist),
              duration: 0.25, ease: 'power2.out'
            });
          } else {
            gsap.to(dot, { scale: 0.75, opacity: 0.28, duration: 0.4 });
          }
        });
      });
    }
  })();

  /* Mouse-effect dots on .mouse-dots (kokonut-inspired, vanilla) */
  document.querySelectorAll('.mouse-dots').forEach(function (box) {
    var canvas = box.querySelector('.mouse-dots__canvas');
    if (!canvas || !fine) return;
    var spacing = 18;
    var dots = [];
    function build() {
      canvas.innerHTML = '';
      dots = [];
      var w = box.clientWidth;
      var h = box.clientHeight;
      for (var y = 0; y <= h; y += spacing) {
        for (var x = 0; x <= w; x += spacing) {
          if (Math.random() > 0.72) continue;
          var el = document.createElement('span');
          el.className = 'mouse-dots__dot';
          el.style.left = x + 'px';
          el.style.top = y + 'px';
          canvas.appendChild(el);
          dots.push({ el: el, x: x, y: y });
        }
      }
    }
    build();
    window.addEventListener('resize', build);
    box.addEventListener('mousemove', function (e) {
      var r = box.getBoundingClientRect();
      var mx = e.clientX - r.left;
      var my = e.clientY - r.top;
      dots.forEach(function (d) {
        var dx = d.x - mx;
        var dy = d.y - my;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          var force = (1 - dist / 80) * 18;
          var ang = Math.atan2(dy, dx);
          gsap.to(d.el, {
            x: Math.cos(ang) * force,
            y: Math.sin(ang) * force,
            opacity: 0.85,
            duration: 0.25,
            ease: 'power2.out'
          });
        } else {
          gsap.to(d.el, { x: 0, y: 0, opacity: 0.35, duration: 0.45, ease: 'power2.out' });
        }
      });
    });
    box.addEventListener('mouseleave', function () {
      dots.forEach(function (d) {
        gsap.to(d.el, { x: 0, y: 0, opacity: 0.35, duration: 0.5 });
      });
    });
  });

  /* anime.js stagger for legacy cards if available */
  if (window.anime) {
    var legacyCards = document.querySelectorAll('.content-legacy .resident-card, .content-legacy .news-card, .content-legacy .about__feature');
    if (legacyCards.length) {
      anime({
        targets: legacyCards,
        translateY: [40, 0],
        opacity: [0, 1],
        delay: anime.stagger(80, { start: 200 }),
        easing: 'easeOutCubic',
        duration: 700
      });
    }
  }

  /* Scroll fade for page hero crumbs */
  gsap.from('.crumbs', { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' });
})();
