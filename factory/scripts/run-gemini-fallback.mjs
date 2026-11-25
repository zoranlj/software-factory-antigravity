#!/usr/bin/env node
/**
 * Fail-fast Gemini CLI model fallback runner for Level 4 Headless Factory.
 *
 * Spawns `gemini` for each model in order and monitors stderr for API retry/quota
 * failures (429/503/RetryableQuotaError/Retrying with backoff). The instant a model
 * fails on its first attempt, this runner kills the process and immediately switches
 * to the next fallback model instead of waiting minutes for internal backoff retries.
 */

import { spawn } from "node:child_process";

const DEFAULT_MODELS = [
  "gemini-3.8-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

const FAIL_FAST_PATTERNS = [
  /Attempt \d+ failed.*Retrying with backoff/i,
  /Attempt \d+ failed:.*Retrying after \d+ms/i,
  /Attempt \d+ failed:.*exceeded your current quota/i,
  /Error when talking to Gemini API/i,
  /\b(RetryableQuotaError|TerminalQuotaError|ModelNotFoundError)\b/,
];

function parseArgs(argv) {
  const opts = {
    models: process.env.FACTORY_MODELS
      ? process.env.FACTORY_MODELS.split(",").map((m) => m.trim()).filter(Boolean)
      : DEFAULT_MODELS,
    prompt: process.env.FACTORY_PROMPT || "",
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--models" && argv[i + 1]) {
      opts.models = argv[++i].split(",").map((m) => m.trim()).filter(Boolean);
    } else if (arg === "--prompt" && argv[i + 1]) {
      opts.prompt = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node factory/scripts/run-gemini-fallback.mjs [--models m1,m2,...] [--prompt <text>]"
      );
      process.exit(0);
    }
  }

  return opts;
}

function buildDefaultPrompt() {
  const worktree = process.env.FACTORY_WORKTREE || process.cwd();
  const branch = process.env.FACTORY_BRANCH || "factory/job";
  const jobDir = process.env.FACTORY_JOB_DIR || "";
  const issueFile = process.env.FACTORY_ISSUE_FILE || "";

  return [
    `You are the headless Software Factory agent running inside an already-provisioned worktree (${worktree} on branch ${branch}) with job directory ${jobDir}.`,
    "Do NOT invoke headless-run.sh or /factory.",
    `Read AGENTS.md, ARCHITECTURE.md, CONVENTIONS.md, TESTING_HARNESS.md, .agents/skills/factory/SKILL.md, and the issue at ${issueFile}.`,
    `Directly perform the spec, build, review, and decision stages: write spec.md, build.md, round-1/review-{security,ux,ui,code}.md, decision.md, and update job.json in ${jobDir}.`,
    `Implement the requested code changes in ${worktree}, ensure ./tests/factory-verify.sh passes, and git commit all changes on branch ${branch}.`,
    "Do NOT merge to main or push.",
  ].join(" ");
}

function runModel(model, prompt, worktree, jobDir) {
  return new Promise((resolve) => {
    const args = [
      "-m",
      model,
      "--approval-mode=yolo",
      "--skip-trust",
    ];
    if (jobDir) {
      args.push("--include-directories", jobDir);
    }
    args.push("-p", prompt);

    console.log(`🤖 Trying model: ${model}`);
    const child = spawn("gemini", args, {
      cwd: worktree,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
    });

    let abortedForFallback = false;
    let settled = false;
    let stderrBuf = "";

    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const killTree = () => {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {
        try {
          child.kill("SIGKILL");
        } catch {
          // Process already exited
        }
      }
      child.stdout?.destroy();
      child.stderr?.destroy();
    };

    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString("utf8");
      process.stderr.write(text);

      if (abortedForFallback) return;

      stderrBuf += text;
      const lines = stderrBuf.split(/\r?\n/);
      stderrBuf = lines.pop() ?? "";

      for (const line of lines) {
        if (FAIL_FAST_PATTERNS.some((re) => re.test(line))) {
          abortedForFallback = true;
          console.error(
            `⚡ Model ${model} failed immediately (${line.trim().slice(0, 120)}) — aborting retries and switching to next fallback...`
          );
          killTree();
          finish({ ok: false, code: 1, abortedForFallback: true });
          break;
        }
      }
    });

    child.on("error", (err) => {
      console.error(`❌ Failed to spawn gemini for model ${model}: ${err.message}`);
      finish({ ok: false, code: 1, abortedForFallback });
    });

    child.on("close", (code) => {
      const ok = !abortedForFallback && code === 0;
      finish({ ok, code: code ?? 1, abortedForFallback });
    });
  });
}

async function main() {
  const { models, prompt: customPrompt } = parseArgs(process.argv.slice(2));
  const worktree = process.env.FACTORY_WORKTREE || process.cwd();
  const jobDir = process.env.FACTORY_JOB_DIR || "";
  const prompt = customPrompt || buildDefaultPrompt();

  for (const model of models) {
    const result = await runModel(model, prompt, worktree, jobDir);
    if (result.ok) {
      console.log(`✅ Model ${model} completed successfully.`);
      process.exit(0);
    }
    if (!result.abortedForFallback) {
      console.error(`⚠️  Model ${model} exited with code ${result.code}, trying next fallback...`);
    }
  }

  console.error(`❌ All fallback models failed: ${models.join(", ")}`);
  process.exit(1);
}

main();
