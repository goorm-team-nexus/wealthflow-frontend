---
allowed-tools: Bash(git branch *) Bash(git rev-parse *) Bash(git status *) Bash(git fetch *) Bash(git diff *) Bash(git log *)
description: Draft a GitHub PR title and body from the current branch using the project PR template.
---

# PR Draft

Follow @.agents/workflows/pr-draft.md exactly.

Treat arguments after `/pr-draft` as invocation input for the shared workflow.

Do not create a PR, commit, push, merge, or edit files.

Arguments, if provided: $ARGUMENTS
