// Game pages: once the Furling bar has scrolled away, the game's sub-bar (sticky in CSS) gets .stuck,
// which docks the Furling logo into it. .ready is added a couple of frames later so a page that loads
// already scrolled (back/forward, reload) starts in the right state without animating.
//
// Switching tabs from the stuck bar keeps it stuck: the click leaves a note in sessionStorage, and the next
// page opens scrolled just past the Furling bar, so the view transition only slides the tab underline.
// This script runs at the end of <body> (not deferred) so that scroll and .stuck land before first paint.
(() => {
  const bar = document.querySelector('.bar'), sub = document.querySelector('.sub');
  if (!bar || !sub) return;
  const KEY = 'furling:sub-stuck';

  let keep = false;
  try { keep = sessionStorage.getItem(KEY) === '1'; sessionStorage.removeItem(KEY); } catch {}
  const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (keep && !location.hash && (!nav || nav.type === 'navigate')) {
    // +1 so the bar is fully out, not edge-touching (which still counts as intersecting).
    window.scrollTo(0, bar.offsetHeight + 1);
  }
  const stuck = () => bar.getBoundingClientRect().bottom <= 0;
  sub.classList.toggle('stuck', stuck());

  const tabs = sub.querySelector('nav');
  if (tabs) tabs.addEventListener('click', e => {
    if (!e.target.closest('a')) return;
    try { sessionStorage.setItem(KEY, sub.classList.contains('stuck') ? '1' : '0'); } catch {}
  });

  const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => sub.classList.add('ready')));
  if (!('IntersectionObserver' in window)) return ready();
  let first = true;
  new IntersectionObserver(([e]) => {
    sub.classList.toggle('stuck', !e.isIntersecting);
    if (first) { first = false; ready(); }
  }).observe(bar);
})();
