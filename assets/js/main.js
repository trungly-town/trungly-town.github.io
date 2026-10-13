(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Opened straight from disk: folders don't open their index.html ---------- */
  // links like projects/m-smart/ work on any web server; on file:// point them at the file itself
  if (location.protocol === 'file:') {
    document.addEventListener('click', (e) => {
      const a = e.target.closest?.('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0) return;
      const url = new URL(a.href);
      if (url.protocol !== 'file:' || !url.pathname.endsWith('/')) return;
      e.preventDefault();
      url.pathname += 'index.html';
      if (a.target === '_blank' || e.metaKey || e.ctrlKey) window.open(url.href, '_blank');
      else location.href = url.href;
    });
  }

  /* ---------- Theme ---------- */
  const themeMeta = $('meta[name="theme-color"]');
  const currentTheme = () => getComputedStyle(root).getPropertyValue('--theme').trim() || 'dark';
  const syncThemeMeta = () => themeMeta && themeMeta.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
  const themeListeners = [];

  $('[data-theme-toggle]')?.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    syncThemeMeta();
    themeListeners.forEach((fn) => fn());
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
    syncThemeMeta();
    themeListeners.forEach((fn) => fn());
  });
  syncThemeMeta();

  /* ---------- Nav: scrolled state, progress bar, mobile menu ---------- */
  const nav = $('[data-nav]');
  const progress = $('.progress');
  const menuBtn = $('[data-menu-toggle]');
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 12);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('.nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setMenu(false); });

  /* ---------- Active section highlight ---------- */
  const navLinks = $$('.nav-links a');
  const linkFor = (id) => navLinks.find((a) => a.getAttribute('href') === '#' + id);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.remove('active'));
      linkFor(entry.target.id)?.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  // only on the one-page home; sub-pages keep their static "active" link
  if (navLinks.some((a) => a.getAttribute('href').startsWith('#'))) {
    $$('main section[id]').forEach((s) => sectionObserver.observe(s));
  }

  /* ---------- Typed roles ---------- */
  const typed = $('[data-typed]');
  if (typed && !reduceMotion) {
    const roles = JSON.parse(typed.dataset.typed);
    let i = 0;
    let j = roles[0].length;
    let deleting = true;
    const tick = () => {
      const word = roles[i];
      if (deleting) {
        j -= 1;
        typed.textContent = word.slice(0, j);
        if (j === 0) { deleting = false; i = (i + 1) % roles.length; return setTimeout(tick, 320); }
        return setTimeout(tick, 26);
      }
      j += 1;
      typed.textContent = roles[i].slice(0, j);
      if (j === roles[i].length) { deleting = true; return setTimeout(tick, 2000); }
      return setTimeout(tick, 58);
    };
    setTimeout(tick, 2400);
  }

  /* ---------- Robot: eyes follow the pointer ---------- */
  const botEyes = $('.bot-eyes');
  if (botEyes && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let raf = 0;
    window.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = botEyes.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const k = 3 / Math.max(Math.hypot(dx, dy), 1);
        botEyes.style.translate = `${(dx * Math.min(k, .05)).toFixed(2)}px ${(dy * Math.min(k, .05)).toFixed(2)}px`;
      });
    }, { passive: true });
  }

  /* ---------- Robot: drag, throw, fly home ---------- */
  const bot = $('.bot');
  const botWrap = bot && bot.closest('.avatar-wrap');
  if (bot && botWrap) {
    // invisible twin that keeps the robot's seat measurable while it roams the page
    const home = document.createElement('div');
    home.className = 'bot-home';
    home.setAttribute('aria-hidden', 'true');
    botWrap.insertBefore(home, bot);

    const GRAVITY = 2400;
    const MAX_SPEED = 3200;
    let state = 'home'; // home | held | flying | resting | returning
    let x = 0, y = 0, w = 0, h = 0, vx = 0, vy = 0, rot = 0, vr = 0;
    let downX = 0, downY = 0, grabX = 0, grabY = 0, moved = false;
    let samples = [], raf = 0, last = 0, restTimer = 0, ret = null;

    const normDeg = (d) => ((d % 360) + 540) % 360 - 180;
    const render = () => { bot.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`; };
    const setState = (s) => {
      state = s;
      bot.classList.toggle('is-free', s !== 'home');
      bot.classList.toggle('is-excited', s === 'held' || s === 'flying' || s === 'returning');
    };
    const homeInView = () => {
      const r = home.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    // fixed positioning breaks inside the transformed hero, so the robot moves to <body> while free
    const detach = () => {
      botWrap.classList.add('bot-away');
      const r = home.getBoundingClientRect();
      x = r.left; y = r.top; w = r.width; h = r.height; rot = 0;
      Object.assign(bot.style, { position: 'fixed', top: '0', left: '0', right: 'auto', width: `${w}px`, zIndex: '60' });
      document.body.appendChild(bot);
      render();
    };
    const attach = () => {
      bot.removeAttribute('style');
      botWrap.appendChild(bot);
      botWrap.classList.remove('bot-away');
      setState('home');
    };

    const velocity = (now) => {
      const recent = samples.filter((p) => now - p.t < 100);
      if (recent.length < 2) return { vx: 0, vy: 0 };
      const a = recent[0], b = recent[recent.length - 1];
      const dt = Math.max((b.t - a.t) / 1000, 1 / 120);
      return { vx: (b.x - a.x) / dt, vy: (b.y - a.y) / dt };
    };

    const settle = () => {
      setState('resting');
      vx = vy = vr = 0; rot = 0;
      clearTimeout(restTimer);
      const check = () => {
        if (state !== 'resting') return;
        if (homeInView()) startReturn();
        else restTimer = setTimeout(check, 1000);
      };
      restTimer = setTimeout(check, 4000);
    };

    const startReturn = () => {
      ret = { x0: x, y0: y, r0: normDeg(rot), t0: performance.now(), dur: 950 };
      setState('returning');
      loop();
    };

    // physics in viewport space; collide with the visible robot, not the svg's empty margins
    const physics = (dt) => {
      const W = document.documentElement.clientWidth;
      const H = window.innerHeight;
      vy += GRAVITY * dt;
      x += vx * dt; y += vy * dt; rot += vr * dt;
      const l = x + w * 0.2, r = x + w * 0.9, t = y, b = y + h * 0.86;
      let floor = false;
      if (b >= H) {
        y -= b - H; floor = true;
        if (vy > 0) vy = Math.abs(vy) < 140 ? 0 : -vy * 0.5;
        rot = normDeg(rot);
      }
      if (t < 0) { y -= t; if (vy < 0) vy = -vy * 0.5; }
      if (l < 0) { x -= l; if (vx < 0) { vx = -vx * 0.6; vr = -vr * 0.8; } }
      if (r > W) { x -= r - W; if (vx > 0) { vx = -vx * 0.6; vr = -vr * 0.8; } }
      if (floor && vy === 0) {
        vx *= Math.pow(0.02, dt);
        vr = 0;
        rot += -rot * Math.min(1, dt * 10); // get back on its feet
        if (Math.abs(vx) < 12 && Math.abs(rot) < 1.5) settle();
      } else {
        vr *= Math.pow(0.6, dt);
      }
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (state === 'held') {
        // dangle: the body swings against the direction it is dragged
        const target = Math.max(-28, Math.min(28, velocity(now).vx * 0.02));
        rot += (target - rot) * Math.min(1, dt * 10);
      } else if (state === 'flying') {
        physics(dt);
      } else if (state === 'returning') {
        const k = Math.min(1, (now - ret.t0) / ret.dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const r = home.getBoundingClientRect(); // follow the seat even if the page scrolls
        x = ret.x0 + (r.left - ret.x0) * e;
        y = ret.y0 + (r.top - ret.y0) * e - Math.sin(Math.PI * k) * 140;
        rot = ret.r0 * (1 - e);
        if (k === 1) { raf = 0; attach(); return; }
      }
      render();
      raf = state === 'held' || state === 'flying' || state === 'returning' ? requestAnimationFrame(tick) : 0;
    };
    const loop = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const poke = () => {
      if (state === 'home') {
        bot.classList.remove('is-poked');
        void bot.getBoundingClientRect(); // restart the hop animation
        bot.classList.add('is-poked');
      } else if (state === 'resting') {
        clearTimeout(restTimer);
        vx = (Math.random() - 0.5) * 400; vy = -950; vr = vx * 0.5;
        setState('flying');
        loop();
      }
    };
    bot.addEventListener('animationend', (e) => {
      if (e.animationName === 'bot-hop') bot.classList.remove('is-poked');
    });

    const onMove = (e) => {
      if (!moved) {
        if (Math.hypot(e.clientX - downX, e.clientY - downY) < 5) return;
        moved = true;
        clearTimeout(restTimer);
        if (state === 'home') detach();
        grabX = downX - x; grabY = downY - y;
        samples = [];
        setState('held');
        root.classList.add('bot-dragging');
        loop();
      }
      x = e.clientX - grabX; y = e.clientY - grabY;
      samples.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
      if (samples.length > 12) samples.shift();
    };
    const onUp = (e) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      root.classList.remove('bot-dragging');
      if (!moved) { poke(); return; }
      if (reduceMotion) { attach(); return; }
      const v = velocity(e.timeStamp);
      const speed = Math.hypot(v.vx, v.vy);
      const k = speed > MAX_SPEED ? MAX_SPEED / speed : 1;
      vx = v.vx * k; vy = v.vy * k; vr = vx * 0.5;
      setState('flying');
      loop();
    };

    $('.bot-body', bot).addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      downX = e.clientX; downY = e.clientY; moved = false;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });

    window.addEventListener('resize', () => {
      if (state === 'resting') { setState('flying'); loop(); }
    });

    // one-time hint so visitors know the robot can be grabbed
    setTimeout(() => {
      if (state !== 'home') return;
      bot.classList.add('hint');
      setTimeout(() => bot.classList.remove('hint'), 3200);
    }, 2600);
  }

  /* ---------- Code window: stagger line reveal ---------- */
  $$('.code-body .line').forEach((line, i) => line.style.setProperty('--i', i));

  /* ---------- Count-up numbers ---------- */
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const fmt = (n) => n.toLocaleString('en-US');
    if (reduceMotion || !target) { el.textContent = fmt(target); return; }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      $$('[data-count]', el).forEach(countUp);
      const delay = parseInt(getComputedStyle(el).getPropertyValue('--d'), 10) || 0;
      setTimeout(() => el.classList.add('done'), delay + 850);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => revealObserver.observe(el));

  /* ---------- Card spotlight ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest?.('.card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---------- Project filter ---------- */
  const filters = $$('.filter[data-filter]');
  const projects = $$('.project');
  const matches = (p, f) => f === 'all' || p.dataset.cat.split(' ').includes(f);

  filters.forEach((btn) => {
    const count = projects.filter((p) => matches(p, btn.dataset.filter)).length;
    $('.count', btn).textContent = count;
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      projects.forEach((p) => {
        const show = matches(p, f);
        p.classList.toggle('is-hidden', !show);
        if (show && !reduceMotion) {
          p.classList.remove('pop');
          void p.offsetWidth; // restart animation
          p.classList.add('pop');
        }
      });
    });
  });

  /* ---------- Certificate lightbox ---------- */
  const dialog = $('#cert-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const img = $('img', dialog);
    $$('[data-cert]').forEach((btn) => btn.addEventListener('click', () => {
      img.src = btn.dataset.cert;
      img.alt = btn.dataset.alt || '';
      dialog.showModal();
    }));
    $('[data-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  } else {
    // very old browsers: just open the image
    $$('[data-cert]').forEach((btn) => btn.addEventListener('click', () => window.open(btn.dataset.cert, '_blank')));
  }

  /* ---------- Copy email ---------- */
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const label = $('.copy-label', btn);
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.classList.add('copied');
      label.textContent = 'Copied!';
      setTimeout(() => { btn.classList.remove('copied'); label.textContent = 'Copy email'; }, 1800);
    } catch (e) {
      window.location.href = `mailto:${btn.dataset.copy}`;
    }
  }));

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Neural network background ---------- */
  const canvas = $('#neural');
  const hero = $('[data-hero]');
  if (canvas && hero && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const LINK_DIST = 130;
    const MOUSE_DIST = 180;
    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let nodes = [];
    let nodeRGB = '45, 212, 191';
    let linkRGB = '56, 189, 248';
    let raf = null;
    let visible = true;

    const readColors = () => {
      const cs = getComputedStyle(root);
      nodeRGB = cs.getPropertyValue('--node-rgb').trim() || nodeRGB;
      linkRGB = cs.getPropertyValue('--link-rgb').trim() || linkRGB;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.max(34, Math.min(120, (w * h) / 13000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        r: Math.random() * 1.7 + 0.8,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      for (let a = 0; a < nodes.length; a++) {
        const p = nodes[a];
        for (let b = a + 1; b < nodes.length; b++) {
          const q = nodes[b];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const o = (1 - Math.sqrt(d2) / LINK_DIST) * 0.38;
            ctx.strokeStyle = `rgba(${linkRGB}, ${o})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (md < MOUSE_DIST) {
          ctx.strokeStyle = `rgba(${nodeRGB}, ${(1 - md / MOUSE_DIST) * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${nodeRGB}, 0.85)`;
      for (const p of nodes) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const update = () => {
      for (const p of nodes) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) { p.vx *= -1; p.x = Math.max(0, Math.min(w, p.x)); }
        if (p.y < 0 || p.y > h) { p.vy *= -1; p.y = Math.max(0, Math.min(h, p.y)); }
        // gentle pull toward the cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_DIST && d > 1) {
          p.x += (dx / d) * 0.18;
          p.y += (dy / d) * 0.18;
        }
      }
    };

    const loop = () => {
      update();
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && visible && !document.hidden && !reduceMotion) raf = requestAnimationFrame(loop); };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = null; };

    readColors();
    resize();
    draw();

    themeListeners.push(() => { readColors(); if (!raf) draw(); });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); draw(); }, 150);
    });

    hero.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    }).observe(hero);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    start();
  }
})();
