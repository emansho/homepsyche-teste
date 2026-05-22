(() => {
  /* ── Navegação pelos cômodos ── */
  const rooms = document.querySelectorAll('.room');
  const dots  = document.querySelectorAll('.room-dot');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('room--active');

        const id = entry.target.id;
        dots.forEach((dot) =>
          dot.classList.toggle('room-dot--active', dot.dataset.room === id)
        );
      });
    },
    { threshold: 0.30 }
  );

  rooms.forEach((r) => observer.observe(r));

  /* ── Scroll suave por clique nos dots ── */
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      document.getElementById(dot.dataset.room)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── Scroll suave nos links internos ── */
  document.querySelectorAll('a[href^="#"], .scroll-hint[href^="#"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const target = document.querySelector(el.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── Parallax leve nas cenas ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const scenes = document.querySelectorAll('.room__scene[data-parallax]');

    const applyParallax = () => {
      scenes.forEach((scene) => {
        const rect  = scene.closest('.room').getBoundingClientRect();
        const ratio = (rect.top / window.innerHeight);
        const speed = parseFloat(scene.dataset.parallax) || 0.08;
        scene.style.transform = `translateY(${ratio * speed * 100}px)`;
      });
    };

    window.addEventListener('scroll', applyParallax, { passive: true });
    applyParallax();
  }
})();
