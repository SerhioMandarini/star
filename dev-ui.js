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
    selectedSection: 'roadmap'
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
    const nodeCards = (roadmap.nodes || []).map((node, index) => `
      <article class="dev-roadmap-item">
        <div class="dev-roadmap-item-head">
          <h4>Узел ${index + 1}</h4>
          <button type="button" class="dev-secondary danger" data-remove-roadmap-node="${index}">Удалить</button>
        </div>
        <div class="dev-roadmap-grid">
          <label>ID<input type="text" value="${escapeHtml(node.id || '')}" data-node-field="id" data-node-index="${index}"></label>
          <label>Type<input type="text" value="${escapeHtml(node.type || 'skillNode')}" data-node-field="type" data-node-index="${index}"></label>
          <label>Label<input type="text" value="${escapeHtml(node.data?.label || '')}" data-node-field="label" data-node-index="${index}"></label>
          <label>Тип
            <select data-node-field="status" data-node-index="${index}">
              <option value="Main" ${(node.data?.status || '') === 'Main' ? 'selected' : ''}>Main</option>
              <option value="Core" ${(node.data?.status || '') === 'Core' ? 'selected' : ''}>Core</option>
              <option value="Branch" ${(node.data?.status || '') === 'Branch' ? 'selected' : ''}>Branch</option>
              <option value="Draft" ${(node.data?.status || '') === 'Draft' ? 'selected' : ''}>Draft</option>
            </select>
          </label>
          <label>Цвет<input type="color" value="${escapeHtml(node.data?.color || '#2563eb')}" data-node-field="color" data-node-index="${index}"></label>
          <label>X<input type="number" value="${Number(node.position?.x || 0)}" data-node-field="x" data-node-index="${index}"></label>
          <label>Y<input type="number" value="${Number(node.position?.y || 0)}" data-node-field="y" data-node-index="${index}"></label>
          <label class="dev-roadmap-grid-wide">Описание<textarea rows="4" data-node-field="description" data-node-index="${index}">${escapeHtml(node.data?.description || '')}</textarea></label>
          <label class="dev-roadmap-grid-wide">Полезные ссылки<textarea rows="3" data-node-field="freeLinks" data-node-index="${index}">${escapeHtml(node.data?.freeLinks || '')}</textarea></label>
          <label class="dev-roadmap-grid-wide">Статьи и материалы<textarea rows="3" data-node-field="articleLinks" data-node-index="${index}">${escapeHtml(node.data?.articleLinks || '')}</textarea></label>
          <label class="dev-roadmap-grid-wide">Ресурсы plus<textarea rows="3" data-node-field="plusLinks" data-node-index="${index}">${escapeHtml(node.data?.plusLinks || '')}</textarea></label>
          <label class="dev-roadmap-check"><span>Кнопка практики</span><input type="checkbox" ${node.data?.practiceEnabled ? 'checked' : ''} data-node-field="practiceEnabled" data-node-index="${index}"></label>
          <div class="dev-roadmap-grid-wide dev-subtask-editor">
            <div class="dev-roadmap-item-head">
              <h4>Подпункты</h4>
              <button type="button" class="dev-secondary" data-add-subtask="${index}">Добавить подпункт</button>
            </div>
            <div class="dev-subtask-stack">
              ${(node.data?.subTasks || []).map((subTask, subIndex) => `
                <article class="dev-subtask-card">
                  <div class="dev-roadmap-item-head">
                    <h4>Подпункт ${subIndex + 1}</h4>
                    <button type="button" class="dev-secondary danger" data-remove-subtask="${index}:${subIndex}">Удалить</button>
                  </div>
                  <div class="dev-roadmap-grid">
                    <label>Название<input type="text" value="${escapeHtml(subTask.label || '')}" data-subtask-field="label" data-node-index="${index}" data-subtask-index="${subIndex}"></label>
                    <label class="dev-roadmap-check"><span>Практика</span><input type="checkbox" ${subTask.practiceEnabled ? 'checked' : ''} data-subtask-field="practiceEnabled" data-node-index="${index}" data-subtask-index="${subIndex}"></label>
                    <label class="dev-roadmap-grid-wide">Описание<textarea rows="3" data-subtask-field="description" data-node-index="${index}" data-subtask-index="${subIndex}">${escapeHtml(subTask.description || '')}</textarea></label>
                    <label class="dev-roadmap-grid-wide">Полезные ссылки<textarea rows="2" data-subtask-field="freeLinks" data-node-index="${index}" data-subtask-index="${subIndex}">${escapeHtml(subTask.freeLinks || '')}</textarea></label>
                    <label class="dev-roadmap-grid-wide">Статьи и материалы<textarea rows="2" data-subtask-field="articleLinks" data-node-index="${index}" data-subtask-index="${subIndex}">${escapeHtml(subTask.articleLinks || '')}</textarea></label>
                    <label class="dev-roadmap-grid-wide">Ресурсы plus<textarea rows="2" data-subtask-field="plusLinks" data-node-index="${index}" data-subtask-index="${subIndex}">${escapeHtml(subTask.plusLinks || '')}</textarea></label>
                  </div>
                </article>
              `).join('') || '<div class="dev-user-card">Пока нет подпунктов.</div>'}
            </div>
          </div>
        </div>
      </article>
    `).join('');

    const edgeCards = (roadmap.edges || []).map((edge, index) => `
      <article class="dev-roadmap-item">
        <div class="dev-roadmap-item-head">
          <h4>Связь ${index + 1}</h4>
          <button type="button" class="dev-secondary danger" data-remove-roadmap-edge="${index}">Удалить</button>
        </div>
        <div class="dev-roadmap-grid">
          <label>ID<input type="text" value="${escapeHtml(edge.id || '')}" data-edge-field="id" data-edge-index="${index}"></label>
          <label>Source<input type="text" value="${escapeHtml(edge.source || '')}" data-edge-field="source" data-edge-index="${index}"></label>
          <label>Target<input type="text" value="${escapeHtml(edge.target || '')}" data-edge-field="target" data-edge-index="${index}"></label>
          <label>Точка source
            <select data-edge-field="sourceSide" data-edge-index="${index}">
              <option value="top" ${edge.sourceSide === 'top' ? 'selected' : ''}>Верх</option>
              <option value="right" ${edge.sourceSide === 'right' ? 'selected' : ''}>Право</option>
              <option value="bottom" ${edge.sourceSide === 'bottom' ? 'selected' : ''}>Низ</option>
              <option value="left" ${edge.sourceSide === 'left' ? 'selected' : ''}>Лево</option>
            </select>
          </label>
          <label>Точка target
            <select data-edge-field="targetSide" data-edge-index="${index}">
              <option value="top" ${edge.targetSide === 'top' ? 'selected' : ''}>Верх</option>
              <option value="right" ${edge.targetSide === 'right' ? 'selected' : ''}>Право</option>
              <option value="bottom" ${edge.targetSide === 'bottom' ? 'selected' : ''}>Низ</option>
              <option value="left" ${edge.targetSide === 'left' ? 'selected' : ''}>Лево</option>
            </select>
          </label>
          <label>Type<input type="text" value="${escapeHtml(edge.type || 'smoothstep')}" data-edge-field="type" data-edge-index="${index}"></label>
          <label class="dev-roadmap-check">
            <span>Animated</span>
            <input type="checkbox" ${edge.animated ? 'checked' : ''} data-edge-field="animated" data-edge-index="${index}">
          </label>
        </div>
      </article>
    `).join('');

    return `
      <div class="dev-roadmap-editor">
        <div class="dev-roadmap-toolbar">
          <div class="dev-chip">Редактор React Flow</div>
          <div class="dev-editor-actions">
            <button type="button" class="dev-secondary" data-add-roadmap-node>Добавить узел</button>
            <button type="button" class="dev-secondary" data-add-roadmap-edge>Добавить связь</button>
          </div>
        </div>
        <div class="dev-user-card">
          Редактор карты работает как схема: задавай положение узлов по X/Y, соединяй их связями и наполняй каждый узел описанием, ссылками, статьями и кнопкой практики.
        </div>
        <div class="dev-roadmap-settings">
          <label class="dev-roadmap-check"><span>Dev Mode по умолчанию</span><input type="checkbox" ${roadmap.settings?.isDevModeDefault ? 'checked' : ''} data-roadmap-setting="isDevModeDefault"></label>
          <label class="dev-roadmap-check"><span>Pan On Scroll</span><input type="checkbox" ${roadmap.settings?.panOnScroll ? 'checked' : ''} data-roadmap-setting="panOnScroll"></label>
          <label class="dev-roadmap-check"><span>Selection On Drag</span><input type="checkbox" ${roadmap.settings?.selectionOnDrag ? 'checked' : ''} data-roadmap-setting="selectionOnDrag"></label>
          <label class="dev-roadmap-check"><span>Fit View</span><input type="checkbox" ${roadmap.settings?.fitView ? 'checked' : ''} data-roadmap-setting="fitView"></label>
        </div>
        <section class="dev-roadmap-section">
          <div class="dev-roadmap-section-head"><h4>Узлы</h4><span>${roadmap.nodes?.length || 0} шт.</span></div>
          <div class="dev-roadmap-stack">${nodeCards || '<div class="dev-user-card">Пока нет узлов. Добавь первый навык.</div>'}</div>
        </section>
        <section class="dev-roadmap-section">
          <div class="dev-roadmap-section-head"><h4>Связи</h4><span>${roadmap.edges?.length || 0} шт.</span></div>
          <div class="dev-roadmap-stack">${edgeCards || '<div class="dev-user-card">Пока нет связей. Добавь связь между узлами.</div>'}</div>
        </section>
        <section class="dev-roadmap-section">
          <div class="dev-roadmap-section-head"><h4>JSON preview</h4><span>Проверка структуры перед сохранением</span></div>
          <textarea class="dev-roadmap-json-editor" rows="18" data-roadmap-json>${escapeHtml(JSON.stringify(roadmap, null, 2))}</textarea>
          <div class="dev-editor-actions">
            <button type="button" class="dev-secondary" data-apply-roadmap-json>Применить JSON</button>
          </div>
        </section>
      </div>
    `;
  };

  const collectRoadmapFromEditor = () => {
    const settings = {
      isDevModeDefault: Boolean(learningEditor.querySelector('[data-roadmap-setting="isDevModeDefault"]')?.checked),
      panOnScroll: Boolean(learningEditor.querySelector('[data-roadmap-setting="panOnScroll"]')?.checked),
      selectionOnDrag: Boolean(learningEditor.querySelector('[data-roadmap-setting="selectionOnDrag"]')?.checked),
      fitView: Boolean(learningEditor.querySelector('[data-roadmap-setting="fitView"]')?.checked)
    };

    const nodeIndexes = [...new Set(Array.from(learningEditor.querySelectorAll('[data-node-index]')).map((field) => Number(field.dataset.nodeIndex)).filter((value) => Number.isFinite(value)))].sort((a, b) => a - b);
    const edgeIndexes = [...new Set(Array.from(learningEditor.querySelectorAll('[data-edge-index]')).map((field) => Number(field.dataset.edgeIndex)).filter((value) => Number.isFinite(value)))].sort((a, b) => a - b);

    const nodes = nodeIndexes.map((index) => ({
      id: learningEditor.querySelector(`[data-node-field="id"][data-node-index="${index}"]`)?.value?.trim() || `skill-${index + 1}`,
      type: learningEditor.querySelector(`[data-node-field="type"][data-node-index="${index}"]`)?.value?.trim() || 'skillNode',
      data: {
        label: learningEditor.querySelector(`[data-node-field="label"][data-node-index="${index}"]`)?.value?.trim() || 'Новый навык',
        status: learningEditor.querySelector(`[data-node-field="status"][data-node-index="${index}"]`)?.value?.trim() || 'Draft',
        color: learningEditor.querySelector(`[data-node-field="color"][data-node-index="${index}"]`)?.value?.trim() || '#2563eb',
        description: learningEditor.querySelector(`[data-node-field="description"][data-node-index="${index}"]`)?.value?.trim() || '',
        freeLinks: learningEditor.querySelector(`[data-node-field="freeLinks"][data-node-index="${index}"]`)?.value?.trim() || '',
        articleLinks: learningEditor.querySelector(`[data-node-field="articleLinks"][data-node-index="${index}"]`)?.value?.trim() || '',
        plusLinks: learningEditor.querySelector(`[data-node-field="plusLinks"][data-node-index="${index}"]`)?.value?.trim() || '',
        practiceEnabled: Boolean(learningEditor.querySelector(`[data-node-field="practiceEnabled"][data-node-index="${index}"]`)?.checked),
        subTasks: [...new Set(Array.from(learningEditor.querySelectorAll(`[data-subtask-index][data-node-index="${index}"]`)).map((field) => Number(field.dataset.subtaskIndex)).filter((value) => Number.isFinite(value)))]
          .sort((a, b) => a - b)
          .map((subIndex) => ({
            id: `subtask-${index + 1}-${subIndex + 1}`,
            label: learningEditor.querySelector(`[data-subtask-field="label"][data-node-index="${index}"][data-subtask-index="${subIndex}"]`)?.value?.trim() || 'Новый подпункт',
            description: learningEditor.querySelector(`[data-subtask-field="description"][data-node-index="${index}"][data-subtask-index="${subIndex}"]`)?.value?.trim() || '',
            freeLinks: learningEditor.querySelector(`[data-subtask-field="freeLinks"][data-node-index="${index}"][data-subtask-index="${subIndex}"]`)?.value?.trim() || '',
            articleLinks: learningEditor.querySelector(`[data-subtask-field="articleLinks"][data-node-index="${index}"][data-subtask-index="${subIndex}"]`)?.value?.trim() || '',
            plusLinks: learningEditor.querySelector(`[data-subtask-field="plusLinks"][data-node-index="${index}"][data-subtask-index="${subIndex}"]`)?.value?.trim() || '',
            practiceEnabled: Boolean(learningEditor.querySelector(`[data-subtask-field="practiceEnabled"][data-node-index="${index}"][data-subtask-index="${subIndex}"]`)?.checked)
          }))
      },
      position: {
        x: Number(learningEditor.querySelector(`[data-node-field="x"][data-node-index="${index}"]`)?.value || 0),
        y: Number(learningEditor.querySelector(`[data-node-field="y"][data-node-index="${index}"]`)?.value || 0)
      }
    })).filter((node) => node.id && node.data.label);

    const edges = edgeIndexes.map((index) => ({
      id: learningEditor.querySelector(`[data-edge-field="id"][data-edge-index="${index}"]`)?.value?.trim() || `edge-${index + 1}`,
      source: learningEditor.querySelector(`[data-edge-field="source"][data-edge-index="${index}"]`)?.value?.trim() || '',
      target: learningEditor.querySelector(`[data-edge-field="target"][data-edge-index="${index}"]`)?.value?.trim() || '',
      sourceSide: learningEditor.querySelector(`[data-edge-field="sourceSide"][data-edge-index="${index}"]`)?.value?.trim() || 'right',
      targetSide: learningEditor.querySelector(`[data-edge-field="targetSide"][data-edge-index="${index}"]`)?.value?.trim() || 'left',
      type: learningEditor.querySelector(`[data-edge-field="type"][data-edge-index="${index}"]`)?.value?.trim() || 'smoothstep',
      animated: Boolean(learningEditor.querySelector(`[data-edge-field="animated"][data-edge-index="${index}"]`)?.checked)
    })).filter((edge) => edge.source && edge.target);

    return { settings, nodes, edges };
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
    learningEditor.querySelector('[data-add-roadmap-node]')?.addEventListener('click', () => {
      const store = getLearningStore();
      const current = ensureProfessionData(state.selectedEntry);
      const roadmap = collectRoadmapFromEditor();
      roadmap.nodes.push(createNodeDraft(roadmap.nodes.length));
      store[state.selectedEntry] = { ...current, roadmap };
      write(K.learningByItem, store);
      renderLearningEditor();
    });

    learningEditor.querySelector('[data-add-roadmap-edge]')?.addEventListener('click', () => {
      const store = getLearningStore();
      const current = ensureProfessionData(state.selectedEntry);
      const roadmap = collectRoadmapFromEditor();
      roadmap.edges.push(createEdgeDraft(roadmap.edges.length));
      store[state.selectedEntry] = { ...current, roadmap };
      write(K.learningByItem, store);
      renderLearningEditor();
    });

    learningEditor.querySelectorAll('[data-remove-roadmap-node]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.removeRoadmapNode);
        const store = getLearningStore();
        const current = ensureProfessionData(state.selectedEntry);
        const roadmap = collectRoadmapFromEditor();
        roadmap.nodes.splice(index, 1);
        const validIds = new Set(roadmap.nodes.map((node) => node.id));
        roadmap.edges = roadmap.edges.filter((edge) => validIds.has(edge.source) && validIds.has(edge.target));
        store[state.selectedEntry] = { ...current, roadmap };
        write(K.learningByItem, store);
        renderLearningEditor();
      });
    });

    learningEditor.querySelectorAll('[data-remove-roadmap-edge]').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.removeRoadmapEdge);
        const store = getLearningStore();
        const current = ensureProfessionData(state.selectedEntry);
        const roadmap = collectRoadmapFromEditor();
        roadmap.edges.splice(index, 1);
        store[state.selectedEntry] = { ...current, roadmap };
        write(K.learningByItem, store);
        renderLearningEditor();
      });
    });

    learningEditor.querySelectorAll('[data-add-subtask]').forEach((button) => {
      button.addEventListener('click', () => {
        const nodeIndex = Number(button.dataset.addSubtask);
        const store = getLearningStore();
        const current = ensureProfessionData(state.selectedEntry);
        const roadmap = collectRoadmapFromEditor();
        roadmap.nodes[nodeIndex].data.subTasks.push(normalizeSubTask({}, roadmap.nodes[nodeIndex].data.subTasks.length));
        store[state.selectedEntry] = { ...current, roadmap };
        write(K.learningByItem, store);
        renderLearningEditor();
      });
    });

    learningEditor.querySelectorAll('[data-remove-subtask]').forEach((button) => {
      button.addEventListener('click', () => {
        const [nodeIndex, subtaskIndex] = String(button.dataset.removeSubtask).split(':').map(Number);
        const store = getLearningStore();
        const current = ensureProfessionData(state.selectedEntry);
        const roadmap = collectRoadmapFromEditor();
        roadmap.nodes[nodeIndex].data.subTasks.splice(subtaskIndex, 1);
        store[state.selectedEntry] = { ...current, roadmap };
        write(K.learningByItem, store);
        renderLearningEditor();
      });
    });

    learningEditor.querySelector('[data-apply-roadmap-json]')?.addEventListener('click', () => {
      const field = learningEditor.querySelector('[data-roadmap-json]');
      if (!field) return;
      try {
        field.classList.remove('has-error');
        const parsed = JSON.parse(field.value);
        const store = getLearningStore();
        const current = ensureProfessionData(state.selectedEntry);
        store[state.selectedEntry] = { ...current, roadmap: normalizeRoadmap({ roadmap: parsed }) };
        write(K.learningByItem, store);
        renderLearningEditor();
      } catch {
        field.classList.add('has-error');
      }
    });
  };

  const renderLearningEditor = () => {
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

    learningEditor.innerHTML = `
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
      renderLearningEditor();
    });

    learningEditor.querySelectorAll('[data-learning-section]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedSection = button.dataset.learningSection;
        renderLearningEditor();
      });
    });

    if (state.selectedSection === 'roadmap') bindRoadmapEditor();

    learningEditor.querySelector('[data-learning-save]')?.addEventListener('click', () => {
      const store = getLearningStore();
      const current = { ...(store[state.selectedEntry] || ensureProfessionData(state.selectedEntry)) };
      current.roadmap = state.selectedSection === 'roadmap' ? collectRoadmapFromEditor() : normalizeRoadmap(current);
      current.practice = learningEditor.querySelector('[data-learning-practice]')?.value ?? current.practice;
      current.grade = learningEditor.querySelector('[data-learning-grade]')?.value ?? current.grade;
      current.interview = learningEditor.querySelector('[data-learning-interview]')?.value ?? current.interview;
      store[state.selectedEntry] = current;
      write(K.learningByItem, store);
    });
  };

  const renderLearning = () => {
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
