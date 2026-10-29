// A mobile browser may restore the previous hash target when the page is
// refreshed. Treat a refresh like a fresh visit and start at the top instead.
const navigationEntry = performance.getEntriesByType('navigation')[0];
if (navigationEntry?.type === 'reload') {
  history.replaceState(null, '', `${location.pathname}${location.search}`);
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    document.documentElement.style.removeProperty('scroll-behavior');
  });
}

const modal = document.querySelector('#modal');
const play = document.querySelector('#play');
const close = document.querySelector('#close');
const video = document.querySelector('#invitation-video');
function setModal(open) {
  modal.classList.toggle('open', open);
  modal.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    close.focus();
    video.play().catch(() => {});
  } else {
    video.pause();
    video.currentTime = 0;
    play.focus();
  }
}
play.addEventListener('click', () => setModal(true));
close.addEventListener('click', () => setModal(false));
modal.addEventListener('click', (event) => { if (event.target === modal) setModal(false); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('open')) setModal(false); });

document.querySelectorAll('.event-card').forEach((card) => {
  const front = card.querySelector('.event-front');
  const back = card.querySelector('.event-back');
  back.inert = true;
  const flipCard = () => {
    const flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-expanded', String(flipped));
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
    front.inert = flipped;
    back.inert = !flipped;
  };
  card.addEventListener('click', (event) => {
    if (event.target.closest('.map-link')) return;
    flipCard();
  });
  card.addEventListener('keydown', (event) => {
    if (event.target.closest('.map-link')) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flipCard();
    }
  });
});
