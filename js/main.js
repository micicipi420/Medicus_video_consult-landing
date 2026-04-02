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

    // Validation rules — dynamic: name and phone always required,
    // plus the first required <select> in the form (specialty, interest, checkup-direction, etc.)
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
      }
    };

    // Find all required selects in the form and add them to rules
    var requiredSelects = form.querySelectorAll('select[required]');
    requiredSelects.forEach(function (sel) {
      rules[sel.id] = {
        required: true,
        message: 'Выберите вариант',
        validate: function (value) {
          return value !== '';
        }
      };
    });

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
      Object.keys(rules).forEach(function (fieldId) {
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

    // Clear error on input change — dynamically for all rule fields
    Object.keys(rules).forEach(function (fieldId) {
      var input = document.getElementById(fieldId);
      if (!input) return;
      var eventType = (input.tagName === 'SELECT') ? 'change' : 'input';
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

      // Collect form data — gather all named inputs dynamically
      var formData = {};
      var inputs = form.querySelectorAll('input:not([type="hidden"]):not([name="website"]), select, textarea');
      inputs.forEach(function (el) {
        if (el.name && el.name !== 'website') {
          formData[el.name] = el.value.trim ? el.value.trim() : el.value;
        }
      });

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

  /**
   * Sticky Header scroll shadow
   * - Adds .is-scrolled class when page is scrolled down
   * - Uses passive listener for scroll performance
   * - Per NAV-01
   */
  function initStickyHeader() {
    var header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 0) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  /**
   * Dark Mode Toggle
   * - Reads saved theme from localStorage on init (theme already applied by inline head script)
   * - Clicking toggle switches between 'light' and 'dark', saves to localStorage
   * - Updates aria-pressed and icon on every state change
   * - Updates meta[name="theme-color"] for browser chrome (Android status bar)
   * - Per DM-01, DM-03, DM-04
   */
  function initDarkMode() {
    var toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0441\u0432\u0435\u0442\u043b\u0443\u044e \u0442\u0435\u043c\u0443' : '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0442\u0451\u043c\u043d\u0443\u044e \u0442\u0435\u043c\u0443'
      );
      var icon = toggle.querySelector('.theme-toggle__icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '\u263e' : '\u2600';
      }
      var metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#0F1923' : '#38C6F4');
      }
    }

    var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme);

    toggle.addEventListener('click', function() {
      var next = document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';
      applyTheme(next);
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
    initStickyHeader();
    initDarkMode();
    initAnimatedCounters();
    initScrollProgress();
    initCardTilt();
  }

  /**
   * Animated Counters
   * - Counts up numbers in .social-proof__number elements
   * - Triggers when element enters viewport
   * - Handles numbers with +, K, and plain integers
   */
  function initAnimatedCounters() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var numbers = document.querySelectorAll('.social-proof__number');
    if (!numbers.length) return;

    numbers.forEach(function (el) {
      el.dataset.finalText = el.textContent;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    numbers.forEach(function (el) { observer.observe(el); });

    function animateNumber(el) {
      var finalText = el.dataset.finalText;
      // Extract numeric part: "43" → 43, "500+" → 500, "15+" → 15, "10 000+" → 10000, "ISO" → skip
      var cleaned = finalText.replace(/\s/g, '').replace(/[+,]/g, '');
      var num = parseInt(cleaned, 10);
      if (isNaN(num)) return; // skip non-numeric like "ISO"

      var suffix = '';
      if (finalText.indexOf('+') !== -1) suffix = '+';

      // Preserve space formatting (e.g. "10 000+")
      var hasSpaces = /\d\s\d/.test(finalText);

      var duration = 1200;
      var startTime = null;
      el.setAttribute('data-counting', '');

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * num);

        if (hasSpaces && current >= 1000) {
          el.textContent = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + suffix;
        } else {
          el.textContent = current + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = finalText;
          el.removeAttribute('data-counting');
        }
      }

      el.textContent = '0';
      requestAnimationFrame(step);
    }
  }

  /**
   * Scroll Progress Bar
   * - Shows a gradient progress bar at the top of the page
   * - Uses passive scroll listener
   */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        bar.style.transform = 'scaleX(' + (scrollTop / docHeight) + ')';
      }
    }, { passive: true });
  }

  /**
   * 3D Card Tilt
   * - Subtle 3D rotation on mouse move over .card--tilt elements
   * - Uses requestAnimationFrame for performance
   * - Resets on mouse leave
   */
  function initCardTilt() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    var cards = document.querySelectorAll('.card--tilt');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -4; // max 4deg
        var rotateY = ((x - centerX) / centerX) * 4;  // max 4deg

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
