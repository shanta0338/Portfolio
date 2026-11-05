// refine.js — scroll reveal + active nav link. Works alongside main.js.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Highlight current page in the nav
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var target = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (target === page || (page === '' && target === 'index.html')) {
      a.setAttribute('aria-current', 'page');
      a.style.opacity = '1';
      a.style.fontWeight = '700';
    }
  });

  // Scroll reveal for cards
  if (reduce || !('IntersectionObserver' in window)) return;
  var items = document.querySelectorAll('.cert-card, .approach-card, .profile-card, .intro-item, .case');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('rf-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el, i) {
    el.classList.add('rf-reveal');
    el.style.transitionDelay = Math.min((i % 4) * 60, 180) + 'ms';
    io.observe(el);
  });
})();