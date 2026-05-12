# Sync Storybook

This skill processes `packages/cre-web-ui/STORYBOOK_SYNC.md`. It clears entries that are already documented and creates tasks for entries that are not.

---

## When to invoke this

- After `@cre/web-ui` changes have accumulated in STORYBOOK_SYNC.md and need to be documented in Storybook
- At the start of any session where Storybook docs may be out of date
- After Windsurf completes storybook-related tasks and entries can be cleared

---

## Protocol

### 1. Read the sync log

Read `packages/cre-web-ui/STORYBOOK_SYNC.md` in full.

Separate entries into two buckets:
- `Status: documented` — ready to be removed
- `Status: undocumented` — need a task created

If the log has no entries at all, report "Sync log is clean." and stop.

### 2. Clear documented entries

Remove all `Status: documented` entries from the log. Each entry starts with `### [YYYY-MM-DD]` and ends before the next `###` heading or the end of the file.

After removal, verify the `## Log` section is intact (the comment `<!-- Newest entries first -->` should remain). Do not remove the file header, format reference, or migration instructions — only the individual log entries.

### 3. Create tasks for undocumented entries

For each `Status: undocumented` entry, create one task file in `tasks/` using `tasks/_template.md` as the base.

**Task scoping rules:**
- One task per component. Do not batch multiple components into one task.
- Model: `cheap` (SWE-1.6) for CSS-only changes and story additions. `medium` for new components or significant prop changes.
- Always include `apps/storybook/AGENTS.md` in the context field — it contains the Show Code quality rule and other story conventions that Windsurf must follow.

**Each task must include:**
- The exact file paths to modify (`*.stories.tsx` and `*.docs.mdx`)
- The prop signature or CSS change verbatim from the STORYBOOK_SYNC.md entry
- The Storybook notes from the entry (what the story should demonstrate)
- An acceptance criterion to flip that entry's `Status` to `documented` in STORYBOOK_SYNC.md

**Story type guidance (from `apps/storybook/AGENTS.md`):**
- Stateless variants → use `args` pattern (no `render` function), Storybook auto-generates clean JSX
- Stateful variants (need `useState`) → use `render` + `parameters.docs.source.code` override with clean consumer JSX
- Stories referenced in `<Canvas>` blocks in `.docs.mdx` must produce clean "Show Code" output — stateful ones need the source override
- Visual-QA-only stories (not referenced in docs) are exempt from the source override rule

### 4. Report

List:
- Entries cleared (component name + date)
- Tasks created (task ID + title)
- Any entries skipped and why

---

## Task naming convention

`TASK-NNN-<kebab-component-name>-storybook.md`

Check existing tasks in `tasks/` to determine the next available NNN.
