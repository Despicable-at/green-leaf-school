import { installMotion, mountLayout } from './layout.js';

mountLayout();
installMotion();

document.querySelectorAll('[data-accordion]').forEach((group) => {
  group.addEventListener('click', (event) => {
    const button = event.target.closest('[data-accordion-trigger]');
    if (!button) return;
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const opening = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(opening));
    if (panel) panel.hidden = !opening;
    const marker = button.querySelector('[data-marker]');
    if (marker) marker.textContent = opening ? '−' : '+';
  });
});

const page = document.body.dataset.page;
if (page === 'admissions.html') void import('./form.js');
if (page === 'gallery.html') void import('./gallery.js');
if (page === 'staff.html') void import('./staff.js');
