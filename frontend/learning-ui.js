document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'learning') return;

  const THEME_KEY = 'roadstar-learning-theme';
  const SESSION_KEY = 'roadstar-local-session';
  const USERS_KEY = 'roadstar-local-users';
  const ROADMAP_PROGRESS_KEY = 'roadstar-roadmap-progress-by-user';
  const PRACTICE_PROGRESS_KEY = 'roadstar-practice-progress-by-user';
  const ARTICLES_KEY = 'roadstar-articles';
  const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

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
  const authModal = document.querySelector('[data-auth-modal]');
  const actionStatus = document.querySelector('[data-learning-action-status]');
  const tokensButton = document.querySelector('[data-learning-tokens-button]');
  const tokensPopover = document.querySelector('[data-learning-tokens-popover]');
  const authLoginButton = document.querySelector('[data-learning-auth-login]');
  const profileButton = document.querySelector('[data-learning-profile]');
  const authForm = document.querySelector('[data-auth-form]');
  const authStatus = document.querySelector('[data-auth-status]');
  const themeMeta = document.querySelector('meta[name="theme-color"]') || (() => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
    return meta;
  })();

  const readJson = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const apiUrl = (path) => `${API_BASE}${path}`;

  let currentUser = null;
  let backendAvailable = true;

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const currentItem = () => new URLSearchParams(window.location.search).get('item') || document.querySelector('[data-learning-title]')?.textContent?.trim() || 'Обучение';
  const currentUserKey = () => currentUser?.email || readJson(SESSION_KEY, null)?.email || 'guest';
  const progressMap = (key) => readJson(key, {});
  const writeProgressMap = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const safeUser = (user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
    created_date: user.created_date,
    provider: user.provider,
    provider_id: user.provider_id,
    plus: user.plus,
    tokens: user.tokens
  });

  const fallbackLearningEntry = (item) => ({
    practice: '',
    grade: '',
    interview: '',
    roadmap: {
      nodes: [
        {
          id: 'html-css',
          type: 'skillNode',
          data: {
            label: 'HTML & CSS',
            description: 'Семантика, адаптивность, современная вёрстка, доступность и работа с layout-системами.',
            color: '#172554',
            status: 'Core',
            freeLinks: 'https://developer.mozilla.org MDN Web Docs',
            articleLinks: '',
            plusLinks: '',
            practiceEnabled: true,
            subTasks: [
              { label: 'Semantic HTML', description: 'Семантические теги и структура документа.' },
              { label: 'Flexbox & Grid', description: 'Современные системы раскладки.' },
              { label: 'Responsive UI', description: 'Адаптивный дизайн и медиа-запросы.' }
            ]
          },
          position: { x: 80, y: 80 }
        },
        {
          id: 'javascript',
          type: 'skillNode',
          data: {
            label: 'JavaScript Core',
            description: 'Функции, замыкания, массивы, объекты, асинхронность и DOM API.',
            color: '#1e293b',
            status: 'Core',
            freeLinks: 'https://javascript.info JavaScript.info',
            articleLinks: '',
            plusLinks: '',
            practiceEnabled: true,
            subTasks: [
              { label: 'Closures', description: 'Замыкания и область видимости.' },
              { label: 'Async / Await', description: 'Асинхронный код и промисы.' },
              { label: 'DOM Events', description: 'Работа с событиями браузера.' }
            ]
          },
          position: { x: 420, y: 80 }
        },
        {
          id: 'react',
          type: 'skillNode',
          data: {
            label: 'React',
            description: 'Компоненты, состояние, эффекты, роутинг и композиция UI на современном React.',
            color: '#0f766e',
            status: 'Build',
            freeLinks: 'https://react.dev React Docs',
            articleLinks: '',
            plusLinks: '',
            practiceEnabled: true,
            subTasks: [
              { label: 'Hooks', description: 'useState, useEffect, useCallback и другие.' },
              { label: 'State flow', description: 'Управление состоянием приложения.' },
              { label: 'Routing', description: 'React Router и навигация.' }
            ]
          },
          position: { x: 760, y: 80 }
        },
        {
          id: 'tooling',
          type: 'skillNode',
          data: {
            label: 'Tooling',
            description: 'Сборщики, линтеры, форматтеры и рабочая среда разработчика.',
            color: '#312e81',
            status: 'Next',
            freeLinks: 'https://vitejs.dev Vite',
            articleLinks: '',
            plusLinks: '',
            practiceEnabled: false,
            subTasks: [
              { label: 'Vite / Webpack', description: 'Сборка и горячая замена модулей.' },
              { label: 'ESLint & Prettier', description: 'Качество и форматирование кода.' }
            ]
          },
          position: { x: 420, y: 340 }
        }
      ],
      edges: [
        { id: 'e1', source: 'html-css', target: 'javascript', sourceSide: 'right', targetSide: 'left', type: 'smoothstep', animated: true },
        { id: 'e2', source: 'javascript', target: 'react', sourceSide: 'right', targetSide: 'left', type: 'smoothstep', animated: true },
        { id: 'e3', source: 'javascript', target: 'tooling', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: true }
      ]
    }
  });

  const getLearningEntry = () => {
    const item = currentItem();
    const store = readJson('roadstar-learning-by-item', {});
    return store[item] || fallbackLearningEntry(item);
  };

  const formatMultiLine = (value) => {
    const lines = String(value || '').split(/\n/).map((item) => item.trim()).filter(Boolean);
    if (!lines.length) return 'Скоро будет';
    return lines.map((line) => {
      const match = line.match(/^(https?:\/\/\S+)\s*(.*)$/i);
      if (!match) return `<div>${escapeHtml(line)}</div>`;
      const [, url, label] = match;
      return `<div><a class="learning-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label || url)}</a></div>`;
    }).join('');
  };

  const renderUserState = () => {
    if (authLoginButton) authLoginButton.hidden = Boolean(currentUser);
    if (profileButton) {
      profileButton.hidden = !currentUser;
      profileButton.textContent = currentUser ? (currentUser.name || currentUser.email) : '';
    }
    const tokenValue = document.querySelector('[data-learning-tokens]');
    if (tokenValue) tokenValue.textContent = String(currentUser?.tokens || 0);
    if (plusBadge) plusBadge.hidden = currentUser?.plus !== 'on';
    if (plusLink) {
      plusLink.hidden = currentUser?.plus === 'on';
      plusLink.style.display = plusLink.hidden ? 'none' : 'inline-flex';
      plusLink.textContent = 'Перейти на plus';
    }
  };

  const localAuth = (mode, payload) => {
    const users = readJson(USERS_KEY, []);
    if (mode === 'register') {
      if (!payload.name || payload.name.trim().length < 2) throw new Error('Введите имя.');
      if (!payload.consent) throw new Error('Подтверди согласие с правилами.');
      if (users.some((user) => user.email === payload.email)) throw new Error('Пользователь уже существует.');
      const created = {
        id: Date.now(),
        email: payload.email,
        name: payload.name,
        password: payload.password,
        created_at: new Date().toISOString(),
        created_date: new Date().toISOString().slice(0, 10),
        provider: 'local',
        provider_id: null,
        plus: 'off',
        tokens: 0
      };
      users.push(created);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser(created)));
      return { user: safeUser(created) };
    }
    const found = users.find((user) => user.email === payload.email && user.password === payload.password);
    if (!found) throw new Error('Неверный email или пароль.');
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser(found)));
    return { user: safeUser(found) };
  };

  const syncUserState = async () => {
    try {
      const response = await fetch(apiUrl('/api/auth/me'), { credentials: 'include' });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (!response.ok) throw new Error(data.error || 'auth');
      currentUser = data.user || null;
      backendAvailable = true;
    } catch {
      backendAvailable = false;
      currentUser = readJson(SESSION_KEY, null);
    }
    renderUserState();
  };

  const setupAuthModal = async () => {
    const setMode = (mode) => {
      const currentMode = mode === 'login' ? 'login' : 'register';
      authModal.dataset.mode = currentMode;
      document.querySelectorAll('[data-auth-tab]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.authTab === currentMode);
      });
      document.querySelector('[data-auth-title]').textContent = currentMode === 'register' ? 'Регистрация' : 'Войти';
      document.querySelector('[data-auth-subtitle]').textContent = currentMode === 'register'
        ? 'Создайте аккаунт для доступа к профессиям, практике, тестам и карьерным сценариям.'
        : 'Введите данные аккаунта, чтобы продолжить обучение.';
      document.querySelector('[data-auth-button]').textContent = currentMode === 'register' ? 'Создать аккаунт' : 'Войти';
      document.querySelector('[data-name-field]').hidden = currentMode !== 'register';
    };

    authLoginButton?.addEventListener('click', () => {
      setMode('login');
      authModal.hidden = false;
      if (overlay) overlay.hidden = false;
      if (authStatus) authStatus.textContent = '';
    });

    profileButton?.addEventListener('click', () => {
      showActionStatus(`Профиль: ${currentUser?.name || currentUser?.email || 'не найден'}`);
    });

    document.querySelectorAll('[data-auth-tab]').forEach((button) => {
      button.addEventListener('click', () => setMode(button.dataset.authTab));
    });

    document.querySelector('[data-close-auth]')?.addEventListener('click', () => {
      authModal.hidden = true;
      if (overlay && learningModal?.hidden !== false && articleModal?.hidden !== false && createArticleModal?.hidden !== false) {
        overlay.hidden = true;
      }
    });

    authForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(authForm);
      const payload = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim().toLowerCase(),
        password: String(formData.get('password') || ''),
        consent: Boolean(formData.get('consent'))
      };
      const mode = authModal.dataset.mode || 'login';
      try {
        let result;
        try {
          const response = await fetch(apiUrl(mode === 'register' ? '/api/auth/register' : '/api/auth/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Ошибка авторизации');
          result = data;
          backendAvailable = true;
        } catch {
          backendAvailable = false;
          result = localAuth(mode, payload);
        }
        currentUser = result.user;
        renderUserState();
        authForm.reset();
        authModal.hidden = true;
        if (overlay) overlay.hidden = true;
        if (authStatus) authStatus.textContent = '';
      } catch (error) {
        if (authStatus) authStatus.textContent = error.message;
      }
    });

    try {
      const response = await fetch(apiUrl('/api/auth/providers'));
      const data = await response.json();
      if (!response.ok) throw new Error('oauth');
      document.querySelectorAll('[data-oauth-button]').forEach((button) => {
        if (data.providers?.[button.dataset.oauthButton]) return;
        button.classList.add('oauth-unavailable');
        button.addEventListener('click', (event) => {
          event.preventDefault();
          if (!authStatus) return;
          authStatus.textContent = 'Пока нет, скоро будет...';
          clearTimeout(setupAuthModal.timer);
          setupAuthModal.timer = setTimeout(() => {
            authStatus.textContent = '';
          }, 2200);
        });
      });
    } catch {
      document.querySelectorAll('[data-oauth-button]').forEach((button) => {
        button.classList.add('oauth-unavailable');
        button.addEventListener('click', (event) => {
          event.preventDefault();
          if (!authStatus) return;
          authStatus.textContent = 'Пока нет, скоро будет...';
          clearTimeout(setupAuthModal.timer);
          setupAuthModal.timer = setTimeout(() => {
            authStatus.textContent = '';
          }, 2200);
        });
      });
    }

    setMode('login');
  };

  const syncPlusLink = () => {
    if (!plusLink || !plusBadge) return;
    const plusActive = !plusBadge.hidden;
    plusLink.hidden = plusActive || !plusLink.textContent.trim();
    plusLink.style.display = plusLink.hidden ? 'none' : 'inline-flex';
  };

  const showActionStatus = (message) => {
    if (!actionStatus) return;
    actionStatus.hidden = false;
    actionStatus.textContent = message;
    window.clearTimeout(showActionStatus.timer);
    showActionStatus.timer = window.setTimeout(() => {
      actionStatus.hidden = true;
    }, 2200);
  };

  const applyTheme = (theme) => {
    if (!main) return;
    main.setAttribute('data-learning-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.theme === theme);
    });
    themeMeta.content = ({ white: '#f7f4ee', black: '#111317', blue: '#0c1626', beige: '#eadbc7' })[theme] || '#f7f4ee';
  };

  const activateTab = (name) => {
    document.querySelectorAll('[data-learning-tab]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.learningTab === name);
    });
    document.querySelectorAll('[data-learning-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.learningPanel !== name;
    });
  };

  const getRoadmapProgress = () => {
    const map = progressMap(ROADMAP_PROGRESS_KEY);
    return map[`${currentUserKey()}::${currentItem()}`] || { completed: {} };
  };

  const setRoadmapProgress = (value) => {
    const map = progressMap(ROADMAP_PROGRESS_KEY);
    map[`${currentUserKey()}::${currentItem()}`] = value;
    writeProgressMap(ROADMAP_PROGRESS_KEY, map);
  };

  const normalizePracticeProgress = (value = {}, planLength = 0) => {
    const history = Array.isArray(value.history) ? value.history : [];
    const completedSteps = Array.isArray(value.completedSteps)
      ? value.completedSteps.filter(Boolean)
      : Array.from(new Set(history.filter((item) => item?.passed && item?.stepId).map((item) => item.stepId)));
    const solved = Math.max(Number(value.solved || 0), completedSteps.length);
    return {
      stepIndex: Math.max(0, Number(value.stepIndex || 0)),
      solved,
      lastTask: String(value.lastTask || ''),
      history,
      completedSteps,
      planLength: Math.max(Number(value.planLength || 0), Number(planLength || 0))
    };
  };

  const getPracticeProgress = (planLength = 0) => {
    const map = progressMap(PRACTICE_PROGRESS_KEY);
    return normalizePracticeProgress(map[`${currentUserKey()}::${currentItem()}`] || {}, planLength);
  };

  const setPracticeProgress = (value, planLength = 0) => {
    const map = progressMap(PRACTICE_PROGRESS_KEY);
    map[`${currentUserKey()}::${currentItem()}`] = normalizePracticeProgress(value, planLength);
    writeProgressMap(PRACTICE_PROGRESS_KEY, map);
  };

  const setSectionProgress = (label, percent) => {
    const value = Math.max(0, Math.min(100, Math.round(percent || 0)));
    const labelNode = document.querySelector('[data-learning-progress-label]');
    const valueNode = document.querySelector('[data-learning-progress-value]');
    const fillNode = document.querySelector('[data-learning-progress-fill]');
    if (labelNode) labelNode.textContent = label;
    if (valueNode) valueNode.textContent = `${value}%`;
    if (fillNode) fillNode.style.width = `${value}%`;
  };

  const updateRoadmapProgressUI = async (nodes) => {
    const progress = getRoadmapProgress();

    const entry = getLearningEntry();
    const roadmapNodes = entry?.roadmap?.nodes || nodes || [];

    const total = Array.isArray(roadmapNodes) ? roadmapNodes.length : 0;

    const done = Array.isArray(roadmapNodes)
      ? roadmapNodes.filter((node) => progress.completed?.[node.id]).length
      : 0;

    try {
      const response = await fetch('http://localhost:3000/api/roadmaps/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          total,
          completed: done
        })
      });

      const data = await response.json();
      setSectionProgress('Прогресс дорожной карты', data.percent);
    } catch (error) {
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;
      setSectionProgress('Прогресс дорожной карты', percent);
    }
  };

  const closeLearningModalWithoutReload = () => {
    if (!learningModal || learningModal.hidden) return;
    learningModal.hidden = true;
    if (overlay && articleModal?.hidden !== false && createArticleModal?.hidden !== false && authModal?.hidden !== false) {
      overlay.hidden = true;
    }
    const entry = getLearningEntry();
    updateRoadmapProgressUI(entry.roadmap?.nodes || []);
    renderRoadmapBoard();
  };

  const closeAnyLearningOverlay = () => {
    closeLearningModalWithoutReload();
    if (articleModal) articleModal.hidden = true;
    if (createArticleModal) createArticleModal.hidden = true;
    if (authModal) authModal.hidden = true;
    if (tokensPopover) tokensPopover.hidden = true;
    if (themeMenu) themeMenu.hidden = true;
    if (overlay) overlay.hidden = true;
  };

  const NODE_W = 196;
  const NODE_H = 74;

  const sidePoint = (node, side) => {
    const x = Number(node.position?.x || 0);
    const y = Number(node.position?.y || 0);
    if (side === 'top')    return { x: x + NODE_W / 2, y };
    if (side === 'bottom') return { x: x + NODE_W / 2, y: y + NODE_H };
    if (side === 'left')   return { x,          y: y + NODE_H / 2 };
    /* right */            return { x: x + NODE_W, y: y + NODE_H / 2 };
  };

  const edgePath = (start, end, sourceSide, targetSide) => {
    const dir = { right: [1,0], left: [-1,0], top: [0,-1], bottom: [0,1] };
    const [sdx, sdy] = dir[sourceSide] || dir.right;
    const [tdx, tdy] = dir[targetSide] || dir.left;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const c = Math.min(Math.max(dist * 0.45, 40), 160);
    const cp1x = start.x + sdx * c;
    const cp1y = start.y + sdy * c;
    const cp2x = end.x + tdx * c;
    const cp2y = end.y + tdy * c;
    return `M ${start.x} ${start.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${end.x} ${end.y}`;
  };

  const openRoadmapModal = (node) => {
    if (!learningModal) return;
    const prog = getRoadmapProgress();
    prog.completed = prog.completed || {};
    prog.completed[node.id] = true;
    setRoadmapProgress(prog);
    learningModal.hidden = false;
    learningModal.dataset.activeNode = node.id;
    if (overlay) overlay.hidden = false;
    learningModal.querySelector('[data-modal-title]').textContent = node.data?.label || 'Скоро будет';
    const modalText = learningModal.querySelector('[data-modal-text]');
    modalText.textContent = node.data?.description || '';
    modalText.hidden = !modalText.textContent.trim();
    learningModal.querySelector('[data-modal-free-links]').innerHTML = formatMultiLine(node.data?.freeLinks);
    learningModal.querySelector('[data-modal-plus-links]').innerHTML = formatMultiLine(node.data?.plusLinks);
    learningModal.querySelector('[data-modal-article-links]').innerHTML = formatMultiLine(node.data?.articleLinks);
    const practiceButton = learningModal.querySelector('[data-modal-practice]');
    if (practiceButton) {
      const enabled = Boolean(node.data?.practiceEnabled);
      practiceButton.hidden = !enabled;
      practiceButton.onclick = () => {
        activateTab('practice');
        renderPracticePanel(node.data?.label || currentItem());
        closeLearningModalWithoutReload();
      };
    }
  };

  const renderRoadmapBoard = () => {
    const entry = getLearningEntry();
    const panel = document.querySelector('[data-learning-panel="roadmap"]');
    if (!panel || !entry?.roadmap?.nodes?.length) return;
    const nodes = entry.roadmap.nodes;
    const edges = entry.roadmap.edges || [];
    const progress = getRoadmapProgress();
    const PAD = 32;
    const width = Math.max(...nodes.map((node) => Number(node.position?.x || 0) + NODE_W + PAD + 60), Math.max(window.innerWidth - 80, 960));
    const height = Math.max(...nodes.map((node) => Number(node.position?.y || 0) + NODE_H + PAD + 60), 520);
    const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const lines = edges.map((edge) => {
      const source = byId[edge.source];
      const target = byId[edge.target];
      if (!source || !target) return '';
      const start = sidePoint(source, edge.sourceSide || 'right');
      const end = sidePoint(target, edge.targetSide || 'left');
      return `<path class="edge-path${edge.animated ? ' is-dashed' : ''}" marker-end="url(#roadmap-arrow)" d="${edgePath(start, end, edge.sourceSide || 'right', edge.targetSide || 'left')}" />`;
    }).join('');
    const cards = nodes.map((node) => {
      const nodeDone = progress.completed?.[node.id];
      return `
        <article class="roadmap-flow-node ${nodeDone ? 'is-done' : ''}" data-roadmap-node="${escapeHtml(node.id)}" tabindex="0" style="left:${Number(node.position?.x || 0)}px; top:${Number(node.position?.y || 0)}px; background:${escapeHtml(node.data?.color || '#18212f')};">
          <strong class="roadmap-flow-node-title">${escapeHtml(node.data?.label || 'Без названия')}</strong>
        </article>
      `;
    }).join('');
    panel.innerHTML = `
      <div class="learning-roadmap-stage" style="width:${width}px; height:${height}px;">
        <svg class="learning-roadmap-lines" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <defs>
            <marker id="roadmap-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee"></path>
            </marker>
          </defs>
          ${lines}
        </svg>
        ${cards}
      </div>`;
    panel.querySelectorAll('.roadmap-flow-node[data-roadmap-node]').forEach((card) => {
      const open = () => {
        const node = byId[card.dataset.roadmapNode];
        if (node) openRoadmapModal(node);
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      });
    });
    panel.querySelectorAll('[data-roadmap-subtask]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const node = byId[button.dataset.roadmapNode];
        const subtask = node?.data?.subTasks?.[Number(button.dataset.roadmapSubtask)];
        if (!subtask) return;
        openRoadmapModal({
          id: `${node.id}-sub-${button.dataset.roadmapSubtask}`,
          data: {
            label: subtask.label,
            description: subtask.description,
            freeLinks: subtask.freeLinks,
            articleLinks: subtask.articleLinks,
            plusLinks: subtask.plusLinks,
            practiceEnabled: subtask.practiceEnabled
          }
        });
      });
    });
    updateRoadmapProgressUI(nodes);
  };

  const renderPracticeProgress = (progress, total) => {
    const completed = Math.min(
      total,
      Math.max(
        Array.isArray(progress?.completedSteps) ? progress.completedSteps.length : 0,
        Number(progress?.solved || 0)
      )
    );
    const completedPercent = total ? Math.round((completed / total) * 100) : 0;
    setSectionProgress('Прогресс практики', completedPercent);
    return `
      <div class="practice-progress-card">
        <span>Прогресс практики</span>
        <p>${completedPercent}% выполнено по текущему плану.</p>
      </div>`;
  };

  const fetchJson = async (url, options = {}) => {
    const response = await fetch(apiUrl(url), { credentials: 'include', ...options });
    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: text || 'Некорректный ответ сервера' };
    }
    if (!response.ok) throw new Error(data.error || 'Ошибка запроса');
    return data;
  };

  const renderPracticePanel = async (forcedTopic = '') => {
    const panel = document.querySelector('[data-learning-panel="practice"]');
    if (!panel) return;
    const profession = currentItem();
    panel.innerHTML = `<div class="practice-card"><p>Загружаю план практики...</p></div>`;
    try {
      let planData;
      try {
        planData = await fetchJson(`/api/practice/plan?item=${encodeURIComponent(profession)}`);
      } catch {
        const entry = getLearningEntry();
        planData = {
          plan: [{
            id: 'local-practice-1',
            title: entry.practice?.title || `${profession}: практика`,
            level: 'easy',
            goal: 'разобрать тему и ответить на задачу',
            prompt: entry.practice?.prompt || 'Напиши решение по теме.',
            success: 'Ответ содержит законченное решение и понятный ход мысли.',
            hint: entry.practice?.placeholder || 'Опиши решение пошагово.'
          }]
        };
      }
      const plan = Array.isArray(planData?.plan) && planData.plan.length ? planData.plan : [{
        id: 'local-practice-1',
        title: `${profession}: практика`,
        level: 'easy',
        goal: 'разобрать тему и ответить на задачу',
        prompt: 'Напиши решение по теме.',
        success: 'Ответ содержит законченное решение и понятный ход мысли.',
        hint: 'Опиши решение пошагово.'
      }];
      const progress = getPracticeProgress(plan.length);
      const safeIndex = Math.min(progress.stepIndex || 0, Math.max(plan.length - 1, 0));
      const step = plan[safeIndex] || plan[0];
      let taskData;
      try {
        taskData = await fetchJson('/api/ai/practice/task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profession, stepId: step.id, topic: forcedTopic })
        });
      } catch {
        taskData = {
          task: step.prompt || `Тема: ${forcedTopic || step.title}. ${profession}: опиши решение или напиши код.`,
          step
        };
      }
      progress.lastTask = taskData.task;
      progress.planLength = plan.length;
      setPracticeProgress(progress, plan.length);
      panel.innerHTML = `
        ${renderPracticeProgress(progress, plan.length)}
        <div class="practice-card">
          <div class="practice-head">
            <div>
              <span class="practice-badge">${escapeHtml(step.level)}</span>
              <h2>${escapeHtml(step.title)}</h2>
            </div>
            <button type="button" class="ghost-button" data-practice-refresh>Новая задача</button>
          </div>
          <p>${escapeHtml(taskData.task)}</p>
          <div class="practice-code-editor">
            <div class="practice-code-editor-header">
              <span class="practice-code-dots"><i></i><i></i><i></i></span>
              <strong>JavaScript</strong>
              <button type="button" class="practice-run-btn" data-run-practice-code>▶ Запустить</button>
            </div>
            <textarea class="practice-code-textarea" data-practice-answer placeholder="// Напиши решение здесь&#10;// console.log('Привет!');" spellcheck="false" autocorrect="off" autocapitalize="off"></textarea>
          </div>
          <div class="practice-console-wrap">
            <div class="practice-console-header">
              <span>Консоль</span>
              <button type="button" class="practice-console-clear" data-clear-console title="Очистить">✕</button>
            </div>
            <pre class="practice-console" data-practice-console>— нажми Запустить</pre>
          </div>
          <div class="practice-actions">
            <button type="button" class="register-pill" data-check-practice>Оставить ответ</button>
            <button type="button" class="ghost-button" data-practice-next>Следующий шаг</button>
          </div>
          <p class="practice-result" data-practice-result></p>
        </div>
      `;
      panel.querySelector('[data-practice-refresh]')?.addEventListener('click', () => renderPracticePanel(forcedTopic));
      panel.querySelector('[data-practice-next]')?.addEventListener('click', () => {
        const next = getPracticeProgress(plan.length);
        next.stepIndex = Math.min((safeIndex || 0) + 1, Math.max(plan.length - 1, 0));
        setPracticeProgress(next, plan.length);
        renderPracticePanel();
      });
      panel.querySelector('[data-clear-console]')?.addEventListener('click', () => {
        const consoleNode = panel.querySelector('[data-practice-console]');
        if (consoleNode) { consoleNode.textContent = '— нажми Запустить'; consoleNode.className = 'practice-console'; }
      });
      const textarea = panel.querySelector('[data-practice-answer]');
      if (textarea) {
        textarea.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') { e.preventDefault(); const s = textarea.selectionStart; const v = textarea.value; textarea.value = v.slice(0, s) + '  ' + v.slice(textarea.selectionEnd); textarea.selectionStart = textarea.selectionEnd = s + 2; }
        });
      }
      panel.querySelector('[data-run-practice-code]')?.addEventListener('click', () => {
        const answer = String(panel.querySelector('[data-practice-answer]')?.value || '');
        const consoleNode = panel.querySelector('[data-practice-console]');
        if (!answer.trim()) {
          consoleNode.textContent = 'Сначала напиши код.';
          return;
        }
        const output = [];
        try {
          const runner = new Function('console', `${answer}\nreturn true;`);
          runner({
            log: (...args) => output.push(args.map((item) => typeof item === 'string' ? item : JSON.stringify(item)).join(' ')),
            warn: (...args) => output.push(`⚠ ${args.join(' ')}`),
            error: (...args) => output.push(`✕ ${args.join(' ')}`)
          });
          consoleNode.textContent = output.length ? output.join('\n') : '✓ Код выполнен без вывода.';
          consoleNode.className = output.some((l) => l.startsWith('✕')) ? 'practice-console is-error' : 'practice-console is-ok';
        } catch (error) {
          consoleNode.textContent = `✕ ${error.message}`;
          consoleNode.className = 'practice-console is-error';
        }
      });
      panel.querySelector('[data-check-practice]')?.addEventListener('click', async () => {
        const answer = String(panel.querySelector('[data-practice-answer]')?.value || '').trim();
        const resultNode = panel.querySelector('[data-practice-result]');
        if (!answer) {
          resultNode.textContent = 'Сначала добавь решение.';
          return;
        }
        resultNode.textContent = 'Проверяю ответ...';
        try {
          let result;
          try {
            result = await fetchJson('/api/ai/practice/check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ profession, stepId: step.id, task: taskData.task, answer })
            });
          } catch {
            const passed = answer.length >= Math.max(24, Math.floor(String(step.success || '').length * 0.35));
            result = {
              passed,
              feedback: passed ? 'Ответ выглядит достаточно полным для текущего шага.' : 'Ответ пока слабый. Усиль решение и попробуй ещё раз.',
              next: passed ? 'Можно переходить к следующей задаче.' : 'Попробуй расширить ответ и объяснить ход решения.'
            };
          }
          resultNode.textContent = `${result.feedback} ${result.next}`;
          if (result.passed) {
            const next = getPracticeProgress(plan.length);
            const completed = new Set(Array.isArray(next.completedSteps) ? next.completedSteps : []);
            completed.add(step.id);
            next.completedSteps = Array.from(completed);
            next.solved = next.completedSteps.length;
            next.stepIndex = Math.min(safeIndex + 1, Math.max(plan.length - 1, 0));
            next.history = [...(next.history || []), { stepId: step.id, passed: true, at: new Date().toISOString() }].slice(-20);
            setPracticeProgress(next, plan.length);
            resultNode.textContent = `${result.feedback} ${result.next}`;
            renderPracticePanel();
          }
        } catch (error) {
          resultNode.textContent = error.message;
        }
      });
    } catch (error) {
      panel.innerHTML = `<div class="practice-card"><p>${escapeHtml(error.message)}</p></div>`;
    }
  };

  const renderMentorPanel = () => {
    const panel = document.querySelector('[data-learning-panel="mentor"]');
    if (!panel) return;
    const plusActive = currentUser?.plus === 'on';
    setSectionProgress('ИИ-репетитор', plusActive ? 100 : 0);
    if (!plusActive) {
      panel.innerHTML = `
        <div class="learning-info-card">
          <h2>ИИ-репетитор</h2>
          <p>Доступен пользователям с активным Plus. Если интеграция ещё не настроена, появится сообщение «пока нет, скоро будет».</p>
        </div>`;
      return;
    }
    panel.innerHTML = `
      <div class="mentor-chat-card">
        <div class="mentor-chat-log" data-mentor-log>
          <div class="mentor-message mentor-message-ai">Спроси про текущую тему, шаг дорожной карты или решение задачи.</div>
        </div>
        <form class="mentor-chat-form" data-mentor-form>
          <textarea rows="4" name="question" placeholder="Например: как лучше подступиться к текущей задаче?"></textarea>
          <button type="submit" class="register-pill">Спросить</button>
        </form>
      </div>`;
    panel.querySelector('[data-mentor-form]')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const question = String(new FormData(form).get('question') || '').trim();
      if (!question) return;
      const log = panel.querySelector('[data-mentor-log]');
      log.insertAdjacentHTML('beforeend', `<div class="mentor-message mentor-message-user">${escapeHtml(question)}</div>`);
      form.reset();
      try {
        const practice = getPracticeProgress();
        const response = await fetchJson('/api/ai/mentor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profession: currentItem(), context: `Шаг практики: ${practice.stepIndex || 0}; Решено: ${practice.solved || 0}`, question })
        });
        log.insertAdjacentHTML('beforeend', `<div class="mentor-message mentor-message-ai">${escapeHtml(response.answer)}</div>`);
        log.scrollTop = log.scrollHeight;
      } catch (error) {
        log.insertAdjacentHTML('beforeend', `<div class="mentor-message mentor-message-ai">${escapeHtml(error.message)}</div>`);
      }
    });
  };

  const renderGradePanel = () => {
    const panel = document.querySelector('[data-learning-panel="grade"]');
    if (!panel) return;
    setSectionProgress('Прогресс грейда', 0);
    panel.innerHTML = `
      <div class="learning-question-card">
        <h3>Тест по грейду</h3>
        <p>Грейд-оценка пока работает в тестовом режиме. Здесь позже будет сценарий вопросов из админ-панели.</p>
      </div>`;
  };

  const renderInterviewPanel = () => {
    const panel = document.querySelector('[data-learning-panel="interview"]');
    if (!panel) return;
    setSectionProgress('Прогресс собеседования', 0);
    panel.innerHTML = `
      <div class="learning-info-card">
        <h2>Подготовка к собеседованию</h2>
        <p>Собери истории о проектах, освежи ключевые темы по стеку и потренируй объяснение решений вслух.</p>
      </div>`;
  };

  const renderArticles = () => {
    const panel = document.querySelector('[data-learning-panel="articles"]');
    if (!panel) return;
    setSectionProgress('Статьи', 0);
    const entry = getLearningEntry();
    const articles = readJson(ARTICLES_KEY, []);
    const visibleArticles = articles.length ? articles : (entry.articles || []);
    panel.innerHTML = `
      <div class="articles-toolbar"><div class="articles-filters"><button type="button" class="ghost-button" data-add-article>Добавить свою статью</button></div></div>
      <div class="articles-list">
        ${(visibleArticles.length ? visibleArticles : [{ id: 'fallback', title: 'Как не потеряться в изучении профессии', createdAt: '2026-04-06', likes: 0, views: 0 }]).map((article) => `
          <button type="button" class="article-card" data-open-article="${escapeHtml(article.id)}"><strong>${escapeHtml(article.title)}</strong><span>${escapeHtml(article.createdAt || '')}</span><span>Лайки: ${Number(article.likes || 0)}</span><span>Просмотры: ${Number(article.views || 0)}</span></button>
        `).join('')}
      </div>`;

    panel.querySelector('[data-add-article]')?.addEventListener('click', () => {
      if (createArticleModal) createArticleModal.hidden = false;
      if (overlay) overlay.hidden = false;
    });

    panel.querySelectorAll('[data-open-article]').forEach((button) => {
      button.addEventListener('click', () => {
        const list = readJson(ARTICLES_KEY, visibleArticles);
        const article = list.find((entry) => entry.id === button.dataset.openArticle);
        if (!article) return;
        const viewer = currentUserKey();
        if (!(article.viewers || []).includes(viewer)) {
          article.viewers = [...(article.viewers || []), viewer];
          article.views = Number(article.views || 0) + 1;
          localStorage.setItem(ARTICLES_KEY, JSON.stringify(list));
        }
        const modal = articleModal;
        if (!modal) return;
        modal.hidden = false;
        if (overlay) overlay.hidden = false;
        modal.dataset.articleId = article.id;
        modal.querySelector('[data-article-title]').textContent = article.title;
        modal.querySelector('[data-article-meta]').textContent = `${article.createdAt || ''} · ${article.author || 'Roadstar'}`;
        modal.querySelector('[data-article-body]').textContent = article.body || '';
        modal.querySelector('[data-article-stats]').textContent = `Лайки: ${Number(article.likes || 0)} · Просмотры: ${Number(article.views || 0)}`;
      });
    });
  };

  const setupTabs = () => {
    document.querySelectorAll('[data-learning-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.learningTab;
        activateTab(target);
        if (target === 'roadmap') renderRoadmapBoard();
        if (target === 'practice') renderPracticePanel();
        if (target === 'mentor') renderMentorPanel();
        if (target === 'grade') renderGradePanel();
        if (target === 'interview') renderInterviewPanel();
        if (target === 'articles') renderArticles();
      });
    });
  };

  document.querySelector('[data-learning-download]')?.addEventListener('click', () => {
    window.open(`roadmap-pdf.html?item=${encodeURIComponent(currentItem())}`, '_blank', 'noopener');
  });

  document.querySelector('[data-learning-share]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showActionStatus('Ссылка на дорожную карту скопирована.');
    } catch {
      showActionStatus('Не удалось скопировать ссылку.');
    }
  });

  themeToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (themeMenu) themeMenu.hidden = !themeMenu.hidden;
  });

  themeButtons.forEach((button) => button.addEventListener('click', () => {
    applyTheme(button.dataset.theme);
    if (themeMenu) themeMenu.hidden = true;
  }));

  tokensButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (tokensPopover) tokensPopover.hidden = !tokensPopover.hidden;
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-theme-switcher]') && themeMenu) themeMenu.hidden = true;
    if (!event.target.closest('[data-learning-tokens-button]') && tokensPopover) tokensPopover.hidden = true;
  });

  document.querySelector('[data-close-learning-modal]')?.addEventListener('click', (event) => {
    event.preventDefault();
    closeLearningModalWithoutReload();
  }, true);

  overlay?.addEventListener('click', (event) => {
    event.preventDefault();
    closeAnyLearningOverlay();
  }, true);

  [learningModal, articleModal, createArticleModal, authModal].forEach((modal) => {
    modal?.addEventListener('click', (event) => {
      if (event.target !== modal) return;
      closeAnyLearningOverlay();
    }, true);
  });

  // Article editor: toolbar, preview, char counter
  const articleBodyEl = document.querySelector('[data-article-body]');
  const articlePreviewEl = document.querySelector('[data-article-preview]');
  const articleCharsEl = document.querySelector('[data-article-chars]');

  const renderArticlePreview = (text) => {
    if (!articlePreviewEl) return;
    let html = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^## (.+)$/gm, '<strong style="font-size:1.1em">$1</strong>')
      .replace(/^- (.+)$/gm, '• $1');
    articlePreviewEl.innerHTML = html;
  };

  if (articleBodyEl) {
    articleBodyEl.addEventListener('input', () => {
      const len = articleBodyEl.value.length;
      if (articleCharsEl) articleCharsEl.textContent = `${len} символов`;
      if (articlePreviewEl && !articlePreviewEl.hidden) renderArticlePreview(articleBodyEl.value);
    });
    articleBodyEl.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); const s = articleBodyEl.selectionStart; articleBodyEl.value = articleBodyEl.value.slice(0, s) + '  ' + articleBodyEl.value.slice(articleBodyEl.selectionEnd); articleBodyEl.selectionStart = articleBodyEl.selectionEnd = s + 2; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); wrapSelection(articleBodyEl, '**', '**'); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); wrapSelection(articleBodyEl, '*', '*'); }
    });
  }

  const wrapSelection = (el, before, after) => {
    const s = el.selectionStart; const e = el.selectionEnd;
    const sel = el.value.slice(s, e) || 'текст';
    el.value = el.value.slice(0, s) + before + sel + after + el.value.slice(e);
    el.selectionStart = s + before.length; el.selectionEnd = s + before.length + sel.length;
    el.focus();
  };

  document.querySelectorAll('[data-format]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!articleBodyEl) return;
      const fmt = btn.dataset.format;
      if (fmt === 'bold') wrapSelection(articleBodyEl, '**', '**');
      else if (fmt === 'italic') wrapSelection(articleBodyEl, '*', '*');
      else if (fmt === 'code') wrapSelection(articleBodyEl, '`', '`');
      else if (fmt === 'h2') { const s = articleBodyEl.selectionStart; articleBodyEl.value = articleBodyEl.value.slice(0, s) + '## ' + articleBodyEl.value.slice(s); articleBodyEl.selectionStart = articleBodyEl.selectionEnd = s + 3; articleBodyEl.focus(); }
      else if (fmt === 'ul') { const s = articleBodyEl.selectionStart; articleBodyEl.value = articleBodyEl.value.slice(0, s) + '- ' + articleBodyEl.value.slice(s); articleBodyEl.selectionStart = articleBodyEl.selectionEnd = s + 2; articleBodyEl.focus(); }
    });
  });

  document.querySelector('[data-article-preview-toggle]')?.addEventListener('click', (e) => {
    if (!articleBodyEl || !articlePreviewEl) return;
    const isPreview = !articlePreviewEl.hidden;
    articlePreviewEl.hidden = isPreview;
    articleBodyEl.hidden = !isPreview;
    e.currentTarget.textContent = isPreview ? 'Предпросмотр' : 'Редактировать';
    if (!isPreview) renderArticlePreview(articleBodyEl.value);
  });

  document.querySelector('[data-create-article-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const articles = readJson(ARTICLES_KEY, []);
    articles.unshift({
      id: `article-${Date.now()}`,
      title: String(formData.get('title') || '').trim(),
      body: String(formData.get('body') || '').trim(),
      tags: String(formData.get('tags') || '').split(',').map((item) => item.trim()).filter(Boolean),
      author: currentUser?.name || 'Гость',
      createdAt: new Date().toISOString().slice(0, 10),
      likes: 0,
      views: 0,
      viewers: []
    });
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    form.reset();
    closeAnyLearningOverlay();
    renderArticles();
  });

  document.querySelector('[data-article-like]')?.addEventListener('click', () => {
    const articleId = articleModal?.dataset.articleId;
    if (!articleId) return;
    const articles = readJson(ARTICLES_KEY, []);
    const article = articles.find((entry) => entry.id === articleId);
    if (!article) return;
    article.likes = Number(article.likes || 0) + 1;
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    articleModal.querySelector('[data-article-stats]').textContent = `Лайки: ${Number(article.likes || 0)} · Просмотры: ${Number(article.views || 0)}`;
  });

  if (plusBadge) new MutationObserver(syncPlusLink).observe(plusBadge, { attributes: true, attributeFilter: ['hidden'] });
  if (plusLink) new MutationObserver(syncPlusLink).observe(plusLink, { childList: true, subtree: true });

  setupAuthModal();
  syncUserState();
  syncPlusLink();
  applyTheme(localStorage.getItem(THEME_KEY) || 'white');
  setupTabs();
  activateTab('roadmap');
  renderRoadmapBoard();
  renderGradePanel();
  renderInterviewPanel();
  window.addEventListener('resize', () => {
    if (document.querySelector('[data-learning-panel="roadmap"]')?.hidden) return;
    clearTimeout(window.__roadmapResizeTimer);
    window.__roadmapResizeTimer = setTimeout(() => {
      renderRoadmapBoard();
    }, 120);
  });
});
