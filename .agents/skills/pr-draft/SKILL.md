---
name: pr-draft
description: Use when the user invokes /pr-draft, $pr-draft, or asks for a GitHub Pull Request title and body draft based on the current branch. Produces copy-paste-ready PR markdown without creating a PR.
---

# PR Draft

Follow `.agents/workflows/pr-draft.md` exactly.

When invoked:

1. Read the shared workflow.
2. Treat any text after `$pr-draft` or `/pr-draft` as invocation input for the shared workflow.
3. Run only the preflight and analysis commands defined there.
4. Draft the PR title and body from the current branch.
5. Do not create a PR, commit, push, merge, or edit files.
