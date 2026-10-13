/*
 * Blog posts — listed on blog.html and rendered by assets/js/blog.js into blog/<slug>/ (and post.html?slug=<slug>).
 * Posts are sorted by date (newest first), so the order here does not matter.
 *
 * To publish a post
 *   1. Write it in Markdown at posts/<slug>.md
 *      (images go in posts/images/ and are linked as images/<file>.png).
 *   2. Add an entry below.
 *   3. When it's ready, remove `draft: true` and run `node tools/build-pages.mjs`
 *      (creates blog/<slug>/ and its preview image, so the link looks right on LinkedIn).
 *
 * Fields
 *   slug       file name without ".md" — also the URL: blog/<slug>/
 *   title      post title
 *   date       'YYYY-MM-DD'
 *   summary    one or two sentences, shown in the list and under the title
 *   tags[]     topics; they become the filter chips on blog.html
 *   lang       optional — 'vi' for a post written in Vietnamese (default: English)
 *   draft      optional — true keeps the post hidden on the live site;
 *              it still shows when you preview locally (localhost or a file)
 *
 * Markdown extras
 *   ```python fenced code (highlighted, with a copy button)
 *   $inline$ and $$display$$ math (KaTeX); write \$ for a literal dollar sign
 *   > [!NOTE] / [!TIP] / [!IMPORTANT] / [!WARNING] / [!CAUTION] callouts
 *   tables, images, and ## / ### headings (they build the "On this page" menu)
 */
window.POSTS = [
  {
    slug: 'ecc-everything-claude-code',
    title: 'ECC: giving your AI coding agent an engineering process',
    date: '2026-10-14',
    summary: 'A hands-on tour of Everything Claude Code — 71 agents, 311 skills and a plan → test → review workflow. How to install it, what works in VS Code and GitHub Copilot, and how to keep it safe and affordable.',
    tags: ['Claude Code', 'AI Agents', 'Developer Tools'],
  },
  {
    slug: 'measuring-genai-impact-with-did',
    title: 'Measuring GenAI impact when you can’t run an A/B test',
    date: '2026-10-14',
    summary: 'A practical guide to Difference-in-Differences: how to estimate what an AI tool is really worth from a staged rollout — with the assumptions, the code and the traps.',
    tags: ['Causal Inference', 'GenAI', 'Python'],
  },
];
