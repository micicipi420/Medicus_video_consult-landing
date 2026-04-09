/**
 * MedicusUnion KZ - SPA-like Client Router
 *
 * Intercepts internal link clicks, fetches the target page,
 * swaps <main>, <footer>, sticky-bar, and <title>/<meta>,
 * then re-initializes JS handlers and animations.
 *
 * Keeps header, mobile menu, mesh background, and scripts persistent.
 */
(function () {
  'use strict';

  // --- Configuration ---
  var TRANSITION_DURATION = 220; // ms, matches CSS transition
  var CONTENT_ID = 'page-content';
  var FOOTER_ID = 'footer';
  var STICKY_BAR_ID = 'sticky-bar';

  // Pages that participate in SPA routing (relative filenames)
  var ROUTABLE_PAGES = [
    'index.html', 'online-consultations.html', 'treatment-abroad.html',
    'checkup.html', 'contacts.html', '404.html', ''
  ];

  // Cache fetched pages to avoid re-fetching (keyed by pathname)
  var pageCache = {};

  // Currently active navigation (to abort if user clicks another link quickly)
  var activeNavigation = null;

  // --- Helpers ---

  /**
   * Resolve a URL to its pathname relative to site root.
   * Returns null if external or non-HTML.
   */
  function getRoutablePath(url) {
    try {
      var parsed = new URL(url, window.location.origin);

      // Must be same origin
      if (parsed.origin !== window.location.origin) return null;

      // Get just the filename from the path
      var pathname = parsed.pathname;
      var filename = pathname.split('/').pop() || '';

      // Must be a known routable page (or root /)
      if (ROUTABLE_PAGES.indexOf(filename) === -1) return null;

      return { pathname: pathname, hash: parsed.hash, filename: filename };
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if a link should be intercepted by the router.
   */
  function shouldIntercept(anchor, event) {
    // Skip if modifier keys (open in new tab intent)
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return false;

    // Skip if target="_blank" or download
    if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false;

    // Skip javascript: hrefs
    var href = anchor.getAttribute('href');
    if (!href || href.startsWith('javascript:')) return false;

    // Skip pure anchor links (e.g., #section) on the same page
    if (href.startsWith('#')) return false;

    // Skip tel: and mailto: links
    if (href.startsWith('tel:') || href.startsWith('mailto:')) return false;

    // Must be a routable internal page
    var route = getRoutablePath(anchor.href);
    if (!route) return false;

    return true;
  }

  /**
   * Parse an HTML string and extract the parts we need.
   */
  function parsePageHTML(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');

    return {
      title: doc.title || '',
      description: (function () {
        var meta = doc.querySelector('meta[name="description"]');
        return meta ? meta.getAttribute('content') : '';
      })(),
      canonical: (function () {
        var link = doc.querySelector('link[rel="canonical"]');
        return link ? link.getAttribute('href') : '';
      })(),
      ogTitle: (function () {
        var meta = doc.querySelector('meta[property="og:title"]');
        return meta ? meta.getAttribute('content') : '';
      })(),
      ogDescription: (function () {
        var meta = doc.querySelector('meta[property="og:description"]');
        return meta ? meta.getAttribute('content') : '';
      })(),
      ogUrl: (function () {
        var meta = doc.querySelector('meta[property="og:url"]');
        return meta ? meta.getAttribute('content') : '';
      })(),
      mainContent: doc.getElementById(CONTENT_ID),
      footer: doc.getElementById(FOOTER_ID),
      stickyBar: doc.getElementById(STICKY_BAR_ID),
      // Extract <main> class attribute so we can update it (pages have different classes)
      mainClass: (function () {
        var main = doc.getElementById(CONTENT_ID);
        return main ? main.getAttribute('class') : '';
      })()
    };
  }

  /**
   * Fetch a page and return parsed content.
   * Uses cache if available.
   */
  function fetchPage(pathname) {
    if (pageCache[pathname]) {
      return Promise.resolve(pageCache[pathname]);
    }

    return fetch(pathname, {
      headers: { 'X-Requested-With': 'SPA-Router' }
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.text();
    })
    .then(function (html) {
      var parsed = parsePageHTML(html);
      pageCache[pathname] = parsed;
      return parsed;
    });
  }

  /**
   * Update <meta> tags in the current document head.
   */
  function updateMeta(page) {
    document.title = page.title;

    var desc = document.querySelector('meta[name="description"]');
    if (desc && page.description) desc.setAttribute('content', page.description);

    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && page.canonical) canonical.setAttribute('href', page.canonical);

    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && page.ogTitle) ogTitle.setAttribute('content', page.ogTitle);

    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && page.ogDescription) ogDesc.setAttribute('content', page.ogDescription);

    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && page.ogUrl) ogUrl.setAttribute('content', page.ogUrl);
  }

  /**
   * Update aria-current="page" on nav links.
   */
  function updateActiveNav(pathname) {
    var filename = pathname.split('/').pop() || 'index.html';
    if (filename === '') filename = 'index.html';

    // All nav links (desktop header, mobile menu, footer)
    var allNavLinks = document.querySelectorAll('a[href]');
    allNavLinks.forEach(function (link) {
      var linkHref = link.getAttribute('href');
      if (!linkHref) return;

      // Only process internal .html links or root
      if (linkHref.startsWith('http') || linkHref.startsWith('tel:') ||
          linkHref.startsWith('mailto:') || linkHref.startsWith('#') ||
          linkHref.startsWith('javascript:')) return;

      var linkFilename = linkHref.split('#')[0].split('/').pop() || '';

      if (linkFilename === filename) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Close mobile menu if open.
   */
  function closeMobileMenu() {
    var overlay = document.querySelector('.mobile-menu-overlay');
    var menuBtn = document.querySelector('.header__menu-btn');
    if (!overlay || !overlay.classList.contains('is-open')) return;

    overlay.classList.remove('is-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      var menuIcon = menuBtn.querySelector('.icon-menu');
      var closeIcon = menuBtn.querySelector('.icon-close');
      if (menuIcon) menuIcon.style.display = '';
      if (closeIcon) closeIcon.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  /**
   * Perform the page transition: fade out -> swap -> fade in.
   */
  function transitionTo(page, hash) {
    var currentMain = document.getElementById(CONTENT_ID);
    var currentFooter = document.getElementById(FOOTER_ID);
    var currentStickyBar = document.getElementById(STICKY_BAR_ID);

    if (!currentMain || !page.mainContent) {
      // Fallback: hard navigate
      return false;
    }

    // Phase 1: Fade out current content
    currentMain.classList.add('router-fade-out');
    if (currentFooter) currentFooter.classList.add('router-fade-out');

    return new Promise(function (resolve) {
      setTimeout(function () {
        // Phase 2: Swap content
        currentMain.innerHTML = page.mainContent.innerHTML;
        currentMain.setAttribute('class', page.mainClass || '');
        // Re-add the id since class replacement might remove it
        currentMain.id = CONTENT_ID;

        if (currentFooter && page.footer) {
          currentFooter.innerHTML = page.footer.innerHTML;
          currentFooter.setAttribute('class', page.footer.getAttribute('class') || '');
          currentFooter.id = FOOTER_ID;
        }

        if (currentStickyBar && page.stickyBar) {
          currentStickyBar.innerHTML = page.stickyBar.innerHTML;
          currentStickyBar.setAttribute('class', page.stickyBar.getAttribute('class') || '');
          currentStickyBar.id = STICKY_BAR_ID;
        }

        // Phase 3: Scroll to position
        if (hash) {
          var target = document.querySelector(hash);
          if (target) {
            // Small delay to let DOM settle
            setTimeout(function () {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }

        // Phase 4: Remove fade-out, add fade-in
        currentMain.classList.remove('router-fade-out');
        currentMain.classList.add('router-fade-in');
        if (currentFooter) {
          currentFooter.classList.remove('router-fade-out');
          currentFooter.classList.add('router-fade-in');
        }

        // Phase 5: Re-initialize JS
        if (window.MU && window.MU.reinitPageContent) {
          window.MU.reinitPageContent();
        }
        if (window.MU && window.MU.initAnimations) {
          window.MU.initAnimations(false);
        }

        // Phase 6: Clean up animation classes
        setTimeout(function () {
          currentMain.classList.remove('router-fade-in');
          if (currentFooter) currentFooter.classList.remove('router-fade-in');
          resolve();
        }, TRANSITION_DURATION);
      }, TRANSITION_DURATION);
    });
  }

  /**
   * Navigate to a new page via the router.
   */
  function navigateTo(pathname, hash, pushState) {
    // Prevent duplicate navigations
    var navId = Date.now();
    activeNavigation = navId;

    // Don't navigate to current page (unless hash is different)
    var currentPath = window.location.pathname;
    var currentFilename = currentPath.split('/').pop() || 'index.html';
    var targetFilename = pathname.split('/').pop() || 'index.html';

    if (currentFilename === targetFilename && !hash) {
      // Same page, no hash -- just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If same page but different hash, just scroll
    if (currentFilename === targetFilename && hash) {
      var target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (pushState !== false) {
        history.pushState({ path: pathname, hash: hash }, '', pathname + hash);
      }
      return;
    }

    fetchPage(pathname)
      .then(function (page) {
        // Check if this navigation was superseded
        if (activeNavigation !== navId) return;

        // Close mobile menu before transition
        closeMobileMenu();

        // Update meta
        updateMeta(page);

        // Swap content with transition
        return transitionTo(page, hash);
      })
      .then(function (result) {
        if (activeNavigation !== navId) return;
        if (result === false) {
          // Fallback -- transitionTo returned false
          window.location.href = pathname + (hash || '');
          return;
        }

        // Update URL
        if (pushState !== false) {
          history.pushState({ path: pathname, hash: hash || '' }, '', pathname + (hash || ''));
        }

        // Update nav active state
        updateActiveNav(pathname);
      })
      .catch(function (err) {
        console.error('Router navigation failed:', err);
        // Fallback to regular navigation
        window.location.href = pathname + (hash || '');
      });
  }

  // --- Event Listeners ---

  /**
   * Global click handler for link interception.
   * Uses event delegation on document.body.
   */
  function handleClick(event) {
    // Find the closest <a> ancestor (handles clicks on child elements like SVG icons)
    var anchor = event.target.closest('a');
    if (!anchor) return;

    if (!shouldIntercept(anchor, event)) return;

    var route = getRoutablePath(anchor.href);
    if (!route) return;

    event.preventDefault();
    navigateTo(route.pathname, route.hash, true);
  }

  /**
   * Handle browser back/forward buttons.
   */
  function handlePopState(event) {
    var state = event.state;
    if (state && state.path) {
      navigateTo(state.path, state.hash || '', false);
    } else {
      // Fallback: navigate to current URL
      navigateTo(window.location.pathname, window.location.hash || '', false);
    }
  }

  // --- Initialization ---

  function init() {
    // Replace current history entry with state data
    history.replaceState(
      { path: window.location.pathname, hash: window.location.hash },
      '',
      window.location.pathname + window.location.hash
    );

    // Event delegation for all link clicks
    document.addEventListener('click', handleClick);

    // Browser back/forward
    window.addEventListener('popstate', handlePopState);

    // Prefetch visible nav links on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(function () {
        var navLinks = document.querySelectorAll('.header__nav a[href], .mobile-menu__nav a[href]');
        navLinks.forEach(function (link) {
          var route = getRoutablePath(link.href);
          if (route && !pageCache[route.pathname]) {
            // Prefetch in background
            fetchPage(route.pathname).catch(function () {
              // Silently ignore prefetch errors
            });
          }
        });
      });
    }
  }

  // --- CSS for transitions (injected once) ---
  function injectTransitionStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '.router-fade-out {',
      '  opacity: 0;',
      '  transform: translateY(8px);',
      '  transition: opacity ' + TRANSITION_DURATION + 'ms ease, transform ' + TRANSITION_DURATION + 'ms ease;',
      '}',
      '.router-fade-in {',
      '  animation: routerFadeIn ' + TRANSITION_DURATION + 'ms ease forwards;',
      '}',
      '@keyframes routerFadeIn {',
      '  from { opacity: 0; transform: translateY(8px); }',
      '  to { opacity: 1; transform: translateY(0); }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  // Boot
  injectTransitionStyles();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for testing/debugging
  window.MU = window.MU || {};
  window.MU.router = {
    navigateTo: navigateTo,
    clearCache: function () { pageCache = {}; }
  };

})();
