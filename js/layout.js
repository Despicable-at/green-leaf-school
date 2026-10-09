import { NAV_ITEMS, SCHOOL } from './config.js';

const logo = '<img src="assets/logo.svg" alt="" width="44" height="44">';
const icon = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C9 3 4 8 4 15c0 2.3.6 4.4 1.8 6.2L4 29l8-1.8c1.3.5 2.6.8 4 .8 7 0 12-5 12-12S23 3 16 3Zm0 22.5c-1.3 0-2.6-.3-3.7-.8l-.5-.2-4.4 1 1-4.3-.3-.5A9 9 0 1 1 16 25.5Zm5-6.8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-2-.9-3.4-1.7-4.8-3.9-.4-.7.4-.7 1-2 .1-.2 0-.5 0-.6l-.9-2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.5-.3.3-1.2 1.2-1.2 2.8 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.7 5.9 5.1 2.2.9 3 .9 4.1.8.7-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"/></svg>';

function makeHeader(current) {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.id = 'site-header';
  header.innerHTML = `
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="Green Leaf School home">${logo}<span class="brand-name">Green Leaf<span class="brand-tag">School · Atimatim</span></span></a>
      <button class="menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="primary-navigation"><span></span><span></span><span></span></button>
      <nav class="main-nav" id="primary-navigation" aria-label="Primary navigation">
        ${NAV_ITEMS.map((item) => `<a href="${item.href}"${item.href === current ? ' aria-current="page"' : ''}>${item.label}</a>`).join('')}
        <a class="mobile-nav-cta" href="admissions.html">Apply for admission</a>
      </nav>
      <a class="button gold header-cta" href="admissions.html">Apply Now <span aria-hidden="true">↗</span></a>
    </div>`;
  const toggle = header.querySelector('.menu-toggle');
  const nav = header.querySelector('.main-nav');
  let previousFocus;
  const focusables = () => [...nav.querySelectorAll('a[href]')].filter((item) => item.getClientRects().length);
  function closeMenu(restoreFocus = false) {
    nav.dataset.open = 'false';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
    nav.dataset.open = String(opening);
    if (opening) {
      document.body.classList.add('menu-open');
      previousFocus = document.activeElement;
      focusables()[0]?.focus();
    } else if (previousFocus) toggle.focus();
  });
  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu(true);
    if (event.key !== 'Tab' || nav.dataset.open !== 'true') return;
    const items = focusables();
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('click', (event) => {
    if (nav.dataset.open === 'true' && !header.contains(event.target)) closeMenu();
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  return header;
}

function makeFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.id = 'site-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div><a class="brand footer-brand" href="index.html" aria-label="Green Leaf School home">${logo}<span class="brand-name">Green Leaf<span class="brand-tag">School · Atimatim</span></span></a><p class="footer-copy">Child-centered learning in a conducive environment, with no school fees.</p><span class="footer-admission">Admission in progress</span></div>
        <div><h2 class="footer-title">Explore</h2><nav class="footer-links" aria-label="Footer navigation">${NAV_ITEMS.map((item) => `<a href="${item.href}">${item.label}</a>`).join('')}</nav></div>
        <div class="footer-contact"><h2 class="footer-title">Say hello</h2><span>${SCHOOL.place}</span><a href="${SCHOOL.telOne}">${SCHOOL.phoneOne}</a><a href="${SCHOOL.telTwo}">${SCHOOL.phoneTwo}</a><a href="${SCHOOL.whatsapp}?text=${encodeURIComponent('Hello Green Leaf School, I would like to enquire.')}" target="_blank" rel="noopener noreferrer">WhatsApp the school</a><a href="mailto:${SCHOOL.email}">${SCHOOL.email}</a></div>
        <div><h2 class="footer-title">Find our location</h2></div>
      </div>
      <div class="footer-bottom"><span>© <span data-year></span> Green Leaf School · Tuition-free education</span><span>Atimatim · Edwenase · Ghana</span></div>
    </div>`;
  footer.querySelector('.footer-contact').id = 'contact';
  const map = document.createElement('iframe');
  map.className = 'footer-map';
  map.src = SCHOOL.mapSrc;
  map.title = 'Green Leaf School location map';
  map.width = '600';
  map.height = '450';
  map.loading = 'lazy';
  map.referrerPolicy = 'strict-origin-when-cross-origin';
  map.allowFullscreen = true;
  footer.querySelector('.footer-grid > div:last-child').append(map);
  const directions = document.createElement('a');
  directions.className = 'map-link';
  directions.href = 'https://www.google.com/maps/search/?api=1&query=Green+Leaf+School%2C+Atimatim%2C+Edwenase';
  directions.target = '_blank';
  directions.rel = 'noopener noreferrer';
  directions.textContent = 'Get directions ↗';
  footer.querySelector('.footer-grid > div:last-child').append(directions);
  footer.querySelector('[data-year]').textContent = new Date().getFullYear();
  return footer;
}

export function installMotion() {
  document.body.classList.add('page-enter');
  const header = document.querySelector('#site-header');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-label', 'Page reading progress');
  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', '100');
  progress.setAttribute('aria-valuenow', '0');
  const progressBar = document.createElement('span');
  progress.append(progressBar);
  document.body.prepend(progress);

  const updateScrollState = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? Math.round((window.scrollY / maxScroll) * 100) : 0;
    progress.setAttribute('aria-valuenow', String(percent));
    progress.dataset.level = String(Math.min(4, Math.floor(percent / 25)));
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState);
  updateScrollState();

  const revealTargets = document.querySelectorAll('main .section-heading, main .path-card, main .offer-card, main .level-card, main .value-card, main .timeline-step, main .gallery-item, main .staff-card');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((target) => {
      target.classList.add('reveal');
      observer.observe(target);
    });
  }

  document.querySelectorAll('[data-count-up]').forEach((element) => {
    const target = Number(element.dataset.countUp);
    if (!Number.isFinite(target)) return;
    const animate = () => {
      const start = performance.now();
      const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500;
      const tick = (now) => {
        const progress = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
        element.textContent = String(Math.round(target * progress));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animate();
          counterObserver.disconnect();
        }
      });
      counterObserver.observe(element);
    } else animate();
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.endsWith('.html') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    document.body.classList.add('page-leaving');
    window.setTimeout(() => { window.location.href = url.href; }, 150);
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.button');
    if (!button || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    button.classList.remove('ripple-on');
    requestAnimationFrame(() => button.classList.add('ripple-on'));
    window.setTimeout(() => button.classList.remove('ripple-on'), 450);
  });
}

function installSchoolSchema() {
  if (document.querySelector('#school-schema')) return;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: SCHOOL.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Atimatim, Edwenase',
      addressRegion: 'Ashanti Region',
      addressCountry: 'GH'
    },
    telephone: ['+233540863834', '+233557474117'],
    email: SCHOOL.email
  };
  const script = document.createElement('script');
  script.id = 'school-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.append(script);
}

export function mountLayout() {
  document.querySelectorAll('#site-header').forEach((slot) => slot.replaceWith(makeHeader(document.body.dataset.page)));
  document.querySelectorAll('#site-footer').forEach((slot) => slot.replaceWith(makeFooter()));
  document.querySelectorAll('[data-admission-strip]').forEach((slot) => {
    slot.className = 'admission-strip';
    slot.innerHTML = '<span>Admission in progress</span><span aria-hidden="true">·</span><a href="admissions.html">Tuition free — enquire today ↗</a>';
  });
  const whatsapp = document.createElement('a');
  whatsapp.className = 'whatsapp-float';
  whatsapp.href = `${SCHOOL.whatsapp}?text=${encodeURIComponent('Hello Green Leaf School, I would like to enquire.')}`;
  whatsapp.target = '_blank';
  whatsapp.rel = 'noopener noreferrer';
  whatsapp.setAttribute('aria-label', 'Chat with Green Leaf School on WhatsApp');
  whatsapp.innerHTML = icon;
  document.body.append(whatsapp);
  installSchoolSchema();
}
