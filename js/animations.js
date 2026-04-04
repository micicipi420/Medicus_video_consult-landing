/**
 * MedicusUnion KZ - Entrance Animations
 * Uses Motion standalone library (window.Motion global)
 * Loaded after motion@12 CDN script tag
 */
(function () {
  'use strict';

  // Guard: skip if Motion not loaded or reduced motion preferred
  if (typeof Motion === 'undefined') {
    console.warn('Motion library not loaded, skipping animations');
    return;
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var animate = Motion.animate;
  var inView = Motion.inView;

  // === SECTION FADE-UP ===
  // Generic fade-up for section content blocks
  document.querySelectorAll('.animate-fade-up').forEach(function (el) {
    // Set initial hidden state via JS (not CSS) to avoid flash if script loads late
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
  // Cards within a grid that stagger in
  document.querySelectorAll('.animate-stagger').forEach(function (grid) {
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
  // Hero elements animate on page load (not scroll)
  var heroBadge = document.querySelector('.hero__badge');
  var heroTitle = document.querySelector('.hero__title');
  var heroSubtitle = document.querySelector('.hero__subtitle');
  var heroButtons = document.querySelector('.hero__buttons');
  var heroTrust = document.querySelector('.hero__trust');
  var heroPhotos = document.querySelector('.hero__photos');

  var heroElements = [
    { el: heroBadge, delay: 0 },
    { el: heroTitle, delay: 0.2 },
    { el: heroSubtitle, delay: 0.4 },
    { el: heroButtons, delay: 0.6 },
    { el: heroTrust, delay: 0.8 }
  ];

  heroElements.forEach(function (item) {
    if (!item.el) return;
    item.el.style.opacity = '0';
    item.el.style.transform = 'translateY(30px)';
    animate(item.el,
      { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
      { duration: 0.8, delay: item.delay, easing: 'ease-out' }
    );
  });

  // Hero photos scale-in
  if (heroPhotos) {
    heroPhotos.style.opacity = '0';
    heroPhotos.style.transform = 'scale(0.95)';
    animate(heroPhotos,
      { opacity: [0, 1], transform: ['scale(0.95)', 'scale(1)'] },
      { duration: 1, delay: 0.3, easing: 'ease-out' }
    );
  }

  // Hero floating badges
  document.querySelectorAll('.hero__floating-badge').forEach(function (badge, i) {
    badge.style.opacity = '0';
    animate(badge,
      { opacity: [0, 1], transform: ['translateX(20px)', 'translateX(0)'] },
      { duration: 0.8, delay: 0.9 + (i * 0.2), easing: 'ease-out' }
    );
  });

  // === HEADER SPRING ENTRANCE ===
  var header = document.querySelector('.header');
  if (header) {
    header.style.opacity = '0';
    header.style.transform = 'translateY(-100px)';
    animate(header,
      { opacity: [0, 1], transform: ['translateY(-100px)', 'translateY(0)'] },
      { duration: 0.8, easing: [0.25, 0.46, 0.45, 0.94] } // spring-like
    );
  }

  // === FADE-LEFT ===
  document.querySelectorAll('.animate-fade-left').forEach(function (el) {
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
    el.style.opacity = '0';
    el.style.transform = 'scale(0.95)';
    inView(el, function () {
      animate(el,
        { opacity: [0, 1], transform: ['scale(0.95)', 'scale(1)'] },
        { duration: 0.8, easing: 'ease-out' }
      );
    }, { amount: 0.2 });
  });

})();
