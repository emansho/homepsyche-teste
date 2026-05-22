(() => {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { canvas.style.display = 'none'; return; }

  const COLORS = ['#DDB5B0', '#89ABB5', '#C2BDB0', '#96A896', '#B07A7E'];
  const COUNT  = 70;

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
  });

  class Particle {
    constructor(spreadY = false) {
      this.reset(spreadY);
    }

    reset(spreadY = false) {
      this.x       = Math.random() * W;
      this.y       = spreadY ? Math.random() * H : H + 10;
      this.r       = Math.random() * 1.8 + 0.4;
      this.vy      = -(Math.random() * 0.38 + 0.12);
      this.vx      = (Math.random() - 0.5) * 0.18;
      this.alpha   = 0;
      this.maxA    = Math.random() * 0.18 + 0.04;
      this.phase   = Math.random() * Math.PI * 2;
      this.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.firefly = Math.random() < 0.12;

      if (this.firefly) {
        this.r    = Math.random() * 1.6 + 1.2;
        this.maxA = Math.random() * 0.45 + 0.18;
        this.vy   = -(Math.random() * 0.22 + 0.06);
        this.pulseSpeed = Math.random() * 0.018 + 0.008;
      }
    }

    update(t) {
      this.y += this.vy;
      this.x += this.vx + Math.sin(t * 0.0006 + this.phase) * 0.15;

      if (this.firefly) {
        this.alpha = this.maxA * (0.5 + 0.5 * Math.sin(t * this.pulseSpeed + this.phase));
      } else {
        if (this.alpha < this.maxA) this.alpha += 0.003;
        if (this.y < H * 0.55 && this.alpha > 0) this.alpha -= 0.004;
      }

      if (this.y < -12 || this.alpha < 0) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();

      if (this.firefly && this.alpha > 0.05) {
        ctx.globalAlpha = this.alpha * 0.22;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  const particles = Array.from({ length: COUNT }, () => new Particle(true));

  function loop(t) {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.update(t);
      p.draw();
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
