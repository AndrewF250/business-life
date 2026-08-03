window.designMotion = function (gsap, ScrollTrigger) {
  gsap.from('.scene--hero h1 span', { y: 120, opacity: 0, stagger: 0.15, duration: 1.2, ease: 'power4.out' });
  gsap.from('.scene--hero .tag,.scene--hero .sub,.play,.scene__meta', {
    y: 30, opacity: 0, stagger: 0.1, duration: 0.8, delay: 0.6, ease: 'power3.out'
  });
  gsap.to('.scene--hero .scene__bg', {
    yPercent: 18, scale: 1.1, ease: 'none',
    scrollTrigger: { trigger: '.scene--hero', scrub: true }
  });
  gsap.from('.scene--story h2', {
    y: 80, opacity: 0, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.scene--story', start: 'top 65%' }
  });
  gsap.from('.reel__row a', {
    y: 60, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.reel__row', start: 'top 80%' }
  });
  gsap.from('.cast__grid a', {
    y: 80, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.cast__grid', start: 'top 75%' }
  });
  document.querySelectorAll('.scene[data-scene]').forEach(function (scene) {
    ScrollTrigger.create({
      trigger: scene,
      start: 'top 40%',
      onEnter: function () {
        var el = document.querySelector('.topbar span');
        if (el) el.textContent = 'SCENE ' + scene.dataset.scene + ' / 04';
      },
      onEnterBack: function () {
        var el = document.querySelector('.topbar span');
        if (el) el.textContent = 'SCENE ' + scene.dataset.scene + ' / 04';
      }
    });
  });
};
