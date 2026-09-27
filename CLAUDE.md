# The Pond — Rules for Claude Code

## Owner
Red Hood — PE teacher, limited coding. Give plain-English, one-step-at-a-time instructions. Put anything I must copy in a code block. Be concise.

## Project
- BullFrogBuddy Beta hub "The Pond". Repo: mcdanieljordan/the-pond (main). Hosted on GitHub Pages.
- Apps are single-file HTML. No build step, no frameworks that need compiling.
- Shared files in repo root, loaded in <head> of every app: bft-config.js, bft-assets.js, bft-theme.js, bft-students.js.

## Supabase
- ONLY use project aiczpuoskwzqtzvoomll (BullFrogBuddy-Beta). Never touch any other project.
- Every new table gets RLS scoped to the signed-in teacher (via user_id = auth.uid() or classes.user_id = auth.uid()).
- Save every SQL change as a file in /migrations (numbered, dated).
- Before any DROP, DELETE, or change that removes data: show me the SQL and wait for my OK.

## Data rules
- Roster: classes + beta_students. Student names are encrypted client-side (AES-GCM, teacher passphrase). Never store plain names or photos unencrypted.
- Points: one ledger for all apps. app_source ids: leader_locator, ribbit_rabbit.
- Import roster JSON format: {"classes":[{"className":"Period 3","students":["John Smith"]}]}
- Never commit secrets (service role keys, API keys). bft-config.js holds public values only.

## HTML rules
- Short comment tags above key sections, e.g. <!-- TIMER -->, <!-- SOUND BUTTONS -->.
- Smartboard-ready: touch targets 44px+, readable from 20+ feet, high contrast.
- Footer link text "🐸 Feed the Frogs and the Pond will Grow" → https://buymeacoffee.com/tools4teachers

## Workflow
- Small changes over full rewrites.
- When done, use /ship.
