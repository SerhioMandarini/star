document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'learning') return;

  const THEME_KEY = 'roadstar-learning-theme';
  const plusLink = document.querySelector('[data-learning-plus-link]');
  const plusBadge = document.querySelector('[data-plus-badge]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeMenu = document.querySelector('[data-theme-menu]');
  const themeButtons = Array.from(document.querySelectorAll('[data-theme]'));
  const main = document.querySelector('.learning-main');
  const overlay = document.querySelector('[data-site-overlay]');
  const learningModal = document.querySelector('[data-learning-modal]');
  const articleModal = document.querySelector('[data-article-modal]');
  const createArticleModal = document.querySelector('[data-article-create-modal]');
  const themeMeta = document.querySelector('meta[name="theme-color"]') || (() => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
    return meta;
  })();
  const tokensButton = document.querySelector('[data-learning-tokens-button]');
  const tokensPopover = document.querySelector('[data-learning-tokens-popover]');
  const closeArticleModalButton = document.querySelector('[data-close-article-modal]');
  const closeCreateArticleButton = document.querySelector('[data-close-create-article]');
  const authModal = document.querySelector('[data-auth-modal]');

  const syncPlusLink = () => {
    if (!plusLink || !plusBadge) return;
    const plusActive = !plusBadge.hidden;
    plusLink.hidden = plusActive || !plusLink.textContent.trim();
    plusLink.style.display = plusLink.hidden ? 'none' : 'inline-flex';
  };

  const applyTheme = (theme) => {
    if (!main) return;
    main.setAttribute('data-learning-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.theme === theme);
    });
    const themeColor = {
      white: '#f7f4ee',
      black: '#111317',
      blue: '#0c1626',
      beige: '#eadbc7'
    }[theme] || '#f7f4ee';
    themeMeta.content = themeColor;
  };

  const closeLearningModalWithoutReload = () => {
    if (!learningModal || learningModal.hidden) return;
    const activeNode = learningModal.dataset.activeNode;
    if (activeNode) {
      try {
        const progress = JSON.parse(localStorage.getItem('roadstar-learning-progress') || '{"completed":{}}');
        progress.completed = progress.completed || {};
        progress.completed[activeNode] = true;
        localStorage.setItem('roadstar-learning-progress', JSON.stringify(progress));
        const node = document.querySelector(`[data-roadmap-node="${activeNode}"]`);
        node?.classList.add('is-done');
        const total = document.querySelectorAll('[data-roadmap-node]').length || 1;
        const done = document.querySelectorAll('[data-roadmap-node].is-done').length;
        const percent = Math.round((done / total) * 100);
        const progressText = document.querySelector('[data-learning-progress]');
        const progressBar = document.querySelector('[data-learning-progress-bar]');
        if (progressText) progressText.textContent = `${percent}%`;
        if (progressBar) progressBar.style.width = `${percent}%`;
      } catch {}
    }
    learningModal.hidden = true;
    if (overlay && articleModal?.hidden !== false && createArticleModal?.hidden !== false) {
      overlay.hidden = true;
    }
  };

  const closeAnyLearningOverlay = () => {
    closeLearningModalWithoutReload();
    if (articleModal && !articleModal.hidden) articleModal.hidden = true;
    if (createArticleModal && !createArticleModal.hidden) createArticleModal.hidden = true;
    if (tokensPopover) tokensPopover.hidden = true;
    if (themeMenu) themeMenu.hidden = true;
    if (overlay) overlay.hidden = true;
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
      if (tokensPopover) tokensPopover.hidden = true;
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

  tokensButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!tokensPopover) return;
    tokensPopover.hidden = !tokensPopover.hidden;
    if (themeMenu) themeMenu.hidden = true;
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-learning-tokens-button]') && tokensPopover) {
      tokensPopover.hidden = true;
    }
  });

  document.querySelector('[data-close-learning-modal]')?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeLearningModalWithoutReload();
  }, true);

  closeArticleModalButton?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (articleModal) articleModal.hidden = true;
    if (overlay && createArticleModal?.hidden !== false && learningModal?.hidden !== false) overlay.hidden = true;
  }, true);

  closeCreateArticleButton?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (createArticleModal) createArticleModal.hidden = true;
    if (overlay && articleModal?.hidden !== false && learningModal?.hidden !== false) overlay.hidden = true;
  }, true);

  overlay?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    closeAnyLearningOverlay();
  }, true);

  [learningModal, articleModal, createArticleModal, authModal].forEach((modal) => {
    modal?.addEventListener('click', (event) => {
      if (event.target !== modal) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeAnyLearningOverlay();
      if (authModal && event.target === authModal) authModal.hidden = true;
    }, true);
  });

  const savedTheme = localStorage.getItem(THEME_KEY);
  const activeTheme = savedTheme || themeButtons.find((button) => button.classList.contains('is-active'))?.dataset.theme || 'white';
  applyTheme(activeTheme);
});
