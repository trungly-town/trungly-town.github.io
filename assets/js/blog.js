(() => {
  'use strict';

  /*
   * Blog — renders blog.html (the post list) and post.html?slug=<slug> (one post)
   * from window.POSTS (posts/posts.js) and the Markdown files in posts/.
   */
  const listEl = document.getElementById('post-list');
  const heroEl = document.getElementById('post-hero');
  const bodyEl = document.getElementById('post-body');
  if (!listEl && !heroEl) return;

  // loaded on demand, only when a post has code or math
  const LIBS = {
    highlight: {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
      integrity: 'sha384-F/bZzf7p3Joyp5psL90p/p89AZJsndkSoGwRpXcZhleCWhd8SnRuoYo4d0yirjJp',
    },
    katex: {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js',
      integrity: 'sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8',
    },
    katexCss: {
      href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css',
      integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
    },
  };

  // pages built by tools/build-pages.mjs live two folders down and set data-root="../../"
  const ROOT = document.documentElement.dataset.root || '';
  const STATIC = window.STATIC_PAGES || {};
  const isLocal = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const posts = (window.POSTS || [])
    .filter((p) => isLocal || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));

  const esc = (v) => String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const icon = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  // the shareable page when it has been built, otherwise the template page
  const postUrl = (p) => ((STATIC.posts || []).includes(p.slug)
    ? `${ROOT}blog/${p.slug}/`
    : `${ROOT}post.html?slug=${encodeURIComponent(p.slug)}`);
  const tagUrl = (t) => `${ROOT}blog.html?tag=${encodeURIComponent(t)}`;
  const fmtDate = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  // accent-insensitive, so "dữ liệu" matches "du lieu"
  const fold = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const slugify = (s) => fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
  const readingTime = (md) => {
    const words = md.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  };
  const fetchPost = (p) => fetch(`${ROOT}posts/${encodeURIComponent(p.slug)}.md`).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.text();
  });

  const loadScript = ({ src, integrity }) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    Object.assign(s, { src, integrity, crossOrigin: 'anonymous', onload: resolve, onerror: reject });
    document.head.appendChild(s);
  });
  const loadCss = ({ href, integrity }) => {
    const l = document.createElement('link');
    Object.assign(l, { rel: 'stylesheet', href, integrity, crossOrigin: 'anonymous' });
    document.head.appendChild(l);
  };

  const copyText = (text, btn) => {
    const label = btn.querySelector('span');
    const original = label.textContent;
    const done = (msg) => {
      label.textContent = msg;
      btn.classList.add('copied');
      setTimeout(() => { label.textContent = original; btn.classList.remove('copied'); }, 1600);
    };
    if (!navigator.clipboard) return done('Press Ctrl+C');
    navigator.clipboard.writeText(text).then(() => done('Copied!'), () => done('Copy failed'));
  };

  /* =========================================================
     Blog index
     ========================================================= */
  if (listEl) {
    const searchEl = document.getElementById('post-search');
    const filtersEl = document.getElementById('post-filters');
    const toolsEl = document.getElementById('post-tools');
    const emptyEl = document.getElementById('post-empty');
    const times = {};
    let tag = new URLSearchParams(location.search).get('tag') || 'all';
    let query = '';

    const tags = [...new Set(posts.flatMap((p) => p.tags || []))].sort((a, b) => a.localeCompare(b));
    if (!tags.includes(tag)) tag = 'all';

    const card = (p, i) => `
      <article class="post-card card${i === 0 && tag === 'all' && !query ? ' featured' : ''}" style="--i:${i}">
        <div class="post-meta">
          <time datetime="${esc(p.date)}">${fmtDate(p.date)}</time>
          <span class="rt" data-rt="${esc(p.slug)}">${times[p.slug] ? `${times[p.slug]} min read` : ''}</span>
          ${p.draft ? '<span class="badge draft">Draft</span>' : ''}
        </div>
        <h2><a class="stretched" href="${postUrl(p)}">${esc(p.title)}</a></h2>
        <p>${esc(p.summary)}</p>
        <ul class="tags">${(p.tags || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <span class="read-more" aria-hidden="true">Read post ${icon('arrow-right')}</span>
      </article>`;

    const render = () => {
      const q = fold(query.trim());
      const shown = posts.filter((p) => (tag === 'all' || (p.tags || []).includes(tag))
        && (!q || fold([p.title, p.summary, ...(p.tags || [])].join(' ')).includes(q)));
      listEl.innerHTML = shown.map(card).join('');
      emptyEl.hidden = shown.length > 0;
    };

    if (!posts.length) {
      toolsEl.hidden = true;
      emptyEl.innerHTML = `${icon('book')}<p><strong>First posts are on the way.</strong> Check back soon.</p>`;
    } else {
      const counts = (t) => posts.filter((p) => (p.tags || []).includes(t)).length;
      filtersEl.innerHTML = [['all', 'All', posts.length], ...tags.map((t) => [t, t, counts(t)])]
        .map(([value, label, n]) => `<button class="filter" type="button" data-tag="${esc(value)}" aria-pressed="${value === tag}">${esc(label)}<span class="count">${n}</span></button>`)
        .join('');

      filtersEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-tag]');
        if (!btn) return;
        tag = btn.dataset.tag;
        filtersEl.querySelectorAll('[data-tag]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        history.replaceState(null, '', tag === 'all' ? location.pathname : `?tag=${encodeURIComponent(tag)}`);
        render();
      });
      searchEl.addEventListener('input', () => { query = searchEl.value; render(); });
      // "/" jumps to search, like on GitHub
      document.addEventListener('keydown', (e) => {
        if (e.key !== '/' || e.target.closest('input, textarea, [contenteditable]')) return;
        e.preventDefault();
        searchEl.focus();
      });

      // reading time needs the Markdown; fill it in as each file arrives
      posts.forEach((p) => fetchPost(p).then((md) => {
        times[p.slug] = readingTime(md);
        const el = listEl.querySelector(`[data-rt="${CSS.escape(p.slug)}"]`);
        if (el) el.textContent = `${times[p.slug]} min read`;
      }).catch(() => {}));
    }
    render();
  }

  /* =========================================================
     Single post
     ========================================================= */
  if (heroEl && bodyEl) {
    const slug = document.body.dataset.slug || new URLSearchParams(location.search).get('slug');
    const index = posts.findIndex((p) => p.slug === slug);

    if (index === -1) {
      document.title = 'Post not found — Ly Minh Trung';
      heroEl.innerHTML = `
        <a class="crumb reveal" href="${ROOT}blog.html">${icon('arrow-left')} All posts</a>
        <h1 class="ph-title reveal" style="margin-top:32px">Post not found</h1>
        <p class="ph-lead reveal" style="margin-top:16px">That post doesn't exist (yet) — here's what is published.</p>`;
      bodyEl.innerHTML = posts.length ? `
        <div class="pn-nav pn-all">
          ${posts.map((p) => `
            <a class="pn card" href="${postUrl(p)}">
              <span class="pn-label">${icon('book')} ${fmtDate(p.date)}</span>
              <span class="pn-title">${esc(p.title)}</span>
            </a>`).join('')}
        </div>
        <div class="back-all"><a class="btn btn-ghost" href="${ROOT}blog.html">${icon('grid')} All posts</a></div>` : '';
      return;
    }

    const p = posts[index];
    const newer = posts[index - 1];
    const older = posts[index + 1];

    /* ---------- Head ---------- */
    document.title = `${p.title} — Ly Minh Trung (Philip)`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', p.summary);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', p.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', p.summary);

    heroEl.innerHTML = `
      <a class="crumb reveal" href="${ROOT}blog.html">${icon('arrow-left')} All posts</a>
      <div class="post-head">
        <ul class="ph-cats reveal" style="--d:60ms">${(p.tags || []).map((t) => `<li><a href="${tagUrl(t)}">${esc(t)}</a></li>`).join('')}</ul>
        <h1 class="ph-title reveal" style="--d:120ms">${esc(p.title)}</h1>
        <p class="ph-lead reveal" style="--d:180ms">${esc(p.summary)}</p>
        <div class="byline reveal" style="--d:240ms">
          <span class="byline-avatar"><img src="${ROOT}assets/img/avatar.png" width="308" height="308" alt=""></span>
          <div>
            <strong>Ly Minh Trung <span class="muted">(Philip)</span></strong>
            <span class="byline-meta">
              <time datetime="${esc(p.date)}">${fmtDate(p.date)}</time>
              <span class="rt" id="post-rt"></span>
              ${p.draft ? '<span class="badge draft">Draft — hidden on the live site</span>' : ''}
            </span>
          </div>
        </div>
      </div>`;

    bodyEl.innerHTML = '<p class="post-loading" role="status"><span class="spinner" aria-hidden="true"></span> Loading post…</p>';

    /* ---------- Markdown → HTML ---------- */
    const markdownToHtml = (md) => {
      const stash = [];
      const keep = (s) => `\u0000${stash.push(s) - 1}\u0000`;
      // code first, so "$" inside code is never read as math
      let src = md
        .replace(/\r\n?/g, '\n')
        .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, keep)
        .replace(/``[^\n]+?``/g, keep)
        .replace(/`[^`\n]+`/g, keep)
        .replace(/\\\$/g, 'KTXDOLLAR');

      // pull math out before Markdown can mangle its backslashes and underscores;
      // "$5 and $10" stays text: a digit right after an opening "$" or after a closing "$" is not math
      const math = [];
      src = src
        .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => `KTXMATH${math.push({ tex: tex.trim(), display: true }) - 1}X`)
        .replace(/\$(?=[^\s\d$])([^$\n]*?[^\s$])\$(?!\d)/g, (_, tex) => `KTXMATH${math.push({ tex, display: false }) - 1}X`)
        .replace(/\u0000(\d+)\u0000/g, (_, i) => stash[i]);

      const html = window.marked.parse(src)
        .replace(/KTXMATH(\d+)X/g, (_, i) => {
          const { tex, display } = math[i];
          return `<span class="math${display ? ' math-display' : ''}" data-tex="${esc(tex)}">${esc(display ? `$$${tex}$$` : `$${tex}$`)}</span>`;
        })
        .replace(/KTXDOLLAR/g, '$');
      return { html, hasMath: math.length > 0 };
    };

    /* ---------- Enhance the rendered article ---------- */
    const CALLOUTS = {
      NOTE: ['Note', 'info'],
      TIP: ['Tip', 'sparkles'],
      IMPORTANT: ['Important', 'shield'],
      WARNING: ['Warning', 'alert'],
      CAUTION: ['Caution', 'alert'],
    };

    const enhance = (root) => {
      // headings: stable ids, a hover anchor, and the text the TOC shows
      const used = new Set();
      root.querySelectorAll('h2, h3').forEach((h) => {
        const base = slugify(h.textContent);
        let id = base;
        for (let n = 2; used.has(id) || document.getElementById(id); n += 1) id = `${base}-${n}`;
        used.add(id);
        h.id = id;
        h.dataset.toc = h.textContent.trim();
        h.insertAdjacentHTML('beforeend', `<a class="h-anchor" href="#${id}" aria-label="Link to this section">#</a>`);
      });

      // GitHub-style callouts: "> [!NOTE]"
      root.querySelectorAll('blockquote').forEach((bq) => {
        const first = bq.querySelector('p');
        const m = first && first.innerHTML.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br>)?\s*/i);
        if (!m) return;
        const kind = m[1].toUpperCase();
        first.innerHTML = first.innerHTML.slice(m[0].length);
        if (!first.innerHTML.trim()) first.remove();
        bq.classList.add('callout', `callout-${kind.toLowerCase()}`);
        bq.insertAdjacentHTML('afterbegin', `<p class="callout-title">${icon(CALLOUTS[kind][1])} ${CALLOUTS[kind][0]}</p>`);
      });

      // code blocks: language label + copy button
      root.querySelectorAll('pre > code').forEach((code) => {
        const pre = code.parentElement;
        const lang = (code.className.match(/language-([\w+#.-]+)/) || [])[1] || 'text';
        const block = document.createElement('div');
        block.className = 'code-block';
        block.innerHTML = `<div class="code-head"><span class="code-lang">${esc(lang)}</span><button class="code-copy" type="button">${icon('copy')}<span>Copy</span></button></div>`;
        pre.replaceWith(block);
        block.appendChild(pre);
        block.querySelector('.code-copy').addEventListener('click', (e) => copyText(code.textContent, e.currentTarget));
      });

      // wide tables scroll sideways instead of breaking the layout
      root.querySelectorAll('table').forEach((table) => {
        const wrap = document.createElement('div');
        wrap.className = 'table-wrap';
        table.replaceWith(wrap);
        wrap.appendChild(table);
      });

      // images: paths are relative to posts/; a title becomes a caption
      root.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src') || '';
        if (!/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(src)) img.setAttribute('src', `${ROOT}posts/${src}`);
        img.loading = 'lazy';
        img.decoding = 'async';
        const parent = img.parentElement;
        if (img.title && parent.tagName === 'P' && parent.childNodes.length === 1) {
          const fig = document.createElement('figure');
          parent.replaceWith(fig);
          fig.appendChild(img);
          fig.insertAdjacentHTML('beforeend', `<figcaption>${esc(img.title)}</figcaption>`);
        }
      });

      // external links open in a new tab
      root.querySelectorAll('a[href]').forEach((a) => {
        try {
          if (new URL(a.href, location.href).origin !== location.origin) { a.target = '_blank'; a.rel = 'noopener'; }
        } catch (e) { /* malformed href: leave it */ }
      });
    };

    /* ---------- "On this page" ---------- */
    const buildToc = (root) => {
      const toc = document.getElementById('toc');
      const heads = [...root.querySelectorAll('h2, h3')];
      if (!toc || heads.length < 2) return;
      toc.querySelector('ol').innerHTML = heads
        .map((h) => `<li class="toc-${h.tagName.toLowerCase()}"><a href="#${h.id}">${esc(h.dataset.toc)}</a></li>`)
        .join('');
      toc.hidden = false;

      const links = [...toc.querySelectorAll('a')];
      let ticking = false;
      const spy = () => {
        ticking = false;
        let current = 0;
        heads.forEach((h, i) => { if (h.getBoundingClientRect().top < 140) current = i; });
        links.forEach((a, i) => a.classList.toggle('active', i === current));
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(spy); ticking = true; }
      }, { passive: true });
      spy();
    };

    /* ---------- Code highlighting & math, loaded only when needed ---------- */
    const decorate = (root, hasMath) => {
      const codes = root.querySelectorAll('pre > code[class*="language-"]');
      if (codes.length) {
        loadScript(LIBS.highlight).then(() => {
          window.hljs.configure({ ignoreUnescapedHTML: true });
          codes.forEach((c) => window.hljs.highlightElement(c));
        }).catch(() => { /* plain code is still readable */ });
      }
      if (hasMath) {
        loadCss(LIBS.katexCss);
        loadScript(LIBS.katex).then(() => {
          root.querySelectorAll('.math').forEach((el) => {
            window.katex.render(el.dataset.tex, el, { displayMode: el.classList.contains('math-display'), throwOnError: false });
          });
        }).catch(() => { /* the TeX source stays visible */ });
      }
    };

    /* ---------- Footer: share, author, more posts ---------- */
    // share the page link previews can read, even when reading the post through post.html?slug=…
    const pageUrl = new URL(postUrl(p), location.href).href;
    const footer = () => `
      <footer class="post-foot">
        <div class="share">
          <span class="share-label">Share this post</span>
          <button class="share-btn" type="button" data-copy-link>${icon('copy')}<span>Copy link</span></button>
          <a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener">${icon('linkedin')}<span>LinkedIn</span></a>
          <a class="share-btn" href="mailto:?subject=${encodeURIComponent(p.title)}&amp;body=${encodeURIComponent(`${p.summary}\n\n${pageUrl}`)}">${icon('mail')}<span>Email</span></a>
        </div>

        <div class="author card">
          <span class="byline-avatar lg"><img src="${ROOT}assets/img/avatar.png" width="308" height="308" alt=""></span>
          <div>
            <p class="author-name">Ly Minh Trung <span class="muted">(Philip)</span></p>
            <p class="author-bio">Data Scientist (AI) at Manulife — I build Agentic RAG assistants and measure what GenAI is really worth.</p>
            <div class="author-links">
              <a class="icon-btn" href="https://www.linkedin.com/in/trung-minh-ly-46b17220b/" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin')}</a>
              <a class="icon-btn" href="https://github.com/trungly-town" target="_blank" rel="noopener" aria-label="GitHub">${icon('github')}</a>
              <a class="icon-btn" href="mailto:trung3566@gmail.com" aria-label="Email">${icon('mail')}</a>
              <a class="read-more" href="${ROOT}index.html">More about me ${icon('arrow-right')}</a>
            </div>
          </div>
        </div>

        ${newer || older ? `
        <nav class="pn-nav" aria-label="More posts">
          ${newer ? `<a class="pn card prev" href="${postUrl(newer)}"><span class="pn-label">${icon('arrow-left')} Newer post</span><span class="pn-title">${esc(newer.title)}</span></a>` : '<span></span>'}
          ${older ? `<a class="pn card next" href="${postUrl(older)}"><span class="pn-label">Older post ${icon('arrow-right')}</span><span class="pn-title">${esc(older.title)}</span></a>` : ''}
        </nav>` : ''}

        <div class="back-all"><a class="btn btn-ghost" href="${ROOT}blog.html">${icon('grid')} All posts</a></div>
      </footer>`;

    const fail = (why) => {
      const hint = location.protocol === 'file:'
        ? 'Browsers block pages opened straight from disk from reading the post. Double-click <code>preview.command</code> in the site folder to open it through a local server (or run <code>python3 -m http.server 8000</code> and go to <code>http://localhost:8000</code>).'
        : 'Please refresh the page, or try again in a moment.';
      bodyEl.innerHTML = `
        <div class="post-error card">
          <h2>Couldn't load this post</h2>
          <p>${hint}</p>
          <p class="muted">(${esc(why)})</p>
          <a class="btn btn-ghost" href="${ROOT}blog.html">${icon('arrow-left')} All posts</a>
        </div>`;
    };

    if (!window.marked) {
      fail('the Markdown renderer did not load');
    } else {
      fetchPost(p).then((md) => {
        const { html, hasMath } = markdownToHtml(md);
        document.getElementById('post-rt').textContent = `${readingTime(md)} min read`;
        bodyEl.innerHTML = `
          <div class="post-layout">
            <article class="post-content"${p.lang ? ` lang="${esc(p.lang)}"` : ''}>${html}</article>
            <aside class="toc" id="toc" aria-label="On this page" hidden>
              <p class="toc-title">On this page</p>
              <ol></ol>
            </aside>
          </div>
          ${footer()}`;
        const article = bodyEl.querySelector('.post-content');
        enhance(article);
        buildToc(article);
        decorate(article, hasMath);
        bodyEl.querySelector('[data-copy-link]').addEventListener('click', (e) => copyText(pageUrl, e.currentTarget));
        // honour a #section in the URL now that the headings exist
        if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
      }).catch((err) => fail(err.message));
    }
  }
})();
