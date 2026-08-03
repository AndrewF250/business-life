window.designMotion = function (gsap, ScrollTrigger) {
  gsap.from('.blast__title .t1,.blast__title .t2,.blast__title .t3', {
    x: function (i) { return i % 2 ? 120 : -120; },
    opacity: 0, stagger: 0.12, duration: 1, ease: 'power4.out'
  });
  gsap.from('.blast__tag,.blast__sub,.blast__cta', { y: 30, opacity: 0, stagger: 0.1, delay: 0.5, duration: 0.7 });
  gsap.from('.blast__img', { rotate: 18, scale: 1.2, opacity: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' });
  gsap.to('.band__inner', { xPercent: -40, ease: 'none', duration: 14, repeat: -1 });
  gsap.from('.row', {
    x: -60, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.rows', start: 'top 80%' }
  });
  gsap.from('.stack__people a', {
    y: 80, rotate: 8, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.stack', start: 'top 75%' }
  });
  gsap.from('.punch h2', {
    scale: 0.85, opacity: 0, duration: 0.9, ease: 'back.out(1.2)',
    scrollTrigger: { trigger: '.punch', start: 'top 80%' }
  });
};
