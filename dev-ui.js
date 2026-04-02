document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'dev') return;

  const tabs = Array.from(document.querySelectorAll('[data-admin-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-admin-panel]'));
  if (!tabs.length || !panels.length) return;

  const showPanel = (name) => {
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

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => showPanel(tab.dataset.adminTab));
  });

  const current = tabs.find((tab) => tab.classList.contains('is-active'))?.dataset.adminTab || tabs[0].dataset.adminTab;
  showPanel(current);
});
