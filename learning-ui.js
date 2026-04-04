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
        const progress = readJson('roadstar-learning-progress', { completed: {} });
        progress.completed = progress.completed || {};
        progress.completed[activeNode] = true;
        localStorage.setItem('roadstar-learning-progress', JSON.stringify(progress));
        const node = document.querySelector(`[data-roadmap-node="${activeNode}"]`);
        if (node) {
          node.classList.add('is-done');
          const color = node.style.backgroundColor;
          node.style.background = '#9ca3af';
          node.style.color = '#666';
          const subtasks = node.querySelectorAll('.roadmap-flow-subtask');
          subtasks.forEach(st => st.classList.add('is-done'));
        }
        const allNodes = document.querySelectorAll('[data-roadmap-node]');
        const total = allNodes.length || 1;
        const done = allNodes.length ? Array.from(allNodes).filter(n => n.classList.contains('is-done')).length : 0;
        const percent = Math.round((done / total) * 100);
        const progressText = document.querySelector('[data-learning-progress]');
        const progressBar = document.querySelector('[data-learning-progress-bar]');
        if (progressText) progressText.textContent = `${percent}%`;
        if (progressBar) progressBar.style.width = `${Math.min(percent, 100)}%`;
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

  const readJson = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const getCurrentLearningItem = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('item') || document.querySelector('[data-learning-title]')?.textContent?.trim() || '';
  };

  const fallbackLearningEntry = (item) => ({
    roadmap: {
      settings: {
        isDevModeDefault: false,
        panOnScroll: true,
        selectionOnDrag: false,
        fitView: true
      },
      nodes: [
        {
          id: 'intro',
          type: 'skillNode',
          data: {
            label: item || 'Roadmap',
            description: 'Стартовая дорожная карта загружается из встроенного fallback, если на устройстве ещё нет сохранённых данных из админ-панели.',
            color: '#b6eb24',
            status: 'Main',
            freeLinks: 'Roadstar demo',
            articleLinks: 'Скоро будет',
            plusLinks: 'Скоро будет',
            practiceEnabled: false,
            subTasks: []
          },
          position: { x: 160, y: 120 }
        },
        {
          id: 'base',
          type: 'skillNode',
          data: {
            label: 'База',
            description: 'Освой фундаментальные темы по выбранной профессии.',
            color: '#ee463a',
            status: 'Core',
            freeLinks: 'Полезные материалы',
            articleLinks: 'Скоро будет',
            plusLinks: 'Скоро будет',
            practiceEnabled: false,
            subTasks: []
          },
          position: { x: 460, y: 260 }
        },
        {
          id: 'next',
          type: 'skillNode',
          data: {
            label: 'Следующий шаг',
            description: 'Здесь появится детализированное наполнение из админ-панели или backend-источника.',
            color: '#0f766e',
            status: 'Next',
            freeLinks: 'Скоро будет',
            articleLinks: 'Скоро будет',
            plusLinks: 'Скоро будет',
            practiceEnabled: false,
            subTasks: []
          },
          position: { x: 780, y: 120 }
        }
      ],
      edges: [
        { id: 'fallback-1', source: 'intro', target: 'base', sourceSide: 'right', targetSide: 'left', type: 'smoothstep', animated: true },
        { id: 'fallback-2', source: 'base', target: 'next', sourceSide: 'right', targetSide: 'left', type: 'smoothstep', animated: true }
      ]
    }
  });

  const getLearningEntry = () => {
    const item = getCurrentLearningItem();
    const store = readJson('roadstar-learning-by-item', {});
    return store[item] || fallbackLearningEntry(item);
  };

  const formatMultiLine = (value) => {
    const lines = String(value || '')
      .split(/\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (!lines.length) return 'Скоро будет';
    return lines.map((line) => {
      const trimmed = line.trim();
      const httpMatch = trimmed.match(/^(https?:\/\/[^\s]+)/);
      if (httpMatch) {
        const url = httpMatch[1];
        const text = trimmed.slice(url.length).trim() || url;
        return `<div><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="learning-link">${escapeHtml(text || url)}</a></div>`;
      }
      return `<div>${escapeHtml(line)}</div>`;
    }).join('');
  };

  const isLink = (value) => /^https?:\/\//i.test(String(value || '').trim());

  const tintColor = (hex, done = false) => {
    const safe = /^#?[0-9a-fA-F]{6}$/.test(hex || '') ? (hex.startsWith('#') ? hex : `#${hex}`) : '#d9d9d9';
    if (done) {
      return '#9ca3af';
    }
    return safe;
  };

  const updateRoadmapProgress = (nodes) => {
    const progress = readJson('roadstar-learning-progress', { completed: {} });
    const total = Math.max(nodes.length, 1);
    const done = nodes.filter((node) => progress.completed?.[node.id]).length;
    const percent = Math.round((done / total) * 100);
    const progressText = document.querySelector('[data-learning-progress]');
    const progressBar = document.querySelector('[data-learning-progress-bar]');
    if (progressText) progressText.textContent = `${percent}%`;
    if (progressBar) {
      progressBar.style.width = `${Math.min(percent, 100)}%`;
    }
  };

  const openRoadmapModal = (node) => {
    if (!learningModal) return;
    learningModal.hidden = false;
    learningModal.dataset.activeNode = node.id;
    learningModal.dataset.activeNodeData = JSON.stringify(node.data || {});
    if (overlay) overlay.hidden = false;
    learningModal.querySelector('[data-modal-title]').textContent = node.data?.label || 'Скоро будет';
    const descText = node.data?.description?.trim();
    const modalText = learningModal.querySelector('[data-modal-text]');
    modalText.textContent = descText || '';
    modalText.hidden = !descText;
    const descLabel = modalText.previousElementSibling;
    if (descLabel && descLabel.tagName === 'STRONG') {
      descLabel.hidden = !descText;
    }
    learningModal.querySelector('[data-modal-free-links]').innerHTML = formatMultiLine(node.data?.freeLinks);
    learningModal.querySelector('[data-modal-plus-links]').innerHTML = formatMultiLine(node.data?.plusLinks);
    learningModal.querySelector('[data-modal-article-links]').innerHTML = formatMultiLine(node.data?.articleLinks);
    const practiceButton = learningModal.querySelector('[data-modal-practice]');
    if (practiceButton) {
      const enabled = Boolean(node.data?.practiceEnabled);
      practiceButton.hidden = !enabled;
      if (enabled) {
        practiceButton.textContent = 'Открыть практику';
        practiceButton.onclick = () => {
          const entry = getLearningEntry();
          const practiceContent = node.data?.practiceText || entry.practice || 'Практика пока не добавлена.';
          const practicePanel = document.querySelector('[data-learning-panel="practice"]');
          if (practicePanel) {
            practicePanel.innerHTML = `
              <div class="practice-card">
                <h2>${escapeHtml(node.data?.label || 'Практика')}</h2>
                <p>${escapeHtml(practiceContent)}</p>
              </div>
            `;
          }
          document.querySelector('[data-learning-tab="practice"]')?.click();
          closeLearningModalWithoutReload();
        };
      }
    }
  };

  const sidePoint = (node, side) => {
    const x = Number(node.position?.x || 0);
    const y = Number(node.position?.y || 0);
    const width = 192;
    const subTasks = Array.isArray(node.data?.subTasks) ? Math.min(node.data.subTasks.length, 4) : 0;
    const height = 58 + (subTasks ? subTasks * 34 + 8 : 0);
    if (side === 'top') return { x: x + width / 2, y };
    if (side === 'bottom') return { x: x + width / 2, y: y + height };
    if (side === 'left') return { x, y: y + height / 2 };
    return { x: x + width, y: y + height / 2 };
  };

  const edgePath = (start, end, sourceSide, targetSide) => {
    const offset = 28;
    const from = {
      top: { x: start.x, y: start.y - offset },
      right: { x: start.x + offset, y: start.y },
      bottom: { x: start.x, y: start.y + offset },
      left: { x: start.x - offset, y: start.y }
    }[sourceSide] || { x: start.x + offset, y: start.y };
    const to = {
      top: { x: end.x, y: end.y - offset },
      right: { x: end.x + offset, y: end.y },
      bottom: { x: end.x, y: end.y + offset },
      left: { x: end.x - offset, y: end.y }
    }[targetSide] || { x: end.x - offset, y: end.y };
    return `M ${start.x} ${start.y} L ${from.x} ${from.y} L ${to.x} ${to.y} L ${end.x} ${end.y}`;
  };

  const renderRoadmapBoard = () => {
    const entry = getLearningEntry();
    const panel = document.querySelector('[data-learning-panel="roadmap"]');
    if (!panel || !entry?.roadmap?.nodes?.length) return;

    const nodes = entry.roadmap.nodes;
    const edges = entry.roadmap.edges || [];
    const progress = readJson('roadstar-learning-progress', { completed: {} });
    const width = Math.max(...nodes.map((node) => Number(node.position?.x || 0) + 260), 920);
    const height = Math.max(...nodes.map((node) => Number(node.position?.y || 0) + 180), 560);
    const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));

    const lines = edges.map((edge) => {
      const source = byId[edge.source];
      const target = byId[edge.target];
      if (!source || !target) return '';
      const start = sidePoint(source, edge.sourceSide || 'right');
      const end = sidePoint(target, edge.targetSide || 'left');
      return `<path class="${edge.animated ? 'is-dashed' : ''}" marker-end="url(#roadmap-arrow)" d="${edgePath(start, end, edge.sourceSide || 'right', edge.targetSide || 'left')}" />`;
    }).join('');

    const cards = nodes.map((node) => {
      const color = node.data?.color || '#d9d9d9';
      const nodeDone = progress.completed?.[node.id];
      const subtasks = (node.data?.subTasks || []).slice(0, 4).map((item, subIndex) => {
        const subId = `${node.id}-sub-${subIndex}`;
        const subDone = progress.completed?.[subId];
        return `
          <button type="button" class="roadmap-flow-subtask ${subDone ? 'is-done' : ''}" data-roadmap-node="${escapeHtml(node.id)}" data-roadmap-subtask="${subIndex}" data-subtask-id="${escapeHtml(subId)}">
            ${escapeHtml(item.label || item)}
          </button>
        `;
      }).join('');
      return `
        <article
          class="roadmap-flow-node ${nodeDone ? 'is-done' : ''}"
          data-roadmap-node="${escapeHtml(node.id)}"
          role="button"
          tabindex="0"
          style="left:${Number(node.position?.x || 0)}px; top:${Number(node.position?.y || 0)}px; border-color:${escapeHtml(color)}; background:${tintColor(color, nodeDone)}; ${nodeDone ? 'color:#666;' : ''}"
        >
          <div class="roadmap-flow-node-head">
            <strong>${escapeHtml(node.data?.label || 'Без названия')}</strong>
          </div>
          ${subtasks ? `<div class="roadmap-flow-node-subtasks">${subtasks}</div>` : ''}
        </article>
      `;
    }).join('');

    panel.innerHTML = `
      <div class="learning-roadmap-stage" style="width:${width}px; height:${height}px;">
        <svg class="learning-roadmap-lines" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <defs>
            <marker id="roadmap-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2d7cff"></path>
            </marker>
          </defs>
          ${lines}
        </svg>
        ${cards}
      </div>
    `;

    panel.querySelectorAll('.roadmap-flow-node[data-roadmap-node]').forEach((card) => {
      card.addEventListener('click', () => {
        const node = byId[card.dataset.roadmapNode];
        if (node) openRoadmapModal(node);
      });
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        const node = byId[card.dataset.roadmapNode];
        if (node) openRoadmapModal(node);
      });
    });

    panel.querySelectorAll('[data-roadmap-subtask]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const nodeId = button.dataset.roadmapNode;
        const subIndex = Number(button.dataset.roadmapSubtask);
        const subId = button.dataset.subtaskId;
        const node = byId[nodeId];
        const subtask = node?.data?.subTasks?.[subIndex];
        if (!subtask) return;
        
        const isMarkDone = event.ctrlKey || event.metaKey;
        if (isMarkDone) {
          try {
            const progress = readJson('roadstar-learning-progress', { completed: {} });
            progress.completed = progress.completed || {};
            progress.completed[subId] = !progress.completed[subId];
            localStorage.setItem('roadstar-learning-progress', JSON.stringify(progress));
            button.classList.toggle('is-done', progress.completed[subId]);
            const entry = getLearningEntry();
            const total = (entry.roadmap?.nodes || []).length;
            const done = total ? Object.values(progress.completed || {}).filter(Boolean).length : 0;
            const percent = Math.round((done / total) * 100);
            const progressText = document.querySelector('[data-learning-progress]');
            const progressBar = document.querySelector('[data-learning-progress-bar]');
            if (progressText) progressText.textContent = `${percent}%`;
            if (progressBar) progressBar.style.width = `${Math.min(percent, 100)}%`;
          } catch {}
          return;
        }
        
        openRoadmapModal({
          id: subId,
          data: {
            label: subtask.label,
            description: subtask.description,
            freeLinks: subtask.freeLinks,
            articleLinks: subtask.articleLinks,
            plusLinks: subtask.plusLinks,
            practiceEnabled: subtask.practiceEnabled,
            parentNodeId: nodeId,
            subIndex: subIndex
          }
        });
      });
    });

    updateRoadmapProgress(nodes);
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  const activeTheme = savedTheme || themeButtons.find((button) => button.classList.contains('is-active'))?.dataset.theme || 'white';
  applyTheme(activeTheme);
  renderRoadmapBoard();
});
