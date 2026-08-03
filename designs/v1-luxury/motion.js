window.designMotion = function (gsap, ScrollTrigger) {
  gsap.from('.display__line', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: 0.1 });
  gsap.from('.eyebrow,.lead,.actions,.metrics', { y: 28, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.55, ease: 'power3.out' });
  gsap.from('.split__visual img', { scale: 1.15, duration: 1.6, ease: 'power2.out' });
  gsap.to('.split__visual img', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.split', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.strip__track', { xPercent: -35, ease: 'none', scrollTrigger: { trigger: '.strip', scrub: 1 } });
  gsap.from('.person', {
    x: 40, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: '.duo', start: 'top 70%' }
  });
  gsap.from('.invite h2', {
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.invite', start: 'top 80%' }
  });
};
