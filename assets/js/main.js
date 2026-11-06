// refine.js — Reliable Mobile Menu, Interactive UI, Lightbox, Scroll Progress & Reveal
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
      } else {
        a.removeAttribute('aria-current');
      }
    });

    // 2. Inject Guaranteed Mobile Menu + Interactive UI Styles
    if (!document.getElementById('rf-interactive-styles')) {
      var style = document.createElement('style');
      style.id = 'rf-interactive-styles';
      style.textContent =
        /* Mobile menu guaranteed styles */
        '@media (max-width: 860px) {' +
        '  .nav { position: sticky !important; top: 0.75rem !important; z-index: 3000 !important; overflow: visible !important; }' +
        '  .nav-toggle { display: inline-flex !important; align-items: center; justify-content: center; flex-direction: column; gap: 5px; width: 44px; height: 44px; background: rgba(255,255,255,0.06); border: 1px solid rgba(148,163,184,0.25); border-radius: 50%; cursor: pointer; z-index: 3002 !important; position: relative; }' +
        '  .nav-toggle span { display: block; width: 20px; height: 2px; background: #f8fafc; border-radius: 2px; transition: transform 0.25s ease, opacity 0.2s ease; margin: 0 !important; }' +
        '  .nav-toggle[aria-expanded="true"] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }' +
        '  .nav-toggle[aria-expanded="true"] span:nth-child(2) { opacity: 0; }' +
        '  .nav-toggle[aria-expanded="true"] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }' +
        '  .nav-links { display: none !important; position: absolute !important; top: calc(100% + 0.6rem) !important; left: 0 !important; right: 0 !important; flex-direction: column !important; align-items: stretch !important; background: rgba(11, 17, 32, 0.98) !important; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding: 0.9rem !important; border-radius: 16px !important; border: 1px solid rgba(56, 189, 248, 0.4) !important; box-shadow: 0 24px 48px rgba(0, 0, 0, 0.8) !important; z-index: 3001 !important; gap: 0.4rem !important; }' +
        '  .nav-links.is-open { display: flex !important; animation: rfMenuFade 0.22s ease forwards; }' +
        '  .nav-links a { display: block !important; padding: 0.85rem 1.1rem !important; font-size: 1rem !important; border-radius: 10px !important; text-align: left !important; color: #e2e8f0 !important; }' +
        '  .nav-links a[aria-current="page"], .nav-links a:hover { background: rgba(56, 189, 248, 0.18) !important; color: #38bdf8 !important; }' +
        '}' +
        '@keyframes rfMenuFade { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }' +
        /* Interactive progress bar, back-to-top, lightbox, and card reveal */
        '.rf-progress { position: fixed; top: 0; left: 0; height: 3px; width: 0%; z-index: 4000; background: linear-gradient(90deg, #38bdf8, #6366f1, #10b981); transition: width 0.1s linear; pointer-events: none; }' +
        '.rf-to-top { position: fixed; right: 1.25rem; bottom: 1.25rem; width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #fff; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 10px 25px rgba(2,6,23,0.65); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; z-index: 2500; opacity: 0; transform: translateY(14px); pointer-events: none; transition: all 0.28s ease; }' +
        '.rf-to-top.is-visible { opacity: 1; transform: translateY(0); pointer-events: auto; }' +
        '.rf-lightbox { position: fixed; inset: 0; background: rgba(6,9,19,0.92); backdrop-filter: blur(12px); z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 1.25rem; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }' +
        '.rf-lightbox.is-open { opacity: 1; pointer-events: auto; }' +
        '.rf-lightbox img { max-width: min(94vw, 960px); max-height: 86vh; border-radius: 12px; border: 1px solid rgba(56,189,248,0.4); box-shadow: 0 24px 60px rgba(0,0,0,0.85); }' +
        '.rf-lightbox-close { position: absolute; top: 1.25rem; right: 1.25rem; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: rgba(15,23,42,0.85); color: #fff; font-size: 1.25rem; cursor: pointer; }' +
        '.rf-reveal { opacity: 0; translate: 0 22px; transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), translate 0.55s cubic-bezier(0.22, 1, 0.36, 1); will-change: opacity, translate; }' +
        '.rf-reveal.rf-in { opacity: 1; translate: 0 0; }';
      document.head.appendChild(style);
    }

    // 3. Mobile Navigation Drawer Controller (Conflict-Free)
    var nav = document.querySelector('.nav');
    var oldToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');

    if (oldToggle && navLinks) {
      // Clone button to strip any conflicting listeners attached by main.js
      var toggle = oldToggle.cloneNode(true);
      oldToggle.parentNode.replaceChild(toggle, oldToggle);

      var setMenuState = function (open) {
        navLinks.classList.toggle('is-open', open);
        navLinks.classList.toggle('active', open);
        if (nav) nav.classList.toggle('nav--open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute(
          'aria-label',
          open ? 'Close navigation menu' : 'Open navigation menu'
        );
      };

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = navLinks.classList.contains('is-open');
        setMenuState(!isOpen);
      });

      // Close menu when any nav link is clicked
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          setMenuState(false);
        });
      });

      // Close menu when tapping outside the nav bar
      document.addEventListener('click', function (e) {
        if (
          navLinks.classList.contains('is-open') &&
          nav &&
          !nav.contains(e.target)
        ) {
          setMenuState(false);
        }
      });

      // Close menu on Escape key or when resizing back to desktop
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
          setMenuState(false);
        }
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth > 860 && navLinks.classList.contains('is-open')) {
          setMenuState(false);
        }
      });
    }

    // 4. Scroll Progress Bar & Floating Back-to-Top Button
    var progressBar = document.createElement('div');
    progressBar.className = 'rf-progress';
    document.body.appendChild(progressBar);

    var toTopBtn = document.createElement('button');
    toTopBtn.className = 'rf-to-top';
    toTopBtn.type = 'button';
    toTopBtn.setAttribute('aria-label', 'Scroll back to top');
    toTopBtn.innerHTML = '↑';
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(toTopBtn);

    window.addEventListener(
      'scroll',
      function () {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(Math.max(pct, 0), 100) + '%';

        if (nav) {
          nav.classList.toggle('is-scrolled', scrollTop > 30);
        }
        toTopBtn.classList.toggle('is-visible', scrollTop > 360);
      },
      { passive: true }
    );

    // 5. Interactive Card Spotlight on Desktop
    var cards = document.querySelectorAll(
      '.cert-card, .approach-card, .profile-card, .intro-item, .case'
    );

    cards.forEach(function (card) {
      card.addEventListener(
        'pointermove',
        function (e) {
          if (e.pointerType === 'touch') return;
          var rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', e.clientX - rect.left + 'px');
          card.style.setProperty('--mouse-y', e.clientY - rect.top + 'px');
        },
        { passive: true }
      );
    });

    // 6. Interactive Lightbox for Workshop/Certificate Images
    var caseImages = document.querySelectorAll('.case-visual img');
    if (caseImages.length) {
      var lightbox = document.createElement('div');
      lightbox.className = 'rf-lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.innerHTML =
        '<button type="button" class="rf-lightbox-close" aria-label="Close preview">✕</button><img src="" alt="">';
      document.body.appendChild(lightbox);

      var lbImg = lightbox.querySelector('img');
      var closeLightbox = function () {
        lightbox.classList.remove('is-open');
      };

      lightbox.addEventListener('click', function (e) {
        if (
          e.target === lightbox ||
          e.target.classList.contains('rf-lightbox-close')
        ) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
      });

      caseImages.forEach(function (img) {
        img.addEventListener('click', function () {
          lbImg.src = img.currentSrc || img.src;
          lbImg.alt = img.alt || 'Certificate preview';
          lightbox.classList.add('is-open');
        });
      });
    }

    // 7. Scroll Reveal Animation
    if (reduce || !('IntersectionObserver' in window) || !cards.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        var visibleBatch = entries.filter(function (e) {
          return e.isIntersecting;
        });

        visibleBatch.forEach(function (entry, batchIndex) {
          var el = entry.target;
          var delay = Math.min(batchIndex * 65, 195);

          el.style.transitionDelay = delay + 'ms';
          el.classList.add('rf-in');
          io.unobserve(el);

          window.setTimeout(function () {
            el.style.removeProperty('transition-delay');
            el.style.removeProperty('will-change');
          }, delay + 600);
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
    );

    cards.forEach(function (el) {
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