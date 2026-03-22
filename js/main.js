/**
 * MedicusUnion KZ Landing - Main JS
 * Accordion and interactive behaviors
 */

(function () {
  'use strict';

  // Remove no-js class — JS is available
  document.documentElement.classList.remove('no-js');

  /**
   * FAQ Accordion
   * - Click toggles open/close
   * - Only one item open at a time
   * - Uses aria-expanded and hidden attribute
   */
  function initAccordion() {
    var buttons = document.querySelectorAll('.faq__question');
    if (!buttons.length) return;

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var isOpen = this.getAttribute('aria-expanded') === 'true';
        var answer = this.nextElementSibling;

        // Close all other items
        buttons.forEach(function (otherButton) {
          if (otherButton !== button) {
            otherButton.setAttribute('aria-expanded', 'false');
            var otherAnswer = otherButton.nextElementSibling;
            if (otherAnswer) {
              otherAnswer.hidden = true;
            }
          }
        });

        // Toggle current item
        if (isOpen) {
          this.setAttribute('aria-expanded', 'false');
          answer.hidden = true;
        } else {
          this.setAttribute('aria-expanded', 'true');
          answer.hidden = false;
        }
      });
    });
  }

  /**
   * Smooth Scroll for CTA buttons
   * - All links with href="#..." scroll smoothly to target section
   * - Falls back to native behavior if target not found (form not yet built)
   * - Uses scrollIntoView for cross-browser smooth scroll
   */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initAll() {
    initAccordion();
    initSmoothScroll();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
