# Factory Backlog

Queue of features and tasks for `/factory next` and headless pipeline runs.

Items are claimed sequentially from top to bottom. Once claimed by an autonomous factory run, `- [ ]` becomes `- [x] <task> → <job-id>`.
Items with unresolved `Depends-On: #<num>` metadata are skipped until their dependencies are closed.

## Queue

- [x] Issue #1: Token usage refactor → 001-token-usage-refactor
