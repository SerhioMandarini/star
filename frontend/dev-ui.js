document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'dev') return;

  const API_BASE = window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000') ? 'http://localhost:3000' : '';
  const apiUrl = (path) => `${API_BASE}${path}`;

  const K = {
    site: 'roadstar-site-content',
    lists: 'roadstar-custom-lists',
    payment: 'roadstar-payment-content',
    services: 'roadstar-service-tokens',
    users: 'roadstar-local-users',
    learningByItem: 'roadstar-learning-by-item',
    practiceSkills: 'roadstar-practice-skills'
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
          practiceEnabled: true
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
          practiceEnabled: true
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
          practiceEnabled: true
        },
        position: { x: 700, y: 80 }
      }
    ],
    edges: [
      { id: 'edge-html-js', source: 'html-css', target: 'js-core', sourceSide: 'right', targetSide: 'left', type: 'smoothstep', animated: true },
      { id: 'edge-js-react', source: 'js-core', target: 'react', sourceSide: 'right', targetSide: 'left', type: 'smoothstep', animated: true }
    ]
  });

  const PROFESSION_SEEDS = {
    'Frontend Developer': {
      settings: { isDevModeDefault: true, panOnScroll: true, selectionOnDrag: true, fitView: true },
      nodes: [
        { id: 'internet', type: 'skillNode', position: { x: 360, y: 40 }, data: { label: 'Интернет', description: 'Как работает интернет, HTTP/HTTPS, DNS, браузеры и основы клиент-серверного взаимодействия.', color: '#6366f1', status: 'Core', freeLinks: 'https://developer.mozilla.org/ru/docs/Learn/Common_questions/How_does_the_Internet_work MDN: Как работает интернет\nhttps://roadmap.sh/guides/what-is-internet roadmap.sh', articleLinks: 'Статья: HTTP простыми словами\nСтатья: DNS — от запроса до ответа', plusLinks: 'Plus: шпаргалка по сетевым протоколам\nPlus: HTTP vs HTTPS — разбор', practiceEnabled: true, practiceText: 'Объясни своими словами, что происходит, когда ты вводишь URL в браузер. Нарисуй схему.' } },
        { id: 'html', type: 'skillNode', position: { x: 60, y: 200 }, data: { label: 'HTML', description: 'Семантическая разметка, формы, таблицы, мета-теги, доступность и базовая SEO-структура.', color: '#ef4444', status: 'Core', freeLinks: 'https://developer.mozilla.org/ru/docs/Web/HTML MDN HTML\nhttps://html.spec.whatwg.org Спецификация HTML', articleLinks: 'Статья: семантические теги — зачем они нужны\nСтатья: доступные формы (ARIA + HTML)', plusLinks: 'Plus: чек-лист ревью HTML-разметки\nPlus: типичные ошибки новичков', practiceEnabled: true, practiceText: 'Сверстай страницу профиля пользователя: шапка, аватар, описание, форма обратной связи — только HTML.' } },
        { id: 'css', type: 'skillNode', position: { x: 360, y: 200 }, data: { label: 'CSS', description: 'Блочная модель, Flexbox, Grid, адаптивность, CSS-переменные, анимации и псевдоэлементы.', color: '#3b82f6', status: 'Core', freeLinks: 'https://developer.mozilla.org/ru/docs/Web/CSS MDN CSS\nhttps://css-tricks.com CSS-Tricks', articleLinks: 'Статья: Flexbox за 30 минут\nСтатья: CSS Grid — полное руководство', plusLinks: 'Plus: верстка по макету (Figma → CSS)\nPlus: CSS-анимации и переходы', practiceEnabled: true, practiceText: 'Сделай адаптивную карточку товара: изображение, заголовок, цена, кнопка — Flexbox и медиазапросы.' } },
        { id: 'javascript', type: 'skillNode', position: { x: 660, y: 200 }, data: { label: 'JavaScript', description: 'Синтаксис ES6+, DOM, события, замыкания, прототипы, Promise, async/await и модули.', color: '#f59e0b', status: 'Core', freeLinks: 'https://javascript.info javascript.info\nhttps://developer.mozilla.org/ru/docs/Web/JavaScript MDN JS', articleLinks: 'Статья: event loop — как работает JS\nСтатья: Promise и async/await', plusLinks: 'Plus: карта закрепления JS Core\nPlus: 50 задач на JavaScript', practiceEnabled: true, practiceText: 'Напиши функцию debounce(fn, delay) на JS с примером использования.' } },
        { id: 'git', type: 'skillNode', position: { x: 60, y: 360 }, data: { label: 'Git', description: 'Ветки, коммиты, merge, rebase, stash, pull requests и работа с GitHub/GitLab.', color: '#10b981', status: 'Core', freeLinks: 'https://git-scm.com/doc Документация Git\nhttps://learngitbranching.js.org Learn Git Branching', articleLinks: 'Статья: Git за 30 минут\nСтатья: Git flow vs trunk-based', plusLinks: 'Plus: шпаргалка по Git-командам\nPlus: разбор конфликтов при merge', practiceEnabled: true, practiceText: 'Создай репозиторий, сделай feature-ветку, реши конфликт при слиянии и опиши каждый шаг.' } },
        { id: 'pkg-managers', type: 'skillNode', position: { x: 360, y: 360 }, data: { label: 'Пакетные менеджеры', description: 'npm, yarn, pnpm: установка зависимостей, package.json, версионирование и скрипты.', color: '#8b5cf6', status: 'Core', freeLinks: 'https://docs.npmjs.com Документация npm\nhttps://yarnpkg.com Yarn', articleLinks: 'Статья: npm vs yarn vs pnpm\nСтатья: package.json от А до Я', plusLinks: 'Plus: управление зависимостями в монорепо\nPlus: безопасность npm-пакетов', practiceEnabled: true, practiceText: 'Инициализируй проект, добавь несколько зависимостей и напиши кастомный скрипт в package.json.' } },
        { id: 'build-tools', type: 'skillNode', position: { x: 660, y: 360 }, data: { label: 'Инструменты сборки', description: 'Vite и Webpack: бандлинг, минификация, tree-shaking, hot reload и конфигурация.', color: '#f97316', status: 'Core', freeLinks: 'https://vitejs.dev Vite\nhttps://webpack.js.org Webpack', articleLinks: 'Статья: Vite vs Webpack — что выбрать\nСтатья: tree-shaking — как убрать лишнее', plusLinks: 'Plus: настройка Vite с нуля\nPlus: оптимизация бандла', practiceEnabled: true, practiceText: 'Настрой Vite-проект с React, добавь алиасы путей и раздели dev/prod конфигурацию.' } },
        { id: 'css-arch', type: 'skillNode', position: { x: 60, y: 520 }, data: { label: 'CSS Архитектура', description: 'BEM, OOCSS, Atomic CSS — методологии организации стилей в масштабируемых проектах.', color: '#06b6d4', status: 'Main', freeLinks: 'https://getbem.com BEM\nhttps://tailwindcss.com Tailwind CSS', articleLinks: 'Статья: BEM за 15 минут\nСтатья: Tailwind — утилитарный подход', plusLinks: 'Plus: переход с BEM на Tailwind\nPlus: CSS-in-JS vs utility-first', practiceEnabled: true, practiceText: 'Перепиши компонент карточки с произвольных классов на BEM-нотацию.' } },
        { id: 'css-preproc', type: 'skillNode', position: { x: 360, y: 520 }, data: { label: 'CSS Препроцессоры', description: 'Sass/SCSS: переменные, вложенность, миксины, функции и работа с темами.', color: '#ec4899', status: 'Main', freeLinks: 'https://sass-lang.com Sass\nhttps://lesscss.org Less', articleLinks: 'Статья: Sass — от основ до продвинутых\nСтатья: CSS-переменные vs Sass-переменные', plusLinks: 'Plus: организация SCSS в большом проекте\nPlus: тёмная тема через CSS-переменные', practiceEnabled: true, practiceText: 'Напиши SCSS для системы токенов (цвета, отступы, типографика) с поддержкой светлой и тёмной темы.' } },
        { id: 'typescript', type: 'skillNode', position: { x: 660, y: 520 }, data: { label: 'TypeScript', description: 'Типы, интерфейсы, generics, utility types и интеграция с React и инструментами сборки.', color: '#2563eb', status: 'Core', freeLinks: 'https://www.typescriptlang.org/docs TypeScript Docs\nhttps://typescript-exercises.github.io TypeScript Exercises', articleLinks: 'Статья: TypeScript за 1 час\nСтатья: generics — когда и зачем', plusLinks: 'Plus: TypeScript в реальном проекте\nPlus: строгие типы и паттерны', practiceEnabled: true, practiceText: 'Типизируй функцию fetch-обёртки с generics: fetchData<T>(url: string): Promise<T>.' } },
        { id: 'react', type: 'skillNode', position: { x: 60, y: 680 }, data: { label: 'React', description: 'Компоненты, хуки (useState, useEffect, useRef, useMemo), JSX, маршрутизация (React Router) и формы.', color: '#0ea5e9', status: 'Core', freeLinks: 'https://react.dev React Docs\nhttps://reactrouter.com React Router', articleLinks: 'Статья: как мыслить компонентами\nСтатья: useEffect — подводные камни', plusLinks: 'Plus: архитектура React-приложения\nPlus: разбор pet-проекта', practiceEnabled: true, practiceText: 'Создай компонент TodoList с добавлением, удалением и фильтрацией задач на React + TypeScript.' } },
        { id: 'state-mgmt', type: 'skillNode', position: { x: 360, y: 680 }, data: { label: 'Управление состоянием', description: 'Redux Toolkit, Zustand, Jotai, Context API — паттерны и выбор инструмента под задачу.', color: '#7c3aed', status: 'Main', freeLinks: 'https://zustand-demo.pmnd.rs Zustand\nhttps://redux-toolkit.js.org Redux Toolkit', articleLinks: 'Статья: Zustand vs Redux — что выбрать\nСтатья: Context API — когда хватит', plusLinks: 'Plus: стейт-менеджмент в большом SPA\nPlus: серверное состояние (React Query)', practiceEnabled: true, practiceText: 'Реализуй корзину покупок с Zustand: добавление, удаление, подсчёт суммы.' } },
        { id: 'testing', type: 'skillNode', position: { x: 660, y: 680 }, data: { label: 'Тестирование', description: 'Unit-тесты (Jest/Vitest), компонентные тесты (Testing Library), E2E (Playwright/Cypress).', color: '#16a34a', status: 'Core', freeLinks: 'https://vitest.dev Vitest\nhttps://testing-library.com Testing Library', articleLinks: 'Статья: пирамида тестирования\nСтатья: Testing Library — правильные запросы', plusLinks: 'Plus: покрытие кода тестами\nPlus: E2E в CI/CD', practiceEnabled: true, practiceText: 'Напиши тесты для компонента LoginForm: валидация полей, сабмит, ошибка авторизации.' } },
        { id: 'security', type: 'skillNode', position: { x: 60, y: 840 }, data: { label: 'Веб-безопасность', description: 'XSS, CSRF, CSP, CORS, HTTPS, безопасное хранение данных и безопасные практики кода.', color: '#dc2626', status: 'Main', freeLinks: 'https://owasp.org OWASP\nhttps://developer.mozilla.org/ru/docs/Web/Security MDN Security', articleLinks: 'Статья: XSS — что это и как защититься\nСтатья: CSRF-атаки и токены', plusLinks: 'Plus: аудит безопасности фронтенда\nPlus: Content Security Policy', practiceEnabled: true, practiceText: 'Найди и исправь XSS-уязвимость в примере кода. Опиши, как правильно экранировать ввод пользователя.' } },
        { id: 'performance', type: 'skillNode', position: { x: 360, y: 840 }, data: { label: 'Производительность', description: 'Core Web Vitals, lazy loading, оптимизация рендера, кеширование, code splitting и профилирование.', color: '#d97706', status: 'Main', freeLinks: 'https://web.dev/performance web.dev\nhttps://pagespeed.web.dev PageSpeed Insights', articleLinks: 'Статья: Core Web Vitals — что важно знать\nСтатья: code splitting в React', plusLinks: 'Plus: аудит производительности реального сайта\nPlus: React Profiler и оптимизация', practiceEnabled: true, practiceText: 'Проанализируй страницу в Lighthouse, найди 3 проблемы и предложи решения для каждой.' } },
        { id: 'accessibility', type: 'skillNode', position: { x: 660, y: 840 }, data: { label: 'Доступность', description: 'WCAG 2.1, ARIA-атрибуты, навигация с клавиатуры, контрастность и поддержка скрин-ридеров.', color: '#9333ea', status: 'Main', freeLinks: 'https://www.w3.org/WAI/WCAG21 WCAG\nhttps://developer.mozilla.org/ru/docs/Web/Accessibility MDN A11y', articleLinks: 'Статья: доступность для начинающих\nСтатья: ARIA — когда использовать', plusLinks: 'Plus: аудит доступности с axe\nPlus: скрин-ридеры на практике', practiceEnabled: true, practiceText: 'Добавь полную поддержку клавиатурной навигации и ARIA к кастомному select-компоненту.' } },
        { id: 'cicd', type: 'skillNode', position: { x: 360, y: 1000 }, data: { label: 'CI/CD', description: 'GitHub Actions, автодеплой на Vercel/Netlify, линтеры, тесты и проверки в пайплайне.', color: '#0891b2', status: 'Core', freeLinks: 'https://docs.github.com/actions GitHub Actions\nhttps://vercel.com Vercel', articleLinks: 'Статья: CI/CD для фронтенда\nСтатья: GitHub Actions за 20 минут', plusLinks: 'Plus: полный пайплайн для React-приложения\nPlus: деплой с env-секретами', practiceEnabled: true, practiceText: 'Настрой GitHub Actions: lint + test при каждом push, автодеплой на Vercel при merge в main.' } }
      ],
      edges: [
        { id: 'e-internet-html', source: 'internet', target: 'html', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-internet-css', source: 'internet', target: 'css', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-internet-js', source: 'internet', target: 'javascript', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-html-git', source: 'html', target: 'git', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-css-pkg', source: 'css', target: 'pkg-managers', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-js-build', source: 'javascript', target: 'build-tools', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-git-cssarch', source: 'git', target: 'css-arch', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-pkg-csspreproc', source: 'pkg-managers', target: 'css-preproc', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-build-ts', source: 'build-tools', target: 'typescript', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-cssarch-react', source: 'css-arch', target: 'react', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-csspreproc-state', source: 'css-preproc', target: 'state-mgmt', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-ts-testing', source: 'typescript', target: 'testing', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-react-security', source: 'react', target: 'security', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-state-perf', source: 'state-mgmt', target: 'performance', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-testing-access', source: 'testing', target: 'accessibility', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-security-cicd', source: 'security', target: 'cicd', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-perf-cicd', source: 'performance', target: 'cicd', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false },
        { id: 'e-access-cicd', source: 'accessibility', target: 'cicd', sourceSide: 'bottom', targetSide: 'top', type: 'smoothstep', animated: false, secondary: false }
      ]
    }
  };

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
                practiceEnabled: Boolean(node.data?.practiceEnabled)
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
              animated: edge.animated !== false,
              secondary: Boolean(edge.secondary)
            }))
          : fallback.edges
      };
    }
    return { ...fallback };
  };

  const ensureProfessionData = (name) => {
    const store = getLearningStore();
    const current = store[name] || {};
    // Use profession seed when roadmap not yet defined
    const hasSavedRoadmap = current.roadmap && typeof current.roadmap === 'object' && Array.isArray(current.roadmap.nodes) && current.roadmap.nodes.length > 0;
    const seed = PROFESSION_SEEDS[name];
    const roadmapSource = hasSavedRoadmap ? current : (seed ? { roadmap: seed } : current);
    const next = {
      roadmap: normalizeRoadmap(roadmapSource),
      practice: current.practice || '',
      grade: current.grade || '',
      interview: current.interview || ''
    };
    store[name] = next;
    write(K.learningByItem, store);
    return next;
  };

  const loadRoadmapFromBackend = async (name) => {
    try {
      const response = await fetch(apiUrl(`/api/roadmaps/${encodeURIComponent(name)}`), { credentials: 'include' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail || payload.error || 'roadmap');
      const store = getLearningStore();
      const current = store[name] || {};
      const localRoadmap = normalizeRoadmap(current);
      const remoteRoadmap = normalizeRoadmap({ roadmap: payload.data || payload.roadmap || payload });
      const remoteLooksGenerated = (remoteRoadmap.nodes || []).some((node) => String(node.id || '').endsWith('-foundation'));
      if (current.roadmap && localRoadmap.nodes.length > remoteRoadmap.nodes.length && remoteLooksGenerated) {
        await saveRoadmapToBackend(name, current);
        return current;
      }
      const next = {
        ...current,
        roadmap: remoteRoadmap
      };
      store[name] = next;
      write(K.learningByItem, store);
      return next;
    } catch {
      return ensureProfessionData(name);
    }
  };

  const saveRoadmapToBackend = async (name, entry) => {
    try {
      const roadmap = normalizeRoadmap(entry);
      const response = await fetch(apiUrl(`/api/roadmaps/${encodeURIComponent(name)}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: name, data: roadmap })
      });
      if (!response.ok) throw new Error('roadmap');
      return true;
    } catch {
      return false;
    }
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
        practiceText: ''
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
    animated: true,
    secondary: false
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
    pendingConnection: null,
    roadmapTheme: 'white',
    roadmapCamera: { x: 80, y: 64, zoom: 0.85 },
    roadmapFitOnce: null,
    practiceSkillId: null,
    sgrSkillId: null
  };

  const SGR_DEFAULTS_ADMIN = {
    internet:      { intern: 30, junior: 50, middle: 65, senior: 78 },
    html:          { intern: 45, junior: 62, middle: 80, senior: 92 },
    css:           { intern: 40, junior: 60, middle: 78, senior: 90 },
    javascript:    { intern: 25, junior: 55, middle: 80, senior: 95 },
    git:           { intern: 35, junior: 58, middle: 73, senior: 82 },
    'pkg-managers':{ intern: 25, junior: 48, middle: 65, senior: 77 },
    'build-tools': { intern: 10, junior: 32, middle: 63, senior: 80 },
    'css-arch':    { intern: 15, junior: 38, middle: 66, senior: 82 },
    'css-preproc': { intern: 15, junior: 35, middle: 62, senior: 78 },
    typescript:    { intern: 5,  junior: 18, middle: 68, senior: 88 },
    react:         { intern: 10, junior: 38, middle: 77, senior: 92 },
    'state-mgmt':  { intern: 5,  junior: 22, middle: 70, senior: 87 },
    testing:       { intern: 5,  junior: 18, middle: 58, senior: 84 },
    security:      { intern: 10, junior: 22, middle: 53, senior: 74 },
    performance:   { intern: 5,  junior: 16, middle: 50, senior: 76 },
    accessibility: { intern: 5,  junior: 14, middle: 42, senior: 66 },
    cicd:          { intern: 10, junior: 28, middle: 60, senior: 80 }
  };
  const SGR_AVG_FACTORS_ADMIN = { intern: 0.70, junior: 0.76, middle: 0.82, senior: 0.88 };

  // ── practice skills helpers ──────────────────────────────────────────────
  const PRACTICE_LANG_MAP = {
    frontend: 'javascript', js: 'javascript', react: 'javascript',
    backend: 'python', питон: 'python', python: 'python', fastapi: 'python',
    devops: 'bash', линукс: 'bash',
    'data analyst': 'sql', sql: 'sql', аналитик: 'sql',
    'data scientist': 'python',
    qa: 'text', тестирование: 'text',
    manager: 'text', 'product manager': 'text', менеджер: 'text',
    designer: 'text', 'ui/ux': 'text', дизайн: 'text',
    fullstack: 'javascript'
  };

  const detectPracticeLanguage = (profession) => {
    const name = String(profession || '').toLowerCase();
    for (const [key, lang] of Object.entries(PRACTICE_LANG_MAP)) {
      if (name.includes(key)) return lang;
    }
    return 'javascript';
  };

  const getPracticeSkillsFor = (profession) => {
    const all = read(K.practiceSkills, {});
    return all[profession] || { skills: [] };
  };

  const savePracticeSkillsFor = (profession, data) => {
    const all = read(K.practiceSkills, {});
    all[profession] = data;
    write(K.practiceSkills, all);
  };

  const autoSyncSkillsFromRoadmap = (profession) => {
    const store = getLearningStore();
    const entry = store[profession] || {};
    const roadmap = normalizeRoadmap(entry);
    const current = getPracticeSkillsFor(profession);
    const existingIds = new Set((current.skills || []).map((s) => s.id));
    const defaultLang = detectPracticeLanguage(profession);
    const added = [];
    (roadmap.nodes || []).forEach((node) => {
      const id = node.id;
      if (existingIds.has(id)) return;
      added.push({
        id,
        label: node.data?.label || id,
        isManual: false,
        language: defaultLang,
        tasks: []
      });
      existingIds.add(id);
    });
    const next = { skills: [...(current.skills || []), ...added] };
    savePracticeSkillsFor(profession, next);
    return next;
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
      button.addEventListener('click', async () => {
        state.learningMode = 'edit';
        state.selectedEntry = button.dataset.editProfession;
        state.selectedSection = 'roadmap';
        state.selectedRoadmapNodeId = null;
        await loadRoadmapFromBackend(state.selectedEntry);
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
      return `<path class="${edge.secondary ? 'is-dashed' : ''}" marker-end="url(#dev-roadmap-arrow)" d="${edgePath(start, end, edge.sourceSide || 'right', edge.targetSide || 'left')}" />`;
    }).join('');

    const swatches = ['#2563eb', '#7c3aed', '#0f766e', '#dc2626', '#ea580c', '#d97706', '#64748b', '#111827', '#ec4899', '#14b8a6'];
    const swatchButtons = swatches.map((c) => `
      <button type="button" class="dev-roadmap-swatch" data-swatch-color="${escapeAttr(c)}" style="--rs-swatch:${escapeAttr(c)}" title="${escapeAttr(c)}" aria-label="Палитра ${escapeAttr(c)}"></button>
    `).join('');

    const previewNodes = roadmap.nodes.map((node) => {
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
          <label>Тип линии
            <select data-edge-field="secondary" data-edge-index="${index}">
              <option value="false" ${!edge.secondary ? 'selected' : ''}>Основная (сплошная)</option>
              <option value="true" ${edge.secondary ? 'selected' : ''}>Побочная (пунктир)</option>
            </select>
          </label>
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
                <p>Поля содержимого и ссылки — здесь; позицию удобнее менять перетаскиванием на холсте.</p>
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
    const height = 58;
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
      return `<path class="edge-path${edge.secondary ? ' is-dashed' : ''}" marker-end="url(#preview-arrow)" d="${edgePath(start, end, edge.sourceSide || 'right', edge.targetSide || 'left')}" />`;
    }).join('');
    const cards = nodes.map((node) => `
      <div class="roadmap-flow-node" style="left:${Number(node.position?.x || 0)}px; top:${Number(node.position?.y || 0)}px; border-color:${escapeHtml(node.data?.color || '#d9d9d9')}; background:${escapeHtml(node.data?.color || '#d9d9d9')};">
        <div class="roadmap-flow-node-head"><strong>${escapeHtml(node.data?.label || 'Без названия')}</strong></div>
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
        return `<path class="${edge.secondary ? 'is-dashed' : ''}" marker-end="url(#dev-roadmap-arrow)" d="${edgePath(start, end, edge.sourceSide || 'right', edge.targetSide || 'left')}" />`;
      }).join('');
      lines.innerHTML = defs + paths;
    };

    learningEditor.querySelectorAll('[data-dev-roadmap-subtask]').forEach((el) => {
      el.addEventListener('pointerdown', (e) => {
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
        if (event.target.closest('[data-dev-roadmap-subtask]')) return;
        const nodeId = nodeElement.dataset.canvasNodeId;
        const node = getCanvasNodeData(nodeId);
        if (!node || !canvas) return;
        event.preventDefault();
        const startX = event.clientX;
        const startY = event.clientY;
        const originX = Number(node.position?.x || 0);
        const originY = Number(node.position?.y || 0);
        nodeElement.setPointerCapture?.(event.pointerId);
        let hasMoved = false;

        const z = state.roadmapCamera.zoom || 1;
        const move = (moveEvent) => {
          const rawDx = moveEvent.clientX - startX;
          const rawDy = moveEvent.clientY - startY;
          if (!hasMoved && Math.sqrt(rawDx * rawDx + rawDy * rawDy) > 5) hasMoved = true;
          if (!hasMoved) return;
          let dx = rawDx / z;
          let dy = rawDy / z;
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
          if (!hasMoved) {
            state.selectedRoadmapNodeId = nodeId;
            state.selectedSubtaskIndex = null;
            renderLearningEditor();
            return;
          }
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
      // Persist to backend so reload doesn't revert changes
      const saved = getLearningStore()[state.selectedEntry];
      if (saved) saveRoadmapToBackend(state.selectedEntry, saved);
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
          targetSide: learningEditor.querySelector(`[data-edge-field="targetSide"][data-edge-index="${index}"]`)?.value || 'left',
          secondary: (learningEditor.querySelector(`[data-edge-field="secondary"][data-edge-index="${index}"]`)?.value || 'false') === 'true'
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

  const LANG_LABELS = {
    javascript: 'JavaScript', python: 'Python', html: 'HTML', css: 'CSS',
    bash: 'Bash/Shell', sql: 'SQL', typescript: 'TypeScript', text: 'Текст'
  };
  const ALL_LANGS = ['javascript', 'python', 'html', 'css', 'bash', 'sql', 'typescript', 'text'];

  const bindPracticeEditor = () => {
    const mount = learningEditor.querySelector('[data-practice-editor-mount]');
    if (!mount) return;
    const profession = state.selectedEntry;
    if (!profession) { mount.innerHTML = '<p>Выбери профессию в списке.</p>'; return; }

    // ── render skill list ───────────────────────────────────────────────────
    if (!state.practiceSkillId) {
      const data = getPracticeSkillsFor(profession);
      const skills = data.skills || [];
      mount.innerHTML = `
        <div class="practice-editor">
          <div class="practice-editor-toolbar">
            <button type="button" class="dev-primary" data-pe-sync>Из карты</button>
            <button type="button" class="dev-secondary" data-pe-add-skill>+ Навык вручную</button>
          </div>
          <div class="practice-skills-list" data-pe-skills-list>
            ${skills.length ? skills.map((skill) => `
              <div class="practice-skill-row" data-skill-id="${escapeAttr(skill.id)}">
                <span class="practice-skill-label" data-pe-open="${escapeAttr(skill.id)}">${escapeHtml(skill.label)}</span>
                <span class="practice-skill-lang">${escapeHtml(LANG_LABELS[skill.language] || skill.language || '')}</span>
                <span class="practice-skill-count">${(skill.tasks || []).length} задач</span>
                <button type="button" class="dev-secondary practice-skill-edit-btn" data-pe-open="${escapeAttr(skill.id)}">Открыть</button>
                <button type="button" class="practice-skill-del-btn" data-pe-del-skill="${escapeAttr(skill.id)}">✕</button>
              </div>
            `).join('') : '<p class="practice-empty">Нет навыков. Нажми «Из карты» или добавь вручную.</p>'}
          </div>
        </div>
      `;

      mount.querySelector('[data-pe-sync]')?.addEventListener('click', () => {
        autoSyncSkillsFromRoadmap(profession);
        bindPracticeEditor();
      });

      mount.querySelector('[data-pe-add-skill]')?.addEventListener('click', () => {
        const label = prompt('Название навыка:');
        if (!label?.trim()) return;
        const current = getPracticeSkillsFor(profession);
        const defaultLang = detectPracticeLanguage(profession);
        current.skills = current.skills || [];
        current.skills.push({ id: `manual-${Date.now()}`, label: label.trim(), isManual: true, language: defaultLang, tasks: [] });
        savePracticeSkillsFor(profession, current);
        bindPracticeEditor();
      });

      mount.querySelectorAll('[data-pe-open]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.practiceSkillId = btn.dataset.peOpen;
          bindPracticeEditor();
        });
      });

      mount.querySelectorAll('[data-pe-del-skill]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (!confirm('Удалить навык и все его задачи?')) return;
          const current = getPracticeSkillsFor(profession);
          current.skills = (current.skills || []).filter((s) => s.id !== btn.dataset.peDelSkill);
          savePracticeSkillsFor(profession, current);
          bindPracticeEditor();
        });
      });
      return;
    }

    // ── render task list for selected skill ─────────────────────────────────
    const data = getPracticeSkillsFor(profession);
    const skill = (data.skills || []).find((s) => s.id === state.practiceSkillId);
    if (!skill) { state.practiceSkillId = null; bindPracticeEditor(); return; }

    const renderTaskList = () => {
      const tasks = skill.tasks || [];
      const taskRows = tasks.map((task, i) => `
        <div class="practice-task-card" data-task-index="${i}">
          <div class="practice-task-header">
            <span class="practice-task-level practice-task-level-${task.level}">${task.level}</span>
            <strong class="practice-task-title">${escapeHtml(task.title)}</strong>
            <span class="practice-task-langbadge">${escapeHtml(LANG_LABELS[task.language] || task.language || '')}</span>
            <button type="button" class="practice-task-del" data-pe-del-task="${i}">✕</button>
          </div>
          <div class="practice-task-body">
            <label>Заголовок<input type="text" data-task-field="title" data-task-idx="${i}" value="${escapeAttr(task.title || '')}"></label>
            <div class="practice-task-row-2col">
              <label>Уровень
                <select data-task-field="level" data-task-idx="${i}">
                  ${['easy','medium','hard'].map((l) => `<option value="${l}" ${task.level===l?'selected':''}>${l}</option>`).join('')}
                </select>
              </label>
              <label>Формат
                <select data-task-field="type" data-task-idx="${i}">
                  <option value="code" ${task.type==='code'?'selected':''}>Компилятор</option>
                  <option value="text" ${task.type==='text'?'selected':''}>Текст</option>
                </select>
              </label>
              <label>Язык
                <select data-task-field="language" data-task-idx="${i}">
                  ${ALL_LANGS.map((l) => `<option value="${l}" ${task.language===l?'selected':''}>${LANG_LABELS[l]||l}</option>`).join('')}
                </select>
              </label>
            </div>
            <label>Задание<textarea rows="3" data-task-field="prompt" data-task-idx="${i}">${escapeHtml(task.prompt || '')}</textarea></label>
            <label>Образцовый ответ<textarea rows="4" data-task-field="answer" data-task-idx="${i}">${escapeHtml(task.answer || '')}</textarea></label>
          </div>
        </div>
      `).join('');

      mount.innerHTML = `
        <div class="practice-editor">
          <div class="practice-editor-toolbar">
            <button type="button" class="dev-secondary" data-pe-back>← Назад к навыкам</button>
            <strong class="practice-skill-heading">${escapeHtml(skill.label)}</strong>
            <label class="practice-skill-lang-label">Язык навыка
              <select data-pe-skill-lang>
                ${ALL_LANGS.map((l) => `<option value="${l}" ${skill.language===l?'selected':''}>${LANG_LABELS[l]||l}</option>`).join('')}
              </select>
            </label>
            <button type="button" class="dev-primary" data-pe-add-task>+ Задача</button>
            <button type="button" class="dev-secondary" data-pe-ai-gen>✦ ИИ генерация</button>
            <button type="button" class="dev-primary" data-pe-save-tasks>Сохранить</button>
          </div>
          <div class="practice-tasks-list" data-pe-tasks-list>
            ${taskRows || '<p class="practice-empty">Нет задач. Добавь вручную или через ИИ.</p>'}
          </div>
        </div>
      `;

      mount.querySelector('[data-pe-back]')?.addEventListener('click', () => {
        state.practiceSkillId = null;
        bindPracticeEditor();
      });

      mount.querySelector('[data-pe-skill-lang]')?.addEventListener('change', (e) => {
        skill.language = e.target.value;
      });

      mount.querySelector('[data-pe-add-task]')?.addEventListener('click', () => {
        skill.tasks = skill.tasks || [];
        skill.tasks.push({ id: `task-${Date.now()}`, title: 'Новая задача', level: 'easy', type: skill.language === 'text' ? 'text' : 'code', language: skill.language || 'javascript', prompt: '', answer: '' });
        savePracticeSkillsFor(profession, data);
        renderTaskList();
      });

      mount.querySelectorAll('[data-pe-del-task]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.peDelTask);
          skill.tasks.splice(idx, 1);
          savePracticeSkillsFor(profession, data);
          renderTaskList();
        });
      });

      mount.querySelector('[data-pe-save-tasks]')?.addEventListener('click', () => {
        mount.querySelectorAll('[data-task-field]').forEach((input) => {
          const idx = Number(input.dataset.taskIdx);
          const field = input.dataset.taskField;
          if (skill.tasks[idx]) skill.tasks[idx][field] = input.value;
        });
        savePracticeSkillsFor(profession, data);
        renderTaskList();
      });

      mount.querySelector('[data-pe-ai-gen]')?.addEventListener('click', async () => {
        const btn = mount.querySelector('[data-pe-ai-gen]');
        btn.disabled = true;
        btn.textContent = '...';
        try {
          const resp = await fetch(apiUrl('/api/admin/practice/generate'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profession, skillLabel: skill.label, language: skill.language || 'javascript', count: 5 })
          });
          const result = await resp.json();
          if (Array.isArray(result.tasks) && result.tasks.length) {
            skill.tasks = result.tasks;
            savePracticeSkillsFor(profession, data);
            renderTaskList();
          }
        } catch {
          alert('Не удалось сгенерировать. Проверь AI-ключ в настройках.');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = '✦ ИИ генерация'; }
        }
      });
    };

    renderTaskList();
  };

  const GRADE_QUESTION_TYPES = {
    single: 'Один ответ',
    multi: 'Несколько ответов',
    compiler: 'Компилятор',
    detailed: 'Развёрнутый ответ'
  };

  const GRADE_DEMO_TEST = {
    questions: [
      { id: 'gq1', type: 'single', text: 'Что такое замыкание (closure) в JavaScript?', points: 1, options: ['Функция с доступом к переменным внешней области видимости', 'Метод массива', 'Способ объявить переменную', 'Тип данных'], correct: [0], language: 'javascript', starterCode: '', successCriteria: '' },
      { id: 'gq2', type: 'compiler', text: 'Напиши функцию sum(a, b), которая возвращает сумму двух чисел. Выведи результат sum(3, 7) через console.log.', points: 2, options: [], correct: [], language: 'javascript', starterCode: 'function sum(a, b) {\n  // твой код\n}\n\nconsole.log(sum(3, 7));', successCriteria: '10' },
      { id: 'gq3', type: 'single', text: 'Какой метод массива создаёт новый массив с результатами вызова функции для каждого элемента?', points: 1, options: ['filter', 'map', 'reduce', 'forEach'], correct: [1], language: 'javascript', starterCode: '', successCriteria: '' },
      { id: 'gq4', type: 'compiler', text: 'Напиши функцию, которая принимает массив чисел и возвращает только чётные. Выведи результат для [1,2,3,4,5,6].', points: 2, options: [], correct: [], language: 'javascript', starterCode: 'function getEven(arr) {\n  // твой код\n}\n\nconsole.log(getEven([1,2,3,4,5,6]));', successCriteria: '[2, 4, 6]' },
      { id: 'gq5', type: 'multi', text: 'Какие из этих методов изменяют исходный массив?', points: 2, options: ['push', 'map', 'splice', 'filter', 'sort'], correct: [0, 2, 4], language: 'javascript', starterCode: '', successCriteria: '' },
      { id: 'gq6', type: 'compiler', text: 'Создай промис, который выполняется через 0 мс и возвращает строку "done". Выведи результат через .then().', points: 2, options: [], correct: [], language: 'javascript', starterCode: 'const p = new Promise((resolve) => {\n  // твой код\n});\n\np.then(val => console.log(val));', successCriteria: 'done' },
      { id: 'gq7', type: 'single', text: 'Что возвращает typeof null?', points: 1, options: ['null', 'undefined', 'object', 'boolean'], correct: [2], language: 'javascript', starterCode: '', successCriteria: '' },
      { id: 'gq8', type: 'detailed', text: 'Объясни разницу между let, const и var. В каких случаях используешь каждое из них?', points: 3, options: [], correct: [], language: 'text', starterCode: '', successCriteria: '' },
      { id: 'gq9', type: 'compiler', text: 'Напиши функцию reverse(str), которая переворачивает строку. Выведи reverse("hello").', points: 2, options: [], correct: [], language: 'javascript', starterCode: 'function reverse(str) {\n  // твой код\n}\n\nconsole.log(reverse("hello"));', successCriteria: 'olleh' },
      { id: 'gq10', type: 'single', text: 'Что выведет: console.log(0.1 + 0.2 === 0.3)?', points: 1, options: ['true', 'false', 'NaN', 'undefined'], correct: [1], language: 'javascript', starterCode: '', successCriteria: '' }
    ]
  };

  const parseGradeData = (profession) => {
    const store = getLearningStore();
    const entry = store[profession] || {};
    try {
      const g = entry.grade;
      if (g && typeof g === 'object' && Array.isArray(g.questions)) return g;
      if (typeof g === 'string' && g.trim().startsWith('{')) {
        const parsed = JSON.parse(g);
        if (Array.isArray(parsed.questions)) return parsed;
      }
    } catch {}
    return { questions: [] };
  };

  const persistGradeData = (profession, gradeData) => {
    const store = getLearningStore();
    const entry = store[profession] || ensureProfessionData(profession);
    entry.grade = gradeData;
    store[profession] = entry;
    write(K.learningByItem, store);
    const ta = learningEditor.querySelector('[data-learning-grade]');
    if (ta) ta.value = JSON.stringify(gradeData);
  };

  const bindGradeEditor = () => {
    const mount = learningEditor.querySelector('[data-grade-editor-mount]');
    if (!mount) return;
    const profession = state.selectedEntry;
    if (!profession) { mount.innerHTML = '<p>Выбери профессию.</p>'; return; }

    let gradeData = parseGradeData(profession);
    const selected = new Set();

    const syncJsonPreview = () => {
      const ta = mount.querySelector('[data-ge-json-preview]');
      if (ta) ta.value = JSON.stringify(gradeData, null, 2);
      const hidden = learningEditor.querySelector('[data-learning-grade]');
      if (hidden) hidden.value = JSON.stringify(gradeData);
    };

    const renderOptionsList = (q, qi) => {
      const options = q.options || [];
      const correct = q.correct || [];
      const inputType = q.type === 'multi' ? 'checkbox' : 'radio';
      return `
        <div class="grade-options-editor">
          <div class="grade-options-header">
            <span class="grade-opt-hint">Отмечай правильные варианты слева</span>
            <button type="button" class="dev-secondary" data-ge-add-option="${qi}">+ Вариант</button>
          </div>
          ${options.map((opt, oi) => `
            <div class="grade-option-row">
              <input type="${inputType}" name="correct-${qi}" value="${oi}" ${correct.includes(oi) ? 'checked' : ''} data-ge-correct="${qi}" data-oi="${oi}">
              <input type="text" class="grade-opt-input" value="${escapeAttr(opt)}" data-ge-opt-text="${qi}" data-oi="${oi}" placeholder="Текст варианта">
              <button type="button" class="practice-skill-del-btn" data-ge-del-option="${qi}" data-oi="${oi}">✕</button>
            </div>
          `).join('')}
        </div>
      `;
    };

    const renderQuestionForm = (q, qi) => `
      <div class="grade-question-form">
        <div class="practice-task-row-2col">
          <label>Тип ответа
            <select data-qf-field="type" data-qf-idx="${qi}">
              ${Object.entries(GRADE_QUESTION_TYPES).map(([v, l]) => `<option value="${v}" ${q.type === v ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </label>
          <label>Баллы
            <input type="number" min="0" max="100" value="${q.points || 1}" data-qf-field="points" data-qf-idx="${qi}">
          </label>
          ${q.type === 'compiler' ? `<label>Язык
            <select data-qf-field="language" data-qf-idx="${qi}">
              ${['javascript', 'python', 'text'].map((l) => `<option value="${l}" ${q.language === l ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </label>` : ''}
        </div>
        <label>Текст вопроса
          <textarea rows="3" data-qf-field="text" data-qf-idx="${qi}">${escapeHtml(q.text || '')}</textarea>
        </label>
        ${(q.type === 'single' || q.type === 'multi') ? renderOptionsList(q, qi) : ''}
        ${q.type === 'compiler' ? `
          <label>Начальный код<textarea rows="4" style="font-family:monospace;font-size:12px" data-qf-field="starterCode" data-qf-idx="${qi}">${escapeHtml(q.starterCode || '')}</textarea></label>
          <label>Ожидаемый вывод / критерии<textarea rows="2" data-qf-field="successCriteria" data-qf-idx="${qi}">${escapeHtml(q.successCriteria || '')}</textarea></label>
        ` : ''}
        ${q.type === 'detailed' ? `
          <label>Критерии оценки<textarea rows="2" data-qf-field="successCriteria" data-qf-idx="${qi}">${escapeHtml(q.successCriteria || '')}</textarea></label>
        ` : ''}
        <div class="grade-form-actions">
          <button type="button" class="dev-primary" data-qf-apply="${qi}">Применить</button>
        </div>
      </div>
    `;

    const renderQuestionCard = (q, qi) => {
      const typeBadge = GRADE_QUESTION_TYPES[q.type] || q.type;
      const isSelected = selected.has(qi);
      return `
        <div class="grade-question-card${isSelected ? ' is-selected' : ''}" data-ge-card="${qi}">
          <div class="grade-question-header">
            <input type="checkbox" class="ge-q-checkbox" data-q-check="${qi}" ${isSelected ? 'checked' : ''}>
            <span class="grade-q-order">${qi + 1}.</span>
            <span class="grade-q-text-preview">${escapeHtml((q.text || 'Без текста').substring(0, 72))}</span>
            <span class="grade-q-type-badge grade-q-type-${q.type}">${escapeHtml(typeBadge)}</span>
            <span class="grade-q-pts-badge">${q.points || 1} б.</span>
            <div class="grade-q-controls">
              <button type="button" class="dev-secondary grade-q-move-btn" data-q-up="${qi}" ${qi === 0 ? 'disabled' : ''} title="Выше">↑</button>
              <button type="button" class="dev-secondary grade-q-move-btn" data-q-down="${qi}" ${qi === (gradeData.questions.length - 1) ? 'disabled' : ''} title="Ниже">↓</button>
              <button type="button" class="dev-secondary" data-q-expand="${qi}">Изменить</button>
              <button type="button" class="practice-skill-del-btn" data-q-delete="${qi}">✕</button>
            </div>
          </div>
          <div class="grade-question-body" data-q-body="${qi}" hidden>
            ${renderQuestionForm(q, qi)}
          </div>
        </div>
      `;
    };

    const render = () => {
      const questions = gradeData.questions || [];
      const allSelected = questions.length > 0 && selected.size === questions.length;
      const someSelected = selected.size > 0;
      const totalPts = questions.reduce((s, q) => s + (Number(q.points) || 1), 0);

      mount.innerHTML = `
        <div class="grade-editor">
          <div class="grade-editor-toolbar">
            <label class="grade-select-all-label" title="Выбрать все">
              <input type="checkbox" data-ge-select-all ${allSelected ? 'checked' : ''}> Все
            </label>
            ${someSelected ? `
              <button type="button" class="dev-secondary danger" data-ge-bulk-delete>Удалить (${selected.size})</button>
              <span class="grade-bulk-sep"></span>
              <label class="grade-inline-label">Баллы: <input type="number" min="0" max="100" value="1" style="width:56px" data-ge-bulk-pts>
                <button type="button" class="dev-secondary" data-ge-bulk-set-pts>Назначить</button></label>
              <label class="grade-inline-label">Тип:
                <select data-ge-bulk-type>${Object.entries(GRADE_QUESTION_TYPES).map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>
                <button type="button" class="dev-secondary" data-ge-bulk-set-type>Назначить</button></label>
            ` : ''}
            <div class="grade-editor-toolbar-right">
              <span class="dev-chip dev-chip-compact">${questions.length} вопр. · ${totalPts} б.</span>
              ${!questions.length ? `<button type="button" class="dev-secondary" data-ge-load-demo>Загрузить демо тест</button>` : ''}
              <button type="button" class="dev-primary" data-ge-add>+ Вопрос</button>
              <button type="button" class="dev-primary" data-ge-save>Сохранить</button>
            </div>
          </div>
          <div class="grade-questions-list" data-ge-list>
            ${questions.length
              ? questions.map((q, qi) => renderQuestionCard(q, qi)).join('')
              : '<p class="practice-empty">Нет вопросов. Добавь первый или загрузи демо тест.</p>'}
          </div>
          <section class="dev-roadmap-section" style="margin-top:16px">
            <div class="dev-roadmap-section-head"><h4>JSON preview</h4><span>Автообновляется</span></div>
            <textarea class="dev-roadmap-json-editor" rows="10" data-ge-json-preview readonly>${escapeHtml(JSON.stringify(gradeData, null, 2))}</textarea>
          </section>
        </div>
      `;
      bindListEvents();
    };

    const bindListEvents = () => {
      mount.querySelector('[data-ge-select-all]')?.addEventListener('change', (e) => {
        if (e.target.checked) (gradeData.questions || []).forEach((_, i) => selected.add(i));
        else selected.clear();
        render();
      });

      mount.querySelectorAll('[data-q-check]').forEach((cb) => {
        cb.addEventListener('change', (e) => {
          const i = Number(e.target.dataset.qCheck);
          if (e.target.checked) selected.add(i); else selected.delete(i);
          render();
        });
      });

      mount.querySelector('[data-ge-bulk-delete]')?.addEventListener('click', () => {
        if (!confirm(`Удалить ${selected.size} вопрос(а)?`)) return;
        gradeData.questions = (gradeData.questions || []).filter((_, i) => !selected.has(i));
        selected.clear();
        persistGradeData(profession, gradeData);
        render();
      });

      mount.querySelector('[data-ge-bulk-set-pts]')?.addEventListener('click', () => {
        const pts = Number(mount.querySelector('[data-ge-bulk-pts]')?.value) || 1;
        selected.forEach((i) => { if (gradeData.questions[i]) gradeData.questions[i].points = pts; });
        persistGradeData(profession, gradeData);
        render();
      });

      mount.querySelector('[data-ge-bulk-set-type]')?.addEventListener('click', () => {
        const type = mount.querySelector('[data-ge-bulk-type]')?.value;
        if (!type) return;
        selected.forEach((i) => { if (gradeData.questions[i]) gradeData.questions[i].type = type; });
        persistGradeData(profession, gradeData);
        render();
      });

      mount.querySelector('[data-ge-load-demo]')?.addEventListener('click', () => {
        gradeData = JSON.parse(JSON.stringify(GRADE_DEMO_TEST));
        persistGradeData(profession, gradeData);
        render();
      });

      mount.querySelector('[data-ge-add]')?.addEventListener('click', () => {
        gradeData.questions = gradeData.questions || [];
        gradeData.questions.push({ id: `q-${Date.now()}`, type: 'single', text: '', points: 1, options: [], correct: [], language: 'javascript', starterCode: '', successCriteria: '' });
        persistGradeData(profession, gradeData);
        render();
      });

      mount.querySelector('[data-ge-save]')?.addEventListener('click', () => {
        persistGradeData(profession, gradeData);
        syncJsonPreview();
        render();
      });

      mount.querySelectorAll('[data-q-up]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.qUp);
          if (i === 0) return;
          [gradeData.questions[i - 1], gradeData.questions[i]] = [gradeData.questions[i], gradeData.questions[i - 1]];
          persistGradeData(profession, gradeData);
          render();
        });
      });

      mount.querySelectorAll('[data-q-down]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.qDown);
          if (i >= (gradeData.questions.length - 1)) return;
          [gradeData.questions[i + 1], gradeData.questions[i]] = [gradeData.questions[i], gradeData.questions[i + 1]];
          persistGradeData(profession, gradeData);
          render();
        });
      });

      mount.querySelectorAll('[data-q-delete]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.qDelete);
          gradeData.questions.splice(i, 1);
          selected.delete(i);
          persistGradeData(profession, gradeData);
          render();
        });
      });

      mount.querySelectorAll('[data-q-expand]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.qExpand);
          const body = mount.querySelector(`[data-q-body="${i}"]`);
          if (!body) return;
          body.hidden = !body.hidden;
          btn.textContent = body.hidden ? 'Изменить' : 'Свернуть';
          if (!body.hidden) bindFormEvents(i);
        });
      });
    };

    const bindFormEvents = (qi) => {
      mount.querySelector(`[data-ge-add-option="${qi}"]`)?.addEventListener('click', () => {
        const q = gradeData.questions[qi];
        if (!q) return;
        q.options = q.options || [];
        q.options.push('Новый вариант');
        persistGradeData(profession, gradeData);
        render();
      });

      mount.querySelectorAll(`[data-ge-del-option="${qi}"]`).forEach((btn) => {
        btn.addEventListener('click', () => {
          const q = gradeData.questions[qi];
          const oi = Number(btn.dataset.oi);
          q.options.splice(oi, 1);
          q.correct = (q.correct || []).filter((c) => c !== oi).map((c) => (c > oi ? c - 1 : c));
          persistGradeData(profession, gradeData);
          render();
        });
      });

      mount.querySelector(`[data-qf-apply="${qi}"]`)?.addEventListener('click', () => {
        const q = gradeData.questions[qi];
        if (!q) return;
        mount.querySelectorAll(`[data-qf-idx="${qi}"]`).forEach((inp) => {
          const field = inp.dataset.qfField;
          q[field] = inp.type === 'number' ? Number(inp.value) : inp.value;
        });
        const optTexts = mount.querySelectorAll(`[data-ge-opt-text="${qi}"]`);
        if (optTexts.length) q.options = Array.from(optTexts).map((inp) => inp.value);
        const correctInputs = mount.querySelectorAll(`[data-ge-correct="${qi}"]`);
        if (correctInputs.length) q.correct = Array.from(correctInputs).filter((inp) => inp.checked).map((inp) => Number(inp.dataset.oi));
        persistGradeData(profession, gradeData);
        render();
      });
    };

    render();
  };

  const saveSgrData = (profession, data) => {
    const store = getLearningStore();
    const entry = store[profession] || ensureProfessionData(profession);
    entry.skillGap = data;
    store[profession] = entry;
    write(K.learningByItem, store);
  };

  const bindSkillGapEditor = () => {
    const mount = learningEditor.querySelector('[data-sgr-editor-mount]');
    if (!mount) return;
    const profession = state.selectedEntry;
    if (!profession) { mount.innerHTML = '<p>Выбери профессию.</p>'; return; }

    const store = getLearningStore();
    const entry = store[profession] || ensureProfessionData(profession);
    const sgrData = entry.skillGap || { skills: [] };
    const skills = sgrData.skills || [];

    const getDefReqs = (id) => SGR_DEFAULTS_ADMIN[id] || { intern: 20, junior: 40, middle: 65, senior: 85 };
    const getDefAvgs = (reqs) => Object.fromEntries(Object.entries(reqs).map(([g, v]) => [g, Math.round(v * (SGR_AVG_FACTORS_ADMIN[g] || 0.78))]));

    if (!state.sgrSkillId) {
      mount.innerHTML = `
        <div class="practice-editor">
          <div class="practice-editor-toolbar">
            <button type="button" class="dev-primary" data-sgr-sync>Из карты (Core/Main)</button>
            <button type="button" class="dev-secondary" data-sgr-add>+ Навык вручную</button>
          </div>
          <div class="practice-skills-list" data-sgr-list>
            ${skills.length ? skills.map((s) => `
              <div class="practice-skill-row">
                <span class="practice-skill-label">${escapeHtml(s.label)}</span>
                <button type="button" class="dev-secondary practice-skill-edit-btn" data-sgr-open="${escapeAttr(s.id)}">Открыть</button>
                <button type="button" class="practice-skill-del-btn" data-sgr-del="${escapeAttr(s.id)}">✕</button>
              </div>`).join('')
              : '<p class="practice-empty">Нет навыков. Нажми «Из карты» или добавь вручную.</p>'}
          </div>
        </div>`;

      mount.querySelector('[data-sgr-sync]')?.addEventListener('click', () => {
        const roadmap = normalizeRoadmap(entry);
        const existingIds = new Set(skills.map((s) => s.id));
        (roadmap.nodes || []).filter((n) => n.data?.status === 'Core' || n.data?.status === 'Main').forEach((node) => {
          if (existingIds.has(node.id)) return;
          const reqs = getDefReqs(node.id);
          skills.push({ id: node.id, label: node.data?.label || node.id, color: node.data?.color || '#888', requirements: { ...reqs }, averages: getDefAvgs(reqs) });
        });
        sgrData.skills = skills;
        saveSgrData(profession, sgrData);
        bindSkillGapEditor();
      });

      mount.querySelector('[data-sgr-add]')?.addEventListener('click', () => {
        const label = prompt('Название навыка:');
        if (!label?.trim()) return;
        const reqs = { intern: 20, junior: 40, middle: 65, senior: 85 };
        skills.push({ id: `custom-${Date.now()}`, label: label.trim(), color: '#888', requirements: { ...reqs }, averages: getDefAvgs(reqs) });
        sgrData.skills = skills;
        saveSgrData(profession, sgrData);
        bindSkillGapEditor();
      });

      mount.querySelectorAll('[data-sgr-open]').forEach((btn) => btn.addEventListener('click', () => { state.sgrSkillId = btn.dataset.sgrOpen; bindSkillGapEditor(); }));
      mount.querySelectorAll('[data-sgr-del]').forEach((btn) => btn.addEventListener('click', () => {
        if (!confirm('Удалить навык?')) return;
        sgrData.skills = skills.filter((s) => s.id !== btn.dataset.sgrDel);
        saveSgrData(profession, sgrData);
        bindSkillGapEditor();
      }));
      return;
    }

    const skill = skills.find((s) => s.id === state.sgrSkillId);
    if (!skill) { state.sgrSkillId = null; bindSkillGapEditor(); return; }

    const grades = ['intern', 'junior', 'middle', 'senior'];
    const gradeLabels = { intern: 'Стажёр', junior: 'Junior', middle: 'Middle', senior: 'Senior' };

    mount.innerHTML = `
      <div class="practice-editor">
        <div class="practice-editor-toolbar">
          <button type="button" class="dev-secondary" data-sgr-back>← Назад</button>
          <strong>${escapeHtml(skill.label)}</strong>
          <button type="button" class="dev-primary" data-sgr-skill-save>Сохранить</button>
        </div>
        <div class="sgr-admin-grid">
          <div></div>${grades.map((g) => `<strong class="sgr-admin-grade-head">${gradeLabels[g]}</strong>`).join('')}
          <span class="sgr-admin-row-label">Требования (%)</span>${grades.map((g) => `<input type="number" min="0" max="100" value="${skill.requirements[g] ?? 50}" data-sgr-req="${g}">`).join('')}
          <span class="sgr-admin-row-label">Среднее рынка (%)</span>${grades.map((g) => `<input type="number" min="0" max="100" value="${skill.averages[g] ?? 40}" data-sgr-avg="${g}">`).join('')}
        </div>
      </div>`;

    mount.querySelector('[data-sgr-back]')?.addEventListener('click', () => { state.sgrSkillId = null; bindSkillGapEditor(); });
    mount.querySelector('[data-sgr-skill-save]')?.addEventListener('click', () => {
      grades.forEach((g) => {
        const r = mount.querySelector(`[data-sgr-req="${g}"]`);
        const a = mount.querySelector(`[data-sgr-avg="${g}"]`);
        if (r) skill.requirements[g] = Number(r.value);
        if (a) skill.averages[g] = Number(a.value);
      });
      saveSgrData(profession, sgrData);
      state.sgrSkillId = null;
      bindSkillGapEditor();
    });
  };

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
      interview: 'Собеседование',
      'skill-gap': 'Skill Gap Radar'
    };

    const body = {
      roadmap: renderRoadmapEditor(data),
      practice: `<div data-practice-editor-mount></div>`,
      grade: `
        <textarea data-learning-grade hidden>${escapeHtml(typeof data.grade === 'object' ? JSON.stringify(data.grade) : (data.grade || ''))}</textarea>
        <div data-grade-editor-mount></div>
      `,
      interview: `
        <label>
          Редактор собеседования
          <textarea rows="16" data-learning-interview>${escapeHtml(data.interview || '')}</textarea>
        </label>
      `,
      'skill-gap': `<div data-sgr-editor-mount></div>`
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
      state.practiceSkillId = null;
      state.sgrSkillId = null;
      renderLearningEditor();
    });

    learningEditor.querySelectorAll('[data-learning-section]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedSection = button.dataset.learningSection;
        if (state.selectedSection !== 'roadmap') state.pendingConnection = null;
        if (state.selectedSection !== 'practice') state.practiceSkillId = null;
        if (state.selectedSection !== 'skill-gap') state.sgrSkillId = null;
        renderLearningEditor();
      });
    });

    if (state.selectedSection === 'roadmap') bindRoadmapEditor();
    if (state.selectedSection === 'practice') bindPracticeEditor();
    if (state.selectedSection === 'grade') bindGradeEditor();
    if (state.selectedSection === 'skill-gap') bindSkillGapEditor();

    learningEditor.querySelector('[data-learning-save]')?.addEventListener('click', async () => {
      const store = getLearningStore();
      const current = { ...(store[state.selectedEntry] || ensureProfessionData(state.selectedEntry)) };
      current.roadmap = normalizeRoadmap(current);
      const gradeRaw = learningEditor.querySelector('[data-learning-grade]')?.value;
      if (gradeRaw) {
        try { current.grade = JSON.parse(gradeRaw); } catch { current.grade = gradeRaw; }
      }
      current.interview = learningEditor.querySelector('[data-learning-interview]')?.value ?? current.interview;
      const freshStore = getLearningStore();
      if (freshStore[state.selectedEntry]?.skillGap) current.skillGap = freshStore[state.selectedEntry].skillGap;
      store[state.selectedEntry] = current;
      write(K.learningByItem, store);
      await saveRoadmapToBackend(state.selectedEntry, current);
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

  tabs.forEach((tab) => tab.addEventListener('click', () => {
    showPanel(tab.dataset.adminTab);
    if (tab.dataset.adminTab === 'ideas') renderIdeas();
  }));
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

  const renderIdeas = () => {
    const list = document.querySelector('[data-ideas-list]');
    if (!list) return;
    const ideas = (() => {
      try {
        const raw = localStorage.getItem('roadstar-user-ideas');
        return raw ? JSON.parse(raw) : [];
      } catch { return []; }
    })();
    if (!ideas.length) {
      list.innerHTML = '<div class="dev-user-card">Пока нет идей от пользователей.</div>';
      return;
    }
    list.innerHTML = ideas.map((idea, i) => `
      <div class="dev-user-card compact-user-card" style="display:grid;gap:4px;">
        <span style="font-size:11px;opacity:0.55;">${escapeHtml(idea.date || '')}</span>
        <strong>${escapeHtml(idea.text || '')}</strong>
        <div style="margin-top:4px;">
          <button type="button" class="dev-primary" style="font-size:11px;padding:6px 12px;" data-delete-idea="${i}">Удалить</button>
        </div>
      </div>
    `).join('');
    list.querySelectorAll('[data-delete-idea]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.deleteIdea);
        ideas.splice(idx, 1);
        localStorage.setItem('roadstar-user-ideas', JSON.stringify(ideas));
        renderIdeas();
      });
    });
  };

  document.querySelector('[data-clear-ideas]')?.addEventListener('click', () => {
    localStorage.removeItem('roadstar-user-ideas');
    renderIdeas();
  });

  renderHome();
  renderLearning();
  renderPayment();
  renderProfiles();
  renderIdeas();
  showPanel(state.currentTab);
});
