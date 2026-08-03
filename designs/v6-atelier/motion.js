/* V6 Atelier — motionsites-style engine */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;

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

  /* Residents page filter */
  (function initFilter() {
    var input = document.getElementById('residentsFilter');
    var grid = document.getElementById('residentsGrid');
    if (!input || !grid) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      grid.querySelectorAll('.r-card').forEach(function (card) {
        var hay = ((card.getAttribute('data-name') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
        card.classList.toggle('is-hidden', q.length > 0 && hay.indexOf(q) === -1);
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
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
  gsap.utils.toArray('[data-reveal-stagger]').forEach(function (wrap) {
    var kids = wrap.children;
    gsap.from(kids, {
      y: 40, opacity: 0, stagger: 0.08, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 82%' }
    });
  });

  /* Split chars for section titles */
  document.querySelectorAll('[data-split]').forEach(function (title) {
    var text = title.textContent.trim();
    title.innerHTML = text.split('').map(function (c) {
      return c === ' ' ? ' ' : '<i class="ch">' + c + '</i>';
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

  /* Soft float on why cards after reveal */
  gsap.utils.toArray('.why-card').forEach(function (card, i) {
    gsap.to(card, {
      y: i % 2 ? -6 : 6, duration: 2.8 + i * 0.15, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.2
    });
  });
})();
