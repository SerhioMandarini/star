document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'learning') return;

  const plusLink = document.querySelector('[data-learning-plus-link]');
  const plusBadge = document.querySelector('[data-plus-badge]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeMenu = document.querySelector('[data-theme-menu]');
  const themeButtons = Array.from(document.querySelectorAll('[data-theme]'));
  const main = document.querySelector('.learning-main');

  const syncPlusLink = () => {
    if (!plusLink || !plusBadge) return;
    const plusActive = !plusBadge.hidden;
    plusLink.hidden = plusActive || !plusLink.textContent.trim();
    plusLink.style.display = plusLink.hidden ? 'none' : 'inline-flex';
  };

  const applyTheme = (theme) => {
    if (!main) return;
    main.setAttribute('data-learning-theme', theme);
    themeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.theme === theme);
    });
  };

  if (plusBadge) {
    new MutationObserver(syncPlusLink).observe(plusBadge, {
      attributes: true,
      attributeFilter: ['hidden']
    });
  }

  if (plusLink) {
    new MutationObserver(syncPlusLink).observe(plusLink, {
      childList: true,
      subtree: true
    });
  }

  syncPlusLink();

  if (themeToggle && themeMenu) {
    themeToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      themeMenu.hidden = !themeMenu.hidden;
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-theme-switcher]')) {
        themeMenu.hidden = true;
      }
    });
  }

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(button.dataset.theme);
      if (themeMenu) themeMenu.hidden = true;
    });
  });

  const activeTheme = themeButtons.find((button) => button.classList.contains('is-active'))?.dataset.theme || 'white';
  applyTheme(activeTheme);
});
