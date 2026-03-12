/* =========================================
   MineXore – script.js
   Interactivity, animations, particles
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {


  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });


  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '72px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = '#111';
      navLinks.style.padding = '1rem 5%';
      navLinks.style.borderBottom = '1px solid #2a2a2a';
    });
  }


  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = target >= 1000000
        ? (current / 1000000).toFixed(1) + 'M'
        : target >= 1000
          ? current.toLocaleString('hu-HU')
          : current + '%';
      if (current >= target) clearInterval(timer);
    }, 16);
  }


  const counterEls = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));

  const featureItems = document.querySelectorAll('.feature-item');
  const featObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        featObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  featureItems.forEach(el => featObserver.observe(el));


  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });


  const container = document.getElementById('particles');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  function resize() {
    canvas.width  = container.offsetWidth  || window.innerWidth;
    canvas.height = container.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLES = 70;
  const particles = Array.from({ length: PARTICLES }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.6 + 0.1,
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 197, 24, ${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0)             p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0)             p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();


  const marketRows = document.querySelectorAll('.market-row');
  const changes = [
    { base: 12.7, priceBase: 0.00421 },
    { base: 8.4,  priceBase: 0.00188 },
    { base: 4.2,  priceBase: 1.0000  },
    { base: -1.3, priceBase: 0.0521  },
    { base: 3.1,  priceBase: 0.0032  },
  ];

  function flicker() {
    marketRows.forEach((row, i) => {
      const delta = (Math.random() - 0.48) * 0.4;
      changes[i].base = parseFloat((changes[i].base + delta).toFixed(2));
      const val = changes[i].base;
      const sign = val >= 0 ? '▲ +' : '▼ ';
      const cls  = val >= 0 ? 'green' : 'red';

      const changeEl = row.querySelector('.market-change');
      if (changeEl) {
        changeEl.textContent = `${sign}${Math.abs(val).toFixed(1)}%`;
        changeEl.className = `market-change ${cls}`;
      }

      const priceEl = row.querySelector('.market-price');
      if (priceEl && i !== 2) {
        const pDelta = changes[i].priceBase * (Math.random() - 0.49) * 0.002;
        changes[i].priceBase = parseFloat((changes[i].priceBase + pDelta).toFixed(5));
        priceEl.textContent = `₿ ${changes[i].priceBase.toFixed(5)}`;
      }
    });
  }
  setInterval(flicker, 2200);


  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinks) navLinks.style.display = '';
      }
    });
  });


  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:rgba(255,255,255,0.25);
        transform:scale(0);
        animation:rippleAnim 0.5s linear;
        pointer-events:none;
        width:40px; height:40px;
        left:${e.clientX - rect.left - 20}px;
        top:${e.clientY - rect.top - 20}px;
      `;
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });


  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes rippleAnim { to { transform: scale(8); opacity: 0; } }`;
  document.head.appendChild(styleTag);


  const chartPath = document.querySelector('.phone-chart path[stroke]');
  if (chartPath) {
    const len = chartPath.getTotalLength();
    chartPath.style.strokeDasharray  = len;
    chartPath.style.strokeDashoffset = len;
    chartPath.style.transition = 'stroke-dashoffset 2s ease 0.5s';
    setTimeout(() => { chartPath.style.strokeDashoffset = 0; }, 100);
  }


  const accentLine = document.querySelector('.accent-line');
  if (accentLine) {
    setInterval(() => {
      if (Math.random() < 0.15) {
        accentLine.style.textShadow = `
          2px 0 0 rgba(255,0,0,0.7),
          -2px 0 0 rgba(0,255,255,0.7),
          0 0 40px rgba(245,197,24,0.5)
        `;
        setTimeout(() => {
          accentLine.style.textShadow = '0 0 40px rgba(245,197,24,0.5), 0 0 80px rgba(245,197,24,0.2)';
        }, 80);
      }
    }, 2500);
  }


  const trail = [];
  const TRAIL_COUNT = 8;
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed;
      pointer-events:none;
      z-index:9998;
      border-radius:50%;
      background: rgba(245,197,24,${0.5 - i * 0.06});
      width:${TRAIL_COUNT - i}px;
      height:${TRAIL_COUNT - i}px;
      transition: transform 0.05s;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  });
  (function animTrail() {
    trail.forEach((t, i) => {
      const prev = i === 0 ? { x: mx, y: my } : trail[i - 1];
      t.x += (prev.x - t.x) * 0.35;
      t.y += (prev.y - t.y) * 0.35;
      t.el.style.transform = `translate(${t.x - (TRAIL_COUNT - i) / 2}px, ${t.y - (TRAIL_COUNT - i) / 2}px)`;
    });
    requestAnimationFrame(animTrail);
  })();

});
