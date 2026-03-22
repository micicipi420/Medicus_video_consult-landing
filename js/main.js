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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
  } else {
    initAccordion();
  }
})();
