---
name: pr-draft
description: Use when the user invokes /pr-draft, $pr-draft, or asks for a GitHub Pull Request title and body draft based on the current branch. Produces copy-paste-ready PR markdown without creating a PR.
---

# PR Draft

Follow `.agents/workflows/pr-draft.md` exactly.

When invoked:

1. Read the shared workflow.
2. Run only the preflight and analysis commands defined there.
3. Draft the PR title and body from the current branch.
4. Do not create a PR, commit, push, merge, or edit files.
