// Selected Work: on every scroll, find whichever project block's center
// is actually closest to the viewport's center and activate that one.
// This is recalculated fresh each time, so it's symmetric regardless of
// scroll direction, no reliance on enter/exit events that can fall out
// of sync when scrolling back up through blocks already triggered.
(function () {
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.sw-block'));
  if (!blocks.length) return;

  var ticking = false;

  function updateActive() {
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


// Selected work: list / grid layout toggle. The choice is remembered between visits and pages.
(function () {
  var group = document.querySelector('.layout-toggle');
  if (!group) return;
  var root = document.documentElement;
  var buttons = group.querySelectorAll('button[data-layout]');
  function apply(layout) {
    if (layout === 'grid') root.setAttribute('data-layout', 'grid'); else root.removeAttribute('data-layout');
    Array.prototype.forEach.call(buttons, function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-layout') === layout));
    });
  }
  apply(root.getAttribute('data-layout') === 'grid' ? 'grid' : 'list');
  group.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-layout]');
    if (!b) return;
    var layout = b.getAttribute('data-layout');
    apply(layout);
    try { localStorage.setItem('sw-layout', layout); } catch (err) {}
  });
})();
