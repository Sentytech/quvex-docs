/**
 * Quvex ERP User Guide Enhancements
 * - Global search overlay (Ctrl+K or /)
 * - Back to top button
 * - Active sidebar tracking via IntersectionObserver
 *
 * No external dependencies.
 */
(function () {
  'use strict';

  // ── Utilities ──────────────────────────────────────────────────────────

  /** Map Turkish special chars to ASCII equivalents for fuzzy matching. */
  var TR_MAP = {
    '\u00f6': 'o', '\u00fc': 'u', '\u015f': 's', '\u011f': 'g', '\u0131': 'i', '\u00e7': 'c',
    '\u00d6': 'o', '\u00dc': 'u', '\u015e': 's', '\u011e': 'g', '\u0130': 'i', '\u00c7': 'c'
  };

  function normalizeTR(str) {
    return str.replace(/[\u00f6\u00fc\u015f\u011f\u0131\u00e7\u00d6\u00dc\u015e\u011e\u0130\u00c7]/g, function (ch) {
      return TR_MAP[ch] || ch;
    }).toLowerCase();
  }

  /** Resolve a relative URL from the search index against current page location. */
  function resolveURL(relativeURL) {
    // Determine base path — the directory that contains the HTML pages
    var basePath = getBasePath();
    return basePath + relativeURL;
  }

  function getBasePath() {
    var path = window.location.pathname;
    // If we are inside roles/, sectors/, or workflows/ subfolder go up one level
    if (/\/(roles|sectors|workflows)\//.test(path)) {
      return '../';
    }
    return '';
  }

  // ── Search Index ───────────────────────────────────────────────────────

  var searchIndex = null; // will be loaded lazily
  var searchIndexPromise = null;

  function loadSearchIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    if (searchIndexPromise) return searchIndexPromise;

    var jsonPath = resolveURL('js/search-index.json');

    searchIndexPromise = fetch(jsonPath)
      .then(function (res) {
        if (!res.ok) throw new Error('Search index not found (' + res.status + ')');
        return res.json();
      })
      .then(function (data) {
        // Pre-build normalized text for every section
        data.forEach(function (page) {
          page._normTitle = normalizeTR(page.title);
          page.sections.forEach(function (sec) {
            sec._norm = normalizeTR(
              (sec.heading || '') + ' ' + (sec.keywords || '') + ' ' + page.title
            );
          });
        });
        searchIndex = data;
        return data;
      })
      .catch(function (err) {
        console.warn('[Quvex Search]', err);
        searchIndexPromise = null; // allow retry
        return [];
      });

    return searchIndexPromise;
  }

  /** Search the index. Returns array of { pageTitle, sectionHeading, url, preview } */
  function search(query) {
    if (!searchIndex || !query || !query.trim()) return [];

    var normQuery = normalizeTR(query.trim());
    var words = normQuery.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    var results = [];

    searchIndex.forEach(function (page) {
      page.sections.forEach(function (sec) {
        var text = sec._norm;
        // Match if ANY word is found in the normalized text
        var matched = words.some(function (w) {
          return text.indexOf(w) !== -1;
        });
        if (!matched) {
          // Also try matching against normalized page title
          matched = words.some(function (w) {
            return page._normTitle.indexOf(w) !== -1;
          });
        }
        if (matched) {
          var fragment = sec.id ? '#' + sec.id : '';
          results.push({
            pageTitle: page.title,
            sectionHeading: sec.heading,
            url: resolveURL(page.url) + fragment,
            preview: sec.keywords || ''
          });
        }
      });
    });

    // Score: count how many words match, sort descending
    results.forEach(function (r) {
      var norm = normalizeTR(r.pageTitle + ' ' + r.sectionHeading + ' ' + r.preview);
      r._score = words.reduce(function (s, w) {
        return s + (norm.indexOf(w) !== -1 ? 1 : 0);
      }, 0);
    });
    results.sort(function (a, b) { return b._score - a._score; });

    return results.slice(0, 20);
  }

  // ── Search Overlay UI ─────────────────────────────────────────────────

  var overlay = null;
  var searchInput = null;
  var resultsList = null;
  var debounceTimer = null;

  function createOverlay() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.id = 'quvex-search-overlay';
    overlay.innerHTML = [
      '<div class="qso-backdrop"></div>',
      '<div class="qso-modal">',
      '  <div class="qso-header">',
      '    <svg class="qso-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      '    <input id="qso-input" type="text" placeholder="Dokumantasyonda ara\u2026" autocomplete="off" spellcheck="false" />',
      '    <kbd class="qso-kbd">ESC</kbd>',
      '  </div>',
      '  <ul id="qso-results"></ul>',
      '  <div class="qso-footer">',
      '    <span><kbd>\u2191\u2193</kbd> Gezin</span>',
      '    <span><kbd>\u21B5</kbd> A\u00e7</span>',
      '    <span><kbd>ESC</kbd> Kapat</span>',
      '  </div>',
      '</div>'
    ].join('\n');

    injectStyles();
    document.body.appendChild(overlay);

    searchInput = document.getElementById('qso-input');
    resultsList = document.getElementById('qso-results');

    // Events
    overlay.querySelector('.qso-backdrop').addEventListener('click', closeSearch);
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runSearch, 150);
    });
    searchInput.addEventListener('keydown', handleSearchKeydown);
  }

  function injectStyles() {
    if (document.getElementById('qso-styles')) return;
    var style = document.createElement('style');
    style.id = 'qso-styles';
    style.textContent = [
      '#quvex-search-overlay { position:fixed; inset:0; z-index:99999; display:none; }',
      '#quvex-search-overlay.open { display:flex; align-items:flex-start; justify-content:center; padding-top:12vh; }',
      '.qso-backdrop { position:absolute; inset:0; background:rgba(15,18,37,.55); backdrop-filter:blur(4px); }',
      '.qso-modal { position:relative; width:90%; max-width:620px; background:#fff; border-radius:14px; box-shadow:0 25px 60px rgba(0,0,0,.3); overflow:hidden; animation:qsoSlide .18s ease-out; }',
      '@keyframes qsoSlide { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }',
      '.qso-header { display:flex; align-items:center; gap:10px; padding:14px 18px; border-bottom:1px solid #e0e2f0; }',
      '.qso-icon { color:#6b6e90; flex-shrink:0; }',
      '#qso-input { flex:1; border:none; outline:none; font-size:16px; background:transparent; color:#0f1225; }',
      '#qso-input::placeholder { color:#6b6e90; }',
      '.qso-kbd { font-size:11px; padding:2px 7px; border:1px solid #d1d5db; border-radius:4px; color:#6b6e90; background:#f9fafb; flex-shrink:0; }',
      '#qso-results { list-style:none; margin:0; padding:0; max-height:380px; overflow-y:auto; }',
      '#qso-results:empty { display:none; }',
      '#qso-results li { padding:12px 18px; cursor:pointer; border-bottom:1px solid #f0f1f8; transition:background .1s; }',
      '#qso-results li:hover, #qso-results li.active { background:#f0f1f8; }',
      '#qso-results li .qso-page { font-size:11px; color:#6366f1; font-weight:600; text-transform:uppercase; letter-spacing:.03em; }',
      '#qso-results li .qso-heading { font-size:15px; color:#0f1225; margin-top:2px; }',
      '#qso-results li .qso-preview { font-size:12px; color:#6b6e90; margin-top:2px; }',
      '.qso-empty { padding:32px 18px; text-align:center; color:#6b6e90; font-size:14px; line-height:1.6; }',
      '.qso-empty strong { display:block; font-size:15px; color:#0f1225; margin-bottom:4px; }',
      '.qso-footer { display:flex; gap:18px; padding:10px 18px; border-top:1px solid #e0e2f0; background:#f9fafb; font-size:12px; color:#6b6e90; }',
      '.qso-footer kbd { font-size:11px; padding:1px 5px; border:1px solid #d1d5db; border-radius:3px; background:#fff; margin-right:4px; }',

      /* Back to top button */
      '#quvex-btt { position:fixed; bottom:32px; right:32px; z-index:9999; width:48px; height:48px; border-radius:50%; border:none; background:#6366f1; color:#fff; cursor:pointer; box-shadow:0 4px 14px rgba(99,102,241,.4); display:flex; align-items:center; justify-content:center; opacity:0; visibility:hidden; transition:opacity .25s,visibility .25s,transform .25s; transform:translateY(12px); }',
      '#quvex-btt.visible { opacity:1; visibility:visible; transform:translateY(0); }',
      '#quvex-btt:hover { background:#4f46e5; transform:translateY(-2px); }',
      '#quvex-btt svg { pointer-events:none; }',

      /* Active sidebar highlight */
      '.nav-sidebar a.active-section { color:#6366f1 !important; font-weight:600; border-left-color:#6366f1 !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  var activeResultIndex = -1;

  function handleSearchKeydown(e) {
    var items = resultsList.querySelectorAll('li[data-url]');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeResultIndex = Math.min(activeResultIndex + 1, items.length - 1);
      updateActiveResult(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeResultIndex = Math.max(activeResultIndex - 1, 0);
      updateActiveResult(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[activeResultIndex]) {
        window.location.href = items[activeResultIndex].getAttribute('data-url');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    }
  }

  function updateActiveResult(items) {
    items.forEach(function (li, i) {
      li.classList.toggle('active', i === activeResultIndex);
    });
    if (items[activeResultIndex]) {
      items[activeResultIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function runSearch() {
    var query = searchInput.value;
    var results = search(query);
    activeResultIndex = -1;

    if (!query.trim()) {
      resultsList.innerHTML = '';
      return;
    }

    if (results.length === 0) {
      resultsList.innerHTML = [
        '<li class="qso-empty">',
        '  <strong>0 sonu\u00e7 bulundu</strong>',
        '  \u201C' + escapeHTML(query) + '\u201D i\u00e7in sonu\u00e7 bulunamad\u0131.<br>',
        '  <a href="' + resolveURL('sik-sorulan-sorular.html') + '">S\u0131k Sorulan Sorular</a> sayfas\u0131n\u0131 kontrol edin<br>',
        '  veya <strong>destek@quvex.com</strong> adresinden bize ula\u015f\u0131n.',
        '</li>'
      ].join('');
      return;
    }

    resultsList.innerHTML = results.map(function (r) {
      return [
        '<li data-url="' + escapeAttr(r.url) + '">',
        '  <div class="qso-page">' + escapeHTML(r.pageTitle) + '</div>',
        '  <div class="qso-heading">' + escapeHTML(r.sectionHeading) + '</div>',
        '  <div class="qso-preview">' + escapeHTML(r.preview) + '</div>',
        '</li>'
      ].join('');
    }).join('');

    // Click to navigate
    resultsList.querySelectorAll('li[data-url]').forEach(function (li) {
      li.addEventListener('click', function () {
        window.location.href = li.getAttribute('data-url');
      });
    });
  }

  function escapeHTML(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function openSearch() {
    createOverlay();
    loadSearchIndex().then(function () {
      overlay.classList.add('open');
      searchInput.value = '';
      resultsList.innerHTML = '';
      activeResultIndex = -1;
      searchInput.focus();
    });
  }

  function closeSearch() {
    if (overlay) {
      overlay.classList.remove('open');
    }
  }

  // Global keyboard shortcut: Ctrl+K or / (when not in an input)
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
      return;
    }
    if (e.key === '/' && !isInputFocused()) {
      e.preventDefault();
      openSearch();
    }
  });

  function isInputFocused() {
    var tag = (document.activeElement || {}).tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
      (document.activeElement && document.activeElement.isContentEditable);
  }

  // ── Back to Top Button ────────────────────────────────────────────────

  function createBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'quvex-btt';
    btn.setAttribute('aria-label', 'Sayfanin basina don');
    btn.title = 'Sayfanin basina don';
    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';

    // Inject styles if not already done
    injectStyles();
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          btn.classList.toggle('visible', window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Active Sidebar Tracking ───────────────────────────────────────────

  function initSidebarTracking() {
    var sidebar = document.querySelector('.nav-sidebar');
    if (!sidebar) return; // only activate when sidebar exists

    var headings = document.querySelectorAll('h2[id]');
    if (headings.length === 0) return;

    // Build a map from heading id to sidebar link
    var linkMap = {};
    sidebar.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      // Extract fragment: could be "#something" or "page.html#something"
      var hashIndex = href.indexOf('#');
      if (hashIndex !== -1) {
        var fragment = href.substring(hashIndex + 1);
        linkMap[fragment] = a;
      }
    });

    var currentActive = null;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          if (linkMap[id]) {
            if (currentActive) {
              currentActive.classList.remove('active-section');
            }
            linkMap[id].classList.add('active-section');
            currentActive = linkMap[id];
          }
        }
      });
    }, {
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0
    });

    headings.forEach(function (h) {
      if (h.id && linkMap[h.id]) {
        observer.observe(h);
      }
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────

  function init() {
    createBackToTop();
    initSidebarTracking();
    // Pre-load search index in the background
    loadSearchIndex();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
