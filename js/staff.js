import { STAFF } from './data/staff-data.js';

const grid = document.querySelector('[data-staff-grid]');
const search = document.querySelector('[data-staff-search]');
const filters = document.querySelector('[data-staff-filters]');
const modal = document.querySelector('[data-bio-modal]');
const categories = ['All', 'Leadership', 'Creche', 'Nursery', 'Primary', 'JHS', 'Administration'];
let chosen = 'All';
let query = '';
let lastFocus = null;
function drawFilters() {
  filters.replaceChildren();
  categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip';
    button.textContent = category;
    button.setAttribute('aria-pressed', String(chosen === category));
    button.addEventListener('click', () => { chosen = category; drawFilters(); drawCards(); });
    filters.append(button);
  });
}
function drawCards() {
  grid.replaceChildren();
  const matching = STAFF.filter((person) => (chosen === 'All' || person.department === chosen) && `${person.name} ${person.role} ${person.department}`.toLowerCase().includes(query.toLowerCase()));
  if (!matching.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No profiles match that search. Try another name or department.';
    grid.append(empty);
    return;
  }
  matching.forEach((person) => {
    const card = document.createElement('article');
    card.className = 'staff-card';
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.setAttribute('aria-hidden', 'true');
    if (person.photo) {
      const photo = document.createElement('img');
      photo.src = person.photo;
      photo.alt = '';
      photo.loading = 'lazy';
      avatar.append(photo);
    } else {
      avatar.textContent = person.department.slice(0, 2).toUpperCase();
    }
    const name = document.createElement('h3');
    name.textContent = person.name;
    const role = document.createElement('p');
    role.className = 'role';
    role.textContent = `${person.role} · ${person.department}`;
    const placeholder = document.createElement('span');
    placeholder.className = 'placeholder-label';
    placeholder.textContent = 'Placeholder profile';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'View profile →';
    button.addEventListener('click', () => openProfile(person, button));
    card.append(avatar, name, role, placeholder, button);
    card.classList.add('reveal');
    grid.append(card);
    requestAnimationFrame(() => card.classList.add('reveal-visible'));
  });
}
function openProfile(person, trigger) {
  lastFocus = trigger;
  modal.querySelector('[data-modal-initials]').textContent = person.department.slice(0, 2).toUpperCase();
  modal.querySelector('[data-modal-name]').textContent = person.name;
  modal.querySelector('[data-modal-role]').textContent = `${person.role} · ${person.department}`;
  modal.querySelector('[data-modal-bio]').textContent = person.bio;
  modal.querySelector('[data-modal-qualifications]').textContent = person.qualifications;
  const email = modal.querySelector('[data-modal-email]');
  email.replaceChildren();
  if (person.email) {
    const link = document.createElement('a');
    link.href = `mailto:${person.email}`;
    link.textContent = person.email;
    email.append(link);
  }
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modal.querySelector('.bio-close').focus();
}
function closeProfile() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  lastFocus?.focus();
}
search.addEventListener('input', () => { query = search.value; drawCards(); });
modal.querySelector('.bio-close').addEventListener('click', closeProfile);
modal.addEventListener('click', (event) => { if (event.target === modal) closeProfile(); });
modal.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeProfile();
  if (event.key === 'Tab') {
    const focusables = [...modal.querySelectorAll('button, a[href]')].filter((item) => item.getClientRects().length);
    const first = focusables[0], last = focusables.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
drawFilters();
drawCards();
