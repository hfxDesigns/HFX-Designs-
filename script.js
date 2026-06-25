/* ===========================
   HFX DESIGNS — MAIN SCRIPT
   =========================== */

// ── Loader ──────────────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  const pct = document.getElementById('loaderPercent');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
    if (progress === 100) {
      setTimeout(() => {
        loader.classList.add('hide');
        document.body.style.overflow = '';
        initAll();
      }, 400);
    }
  }, 80);
  document.body.style.overflow = 'hidden';
})();

function initAll() {
  initCursor();
  initNav();
  initScrollProgress();
  initTypewriter();
  initHeroCanvas();
  initHeroParticles();
  initHeroMouseReactive();
  initReveal();
  initCounters();
  initSkills();
  initPortfolio();
  initLightbox();
  initTestimonials();
  initContactForm();
  initMagnetic();
}

// ── Custom Cursor ────────────────────────────────────────
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  dot.style.transition = 'none';
  (function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
}

// ── Navigation ───────────────────────────────────────────
function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveLink();
  });

  toggle && toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle && toggle.classList.remove('open');
      menu && menu.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  }
}

// ── Scroll Progress ──────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  });
}

// ── Typewriter ───────────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['Visual Brand Strategist', 'Creative Director', 'Logo & Brand Expert', 'UI/UX Designer'];
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) { deleting = true; setTimeout(tick, 1600); return; }
    if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; setTimeout(tick, 400); return; }
    setTimeout(tick, deleting ? 50 : 90);
  }
  tick();
}

// ── Hero Canvas (mesh gradient) ──────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, points;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    buildPoints();
  }

  function buildPoints() {
    points = Array.from({ length: 6 }, (_, i) => ({
      x: (i % 3) * (w / 2) + Math.random() * (w / 2),
      y: Math.floor(i / 3) * (h / 2) + Math.random() * (h / 2),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 0.3 + 0.15,
      hue: Math.random() > 0.5 ? '#FF2D8A' : '#9B27AF'
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    points.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, w * p.r);
      g.addColorStop(0, p.hue + '22');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

// ── Hero Particles ───────────────────────────────────────
function initHeroParticles() {
  const wrap = document.getElementById('heroParticles');
  if (!wrap) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  wrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = wrap.offsetWidth;
    h = canvas.height = wrap.offsetHeight;
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      o: Math.random() * 0.5 + 0.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,45,138,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

// ── Hero Mouse Reactive ──────────────────────────────────
function initHeroMouseReactive() {
  const visual = document.getElementById('heroVisual');
  if (!visual) return;
  document.addEventListener('mousemove', e => {
    const rect = visual.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / window.innerWidth;
    const dy = (e.clientY - cy) / window.innerHeight;
    visual.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
  });
}

// ── Intersection Observer Reveal ─────────────────────────
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ── Counter Animations ───────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

function animateCount(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1800;
  const start = performance.now();
  (function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  })(start);
}

// ── Skills Circles ───────────────────────────────────────
function initSkills() {
  const items = document.querySelectorAll('.skill-item');
  if (!items.length) return;
  // Inject gradient defs into first skill svg
  const firstSvg = document.querySelector('.skill-circle');
  if (firstSvg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FF2D8A"/>
        <stop offset="100%" style="stop-color:#9B27AF"/>
      </linearGradient>`;
    firstSvg.prepend(defs);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const pct = parseInt(el.dataset.skill);
        const fill = el.querySelector('.skill-fill');
        const pctEl = el.querySelector('.skill-percent');
        const circumference = 314;
        const offset = circumference - (pct / 100) * circumference;
        setTimeout(() => {
          fill.style.strokeDashoffset = offset;
        }, 200);
        let current = 0;
        const dur = 1600, start = performance.now();
        (function upd(now) {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          current = Math.floor(ease * pct);
          if (pctEl) pctEl.textContent = current + '%';
          if (t < 1) requestAnimationFrame(upd);
          else if (pctEl) pctEl.textContent = pct + '%';
        })(start);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  items.forEach(i => io.observe(i));
}

// ── Portfolio ─────────────────────────────────────────────
function initPortfolio() {
  renderPortfolio();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPortfolio(btn.dataset.filter);
    });
  });
}

function getProjects() {
  try { return JSON.parse(localStorage.getItem('hfx_projects') || '[]'); } catch { return []; }
}

function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  const empty = document.getElementById('portfolioEmpty');
  if (!grid) return;
  const projects = getProjects();
  grid.innerHTML = '';

  if (!projects.length) {
    empty && empty.classList.add('show');
    return;
  }
  empty && empty.classList.remove('show');

  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.dataset.cat = p.category || 'all';
    card.innerHTML = `
      <div class="portfolio-thumb">
        ${p.image
          ? `<img src="${p.image}" alt="${p.title}" loading="lazy">`
          : `<div class="portfolio-thumb-placeholder">◈</div>`}
        <div class="portfolio-overlay">
          <button class="portfolio-overlay-btn" data-id="${p.id}">View Project</button>
        </div>
      </div>
      <div class="portfolio-info">
        <span class="portfolio-cat">${p.category || 'Design'}</span>
        <h3>${p.title}</h3>
        <p>${p.description ? p.description.slice(0, 90) + (p.description.length > 90 ? '…' : '') : ''}</p>
      </div>`;
    grid.appendChild(card);
    card.querySelector('.portfolio-overlay-btn').addEventListener('click', () => openLightbox(p));
    // Reveal animation
    card.style.opacity = '0'; card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s, transform 0.5s';
      card.style.opacity = '1'; card.style.transform = 'translateY(0)';
    }, 50);
  });
}

function filterPortfolio(cat) {
  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(c => {
    const show = cat === 'all' || c.dataset.cat === cat;
    c.style.display = show ? '' : 'none';
  });
}

// ── Lightbox ──────────────────────────────────────────────
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const overlay = document.getElementById('lightboxOverlay');
  const closeBtn = document.getElementById('lightboxClose');
  [overlay, closeBtn].forEach(el => el && el.addEventListener('click', closeLightbox));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

function openLightbox(p) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const cat = document.getElementById('lightboxCat');
  const desc = document.getElementById('lightboxDesc');
  const links = document.getElementById('lightboxLinks');

  if (p.image) { img.src = p.image; img.alt = p.title; img.parentElement.style.display = ''; }
  else img.parentElement.style.display = 'none';

  title.textContent = p.title || '';
  cat.textContent = p.category || '';
  desc.textContent = p.description || '';
  links.innerHTML = '';
  if (p.behance) links.innerHTML += `<a href="${p.behance}" target="_blank" rel="noopener" class="lightbox-link">Behance ↗</a>`;
  if (p.dribbble) links.innerHTML += `<a href="${p.dribbble}" target="_blank" rel="noopener" class="lightbox-link">Dribbble ↗</a>`;

  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Testimonials Slider ───────────────────────────────────
function initTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  const dotsWrap = document.getElementById('testDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let perView = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
  const total = cards.length;
  const maxIndex = Math.max(0, total - perView);

  // Build dots
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.className = 'test-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex));
    const cardW = track.querySelector('.testimonial-card').offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardW}px)`;
    dotsWrap.querySelectorAll('.test-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto play
  let autoplay = setInterval(() => goTo(current < maxIndex ? current + 1 : 0), 4500);
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(current < maxIndex ? current + 1 : 0), 4500); });

  window.addEventListener('resize', () => {
    perView = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
    goTo(0);
  });
}

// ── Contact Form ──────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    const btnText = document.getElementById('formBtnText');
    const success = document.getElementById('formSuccess');
    btnText.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btnText.textContent = 'Send Message';
      btn.disabled = false;
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1400);
  });
}

// ── Magnetic Buttons ─────────────────────────────────────
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ── Parallax on hero scroll ───────────────────────────────
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-left');
  if (hero && window.scrollY < window.innerHeight) {
    hero.style.transform = `translateY(${window.scrollY * 0.12}px)`;
  }
});
