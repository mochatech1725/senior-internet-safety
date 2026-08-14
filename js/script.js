(() => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const pageAttribute = page => currentPage === page ? ' aria-current="page"' : '';
  const groupClass = pages => pages.includes(currentPage) ? 'nav-group active-group' : 'nav-group';

  const renderSiteHeader = () => {
    const header = document.querySelector('[data-site-header]');
    if (!header) return;

    header.outerHTML = `
      <div class="site-banner" id="top">
        <a href="index.html"><img alt="Click with Confidence — Online Safety for Seniors in the Digital Age" src="images/CickWithConfidenceBanner.png"/></a>
      </div>
      <header class="site-header">
        <div class="nav-shell">
          <button aria-controls="site-nav" aria-expanded="false" aria-label="Open navigation" class="menu-button" type="button"><span aria-hidden="true">☰</span></button>
          <nav aria-label="Main navigation" class="site-nav" id="site-nav">
            <a${pageAttribute('index.html')} href="index.html">Home</a>
            <a${pageAttribute('topics.html')} href="topics.html">Topics</a>
            <details class="${groupClass(['scams.html', 'deepfakes.html', 'web-safety.html', 'social-mobile.html'])}">
              <summary class="nav-group-label">Safety Topics <span aria-hidden="true" class="nav-arrow">⌄</span></summary>
              <div class="nav-dropdown">
                <a${pageAttribute('scams.html')} href="scams.html">Scams &amp; Social Engineering</a>
                <a${pageAttribute('deepfakes.html')} href="deepfakes.html">Deep Fakes &amp; Impersonation</a>
                <a${pageAttribute('web-safety.html')} href="web-safety.html">Web Safety &amp; Malware</a>
                <a${pageAttribute('social-mobile.html')} href="social-mobile.html">Social Media &amp; Mobile</a>
              </div>
            </details>
            <details class="${groupClass(['protect-yourself.html', 'data-breaches.html'])}">
              <summary class="nav-group-label">Protect Yourself <span aria-hidden="true" class="nav-arrow">⌄</span></summary>
              <div class="nav-dropdown">
                <a${pageAttribute('protect-yourself.html')} href="protect-yourself.html">Password Protection</a>
                <a${pageAttribute('data-breaches.html')} href="data-breaches.html">Data Breaches &amp; Credit Protection</a>
              </div>
            </details>
            <a${pageAttribute('get-help.html')} href="get-help.html">Get Help</a>
            <a${pageAttribute('gold-award.html')} href="gold-award.html">Gold Award</a>
          </nav>
        </div>
      </header>`;
  };

  const renderSiteFooter = () => {
    const footer = document.querySelector('[data-site-footer]');
    if (!footer) return;

    footer.outerHTML = `
      <footer class="site-footer">
        <div class="shell footer-grid">
          <div><p class="footer-small">A Girl Scout Gold Award project.</p></div>
          <div class="footer-links"><a href="#top">Back to top ↑</a><button id="print-page" type="button">Print this page</button></div>
        </div>
      </footer>`;
  };

  renderSiteHeader();
  renderSiteFooter();

  // Mobile navigation
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('#site-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('open', !open);
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        nav.classList.remove('open');
      });
    });
  }

  // Keep only one navigation dropdown open at a time.
  const navGroups = [...document.querySelectorAll('.nav-group')];
  navGroups.forEach(group => {
    group.addEventListener('toggle', () => {
      if (!group.open) return;
      navGroups.forEach(other => {
        if (other !== group) other.open = false;
      });
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.site-nav') && !event.target.closest('.menu-button')) {
      navGroups.forEach(group => { group.open = false; });
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      navGroups.forEach(group => { group.open = false; });
      if (menuButton && nav) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        nav.classList.remove('open');
      }
    }
  });

  // Tabs
  document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
    const tabs = [...tabGroup.querySelectorAll('[role="tab"]')];
    const panels = [...tabGroup.querySelectorAll('[role="tabpanel"]')];

    const activate = tab => {
      tabs.forEach(item => item.setAttribute('aria-selected', String(item === tab)));
      panels.forEach(panel => { panel.hidden = panel.id !== tab.dataset.tab; });
      tab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        activate(tabs[nextIndex]);
      });
    });
  });

  // Print shortcut
  const printButton = document.querySelector('#print-page');
  if (printButton) printButton.addEventListener('click', () => window.print());
})();
