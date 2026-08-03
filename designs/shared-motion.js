/* Shared base: progress bar + optional custom cursor */
(function () {
  if (!window.gsap) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  var fine = window.matchMedia('(pointer:fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var progress = document.getElementById('progress');
  if (progress) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.pageYOffset / h) * 100 : 0) + '%';
    }, { passive: true });
  }

  var cursor = document.getElementById('cursor');
  var ring = document.getElementById('cursorRing');
  if (fine && cursor && ring && !reduce) {
    document.documentElement.classList.add('has-cursor');
    var x = 0, y = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    (function loop() {
      rx += (x - rx) * 0.15;
      ry += (y - ry) * 0.15;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
  }

  if (reduce) return;
  if (typeof window.designMotion === 'function') window.designMotion(gsap, window.ScrollTrigger);
})();
