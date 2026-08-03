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
   Поиск резидентов
   ======================================== */
var RESIDENT_SEARCH_INDEX = [
  {
    "title": "Ирина Южанинова",
    "url": "irina-yuzhaninova.html",
    "text": "Президент Камская химическая компания Президент клуба «Деловая жизнь». Владелица ООО НП «Камская химическая компания». Председатель ПРО «ОПОРА РОССИИ».",
    "meta": "Президент · Камская химическая компания"
  },
  {
    "title": "Екатерина Волочкова",
    "url": "ekaterina-volochkova.html",
    "text": "VIP-резидент Сеть турагентств «Планета» VIP-резидент. Собственник сети турагентств «Планета».",
    "meta": "VIP-резидент · Сеть турагентств «Планета»"
  },
  {
    "title": "Александр Коренякин",
    "url": "aleksandr-korenyakin.html",
    "text": "VIP-резидент ДКИ VIP-резидент. Генеральный директор «ДКИ».",
    "meta": "VIP-резидент · ДКИ"
  },
  {
    "title": "Лейли Доля",
    "url": "leyli-dolya.html",
    "text": "VIP-резидент RedHome VIP-резидент. Собственник агентства недвижимости «RedHome».",
    "meta": "VIP-резидент · RedHome"
  },
  {
    "title": "Марина Мосина",
    "url": "marina-mosina.html",
    "text": "VIP-резидент Mosina Clinic VIP-резидент. Основатель Mosina Clinic и Mosina Academy.",
    "meta": "VIP-резидент · Mosina Clinic"
  },
  {
    "title": "Ольга Шлякова",
    "url": "olga-shlyakova.html",
    "text": "VIP-резидент Инвестиционный банк «Синара» VIP-резидент. Директор в инвестиционном банке «Синара».",
    "meta": "VIP-резидент · Инвестиционный банк «Синара»"
  },
  {
    "title": "Марина Мызина",
    "url": "marina-myzina.html",
    "text": "VIP-резидент HR-агентство / INTOUCH / Чио Чио VIP-резидент. HR-агентство, модельное агентство INTOUCH, сеть «Чио Чио Пермь».",
    "meta": "VIP-резидент · HR-агентство / INTOUCH / Чио Чио"
  },
  {
    "title": "Александр Сидорук",
    "url": "aleksandr-sidoruk.html",
    "text": "VIP-резидент Мясология VIP-резидент. Владелец сети «Мясология», гриль-бар «Гриль Гараж», ресторан «Терруар».",
    "meta": "VIP-резидент · Мясология"
  },
  {
    "title": "Ольга Созинова",
    "url": "olga-sozinova.html",
    "text": "Резидент Виолет сети кондитерских \"Виолет\"",
    "meta": "Резидент · Виолет"
  },
  {
    "title": "Ирина Старкова",
    "url": "irina-starkova.html",
    "text": "Резидент Пять сил онлайн-школы китайской медицины \"Пять сил\", линейки продуктов для здоровья и долголетия \"Доктор Старкова рекомендует\"",
    "meta": "Резидент · Пять сил"
  },
  {
    "title": "Татьяна Горячева",
    "url": "tatyana-goryacheva.html",
    "text": "Резидент Диамид ООО \"Диамид\"",
    "meta": "Резидент · Диамид"
  },
  {
    "title": "Сергей Медведев",
    "url": "sergey-medvedev.html",
    "text": "Резидент Пермского филиала кампании UDS групп Пермского филиала кампании UDS групп",
    "meta": "Резидент · Пермского филиала кампании UDS групп"
  },
  {
    "title": "Марина Беляева",
    "url": "marina-belyaeva.html",
    "text": "Резидент руководителя Пермского филиала кампании UDS групп руководителя Пермского филиала кампании UDS групп",
    "meta": "Резидент · руководителя Пермского филиала кампании UDS групп"
  },
  {
    "title": "Жуланов Денис",
    "url": "zhulanov-denis.html",
    "text": "Резидент Технологии ландшафта компании ООО \"Технологии ландшафта\"",
    "meta": "Резидент · Технологии ландшафта"
  },
  {
    "title": "Дмитрий Тылец",
    "url": "dmitriy-tylec.html",
    "text": "Резидент Р-Групп Р-Групп",
    "meta": "Резидент · Р-Групп"
  },
  {
    "title": "Артем Шумаков",
    "url": "artem-shumakov.html",
    "text": "Резидент в строительной сфере (Окна ПВХ в строительной сфере (Окна ПВХ. Установка и пост гарантийное обслуживание)",
    "meta": "Резидент · в строительной сфере (Окна ПВХ"
  },
  {
    "title": "Константин Гонза",
    "url": "konstantin-gonza.html",
    "text": "Директор Станки Технолоджи и генеральный директор ООО \"Станки Технолоджи\"",
    "meta": "Директор · Станки Технолоджи"
  },
  {
    "title": "Денис Степанов",
    "url": "denis-stepanov.html",
    "text": "Основатель ТМ и совладелец ООО «ТМ» (Техника медицины)",
    "meta": "Основатель · ТМ"
  },
  {
    "title": "Колмогоров Андрей",
    "url": "kolmogorov-andrey.html",
    "text": "Резидент ДРУГОЙСВЕТ компании ООО \"ДРУГОЙСВЕТ\"",
    "meta": "Резидент · ДРУГОЙСВЕТ"
  },
  {
    "title": "Кисарев Артем",
    "url": "kisarev-artem.html",
    "text": "Резидент Мультипласт ООО \"Мультипласт\"",
    "meta": "Резидент · Мультипласт"
  },
  {
    "title": "Столбов Егор",
    "url": "stolbov-egor.html",
    "text": "Резидент Центр Горно-Нефтяного Обучения ЧОУ ДПО «Центр Горно-Нефтяного Обучения»",
    "meta": "Резидент · Центр Горно-Нефтяного Обучения"
  },
  {
    "title": "Кубышев Максим",
    "url": "kubyshev-maksim.html",
    "text": "Резидент ИнфоВектор компании ООО \"ИнфоВектор\"",
    "meta": "Резидент · ИнфоВектор"
  },
  {
    "title": "Васильев Андрей",
    "url": "vasilev-andrey.html",
    "text": "Резидент Ново-Лядовский Источник завода \"Ново-Лядовский Источник\".",
    "meta": "Резидент · Ново-Лядовский Источник"
  },
  {
    "title": "Евгений Рагозин",
    "url": "evgeniy-ragozin.html",
    "text": "Резидент ПОТОЛОК ЦЕНТР \"ПОТОЛОК ЦЕНТР\"",
    "meta": "Резидент · ПОТОЛОК ЦЕНТР"
  },
  {
    "title": "Иван Соколов",
    "url": "ivan-sokolov.html",
    "text": "Резидент Магнат59 компании ООО \"Магнат59\" - агентство недвижимости в г. Пермь",
    "meta": "Резидент · Магнат59"
  },
  {
    "title": "Виталий Ошев",
    "url": "vitaliy-oshev.html",
    "text": "Резидент ARATTA \"ARATTA\" - производство и продажа современного интерьерного декора по РФ",
    "meta": "Резидент · ARATTA"
  },
  {
    "title": "Евгений Патраков",
    "url": "evgeniy-patrakov.html",
    "text": "Резидент Мистэр Фэпс клининговой компании \"Мистэр Фэпс\"",
    "meta": "Резидент · Мистэр Фэпс"
  },
  {
    "title": "Иван Козынцев",
    "url": "ivan-kozyncev.html",
    "text": "Резидент Молоток сети аренды инструмента \"Молоток\", загородного клуба \"Петергоф\", инжиниринговой компании \"куратор\"",
    "meta": "Резидент · Молоток"
  },
  {
    "title": "Михаил Дятлов",
    "url": "mihail-dyatlov.html",
    "text": "Резидент проектирование агрегатов и систем холодоснабжения проектирование агрегатов и систем холодоснабжения, производство холодильного оборудования,комплексные инженерные решения, сборка шкафов управления, ремонт агрег",
    "meta": "Резидент · проектирование агрегатов и систем холодоснабжения"
  },
  {
    "title": "Алексей Сигаев",
    "url": "aleksey-sigaev.html",
    "text": "Директор ЗУАЦ директор ЗАО «ЗУАЦ»",
    "meta": "Директор · ЗУАЦ"
  },
  {
    "title": "Константин Селезнев",
    "url": "konstantin-seleznev.html",
    "text": "Резидент ТЕХНО-Д ООО «ТЕХНО-Д», ООО «Моби-Кейс»",
    "meta": "Резидент · ТЕХНО-Д"
  },
  {
    "title": "Владимир Липнягов",
    "url": "vladimir-lipnyagov.html",
    "text": "Резидент Урал Полимер компании ПК \"Урал Полимер\"",
    "meta": "Резидент · Урал Полимер"
  },
  {
    "title": "Матвей Макаров",
    "url": "matvey-makarov.html",
    "text": "Резидент MakaroVgold ювелирной студии \"MakaroVgold\"",
    "meta": "Резидент · MakaroVgold"
  },
  {
    "title": "Дмитрий Никитин",
    "url": "dmitriy-nikitin.html",
    "text": "Резидент ЛесВиль производственно-строительной компании ООО «ЛесВиль»",
    "meta": "Резидент · ЛесВиль"
  },
  {
    "title": "Эдуард Мирзамухаметов",
    "url": "eduard-mirzamuhametov.html",
    "text": "Резидент Дизель ООО \"Дизель\"",
    "meta": "Резидент · Дизель"
  },
  {
    "title": "Анатолий Южанинов",
    "url": "anatoliy-yuzhaninov.html",
    "text": "Резидент КХК капитан хоккейной команды «КХК»",
    "meta": "Резидент · КХК"
  },
  {
    "title": "Константин Щербинин",
    "url": "konstantin-scherbinin.html",
    "text": "Директор Покровский и директор: АПК \"Покровский\" (Республика Башкортостан) — растениеводство. \"Сарапульский комбикормовый завод\" (Удмуртская Республика) — производство комбикормов.",
    "meta": "Директор · Покровский"
  },
  {
    "title": "Данил Якушев",
    "url": "danil-yakushev.html",
    "text": "Резидент Дедал компаний ООО «Дедал», ООО «Основания и Фундаменты»",
    "meta": "Резидент · Дедал"
  },
  {
    "title": "Максим Виноградов",
    "url": "maksim-vinogradov.html",
    "text": "Резидент компании MOLLIS компании MOLLIS",
    "meta": "Резидент · компании MOLLIS"
  },
  {
    "title": "Владимир Шавшуков",
    "url": "vladimir-shavshukov.html",
    "text": "Основатель НОВОСТОК : ООО \"НОВОСТОК\", ООО \"Антей-Технология\", Учредитель кулинарной студии \"Тайны Шефов\"",
    "meta": "Основатель · НОВОСТОК"
  },
  {
    "title": "Сергей Волок",
    "url": "sergey-volok.html",
    "text": "Руководитель юристРуководитель Юридических проектов междунородного бренда ZETTER юристРуководитель Юридических проектов междунородного бренда ZETTER",
    "meta": "Руководитель · юристРуководитель Юридических проектов междунородного бренда ZETTER"
  },
  {
    "title": "Николай Гилев",
    "url": "nikolay-gilev.html",
    "text": "Резидент НЕАРТ и идейный вдохновитель бюро дизайна \"НЕАРТ\".",
    "meta": "Резидент · НЕАРТ"
  },
  {
    "title": "Дмитрий Тихонов",
    "url": "dmitriy-tihonov.html",
    "text": "Резидент Виолет по развитию компании «Виолет».",
    "meta": "Резидент · Виолет"
  },
  {
    "title": "Игорь Ермаков",
    "url": "igor-ermakov.html",
    "text": "Директор Теплопрофи Рус директор компании «Теплопрофи Рус»",
    "meta": "Директор · Теплопрофи Рус"
  },
  {
    "title": "Артем Кузнецов",
    "url": "artem-kuznecov.html",
    "text": "Резидент Инновация ООО \"Инновация\"",
    "meta": "Резидент · Инновация"
  },
  {
    "title": "Евгений Лучников",
    "url": "evgeniy-luchnikov.html",
    "text": "Резидент Гроза детского патриотического, спортивного, приключенческого лагеря \"Гроза\"",
    "meta": "Резидент · Гроза"
  },
  {
    "title": "Алексей Борцов",
    "url": "aleksey-borcov.html",
    "text": "Директор Юридическая компания и генеральный директор ООО \"Юридическая компания \"ЛЕКСикс\"",
    "meta": "Директор · Юридическая компания"
  },
  {
    "title": "Логиненко Екатерина",
    "url": "loginenko-ekaterina.html",
    "text": "Резидент магазина пермских дизайнеров Polytope магазина пермских дизайнеров Polytope",
    "meta": "Резидент · магазина пермских дизайнеров Polytope"
  },
  {
    "title": "Эрика Щербинина",
    "url": "erika-scherbinina.html",
    "text": "Резидент Сфера транспортной компании «Сфера»",
    "meta": "Резидент · Сфера"
  },
  {
    "title": "Екатерина Павлина",
    "url": "ekaterina-pavlina.html",
    "text": "Резидент Шаурма 59 сети кафе быстрого питания «Шаурма 59»",
    "meta": "Резидент · Шаурма 59"
  },
  {
    "title": "Татьяна Булычева",
    "url": "tatyana-bulycheva.html",
    "text": "Руководитель СантОноре и руководитель сети кондитерских «СантОноре» и сети пекарен «Ешь, люби, пироги»",
    "meta": "Руководитель · СантОноре"
  },
  {
    "title": "Екатерина Чернобровина",
    "url": "ekaterina-chernobrovina.html",
    "text": "Директор СантОноре и директор сети кондитерских «СантОноре» и сети пекарен «Ешь, люби, пироги»",
    "meta": "Директор · СантОноре"
  },
  {
    "title": "Наталья Швецова",
    "url": "natalya-shvecova.html",
    "text": "Резидент Драгоценная орхидея ювелирной сети \"Драгоценная орхидея\"",
    "meta": "Резидент · Драгоценная орхидея"
  },
  {
    "title": "Юлия Корнилова",
    "url": "yuliya-kornilova.html",
    "text": "Резидент и главный врач клиники аппаратной косметологии NovoLaser и ООО ЭнЭль и главный врач клиники аппаратной косметологии NovoLaser и ООО ЭнЭль",
    "meta": "Резидент · и главный врач клиники аппаратной косметологии NovoLaser и ООО ЭнЭль"
  },
  {
    "title": "Валентина Степанова",
    "url": "valentina-stepanova.html",
    "text": "Собственник ИнфоЛинк и собственник IT компании \"ИнфоЛинк\"",
    "meta": "Собственник · ИнфоЛинк"
  },
  {
    "title": "Татьяна Логинова",
    "url": "tatyana-loginova.html",
    "text": "Резидент по недвижимости по недвижимости",
    "meta": "Резидент · по недвижимости"
  },
  {
    "title": "Кристина Старикова",
    "url": "kristina-starikova.html",
    "text": "Резидент Шинторг ООО «Шинторг» - компания по продажам автомобильных шин и дисков в Перми",
    "meta": "Резидент · Шинторг"
  },
  {
    "title": "Кисарева Юлия",
    "url": "kisareva-yuliya.html",
    "text": "Основатель Рыба Рыба онлайн-магазина «Рыба Рыба» ,Учредитель ООО \"Мультипласт\"",
    "meta": "Основатель · Рыба Рыба"
  },
  {
    "title": "Русина Татьяна",
    "url": "rusina-tatyana.html",
    "text": "Резидент Форт Боярд квест-шоу «Форт Боярд» «Золотая Лихорадка»",
    "meta": "Резидент · Форт Боярд"
  },
  {
    "title": "Екатерина Попонина",
    "url": "ekaterina-poponina.html",
    "text": "Резидент салона красоты CHOICE салона красоты CHOICE",
    "meta": "Резидент · салона красоты CHOICE"
  },
  {
    "title": "Воронкова Ганна",
    "url": "voronkova-ganna.html",
    "text": "Резидент по интеллектуальной собственности по интеллектуальной собственности",
    "meta": "Резидент · по интеллектуальной собственности"
  },
  {
    "title": "Светлана Пикман",
    "url": "svetlana-pikman.html",
    "text": "Руководитель и руководитель салона премиальной сантехники и мебели для ванных комна и руководитель салона премиальной сантехники и мебели для ванных комнат VERSALE",
    "meta": "Руководитель · и руководитель салона премиальной сантехники и мебели для ванных комна"
  },
  {
    "title": "Елена Виноградова",
    "url": "elena-vinogradova.html",
    "text": "Резидент Mollis производства мягкой мебели \"Mollis\"",
    "meta": "Резидент · Mollis"
  },
  {
    "title": "Ирина Тарасова",
    "url": "irina-tarasova.html",
    "text": "Резидент Любимые пироги сети пекарен \"Любимые пироги\"",
    "meta": "Резидент · Любимые пироги"
  },
  {
    "title": "Елена Орлова",
    "url": "elena-orlova.html",
    "text": "Резидент Тенториум компании \"Тенториум\" в области розничных продаж.Сдача коммерческой недвижимости в аренду",
    "meta": "Резидент · Тенториум"
  },
  {
    "title": "Ольга Прудникова",
    "url": "olga-prudnikova.html",
    "text": "Резидент Парик бутика «Парик» и апартаментов «Глория», заместитель главного врача по экономическим вопросам в ГБУЗ ПК «Городская клиническая поликлиника 4”",
    "meta": "Резидент · Парик"
  },
  {
    "title": "Евгения Чепкасова",
    "url": "evgeniya-chepkasova.html",
    "text": "Резидент Базис по развитию ООО «Базис» (полный комплекс услуг по доставке груза морским , железнодорожным и автомобильным видом транспорта из стран ЮВА)",
    "meta": "Резидент · Базис"
  },
  {
    "title": "Ирина Смирнова",
    "url": "irina-smirnova.html",
    "text": "Резидент Bento СУШИ Bento СУШИ",
    "meta": "Резидент · Bento СУШИ"
  },
  {
    "title": "Людмила Дробнич",
    "url": "lyudmila-drobnich.html",
    "text": "Резидент Бухгалтерский консалтинг агентства \"Бухгалтерский консалтинг\"",
    "meta": "Резидент · Бухгалтерский консалтинг"
  },
  {
    "title": "Ирина Яван",
    "url": "irina-yavan.html",
    "text": "Резидент STAFFSKILLS STAFFSKILLS.RU - Комплексные решения по автоматизации обучения и адаптации сотрудников",
    "meta": "Резидент · STAFFSKILLS"
  },
  {
    "title": "Елена Бабукова",
    "url": "elena-babukova.html",
    "text": "Директор Югорское юридическое агентство Директор ООО «Югорское юридическое агентство»",
    "meta": "Директор · Югорское юридическое агентство"
  },
  {
    "title": "Ирина Кокшарова",
    "url": "irina-koksharova.html",
    "text": "Резидент ПРАВИЛА ФИНАНСОВ ООО \"ПРАВИЛА ФИНАНСОВ\"",
    "meta": "Резидент · ПРАВИЛА ФИНАНСОВ"
  },
  {
    "title": "Наталья Никитина",
    "url": "natalya-nikitina.html",
    "text": "Резидент студии интерьерного текстиля TÜLLING студии интерьерного текстиля TÜLLING",
    "meta": "Резидент · студии интерьерного текстиля TÜLLING"
  },
  {
    "title": "Марина Боярских",
    "url": "marina-boyarskih.html",
    "text": "Резидент эксперт в области арбитражных споров эксперт в области арбитражных споров, налогового права, имущественных споров супругов",
    "meta": "Резидент · эксперт в области арбитражных споров"
  },
  {
    "title": "Любовь Шумкова",
    "url": "lyubov-shumkova.html",
    "text": "Резидент МамаЛюба Кафе «МамаЛюба» - кафе домашней кухни,кейтеринговой компании «МамаЛюба» и доставки одноименных событийных гастробоксов",
    "meta": "Резидент · МамаЛюба"
  },
  {
    "title": "Ирина Рагозина",
    "url": "irina-ragozina.html",
    "text": "Резидент ПО-ТО-ЛОК.РФ «ПО-ТО-ЛОК.РФ» и «ПОТОЛОК ЦЕНТР» - производство, продажа и монтаж натяжных потолков",
    "meta": "Резидент · ПО-ТО-ЛОК.РФ"
  },
  {
    "title": "Светлана Тавабилова",
    "url": "svetlana-tavabilova.html",
    "text": "Директор Консалтинг «Консалтинг», директор и учредитель АНО «Клуб жизнелюбов», заместитель директора «Рыжий кот» по работе в проекте «Московское долголетие».",
    "meta": "Директор · Консалтинг"
  },
  {
    "title": "Алена Писарева",
    "url": "alena-pisareva.html",
    "text": "Основатель Dance Life создатель и соучредитель школы танцев «Dance Life»",
    "meta": "Основатель · Dance Life"
  },
  {
    "title": "Наталья Семянникова",
    "url": "natalya-semyannikova.html",
    "text": "Резидент ПЕРМСПЕЦКОМ \"ПЕРМСПЕЦКОМ\"",
    "meta": "Резидент · ПЕРМСПЕЦКОМ"
  },
  {
    "title": "Наталья Пищальникова",
    "url": "natalya-pischalnikova.html",
    "text": "Резидент Согласие филиала СК «Согласие» в Пермском крае",
    "meta": "Резидент · Согласие"
  },
  {
    "title": "Айна Якупова",
    "url": "ayna-yakupova.html",
    "text": "Резидент Научный Проектно-Технологический Институт «ОРТЭКС «Научный Проектно-Технологический Институт «ОРТЭКС»",
    "meta": "Резидент · Научный Проектно-Технологический Институт «ОРТЭКС"
  },
  {
    "title": "Ирина Кузнецова",
    "url": "irina-kuznecova.html",
    "text": "Резидент Центр стоматологии и имплантологии АСТРА-МЕД ООО «Центр стоматологии и имплантологии АСТРА-МЕД»",
    "meta": "Резидент · Центр стоматологии и имплантологии АСТРА-МЕД"
  },
  {
    "title": "Наталья Оборина",
    "url": "natalya-oborina.html",
    "text": "Резидент Уральский центр технического обучения : \"Уральский центр технического обучения\", кафе \"Паприка\"",
    "meta": "Резидент · Уральский центр технического обучения"
  },
  {
    "title": "Галина Щелчкова",
    "url": "galina-schelchkova.html",
    "text": "Резидент Стратег Академии \"Стратег\"",
    "meta": "Резидент · Стратег"
  },
  {
    "title": "Наталья Калашникова",
    "url": "natalya-kalashnikova.html",
    "text": "Резидент СМТ рекламно-производственной компании \"СМТ\"",
    "meta": "Резидент · СМТ"
  },
  {
    "title": "Вероника Бушуева",
    "url": "veronika-bushueva.html",
    "text": "Директор Партнерское бюро и генеральный директор юридической компании ООО \"Партнерское бюро\"",
    "meta": "Директор · Партнерское бюро"
  },
  {
    "title": "Юлия Крепак",
    "url": "yuliya-krepak.html",
    "text": "Резидент антивозрастной и превентивной медицины антивозрастной и превентивной медицины",
    "meta": "Резидент · антивозрастной и превентивной медицины"
  },
  {
    "title": "Шумитова Венера",
    "url": "shumitova-venera.html",
    "text": "Резидент ООО Алло ООО Алло, ООО Виктория 67",
    "meta": "Резидент · ООО Алло"
  },
  {
    "title": "Людмила Юнусова",
    "url": "lyudmila-yunusova.html",
    "text": "Резидент Мясной от фермера сети магазинов «Мясной от фермера»",
    "meta": "Резидент · Мясной от фермера"
  },
  {
    "title": "Елена Тетерлева",
    "url": "elena-teterleva.html",
    "text": "Резидент Елены Тетерлевой дизайн студии \"Елены Тетерлевой\"",
    "meta": "Резидент · Елены Тетерлевой"
  },
  {
    "title": "Надежда Ахметова",
    "url": "nadezhda-ahmetova.html",
    "text": "Директор Бест-Н директор магазина недвижимости «Бест-Н»",
    "meta": "Директор · Бест-Н"
  },
  {
    "title": "Наталья Зыкова",
    "url": "natalya-zykova.html",
    "text": "Директор Капитал LIFE Страхование Жизни директор по Пермскому краю «Капитал LIFE Страхование Жизни»",
    "meta": "Директор · Капитал LIFE Страхование Жизни"
  },
  {
    "title": "Анна Мушегян",
    "url": "anna-mushegyan.html",
    "text": "Резидент НАШ ДВОР натуральных армянских продуктов «НАШ ДВОР»",
    "meta": "Резидент · НАШ ДВОР"
  },
  {
    "title": "Ксения Шумакова",
    "url": "kseniya-shumakova.html",
    "text": "Резидент Форд Боярд игровых шоу \"Форд Боярд\" и \"Золотая лихорадка\"",
    "meta": "Резидент · Форд Боярд"
  },
  {
    "title": "Ольга Новоселова",
    "url": "olga-novoselova.html",
    "text": "Резидент Cleverfish магазинов и доставки морепродуктов \"Cleverfish\"",
    "meta": "Резидент · Cleverfish"
  },
  {
    "title": "Оксана Воложенинова",
    "url": "oksana-volozheninova.html",
    "text": "Резидент Закон юридической фирмы «Закон»",
    "meta": "Резидент · Закон"
  },
  {
    "title": "Татьяна Берестова",
    "url": "tatyana-berestova.html",
    "text": "Директор Международное образование и директор «Международное образование»",
    "meta": "Директор · Международное образование"
  },
  {
    "title": "Ирина Дылдина",
    "url": "irina-dyldina.html",
    "text": "Резидент Пион салона цветов «Пион»",
    "meta": "Резидент · Пион"
  },
  {
    "title": "Наталья Глазова",
    "url": "natalya-glazova.html",
    "text": "Директор ИТЦ КРИС и коммерческий директор «ИТЦ КРИС» и «АТОН СЕРВИС»",
    "meta": "Директор · ИТЦ КРИС"
  },
  {
    "title": "Марина Петушкова",
    "url": "marina-petushkova.html",
    "text": "Резидент ALTALINE-M салона европейской сантехники \"ALTALINE-M\"",
    "meta": "Резидент · ALTALINE-M"
  },
  {
    "title": "Олеся Малюгина",
    "url": "olesya-malyugina.html",
    "text": "Резидент Barbershop KONTORA «Barbershop KONTORA», «Народный барбершоп КУЗЬМА», Народное пространство красоты «КЛАВА», Школа барберов «URAL BARBER SCHOOL»",
    "meta": "Резидент · Barbershop KONTORA"
  },
  {
    "title": "Мария Пуртова",
    "url": "mariya-purtova.html",
    "text": "Резидент Kultura здоровых волос студии красоты «Kultura здоровых волос»",
    "meta": "Резидент · Kultura здоровых волос"
  },
  {
    "title": "Ольга Лядова",
    "url": "olga-lyadova.html",
    "text": "Резидент Центр активации молодости Ольги Лядовой «Центр активации молодости Ольги Лядовой»",
    "meta": "Резидент · Центр активации молодости Ольги Лядовой"
  },
  {
    "title": "Надежда Касаткина",
    "url": "nadezhda-kasatkina.html",
    "text": "Резидент Канцлеръ магазина «Канцлеръ»",
    "meta": "Резидент · Канцлеръ"
  },
  {
    "title": "Людмила Долгих",
    "url": "lyudmila-dolgih.html",
    "text": "Резидент Эксперт инженерного центра \"Эксперт\"",
    "meta": "Резидент · Эксперт"
  },
  {
    "title": "Татьяна Семенцова",
    "url": "tatyana-semencova.html",
    "text": "Резидент Ленд сети аптек «Ленд»",
    "meta": "Резидент · Ленд"
  },
  {
    "title": "Валентина Арзамасова",
    "url": "valentina-arzamasova.html",
    "text": "Резидент Саквояж турагенства «Саквояж»",
    "meta": "Резидент · Саквояж"
  },
  {
    "title": "Алена Старкова",
    "url": "alena-starkova.html",
    "text": "Резидент Пять сил онлайн-школы китайской медицины «Пять сил», линейки продуктов для здоровья и долголетия «Доктор Старкова рекомендует»",
    "meta": "Резидент · Пять сил"
  },
  {
    "title": "Наталья Малькова",
    "url": "natalya-malkova.html",
    "text": "Резидент Перммедтехника сети магазинов «Перммедтехника»",
    "meta": "Резидент · Перммедтехника"
  },
  {
    "title": "Татьяна Голубаева",
    "url": "tatyana-golubaeva.html",
    "text": "Резидент Берегиня благотворительного фонда «Берегиня»",
    "meta": "Резидент · Берегиня"
  },
  {
    "title": "Маргарита Соколова",
    "url": "margarita-sokolova.html",
    "text": "Директор Полигарх-Финам директор «Полигарх-Финам» (Финам), соучредитель «Магнат59». Работа с биржами, ВЭД, валютой и инвестициями в недвижимость.",
    "meta": "Директор · Полигарх-Финам"
  },
  {
    "title": "Татьяна Ганева",
    "url": "tatyana-ganeva.html",
    "text": "Собственник Социан собственник агентства недвижимости «Социан».",
    "meta": "Собственник · Социан"
  },
  {
    "title": "Ольга Симдяшкина",
    "url": "olga-simdyashkina.html",
    "text": "Резидент Урал Труд Эксперт ООО \"Урал Труд Эксперт\".",
    "meta": "Резидент · Урал Труд Эксперт"
  },
  {
    "title": "Юлия Шеремет",
    "url": "yuliya-sheremet.html",
    "text": "Резидент Клуба развития ребёнка “Роббо клуб” Клуба развития ребёнка “Роббо клуб”.",
    "meta": "Резидент · Клуба развития ребёнка “Роббо клуб”"
  },
  {
    "title": "Надежда Бланк",
    "url": "nadezhda-blank.html",
    "text": "Директор МедСервис директор холдинга \"МедСервис\"",
    "meta": "Директор · МедСервис"
  },
  {
    "title": "Елена Черникова",
    "url": "elena-chernikova.html",
    "text": "Резидент частного английского детского сада Sun School частного английского детского сада Sun School.",
    "meta": "Резидент · частного английского детского сада Sun School"
  },
  {
    "title": "Анна Бородина",
    "url": "anna-borodina.html",
    "text": "Резидент Инбьюти ООО «Инбьюти»",
    "meta": "Резидент · Инбьюти"
  },
  {
    "title": "Екатерина Москалева",
    "url": "ekaterina-moskaleva.html",
    "text": "Резидент Промпак компании \"Промпак\" - производство ПЭТ - бутылок.Дистрибьютор питьевой родниковой воды под собственным брендом \" Жемчужина\"",
    "meta": "Резидент · Промпак"
  },
  {
    "title": "Евгения Тихонова",
    "url": "evgeniya-tihonova.html",
    "text": "Собственник с 20-летним опытом с 20-летним опытом, владелец 2-х ИТ-компаний: разработка электроники и производство",
    "meta": "Собственник · с 20-летним опытом"
  },
  {
    "title": "Татьяна Зотова",
    "url": "tatyana-zotova.html",
    "text": "Резидент Актив УК «Актив» – семейной компании, работающей в сфере коммерческой недвижимости",
    "meta": "Резидент · Актив"
  }
];

function initSiteSearch() {
  if (document.getElementById('siteSearch')) return;

  var actions = document.querySelector('.header__actions');
  if (!actions) return;

  var wrap = document.createElement('div');
  wrap.className = 'site-search';
  wrap.innerHTML =
    '<button type="button" class="site-search__toggle" id="siteSearchToggle" aria-label="Поиск резидентов" title="Поиск резидентов">' +
    '<svg class="site-search__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="9" cy="7.5" r="3.2"></circle>' +
    '<path d="M3.8 18.5c.6-2.8 2.7-4.5 5.2-4.5s4.6 1.7 5.2 4.5"></path>' +
    '<circle cx="17.2" cy="16.2" r="3.3"></circle>' +
    '<line x1="19.5" y1="18.6" x2="21.4" y2="20.5"></line>' +
    '</svg></button>' +
    '<div class="site-search__panel" id="siteSearchPanel" hidden>' +
    '<input type="search" id="siteSearch" class="site-search__input" placeholder="Найти резидента..." autocomplete="off">' +
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
    var matches = RESIDENT_SEARCH_INDEX.filter(function(item) {
      return (item.title + ' ' + item.text).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 10);
    if (!matches.length) {
      results.innerHTML = '<div class="site-search__empty">Резидент не найден</div>';
      return;
    }
    matches.forEach(function(item) {
      var a = document.createElement('a');
      a.href = item.url;
      a.className = 'site-search__item';
      a.innerHTML =
        '<span class="site-search__name">' + item.title + '</span>' +
        (item.meta ? '<span class="site-search__meta">' + item.meta + '</span>' : '');
      results.appendChild(a);
    });
    trackEvent('resident_search', { query: q });
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
