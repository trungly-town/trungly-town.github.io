(() => {
  'use strict';

  const projects = window.PROJECTS || [];
  const heroEl = document.getElementById('project-hero');
  const bodyEl = document.getElementById('project-body');
  if (!heroEl || !bodyEl) return;

  const CATS = {
    genai: 'GenAI & Agents',
    analytics: 'Analytics & Causal',
    data: 'Data Engineering',
    ml: 'ML & Deep Learning',
  };

  const esc = (v) => String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const icon = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const pad = (n) => String(n).padStart(2, '0');
  // pages built by tools/build-pages.mjs live two folders down and set data-root="../../"
  const ROOT = document.documentElement.dataset.root || '';
  const STATIC = window.STATIC_PAGES || {};
  const link = (p) => ((STATIC.projects || []).includes(p.id)
    ? `${ROOT}projects/${p.id}/`
    : `${ROOT}project.html?id=${encodeURIComponent(p.id)}`);
  const list = (items, cls = '') => `<ul class="${cls}">${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

  const id = document.body.dataset.id || new URLSearchParams(window.location.search).get('id');
  const index = projects.findIndex((p) => p.id === id);

  /* ---------- Not found ---------- */
  if (index === -1) {
    document.title = 'Project not found — Ly Minh Trung';
    heroEl.innerHTML = `
      <a class="crumb reveal" href="${ROOT}index.html#projects">${icon('arrow-left')} All projects</a>
      <h1 class="ph-title reveal" style="margin-top:32px">Project not found</h1>
      <p class="ph-lead reveal" style="margin-top:16px">That project doesn't exist — pick one below instead.</p>`;
    bodyEl.innerHTML = `
      <div class="pn-nav pn-all">
        ${projects.map((p) => `
          <a class="pn card reveal" href="${link(p)}">
            <span class="pn-label">${icon(p.icon)} ${esc(p.org)}</span>
            <span class="pn-title">${esc(p.title)}</span>
          </a>`).join('')}
      </div>
      <div class="back-all">
        <a class="btn btn-ghost" href="${ROOT}index.html#projects">${icon('grid')} All projects</a>
      </div>`;
    return;
  }

  const p = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  /* ---------- Head ---------- */
  document.title = `${p.title} — Ly Minh Trung (Philip)`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', p.summary);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${p.title} — Ly Minh Trung`);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', p.summary);

  const catChips = (p.cats || []).map((c) => `<li>${esc(CATS[c] || c)}</li>`).join('');

  /* ---------- Hero ---------- */
  heroEl.innerHTML = `
    <a class="crumb reveal" href="${ROOT}index.html#projects">${icon('arrow-left')} All projects</a>
    <div class="ph-grid">
      <div>
        <div class="ph-top reveal" style="--d:60ms">
          <span class="ph-icon">${icon(p.icon)}</span>
          <div>
            <p class="ph-org">${esc(p.org)}</p>
            <ul class="ph-cats">${catChips}</ul>
          </div>
        </div>
        <h1 class="ph-title reveal" style="--d:120ms">${esc(p.title)}</h1>
        <p class="ph-kicker reveal" style="--d:180ms">${esc(p.kicker)}</p>
        <p class="ph-lead reveal" style="--d:240ms">${esc(p.summary)}</p>
        ${p.metrics ? `<dl class="ph-metrics reveal" style="--d:300ms">${p.metrics.map((m) => `<div><dt>${esc(m.value)}</dt><dd>${esc(m.label)}</dd></div>`).join('')}</dl>` : ''}
      </div>
      <dl class="ph-meta card reveal" style="--d:200ms">
        <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Organization</dt><dd>${esc(p.org)}${p.unit ? `<span class="muted"> · ${esc(p.unit)}</span>` : ''}</dd></div>
        <div><dt>Period</dt><dd>${esc(p.period)}</dd></div>
        <div><dt>Focus</dt><dd>${(p.cats || []).map((c) => esc(CATS[c] || c)).join(' · ')}</dd></div>
      </dl>
    </div>`;

  /* ---------- Sections ---------- */
  const overview = `
    <section class="d-section">
      <div class="overview-grid">
        <div class="reveal">
          <p class="kicker">The challenge</p>
          <h2 class="d-title">Why it was built</h2>
          <div class="prose">${(p.context || []).map((t) => `<p>${esc(t)}</p>`).join('')}</div>
        </div>
        <aside class="role-card card reveal" style="--d:100ms">
          <p class="kicker">My role</p>
          ${list(p.roleList || [], 'bullets')}
        </aside>
      </div>
    </section>`;

  const built = `
    <section class="d-section">
      <div class="reveal">
        <p class="kicker">What I built</p>
        <h2 class="d-title">Key components</h2>
      </div>
      <div class="built-grid">
        ${(p.built || []).map((b, i) => `
          <article class="built-card card reveal" style="--d:${(i % 3) * 80}ms">
            <span class="built-n">${pad(i + 1)}</span>
            <h3>${esc(b.title)}</h3>
            <p>${esc(b.text)}</p>
          </article>`).join('')}
      </div>
    </section>`;

  const visual = p.visual === 'did' ? `
    <section class="d-section">
      <div class="reveal">
        <p class="kicker">The idea</p>
        <h2 class="d-title">Difference-in-Differences, in one picture</h2>
      </div>
      <div class="did-wrap card reveal">
        <svg class="did" viewBox="0 0 560 262" role="img" aria-label="Illustrative chart. Before the GenAI rollout, adopters and non-adopters move in parallel. After it, adopters rise faster than their counterfactual path; that gap is the Difference-in-Differences effect.">
          <line class="did-axis" x1="40" y1="20" x2="40" y2="220"/>
          <line class="did-axis" x1="40" y1="220" x2="440" y2="220"/>
          <line class="did-roll" x1="240" y1="14" x2="240" y2="220"/>
          <text class="did-txt" x="248" y="28">GenAI rollout</text>
          <polyline class="did-control did-draw" points="40,190 440,150"/>
          <line class="did-cf" x1="240" y1="120" x2="440" y2="100"/>
          <polyline class="did-treated did-draw" points="40,140 240,120 440,40"/>
          <circle class="did-dot" cx="240" cy="120" r="5"/>
          <circle class="did-dot" cx="440" cy="40" r="5"/>
          <path class="did-gap" d="M452 40 h8 v60 h-8"/>
          <text class="did-txt strong" x="468" y="66">DiD</text>
          <text class="did-txt strong" x="468" y="86">effect</text>
          <text class="did-txt muted" x="140" y="248" text-anchor="middle">Before</text>
          <text class="did-txt muted" x="340" y="248" text-anchor="middle">After</text>
          <text class="did-txt muted" x="20" y="120" text-anchor="middle" transform="rotate(-90 20 120)">Outcome</text>
        </svg>
        <div>
          <ul class="did-legend">
            <li><span class="sw treated"></span>Adopters (treatment)</li>
            <li><span class="sw control"></span>Non-adopters (control)</li>
            <li><span class="sw cf"></span>Adopters had they not used GenAI (counterfactual)</li>
            <li><span class="sw gap"></span>The gap = value attributable to GenAI</li>
          </ul>
          <p class="did-caption">Illustrative only — not real data.</p>
        </div>
      </div>
    </section>` : '';

  const steps = (p.flow && p.flow.steps) || [];
  const flow = steps.length ? `
    <section class="d-section">
      <div class="reveal">
        <p class="kicker">${esc((p.flow && p.flow.kicker) || 'How it works')}</p>
        <h2 class="d-title">${esc((p.flow && p.flow.heading) || 'From input to outcome')}</h2>
      </div>
      <ol class="pipeline" style="--n:${steps.length}">
        ${steps.map((s, i) => `
          <li class="step card reveal${s.core ? ' core' : ''}" style="--d:${i * 90}ms">
            <span class="step-n">${pad(i + 1)}</span>
            <h3>${esc(s.label)}</h3>
            <p>${esc(s.text)}</p>
            ${s.chips ? list(s.chips, 'step-chips') : ''}
          </li>`).join('')}
      </ol>
    </section>` : '';

  const outcome = `
    <section class="d-section">
      <div class="outcome-grid">
        <div class="reveal">
          <p class="kicker">Why it matters</p>
          <h2 class="d-title">The value</h2>
          <ul class="value-list">
            ${(p.value || []).map((v) => `<li><span class="vi">${icon('check')}</span><span>${esc(v)}</span></li>`).join('')}
          </ul>
        </div>
        <div class="stack-card card reveal" style="--d:100ms">
          <p class="kicker">Methods &amp; stack</p>
          ${list(p.stack || [], 'chips-list stack-chips')}
        </div>
      </div>
      ${p.confidential ? `
        <p class="note reveal">${icon('lock')}
          <span>Built at ${esc(p.org)}. Code and data are proprietary, so this page describes the system rather than sharing it.</span>
        </p>` : ''}
    </section>`;

  const pager = `
    <nav class="pn-nav" aria-label="More projects">
      <a class="pn card reveal" href="${link(prev)}">
        <span class="pn-label">${icon('arrow-left')} Previous</span>
        <span class="pn-title">${esc(prev.title)}</span>
        <span class="pn-org">${esc(prev.org)}</span>
      </a>
      <a class="pn next card reveal" href="${link(next)}" style="--d:80ms">
        <span class="pn-label">Next ${icon('arrow-right')}</span>
        <span class="pn-title">${esc(next.title)}</span>
        <span class="pn-org">${esc(next.org)}</span>
      </a>
    </nav>
    <div class="back-all reveal">
      <a class="btn btn-ghost" href="${ROOT}index.html#projects">${icon('grid')} All projects</a>
    </div>`;

  bodyEl.innerHTML = overview + built + visual + flow + outcome + pager;
})();
