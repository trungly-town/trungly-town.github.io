#!/bin/bash
# Double-click to preview the site locally.
# Blog posts are Markdown files the page has to fetch, and browsers block that for pages opened
# straight from disk (file://) — so this serves the folder at http://localhost and opens it.
cd "$(dirname "$0")" || exit 1

PORT=8000
while lsof -i tcp:$PORT >/dev/null 2>&1; do PORT=$((PORT + 1)); done

echo "Previewing the site at http://localhost:$PORT"
echo "Close this window (or press Ctrl+C) to stop."
(sleep 1; open "http://localhost:$PORT/") &
python3 -m http.server "$PORT" --bind 127.0.0.1
