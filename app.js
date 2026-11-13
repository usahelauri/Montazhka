const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuToggle?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const navLinks = [...document.querySelectorAll('.main-nav a')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  const activeEntry = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!activeEntry) return;
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${activeEntry.target.id}`));
}, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.25, 0.6] });

sections.forEach((section) => sectionObserver.observe(section));

const routeButton = document.getElementById('route-button');
const routeStatus = document.getElementById('route-status');
const routeMap = document.getElementById('route-map');
const destination = '56.8373,60.6222';

routeButton?.addEventListener('click', () => {
  if (!navigator.geolocation) {
    routeStatus.textContent = 'Геолокация не поддерживается. Откройте маршрут в Яндекс Картах.';
    window.open(`https://yandex.ru/maps/?rtext=~${destination}&rtt=auto`, '_blank', 'noopener');
    return;
  }

  routeButton.disabled = true;
  routeButton.firstChild.textContent = 'Определяем местоположение ';
  routeStatus.textContent = 'Разрешите браузеру использовать вашу геопозицию.';

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const start = `${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`;
    routeMap.src = `https://yandex.ru/map-widget/v1/?mode=routes&rtext=${encodeURIComponent(start)}~${encodeURIComponent(destination)}&rtt=auto`;
    routeStatus.textContent = 'Маршрут и актуальное время в пути показаны на карте.';
    routeButton.innerHTML = 'Маршрут рассчитан <span>✓</span>';
    routeButton.disabled = false;
  }, () => {
    routeStatus.textContent = 'Не удалось получить геопозицию. Нажмите «Открыть маршрут в Яндексе» под картой.';
    routeButton.innerHTML = 'Попробовать ещё раз <span>→</span>';
    routeButton.disabled = false;
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
});
