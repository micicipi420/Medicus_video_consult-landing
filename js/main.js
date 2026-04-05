/**
 * MedicusUnion KZ Landing - Main JS
 * Form submission, accordion, phone mask, spam protection, header scroll, mobile menu
 */

(function () {
  'use strict';

  // Directus API endpoint
  var API_URL = 'https://api.medicusunion.kz/items/consultation_requests';

  /**
   * FAQ Accordion
   * - Click toggles open/close with smooth height transition
   * - Only one item open at a time
   * - Uses aria-expanded and .is-open CSS class
   */
  function initAccordion() {
    var buttons = document.querySelectorAll('.faq__question');
    if (!buttons.length) return;

    // Remove hidden attribute and set initial state via CSS class
    buttons.forEach(function (button) {
      var answer = button.nextElementSibling;
      if (answer && answer.hasAttribute('hidden')) {
        answer.removeAttribute('hidden');
        // Start closed -- CSS max-height: 0 handles this
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
   * Smooth Scroll for anchor links
   * - All links with href="#..." scroll smoothly to target section
   * - Falls back to native behavior if target not found
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
   * Sticky Header
   * - Adds .header--scrolled class when page is scrolled past 20px
   * - Uses passive listener for scroll performance
   */
  function initStickyHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 20) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
  }

  /**
   * Mobile Menu Toggle
   * - Opens/closes mobile menu overlay
   * - Swaps menu/close icons
   * - Locks body scroll when open
   * - Closes on overlay background click and nav link click
   */
  function initMobileMenu() {
    var menuBtn = document.querySelector('.header__menu-btn');
    var overlay = document.querySelector('.mobile-menu-overlay');
    if (!menuBtn || !overlay) return;

    var menuIcon = menuBtn.querySelector('.icon-menu');
    var closeIcon = menuBtn.querySelector('.icon-close');

    function toggleMenu() {
      var isOpen = overlay.classList.contains('is-open');
      overlay.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      if (menuIcon) menuIcon.style.display = isOpen ? '' : 'none';
      if (closeIcon) closeIcon.style.display = isOpen ? 'none' : '';
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close on overlay background click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) toggleMenu();
    });

    // Close on nav link click
    overlay.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(function (link) {
      link.addEventListener('click', function () {
        if (overlay.classList.contains('is-open')) toggleMenu();
      });
    });
  }

  /**
   * Phone Input Mask
   * - Pre-fills +7 and formats as +7 (XXX) XXX-XX-XX
   * - Only allows digits after +7
   */
  function initPhoneMask() {
    var phoneInputs = document.querySelectorAll('input[type="tel"]');
    if (!phoneInputs.length) return;

    phoneInputs.forEach(function (phoneInput) {
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
    });
  }

  /**
   * Spam Protection
   * - Records page load timestamp for timing check
   * - Provides isSpam() check: honeypot filled OR form submitted < 3 seconds after load
   */
  var formLoadTime = 0;

  function initSpamProtection() {
    formLoadTime = Date.now();
  }

  function isSpamSubmission(form) {
    // Check 1: Honeypot field should be empty
    var honeypot = form.querySelector('input[name="website"]');
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
   * - Supports multiple forms on a page via .contact-form selector
   * - Validates required fields on submit
   * - Shows Russian error messages
   * - Submits to Directus API
   * - On success: shows success overlay
   * - On error: shows error message with phone fallback
   */
  function initFormValidation() {
    var forms = document.querySelectorAll('.contact-form');
    if (!forms.length) return;

    forms.forEach(function (form) {
      var successEl = form.querySelector('.form__success');
      var errorEl = form.querySelector('.form__error');

      // Build validation rules dynamically from required fields
      var rules = {};

      // Name field
      var nameInput = form.querySelector('input[name="name"]');
      if (nameInput) {
        rules.name = {
          el: nameInput,
          message: '\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u0432\u0430\u0448\u0435 \u0438\u043c\u044f',
          validate: function (value) {
            return value.trim().length >= 2;
          }
        };
      }

      // Phone field
      var phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput) {
        rules.phone = {
          el: phoneInput,
          message: '\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430',
          validate: function (value) {
            var digits = value.replace(/\D/g, '');
            return digits.length === 11 && digits.charAt(0) === '7';
          }
        };
      }

      // All required selects
      var requiredSelects = form.querySelectorAll('select[required]');
      requiredSelects.forEach(function (sel) {
        rules[sel.name || sel.id] = {
          el: sel,
          message: '\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0430\u0440\u0438\u0430\u043d\u0442',
          validate: function (value) {
            return value !== '';
          }
        };
      });

      function showFieldError(key, message) {
        var rule = rules[key];
        if (!rule || !rule.el) return;
        rule.el.classList.add('is-invalid');
        // Look for a sibling or nearby error element
        var errSpan = rule.el.parentElement.querySelector('.form__field-error');
        if (errSpan) {
          errSpan.textContent = message;
          errSpan.hidden = false;
        }
      }

      function clearFieldError(key) {
        var rule = rules[key];
        if (!rule || !rule.el) return;
        rule.el.classList.remove('is-invalid');
        var errSpan = rule.el.parentElement.querySelector('.form__field-error');
        if (errSpan) {
          errSpan.textContent = '';
          errSpan.hidden = true;
        }
      }

      function clearAllErrors() {
        Object.keys(rules).forEach(function (key) {
          clearFieldError(key);
        });
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.hidden = true;
        }
      }

      function validateForm() {
        var isValid = true;
        clearAllErrors();

        Object.keys(rules).forEach(function (key) {
          var rule = rules[key];
          if (!rule.validate(rule.el.value)) {
            showFieldError(key, rule.message);
            isValid = false;
          }
        });

        return isValid;
      }

      // Clear error on input change
      Object.keys(rules).forEach(function (key) {
        var rule = rules[key];
        if (!rule.el) return;
        var eventType = (rule.el.tagName === 'SELECT') ? 'change' : 'input';
        rule.el.addEventListener(eventType, function () {
          clearFieldError(key);
        });
      });

      function showSuccessState() {
        form.style.display = 'none';
        if (successEl) {
          successEl.hidden = false;
          successEl.style.display = '';
        }
      }

      function showErrorState(message) {
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.hidden = false;
        }
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

        // Spam protection check
        if (isSpamSubmission(form)) {
          // Silently show success to not alert bots
          showSuccessState();
          return;
        }

        // Collect form data from all named inputs
        var formData = {};
        var inputs = form.querySelectorAll('input:not([type="hidden"]):not([name="website"]), select, textarea');
        inputs.forEach(function (el) {
          if (el.name && el.name !== 'website') {
            formData[el.name] = el.value.trim ? el.value.trim() : el.value;
          }
        });

        // Disable submit button while sending
        var submitBtn = form.querySelector('.form__submit');
        var originalText = '';
        if (submitBtn) {
          originalText = submitBtn.textContent;
          submitBtn.disabled = true;
          submitBtn.textContent = '\u041e\u0442\u043f\u0440\u0430\u0432\u043a\u0430...';
        }

        // Submit to Directus API
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
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
          showErrorState(
            '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443. ' +
            '\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u043a \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442\u0443 ' +
            '\u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437, \u0438\u043b\u0438 \u043f\u043e\u0437\u0432\u043e\u043d\u0438\u0442\u0435 \u043d\u0430\u043c: +7 701 532 24 78'
          );
        });
      });
    });
  }

  /**
   * Animated Counters
   * - Counts up numbers in .stat-card__number[data-target] elements
   * - Triggers when element enters viewport via IntersectionObserver
   * - Handles data-suffix (e.g. "+") appended after the number
   * - Triggers once per element
   */
  function initAnimatedCounters() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var numbers = document.querySelectorAll('.stat-card__number[data-target]');
    if (!numbers.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5, rootMargin: '0px' });

    numbers.forEach(function (el) { observer.observe(el); });

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var steps = 60;
      var stepTime = duration / steps;
      var current = 0;
      var increment = target / steps;

      var interval = setInterval(function () {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = Math.round(current) + suffix;
      }, stepTime);
    }
  }

  /**
   * Initialize all modules
   */
  function initAll() {
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initAccordion();
    initPhoneMask();
    initSpamProtection();
    initFormValidation();
    initAnimatedCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
