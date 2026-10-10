/* Independent per-element replayable reveal; preserves original site design. */
(() => {
  'use strict';
  const elements = Array.from(document.querySelectorAll('.nike-text-reveal'));
  if (!elements.length) return;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches || !('IntersectionObserver' in window)) return;

  const isVisible = el => {
    const box = el.getBoundingClientRect();
    return box.bottom > 0 && box.top < window.innerHeight;
  };

  // Set initial visibility before enabling transitions; avoids hidden text on load.
  elements.forEach(el => el.classList.toggle('nike-text-visible', isVisible(el)));
  document.documentElement.classList.add('nike-motion-active');

  // Observe forever: leaving the viewport resets the text; re-entry replays it.
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('nike-text-visible', entry.isIntersecting);
    }
  }, { root: null, rootMargin: '0px', threshold: 0 });
  elements.forEach(el => observer.observe(el));

  window.addEventListener('pageshow', () => {
    elements.forEach(el => el.classList.toggle('nike-text-visible', isVisible(el)));
  });

  // Keep text visible if accessibility preference changes while the page is open.
  motionQuery.addEventListener?.('change', () => {
    document.documentElement.classList.toggle('nike-motion-active', !motionQuery.matches);
    if (!motionQuery.matches) elements.forEach(el => el.classList.toggle('nike-text-visible', isVisible(el)));
  });
})();
