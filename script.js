// Selected Work: on every scroll, find whichever project block's center
// is actually closest to the viewport's center and activate that one.
// This is recalculated fresh each time, so it's symmetric regardless of
// scroll direction, no reliance on enter/exit events that can fall out
// of sync when scrolling back up through blocks already triggered.
(function () {
  if (!document.querySelector('.sw-block')) return;

  var ticking = false;

  function updateActive() {
    var blocks = Array.prototype.slice.call(document.querySelectorAll('.sw-block')).filter(function (b) { return b.offsetParent !== null; });
    var viewportCenter = window.innerHeight / 2;
    var closest = null;
    var closestDist = Infinity;

    blocks.forEach(function (b) {
      var rect = b.getBoundingClientRect();
      var blockCenter = rect.top + rect.height / 2;
      var dist = Math.abs(blockCenter - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = b;
      }
    });

    if (closest) {
      blocks.forEach(function (b) {
        if (b !== closest) b.classList.remove('active');
      });
      closest.classList.add('active');
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateActive);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateActive();
})();

// Play grid: on real mouse/trackpad devices, CSS :hover handles everything
// and this never runs. On touch, tap a tile to expand it, tap elsewhere
// (or tap it again) to close it.
(function () {
  var supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) return;

  var tiles = document.querySelectorAll('.play-tile');
  if (!tiles.length) return;

  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      var wasExpanded = tile.classList.contains('expanded');
      tiles.forEach(function (t) { t.classList.remove('expanded'); });
      if (!wasExpanded) tile.classList.add('expanded');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.play-tile')) {
      tiles.forEach(function (t) { t.classList.remove('expanded'); });
    }
  });
})();


// Selected work: Product design / Visual design tabs.
// #visual-design in the URL opens the visual tab (used by the visual project pages' back links).
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.work-tabs [role="tab"]'));
  if (!tabs.length) return;
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    try { history.replaceState(null, '', tab.id === 'tab-visual' ? '#visual-design' : '#work'); } catch (e) {}
    window.dispatchEvent(new Event('scroll'));
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t, false); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
      }
    });
  });
  if (location.hash === '#visual-design') {
    select(document.getElementById('tab-visual'), false);
    var w = document.getElementById('work');
    if (w) w.scrollIntoView();
  }
})();
