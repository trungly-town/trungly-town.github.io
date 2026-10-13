AI coding agents are already good at writing code. What they lack is *process*. They don't plan before building or write the test first, and a second pair of eyes that didn't write the code never reviews it. They also forget everything when the session ends.

**ECC** ([github.com/affaan-m/ECC](https://github.com/affaan-m/ECC), short for *Everything Claude Code*) packages that process so you install it once instead of re-typing it into every prompt:

```text
plan -> test -> implement -> review -> verify -> remember -> improve
```

I installed it and checked how far it reaches beyond Claude Code. Here's what's inside, how to set it up, and what to watch out for.

> [!NOTE]
> Everything here refers to **ECC v2.2.3** (October 2026). The project moves fast and was renamed from `everything-claude-code` to `ECC` in v2.0, so check the README for the latest commands.

## What's inside

ECC is MIT-licensed and big: **71 agents, 311 skills and 97 commands**, plus hooks, rules, a memory system and a security scanner. It makes more sense as four building blocks than as a catalog:

| Block | What it is | When it costs context |
|---|---|---|
| **Agents** | Specialised workers (planner, code reviewer, security reviewer…) with their own context and tool permissions | Only when a task is delegated to them |
| **Skills** | Reusable workflows such as TDD, deep research or security review | Loaded when the task needs them |
| **Rules** | Always-on standards, shared or per language (Python, TypeScript, Go…) | **Always**, so install them selectively |
| **Hooks** | Scripts that fire on tool events, like blocking a destructive command | Run outside the model, no tokens |

The most useful idea is the separation itself. A reviewer agent works in a *fresh* context, so it doesn't share the blind spots of the session that wrote the code. Skills load on demand, so 311 of them don't flood your context window.

Two extras round it out. **Memory Vault** stores durable context as plain Markdown that other agents (Codex, Kimi…) can read. **AgentShield** scans your agent setup for risky prompts, hooks, MCP configs and leaked secrets.

## Installing it: pick exactly one path

There are three ways in. The rule that matters most: **use one install method per tool**. Stacking two (say, the plugin *and* a manual copy) duplicates agents, skills and hooks.

**1. Guided setup (recommended).** Needs Node.js 18+, Git and Claude Code 2.1+:

```bash
npx ecc-universal@2.2.3 setup
```

**2. Native plugin**, typed inside the Claude Code CLI:

```text
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

**3. Manual, agents only.** Copy the agent files you want into your user folder:

```bash
git clone --depth 1 https://github.com/affaan-m/ECC.git
mkdir -p ~/.claude/agents
cp ECC/agents/*.md ~/.claude/agents/
```

> [!TIP]
> In the **VS Code extension**, `/plugin` answers *"isn't available in this environment"*. Either run the plugin commands from the terminal CLI, or take the manual path. That's what I did: copy the agents, open a new session, and they're ready.

## Using the agents day to day

Open a **new** session after installing, because agents load at startup. Then you can:

- **Ask in plain words:** *"use the code-reviewer agent on src/app.ts"*
- **@-mention one:** `@agent-security-reviewer check the api/ folder`
- **Let Claude delegate:** each agent's description tells Claude when to call it

The ones worth starting with:

| When you are… | Agent |
|---|---|
| Planning a feature | `planner`, `architect` |
| Writing code test-first | `tdd-guide` |
| Reviewing what you just wrote | `code-reviewer`, plus `python-reviewer` / `typescript-reviewer` and friends |
| Fixing a broken build | `build-error-resolver` |
| Hunting vulnerabilities | `security-reviewer` |
| Cleaning up dead code | `refactor-cleaner` |

With the plugin installed, the workflows chain them for you. `/ecc:plan "Add OAuth login"` drafts a plan you confirm. The `tdd-workflow` skill then makes the tests fail first (RED), and `/code-review` checks the result from a fresh context.

> [!WARNING]
> Some agent descriptions are very assertive. `code-reviewer`, for example, says *"MUST BE USED for all code changes"*. Claude takes that literally and delegates often, and every delegation spends tokens. If it gets chatty, soften the `description:` line in `~/.claude/agents/<name>.md`.

## Does it work with GitHub Copilot?

Partly. ECC is built for Claude Code first, and the README is upfront that other tools get *capability-limited* adapters:

| Tool | What you get | What you don't |
|---|---|---|
| **Copilot Chat in VS Code** | A shared instruction file (`.github/copilot-instructions.md`) and reusable prompts: `/plan`, `/tdd`, `/security-review`, `/build-fix`, `/refactor` | The 71 agents, hooks, most skills |
| **Copilot CLI** (beta) | Skills and adapted agents in `.github/`, via `./install.sh --profile full --target copilot` | Hooks, rules, commands |

Note the difference in scope, too. Copilot setup lives **per project** (in the repo's `.github/` folder), while Claude Code agents in `~/.claude/agents/` follow you into every project.

## Keeping cost and context under control

More capability means more tokens if you're careless. These are the README's recommended settings for `~/.claude/settings.json`:

```json
{
  "model": "sonnet",
  "env": {
    "CLAUDE_CODE_EFFORT_LEVEL": "medium",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

In short: a mid-size model by default, a small model for subagents, and compaction at 50% of the context window instead of 95%. A few habits matter just as much:

- **Install rules selectively.** They are always loaded, so pick only the languages you actually use.
- **Keep MCP servers lean.** Every tool description eats context. The README suggests fewer than 10 MCP servers and 80 tools per project.
- **Compact at milestones**, after research or after a finished feature, not in the middle of an implementation.

## Treat agent config like code

Agents are prompts, hooks run shell commands, and MCP servers can hold credentials. Installing a pack like ECC means trusting all of that, so:

1. **Install only from official sources:** the GitHub repo, the `ecc@ecc` plugin, and the npm packages `ecc-universal` and `ecc-agentshield`. Look-alike packages are a real supply-chain risk.
2. **Read before you copy.** Before copying the agents, I scanned them for anything that downloads or executes code. They are plain Markdown prompts, but checking took two minutes and is worth the habit.
3. **Scan what you run:** `agentshield scan --path .` audits prompts, hooks, MCP configs and secrets in a project.

## My take

ECC's real value isn't the 311 skills. It's a working answer to *how should an AI agent work on a codebase*: plan first, prove with tests, review with fresh eyes, remember what matters. You can adopt that idea gradually:

1. Start with four agents: `planner`, `tdd-guide`, `code-reviewer`, `security-reviewer`.
2. Add one rules pack for your main language.
3. Apply the cost settings above before going further.
4. Only then explore skills, hooks and memory.

If you live in Claude Code, it's one of the fastest ways to give your agent an engineering process. If you live in Copilot, take the prompts and the instructions, and know that the full experience is elsewhere.
