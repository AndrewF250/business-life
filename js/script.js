/* ========================================
   Скрипты сайта «Деловая жизнь» — Премиум версия
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  initAnalytics();
  initUtmCapture();
  initTheme();
  initHeaderScroll();
  initBurgerMenu();
  initSiteSearch();
  initSlider();
  initFilters();
  initContactForm();
  initShareButtons();
  initSmoothScroll();
  initCountUp();
  initScrollAnimations();
  initHeroAnimatedBg();
  initScrollTop();
  trackCtaClicks();
});

/* ========================================
   Переключатель темы с радиусной анимацией
   ======================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const overlay = document.getElementById('themeOverlay');
  if (!themeToggle) return;
  
  // Проверяем сохраненную тему
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  themeToggle.addEventListener('click', function(e) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Получаем позицию кнопки для анимации
    const rect = themeToggle.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    
    if (overlay) {
      // Устанавливаем цвет оверлея в зависимости от НОВОЙ темы
      overlay.style.background = newTheme === 'dark' ? '#0D0D0D' : '#F8F6F3';
      overlay.style.setProperty('--ripple-x', x + '%');
      overlay.style.setProperty('--ripple-y', y + '%');
      
      // Запускаем анимацию
      overlay.classList.remove('theme-transition-overlay--active');
      void overlay.offsetWidth; // Force reflow
      overlay.classList.add('theme-transition-overlay--active');
      
      // Меняем тему ПОСЛЕ завершения анимации (600ms)
      setTimeout(function() {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Убираем оверлей после смены темы
        setTimeout(function() {
          overlay.classList.remove('theme-transition-overlay--active');
          overlay.style.background = 'transparent';
        }, 50);
      }, 600);
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  });
}

/* ========================================
   Фиксированная шапка с эффектом скролла
   ======================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  
  let lastScroll = 0;
  const scrollThreshold = 50;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ========================================
   Бургер-меню — Премиум
   ======================================== */
function initBurgerMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const actions = document.getElementById('actions');
  
  if (!burger || !nav) return;
  
  let isOpen = false;
  
  burger.addEventListener('click', function() {
    isOpen = !isOpen;
    
    if (isOpen) {
      nav.classList.add('header__nav--open');
      if (actions) actions.classList.add('header__actions--open');
      burger.classList.add('header__burger--open');
      burger.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      burger.setAttribute('aria-label', 'Закрыть меню');
      document.body.style.overflow = 'hidden';
    } else {
      nav.classList.remove('header__nav--open');
      if (actions) actions.classList.remove('header__actions--open');
      burger.classList.remove('header__burger--open');
      burger.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
      burger.setAttribute('aria-label', 'Меню');
      document.body.style.overflow = '';
    }
  });
  
  // Закрытие по клику на ссылку
  const navLinks = nav.querySelectorAll('.header__link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (isOpen) {
        burger.click();
      }
    });
  });
  
  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      burger.click();
    }
  });
}

/* ========================================
   Слайдер резидентов — бесшовная зацикленная карусель
   ======================================== */
function initSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;
  
  const track = slider.querySelector('.slider__track');
  const originalCards = Array.from(track.querySelectorAll('.resident-card:not(.clone)'));
  const prevBtn = slider.querySelector('.slider__btn--prev');
  const nextBtn = slider.querySelector('.slider__btn--next');
  const dotsContainer = slider.querySelector('.slider__dots');
  
  if (!track || originalCards.length === 0) return;
  
  const totalCards = originalCards.length;
  let currentPos = 0;
  let isTransitioning = false;
  
  function getCardsToShow() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }
  
  // Создаём бесшовную карусель: [клон конца] [оригиналы] [клон начала]
  function buildTrack() {
    const cardsToShow = getCardsToShow();
    
    // Очищаем трек
    track.innerHTML = '';
    
    // Клон последних N карточек (для прокрутки назад)
    for (let i = totalCards - cardsToShow; i < totalCards; i++) {
      track.appendChild(originalCards[i].cloneNode(true));
    }
    
    // Оригинальные карточки
    originalCards.forEach(card => track.appendChild(card.cloneNode(true)));
    
    // Клон первых N карточек (для прокрутки вперёд)
    for (let i = 0; i < cardsToShow; i++) {
      track.appendChild(originalCards[i].cloneNode(true));
    }
    
    // Начальная позиция — на оригиналах
    currentPos = cardsToShow;
    setPosition(false);
  }
  
  function setPosition(animate) {
    const cardsToShow = getCardsToShow();
    const allCards = track.children;
    const total = allCards.length;
    const cardWidth = 100 / total;
    const trackWidth = (total / cardsToShow) * 100;
    
    track.style.width = trackWidth + '%';
    track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    track.style.transform = 'translateX(' + (-(currentPos * cardWidth)) + '%)';
    
    for (let i = 0; i < total; i++) {
      allCards[i].style.width = cardWidth + '%';
      allCards[i].style.flex = '0 0 ' + cardWidth + '%';
      allCards[i].style.boxSizing = 'border-box';
      allCards[i].style.padding = '0 12px';
    }
    
    updateDots();
  }
  
  function updateDots() {
    if (!dotsContainer) return;
    const cardsToShow = getCardsToShow();
    let realIndex = currentPos - cardsToShow;
    realIndex = ((realIndex % totalCards) + totalCards) % totalCards;
    
    const dots = dotsContainer.querySelectorAll('.slider__dot');
    dots.forEach(function(dot, i) {
      dot.classList.toggle('slider__dot--active', i === realIndex);
    });
  }
  
  function slideNext() {
    if (isTransitioning) return;
    const cardsToShow = getCardsToShow();
    const allCards = track.children;
    const maxPos = allCards.length - cardsToShow;
    
    currentPos++;
    setPosition(true);
    
    // Если дошли до клонов в конце — перескакиваем на оригинал
    if (currentPos >= maxPos) {
      isTransitioning = true;
      track.addEventListener('transitionend', function handler() {
        track.removeEventListener('transitionend', handler);
        currentPos = cardsToShow;
        setPosition(false);
        isTransitioning = false;
      });
    }
  }
  
  function slidePrev() {
    if (isTransitioning) return;
    const cardsToShow = getCardsToShow();
    
    currentPos--;
    setPosition(true);
    
    // Если дошли до клонов в начале — перескакиваем на оригинал
    if (currentPos < cardsToShow) {
      isTransitioning = true;
      track.addEventListener('transitionend', function handler() {
        track.removeEventListener('transitionend', handler);
        const allCards = track.children;
        currentPos = allCards.length - cardsToShow * 2;
        setPosition(false);
        isTransitioning = false;
      });
    }
  }
  
  function goToDot(index) {
    if (isTransitioning) return;
    const cardsToShow = getCardsToShow();
    currentPos = index + cardsToShow;
    setPosition(true);
  }
  
  // Навигация
  if (prevBtn) prevBtn.addEventListener('click', slidePrev);
  if (nextBtn) nextBtn.addEventListener('click', slideNext);
  
  // Точки
  if (dotsContainer) {
    dotsContainer.addEventListener('click', function(e) {
      var dot = e.target.closest('.slider__dot');
      if (!dot) return;
      var dots = Array.from(dotsContainer.querySelectorAll('.slider__dot'));
      goToDot(dots.indexOf(dot));
    });
  }
  
  // Автопрокрутка
  var autoplay = setInterval(slideNext, 5000);
  slider.addEventListener('mouseenter', function() { clearInterval(autoplay); });
  slider.addEventListener('mouseleave', function() { autoplay = setInterval(slideNext, 5000); });
  
  // Ресайз
  window.addEventListener('resize', debounce(buildTrack, 300));
  
  // Свайп
  var touchStartX = 0;
  track.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? slideNext() : slidePrev();
    }
  }, { passive: true });
  
  buildTrack();
}

/* ========================================
   Фильтры
   ======================================== */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.resident-card[data-category], .event-card[data-type]');
  
  if (filterBtns.length === 0 || cards.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      // Обновляем активную кнопку
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      this.classList.add('filter-btn--active');
      
      // Фильтруем карточки
      cards.forEach(card => {
        const category = card.dataset.category || card.dataset.type;
        
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ========================================
   Форма обратной связи
   ======================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const hasMessage = !!form.querySelector('[name="message"]');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (!validateForm(data, { requireMessage: hasMessage })) {
      if (window.blFormShake) window.blFormShake(form.querySelector('button[type="submit"]'));
      return;
    }

    const consent = form.querySelector('[name="consent"]');
    if (consent && !consent.checked) {
      showNotification('Нужно согласие на обработку персональных данных', 'error');
      if (window.blFormShake) window.blFormShake(form.querySelector('button[type="submit"]'));
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    const utm = getStoredUtm();
    Object.keys(utm).forEach(function(key) {
      formData.append(key, utm[key]);
    });
    formData.append('page', window.location.href);
    formData.append('submittedAt', new Date().toISOString());

    const cfg = window.SITE_CONFIG || {};
    const endpoint = cfg.formEndpoint || '';

    function finishOk() {
      try {
        const leads = JSON.parse(localStorage.getItem('bl_leads') || '[]');
        leads.push(Object.fromEntries(formData.entries()));
        localStorage.setItem('bl_leads', JSON.stringify(leads.slice(-50)));
      } catch (err) {}

      trackEvent('lead', { form: form.id || 'contactForm' });
      if (window.blSuccessParticles) window.blSuccessParticles(submitBtn);
      window.location.href = 'thank-you.html';
    }

    function finishFail() {
      showNotification('Не удалось отправить. Попробуйте ещё раз или напишите на email.', 'error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }

    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      }).then(function(res) {
        if (!res.ok) throw new Error('fail');
        finishOk();
      }).catch(finishFail);
      return;
    }

    // Без endpoint: сохраняем локально и ведём на thank-you
    setTimeout(finishOk, 600);
  });

  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });
}

function validateForm(data, options) {
  const opts = options || {};
  let isValid = true;

  if (!data.name || data.name.trim().length < 2) {
    showFieldError('name', 'Пожалуйста, введите ваше имя');
    isValid = false;
  }

  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  if (!data.phone || !phoneRegex.test(data.phone)) {
    showFieldError('phone', 'Пожалуйста, введите корректный номер телефона');
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError('email', 'Пожалуйста, введите корректный email');
    isValid = false;
  }

  if (opts.requireMessage) {
    if (!data.message || data.message.trim().length < 10) {
      showFieldError('message', 'Пожалуйста, введите сообщение (минимум 10 символов)');
      isValid = false;
    }
  }

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  switch (field.name) {
    case 'name':
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Минимум 2 символа';
      }
      break;
    case 'phone':
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Введите корректный номер';
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Введите корректный email';
      }
      break;
    case 'message':
      if (value.length < 10) {
        isValid = false;
        errorMessage = 'Минимум 10 символов';
      }
      break;
  }
  
  if (!isValid) {
    field.classList.add('error');
    
    // Удаляем предыдущее сообщение об ошибке
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Добавляем новое сообщение
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = errorMessage;
    field.parentNode.appendChild(errorDiv);
  } else {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
  }
  
  return isValid;
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.add('error');
    
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }
}

function showNotification(message, type = 'success') {
  // Удаляем предыдущее уведомление
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) existingNotification.remove();
  
  // Создаем уведомление
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Удаляем через 5 секунд
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/* ========================================
   Плавная прокрутка
   ======================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ========================================
   CountUp анимация
   ======================================== */
function initCountUp() {
  const statsNumbers = document.querySelectorAll('.stats__number, .hero__stat-number');
  
  if (statsNumbers.length === 0) return;
  
  // Создаем observer для отслеживания видимости
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const finalText = element.textContent;
        const numericMatch = finalText.match(/[\d]+/);
        
        if (numericMatch) {
          const finalNumber = parseInt(numericMatch[0]);
          const prefix = finalText.substring(0, finalText.indexOf(numericMatch[0]));
          const suffix = finalText.substring(finalText.indexOf(numericMatch[0]) + numericMatch[0].length);
          
          animateNumber(element, 0, finalNumber, 2000, prefix, suffix);
        }
        
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.5 });
  
  statsNumbers.forEach(num => {
    num.classList.add('count-up');
    observer.observe(num);
  });
}

function animateNumber(element, start, end, duration, prefix, suffix) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (easeOutQuart)
    const easeOut = 1 - Math.pow(1 - progress, 4);
    
    const current = Math.floor(start + (end - start) * easeOut);
    element.textContent = prefix + current.toLocaleString('ru-RU') + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Финальное значение
      element.textContent = prefix + end.toLocaleString('ru-RU') + suffix;
    }
  }
  
  requestAnimationFrame(update);
}

/* ========================================
   Анимации при скролле
   ======================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.benefits__card, .feature-card, .resident-card, .event-card, .contacts-info__item, .format-card, .testimonial-card, .news-card, .about__feature, .join__step, .faq-item, .next-event__card, .blog-category__item'
  );

  if (animatedElements.length === 0) return;

  // Группируем элементы по родительским секциям для каскадного эффекта
  const observer = new IntersectionObserver((entries) => {
    // Собираем видимые элементы и сортируем по позиции в DOM
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => {
        const aIdx = Array.from(animatedElements).indexOf(a.target);
        const bIdx = Array.from(animatedElements).indexOf(b.target);
        return aIdx - bIdx;
      });

    visible.forEach((entry, index) => {
      const delay = index * 80;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    observer.observe(el);
  });
}

/* ========================================
   Утилита: Проверка мобильного устройства
   ======================================== */
function isMobile() {
  return window.innerWidth < 768;
}

/* ========================================
   Утилита: Дебаунс
   ======================================== */
function debounce(func, wait) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ========================================
   Анимированный фон hero — плавная CSS-анимация
   ======================================== */
function initHeroAnimatedBg() {
  // Анимация теперь на чистом CSS — никакого JS не требуется
}

/* ========================================
   Кнопка "Наверх"
   ======================================== */
function initScrollTop() {
  var btn = document.getElementById('scrollTop');
  if (!btn) return;
  
  // Показываем кнопку при скролле вниз на один экран
  var showThreshold = window.innerHeight;
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > showThreshold) {
      btn.classList.add('scroll-top--visible');
    } else {
      btn.classList.remove('scroll-top--visible');
    }
  }, { passive: true });
  
  // Плавная прокрутка наверх
  btn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ========================================
   Аналитика / UTM / события
   ======================================== */
function initAnalytics() {
  var cfg = (window.SITE_CONFIG && window.SITE_CONFIG.analytics) || {};

  if (cfg.gtmId) {
    (function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0];
      var j = d.createElement(s);
      var dl = l != 'dataLayer' ? '&l=' + l : '';
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
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.googleAnalyticsId);
  }

  if (cfg.yandexMetrikaId) {
    (function(m, e, t, r, i, k, a) {
      m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(cfg.yandexMetrikaId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });
  }

  if (cfg.vkPixelId) {
    !function() {
      var t = document.createElement('script');
      t.type = 'text/javascript';
      t.async = true;
      t.src = 'https://vk.com/js/api/openapi.js?169';
      t.onload = function() {
        if (window.VK && window.VK.Retargeting) {
          window.VK.Retargeting.Init(cfg.vkPixelId);
          window.VK.Retargeting.Hit();
        }
      };
      document.head.appendChild(t);
    }();
  }
}

function initUtmCapture() {
  try {
    var params = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var stored = {};
    var has = false;
    keys.forEach(function(key) {
      var val = params.get(key);
      if (val) {
        stored[key] = val;
        has = true;
      }
    });
    if (has) {
      localStorage.setItem('bl_utm', JSON.stringify(stored));
    }
  } catch (e) {}
}

function getStoredUtm() {
  try {
    return JSON.parse(localStorage.getItem('bl_utm') || '{}');
  } catch (e) {
    return {};
  }
}

function trackEvent(name, payload) {
  var data = payload || {};
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, data);
  }
  var ymId = window.SITE_CONFIG && window.SITE_CONFIG.analytics && window.SITE_CONFIG.analytics.yandexMetrikaId;
  if (ymId && typeof window.ym === 'function') {
    window.ym(ymId, 'reachGoal', name, data);
  }
  if (window.dataLayer) {
    window.dataLayer.push(Object.assign({ event: name }, data));
  }
}

function trackCtaClicks() {
  document.querySelectorAll('a.btn, button.btn').forEach(function(el) {
    el.addEventListener('click', function() {
      trackEvent('cta_click', {
        text: (el.textContent || '').trim().slice(0, 80),
        href: el.getAttribute('href') || ''
      });
    });
  });
}

/* ========================================
   Шаринг
   ======================================== */
function initShareButtons() {
  var root = document.querySelector('[data-share-root]') || document.querySelector('.share-buttons');
  if (!root) return;
  var url = encodeURIComponent(window.location.href);
  var title = encodeURIComponent(document.title);

  root.querySelectorAll('[data-share]').forEach(function(link) {
    var type = link.getAttribute('data-share');
    if (type === 'telegram') {
      link.href = 'https://t.me/share/url?url=' + url + '&text=' + title;
    } else if (type === 'vk') {
      link.href = 'https://vk.com/share.php?url=' + url + '&title=' + title;
    } else if (type === 'copy') {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(function() {
            showNotification('Ссылка скопирована', 'success');
          });
        }
        trackEvent('share', { method: 'copy' });
      });
    }
  });
}

/* ========================================
   Поиск по сайту
   ======================================== */
var SITE_SEARCH_INDEX = [
  { title: 'Главная', url: 'index.html', text: 'бизнес-клуб предпринимателей деловая жизнь' },
  { title: 'О клубе', url: 'about.html', text: 'миссия история ценности формат участия' },
  { title: 'Команда', url: 'team.html', text: 'президиум организаторы команда' },
  { title: 'Резиденты', url: 'residents.html', text: 'предприниматели участники компании' },
  { title: 'Блог', url: 'blog.html', text: 'статьи нетворкинг кейсы лайфхаки' },
  { title: 'Экосистема', url: 'ecosystem.html', text: 'инструменты партнёры рост бизнеса' },
  { title: 'События', url: 'events.html', text: 'мероприятия форум завтраки мастер-классы' },
  { title: 'Контакты', url: 'contacts.html', text: 'адрес телефон заявка связаться' },
  { title: 'Гостевой визит', url: 'visit.html', text: 'гость запись заявка визит' },
  { title: 'Партнёрство', url: 'partnership.html', text: 'спонсоры спикеры площадки' },
  { title: 'FAQ', url: 'faq.html', text: 'частые вопросы абонемент вступление' },
  { title: 'Нетворкинг', url: 'networking.html', text: 'деловые связи статьи блог' },
  { title: 'Кейсы', url: 'cases.html', text: 'истории успеха оборот рост' },
  { title: 'Лайфхаки', url: 'lifhaki.html', text: 'советы тайм-менеджмент предприниматели' },
  { title: 'Как эффективно нетворкить', url: 'article-networking-1.html', text: '5 правил нетворкинг связи' },
  { title: 'Как увеличить оборот на 40%', url: 'article-cases-1.html', text: 'кейс рост оборот партнёрства' },
  { title: 'Тайм-менеджмент', url: 'article-lifhaki-1.html', text: 'время продуктивность техники' },
  { title: 'Архив мероприятий', url: 'events-archive.html', text: 'прошедшие события фото итоги' },
  { title: 'Ирина Южанинова', url: 'founder.html', text: 'основатель клуба' },
  { title: 'Политика конфиденциальности', url: 'privacy.html', text: 'персональные данные' },
  { title: 'Пользовательское соглашение', url: 'terms.html', text: 'условия использования' }
];

function initSiteSearch() {
  if (document.getElementById('siteSearch')) return;

  var actions = document.querySelector('.header__actions');
  if (!actions) return;

  var wrap = document.createElement('div');
  wrap.className = 'site-search';
  wrap.innerHTML =
    '<button type="button" class="site-search__toggle" id="siteSearchToggle" aria-label="Поиск">' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>' +
    '<div class="site-search__panel" id="siteSearchPanel" hidden>' +
    '<input type="search" id="siteSearch" class="site-search__input" placeholder="Поиск по сайту..." autocomplete="off">' +
    '<div class="site-search__results" id="siteSearchResults"></div></div>';
  actions.insertBefore(wrap, actions.firstChild);

  var toggle = document.getElementById('siteSearchToggle');
  var panel = document.getElementById('siteSearchPanel');
  var input = document.getElementById('siteSearch');
  var results = document.getElementById('siteSearchResults');

  function runSearch() {
    var q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    if (q.length < 2) return;
    var matches = SITE_SEARCH_INDEX.filter(function(item) {
      return (item.title + ' ' + item.text).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);
    if (!matches.length) {
      results.innerHTML = '<div class="site-search__empty">Ничего не найдено</div>';
      return;
    }
    matches.forEach(function(item) {
      var a = document.createElement('a');
      a.href = item.url;
      a.className = 'site-search__item';
      a.textContent = item.title;
      results.appendChild(a);
    });
    trackEvent('site_search', { query: q });
  }

  toggle.addEventListener('click', function() {
    var open = !panel.hasAttribute('hidden');
    if (open) {
      panel.setAttribute('hidden', '');
    } else {
      panel.removeAttribute('hidden');
      input.focus();
    }
  });

  input.addEventListener('input', debounce(runSearch, 200));

  document.addEventListener('click', function(e) {
    if (!wrap.contains(e.target)) {
      panel.setAttribute('hidden', '');
    }
  });

  try {
    var qParam = new URLSearchParams(window.location.search).get('q');
    if (qParam && qParam.trim().length >= 2) {
      panel.removeAttribute('hidden');
      input.value = qParam;
      runSearch();
    }
  } catch (e) {}
}

/* ========================================
   FAQ аккордеон
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
  var faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(function(item) {
    var question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', function() {
      var isOpen = item.classList.contains('faq-item--open');

      // Закрываем все остальные
      faqItems.forEach(function(other) {
        other.classList.remove('faq-item--open');
      });

      // Открываем текущий (если был закрыт)
      if (!isOpen) {
        item.classList.add('faq-item--open');
      }
    });
  });
});

/* ========================================
   Загрузка GSAP и анимаций (js/animations.js)
   ======================================== */
(function loadGsapAnimations() {
  var preloader = document.getElementById('preloader');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Прелоадер показываем один раз за сессию
  var alreadyShown = false;
  try { alreadyShown = sessionStorage.getItem('blPreloaderShown') === '1'; } catch (e) {}

  if (preloader && (reducedMotion || alreadyShown)) {
    preloader.parentNode.removeChild(preloader);
    preloader = null;
  }

  // При reduced motion анимации не загружаем
  if (reducedMotion) return;

  // Страховка: убираем прелоадер, если GSAP не загрузился
  function removePreloader() {
    var p = document.getElementById('preloader');
    if (p) {
      p.style.opacity = '0';
      setTimeout(function() { if (p.parentNode) p.parentNode.removeChild(p); }, 450);
    }
  }
  if (preloader) setTimeout(removePreloader, 5000);

  function loadScript(src, onload) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = onload;
    s.onerror = removePreloader;
    document.head.appendChild(s);
  }

  loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', function() {
    loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', function() {
      loadScript('js/animations.js');
    });
  });
})();
