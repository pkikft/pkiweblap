// Reveal-on-scroll animáció minden oldalon
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (el) { observer.observe(el); });
})();

// Mobil statisztika karuszel — körbejáró, húzható, automatikusan lapozó
(function () {
  var grid = document.querySelector('.stats-grid');
  if (!grid) return;

  var track = grid.querySelector('.stats-track');
  var slides = grid.querySelectorAll('.stat');
  var dotsWrap = document.querySelector('.stats-dots');
  if (!track || !slides.length) return;

  var index = 0;
  var autoplayTimer = null;
  var isMobile = window.matchMedia('(max-width: 760px)').matches;

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ugrás a(z) ' + (i + 1) + '. statisztikára');
      if (i === index) b.classList.add('active');
      b.addEventListener('click', function () {
        goTo(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(b);
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    var buttons = dotsWrap.querySelectorAll('button');
    buttons.forEach(function (b, i) {
      b.classList.toggle('active', i === index);
    });
  }

  function goTo(i) {
    var total = slides.length;
    index = ((i % total) + total) % total; // mindig körbeér, negatívból is
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    updateDots();
  }

  function next() { goTo(index + 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  function restartAutoplay() {
    if (isMobile) startAutoplay();
  }

  // Swipe / touch kezelés
  var startX = 0;
  var isDragging = false;

  grid.addEventListener('touchstart', function (e) {
    if (!isMobile) return;
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  }, { passive: true });

  grid.addEventListener('touchend', function (e) {
    if (!isMobile || !isDragging) return;
    isDragging = false;
    var endX = e.changedTouches[0].clientX;
    var delta = endX - startX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) { next(); } else { goTo(index - 1); }
    }
    restartAutoplay();
  });

  function handleResize() {
    isMobile = window.matchMedia('(max-width: 760px)').matches;
    if (isMobile) {
      goTo(index);
      startAutoplay();
    } else {
      track.style.transform = '';
      stopAutoplay();
    }
  }

  buildDots();
  window.addEventListener('resize', handleResize);
  handleResize();
})();
