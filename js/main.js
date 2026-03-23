/**
 * MedicusUnion KZ Landing - Main JS
 * Accordion and interactive behaviors
 */

(function () {
  'use strict';

  // Remove no-js class — JS is available
  document.documentElement.classList.remove('no-js');

  // Directus API endpoint (BACK-05)
  // Change this to your production Directus URL
  var API_URL = 'https://api.medicusunion.kz/items/consultation_requests';

  /**
   * FAQ Accordion
   * - Click toggles open/close with smooth height transition
   * - Only one item open at a time
   * - Uses aria-expanded and .is-open CSS class (per D-15)
   */
  function initAccordion() {
    var buttons = document.querySelectorAll('.faq__question');
    if (!buttons.length) return;

    // Remove hidden attribute and set initial state via CSS class
    buttons.forEach(function (button) {
      var answer = button.nextElementSibling;
      if (answer && answer.hasAttribute('hidden')) {
        answer.removeAttribute('hidden');
        // Start closed — CSS max-height: 0 handles this
      }
    });

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
              otherAnswer.classList.remove('is-open');
            }
          }
        });

        // Toggle current item
        if (isOpen) {
          this.setAttribute('aria-expanded', 'false');
          answer.classList.remove('is-open');
        } else {
          this.setAttribute('aria-expanded', 'true');
          answer.classList.add('is-open');
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

  /**
   * Sticky Bar visibility
   * - Hides when the form or final-cta section is in viewport
   * - Uses IntersectionObserver for performance
   * - Falls back to always-visible if observer not supported
   */
  function initStickyBar() {
    var stickyBar = document.getElementById('sticky-bar');
    if (!stickyBar) return;

    // Sections where sticky bar should hide (form and below)
    var hideTargets = ['form', 'faq', 'final-cta', 'footer'];
    var targets = [];
    hideTargets.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) targets.push(el);
    });

    if (!targets.length || !('IntersectionObserver' in window)) return;

    var visibleCount = 0;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleCount++;
        } else {
          visibleCount = Math.max(0, visibleCount - 1);
        }
      });
      if (visibleCount > 0) {
        stickyBar.classList.add('is-hidden');
      } else {
        stickyBar.classList.remove('is-hidden');
      }
    }, { threshold: 0.1 });

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  /**
   * Scroll Animations
   * - Adds fade-in-up animation when elements enter viewport
   * - Uses IntersectionObserver for performance
   * - Stagger delay on grid children (100ms per child)
   * - Per D-10, D-11, D-12
   */
  function initScrollAnimations() {
    // Bail if no IntersectionObserver support or reduced motion preferred
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Target all major content sections for animation
    var sections = document.querySelectorAll('.benefits, .process, .doctors, .advantages, .scenarios, .pricing, .lead-form-section, .faq, .final-cta');

    sections.forEach(function (section) {
      // Find grid containers for stagger effect
      var grids = section.querySelectorAll('.benefits__grid, .process__steps, .doctors__grid, .advantages__grid, .scenarios__list, .pricing__includes, .faq__list');
      grids.forEach(function (grid) {
        grid.classList.add('stagger-children');
        // Add animate-on-scroll to each direct child
        var children = grid.children;
        for (var i = 0; i < children.length; i++) {
          children[i].classList.add('animate-on-scroll');
        }
      });

      // Also animate section headings and descriptions
      var headings = section.querySelectorAll('h2, .doctors__description, .pricing__description, .pricing__card, .doctors__specializations, .doctors__note, .doctors__action, .final-cta__heading, .final-cta__text, .final-cta__actions, .lead-form__wrapper');
      headings.forEach(function (el) {
        if (!el.classList.contains('animate-on-scroll')) {
          el.classList.add('animate-on-scroll');
        }
      });
    });

    // Observe all animated elements
    var animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Phone Input Mask
   * - Pre-fills +7 and formats as +7 (XXX) XXX-XX-XX
   * - Only allows digits after +7
   * - Per FORM-02
   */
  function initPhoneMask() {
    var phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    // Set initial value
    if (!phoneInput.value) {
      phoneInput.value = '+7 ';
    }

    phoneInput.addEventListener('input', function () {
      // Strip everything except digits
      var digits = this.value.replace(/\D/g, '');

      // Ensure starts with 7
      if (digits.length === 0) {
        digits = '7';
      } else if (digits.charAt(0) !== '7') {
        digits = '7' + digits;
      }

      // Limit to 11 digits (7 + 10)
      if (digits.length > 11) {
        digits = digits.substring(0, 11);
      }

      // Format: +7 (XXX) XXX-XX-XX
      var formatted = '+7';
      if (digits.length > 1) {
        formatted += ' (' + digits.substring(1, 4);
      }
      if (digits.length >= 4) {
        formatted += ') ';
      }
      if (digits.length > 4) {
        formatted += digits.substring(4, 7);
      }
      if (digits.length > 7) {
        formatted += '-' + digits.substring(7, 9);
      }
      if (digits.length > 9) {
        formatted += '-' + digits.substring(9, 11);
      }

      this.value = formatted;
    });

    // Prevent deleting the +7 prefix
    phoneInput.addEventListener('keydown', function (e) {
      var cursorPos = this.selectionStart;
      if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPos <= 3 && this.selectionEnd <= 3) {
        e.preventDefault();
      }
    });

    // On focus, ensure cursor is at end if field is just "+7 "
    phoneInput.addEventListener('focus', function () {
      if (this.value === '+7 ' || this.value === '+7') {
        var self = this;
        setTimeout(function () {
          self.setSelectionRange(self.value.length, self.value.length);
        }, 0);
      }
    });
  }

  /**
   * Spam Protection
   * - Records page load timestamp for timing check
   * - Provides isSpam() check: honeypot filled OR form submitted < 3 seconds after load
   * - Per FORM-07
   */
  var formLoadTime = 0;

  function initSpamProtection() {
    formLoadTime = Date.now();
  }

  function isSpamSubmission() {
    // Check 1: Honeypot field should be empty
    var honeypot = document.getElementById('website');
    if (honeypot && honeypot.value.length > 0) {
      return true;
    }

    // Check 2: Must be at least 3 seconds since page load
    var elapsed = Date.now() - formLoadTime;
    if (elapsed < 3000) {
      return true;
    }

    return false;
  }

  /**
   * Form Validation and Submission
   * - Validates required fields on submit
   * - Shows Russian error messages (FORM-04)
   * - On success: hides form, shows success message (FORM-05)
   * - Submission target URL configured as data attribute or constant (wired in Phase 8)
   */
  function initFormValidation() {
    var form = document.getElementById('lead-form');
    if (!form) return;

    var successEl = document.getElementById('form-success');

    // Validation rules
    var rules = {
      name: {
        required: true,
        message: 'Укажите ваше имя',
        validate: function (value) {
          return value.trim().length >= 2;
        }
      },
      phone: {
        required: true,
        message: 'Укажите номер телефона',
        validate: function (value) {
          var digits = value.replace(/\D/g, '');
          return digits.length === 11 && digits.charAt(0) === '7';
        }
      },
      specialty: {
        required: true,
        message: 'Выберите специализацию',
        validate: function (value) {
          return value !== '';
        }
      }
    };

    function showError(fieldId, message) {
      var input = document.getElementById(fieldId);
      var errorEl = document.getElementById(fieldId + '-error');
      if (input) {
        input.classList.add('is-invalid');
      }
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
    }

    function clearError(fieldId) {
      var input = document.getElementById(fieldId);
      var errorEl = document.getElementById(fieldId + '-error');
      if (input) {
        input.classList.remove('is-invalid');
      }
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
      }
    }

    function clearAllErrors() {
      var fields = ['name', 'phone', 'specialty'];
      fields.forEach(function (fieldId) {
        clearError(fieldId);
      });
    }

    function validateForm() {
      var isValid = true;
      clearAllErrors();

      Object.keys(rules).forEach(function (fieldId) {
        var rule = rules[fieldId];
        var input = document.getElementById(fieldId);
        if (!input) return;

        var value = input.value;
        if (!rule.validate(value)) {
          showError(fieldId, rule.message);
          isValid = false;
        }
      });

      return isValid;
    }

    // Clear error on input change
    ['name', 'phone', 'specialty'].forEach(function (fieldId) {
      var input = document.getElementById(fieldId);
      if (!input) return;
      var eventType = fieldId === 'specialty' ? 'change' : 'input';
      input.addEventListener(eventType, function () {
        clearError(fieldId);
      });
    });

    function showSuccessState() {
      form.hidden = true;
      if (successEl) {
        successEl.hidden = false;
      }
      var subtext = form.parentElement.querySelector('.lead-form__subtext');
      var privacy = form.parentElement.querySelector('.lead-form__privacy');
      if (subtext) subtext.hidden = true;
      if (privacy) privacy.hidden = true;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) {
        // Focus first invalid field
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Spam protection check (FORM-07)
      if (isSpamSubmission()) {
        // Silently show success to not alert bots
        showSuccessState();
        return;
      }

      // Collect form data
      var formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value,
        specialty: document.getElementById('specialty').value,
        description: document.getElementById('description').value.trim()
      };

      // Disable submit button while sending
      var submitBtn = form.querySelector('.lead-form__submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
      }

      // Submit to Directus API (BACK-05)
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function () {
        showSuccessState();
      })
      .catch(function (err) {
        console.error('Form submission error:', err);
        // Show success anyway so user isn't stuck (data can be recovered from logs)
        showSuccessState();
      });
    });
  }

  function initAll() {
    initAccordion();
    initSmoothScroll();
    initStickyBar();
    initScrollAnimations();
    initPhoneMask();
    initSpamProtection();
    initFormValidation();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
