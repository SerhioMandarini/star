document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'dev') return;

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
        practiceEnabled: false
      };
    }
    return {
      id: subTask?.id || `subtask-${index + 1}`,
      label: subTask?.label || 'Новый подпункт',
      description: subTask?.description || '',
      freeLinks: subTask?.freeLinks || '',
      articleLinks: subTask?.articleLinks || '',
      plusLinks: subTask?.plusLinks || '',
      practiceEnabled: Boolean(subTask?.practiceEnabled)
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

  const createNodeDraft = (index = 0) => ({
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
      subTasks: []
    },
    position: { x: 120 + index * 40, y: 120 + index * 40 }
  });

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

  const state = {
    currentTab: tabs.find((tab) => tab.classList.contains('is-active'))?.dataset.adminTab || 'home',
    learningMode: 'list',
    selectedEntry: null,
    selectedSection: 'roadmap',
    selectedRoadmapNodeId: null,
    pendingConnection: null,
    roadmapTheme: 'white'
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
      panel.style.display = active ? 'grid' : 'none';
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

  const renderRoadmapEditor = (data) => {
    const roadmap = data.roadmap || createDefaultRoadmap();
    if (!state.selectedRoadmapNodeId || !roadmap.nodes.some((node) => node.id === state.selectedRoadmapNodeId)) {
      state.selectedRoadmapNodeId = roadmap.nodes[0]?.id || null;
    }

    const selectedNode = roadmap.nodes.find((node) => node.id === state.selectedRoadmapNodeId) || roadmap.nodes[0] || null;
    const viewportWidth = Math.max(window.innerWidth - 8, 1280);
    const viewportHeight = Math.max(window.innerHeight - 78, 720);
    const previewWidth = Math.max(...roadmap.nodes.map((node) => Number(node.position?.x || 0) + 260), viewportWidth);
    const previewHeight = Math.max(...roadmap.nodes.map((node) => Number(node.position?.y || 0) + 220), viewportHeight);
    const byId = Object.fromEntries(roadmap.nodes.map((node) => [node.id, node]));
    const previewLines = (roadmap.edges || []).map((edge) => {
      const source = byId[edge.source];
      const target = byId[edge.target];
      if (!source || !target) return '';
      const start = sidePoint(source, edge.sourceSide || 'right');
      const end = sidePoint(target, edge.targetSide || 'left');
      return `<path class="${edge.animated ? 'is-dashed' : ''}" marker-end="url(#dev-roadmap-arrow)" d="${edgePath(start, end, edge.sourceSide || 'right', edge.targetSide || 'left')}" />`;
    }).join('');

    const previewNodes = roadmap.nodes.map((node) => `
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
      </article>
    `).join('');

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
      <div class="dev-roadmap-studio">
        <div class="dev-roadmap-toolbar">
          <div class="dev-chip">Roadmap Studio</div>
          <div class="dev-editor-actions">
            <button type="button" class="dev-secondary" data-add-roadmap-node>Добавить узел</button>
            <button type="button" class="dev-secondary" data-add-roadmap-edge>Добавить связь</button>
            <button type="button" class="dev-secondary" data-roadmap-center>Собрать компактно</button>
          </div>
        </div>
        <div class="dev-roadmap-meta">
          <div class="dev-chip">Узлов: ${roadmap.nodes.length}</div>
          <div class="dev-chip">Связей: ${roadmap.edges.length}</div>
          <div class="dev-chip">Сетка: 40px</div>
          <div class="dev-chip">${state.pendingConnection ? `Стрелка: ${escapeHtml(state.pendingConnection.nodeId)} / ${escapeHtml(state.pendingConnection.side)}` : 'Соединение: выбери первую точку'}</div>
          <div class="dev-roadmap-theme-switch">
            ${['white', 'black', 'blue', 'beige'].map((theme) => `
              <button type="button" class="dev-secondary ${state.roadmapTheme === theme ? 'is-active' : ''}" data-roadmap-theme="${theme}">${theme}</button>
            `).join('')}
          </div>
        </div>
        <div class="dev-roadmap-workspace">
          <section class="dev-roadmap-canvas-card">
            <div class="dev-roadmap-canvas-scroll">
              <div class="dev-roadmap-canvas-grid" data-roadmap-canvas-grid style="width:${previewWidth}px; height:${previewHeight}px;">
                <div class="dev-roadmap-learning-bounds" data-preview-theme="${escapeAttr(state.roadmapTheme)}">
                  <span>Граница видимой области обучения</span>
                </div>
                <svg class="dev-roadmap-canvas-lines" data-roadmap-canvas-lines width="${previewWidth}" height="${previewHeight}" viewBox="0 0 ${previewWidth} ${previewHeight}">
                  <defs>
                    <marker id="dev-roadmap-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1f6fff"></path>
                    </marker>
                  </defs>
                  ${previewLines}
                </svg>
                ${previewNodes}
              </div>
            </div>
          </section>
          <aside class="dev-roadmap-inspector-overlay">
            <div class="dev-roadmap-inspector">
            ${selectedNode ? `
              <div class="dev-roadmap-canvas-head">
                <h4>Инспектор узла</h4>
                <p>Слева инструменты и свойства, справа большой холст. Узлы можно таскать прямо по сетке.</p>
              </div>
              <div class="dev-roadmap-grid">
                <label>ID<input type="text" value="${escapeAttr(selectedNode.id || '')}" data-selected-node-field="id"></label>
                <label>Тип<input type="text" value="${escapeAttr(selectedNode.type || 'skillNode')}" data-selected-node-field="type"></label>
                <label>Название<input type="text" value="${escapeAttr(selectedNode.data?.label || '')}" data-selected-node-field="label"></label>
                <label>Статус
                  <select data-selected-node-field="status">
                    <option value="Main" ${(selectedNode.data?.status || '') === 'Main' ? 'selected' : ''}>Main</option>
                    <option value="Core" ${(selectedNode.data?.status || '') === 'Core' ? 'selected' : ''}>Core</option>
                    <option value="Branch" ${(selectedNode.data?.status || '') === 'Branch' ? 'selected' : ''}>Branch</option>
                    <option value="Draft" ${(selectedNode.data?.status || '') === 'Draft' ? 'selected' : ''}>Draft</option>
                  </select>
                </label>
                <label>Цвет<input type="color" value="${escapeAttr(selectedNode.data?.color || '#2563eb')}" data-selected-node-field="color"></label>
                <label>Практика
                  <select data-selected-node-field="practiceEnabled">
                    <option value="false" ${!selectedNode.data?.practiceEnabled ? 'selected' : ''}>Нет</option>
                    <option value="true" ${selectedNode.data?.practiceEnabled ? 'selected' : ''}>Да</option>
                  </select>
                </label>
                <label>X<input type="number" value="${Number(selectedNode.position?.x || 0)}" data-selected-node-field="x"></label>
                <label>Y<input type="number" value="${Number(selectedNode.position?.y || 0)}" data-selected-node-field="y"></label>
                <label class="dev-roadmap-grid-wide">Описание<textarea rows="4" data-selected-node-field="description">${escapeHtml(selectedNode.data?.description || '')}</textarea></label>
                <label class="dev-roadmap-grid-wide">Полезные ссылки<textarea rows="3" data-selected-node-field="freeLinks">${escapeHtml(selectedNode.data?.freeLinks || '')}</textarea></label>
                <label class="dev-roadmap-grid-wide">Статьи<textarea rows="3" data-selected-node-field="articleLinks">${escapeHtml(selectedNode.data?.articleLinks || '')}</textarea></label>
                <label class="dev-roadmap-grid-wide">Ресурсы plus<textarea rows="3" data-selected-node-field="plusLinks">${escapeHtml(selectedNode.data?.plusLinks || '')}</textarea></label>
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
                <button type="button" class="dev-primary" data-save-subtasks>Сохранить подпункты</button>
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
              <textarea class="dev-roadmap-json-editor" rows="18" data-roadmap-json>${escapeHtml(JSON.stringify(roadmap, null, 2))}</textarea>
              <div class="dev-editor-actions">
                <button type="button" class="dev-secondary" data-apply-roadmap-json>Применить JSON</button>
              </div>
            </section>
            </div>
          </aside>
        </div>
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

    const getCanvasNodeElement = (nodeId) => learningEditor.querySelector(`[data-canvas-node-id="${nodeId}"]`);
    const getCanvasNodeData = (nodeId) => liveRoadmap.nodes.find((node) => node.id === nodeId);

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
      button.addEventListener('click', () => {
        state.selectedRoadmapNodeId = button.dataset.selectRoadmapNode;
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
        renderLearningEditor();
      });
    });

    learningEditor.querySelectorAll('[data-canvas-node-id]').forEach((nodeElement) => {
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

        const move = (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          const nextX = Math.max(0, Math.round((originX + dx) / 20) * 20);
          const nextY = Math.max(0, Math.round((originY + dy) / 20) * 20);
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
          node.position.x = 80 + (index % 4) * 260;
          node.position.y = 80 + Math.floor(index / 4) * 180;
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

    learningEditor.querySelector('[data-save-selected-node]')?.addEventListener('click', () => {
      updateCurrentEntry((entry) => {
        entry.roadmap = normalizeRoadmap(entry);
        const node = entry.roadmap.nodes.find((item) => item.id === state.selectedRoadmapNodeId);
        if (!node) return;
        const nextId = learningEditor.querySelector('[data-selected-node-field="id"]')?.value.trim() || node.id;
        const previousId = node.id;
        node.id = nextId;
        node.type = learningEditor.querySelector('[data-selected-node-field="type"]')?.value.trim() || 'skillNode';
        node.data.label = learningEditor.querySelector('[data-selected-node-field="label"]')?.value.trim() || 'Новый навык';
        node.data.status = learningEditor.querySelector('[data-selected-node-field="status"]')?.value.trim() || 'Draft';
        node.data.color = learningEditor.querySelector('[data-selected-node-field="color"]')?.value.trim() || '#2563eb';
        node.data.description = learningEditor.querySelector('[data-selected-node-field="description"]')?.value.trim() || '';
        node.data.freeLinks = learningEditor.querySelector('[data-selected-node-field="freeLinks"]')?.value.trim() || '';
        node.data.articleLinks = learningEditor.querySelector('[data-selected-node-field="articleLinks"]')?.value.trim() || '';
        node.data.plusLinks = learningEditor.querySelector('[data-selected-node-field="plusLinks"]')?.value.trim() || '';
        node.data.practiceEnabled = (learningEditor.querySelector('[data-selected-node-field="practiceEnabled"]')?.value || 'false') === 'true';
        node.position.x = Number(learningEditor.querySelector('[data-selected-node-field="x"]')?.value || 0);
        node.position.y = Number(learningEditor.querySelector('[data-selected-node-field="y"]')?.value || 0);
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
        const step = 40;
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

    paintEdges();
  };

  const getCurrentEntry = () => {
    if (!state.selectedEntry) return null;
    return ensureProfessionData(state.selectedEntry);
  };

  const updateCurrentEntry = (updater) => {
    if (!state.selectedEntry) return;
    const store = getLearningStore();
    const current = JSON.parse(JSON.stringify(store[state.selectedEntry] || ensureProfessionData(state.selectedEntry)));
    updater(current);
    store[state.selectedEntry] = current;
    write(K.learningByItem, store);
    renderLearningEditor();
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
    document.body.classList.toggle('dev-roadmap-mode', state.learningMode === 'edit' && state.selectedSection === 'roadmap' && !!state.selectedEntry);

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
        <div class="dev-roadmap-pagebar">
          <div class="dev-roadmap-pagebar-left">
            <button type="button" class="dev-secondary" data-learning-back>Назад</button>
            <div class="dev-chip">${escapeHtml(state.selectedEntry)}</div>
          </div>
          <div class="dev-roadmap-pagebar-tabs">
            ${Object.entries(titles).map(([key, label]) => `
              <button type="button" class="dev-subtab ${state.selectedSection === key ? 'is-active' : ''}" data-learning-section="${key}">${label}</button>
            `).join('')}
          </div>
          <div class="dev-roadmap-pagebar-right">
            <button type="button" class="dev-primary" data-learning-save>Сохранить изменения</button>
          </div>
        </div>
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

  renderHome();
  renderLearning();
  renderPayment();
  renderProfiles();
  showPanel(state.currentTab);
});
