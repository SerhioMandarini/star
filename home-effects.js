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

  const currentUser = readJson('roadstar-local-session', null);
  const currentUserKey = currentUser?.email || 'guest';
  const roadmapProgress = readJson('roadstar-roadmap-progress-by-user', {});
  const practiceProgress = readJson('roadstar-practice-progress-by-user', {});
  const learningStore = readJson('roadstar-learning-by-item', {});

  const fallbackRoadmapSize = 3;

  const getRoadmapNodeTotal = (profession) => {
    const total = learningStore?.[profession]?.roadmap?.nodes?.length;
    return Number(total || fallbackRoadmapSize);
  };

  const getPracticePlanLength = (profession) => {
    const name = String(profession || '').toLowerCase();
    if (name.includes('frontend')) return 3;
    if (name.includes('backend') || name.includes('devops')) return 3;
    return 2;
  };

  const getCompletedPracticeSteps = (value) => {
    if (Array.isArray(value?.completedSteps) && value.completedSteps.length) {
      return value.completedSteps.length;
    }
    if (Array.isArray(value?.history) && value.history.length) {
      return new Set(
        value.history
          .filter((entry) => entry?.passed && entry?.stepId)
          .map((entry) => entry.stepId)
      ).size;
    }
    return Number(value?.solved || 0);
  };

  const professionMap = new Map();

  Object.entries(roadmapProgress)
    .filter(([key]) => key.startsWith(`${currentUserKey}::`))
    .forEach(([key, value]) => {
      const profession = key.split('::')[1] || 'Профессия';
      const totalNodes = Math.max(1, getRoadmapNodeTotal(profession));
      const completedNodes = Object.keys(value?.completed || {}).filter((id) => value.completed[id]).length;
      const current = professionMap.get(profession) || { profession, roadmap: 0, practice: 0 };
      current.roadmap = Math.round((Math.min(completedNodes, totalNodes) / totalNodes) * 100);
      professionMap.set(profession, current);
    });

  Object.entries(practiceProgress)
    .filter(([key]) => key.startsWith(`${currentUserKey}::`))
    .forEach(([key, value]) => {
      const profession = key.split('::')[1] || 'Профессия';
      const totalSteps = Math.max(1, Number(value?.planLength || 0) || getPracticePlanLength(profession));
      const completedSteps = Math.min(totalSteps, getCompletedPracticeSteps(value));
      const current = professionMap.get(profession) || { profession, roadmap: 0, practice: 0 };
      current.practice = Math.round((completedSteps / totalSteps) * 100);
      professionMap.set(profession, current);
    });

  const topProfessions = Array.from(professionMap.values())
    .map((entry) => ({
      ...entry,
      total: Math.round((entry.roadmap * 0.6) + (entry.practice * 0.4))
    }))
    .filter((entry) => entry.total > 0 || entry.roadmap > 0 || entry.practice > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const totalPercent = topProfessions[0]?.total || 0;

  const heroLines = Array.from(document.querySelectorAll('[data-hero-line]'));
  const fullLines = ['Структурируй', 'Практикуйся', 'Расти'];
  const totalLetters = fullLines.reduce((sum, line) => sum + line.length, 0);
  const visibleLetters = totalPercent > 0
    ? Math.max(1, Math.round((totalPercent / 100) * totalLetters))
    : 1;

  const renderHeroLetters = (limit) => {
    let counter = 0;
    heroLines.forEach((line, index) => {
      const source = fullLines[index];
      let rendered = '';
      for (const char of source) {
        counter += 1;
        if (counter <= limit) rendered += char;
      }
      line.textContent = rendered;
    });
  };

  renderHeroLetters(0);
  let typedLetters = 0;
  const typingTimer = window.setInterval(() => {
    typedLetters += 1;
    renderHeroLetters(typedLetters);
    if (typedLetters >= visibleLetters) {
      window.clearInterval(typingTimer);
    }
  }, 42);

  const heroTyping = document.querySelector('[data-hero-typing]');
  if (heroTyping) {
    window.setTimeout(() => {
      heroTyping.classList.toggle('is-finished', visibleLetters >= totalLetters);
    }, Math.max(visibleLetters, 1) * 42);
  }

  const progressPanel = document.querySelector('[data-home-progress-panel]');
  if (progressPanel) {
    progressPanel.hidden = false;
    progressPanel.innerHTML = topProfessions.length
      ? topProfessions.map((entry) => `
        <article class="home-progress-card">
          <div class="home-progress-card-head">
            <strong>${entry.profession}</strong>
            <span>${entry.total}%</span>
          </div>
          <div class="home-progress-card-bar"><i style="width:${entry.total}%"></i></div>
        </article>
      `).join('')
      : `
        <article class="home-progress-card">
          <div class="home-progress-card-head">
            <strong>Прогресс ещё не начат</strong>
            <span>0%</span>
          </div>
          <div class="home-progress-card-bar"><i style="width:0%"></i></div>
        </article>
      `;
  }

  const targets = [
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

  targets.forEach((target) => observer.observe(target));

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
        window.__roadstarSoonTimer = setTimeout(() => {
          status.textContent = '';
        }, 2200);
      });
    });
  };

  fetch(apiUrl('/api/auth/providers'))
    .then((response) => response.json())
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
          window.__roadstarSoonTimer = setTimeout(() => {
            status.textContent = '';
          }, 2200);
        });
      });
    })
    .catch(bindUnavailableOauth);
});
