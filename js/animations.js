/**
 * MedicusUnion KZ - Entrance Animations
 * Uses Motion standalone library (window.Motion global)
 * Loaded after motion@12 CDN script tag
 *
 * Exposes window.MU.initAnimations() for SPA router re-trigger
 */
(function () {
  'use strict';

  /**
   * Run all scroll/entrance animations for elements currently in the DOM.
   * Safe to call multiple times -- elements already animated will be skipped
   * because Motion's inView only fires once per element observation.
   *
   * @param {boolean} isInitialLoad - true on first page load (animates header/hero),
   *                                  false on SPA navigation (skips header, animates hero-like elements in new content)
   */
  function initAnimations(isInitialLoad) {
    // Guard: skip if Motion not loaded or reduced motion preferred
    if (typeof Motion === 'undefined') {
      console.warn('Motion library not loaded, skipping animations');
      return;
    }

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    var animate = Motion.animate;
    var inView = Motion.inView;

    // Default to initial load if not specified
    if (typeof isInitialLoad === 'undefined') isInitialLoad = true;

    // === SECTION FADE-UP ===
    document.querySelectorAll('.animate-fade-up').forEach(function (el) {
      if (el.dataset.muAnimated) return;
      el.dataset.muAnimated = '1';
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';

      inView(el, function () {
        animate(el,
          { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
          { duration: 0.8, easing: 'ease-out' }
        );
      }, { amount: 0.2 });
    });

    // === STAGGERED CARD ENTRANCE ===
    document.querySelectorAll('.animate-stagger').forEach(function (grid) {
      if (grid.dataset.muAnimated) return;
      grid.dataset.muAnimated = '1';
      var cards = grid.children;
      Array.prototype.forEach.call(cards, function (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
      });

      inView(grid, function () {
        Array.prototype.forEach.call(cards, function (card, i) {
          animate(card,
            { opacity: [0, 1], transform: ['translateY(50px)', 'translateY(0)'] },
            { duration: 0.8, delay: i * 0.1, easing: 'ease-out' }
          );
        });
      }, { amount: 0.2 });
    });

    // === HERO ENTRANCE ===
    // On SPA navigation, hero elements in new content should still animate
    var heroBadge = document.querySelector('.hero__badge');
    var heroTitle = document.querySelector('.hero__title');
    var heroSubtitle = document.querySelector('.hero__subtitle');
    var heroButtons = document.querySelector('.hero__buttons');
    var heroTrust = document.querySelector('.hero__trust');
    var heroPhotos = document.querySelector('.hero__photos');

    var heroElements = [
      { el: heroBadge, delay: 0 },
      { el: heroTitle, delay: 0.15 },
      { el: heroSubtitle, delay: 0.3 },
      { el: heroButtons, delay: 0.45 },
      { el: heroTrust, delay: 0.6 }
    ];

    heroElements.forEach(function (item) {
      if (!item.el) return;
      if (item.el.dataset.muAnimated) return;
      item.el.dataset.muAnimated = '1';
      item.el.style.opacity = '0';
      item.el.style.transform = 'translateY(30px)';
      animate(item.el,
        { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
        { duration: 0.8, delay: isInitialLoad ? item.delay : item.delay * 0.5, easing: 'ease-out' }
      );
    });

    // Hero photos scale-in
    if (heroPhotos && !heroPhotos.dataset.muAnimated) {
      heroPhotos.dataset.muAnimated = '1';
      heroPhotos.style.opacity = '0';
      heroPhotos.style.transform = 'scale(0.95)';
      animate(heroPhotos,
        { opacity: [0, 1], transform: ['scale(0.95)', 'scale(1)'] },
        { duration: 1, delay: isInitialLoad ? 0.3 : 0.15, easing: 'ease-out' }
      );
    }

    // Hero floating badges
    document.querySelectorAll('.hero__floating-badge').forEach(function (badge, i) {
      if (badge.dataset.muAnimated) return;
      badge.dataset.muAnimated = '1';
      badge.style.opacity = '0';
      animate(badge,
        { opacity: [0, 1], transform: ['translateX(20px)', 'translateX(0)'] },
        { duration: 0.8, delay: (isInitialLoad ? 0.9 : 0.3) + (i * 0.2), easing: 'ease-out' }
      );
    });

    // === HEADER SPRING ENTRANCE (only on initial page load) ===
    if (isInitialLoad) {
      var header = document.querySelector('.header');
      if (header && !header.dataset.muAnimated) {
        header.dataset.muAnimated = '1';
        header.style.opacity = '0';
        header.style.transform = 'translateY(-100px)';
        animate(header,
          { opacity: [0, 1], transform: ['translateY(-100px)', 'translateY(0)'] },
          { duration: 0.8, easing: [0.25, 0.46, 0.45, 0.94] }
        );
      }
    }

    // === FADE-LEFT ===
    document.querySelectorAll('.animate-fade-left').forEach(function (el) {
      if (el.dataset.muAnimated) return;
      el.dataset.muAnimated = '1';
      el.style.opacity = '0';
      el.style.transform = 'translateX(-30px)';
      inView(el, function () {
        animate(el,
          { opacity: [0, 1], transform: ['translateX(-30px)', 'translateX(0)'] },
          { duration: 0.8, easing: 'ease-out' }
        );
      }, { amount: 0.2 });
    });

    // === FADE-RIGHT ===
    document.querySelectorAll('.animate-fade-right').forEach(function (el) {
      if (el.dataset.muAnimated) return;
      el.dataset.muAnimated = '1';
      el.style.opacity = '0';
      el.style.transform = 'translateX(30px)';
      inView(el, function () {
        animate(el,
          { opacity: [0, 1], transform: ['translateX(30px)', 'translateX(0)'] },
          { duration: 0.8, easing: 'ease-out' }
        );
      }, { amount: 0.2 });
    });

    // === SCALE-IN ===
    document.querySelectorAll('.animate-scale-in').forEach(function (el) {
      if (el.dataset.muAnimated) return;
      el.dataset.muAnimated = '1';
      el.style.opacity = '0';
      el.style.transform = 'scale(0.95)';
      inView(el, function () {
        animate(el,
          { opacity: [0, 1], transform: ['scale(0.95)', 'scale(1)'] },
          { duration: 0.8, easing: 'ease-out' }
        );
      }, { amount: 0.2 });
    });
  }

  // Expose for SPA router
  window.MU = window.MU || {};
  window.MU.initAnimations = initAnimations;

  // Run on initial page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAnimations(true); });
  } else {
    initAnimations(true);
  }

})();
