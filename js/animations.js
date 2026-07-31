/* ========================================
   GSAP-анимации сайта «Деловая жизнь»
   Адаптировано из animations.txt (проект INTEGRA)
   Подключается динамически из js/script.js после загрузки GSAP
   ======================================== */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  if (window.blAnimationsInited) return;
  window.blAnimationsInited = true;

  var hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // Точный указатель (мышь), а не тачскрин
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ----------------------------------------
     Утилита: разбивка текста на символы
     ---------------------------------------- */
  function splitChars(el) {
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = text.trim().split(/\s+/).map(function (word) {
      return '<span class="split-word" aria-hidden="true">' + word.split('').map(function (c) {
        return '<span class="char">' + c + '</span>';
      }).join('') + '</span>';
    }).join(' ');
    return el.querySelectorAll('.char');
  }

  /* ----------------------------------------
     1–2. ПРЕЛОАДЕР — логотип + прогресс-бар
     ---------------------------------------- */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    var logo = document.getElementById('preloaderLogo');
    var fill = document.getElementById('preloaderBarFill');
    var counter = document.getElementById('preloaderCounter');

    if (logo) {
      var chars = splitChars(logo);
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.2
      });
    }

    var progress = 0;
    var loadInterval = setInterval(function () {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;
      if (fill) fill.style.width = progress + '%';
      if (counter) counter.textContent = Math.round(progress) + '%';
      if (progress >= 100) {
        clearInterval(loadInterval);
        try { sessionStorage.setItem('blPreloaderShown', '1'); } catch (e) {}
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          ease: 'power2.inOut',
          onComplete: function () { preloader.style.display = 'none'; }
        });
      }
    }, 80);
  }

  /* ----------------------------------------
     HERO: orb, точки, заголовок, параллакс
     ---------------------------------------- */
  function initHero() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var bg = hero.querySelector('.hero__animated-bg');
    var content = hero.querySelector('.hero__content');
    var layer = bg || hero;

    /* 4. Градиентный orb — появление + параллакс за мышью */
    var orb = document.createElement('div');
    orb.className = 'hero-gradient-orb';
    layer.appendChild(orb);
    gsap.fromTo(orb, { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.out' });

    if (finePointer) {
      var orbX = 0, orbY = 0, targetX = 0, targetY = 0;
      document.addEventListener('mousemove', function (e) {
        targetX = (e.clientX / window.innerWidth - 0.5) * 200;
        targetY = (e.clientY / window.innerHeight - 0.5) * 200;
      });
      (function updateOrb() {
        orbX += (targetX - orbX) * 0.03;
        orbY += (targetY - orbY) * 0.03;
        orb.style.transform = 'translate(' + orbX + 'px, ' + orbY + 'px)';
        requestAnimationFrame(updateOrb);
      })();
    }

    /* 5. Точки (dot grid) — появление из центра */
    var GRID_SIZE = 13;
    var dotGrid = document.createElement('div');
    dotGrid.className = 'dot-grid';
    var frag = document.createDocumentFragment();
    for (var i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      var d = document.createElement('div');
      d.className = 'dot';
      frag.appendChild(d);
    }
    dotGrid.appendChild(frag);
    layer.appendChild(dotGrid);

    var dots = dotGrid.querySelectorAll('.dot');
    var centerRow = Math.floor(GRID_SIZE / 2);
    var centerCol = Math.floor(GRID_SIZE / 2);

    dots.forEach(function (dot, idx) {
      var row = Math.floor(idx / GRID_SIZE);
      var col = idx % GRID_SIZE;
      var distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));

      gsap.fromTo(dot,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1.2,
          opacity: 0.7,
          duration: 0.5,
          delay: 0.5 + distance * 0.04,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1,
          onComplete: function () { gsap.set(dot, { scale: 0.75, opacity: 0.3 }); }
        }
      );
    });

    /* 6. Точки — реакция на мышь (proximity) */
    if (finePointer) {
      var mmX = 0, mmY = 0, ticking = false;
      document.addEventListener('mousemove', function (e) {
        mmX = e.clientX;
        mmY = e.clientY;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          var heroRect = hero.getBoundingClientRect();
          if (heroRect.bottom < 0) return;
          dots.forEach(function (dot) {
            var r = dot.getBoundingClientRect();
            var dist = Math.hypot(mmX - (r.left + r.width / 2), mmY - (r.top + r.height / 2));
            if (dist < 120) {
              var scale = gsap.utils.mapRange(0, 120, 2.5, 0.75, dist);
              var opacity = gsap.utils.mapRange(0, 120, 0.9, 0.3, dist);
              gsap.to(dot, { scale: scale, opacity: opacity, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
            } else {
              gsap.to(dot, { scale: 0.75, opacity: 0.3, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
            }
          });
        });
      });
    }

    /* 7. Заголовок — split-text reveal */
    var title = content ? content.querySelector('h1') : null;
    if (title) {
      var titleChars = splitChars(title);
      gsap.set(titleChars, { opacity: 0, y: 50 });
      gsap.to(titleChars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
        delay: 0.3
      });
    }

    /* 8. Подзаголовок + статистика + CTA (fade up) */
    var fadeUpEls = ['.hero__subtitle', '.hero__stats', '.hero__cta'];
    fadeUpEls.forEach(function (sel, idx) {
      var el = hero.querySelector(sel);
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6 + idx * 0.15, ease: 'power2.out' }
      );
    });

    /* 9. Scroll indicator — «Листайте» + пульсирующая линия */
    var scrollInd = document.createElement('div');
    scrollInd.className = 'hero-scroll';
    scrollInd.innerHTML = '<span class="hero-scroll__text">Листайте</span><span class="scroll-line"></span>';
    hero.appendChild(scrollInd);
    gsap.fromTo(scrollInd, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 1.4, ease: 'power2.out' });

    /* 10. Параллакс при скролле */
    if (hasScrollTrigger) {
      if (bg) {
        gsap.to(bg, {
          y: -120,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 }
        });
      }
      gsap.to(dotGrid, {
        y: -80,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 }
      });
      if (content) {
        gsap.to(content, {
          y: -100,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: '50% top', scrub: 1 }
        });
      }
      gsap.to(scrollInd, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '30% top', scrub: 1 }
      });
    }
  }

  /* ----------------------------------------
     13. SCROLL PROGRESS BAR
     ---------------------------------------- */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var scrollTop = window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ----------------------------------------
     14. SPLIT-TEXT — заголовки секций (h2)
     ---------------------------------------- */
  function initSectionTitles() {
    if (!hasScrollTrigger) return;
    document.querySelectorAll('main h2').forEach(function (title) {
      if (title.closest('.hero') || title.children.length > 0) return;
      var chars = splitChars(title);
      gsap.set(chars, { opacity: 0, y: 60, rotationX: -90, transformPerspective: 600 });
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: title, start: 'top 80%' }
      });
    });
  }

  /* ----------------------------------------
     15. EYEBROW — метки секций (посимвольно)
     ---------------------------------------- */
  function initEyebrows() {
    if (!hasScrollTrigger) return;
    document.querySelectorAll('main [class$="__label"]').forEach(function (el) {
      if (el.closest('.photo-zone') || el.closest('.hero__stat') || el.closest('.stats__item')) return;
      if (el.children.length > 0) return;
      var chars = splitChars(el);
      gsap.set(chars, { opacity: 0, y: 20 });
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  }

  /* ----------------------------------------
     17. Подчёркивание — разделители секций
     (адаптация accent-text underline)
     ---------------------------------------- */
  function initDividers() {
    if (!hasScrollTrigger) return;
    document.querySelectorAll('.section-divider').forEach(function (el) {
      var centered = el.classList.contains('section-divider--center');
      gsap.set(el, { scaleX: 0, transformOrigin: centered ? 'center center' : 'left center' });
      gsap.to(el, {
        scaleX: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }

  /* ----------------------------------------
     19. 3D TILT — карточки наклоняются к курсору
     ---------------------------------------- */
  function initTilt() {
    var cards = document.querySelectorAll(
      '.format-card, .benefits__card, .resident-card, .news-card, .testimonial-card, .event-card, .feature-card'
    );

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        if (card.style.opacity === '0') return;
        if (card.style.transition) card.style.transition = '';
        card.classList.add('js-tilt');

        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -5;
        var rotateY = (x - centerX) / centerX * 5;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 800,
          transformOrigin: 'center center'
        });
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
      });
    });
  }

  /* ----------------------------------------
     31. SECTION MORPHING — clip-path переходы
     ---------------------------------------- */
  function initSectionMorph() {
    if (!hasScrollTrigger) return;
    var sections = document.querySelectorAll('main > section');
    sections.forEach(function (section, i) {
      if (i === 0) return;
      gsap.fromTo(section,
        { clipPath: 'inset(6% 0 6% 0)' },
        {
          clipPath: 'inset(0% 0 0% 0)',
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 40%', scrub: 1 }
        }
      );
    });
  }

  /* ----------------------------------------
     32. FOOTER — появление (fade up)
     ---------------------------------------- */
  function initFooter() {
    if (!hasScrollTrigger) return;
    var footer = document.querySelector('.footer');
    if (!footer) return;
    var inner = footer.querySelector('.footer__container') || footer;
    gsap.set(inner, { opacity: 0, y: 20 });
    gsap.to(inner, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: footer, start: 'top 95%' }
    });
  }

  /* ----------------------------------------
     28–30. CUSTOM CURSOR — точка, кольцо, ripple
     ---------------------------------------- */
  function initCursor() {
    var cursor = document.createElement('div');
    cursor.className = 'bl-cursor';
    var follower = document.createElement('div');
    follower.className = 'bl-cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);
    document.documentElement.classList.add('has-custom-cursor');

    var mouseX = -100, mouseY = -100;
    var followerX = -100, followerY = -100;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    var xTo = gsap.quickTo(cursor, 'x', { duration: 0.1 });
    var yTo = gsap.quickTo(cursor, 'y', { duration: 0.1 });

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      xTo(mouseX);
      yTo(mouseY);
    });

    (function updateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.transform = 'translate(' + followerX + 'px, ' + followerY + 'px) translate(-50%, -50%)';
      requestAnimationFrame(updateFollower);
    })();

    /* 29. Hover-эффект на интерактивных элементах */
    var hoverSelector = 'a, button, .btn, input, textarea, select, [role="button"]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      }
    });

    /* 30. Click ripple — расходящееся кольцо */
    document.addEventListener('click', function (e) {
      var ripple = document.createElement('div');
      ripple.className = 'bl-cursor-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);

      gsap.to(ripple, {
        width: 100,
        height: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: function () { ripple.remove(); }
      });
    });
  }

  /* ----------------------------------------
     33. NOISE OVERLAY — текстура шума
     ---------------------------------------- */
  function initNoise() {
    var noise = document.createElement('div');
    noise.className = 'noise-overlay';
    document.body.appendChild(noise);
  }

  /* ----------------------------------------
     26. Форма — shake при ошибке (хук для script.js)
     ---------------------------------------- */
  window.blFormShake = function (btn) {
    if (!btn) return;
    gsap.fromTo(btn, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };

  /* ----------------------------------------
     27. Форма — success particles (хук для script.js)
     ---------------------------------------- */
  window.blSuccessParticles = function (btn) {
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var colors = ['#B89A7A', '#C9A96E', '#27AE60', '#D8C5B3'];

    for (var i = 0; i < 12; i++) {
      var particle = document.createElement('div');
      particle.style.cssText =
        'position: fixed; width: 6px; height: 6px;' +
        'border-radius: 50%; background: ' + colors[i % colors.length] + ';' +
        'pointer-events: none; z-index: 10001;' +
        'left: ' + (rect.left + rect.width / 2) + 'px;' +
        'top: ' + (rect.top + rect.height / 2) + 'px;';
      document.body.appendChild(particle);

      var angle = (i / 12) * Math.PI * 2;
      var distance = 80 + Math.random() * 60;

      (function (p, a, d) {
        gsap.to(p, {
          x: Math.cos(a) * d,
          y: Math.sin(a) * d - 40,
          opacity: 0,
          scale: 0,
          duration: 0.8 + Math.random() * 0.4,
          ease: 'power2.out',
          onComplete: function () { p.remove(); }
        });
      })(particle, angle, distance);
    }
  };

  /* ----------------------------------------
     Запуск
     ---------------------------------------- */
  initPreloader();
  initHero();
  initScrollProgress();
  initSectionTitles();
  initEyebrows();
  initDividers();
  initSectionMorph();
  initFooter();
  initNoise();
  if (finePointer) {
    initTilt();
    initCursor();
  }
})();
