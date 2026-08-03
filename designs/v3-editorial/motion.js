window.designMotion = function (gsap, ScrollTrigger) {
  gsap.from('.cover h1', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' });
  gsap.from('.deck,.kicker', { y: 20, opacity: 0, duration: 0.7, stagger: 0.1, delay: 0.2 });
  gsap.from('.cover__photo', { y: 50, opacity: 0, duration: 1.1, delay: 0.25, ease: 'power3.out' });
  gsap.from('.drop', {
    y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.columns', start: 'top 75%' }
  });
  gsap.from('blockquote', {
    x: -20, opacity: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: 'blockquote', start: 'top 85%' }
  });
  gsap.from('.toc li', {
    y: 24, opacity: 0, stagger: 0.08, duration: 0.55, ease: 'power2.out',
    scrollTrigger: { trigger: '.toc', start: 'top 80%' }
  });
  gsap.from('.profiles__row a', {
    y: 40, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.profiles', start: 'top 75%' }
  });
};
