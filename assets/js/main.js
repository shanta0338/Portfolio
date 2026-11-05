// refine.js — scroll reveal + active nav link. Works alongside main.js.
(function () {
  'use strict';

  function init() {
    var reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Highlight current page in the nav
    var rawPath = location.pathname.replace(/\/+$/, '');
    var lastSegment = rawPath.split('/').pop() || 'index.html';
    var currentPage = lastSegment.toLowerCase().replace(/\.html$/, '');

    if (currentPage === 'portfolio' || currentPage === '') {
      currentPage = 'index';
    }

    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0].split('?')[0];
      var target = (href.split('/').pop() || 'index.html')
        .toLowerCase()
        .replace(/\.html$/, '');

      if (target === currentPage) {
        a.setAttribute('aria-current', 'page');
        a.style.opacity = '1';
        a.style.fontWeight = '700';
      } else {
        a.removeAttribute('aria-current');
        a.style.removeProperty('opacity');
        a.style.removeProperty('font-weight');
      }
    });

    // 2. Scroll reveal for cards
    if (reduce || !('IntersectionObserver' in window)) return;

    if (!document.getElementById('rf-reveal-styles')) {
      var style = document.createElement('style');
      style.id = 'rf-reveal-styles';
      style.textContent =
        '.rf-reveal {' +
        '  opacity: 0;' +
        '  translate: 0 22px;' +
        '  transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), translate 0.55s cubic-bezier(0.22, 1, 0.36, 1);' +
        '  will-change: opacity, translate;' +
        '}' +
        '.rf-reveal.rf-in {' +
        '  opacity: 1;' +
        '  translate: 0 0;' +
        '}';
      document.head.appendChild(style);
    }

    var items = document.querySelectorAll(
      '.cert-card, .approach-card, .profile-card, .intro-item, .case'
    );
    if (!items.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        var visibleBatch = entries.filter(function (e) {
          return e.isIntersecting;
        });

        visibleBatch.forEach(function (entry, batchIndex) {
          var el = entry.target;
          var delay = Math.min(batchIndex * 70, 210);

          el.style.transitionDelay = delay + 'ms';
          el.classList.add('rf-in');
          io.unobserve(el);

          window.setTimeout(function () {
            el.style.removeProperty('transition-delay');
            el.style.removeProperty('will-change');
          }, delay + 600);
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -24px 0px' }
    );

    items.forEach(function (el) {
      el.classList.add('rf-reveal');
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();