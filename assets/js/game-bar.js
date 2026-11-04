// Game pages: the game's sub-bar is sticky (CSS) and gets .stuck once the Furling bar has scrolled away.
//
// Docking: the Furling logo is pinned in place. Its stand-in, the cream chip in .sub-home, is fixed to the
// viewport exactly over the Furling bar's logo (which is hidden), so scrolling slides the Furling bar away
// beneath it while the sub-bar rises to meet it. From the moment the sub-bar's top edge touches the chip, the
// chip eases down to its docked size and position, and .sub-home widens so the game name slides right to make
// room before it rises to the chip's level. Everything is driven by scroll position, so it tracks the scroll
// and reverses on the way back up.
//
// Switching tabs from the stuck bar keeps it stuck: the click leaves a note in sessionStorage, and the next
// page opens scrolled just past the Furling bar, so the view transition only slides the tab underline.
// This script runs at the end of <body> (not deferred) so that scroll, .stuck and the chip land before first paint.
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

  // --- docking the Furling logo ---
  const home = sub.querySelector('.sub-home'), chip = home && home.querySelector('.ch'),
    chipImg = chip && chip.querySelector('img'), barImg = bar.querySelector('.in > a:first-child img'),
    name = sub.querySelector('.sub-name');
  if (chip && chipImg && barImg && name) {
    const PAD_X = 9, GAP = 12; // chip's side padding; space between chip and the game icon once docked
    const lerp = (a, b, t) => a + (b - a) * t;
    const ease = t => t * t * (3 - 2 * t);
    let m = null;

    // Measured in page coordinates (the Furling bar isn't sticky, so its rect + scrollY is fixed), once and
    // again on resize / font load, rather than every frame.
    const measure = () => {
      const y = window.scrollY, barH = bar.offsetHeight;
      const b = barImg.getBoundingClientRect(), s = sub.getBoundingClientRect(), n = name.getBoundingClientRect();
      const chipW = chip.offsetWidth, chipH = chip.offsetHeight;
      const imgH = chipImg.offsetHeight, imgTop = (chipH - imgH) / 2;
      const s0 = b.height / imgH;                       // chip scale while it covers the Furling bar's logo
      const x0 = b.left - PAD_X * s0, y0 = b.top + y - imgTop * s0;
      const x1 = b.left - PAD_X;                        // the logo keeps its x; only the chip's padding shrinks
      const y1 = n.top - s.top + n.height / 2 - chipH / 2; // centred on the game name once the sub-bar is at the top
      // The sub-bar's top edge sits at (barH - scrollY); it meets the chip when that reaches the chip's bottom.
      const meet = Math.min(Math.max(barH - (y0 + chipH * s0), 0), barH - 1);
      // Finish docking by the time the game name's top edge reaches the docked chip's bottom, so the name has
      // already slid clear when it passes under the chip's x range; the rest of the scroll just brings it up.
      const done = Math.min(Math.max(barH + (n.top - s.top) - (y1 + chipH), meet + 1), barH);
      // .sub-home's -10px margin cancels the name's 10px flex gap, so at width w the game icon starts at slot + w.
      const room = Math.max(0, x1 + chipW + GAP - home.getBoundingClientRect().left);
      m = { barH, s0, x0, y0, x1, y1, meet, done, room };
    };

    let last = -1;
    const draw = () => {
      const y = Math.min(Math.max(window.scrollY, 0), m.barH);
      if (y === last) return;
      last = y;
      const t = ease(Math.min(Math.max((y - m.meet) / (m.done - m.meet), 0), 1));
      chip.style.transform = `translate(${lerp(m.x0, m.x1, t)}px,${lerp(m.y0, m.y1, t)}px) scale(${lerp(m.s0, 1, t)})`;
      home.style.width = `${m.room * t}px`;
    };
    const remeasure = () => { home.style.width = '0px'; measure(); last = -1; draw(); };

    sub.classList.add('dock'); bar.classList.add('dock');
    remeasure();
    let queued = false;
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; draw(); }); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
    if (!barImg.complete) barImg.addEventListener('load', remeasure);
  }

  const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => sub.classList.add('ready')));
  if (!('IntersectionObserver' in window)) return ready();
  let first = true;
  new IntersectionObserver(([e]) => {
    sub.classList.toggle('stuck', !e.isIntersecting);
    if (first) { first = false; ready(); }
  }).observe(bar);
})();
