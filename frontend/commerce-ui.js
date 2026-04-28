document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  const PURCHASES_KEY = 'roadstar-purchases';
  const USERS_KEY = 'roadstar-local-users';
  const SESSION_KEY = 'roadstar-local-session';

  const read = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const purchases = read(PURCHASES_KEY, []);
  const users = read(USERS_KEY, []);
  const session = read(SESSION_KEY, null);
  const activePlusCount = users.filter((user) => user.plus === 'on').length;

  if (page === 'payment') {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const period = params.get('period');
    const amount = params.get('amount');
    const selection = document.querySelector('[data-payment-selection]');
    const selectionDescription = document.querySelector('[data-payment-selection-description]');
    const purchasesCount = document.querySelector('[data-payment-purchases-count]');
    const confirmButton = document.querySelector('[data-payment-confirm]');

    if (purchasesCount) {
      purchasesCount.textContent = `${purchases.length} приобретений`;
    }

    if (selection && selectionDescription) {
      if (type === 'subscription' && period) {
        selection.textContent = `Подписка на ${period} мес.`;
        selectionDescription.textContent = 'После подтверждения покупка попадёт в тестовую статистику, а пользователю включится Plus.';
      } else if (type === 'tokens' && amount) {
        selection.textContent = `Пакет ${amount} токенов`;
        selectionDescription.textContent = 'После подтверждения токены добавятся текущему пользователю в локальной версии.';
      }
    }

    confirmButton?.addEventListener('click', () => {
      const record = {
        id: `purchase-${Date.now()}`,
        type: type || 'unknown',
        period: period || null,
        amount: amount ? Number(amount) : null,
        userEmail: session?.email || null,
        createdAt: new Date().toISOString()
      };

      const nextPurchases = [...purchases, record];
      write(PURCHASES_KEY, nextPurchases);

      if (session?.email) {
        const nextUsers = users.map((user) => {
          if (user.email !== session.email) return user;
          if (type === 'subscription') {
            return { ...user, plus: 'on' };
          }
          if (type === 'tokens') {
            return { ...user, tokens: Number(user.tokens || 0) + Number(amount || 0) };
          }
          return user;
        });
        write(USERS_KEY, nextUsers);
        const updatedSession = nextUsers.find((user) => user.email === session.email);
        if (updatedSession) {
          write(SESSION_KEY, {
            id: updatedSession.id,
            email: updatedSession.email,
            name: updatedSession.name,
            created_at: updatedSession.created_at,
            created_date: updatedSession.created_date,
            provider: updatedSession.provider,
            provider_id: updatedSession.provider_id,
            plus: updatedSession.plus,
            tokens: updatedSession.tokens
          });
        }
      }

      window.location.reload();
    });
  }

  if (page === 'dev') {
    const purchasesAdmin = document.querySelector('[data-payment-purchases-admin]');
    const activePlusAdmin = document.querySelector('[data-profile-plus-active-count]');

    if (purchasesAdmin) {
      purchasesAdmin.textContent = `Приобретений: ${purchases.length}`;
    }

    if (activePlusAdmin) {
      activePlusAdmin.textContent = `Активных Plus: ${activePlusCount}`;
    }
  }
});
