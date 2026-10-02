// Scores one builder branch against its job. Usage, from a clone with origin fetched:
//   node spike/score.mjs code-job origin/spike/code-job-engine-a-123
// Prints a short markdown report. Continuity of prose is judged by reading, not here.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [job, branch] = process.argv.slice(2);
const ALLOWED = {
  "code-job": ["src/time.js", "test/time.test.js"],
  "prose-job": ["stories/02-the-visitor.md"],
};
if (!ALLOWED[job] || !branch) {
  console.error("Usage: node spike/score.mjs <code-job|prose-job> <branch>");
  process.exit(2);
}
const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

const base = git("merge-base", "origin/main", branch);
const changed = git("diff", "--name-only", base, branch).split("\n").filter(Boolean);
const outOfScope = changed.filter((f) => !ALLOWED[job].includes(f));
const missing = ALLOWED[job].filter((f) => job === "prose-job" && !changed.includes(f));

const dir = mkdtempSync(join(tmpdir(), "score-"));
const lines = [`### ${job} · \`${branch}\``, ""];
try {
  git("worktree", "add", "--detach", dir, branch);
  let testsPass = true;
  try {
    execFileSync("npm", ["test"], { cwd: dir, stdio: "pipe" });
  } catch {
    testsPass = false;
  }
  lines.push(`- Files changed: ${changed.map((f) => `\`${f}\``).join(", ") || "none"}`);
  lines.push(`- Stayed in scope: ${outOfScope.length ? `**no**, also changed ${outOfScope.join(", ")}` : "yes"}`);
  if (missing.length) lines.push(`- Missing required file: ${missing.join(", ")}`);
  lines.push(`- \`npm test\` on the branch: ${testsPass ? "pass" : "**fail**"}`);

  if (job === "code-job") {
    const cases = [[0, "0s"], [42, "42s"], [60, "1m 00s"], [303, "5m 03s"], [3600, "1h 00m"], [7505, "2h 05m"], [90061, "25h 01m"]];
    const bad = [-1, 1.5, "60", NaN, null];
    let ok = 0, okErr = 0, note = "";
    try {
      const { formatDuration } = await import(pathToFileURL(join(dir, "src/time.js")).href);
      for (const [n, want] of cases) if (formatDuration(n) === want) ok++;
      for (const b of bad) {
        try { formatDuration(b); } catch (e) { if (e instanceof TypeError) okErr++; }
      }
    } catch (e) {
      note = ` (could not load src/time.js: ${e.message})`;
    }
    lines.push(`- Behaviour table: ${ok}/${cases.length} correct; error cases: ${okErr}/${bad.length} throw TypeError${note}`);
  } else {
    let text = "";
    try { text = readFileSync(join(dir, "stories/02-the-visitor.md"), "utf8"); } catch {}
    const [first, ...rest] = text.split("\n");
    const words = rest.join(" ").split(/\s+/).filter(Boolean).length;
    lines.push(`- Heading: ${first?.trim() === "# 2. The visitor" ? "matches" : `\`${first?.trim() || "missing"}\``}`);
    lines.push(`- Length: ${words} words ${words >= 350 && words <= 450 ? "(in range)" : "(**outside 350–450**)"}`);
  }
} finally {
  try { git("worktree", "remove", "--force", dir); } catch { rmSync(dir, { recursive: true, force: true }); }
}
console.log(lines.join("\n"));
