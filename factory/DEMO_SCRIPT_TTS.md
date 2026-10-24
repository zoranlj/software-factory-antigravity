# Software Factory for Antigravity — Demo Script & Scenario

## 1. Clean Text for AI Text-to-Speech (TTS) Generator
*(Copy and paste this section directly into ElevenLabs, OpenAI TTS, PlayHT, or your preferred voice generator)*

Welcome to Software Factory for Google Antigravity. In this demo, you will see how autonomous multi-agent engineering works in a real production codebase.

It all starts in your project backlog. When you type slash factory next, the factory orchestrator springs to life. It reads the top pending task from your backlog and claims it with zero manual overhead.

To keep your main branch safe and clean, the factory provisions an isolated Git worktree. Here, a dedicated specification writer analyzes the task and produces unambiguous acceptance criteria before any code is written.

You can watch everything unfold in real time on the live Kanban dashboard. As the job moves into the build phase, you see real-time token counts, execution timing, and streaming agent activity.

The builder agent does not just write code blindly. It edits the React components, runs automated test suites, and even dispatches Antigravity browser subagents to interact with and visually verify the running application.

Next comes the multi-agent review gauntlet. Four specialized agents inspect the changes concurrently: code quality, UX ergonomics, UI fidelity, and application security. Each reviewer provides independent validation.

When every reviewer signs off with a passing verdict, the job enters the approve stage. Full evidence logs and test results are summarized for complete auditability.

Once validated, the factory automatically merges the feature branch into main, cleans up the worktree, and closes the backlog item.

Back on the dashboard, the job moves to merged main, giving you complete visibility into total tokens, execution time, and production velocity. 

This is the Software Factory for Antigravity. Autonomous, rigorous, and production ready.

---

## 2. Visual Storyboard & Scenario Breakdown

| Timestamp | Duration | Screen / Image Asset | On-Screen Visuals | Voiceover Text |
| :--- | :--- | :--- | :--- | :--- |
| **00:00 - 00:14** | 14s | [`01_backlog_command.png`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets/01_backlog_command.png) | Antigravity IDE showing `backlog.md` with pending tasks, and user executing `/factory next`. | *Welcome to Software Factory for Google Antigravity. In this demo, you will see how autonomous multi-agent engineering works in a real production codebase. It all starts in your project backlog. When you type slash factory next, the factory orchestrator springs to life. It reads the top pending task from your backlog and claims it with zero manual overhead.* |
| **00:14 - 00:28** | 14s | [`02_task_claimed_worktree.png`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets/02_task_claimed_worktree.png) | IDE terminal showing task `003-smaller-filter-chips` claimed, git worktree branch created under `factory/worktrees/`. | *To keep your main branch safe and clean, the factory provisions an isolated Git worktree. Here, a dedicated specification writer analyzes the task and produces unambiguous acceptance criteria before any code is written.* |
| **00:28 - 00:42** | 14s | [`03_dashboard_spec_phase.png`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets/03_dashboard_spec_phase.png) | Web Dashboard showing `Spec` column active, `spec-writer` persona running, live agent thoughts dock. | *You can watch everything unfold in real time on the live Kanban dashboard. As the job moves into the build phase, you see real-time token counts, execution timing, and streaming agent activity.* |
| **00:42 - 00:56** | 14s | [`04_dashboard_build_phase.png`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets/04_dashboard_build_phase.png) | Dashboard showing job moving to `Build` column, builder persona active, token counter incrementing. | *The builder agent does not just write code blindly. It edits the React components, runs automated test suites, and even dispatches Antigravity browser subagents to interact with and visually verify the running application.* |
| **00:56 - 01:11** | 15s | [`05_builder_browser_subagent.png`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets/05_builder_browser_subagent.png) | Antigravity IDE showing builder triggering `browser_subagent` inspecting `http://localhost:5130/menu`. | *(Browser verification visual continues while builder runs assertions and captures screenshots to validate acceptance criteria).* |
| **01:11 - 01:26** | 15s | [`06_dashboard_review_4_agents.png`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets/06_dashboard_review_4_agents.png) | Dashboard in `Review` column: 4 parallel reviewer personas (`reviewer-security`, `reviewer-code`, `reviewer-ui`, `reviewer-ux`). | *Next comes the multi-agent review gauntlet. Four specialized agents inspect the changes concurrently: code quality, UX ergonomics, UI fidelity, and application security. Each reviewer provides independent validation.* |
| **01:26 - 01:40** | 14s | [`07_dashboard_reviews_passed_approver.png`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets/07_dashboard_reviews_passed_approver.png) | Dashboard in `Approve` column with 4 `PASS` badges and approver verifying criteria. | *When every reviewer signs off with a passing verdict, the job enters the approve stage. Full evidence logs and test results are summarized for complete auditability.* |
| **01:40 - 01:54** | 14s | [`08_ide_merged_main.png`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets/08_ide_merged_main.png) | Antigravity IDE confirming all 6 acceptance criteria validated, automated git merge into `main`. | *Once validated, the factory automatically merges the feature branch into main, cleans up the worktree, and closes the backlog item.* |
| **01:54 - 02:24** | 30s | [`09_dashboard_final_merged.png`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets/09_dashboard_final_merged.png) | Dashboard showing 3 completed jobs in `Merged main`, 164.8k tokens, factory status ready. | *Back on the dashboard, the job moves to merged main, giving you complete visibility into total tokens, execution time, and production velocity. This is the Software Factory for Antigravity. Autonomous, rigorous, and production ready.* |

---

## 3. Generated Demo Video Files

- **Desktop File**: [`/Users/zoran/Desktop/Software_Factory_Demo.mp4`](file:///Users/zoran/Desktop/Software_Factory_Demo.mp4)
- **Repo File**: [`software-factory-demo.mp4`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/software-factory-demo.mp4)
- **Source Assets**: [`factory/demo_assets/`](file:///Users/zoran/Private%20Projects/software-factory-antigravity/factory/demo_assets)
