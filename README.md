# trungly-town.github.io

Personal landing page of **Ly Minh Trung** — Senior Data Scientist (AI) in Manulife's AI & Enterprise Data Office.

**Live:** https://trungly-town.github.io

Plain HTML, CSS and JavaScript — no build step. The blog loads a Markdown parser, code highlighter and math renderer from a CDN.

```
index.html                  landing page
project.html                project detail template (project.html?id=<id>)
blog.html                   blog: list of posts with search and topic filters
post.html                   blog post template (post.html?slug=<slug>)
posts/                      blog posts in Markdown + posts.js (the list of posts)
blog/<slug>/, projects/<id>/  shareable pages for link previews — generated, don't edit
tools/build-pages.mjs       generates those pages, assets/og/ preview images and assets/js/static-pages.js
tools/og/card.html          design of the 1200×630 preview images
assets/js/projects-data.js  content of every project detail page
assets/js/project.js        renders a project from projects-data.js
assets/js/main.js           neural-network hero, typing effect, filters, lightbox
assets/js/blog.js           renders the blog list and posts (Markdown, code, math, TOC)
assets/css/style.css        styles (dark / light themes)
assets/img/                 avatar, favicon, certificates
assets/TrungLy-CV.pdf       downloadable resume
```

## Editing projects

Each project page is an entry in `assets/js/projects-data.js` (field guide at the top of the file).
To add a project: add an entry there, add a card on `index.html` whose title links to
`projects/<your-id>/`, then run `node tools/build-pages.mjs` (see *Link previews*).

## Writing blog posts

Posts are Markdown files in `posts/`, listed in `posts/posts.js` (field guide at the top of the file).

1. Write `posts/<slug>.md`. Images go in `posts/images/` and are linked as `images/<file>.png`.
2. Add an entry to `posts/posts.js` with the same `slug`, a `date`, `summary` and `tags`.
3. Preview locally (see below). Entries with `draft: true` show only on localhost, never on the live site.
4. When it's ready to publish, remove `draft: true` and run `node tools/build-pages.mjs` (see *Link previews*).

Besides normal Markdown you get highlighted code (```` ```python ````), math (`$inline$`, `$$display$$`; write `\$` for a
dollar sign), callouts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`) and an automatic "On this page" menu built from `##` headings.

## Link previews (LinkedIn, Facebook, X, Zalo…)

Those crawlers don't run JavaScript, so `node tools/build-pages.mjs` writes a real page for every published post
(`blog/<slug>/`) and project (`projects/<id>/`) with its own title, description and a 1200×630 image in `assets/og/`.
The site links to those pages automatically once they exist. Run it after adding or editing a post or project:

```bash
node tools/build-pages.mjs              # pages + images (needs Google Chrome, ~15 s)
node tools/build-pages.mjs --no-images  # pages only
node tools/build-pages.mjs --drafts     # also draft posts, to preview their image locally
```

LinkedIn caches previews: after deploying, paste the link into https://www.linkedin.com/post-inspector/ to refresh it.

## Run locally

Double-click `preview.command` (macOS), or run:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Opening the HTML files directly (file://) works for most pages, but not for blog posts: browsers block a page
opened from disk from reading the Markdown files.

## Deploy

Push to a repository named `trungly-town.github.io`, then in **Settings → Pages** choose
*Deploy from a branch* → `main` / `(root)`.
