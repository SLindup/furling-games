// Game pages: once the Furling bar has scrolled away, the game's sub-bar (sticky in CSS) gets .stuck,
// which docks the Furling logo into it. .ready is added after the first check so a page that loads
// already scrolled (back/forward, reload) starts in the right state without animating.
(() => {
  const bar = document.querySelector('.bar'), sub = document.querySelector('.sub');
  if (!bar || !sub || !('IntersectionObserver' in window)) return;
  let first = true;
  new IntersectionObserver(([e]) => {
    sub.classList.toggle('stuck', !e.isIntersecting);
    if (first) {
      first = false;
      requestAnimationFrame(() => requestAnimationFrame(() => sub.classList.add('ready')));
    }
  }).observe(bar);
})();
