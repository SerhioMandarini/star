document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'home') return;

  const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
  const apiUrl = (path) => `${API_BASE}${path}`;

  const readJson = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  // --- Hero typing animation ---

  const siteContent = readJson('roadstar-site-content', {});
  const heroTitle = siteContent.heroTitle || 'Структурируй\nПрактикуйся\nРасти';
  const fullLines = heroTitle.split('\n').map((s) => s.trim()).filter(Boolean);

  const heroH1 = document.querySelector('.hero-copy h1');
  if (heroH1) {
    heroH1.setAttribute('data-hero-typing', '');
    heroH1.innerHTML = fullLines
      .map((_, i) => `<span data-hero-line="${i}"></span>`)
      .join('<br>');
  }

  const heroLines = Array.from(document.querySelectorAll('[data-hero-line]'));
  const totalLetters = fullLines.reduce((sum, line) => sum + line.length, 0);

  const getTypingLineIndex = (count) => {
    let rem = count;
    for (let i = 0; i < fullLines.length; i++) {
      if (rem <= fullLines[i].length) return i;
      rem -= fullLines[i].length;
    }
    return fullLines.length - 1;
  };

  const renderHeroLetters = (limit) => {
    let counter = 0;
    const curLine = getTypingLineIndex(Math.min(limit, totalLetters));
    heroLines.forEach((el, i) => {
      let text = '';
      for (const ch of fullLines[i]) {
        counter++;
        if (counter <= limit) text += ch;
      }
      el.textContent = text;
      el.classList.toggle('is-typing', i === curLine && limit < totalLetters);
    });
  };

  renderHeroLetters(0);
  let typed = 0;
  const timer = setInterval(() => {
    typed++;
    renderHeroLetters(typed);
    if (typed >= totalLetters) {
      clearInterval(timer);
      heroLines.forEach((el) => el.classList.remove('is-typing'));
      if (heroH1) heroH1.classList.add('is-finished');
    }
  }, 110);

  // --- Progress panel ---

  const currentUser = readJson('roadstar-local-session', null);
  const currentUserKey = currentUser?.email || 'guest';
  const roadmapProgress = readJson('roadstar-roadmap-progress-by-user', {});
  const practiceProgress = readJson('roadstar-practice-progress-by-user', {});
  const learningStore = readJson('roadstar-learning-by-item', {});

  const getRoadmapNodeTotal = (profession) => {
    const total = learningStore?.[profession]?.roadmap?.nodes?.length;
    return Math.max(1, Number(total || 0) || 4);
  };

  const getCompletedRoadmapNodes = (value) => {
    const completed = value?.completed && typeof value.completed === 'object' ? value.completed : {};
    const nodeStatus = value?.nodeStatus && typeof value.nodeStatus === 'object' ? value.nodeStatus : {};
    return new Set([
      ...Object.keys(completed).filter((id) => completed[id]),
      ...Object.keys(nodeStatus).filter((id) => nodeStatus[id] === 'done')
    ]).size;
  };

  const getPracticePlanLength = (profession) => {
    const name = String(profession || '').toLowerCase();
    if (name.includes('frontend') || name.includes('backend') || name.includes('devops')) return 3;
    return 2;
  };

  const getCompletedPracticeSteps = (value) => {
    if (Array.isArray(value?.completedSteps) && value.completedSteps.length) return value.completedSteps.length;
    if (Array.isArray(value?.history) && value.history.length) {
      return new Set(value.history.filter((e) => e?.passed && e?.stepId).map((e) => e.stepId)).size;
    }
    return Number(value?.solved || 0);
  };

  const professionMap = new Map();
  const currentUserRoadmaps = Object.entries(roadmapProgress)
    .filter(([key]) => key.startsWith(`${currentUserKey}::`));
  const roadmapEntries = currentUserRoadmaps.length ? currentUserRoadmaps : Object.entries(roadmapProgress);

  roadmapEntries
    .forEach(([key, value]) => {
      const profession = key.split('::')[1] || 'Профессия';
      const totalNodes = Math.max(1, getRoadmapNodeTotal(profession));
      const completedNodes = getCompletedRoadmapNodes(value);
      const current = professionMap.get(profession) || { profession, roadmap: 0, practice: 0 };
      current.roadmap = Math.max(current.roadmap, Math.round((Math.min(completedNodes, totalNodes) / totalNodes) * 100));
      professionMap.set(profession, current);
    });

  const currentUserPractice = Object.entries(practiceProgress)
    .filter(([key]) => key.startsWith(`${currentUserKey}::`));
  const practiceEntries = currentUserPractice.length ? currentUserPractice : Object.entries(practiceProgress);

  practiceEntries
    .forEach(([key, value]) => {
      const profession = key.split('::')[1] || 'Профессия';
      const totalSteps = Math.max(1, Number(value?.planLength || 0) || getPracticePlanLength(profession));
      const completedSteps = Math.min(totalSteps, getCompletedPracticeSteps(value));
      const current = professionMap.get(profession) || { profession, roadmap: 0, practice: 0 };
      current.practice = Math.round((completedSteps / totalSteps) * 100);
      professionMap.set(profession, current);
    });

  const topProfessions = Array.from(professionMap.values())
    .map((e) => ({ ...e, total: e.roadmap }))
    .filter((e) => e.total > 0 || e.roadmap > 0 || e.practice > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const progressPanel = document.querySelector('[data-home-progress-panel]');
  if (progressPanel && topProfessions.length > 0) {
    progressPanel.hidden = false;
    progressPanel.innerHTML = topProfessions.map((entry) => `
      <article class="home-progress-card">
        <div class="home-progress-card-head">
          <strong>${entry.profession}</strong>
          <span>${entry.total}%</span>
        </div>
        <div class="home-progress-card-bar"><i style="width:${entry.total}%"></i></div>
      </article>
    `).join('');
  }

  // --- Scroll reveal ---

  const revealTargets = [
    ...document.querySelectorAll('.plain-section'),
    ...document.querySelectorAll('.updates-section'),
    ...document.querySelectorAll('.roadmap-entry'),
    ...document.querySelectorAll('.split-title')
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  revealTargets.forEach((t) => observer.observe(t));

  // --- OAuth unavailable ---

  const bindUnavailableOauth = () => {
    document.querySelectorAll('[data-oauth-button]').forEach((button) => {
      if (button.dataset.oauthBound === 'true') return;
      button.dataset.oauthBound = 'true';
      button.classList.add('oauth-unavailable');
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const status = document.querySelector('[data-auth-status]');
        if (!status) return;
        status.textContent = 'Пока нет, скоро будет...';
        clearTimeout(window.__roadstarSoonTimer);
        window.__roadstarSoonTimer = setTimeout(() => { status.textContent = ''; }, 2200);
      });
    });
  };

  fetch(apiUrl('/api/auth/providers'))
    .then((r) => r.json())
    .then((data) => {
      document.querySelectorAll('[data-oauth-button]').forEach((button) => {
        if (data.providers?.[button.dataset.oauthButton]) return;
        if (button.dataset.oauthBound === 'true') return;
        button.dataset.oauthBound = 'true';
        button.classList.add('oauth-unavailable');
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const status = document.querySelector('[data-auth-status]');
          if (!status) return;
          status.textContent = 'Пока нет, скоро будет...';
          clearTimeout(window.__roadstarSoonTimer);
          window.__roadstarSoonTimer = setTimeout(() => { status.textContent = ''; }, 2200);
        });
      });
    })
    .catch(bindUnavailableOauth);
});
