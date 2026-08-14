(() => {
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
