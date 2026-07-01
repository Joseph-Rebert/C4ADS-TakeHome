---
name: opsx
description: Drive the OpenSpec spec-driven workflow (propose, apply, archive, status, explore) end to end via the openspec CLI. Use whenever you need to create a change proposal + design + tasks, implement tasks against a change, check change status, or archive a finished change — especially on this C4ADS take-home where AI-assisted work must be documented with OpenSpec.
license: MIT
metadata:
  author: joseph
  version: "1.0"
---

# opsx — one entry point for the OpenSpec workflow

A single self-contained router for OpenSpec so you (Claude) can drive the whole
lifecycle without depending on the per-action `openspec-*` skills being loaded.
Everything runs through the `openspec` CLI (installed globally, v1.5+).

Pick the action from the user's request:

| User intent | Action |
|---|---|
| "propose X", "start a change for X", "document intent for X" | **propose** |
| "apply", "implement the tasks", "build it" | **apply** |
| "archive", "finalize the change" | **archive** |
| "status", "where are we on X" | **status** |
| "explore", "think through X first" | **explore** |

**Golden rules**
- Artifacts first, code second. Never write feature code in *propose*/*explore*.
- `context` and `rules` returned by the CLI are constraints for YOU — never copy
  those blocks into artifact files.
- Read every dependency artifact before writing a new one.
- Commit per meaningful step so history reflects real incremental work.
- No `--store` flag is needed here (work lives in the local `openspec/` root).

---

## propose — create a change and generate all artifacts

1. Derive a kebab-case `<name>` from the description (e.g. "Django API" → `django-entities-api`).
2. Scaffold: `openspec new change "<name>"`
   (if it already exists, ask whether to continue it or pick a new name).
3. Build order: `openspec status --change "<name>" --json`
   Parse `applyRequires`, `artifacts`, `artifactPaths`, `planningHome`, `changeRoot`.
4. For each artifact whose dependencies are satisfied (proposal → design → specs → tasks):
   - `openspec instructions <artifact-id> --change "<name>" --json`
   - Read any completed dependency files it lists.
   - Write the file to `resolvedOutputPath` using the returned `template` as structure,
     honoring `context`/`rules` as constraints (do NOT paste them in).
   - Re-run `openspec status --change "<name>" --json`; continue until every id in
     `applyRequires` has `status: "done"`.
5. Finish: `openspec status --change "<name>"` and tell the user to run apply next.

## apply — implement the tasks

1. Select the change (given name, inferred from context, the only active one, or
   ask via `openspec list --json`). Announce: "Using change: <name>".
2. `openspec status --change "<name>" --json` to learn the schema + which artifact holds tasks.
3. `openspec instructions apply --change "<name>" --json` →
   - `state: "blocked"` → report missing artifacts, go back to propose.
   - `state: "all_done"` → suggest archive.
   - else read every path under `contextFiles` (proposal, design, specs, tasks).
4. Loop the pending tasks: implement minimal focused changes, then flip `- [ ]` → `- [x]`
   in the tasks file immediately after each. Pause (don't guess) if a task is ambiguous
   or implementation reveals a design flaw. Commit after each coherent task.
5. Report progress "N/M complete"; when done, suggest archive.

## archive — finalize

1. Pick the change (`openspec list --json`; ask — never auto-guess).
2. `openspec status --change "<name>" --json`; warn (and confirm) if artifacts or
   tasks are incomplete.
3. Simplest path: `openspec archive "<name>"` (moves the change under
   `changes/archive/YYYY-MM-DD-<name>/` and syncs delta specs). If you need manual
   control, follow the paths from the status JSON.
4. Show a summary: change, schema, archive location, spec-sync status.

## status — quick check
`openspec status --change "<name>"` (add `--json` when you need to parse it), or
`openspec list --json` for all active changes.

## explore — think, don't build
A stance, not a workflow: read/search/investigate and clarify requirements. You may
capture thinking as artifacts, but never implement. If asked to build, tell the user
to exit explore and propose a change first.

---

## Reference
- CLI help: `openspec --help`, `openspec <cmd> --help`
- Full per-action instructions also live in `.claude/commands/opsx/*.md` and
  `.claude/skills/openspec-*/SKILL.md` if you need the verbose version.
