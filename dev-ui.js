document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'dev') return;

  const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
  const apiUrl = (path) => `${API_BASE}${path}`;

  const K = {
    site: 'roadstar-site-content',
    lists: 'roadstar-custom-lists',
    payment: 'roadstar-payment-content',
    services: 'roadstar-service-tokens',
    users: 'roadstar-local-users',
    learningByItem: 'roadstar-learning-by-item'
  };

  const defaults = {
    site: {
      heroTitle: 'Структурируй\nПрактикуйся\nРасти',
      heroDescription: 'Roadstar помогает выстроить понятный маршрут роста: дорожные карты по ролям, практические задания, тесты на грейд, подготовка к собеседованиям и персональные сценарии развития без лишнего шума.',
      gradePlusText: 'Узнай свой доход на твоем грейде'
    },
    lists: {
      roadmaps: ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'DevOps Engineer', 'QA Engineer', 'Data Analyst', 'Data Scientist', 'Product Manager', 'UI/UX Designer'],
      practice: ['Алгоритмы', 'SQL тренажёр', 'REST API', 'Git практика', 'Системный дизайн', 'JavaScript задачи', 'Python задачи', 'React кейсы', 'CSS челленджи'],
      grade: ['Frontend', 'Backend', 'QA', 'Analyst', 'Designer']
    },
    payment: {
      plusTitle: 'Доход, аналитика грейда и расширенные возможности роста',
      plusDescription: 'Здесь будет расширенный сценарий Plus: аналитика дохода по грейду, закрытые материалы, персональные рекомендации и накопление токенов за подписку и активность.',
      paymentTitle: 'Оплата Plus скоро появится',
      paymentDescription: 'Здесь будет размещена форма оплаты, выбор тарифа, описание преимуществ подписки и история платежей.'
    }
  };

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const getSite = () => ({ ...defaults.site, ...read(K.site, {}) });
  const getLists = () => ({ ...defaults.lists, ...read(K.lists, {}) });
  const getPayment = () => ({ ...defaults.payment, ...read(K.payment, {}) });
  const getServices = () => read(K.services, {});
  const getUsers = () => read(K.users, []);
  const getLearningStore = () => read(K.learningByItem, {});

  const normalizeSubTask = (subTask, index = 0) => {
    if (typeof subTask === 'string') {
      return {
        id: `subtask-${index + 1}`,
        label: subTask,
        description: '',
        freeLinks: '',
        articleLinks: '',
        plusLinks: '',
        practiceEnabled: false,
        practiceText: ''
      };
    }
    return {
      id: subTask?.id || `subtask-${index + 1}`,
      label: subTask?.label || 'Новый подпункт',
      description: subTask?.description || '',
      freeLinks: subTask?.freeLinks || '',
      articleLinks: subTask?.articleLinks || '',
      plusLinks: subTask?.plusLinks || '',
      practiceEnabled: Boolean(subTask?.practiceEnabled),
      practiceText: subTask?.practiceText || ''
    };
  };

  const createDefaultRoadmap = () => ({
    settings: {
      isDevModeDefault: true,
      panOnScroll: true,
      selectionOnDrag: true,
      fitView: true
    },
    nodes: [
      {
        id: 'html-css',
        type: 'skillNode',
        data: {
          label: 'HTML и CSS',
          description: 'Изучи HTML, семантику, Flexbox, Grid, адаптив и базовую доступность.',
          color: '#2563eb',
          status: 'Core',
          freeLinks: 'MDN HTML, MDN CSS',
          articleLinks: 'Статья: семантическая вёрстка',
          plusLinks: 'Plus: чек-лист ревью вёрстки',
          practiceEnabled: true,
          subTasks: [
            normalizeSubTask({ label: 'Семантика', description: 'Изучи структуру документа и правильные теги.' }, 0),
            normalizeSubTask({ label: 'Flexbox и Grid', description: 'Освой две основные системы раскладки.' }, 1),
            normalizeSubTask({ label: 'Адаптив', description: 'Подготовь интерфейс под мобильные и планшеты.' }, 2)
          ]
        },
        position: { x: 80, y: 80 }
      },
      {
        id: 'js-core',
        type: 'skillNode',
        data: {
          label: 'JavaScript Core',
          description: 'Пройди синтаксис, функции, массивы, объекты, DOM и асинхронность.',
          color: '#7c3aed',
          status: 'Core',
          freeLinks: 'javascript.info, MDN',
          articleLinks: 'Статья: event loop простыми словами',
          plusLinks: 'Plus: карта закрепления JS Core',
          practiceEnabled: true,
          subTasks: [
            normalizeSubTask({ label: 'Функции', description: 'Повтори declaration, expression и стрелочные функции.' }, 0),
            normalizeSubTask({ label: 'DOM', description: 'Разбери работу с деревом документа и событиями.' }, 1),
            normalizeSubTask({ label: 'Async', description: 'Пойми Promise, async/await и event loop.' }, 2)
          ]
        },
        position: { x: 380, y: 200 }
      },
      {
        id: 'react',
        type: 'skillNode',
        data: {
          label: 'React',
          description: 'Разбери компоненты, props, state, эффекты, роутинг и формы.',
          color: '#0f766e',
          status: 'Next',
          freeLinks: 'react.dev',
          articleLinks: 'Статья: как мыслить компонентами',
          plusLinks: 'Plus: разбор pet-проекта',
          practiceEnabled: true,
          subTasks: [
            normalizeSubTask({ label: 'Компоненты', description: 'Переиспользование интерфейсов через композицию.' }, 0),
            normalizeSubTask({ label: 'State', description: 'Локальное состояние и поток данных.' }, 1),
            normalizeSubTask({ label: 'Routing', description: 'Структура приложения и переходы между экранами.' }, 2)
          ]
        },
        position: { x: 700, y: 80 }
      }
    ],
    edges: [
      { id: 'edge-html-js', source: 'html-css', target: 'js-core', sourceSide: 'right', targetSide: 'left', type: 'smoothstep', animated: true },
      { id: 'edge-js-react', source: 'js-core', target: 'react', sourceSide: 'right', targetSide: 'left', type: 'smoothstep', animated: true }
    ]
  });

  const normalizeRoadmap = (entry = {}) => {
    const fallback = createDefaultRoadmap();
    if (entry.roadmap && typeof entry.roadmap === 'object') {
      return {
        settings: { ...fallback.settings, ...(entry.roadmap.settings || {}) },
        nodes: Array.isArray(entry.roadmap.nodes) && entry.roadmap.nodes.length
          ? entry.roadmap.nodes.map((node, index) => ({
              ...node,
              data: {
                ...node.data,
                practiceEnabled: Boolean(node.data?.practiceEnabled),
                subTasks: (node.data?.subTasks || []).map((subTask, subIndex) => normalizeSubTask(subTask, subIndex))
              }
            }))
          : fallback.nodes,
        edges: Array.isArray(entry.roadmap.edges)
          ? entry.roadmap.edges.map((edge, index) => ({
              id: edge.id || `edge-${index + 1}`,
              source: edge.source || '',
              target: edge.target || '',
              sourceSide: edge.sourceSide || 'right',
              targetSide: edge.targetSide || 'left',
              type: edge.type || 'smoothstep',
              animated: edge.animated !== false
            }))
          : fallback.edges
      };
    }
    return { ...fallback };
  };

  const ensureProfessionData = (name) => {
    const store = getLearningStore();
    const current = store[name] || {};
    const next = {
      roadmap: normalizeRoadmap(current),
      practice: current.practice || '',
      grade: current.grade || '',
      interview: current.interview || ''
    };
    store[name] = next;
    write(K.learningByItem, store);
    return next;
  };

  const parseLines = (value) => String(value || '').split('\n').map((item) => item.trim()).filter(Boolean);

  const createNodeDraft = (index = 0) => {
    const bx = Math.round((80 + index * 40) / ROADMAP_GRID) * ROADMAP_GRID;
    const by = Math.round((80 + index * 120) / ROADMAP_GRID) * ROADMAP_GRID;
    return {
      id: `skill-${Date.now()}-${index}`,
      type: 'skillNode',
      data: {
        label: 'Новый навык',
        description: '',
        color: '#2563eb',
        status: 'Draft',
        freeLinks: '',
        articleLinks: '',
        plusLinks: '',
        practiceEnabled: false,
        practiceText: '',
        subTasks: []
      },
      position: { x: bx, y: by }
    };
  };

  const createEdgeDraft = (index = 0) => ({
    id: `edge-${Date.now()}-${index}`,
    source: '',
    target: '',
    sourceSide: 'right',
    targetSide: 'left',
    type: 'smoothstep',
    animated: true
  });

  const tabs = Array.from(document.querySelectorAll('[data-admin-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-admin-panel]'));
  const learningDirectory = document.querySelector('[data-learning-directory]');
  const learningEditor = document.querySelector('[data-learning-editor]');

  const ROADMAP_GRID = 20;

  const state = {
    currentTab: tabs.find((tab) => tab.classList.contains('is-active'))?.dataset.adminTab || 'home',
    learningMode: 'list',
    selectedEntry: null,
    selectedSection: 'roadmap',
    selectedRoadmapNodeId: null,
    selectedSubtaskIndex: null,
    pendingConnection: null,
    roadmapTheme: 'white',
    roadmapCamera: { x: 80, y: 64, zoom: 0.85 },
    roadmapFitOnce: null
  };

  const showPanel = (name) => {
    state.currentTab = name;
    tabs.forEach((tab) => {
      const active = tab.dataset.adminTab === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel) => {
      const active = panel.dataset.adminPanel === name;
      panel.hidden = !active;
      panel.style.display = active ? '' : 'none';
    });
  };

  const renderHome = () => {
    const site = getSite();
    document.querySelectorAll('[data-home-field]').forEach((field) => {
      field.value = site[field.dataset.homeField] || '';
    });

    const lists = getLists();
    document.querySelectorAll('[data-dev-list-editor]').forEach((box) => {
      const key = box.dataset.devListEditor;
      const items = lists[key] || [];
      box.innerHTML = items.map((item, index) => `
        <div class="dev-inline">
          <input type="text" value="${escapeHtml(item)}" data-list-key="${key}" data-list-index="${index}">
          <button type="button" class="dev-primary" data-remove-list="${key}" data-index="${index}">Удалить</button>
        </div>
      `).join('') + `
        <div class="dev-inline">
          <input type="text" placeholder="Новый пункт" data-new-list="${key}">
          <button type="button" class="dev-primary" data-add-list="${key}">Добавить</button>
        </div>
      `;
    });

    document.querySelectorAll('[data-add-list]').forEach((button) => {
      button.onclick = () => {
        const key = button.dataset.addList;
        const input = document.querySelector(`[data-new-list="${key}"]`);
        const value = input?.value.trim();
        if (!value) return;
        const next = getLists();
        next[key] = [...(next[key] || []), value];
        write(K.lists, next);
        if (key === 'roadmaps') ensureProfessionData(value);
        renderHome();
        renderLearning();
      };
    });

    document.querySelectorAll('[data-remove-list]').forEach((button) => {
      button.onclick = () => {
        const key = button.dataset.removeList;
        const index = Number(button.dataset.index);
        const next = getLists();
        const removed = next[key][index];
        next[key].splice(index, 1);
        write(K.lists, next);
        if (key === 'roadmaps') {
          const store = getLearningStore();
          delete store[removed];
          write(K.learningByItem, store);
        }
        renderHome();
        renderLearning();
      };
    });
  };

  const saveHome = () => {
    const nextSite = {};
    document.querySelectorAll('[data-home-field]').forEach((field) => {
      nextSite[field.dataset.homeField] = field.value.trim();
    });
    write(K.site, nextSite);

    const nextLists = getLists();
    ['roadmaps', 'practice', 'grade'].forEach((key) => {
      nextLists[key] = Array.from(document.querySelectorAll(`[data-list-key="${key}"]`))
        .map((input) => input.value.trim())
        .filter(Boolean);
    });
    write(K.lists, nextLists);
    renderLearning();
  };

  const renderLearningDirectory = () => {
    const professions = getLists().roadmaps || [];
    const rows = professions.map((name) => `
      <article class="dev-entry-card">
        <div class="dev-entry-copy">
          <strong>${escapeHtml(name)}</strong>
          <span>Профессия на главной и в обучении</span>
        </div>
        <div class="dev-entry-actions">
          <button type="button" class="dev-primary" data-edit-profession="${escapeHtml(name)}">Редактировать</button>
          <button type="button" class="dev-secondary" data-rename-profession="${escapeHtml(name)}">Переименовать</button>
          <button type="button" class="dev-secondary danger" data-delete-profession="${escapeHtml(name)}">Удалить</button>
        </div>
      </article>
    `).join('');

    learningDirectory.innerHTML = `
      <div class="dev-toolbar">
        <div class="dev-chip">Профессии и статьи</div>
        <button type="button" class="dev-primary" data-add-profession>Добавить профессию</button>
      </div>
      <div class="dev-entry-list">
        ${rows || '<div class="dev-user-card">Пока нет профессий.</div>'}
        <article class="dev-entry-card dev-entry-card-muted">
          <div class="dev-entry-copy">
            <strong>Статьи</strong>
            <span>Отдельная точка входа под будущий форум статей</span>
          </div>
          <div class="dev-entry-actions">
            <button type="button" class="dev-primary" data-edit-articles>Редактировать</button>
          </div>
        </article>
      </div>
    `;

    learningDirectory.querySelector('[data-add-profession]')?.addEventListener('click', () => {
      const name = window.prompt('Название новой профессии');
      if (!name) return;
      const clean = name.trim();
      if (!clean) return;
      const lists = getLists();
      if (lists.roadmaps.includes(clean)) return;
      lists.roadmaps.push(clean);
      write(K.lists, lists);
      ensureProfessionData(clean);
      renderHome();
      renderLearning();
    });

    learningDirectory.querySelectorAll('[data-edit-profession]').forEach((button) => {
      button.addEventListener('click', () => {
        state.learningMode = 'edit';
        state.selectedEntry = button.dataset.editProfession;
        state.selectedSection = 'roadmap';
        state.selectedRoadmapNodeId = null;
        ensureProfessionData(state.selectedEntry);
        renderLearningEditor();
      });
    });

    learningDirectory.querySelectorAll('[data-rename-profession]').forEach((button) => {
      button.addEventListener('click', () => {
        const oldName = button.dataset.renameProfession;
        const nextName = window.prompt('Новое название профессии', oldName);
        if (!nextName) return;
        const clean = nextName.trim();
        if (!clean || clean === oldName) return;
        const lists = getLists();
        if (lists.roadmaps.includes(clean)) return;
        lists.roadmaps = lists.roadmaps.map((item) => item === oldName ? clean : item);
        write(K.lists, lists);
        const store = getLearningStore();
        store[clean] = store[oldName] || ensureProfessionData(clean);
        delete store[oldName];
        write(K.learningByItem, store);
        if (state.selectedEntry === oldName) state.selectedEntry = clean;
        renderHome();
        renderLearning();
      });
    });

    learningDirectory.querySelectorAll('[data-delete-profession]').forEach((button) => {
      button.addEventListener('click', () => {
        const name = button.dataset.deleteProfession;
        const lists = getLists();
        lists.roadmaps = lists.roadmaps.filter((item) => item !== name);
        write(K.lists, lists);
        const store = getLearningStore();
        delete store[name];
        write(K.learningByItem, store);
        if (state.selectedEntry === name) {
          state.learningMode = 'list';
          state.selectedEntry = null;
          state.selectedRoadmapNodeId = null;
        }
        renderHome();
        renderLearning();
      });
    });

    learningDirectory.querySelector('[data-edit-articles]')?.addEventListener('click', () => {
      state.learningMode = 'articles';
      state.selectedEntry = 'articles';
      renderLearningEditor();
    });
  };

  const getRoadmapWorldSize = (roadmap) => {
    const nodes = roadmap.nodes || [];
    const minW = 3600;
    const minH = 2600;
    if (!nodes.length) return { w: minW, h: minH };
    let maxR = 400;
    let maxB = 400;
    for (const node of nodes) {
      maxR = Math.max(maxR, Number(node.position?.x || 0) + 320);
      maxB = Math.max(maxB, Number(node.position?.y || 0) + 280);
    }
    return { w: Math.max(minW, maxR + 520), h: Math.max(minH, maxB + 520) };
  };

  const renderRoadmapEditor = (data) => {
    const roadmap = data.roadmap || createDefaultRoadmap();
    if (!state.selectedRoadmapNodeId || !roadmap.nodes.some((node) => node.id === state.selectedRoadmapNodeId)) {
      state.selectedRoadmapNodeId = roadmap.nodes[0]?.id || null;
    }

    const selectedNode = roadmap.nodes.find((node) => node.id === state.selectedRoadmapNodeId) || roadmap.nodes[0] || null;
    const { w: worldW, h: worldH } = getRoadmapWorldSize(roadmap);
    const byId = Object.fromEntries(roadmap.nodes.map((node) => [node.id, node]));
    const previewLines = (roadmap.edges || []).map((edge) => {
      const source = byId[edge.source];
      const target = byId[edge.target];
      if (!source || !target) return '';
      const start = sidePoint(source, edge.sourceSide || 'right');
      const end = sidePoint(target, edge.targetSide || 'left');
      return `<path class="${edge.animated ? 'is-dashed' : ''}" marker-end="url(#dev-roadmap-arrow)" d="${edgePath(start, end, edge.sourceSide || 'right', edge.targetSide || 'left')}" />`;
    }).join('');

    const swatches = ['#2563eb', '#7c3aed', '#0f766e', '#dc2626', '#ea580c', '#d97706', '#64748b', '#111827', '#ec4899', '#14b8a6'];
    const swatchButtons = swatches.map((c) => `
      <button type="button" class="dev-roadmap-swatch" data-swatch-color="${escapeAttr(c)}" style="--rs-swatch:${escapeAttr(c)}" title="${escapeAttr(c)}" aria-label="Палитра ${escapeAttr(c)}"></button>
    `).join('');

    const previewNodes = roadmap.nodes.map((node) => {
      const subTasks = (node.data?.subTasks || []).slice(0, 4).map((st, i) => `
        <div class="dev-roadmap-canvas-subtask" data-dev-roadmap-node="${escapeAttr(node.id)}" data-dev-roadmap-subtask="${i}">
          ${escapeHtml(st.label || 'Подпункт ' + (i + 1))}
        </div>
      `).join('');
      return `
        <article
          class="dev-roadmap-canvas-node ${state.selectedRoadmapNodeId === node.id ? 'is-selected' : ''}"
          data-select-roadmap-node="${escapeAttr(node.id)}"
          data-canvas-node-id="${escapeAttr(node.id)}"
          style="left:${Number(node.position?.x || 0)}px; top:${Number(node.position?.y || 0)}px; border-color:${escapeAttr(node.data?.color || '#2563eb')}; background:${escapeAttr(node.data?.color || '#2563eb')};"
        >
          <button type="button" class="dev-roadmap-canvas-handle top ${state.pendingConnection?.nodeId === node.id && state.pendingConnection?.side === 'top' ? 'is-active' : ''}" data-connect-node="${escapeAttr(node.id)}" data-connect-side="top" aria-label="Соединить сверху"></button>
          <button type="button" class="dev-roadmap-canvas-handle right ${state.pendingConnection?.nodeId === node.id && state.pendingConnection?.side === 'right' ? 'is-active' : ''}" data-connect-node="${escapeAttr(node.id)}" data-connect-side="right" aria-label="Соединить справа"></button>
          <button type="button" class="dev-roadmap-canvas-handle bottom ${state.pendingConnection?.nodeId === node.id && state.pendingConnection?.side === 'bottom' ? 'is-active' : ''}" data-connect-node="${escapeAttr(node.id)}" data-connect-side="bottom" aria-label="Соединить снизу"></button>
          <button type="button" class="dev-roadmap-canvas-handle left ${state.pendingConnection?.nodeId === node.id && state.pendingConnection?.side === 'left' ? 'is-active' : ''}" data-connect-node="${escapeAttr(node.id)}" data-connect-side="left" aria-label="Соединить слева"></button>
          <strong>${escapeHtml(node.data?.label || 'Новый навык')}</strong>
          <span>${escapeHtml(node.data?.status || 'Draft')}</span>
          ${subTasks ? `<div class="dev-roadmap-canvas-subtasks">${subTasks}</div>` : ''}
        </article>
      `;
    }).join('');

    const edgeOptions = (roadmap.edges || []).map((edge, index) => `
      <article class="dev-roadmap-edge-item">
        <div class="dev-roadmap-edge-title">
          <strong>${escapeHtml(edge.id || `edge-${index + 1}`)}</strong>
          <button type="button" class="dev-secondary danger" data-remove-roadmap-edge="${index}">Удалить</button>
        </div>
        <div class="dev-roadmap-edge-grid">
          <label>Откуда
            <select data-edge-field="source" data-edge-index="${index}">
              ${roadmap.nodes.map((node) => `<option value="${escapeAttr(node.id)}" ${edge.source === node.id ? 'selected' : ''}>${escapeHtml(node.data?.label || node.id)}</option>`).join('')}
            </select>
          </label>
          <label>Сторона A
            <select data-edge-field="sourceSide" data-edge-index="${index}">
              <option value="top" ${edge.sourceSide === 'top' ? 'selected' : ''}>Верх</option>
              <option value="right" ${edge.sourceSide === 'right' ? 'selected' : ''}>Право</option>
              <option value="bottom" ${edge.sourceSide === 'bottom' ? 'selected' : ''}>Низ</option>
              <option value="left" ${edge.sourceSide === 'left' ? 'selected' : ''}>Лево</option>
            </select>
          </label>
          <label>Куда
            <select data-edge-field="target" data-edge-index="${index}">
              ${roadmap.nodes.map((node) => `<option value="${escapeAttr(node.id)}" ${edge.target === node.id ? 'selected' : ''}>${escapeHtml(node.data?.label || node.id)}</option>`).join('')}
            </select>
          </label>
          <label>Сторона B
            <select data-edge-field="targetSide" data-edge-index="${index}">
              <option value="top" ${edge.targetSide === 'top' ? 'selected' : ''}>Верх</option>
              <option value="right" ${edge.targetSide === 'right' ? 'selected' : ''}>Право</option>
              <option value="bottom" ${edge.targetSide === 'bottom' ? 'selected' : ''}>Низ</option>
              <option value="left" ${edge.targetSide === 'left' ? 'selected' : ''}>Лево</option>
            </select>
          </label>
        </div>
      </article>
    `).join('');

    const subTasks = (selectedNode?.data?.subTasks || []).map((subTask, index) => `
      <article class="dev-roadmap-subtask-card">
        <div class="dev-roadmap-item-head">
          <h4>Подпункт ${index + 1}</h4>
          <button type="button" class="dev-secondary danger" data-remove-subtask="${index}">Удалить</button>
        </div>
        <div class="dev-roadmap-grid">
          <label>Название<input type="text" value="${escapeAttr(subTask.label || '')}" data-selected-subtask-field="label" data-selected-subtask-index="${index}"></label>
          <label>Практика
            <select data-selected-subtask-field="practiceEnabled" data-selected-subtask-index="${index}">
              <option value="false" ${!subTask.practiceEnabled ? 'selected' : ''}>Нет</option>
              <option value="true" ${subTask.practiceEnabled ? 'selected' : ''}>Да</option>
            </select>
          </label>
          <label class="dev-roadmap-grid-wide">Описание<textarea rows="3" data-selected-subtask-field="description" data-selected-subtask-index="${index}">${escapeHtml(subTask.description || '')}</textarea></label>
          <label class="dev-roadmap-grid-wide">Полезные ссылки<textarea rows="2" data-selected-subtask-field="freeLinks" data-selected-subtask-index="${index}">${escapeHtml(subTask.freeLinks || '')}</textarea></label>
          <label class="dev-roadmap-grid-wide">Статьи<textarea rows="2" data-selected-subtask-field="articleLinks" data-selected-subtask-index="${index}">${escapeHtml(subTask.articleLinks || '')}</textarea></label>
          <label class="dev-roadmap-grid-wide">Ресурсы plus<textarea rows="2" data-selected-subtask-field="plusLinks" data-selected-subtask-index="${index}">${escapeHtml(subTask.plusLinks || '')}</textarea></label>
        </div>
      </article>
    `).join('');

    return `
      <div class="dev-roadmap-studio dev-roadmap-studio-v2">
        <div class="dev-roadmap-split">
          <aside class="dev-roadmap-sidebar" aria-label="Свойства и связи">
            <div class="dev-roadmap-sidebar-scroll">
            ${selectedNode ? `
              <div class="dev-roadmap-canvas-head">
                <h4>Выбранный блок</h4>
                <p>Поля содержимого, ссылки и подпункты — здесь; позицию удобнее менять перетаскиванием на холсте.</p>
              </div>
              <div class="dev-roadmap-grid">
                <label>ID<input type="text" value="${escapeAttr(selectedNode.id || '')}" data-selected-node-field="id"></label>
                <label>Название<input type="text" value="${escapeAttr(selectedNode.data?.label || '')}" data-selected-node-field="label"></label>
                <label>Статус
                  <select data-selected-node-field="status">
                    <option value="Main" ${(selectedNode.data?.status || '') === 'Main' ? 'selected' : ''}>Main</option>
                    <option value="Core" ${(selectedNode.data?.status || '') === 'Core' ? 'selected' : ''}>Core</option>
                    <option value="Branch" ${(selectedNode.data?.status || '') === 'Branch' ? 'selected' : ''}>Branch</option>
                    <option value="Next" ${(selectedNode.data?.status || '') === 'Next' ? 'selected' : ''}>Next</option>
                    <option value="Draft" ${(selectedNode.data?.status || '') === 'Draft' ? 'selected' : ''}>Draft</option>
                  </select>
                </label>
                <label>Цвет<input type="color" value="${escapeAttr(selectedNode.data?.color || '#2563eb')}" data-selected-node-field="color"></label>
                <div class="dev-roadmap-swatch-row" aria-label="Быстрый выбор цвета">${swatchButtons}</div>
                <label>Практика
                  <select data-selected-node-field="practiceEnabled">
                    <option value="false" ${!selectedNode.data?.practiceEnabled ? 'selected' : ''}>Нет</option>
                    <option value="true" ${selectedNode.data?.practiceEnabled ? 'selected' : ''}>Да</option>
                  </select>
                </label>
                <label class="dev-roadmap-grid-wide">Задание для практики<textarea rows="4" data-selected-node-field="practiceText">${escapeHtml(selectedNode.data?.practiceText || '')}</textarea></label>
                <label class="dev-roadmap-grid-wide">Описание<textarea rows="4" data-selected-node-field="description">${escapeHtml(selectedNode.data?.description || '')}</textarea></label>
                <label class="dev-roadmap-grid-wide">Полезные ссылки (каждая с новой строки)<textarea rows="3" data-selected-node-field="freeLinks">${escapeHtml(selectedNode.data?.freeLinks || '')}</textarea></label>
                <label class="dev-roadmap-grid-wide">Статьи (каждая с новой строки)<textarea rows="3" data-selected-node-field="articleLinks">${escapeHtml(selectedNode.data?.articleLinks || '')}</textarea></label>
                <label class="dev-roadmap-grid-wide">Ресурсы plus (каждая с новой строки)<textarea rows="3" data-selected-node-field="plusLinks">${escapeHtml(selectedNode.data?.plusLinks || '')}</textarea></label>
              </div>
              <div class="dev-roadmap-position-controls">
                <button type="button" class="dev-secondary" data-move-node="up">↑</button>
                <button type="button" class="dev-secondary" data-move-node="left">←</button>
                <button type="button" class="dev-secondary" data-move-node="right">→</button>
                <button type="button" class="dev-secondary" data-move-node="down">↓</button>
                <button type="button" class="dev-primary" data-save-selected-node>Применить узел</button>
                <button type="button" class="dev-secondary danger" data-delete-selected-node>Удалить узел</button>
              </div>
              <section class="dev-roadmap-subtasks">
                <div class="dev-roadmap-item-head">
                  <h4>Подзадачи</h4>
                  <button type="button" class="dev-secondary" data-add-subtask>Добавить подпункт</button>
                </div>
                <div class="dev-subtask-stack">
                  ${subTasks || '<div class="dev-user-card">Пока нет подпунктов.</div>'}
                </div>
                ${state.selectedSubtaskIndex !== null ? (() => {
                  const sub = selectedNode?.data?.subTasks?.[state.selectedSubtaskIndex];
                  if (!sub) return '';
                  return `
                    <section class="dev-roadmap-section" data-subtask-editor>
                      <div class="dev-roadmap-item-head">
                        <h4>Редактор подпункта ${state.selectedSubtaskIndex + 1}</h4>
                        <button type="button" class="dev-secondary" data-close-subtask-editor>Закрыть</button>
                      </div>
                      <div class="dev-roadmap-grid">
                        <label>Название<input type="text" value="${escapeAttr(sub.label || '')}" data-edit-subtask-field="label"></label>
                        <label>Практика
                          <select data-edit-subtask-field="practiceEnabled">
                            <option value="false" ${!sub.practiceEnabled ? 'selected' : ''}>Нет</option>
                            <option value="true" ${sub.practiceEnabled ? 'selected' : ''}>Да</option>
                          </select>
                        </label>
                        <label class="dev-roadmap-grid-wide">Задание<textarea rows="3" data-edit-subtask-field="practiceText">${escapeHtml(sub.practiceText || '')}</textarea></label>
                        <label class="dev-roadmap-grid-wide">Описание<textarea rows="3" data-edit-subtask-field="description">${escapeHtml(sub.description || '')}</textarea></label>
                        <label class="dev-roadmap-grid-wide">Полезные ссылки<textarea rows="2" data-edit-subtask-field="freeLinks">${escapeHtml(sub.freeLinks || '')}</textarea></label>
                        <label class="dev-roadmap-grid-wide">Статьи<textarea rows="2" data-edit-subtask-field="articleLinks">${escapeHtml(sub.articleLinks || '')}</textarea></label>
                        <label class="dev-roadmap-grid-wide">Ресурсы plus<textarea rows="2" data-edit-subtask-field="plusLinks">${escapeHtml(sub.plusLinks || '')}</textarea></label>
                      </div>
                      <button type="button" class="dev-primary" data-save-single-subtask>Сохранить подпункт</button>
                    </section>
                  `;
                })() : ''}
              </section>
            ` : `
              <div class="dev-empty-state">
                <h3>Выбери узел</h3>
                <p>На холсте появится инспектор свойств, цвета и содержимого.</p>
              </div>
            `}
            <section class="dev-roadmap-section">
              <div class="dev-roadmap-section-head"><h4>Связи</h4><span>Магнитятся к 4 сторонам узла</span></div>
              <div class="dev-roadmap-stack">${edgeOptions || '<div class="dev-user-card">Пока нет связей.</div>'}</div>
              <div class="dev-editor-actions">
                <button type="button" class="dev-primary" data-save-roadmap-edges>Сохранить связи</button>
              </div>
            </section>
            <section class="dev-roadmap-section">
              <div class="dev-roadmap-section-head"><h4>JSON preview</h4><span>Можно править вручную и применить</span></div>
              <textarea class="dev-roadmap-json-editor" rows="12" data-roadmap-json>${escapeHtml(JSON.stringify(roadmap, null, 2))}</textarea>
              <div class="dev-editor-actions">
                <button type="button" class="dev-secondary" data-apply-roadmap-json>Применить JSON</button>
              </div>
            </section>
            </div>
          </aside>
          <div class="dev-roadmap-viewport" data-roadmap-viewport tabindex="0" aria-label="Холст дорожной карты">
            <div class="dev-roadmap-viewport-chrome">
              <span class="dev-roadmap-zoom-label" data-roadmap-zoom-label>100%</span>
              <button type="button" class="dev-secondary dev-roadmap-zoom-btn" data-roadmap-zoom-out aria-label="Уменьшить">−</button>
              <button type="button" class="dev-secondary dev-roadmap-zoom-btn" data-roadmap-zoom-in aria-label="Увеличить">+</button>
              <button type="button" class="dev-primary dev-roadmap-zoom-fit" data-roadmap-zoom-fit>Подогнать</button>
            </div>
            <div class="dev-roadmap-world" data-roadmap-world>
              <div class="dev-roadmap-canvas-grid" data-roadmap-canvas-grid style="width:${worldW}px;height:${worldH}px;">
                <div class="dev-roadmap-world-bg" data-roadmap-world-bg aria-hidden="true"></div>
                <svg class="dev-roadmap-canvas-lines" data-roadmap-canvas-lines width="${worldW}" height="${worldH}" viewBox="0 0 ${worldW} ${worldH}">
                  <defs>
                    <marker id="dev-roadmap-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5b9cff"></path>
                    </marker>
                  </defs>
                  ${previewLines}
                </svg>
                ${previewNodes}
              </div>
            </div>
          </div>
        </div>
        <section class="dev-roadmap-sidebar-tools dev-roadmap-bottom-tools">
          <div class="dev-roadmap-tools-row">
            <button type="button" class="dev-primary" data-add-roadmap-node>+ Блок</button>
            <button type="button" class="dev-secondary" data-add-roadmap-edge>+ Связь</button>
            <button type="button" class="dev-secondary" data-roadmap-ai-help>AI-помощник</button>
            <button type="button" class="dev-secondary" data-roadmap-center>Сетка</button>
          </div>
          <div class="dev-roadmap-stats-row">
            <span class="dev-chip dev-chip-compact">Узлов: ${roadmap.nodes.length}</span>
            <span class="dev-chip dev-chip-compact">Связей: ${roadmap.edges.length}</span>
            <span class="dev-chip dev-chip-compact">Шаг сетки: ${ROADMAP_GRID}px</span>
          </div>
          <p class="dev-roadmap-connect-hint">${state.pendingConnection ? `Связь: от «${escapeHtml(state.pendingConnection.side)}» узла <strong>${escapeHtml(state.pendingConnection.nodeId)}</strong> — кликни точку на другом блоке.` : 'Связь: кликни синюю точку на первом блоке, затем на втором.'}</p>
          <div class="dev-roadmap-theme-block">
            <span class="dev-roadmap-theme-label">Тема превью в обучении</span>
            <div class="dev-roadmap-theme-switch">
              ${['white', 'black', 'blue', 'beige'].map((theme) => `
                <button type="button" class="dev-secondary ${state.roadmapTheme === theme ? 'is-active' : ''}" data-roadmap-theme="${theme}">${theme}</button>
              `).join('')}
            </div>
          </div>
        </section>
      </div>
    `;
  };

  const collectRoadmapFromEditor = () => {
    const current = getCurrentEntry();
    return normalizeRoadmap(current);
  };

  const sidePoint = (node, side) => {
    const x = Number(node.position?.x || 0);
    const y = Number(node.position?.y || 0);
    const width = 196;
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

  const renderRoadmapPreview = (roadmap) => {
    const nodes = roadmap.nodes || [];
    const edges = roadmap.edges || [];
    const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const width = Math.max(...nodes.map((node) => Number(node.position?.x || 0) + 240), 900);
    const height = Math.max(...nodes.map((node) => Number(node.position?.y || 0) + 180), 520);
    const lines = edges.map((edge) => {
      const source = byId[edge.source];
      const target = byId[edge.target];
      if (!source || !target) return '';
      const start = sidePoint(source, edge.sourceSide || 'right');
      const end = sidePoint(target, edge.targetSide || 'left');
      return `<path ${edge.animated ? 'class="is-dashed"' : ''} marker-end="url(#preview-arrow)" d="${edgePath(start, end, edge.sourceSide || 'right', edge.targetSide || 'left')}" />`;
    }).join('');
    const cards = nodes.map((node) => `
      <div class="roadmap-flow-node" style="left:${Number(node.position?.x || 0)}px; top:${Number(node.position?.y || 0)}px; border-color:${escapeHtml(node.data?.color || '#d9d9d9')}; background:${escapeHtml(node.data?.color || '#d9d9d9')};">
        <div class="roadmap-flow-node-head"><strong>${escapeHtml(node.data?.label || 'Без названия')}</strong></div>
        ${(node.data?.subTasks || []).length ? `<div class="roadmap-flow-node-subtasks">${node.data.subTasks.slice(0, 3).map((item) => `<span>${escapeHtml(item.label || item)}</span>`).join('')}</div>` : ''}
      </div>
    `).join('');
    return `
      <div class="learning-roadmap-stage" style="width:${width}px; height:${height}px;">
        <svg class="learning-roadmap-lines" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <defs>
            <marker id="preview-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2d7cff"></path>
            </marker>
          </defs>
          ${lines}
        </svg>
        ${cards}
      </div>
    `;
  };

  const bindRoadmapEditor = () => {
    const liveRoadmap = collectRoadmapFromEditor();
    const canvas = learningEditor.querySelector('[data-roadmap-canvas-grid]');
    const lines = learningEditor.querySelector('[data-roadmap-canvas-lines]');
    const viewport = learningEditor.querySelector('[data-roadmap-viewport]');
    const world = learningEditor.querySelector('[data-roadmap-world]');
    const worldBg = learningEditor.querySelector('[data-roadmap-world-bg]');
    const zoomLabel = learningEditor.querySelector('[data-roadmap-zoom-label]');

    const getCanvasNodeElement = (nodeId) => learningEditor.querySelector(`[data-canvas-node-id="${nodeId}"]`);
    const getCanvasNodeData = (nodeId) => liveRoadmap.nodes.find((node) => node.id === nodeId);

    const applyCamera = () => {
      if (!world) return;
      const { x, y, zoom } = state.roadmapCamera;
      world.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
      world.style.transformOrigin = '0 0';
      if (zoomLabel) zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    };

    const fitRoadmapCamera = () => {
      if (!viewport || !world) return;
      const roadmap = collectRoadmapFromEditor();
      const rect = viewport.getBoundingClientRect();
      const pad = 88;
      const nw = 208;
      const nh = 120;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const n of roadmap.nodes) {
        const px = Number(n.position?.x || 0);
        const py = Number(n.position?.y || 0);
        minX = Math.min(minX, px);
        minY = Math.min(minY, py);
        maxX = Math.max(maxX, px + nw);
        maxY = Math.max(maxY, py + nh);
      }
      if (!roadmap.nodes.length || !Number.isFinite(minX)) {
        state.roadmapCamera = { x: rect.width * 0.06, y: rect.height * 0.08, zoom: 0.78 };
      } else {
        const bw = maxX - minX + pad * 2;
        const bh = maxY - minY + pad * 2;
        const zx = rect.width / bw;
        const zy = rect.height / bh;
        const z = Math.min(Math.max(Math.min(zx, zy), 0.16), 1.7);
        state.roadmapCamera.zoom = z;
        state.roadmapCamera.x = rect.width / 2 - ((minX + maxX) / 2) * z;
        state.roadmapCamera.y = rect.height / 2 - ((minY + maxY) / 2) * z;
      }
      applyCamera();
    };

    const clientToWorld = (clientX, clientY) => {
      if (!viewport) return { x: 0, y: 0 };
      const rect = viewport.getBoundingClientRect();
      const { x: camX, y: camY, zoom } = state.roadmapCamera;
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      return { x: (mx - camX) / zoom, y: (my - camY) / zoom };
    };

    applyCamera();
    if (state.roadmapFitOnce !== state.selectedEntry) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fitRoadmapCamera();
          state.roadmapFitOnce = state.selectedEntry;
        });
      });
    }

    if (viewport) {
      viewport.addEventListener('wheel', (e) => {
        if (!viewport.contains(e.target)) return;
        e.preventDefault();
        const rect = viewport.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cam = state.roadmapCamera;
        if (e.ctrlKey || e.metaKey) {
          const factor = e.deltaY > 0 ? 0.9 : 1.11;
          const nextZoom = Math.min(Math.max(cam.zoom * factor, 0.14), 2.6);
          const wx = (mx - cam.x) / cam.zoom;
          const wy = (my - cam.y) / cam.zoom;
          cam.zoom = nextZoom;
          cam.x = mx - wx * nextZoom;
          cam.y = my - wy * nextZoom;
        } else {
          cam.x -= e.deltaX;
          cam.y -= e.deltaY;
        }
        applyCamera();
      }, { passive: false });
    }

    if (worldBg && viewport) {
      worldBg.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { x, y } = clientToWorld(e.clientX, e.clientY);
        const sx = Math.max(0, Math.round(x / ROADMAP_GRID) * ROADMAP_GRID);
        const sy = Math.max(0, Math.round(y / ROADMAP_GRID) * ROADMAP_GRID);
        updateCurrentEntry((entry) => {
          entry.roadmap = normalizeRoadmap(entry);
          const node = createNodeDraft(entry.roadmap.nodes.length);
          node.position.x = sx;
          node.position.y = sy;
          entry.roadmap.nodes.push(node);
          state.selectedRoadmapNodeId = node.id;
        });
      });

      worldBg.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || !e.altKey) return;
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const ox = state.roadmapCamera.x;
        const oy = state.roadmapCamera.y;
        viewport.classList.add('is-panning');
        const onMove = (ev) => {
          state.roadmapCamera.x = ox + (ev.clientX - startX);
          state.roadmapCamera.y = oy + (ev.clientY - startY);
          applyCamera();
        };
        const onUp = () => {
          viewport.classList.remove('is-panning');
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp, { once: true });
      });
    }

    if (viewport) {
      viewport.addEventListener('pointerdown', (e) => {
        if (e.button !== 1) return;
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const ox = state.roadmapCamera.x;
        const oy = state.roadmapCamera.y;
        viewport.classList.add('is-panning');
        const onMove = (ev) => {
          state.roadmapCamera.x = ox + (ev.clientX - startX);
          state.roadmapCamera.y = oy + (ev.clientY - startY);
          applyCamera();
        };
        const onUp = () => {
          viewport.classList.remove('is-panning');
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp, { once: true });
      });
    }

    const zoomToward = (factor) => {
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const mx = rect.width / 2;
      const my = rect.height / 2;
      const cam = state.roadmapCamera;
      const nextZoom = Math.min(Math.max(cam.zoom * factor, 0.14), 2.6);
      const wx = (mx - cam.x) / cam.zoom;
      const wy = (my - cam.y) / cam.zoom;
      cam.zoom = nextZoom;
      cam.x = mx - wx * nextZoom;
      cam.y = my - wy * nextZoom;
      applyCamera();
    };

    learningEditor.querySelector('[data-roadmap-zoom-in]')?.addEventListener('click', () => zoomToward(1.12));
    learningEditor.querySelector('[data-roadmap-zoom-out]')?.addEventListener('click', () => zoomToward(1 / 1.12));
    learningEditor.querySelector('[data-roadmap-zoom-fit]')?.addEventListener('click', () => {
      fitRoadmapCamera();
      state.roadmapFitOnce = state.selectedEntry;
    });

    learningEditor.querySelectorAll('[data-swatch-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = learningEditor.querySelector('[data-selected-node-field="color"]');
        if (input) input.value = btn.dataset.swatchColor || '#2563eb';
      });
    });

    const sidePointFromElement = (element, side) => {
      const x = Number.parseFloat(element.style.left || '0');
      const y = Number.parseFloat(element.style.top || '0');
      const width = element.offsetWidth || 196;
      const height = element.offsetHeight || 74;
      if (side === 'top') return { x: x + width / 2, y };
      if (side === 'bottom') return { x: x + width / 2, y: y + height };
      if (side === 'left') return { x, y: y + height / 2 };
      return { x: x + width, y: y + height / 2 };
    };

    const paintEdges = () => {
      if (!lines) return;
      const defs = `
        <defs>
          <marker id="dev-roadmap-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1f6fff"></path>
          </marker>
        </defs>
      `;
      const paths = liveRoadmap.edges.map((edge) => {
        const sourceEl = getCanvasNodeElement(edge.source);
        const targetEl = getCanvasNodeElement(edge.target);
        if (!sourceEl || !targetEl) return '';
        const start = sidePointFromElement(sourceEl, edge.sourceSide || 'right');
        const end = sidePointFromElement(targetEl, edge.targetSide || 'left');
        return `<path class="${edge.animated ? 'is-dashed' : ''}" marker-end="url(#dev-roadmap-arrow)" d="${edgePath(start, end, edge.sourceSide || 'right', edge.targetSide || 'left')}" />`;
      }).join('');
      lines.innerHTML = defs + paths;
    };

    learningEditor.querySelectorAll('[data-select-roadmap-node]').forEach((button) => {
      button.addEventListener('click', (e) => {
        if (e.target.closest('.dev-roadmap-canvas-subtask')) return;
        state.selectedRoadmapNodeId = button.dataset.selectRoadmapNode;
        state.selectedSubtaskIndex = null;
        renderLearningEditor();
      });
    });

    learningEditor.querySelectorAll('[data-dev-roadmap-subtask]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        state.selectedRoadmapNodeId = el.dataset.devRoadmapNode;
        state.selectedSubtaskIndex = Number(el.dataset.devRoadmapSubtask);
        renderLearningEditor();
      });
    });

    learningEditor.querySelectorAll('[data-connect-node]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const nodeId = button.dataset.connectNode;
        const side = button.dataset.connectSide;
        if (!state.pendingConnection) {
          state.pendingConnection = { nodeId, side };
          renderLearningEditor();
          return;
        }
        const pending = state.pendingConnection;
        state.pendingConnection = null;
        if (pending.nodeId === nodeId && pending.side === side) {
          renderLearningEditor();
          return;
        }
        updateCurrentEntry((entry) => {
          entry.roadmap = normalizeRoadmap(entry);
          entry.roadmap.edges.push({
            id: `edge-${Date.now()}`,
            source: pending.nodeId,
            target: nodeId,
            sourceSide: pending.side,
            targetSide: side,
            type: 'smoothstep',
            animated: true
          });
        });
      });
    });

    learningEditor.querySelectorAll('[data-roadmap-theme]').forEach((button) => {
      button.addEventListener('click', () => {
        state.roadmapTheme = button.dataset.roadmapTheme || 'white';
        const viewport = learningEditor.querySelector('[data-roadmap-viewport]');
        if (viewport) {
          viewport.setAttribute('data-preview-theme', state.roadmapTheme);
        }
        const canvasGrid = learningEditor.querySelector('[data-roadmap-canvas-grid]');
        if (canvasGrid) {
          canvasGrid.setAttribute('data-preview-theme', state.roadmapTheme);
        }
        const isDark = state.roadmapTheme === 'black' || state.roadmapTheme === 'blue';
        const textColor = isDark ? '#f5f7fb' : '#111';
        const cards = learningEditor.querySelectorAll('.dev-roadmap-canvas-node');
        cards.forEach((card) => {
          card.style.color = textColor;
          card.querySelectorAll('strong, span').forEach((el) => {
            el.style.color = textColor;
          });
        });
        renderLearningEditor();
      });
    });

    const adminThemeSwitcher = learningEditor.querySelector('[data-admin-roadmap-theme-switcher]');
    const adminThemeToggle = learningEditor.querySelector('[data-admin-theme-toggle]');
    const adminThemeMenu = learningEditor.querySelector('[data-admin-theme-menu]');
    adminThemeToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!adminThemeMenu) return;
      const opening = adminThemeMenu.hidden;
      adminThemeMenu.hidden = !opening;
      if (opening) {
        const closeOnOutside = (ev) => {
          if (adminThemeSwitcher?.contains(ev.target)) return;
          adminThemeMenu.hidden = true;
          document.removeEventListener('click', closeOnOutside, true);
        };
        setTimeout(() => document.addEventListener('click', closeOnOutside, true), 0);
      }
    });

    learningEditor.querySelectorAll('[data-canvas-node-id]').forEach((nodeElement) => {
      nodeElement.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        state.selectedRoadmapNodeId = nodeElement.dataset.canvasNodeId;
        state.selectedSubtaskIndex = null;
        renderLearningEditor();
      });
      nodeElement.addEventListener('pointerdown', (event) => {
        if (event.target.closest('[data-connect-node]')) return;
        const nodeId = nodeElement.dataset.canvasNodeId;
        const node = getCanvasNodeData(nodeId);
        if (!node || !canvas) return;
        event.preventDefault();
        const startX = event.clientX;
        const startY = event.clientY;
        const originX = Number(node.position?.x || 0);
        const originY = Number(node.position?.y || 0);
        nodeElement.setPointerCapture?.(event.pointerId);

        const z = state.roadmapCamera.zoom || 1;
        const move = (moveEvent) => {
          let dx = (moveEvent.clientX - startX) / z;
          let dy = (moveEvent.clientY - startY) / z;
          if (moveEvent.shiftKey) dy = 0;
          if (moveEvent.ctrlKey) dx = 0;
          const nextX = Math.max(0, Math.round((originX + dx) / ROADMAP_GRID) * ROADMAP_GRID);
          const nextY = Math.max(0, Math.round((originY + dy) / ROADMAP_GRID) * ROADMAP_GRID);
          node.position.x = nextX;
          node.position.y = nextY;
          nodeElement.style.left = `${nextX}px`;
          nodeElement.style.top = `${nextY}px`;
          paintEdges();
        };

        const up = () => {
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerup', up);
          updateCurrentEntry((entry) => {
            entry.roadmap = normalizeRoadmap(entry);
            const target = entry.roadmap.nodes.find((item) => item.id === nodeId);
            if (!target) return;
            target.position.x = node.position.x;
            target.position.y = node.position.y;
          });
        };

        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up, { once: true });
      });
    });

    learningEditor.querySelector('[data-add-roadmap-node]')?.addEventListener('click', () => {
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        const node = createNodeDraft(entry.roadmap.nodes.length);
        entry.roadmap.nodes.push(node);
        state.selectedRoadmapNodeId = node.id;
      });
    });

    learningEditor.querySelector('[data-roadmap-center]')?.addEventListener('click', () => {
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        entry.roadmap.nodes.forEach((node, index) => {
          node.position.x = Math.round((80 + (index % 4) * 260) / ROADMAP_GRID) * ROADMAP_GRID;
          node.position.y = Math.round((80 + Math.floor(index / 4) * 180) / ROADMAP_GRID) * ROADMAP_GRID;
        });
      });
    });

    learningEditor.querySelector('[data-add-roadmap-edge]')?.addEventListener('click', () => {
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        const nodes = entry.roadmap.nodes;
        if (nodes.length < 2) return;
        const source = state.selectedRoadmapNodeId || nodes[0].id;
        const target = nodes.find((node) => node.id !== source)?.id || nodes[0].id;
        entry.roadmap.edges.push({
          ...createEdgeDraft(entry.roadmap.edges.length),
          source,
          target,
          sourceSide: 'right',
          targetSide: 'left'
        });
      });
    });

    learningEditor.querySelector('[data-roadmap-ai-help]')?.addEventListener('click', async () => {
      const selectedId = state.selectedRoadmapNodeId;
      if (!selectedId || !state.selectedEntry) return;
      const store = getLearningStore();
      const entry = store[state.selectedEntry];
      const node = entry?.roadmap?.nodes?.find((item) => item.id === selectedId);
      if (!node) return;
      const button = learningEditor.querySelector('[data-roadmap-ai-help]');
      const previousLabel = button?.textContent;
      if (button) {
        button.disabled = true;
        button.textContent = 'AI думает...';
      }
      try {
        const response = await fetch(apiUrl('/api/ai/roadmap-help'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profession: state.selectedEntry,
            nodeLabel: node.data?.label || 'Новый навык',
            nodeStatus: node.data?.status || 'Draft',
            currentDescription: node.data?.description || ''
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Не удалось получить AI-подсказку');
        updateCurrentEntry((draft) => {
          draft.roadmap = normalizeRoadmap(draft);
          const target = draft.roadmap.nodes.find((item) => item.id === selectedId);
          if (!target) return;
          target.data.description = data.suggestion?.description || target.data.description || '';
          target.data.freeLinks = data.suggestion?.freeLinks || target.data.freeLinks || '';
          target.data.articleLinks = data.suggestion?.articleLinks || target.data.articleLinks || '';
          target.data.plusLinks = data.suggestion?.plusLinks || target.data.plusLinks || '';
          target.data.practiceText = data.suggestion?.practiceText || target.data.practiceText || '';
        });
      } catch {
        alert('AI-помощник пока недоступен.');
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = previousLabel || 'AI-помощник';
        }
      }
    });

    learningEditor.querySelector('[data-save-selected-node]')?.addEventListener('click', () => {
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        const node = entry.roadmap.nodes.find((item) => item.id === state.selectedRoadmapNodeId);
        if (!node) return;
        const nextId = learningEditor.querySelector('[data-selected-node-field="id"]')?.value.trim() || node.id;
        const previousId = node.id;
        node.id = nextId;
        node.type = 'skillNode';
        node.data.label = learningEditor.querySelector('[data-selected-node-field="label"]')?.value.trim() || 'Новый навык';
        node.data.status = learningEditor.querySelector('[data-selected-node-field="status"]')?.value.trim() || 'Draft';
        node.data.color = learningEditor.querySelector('[data-selected-node-field="color"]')?.value.trim() || '#2563eb';
        node.data.description = learningEditor.querySelector('[data-selected-node-field="description"]')?.value.trim() || '';
        node.data.freeLinks = learningEditor.querySelector('[data-selected-node-field="freeLinks"]')?.value.trim() || '';
        node.data.articleLinks = learningEditor.querySelector('[data-selected-node-field="articleLinks"]')?.value.trim() || '';
        node.data.plusLinks = learningEditor.querySelector('[data-selected-node-field="plusLinks"]')?.value.trim() || '';
        node.data.practiceEnabled = (learningEditor.querySelector('[data-selected-node-field="practiceEnabled"]')?.value || 'false') === 'true';
        node.data.practiceText = learningEditor.querySelector('[data-selected-node-field="practiceText"]')?.value.trim() || '';
        if (previousId !== nextId) {
          entry.roadmap.edges.forEach((edge) => {
            if (edge.source === previousId) edge.source = nextId;
            if (edge.target === previousId) edge.target = nextId;
          });
          state.selectedRoadmapNodeId = nextId;
        }
      });
    });

    learningEditor.querySelector('[data-delete-selected-node]')?.addEventListener('click', () => {
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        entry.roadmap.nodes = entry.roadmap.nodes.filter((node) => node.id !== state.selectedRoadmapNodeId);
        entry.roadmap.edges = entry.roadmap.edges.filter((edge) => edge.source !== state.selectedRoadmapNodeId && edge.target !== state.selectedRoadmapNodeId);
        state.selectedRoadmapNodeId = entry.roadmap.nodes[0]?.id || null;
      });
    });

    learningEditor.querySelectorAll('[data-move-node]').forEach((button) => {
      button.addEventListener('click', () => {
        const move = button.dataset.moveNode;
        const step = ROADMAP_GRID * 2;
        if (move === 'up') moveNodeByStep(state.selectedRoadmapNodeId, 0, -step);
        if (move === 'down') moveNodeByStep(state.selectedRoadmapNodeId, 0, step);
        if (move === 'left') moveNodeByStep(state.selectedRoadmapNodeId, -step, 0);
        if (move === 'right') moveNodeByStep(state.selectedRoadmapNodeId, step, 0);
      });
    });

    learningEditor.querySelector('[data-add-subtask]')?.addEventListener('click', () => {
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        const node = entry.roadmap.nodes.find((item) => item.id === state.selectedRoadmapNodeId);
        if (!node) return;
        node.data.subTasks.push(normalizeSubTask({}, node.data.subTasks.length));
      });
    });

    learningEditor.querySelectorAll('[data-remove-subtask]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.removeSubtask);
        updateCurrentEntry((entry) => {
          entry.roadmap = normalizeRoadmap(entry);
          const node = entry.roadmap.nodes.find((item) => item.id === state.selectedRoadmapNodeId);
          if (!node) return;
          node.data.subTasks.splice(index, 1);
        });
      });
    });

    learningEditor.querySelector('[data-save-subtasks]')?.addEventListener('click', () => {
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        const node = entry.roadmap.nodes.find((item) => item.id === state.selectedRoadmapNodeId);
        if (!node) return;
        node.data.subTasks = (node.data.subTasks || []).map((subTask, index) => ({
          ...subTask,
          label: learningEditor.querySelector(`[data-selected-subtask-field="label"][data-selected-subtask-index="${index}"]`)?.value.trim() || 'Новый подпункт',
          description: learningEditor.querySelector(`[data-selected-subtask-field="description"][data-selected-subtask-index="${index}"]`)?.value.trim() || '',
          freeLinks: learningEditor.querySelector(`[data-selected-subtask-field="freeLinks"][data-selected-subtask-index="${index}"]`)?.value.trim() || '',
          articleLinks: learningEditor.querySelector(`[data-selected-subtask-field="articleLinks"][data-selected-subtask-index="${index}"]`)?.value.trim() || '',
          plusLinks: learningEditor.querySelector(`[data-selected-subtask-field="plusLinks"][data-selected-subtask-index="${index}"]`)?.value.trim() || '',
          practiceEnabled: (learningEditor.querySelector(`[data-selected-subtask-field="practiceEnabled"][data-selected-subtask-index="${index}"]`)?.value || 'false') === 'true'
        }));
      });
    });

    learningEditor.querySelectorAll('[data-remove-roadmap-edge]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.removeRoadmapEdge);
        updateCurrentEntry((entry) => {
          entry.roadmap = normalizeRoadmap(entry);
          entry.roadmap.edges.splice(index, 1);
        });
      });
    });

    learningEditor.querySelector('[data-save-roadmap-edges]')?.addEventListener('click', () => {
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        entry.roadmap.edges = entry.roadmap.edges.map((edge, index) => ({
          ...edge,
          id: edge.id || `edge-${index + 1}`,
          source: learningEditor.querySelector(`[data-edge-field="source"][data-edge-index="${index}"]`)?.value.trim() || '',
          target: learningEditor.querySelector(`[data-edge-field="target"][data-edge-index="${index}"]`)?.value.trim() || '',
          sourceSide: learningEditor.querySelector(`[data-edge-field="sourceSide"][data-edge-index="${index}"]`)?.value || 'right',
          targetSide: learningEditor.querySelector(`[data-edge-field="targetSide"][data-edge-index="${index}"]`)?.value || 'left'
        })).filter((edge) => edge.source && edge.target);
      });
    });

    learningEditor.querySelector('[data-apply-roadmap-json]')?.addEventListener('click', () => {
      const field = learningEditor.querySelector('[data-roadmap-json]');
      if (!field) return;
      try {
        field.classList.remove('has-error');
        const parsed = JSON.parse(field.value);
        updateCurrentEntry((entry) => {
          entry.roadmap = normalizeRoadmap({ roadmap: parsed });
          state.selectedRoadmapNodeId = entry.roadmap.nodes[0]?.id || null;
        });
      } catch {
        field.classList.add('has-error');
      }
    });

    learningEditor.querySelector('[data-close-subtask-editor]')?.addEventListener('click', () => {
      state.selectedSubtaskIndex = null;
      renderLearningEditor();
    });

    learningEditor.querySelector('[data-save-single-subtask]')?.addEventListener('click', () => {
      const idx = state.selectedSubtaskIndex;
      if (idx === null) return;
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        const node = entry.roadmap.nodes.find((item) => item.id === state.selectedRoadmapNodeId);
        if (!node || !node.data?.subTasks?.[idx]) return;
        const fields = ['label', 'description', 'freeLinks', 'articleLinks', 'plusLinks', 'practiceText'];
        fields.forEach((f) => {
          const input = learningEditor.querySelector(`[data-edit-subtask-field="${f}"]`);
          if (input) {
            node.data.subTasks[idx][f] = input.value.trim();
          }
        });
        const sel = learningEditor.querySelector('[data-edit-subtask-field="practiceEnabled"]');
        if (sel) {
          node.data.subTasks[idx].practiceEnabled = sel.value === 'true';
        }
        state.selectedSubtaskIndex = null;
      });
    });

    paintEdges();
  };

  const getCurrentEntry = () => {
    if (!state.selectedEntry) return null;
    return ensureProfessionData(state.selectedEntry);
  };

  const updateCurrentEntry = (updater) => {
    if (!state.selectedEntry) return;
    const sidebar = learningEditor.querySelector('.dev-roadmap-sidebar-scroll');
    const sidebarScrollTop = sidebar ? sidebar.scrollTop : 0;
    const store = getLearningStore();
    const current = JSON.parse(JSON.stringify(store[state.selectedEntry] || ensureProfessionData(state.selectedEntry)));
    updater(current);
    store[state.selectedEntry] = current;
    write(K.learningByItem, store);
    renderLearningEditor();
    requestAnimationFrame(() => {
      if (sidebar) sidebar.scrollTop = sidebarScrollTop;
    });
  };

  const moveNodeByStep = (nodeId, dx, dy) => {
    updateCurrentEntry((entry) => {
      const node = entry.roadmap?.nodes?.find((item) => item.id === nodeId);
      if (!node) return;
      node.position.x = Math.max(0, Number(node.position?.x || 0) + dx);
      node.position.y = Math.max(0, Number(node.position?.y || 0) + dy);
    });
  };

  const escapeAttr = (value) => escapeHtml(value).replaceAll('\n', '&#10;');

  const renderLearningEditor = () => {
    const fullRoadmap = state.learningMode === 'edit' && state.selectedSection === 'roadmap' && !!state.selectedEntry;
    document.body.classList.toggle('dev-roadmap-mode', fullRoadmap);

    if (state.learningMode === 'list' || !state.selectedEntry) {
      learningEditor.innerHTML = `
        <div class="dev-empty-state">
          <h3>Выбери профессию или статьи</h3>
          <p>Слева можно добавить новую профессию, переименовать существующую или перейти к редактированию секций.</p>
        </div>
      `;
      return;
    }

    if (state.learningMode === 'articles') {
      learningEditor.innerHTML = `
        <div class="dev-editor-shell">
          <div class="dev-editor-head">
            <button type="button" class="dev-secondary" data-learning-back>Назад</button>
            <div class="dev-chip">Статьи</div>
          </div>
          <div class="dev-user-card">
            <h3>Раздел статей</h3>
            <p>Здесь позже появится отдельный редактор статей и фильтров. Пока это отдельная точка входа в логике dev-панели.</p>
          </div>
        </div>
      `;
      learningEditor.querySelector('[data-learning-back]')?.addEventListener('click', () => {
        state.learningMode = 'list';
        state.selectedEntry = null;
        state.pendingConnection = null;
        state.roadmapFitOnce = null;
        renderLearningEditor();
      });
      return;
    }

    const data = ensureProfessionData(state.selectedEntry);
    const titles = {
      roadmap: 'Дорожная карта',
      practice: 'Практика',
      grade: 'Грейд',
      interview: 'Собеседование'
    };

    const body = {
      roadmap: renderRoadmapEditor(data),
      practice: `
        <label>
          Редактор практики
          <textarea rows="16" data-learning-practice>${escapeHtml(data.practice || '')}</textarea>
        </label>
      `,
      grade: `
        <label>
          Редактор грейда
          <textarea rows="16" data-learning-grade>${escapeHtml(data.grade || '')}</textarea>
        </label>
      `,
      interview: `
        <label>
          Редактор собеседования
          <textarea rows="16" data-learning-interview>${escapeHtml(data.interview || '')}</textarea>
        </label>
      `
    }[state.selectedSection];

    learningEditor.innerHTML = state.selectedSection === 'roadmap' ? `
      <div class="dev-editor-shell is-roadmap-mode">
        <header class="learning-topbar dev-roadmap-learning-topbar">
          <a class="learning-logo page-link" href="index.html">Roadstar</a>
          <div class="dev-roadmap-topbar-center">
            <button type="button" class="learning-profile-btn" data-learning-back>Назад к списку</button>
            <span class="dev-roadmap-profession" title="${escapeAttr(state.selectedEntry)}">${escapeHtml(state.selectedEntry)}</span>
            <nav class="learning-tabs dev-roadmap-section-tabs" aria-label="Секции редактора">
              ${Object.entries(titles).map(([key, label]) => `
                <button type="button" class="${state.selectedSection === key ? 'is-active' : ''}" data-learning-section="${key}">${label}</button>
              `).join('')}
            </nav>
          </div>
          <div class="learning-actions">
            <button type="button" class="learning-profile-btn dev-roadmap-save-primary" data-learning-save>Сохранить</button>
            <div class="theme-switcher theme-switcher-dropdown" data-admin-roadmap-theme-switcher>
              <button type="button" class="theme-toggle theme-icon-toggle" data-admin-theme-toggle aria-label="Тема превью карты">
                <span data-admin-theme-icon>◐</span>
              </button>
              <div class="theme-menu theme-icon-menu" data-admin-theme-menu hidden>
                <button type="button" data-roadmap-theme="white" class="${state.roadmapTheme === 'white' ? 'is-active' : ''}" aria-label="Белая">◯</button>
                <button type="button" data-roadmap-theme="black" class="${state.roadmapTheme === 'black' ? 'is-active' : ''}" aria-label="Чёрная">⬤</button>
                <button type="button" data-roadmap-theme="blue" class="${state.roadmapTheme === 'blue' ? 'is-active' : ''}" aria-label="Тёмно-синяя">◉</button>
                <button type="button" data-roadmap-theme="beige" class="${state.roadmapTheme === 'beige' ? 'is-active' : ''}" aria-label="Бежевая">◌</button>
              </div>
            </div>
          </div>
        </header>
        <div class="dev-editor-body dev-editor-body-roadmap">
          ${body}
        </div>
      </div>
    ` : `
      <div class="dev-editor-shell">
        <div class="dev-editor-head">
          <button type="button" class="dev-secondary" data-learning-back>Назад</button>
          <div class="dev-editor-actions">
            <div class="dev-chip">${escapeHtml(state.selectedEntry)}</div>
            <button type="button" class="dev-primary" data-learning-save>Сохранить изменения</button>
          </div>
        </div>
        <div class="dev-subtabs">
          ${Object.entries(titles).map(([key, label]) => `
            <button type="button" class="dev-subtab ${state.selectedSection === key ? 'is-active' : ''}" data-learning-section="${key}">${label}</button>
          `).join('')}
        </div>
        <div class="dev-editor-body">
          <h3>${titles[state.selectedSection]}</h3>
          ${body}
        </div>
      </div>
    `;

    learningEditor.querySelector('[data-learning-back]')?.addEventListener('click', () => {
      state.learningMode = 'list';
      state.selectedEntry = null;
      state.pendingConnection = null;
      state.roadmapFitOnce = null;
      renderLearningEditor();
    });

    learningEditor.querySelectorAll('[data-learning-section]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedSection = button.dataset.learningSection;
        if (state.selectedSection !== 'roadmap') state.pendingConnection = null;
        renderLearningEditor();
      });
    });

    if (state.selectedSection === 'roadmap') bindRoadmapEditor();

    learningEditor.querySelector('[data-learning-save]')?.addEventListener('click', () => {
      const store = getLearningStore();
      const current = { ...(store[state.selectedEntry] || ensureProfessionData(state.selectedEntry)) };
      current.roadmap = normalizeRoadmap(current);
      current.practice = learningEditor.querySelector('[data-learning-practice]')?.value ?? current.practice;
      current.grade = learningEditor.querySelector('[data-learning-grade]')?.value ?? current.grade;
      current.interview = learningEditor.querySelector('[data-learning-interview]')?.value ?? current.interview;
      store[state.selectedEntry] = current;
      write(K.learningByItem, store);
    });
  };

  const renderLearning = () => {
    const shell = document.querySelector('.dev-learning-shell');
    const fullRoadmap = state.learningMode === 'edit' && state.selectedSection === 'roadmap' && !!state.selectedEntry;
    document.body.classList.toggle('dev-roadmap-mode', fullRoadmap);
    if (learningDirectory) {
      learningDirectory.hidden = fullRoadmap;
      learningDirectory.style.display = fullRoadmap ? 'none' : '';
    }
    shell?.classList.toggle('is-roadmap-editor', fullRoadmap);
    renderLearningDirectory();
    renderLearningEditor();
  };

  const renderPayment = () => {
    const payment = getPayment();
    document.querySelectorAll('[data-payment-field]').forEach((field) => {
      field.value = payment[field.dataset.paymentField] || '';
    });
  };

  const renderProfiles = () => {
    const users = getUsers();
    const services = getServices();
    const count = document.querySelector('[data-profile-count]');
    const plusCount = document.querySelector('[data-profile-plus-active-count]');
    const serviceCount = document.querySelector('[data-profile-service-count]');

    if (count) count.textContent = `Пользователей: ${users.length}`;
    if (plusCount) plusCount.textContent = `Активных Plus: ${users.filter((user) => user.plus === 'on').length}`;
    if (serviceCount) serviceCount.textContent = `Подключённых сервисов: ${Object.values(services).filter(Boolean).length}`;

    document.querySelectorAll('[data-service-token]').forEach((field) => {
      field.value = services[field.dataset.serviceToken] || '';
    });

    fetch(apiUrl('/api/admin/ai-config'))
      .then((response) => response.json())
      .then((data) => {
        document.querySelectorAll('[data-ai-config]').forEach((field) => {
          field.value = data.ai?.[field.dataset.aiConfig] || '';
        });
      })
      .catch(() => {});

    const container = document.querySelector('[data-users-editor]');
    if (!container) return;

    container.innerHTML = users.map((user, index) => `
      <div class="dev-user-card compact-user-card">
        <strong>${escapeHtml(user.name || user.email)}</strong>
        <span>${escapeHtml(user.email)}</span>
        <div class="compact-user-controls">
          <label>Plus
            <select data-profile-plus="${index}">
              <option value="off" ${user.plus === 'off' ? 'selected' : ''}>off</option>
              <option value="on" ${user.plus === 'on' ? 'selected' : ''}>on</option>
            </select>
          </label>
          <label>Токены
            <input type="number" min="0" max="100" value="${Number(user.tokens || 0)}" data-profile-tokens="${index}">
          </label>
          <button type="button" class="dev-primary" data-profile-save="${index}">Сохранить</button>
        </div>
      </div>
    `).join('') || '<div class="dev-user-card">Пока нет пользователей.</div>';

    container.querySelectorAll('[data-profile-save]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.profileSave);
        const next = getUsers();
        next[index].plus = document.querySelector(`[data-profile-plus="${index}"]`)?.value || 'off';
        next[index].tokens = Number(document.querySelector(`[data-profile-tokens="${index}"]`)?.value || 0);
        write(K.users, next);
        renderProfiles();
      });
    });
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => showPanel(tab.dataset.adminTab)));
  document.querySelector('[data-dev-save-home]')?.addEventListener('click', saveHome);

  document.querySelector('[data-save-payment]')?.addEventListener('click', () => {
    const next = {};
    document.querySelectorAll('[data-payment-field]').forEach((field) => {
      next[field.dataset.paymentField] = field.value.trim();
    });
    write(K.payment, next);
  });

  document.querySelector('[data-save-services]')?.addEventListener('click', () => {
    const next = {};
    document.querySelectorAll('[data-service-token]').forEach((field) => {
      next[field.dataset.serviceToken] = field.value.trim();
    });
    write(K.services, next);
    renderProfiles();
  });

  document.querySelector('[data-save-ai-config]')?.addEventListener('click', async () => {
    const next = {};
    document.querySelectorAll('[data-ai-config]').forEach((field) => {
      next[field.dataset.aiConfig] = field.value.trim();
    });
    try {
      await fetch(apiUrl('/api/admin/ai-config'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      });
    } catch {}
    renderProfiles();
  });

  renderHome();
  renderLearning();
  renderPayment();
  renderProfiles();
  showPanel(state.currentTab);
});
