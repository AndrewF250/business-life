window.designMotion = function (gsap, ScrollTrigger) {
  gsap.to('.blob--1', { x: 40, y: 30, duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.blob--2', { x: -50, y: -20, duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.blob--3', { x: 30, y: -40, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.from('.panel--hero > *', { y: 36, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' });
  gsap.from('.panel-row .panel', {
    y: 50, opacity: 0, stagger: 0.15, duration: 0.85, ease: 'power3.out',
    scrollTrigger: { trigger: '.panel-row', start: 'top 80%' }
  });
  gsap.from('.bubble', {
    scale: 0.6, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.bubbles', start: 'top 80%' }
  });
  gsap.from('.circles__row a', {
    y: 40, opacity: 0, stagger: 0.12, duration: 0.75, ease: 'power3.out',
    scrollTrigger: { trigger: '.circles', start: 'top 80%' }
  });
};
