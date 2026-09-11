/* =========================================================
   PARTH BHALERAO — PORTFOLIO INTERACTION SYSTEM
   Pure JavaScript, no framework/runtime dependency.
   ========================================================= */

(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  if (!body) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const touchLike = window.matchMedia('(hover: none)').matches;
  body.classList.add('motion-ready');

  // ---------- Global utility layers ----------
  const makeLayer = (id, className = '') => {
    if (doc.getElementById(id)) return doc.getElementById(id);
    const el = doc.createElement('div');
    el.id = id;
    if (className) el.className = className;
    body.appendChild(el);
    return el;
  };

  const progress = makeLayer('scroll-progress');

  // ---------- Navigation ----------
  const hamburger = doc.querySelector('.hamburger');
  const navLinks = doc.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-label', 'Open navigation');
    hamburger.setAttribute('aria-expanded', 'false');

    const setMenu = (open) => {
      hamburger.classList.toggle('active', open);
      navLinks.classList.toggle('active', open);
      body.classList.toggle('menu-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    };

    const toggleMenu = () => setMenu(!navLinks.classList.contains('active'));
    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
      if (e.key === 'Escape') setMenu(false);
    });
    doc.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  }

  // Correct active nav state from current filename.
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  doc.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    a.classList.toggle('active', href === file || (file === '' && href === 'about.html'));
  });

  // ---------- Heading eyebrow labels ----------
  const pageLabels = {
    'research.html': 'SELECTED / PUBLICATIONS',
    'ai-ml.html': 'BUILD / INTELLIGENCE',
    'ai-blogs.html': 'WRITING / ARTIFICIAL INTELLIGENCE',
    'software.html': 'BUILD / SOFTWARE',
    'education.html': 'JOURNEY / EDUCATION',
    'experience.html': 'JOURNEY / EXPERIENCE',
    'achievements.html': 'MILESTONES / ACHIEVEMENTS',
    'youtube.html': 'LEARN / VIDEO',
    'dsa.html': 'PRACTICE / ALGORITHMS',
    'blogs.html': 'WRITING / PERSONAL',
    'certifications.html': 'CREDENTIALS / CERTIFICATIONS',
    'notes.html': 'RESOURCES / NOTES'
  };
  const mainHeading = doc.querySelector('.content > h1, .certs-title, .notes-title');
  if (mainHeading && !mainHeading.dataset.eyebrow) {
    mainHeading.dataset.eyebrow = pageLabels[file] || 'PORTFOLIO / PARTH BHALERAO';
  }

  // ---------- About photo depth shell ----------
  const aboutImg = doc.querySelector('.about-img');
  if (aboutImg && !aboutImg.closest('.about-photo-shell')) {
    const shell = doc.createElement('div');
    shell.className = 'about-photo-shell reveal';
    aboutImg.parentNode.insertBefore(shell, aboutImg);
    shell.appendChild(aboutImg);
    ['dot-a', 'dot-b'].forEach(c => {
      const dot = doc.createElement('span');
      dot.className = `photo-orbit-dot ${c}`;
      shell.appendChild(dot);
    });
  }

  // ---------- Intersection reveals ----------
  const revealTargets = [
    ...doc.querySelectorAll('.research-card, .edu-item, .exp-item, .cert-item, .blog-item'),
    ...doc.querySelectorAll('.youtube-intro, .youtube-playlists, .dsa-intro, .dsa-tables > *, .notes-table'),
    ...doc.querySelectorAll('.about-text > p, .about-text > h2, .about-text > ul, .about-cta-row')
  ];
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min((i % 6) * 45, 225)}ms`;
  });

  const imgs = doc.querySelectorAll('.fade-in-on-scroll');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (entry.target.matches('img')) entry.target.classList.add('visible');
          entry.target.querySelectorAll?.('.fade-in-on-scroll').forEach(img => img.classList.add('visible'));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .10, rootMargin: '0px 0px -5% 0px' });

    revealTargets.forEach(el => observer.observe(el));
    imgs.forEach(img => observer.observe(img));
    doc.querySelectorAll('.about-photo-shell').forEach(el => observer.observe(el));
  } else {
    [...revealTargets, ...imgs, ...doc.querySelectorAll('.about-photo-shell')].forEach(el => {
      el.classList.add('is-visible');
      if (el.matches('img')) el.classList.add('visible');
    });
  }

  // ---------- Lightweight hover effects are handled in CSS ----------

  // ---------- Blog accordion ----------
  doc.querySelectorAll('.blog-header').forEach(header => {
    const parent = header.parentElement;
    const panel = parent.querySelector('.blog-content');
    header.setAttribute('aria-expanded', parent.classList.contains('active') ? 'true' : 'false');
    if (panel && parent.classList.contains('active')) panel.style.maxHeight = `${panel.scrollHeight}px`;

    header.addEventListener('click', () => {
      const open = !parent.classList.contains('active');
      parent.classList.toggle('active', open);
      header.setAttribute('aria-expanded', String(open));
      if (panel) panel.style.maxHeight = open ? `${panel.scrollHeight}px` : '0px';
    });
  });

  // ---------- Scroll state / timeline drawing ----------
  const timelines = doc.querySelectorAll('.edu-timeline, .exp-timeline');
  let ticking = false;
  const updateScroll = () => {
    const y = window.scrollY || doc.documentElement.scrollTop;
    const max = doc.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    body.classList.toggle('scrolled', y > 18);

    timelines.forEach(timeline => {
      const rect = timeline.getBoundingClientRect();
      const start = innerHeight * .78;
      const end = innerHeight * .2;
      const travelled = start - rect.top;
      const range = rect.height + (start - end);
      const p = Math.max(0, Math.min(1, travelled / range));
      timeline.style.setProperty('--timeline-progress', `${(p * 100).toFixed(1)}%`);
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  // ---------- Dynamic footer year ----------
  doc.querySelectorAll('[data-current-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  // ---------- Smooth page exits for internal HTML navigation ----------
  if (!reduceMotion) {
    doc.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.hasAttribute('download') || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html($|#|\?)/i.test(url.pathname)) return;
      e.preventDefault();
      body.classList.add('is-leaving');
      setTimeout(() => { location.href = a.href; }, 250);
    });
  }

  // ---------- Lightweight 3D spatial network canvas ----------
  if (!reduceMotion) {
    const canvas = doc.createElement('canvas');
    canvas.id = 'ambient-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    body.insertBefore(canvas, body.firstChild);
    const ctx = canvas.getContext('2d', { alpha: true });
    let w = 0, h = 0, dpr = 1;
    let points = [];

    const countForScreen = () => {
      if (innerWidth < 600) return 24;
      if (innerWidth < 1000) return 38;
      return 64;
    };

    const seed = () => {
      points = Array.from({ length: countForScreen() }, () => ({
        x: (Math.random() - .5) * 1500,
        y: (Math.random() - .5) * 1000,
        z: Math.random() * 900 + 180,
        s: Math.random() * 1.25 + .45,
        v: Math.random() * .3 + .12
      }));
    };

    const resize = () => {
      w = innerWidth; h = innerHeight;
      dpr = Math.min(devicePixelRatio || 1, touchLike ? 1.2 : 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const project = p => {
      const fov = Math.max(430, Math.min(760, w * .58));
      const scale = fov / (fov + p.z);
      return {
        x: w * .5 + p.x * scale,
        y: h * .48 + p.y * scale,
        scale,
        a: Math.max(.06, Math.min(.55, .6 - p.z / 1800))
      };
    };

    let last = performance.now();
    const draw = (now) => {
      const dt = Math.min(32, now - last); last = now;
      ctx.clearRect(0, 0, w, h);

      const projected = [];
      for (const p of points) {
        p.z -= p.v * dt;
        if (p.z < 30) {
          p.z = 1080;
          p.x = (Math.random() - .5) * 1500;
          p.y = (Math.random() - .5) * 1000;
        }
        projected.push(project(p));
      }

      ctx.lineWidth = .65;
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 11200) {
            const alpha = (1 - dist2 / 11200) * .085 * Math.min(a.a + b.a, 1);
            ctx.strokeStyle = `rgba(86, 238, 174, ${alpha})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      projected.forEach((p, i) => {
        const r = points[i].s * (.7 + p.scale * 1.4);
        ctx.beginPath();
        ctx.fillStyle = `rgba(96, 245, 182, ${p.a * .52})`;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();
    requestAnimationFrame(draw);
  }
})();
