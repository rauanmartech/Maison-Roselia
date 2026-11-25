import {
  CalendarDays, Castle, ChevronLeft, ChevronRight, Flower2, HeartHandshake,
  ListChecks, Menu, Utensils, Wine, X, createIcons,
} from 'lucide';

createIcons({
  icons: { CalendarDays, Castle, ChevronLeft, ChevronRight, Flower2, HeartHandshake, ListChecks, Menu, Utensils, Wine, X },
  attrs: { 'aria-hidden': 'true', focusable: 'false' },
});

const nav = document.querySelector('#nav');
const menu = document.querySelector('.menu-toggle');
function toggleMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
menu.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
nav.addEventListener('click', () => toggleMenu(false));
document.addEventListener('click', event => {
  if (!event.target.closest('.header-inner')) toggleMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    toggleMenu(false);
    menu.focus();
  }
});

const links = [...nav.querySelectorAll('a')];
const sections = links.map(link => document.querySelector(link.hash));
function updateCurrentSection() {
  const active = sections.findLastIndex(section => section.getBoundingClientRect().top <= window.innerHeight * 0.35);
  links.forEach((link, index) => {
    if (index === Math.max(0, active)) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updateCurrentSection, { passive: true });
updateCurrentSection();

const photos = document.querySelector('#photos');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
function updateGallery() {
  previous.disabled = photos.scrollLeft < 2;
  next.disabled = photos.scrollWidth - photos.clientWidth - photos.scrollLeft < 2;
}
function moveGallery(direction) {
  const frames = photos.querySelectorAll('figure');
  const step = frames[1].offsetLeft - frames[0].offsetLeft;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  photos.scrollBy({ left: direction * step, behavior: reducedMotion ? 'instant' : 'smooth' });
}
previous.addEventListener('click', () => moveGallery(-1));
next.addEventListener('click', () => moveGallery(1));
photos.addEventListener('scroll', updateGallery, { passive: true });
new ResizeObserver(updateGallery).observe(photos);
updateGallery();

const albumLinks = [...document.querySelectorAll('.preparation-photo')];
const viewer = document.querySelector('#album-viewer');
const viewerImage = new Image();
const viewerCaption = document.querySelector('#album-caption');
const viewerCount = document.querySelector('#album-count');
let activePhoto = 0;

function showPhoto(index) {
  activePhoto = (index + albumLinks.length) % albumLinks.length;
  const link = albumLinks[activePhoto];
  viewerImage.src = link.href;
  viewerImage.alt = link.querySelector('img').alt;
  viewerCaption.textContent = link.querySelector('figcaption').textContent;
  viewerCount.textContent = `Foto ${activePhoto + 1} de ${albumLinks.length}`;
}

albumLinks.forEach((link, index) => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPhoto(index);
    viewer.querySelector('.album-frame').replaceChildren(viewerImage);
    viewer.showModal();
  });
});
viewer.querySelector('.album-dismiss').addEventListener('click', () => viewer.close());
viewer.querySelector('#album-prev').addEventListener('click', () => showPhoto(activePhoto - 1));
viewer.querySelector('#album-next').addEventListener('click', () => showPhoto(activePhoto + 1));
viewer.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  showPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1));
});
viewer.addEventListener('click', event => {
  if (event.target !== viewer) return;
  const { left, top, right, bottom } = viewer.getBoundingClientRect();
  if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) viewer.close();
});

const dialog = document.querySelector('#visit-dialog');
const form = document.querySelector('#visit-form');
const status = document.querySelector('#visit-status');
const recipient = (import.meta.env.VITE_CONTACT_EMAIL || '').trim();
if (recipient) {
  document.querySelector('#visit-submit').textContent = 'Preparar e-mail de visita';
  document.querySelector('#visit-note').textContent = 'Seu aplicativo de e-mail abrirá com o pedido preenchido. A equipe confirmará a disponibilidade.';
}
document.querySelectorAll('[data-visit]').forEach(button => {
  button.addEventListener('click', () => {
    toggleMenu(false);
    const now = new Date();
    form.elements.date.min = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    status.textContent = '';
    dialog.showModal();
  });
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const date = data.get('date').split('-').reverse().join('/');
  const subject = 'Pedido de visita à Maison Rosélia';
  const message = [
    'Olá, equipe Maison Rosélia!', '',
    'Gostaria de conhecer o castelo e conversar sobre o meu casamento.',
    'Data de preferência: ' + date, 'Nome: ' + data.get('name').trim(),
    'E-mail: ' + data.get('email').trim(),
    data.get('message').trim(), '', 'Aguardo a confirmação da visita.',
  ].join('\n');
  if (recipient) {
    window.location.href = 'mailto:' + encodeURIComponent(recipient) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message);
    status.textContent = 'Conclua o envio no seu aplicativo de e-mail.';
    return;
  }
  const file = new Blob(['\uFEFF', subject, '\n\n', message], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const download = document.createElement('a');
  download.href = url;
  download.download = 'pedido-de-visita-maison-roselia.txt';
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Pedido preparado para download. Compartilhe o arquivo com a equipe para combinar a visita.';
});
