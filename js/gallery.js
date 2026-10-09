import { GALLERY_ITEMS } from './data/gallery-data.js';

const grid = document.querySelector('[data-gallery-grid]');
const filterBar = document.querySelector('[data-gallery-filters]');
const lightbox = document.querySelector('[data-lightbox]');
const dialog = lightbox?.querySelector('.lightbox-dialog');
const image = lightbox?.querySelector('img');
const caption = lightbox?.querySelector('[data-lightbox-caption]');
let activeCategory = 'All';
let activeIndex = 0;
let returnFocus = null;
const categories = ['All', 'Campus', 'Classroom', 'Sports', 'Cultural', 'Events'];
const fallbackItems = Array.from({ length: 9 }, (_, index) => ({
  id: `placeholder-${index + 1}`,
  title: ['A place to grow', 'Learning together', 'Movement and play', 'Culture in community', 'Moments to remember', 'A welcoming environment', 'Curious minds at work', 'Moving as a team', 'School life in focus'][index],
  caption: 'Photos coming soon',
  category: categories[(index % (categories.length - 1)) + 1],
  src: '',
  alt: 'School photograph placeholder'
}));

function allItems() { return GALLERY_ITEMS.length ? GALLERY_ITEMS : fallbackItems; }
function visibleItems() { return activeCategory === 'All' ? allItems() : allItems().filter((item) => item.category === activeCategory); }
function renderFilters() {
  filterBar.replaceChildren();
  categories.forEach((category) => {
    const button = document.createElement('button');
    button.className = 'filter-chip';
    button.type = 'button';
    button.textContent = category;
    button.setAttribute('aria-pressed', String(category === activeCategory));
    button.addEventListener('click', () => { activeCategory = category; renderFilters(); renderGrid(); });
    filterBar.append(button);
  });
}
function renderGrid() {
  grid.replaceChildren();
  visibleItems().forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-item';
    button.setAttribute('aria-label', `${item.title}, ${item.category}. Open image viewer.`);
    if (item.src) {
      const photo = document.createElement('img');
      photo.className = 'gallery-photo';
      photo.src = item.src;
      photo.alt = item.alt;
      photo.loading = 'lazy';
      photo.width = 1200;
      photo.height = 900;
      button.append(photo);
    } else {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 48 48');
      icon.setAttribute('aria-hidden', 'true');
      icon.classList.add('gallery-placeholder-icon');
      const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      leaf.setAttribute('d', 'M39 8C25 8 12 13 9 25c-2 9 5 14 12 12C34 34 39 20 39 8ZM10 39c7-9 13-14 23-22');
      leaf.setAttribute('fill', 'none');
      leaf.setAttribute('stroke', 'currentColor');
      leaf.setAttribute('stroke-width', '2');
      leaf.setAttribute('stroke-linecap', 'round');
      icon.append(leaf);
      button.append(icon);
    }
    const label = document.createElement('span');
    label.className = 'gallery-label';
    const category = document.createElement('small');
    category.textContent = item.category;
    const title = document.createElement('strong');
    title.textContent = item.title || item.caption;
    label.append(category, title);
    if (!item.src) {
      const comingSoon = document.createElement('span');
      comingSoon.className = 'photos-coming';
      comingSoon.textContent = 'Photos coming soon';
      label.append(comingSoon);
    }
    button.append(label);
    button.classList.add('reveal');
    button.addEventListener('click', () => openLightbox(index, button));
    grid.append(button);
    requestAnimationFrame(() => button.classList.add('reveal-visible'));
  });
}
function openLightbox(index, source) {
  activeIndex = index;
  returnFocus = source;
  updateLightbox();
  lightbox.hidden = false;
  document.body.classList.add('modal-open');
  lightbox.querySelector('.lightbox-close').focus();
}
function updateLightbox() {
  const item = visibleItems()[activeIndex];
  caption.textContent = `${item.caption || item.title} · ${item.category}`;
  if (item.src) {
    image.src = item.src;
    image.alt = item.alt;
    image.hidden = false;
  } else {
    image.removeAttribute('src');
    image.alt = '';
    image.hidden = true;
    dialog.classList.remove('palette-1', 'palette-2', 'palette-3');
    if (activeIndex % 4 === 1) dialog.classList.add('palette-1');
    if (activeIndex % 4 === 2) dialog.classList.add('palette-2');
    if (activeIndex % 4 === 3) dialog.classList.add('palette-3');
  }
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove('modal-open');
  returnFocus?.focus();
}
function stepLightbox(direction) {
  activeIndex = (activeIndex + direction + visibleItems().length) % visibleItems().length;
  updateLightbox();
}
filterBar && renderFilters();
grid && renderGrid();
lightbox?.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox?.querySelector('.lightbox-prev').addEventListener('click', () => stepLightbox(-1));
lightbox?.querySelector('.lightbox-next').addEventListener('click', () => stepLightbox(1));
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
lightbox?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') stepLightbox(-1);
  if (event.key === 'ArrowRight') stepLightbox(1);
  if (event.key === 'Tab') {
    const controls = [...lightbox.querySelectorAll('button:not([hidden])')];
    if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
  }
});
let touchStartX = 0;
lightbox?.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
lightbox?.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 50) stepLightbox(distance < 0 ? 1 : -1);
}, { passive: true });
