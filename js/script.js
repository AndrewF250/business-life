/* ========================================
   Скрипты сайта «Деловая жизнь» — Премиум версия
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Инициализация темы
  initTheme();
  
  // Фиксированная шапка с эффектом скролла
  initHeaderScroll();
  
  // Бургер-меню
  initBurgerMenu();
  
  // Слайдер резидентов
  initSlider();
  
  // Фильтры
  initFilters();
  
  // Форма обратной связи
  initContactForm();
  
  // Плавная прокрутка
  initSmoothScroll();
  
  // CountUp анимация
  initCountUp();
  
  // Анимации при скролле
  initScrollAnimations();
  
  // Анимированный фон hero
  initHeroAnimatedBg();
  
  // Кнопка "Наверх"
  initScrollTop();
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
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    // Простая валидация
    if (!validateForm(data)) {
      return;
    }
    
    // Имитация отправки
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    setTimeout(() => {
      // Показываем сообщение об успехе
      showNotification('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
      
      // Сбрасываем форму
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }, 1500);
  });
  
  // Валидация в реальном времени
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

function validateForm(data) {
  let isValid = true;
  
  // Проверка имени
  if (!data.name || data.name.trim().length < 2) {
    showFieldError('name', 'Пожалуйста, введите ваше имя');
    isValid = false;
  }
  
  // Проверка телефона
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  if (!data.phone || !phoneRegex.test(data.phone)) {
    showFieldError('phone', 'Пожалуйста, введите корректный номер телефона');
    isValid = false;
  }
  
  // Проверка email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError('email', 'Пожалуйста, введите корректный email');
    isValid = false;
  }
  
  // Проверка сообщения
  if (!data.message || data.message.trim().length < 10) {
    showFieldError('message', 'Пожалуйста, введите сообщение (минимум 10 символов)');
    isValid = false;
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
