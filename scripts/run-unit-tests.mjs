import { readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = process.cwd();
const sourceRoot = resolve(projectRoot, "src");
const vitestCli = resolve(projectRoot, "node_modules/vitest/vitest.mjs");
const batchSize = 5;

function findTestFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findTestFiles(path);
    return /\.test\.[cm]?[jt]sx?$/.test(entry.name) ? [relative(projectRoot, path)] : [];
  });
}

const testFiles = findTestFiles(sourceRoot).sort();

if (!testFiles.length) {
  console.error("No unit or component test files were found under src.");
  process.exit(1);
}

for (let index = 0; index < testFiles.length; index += batchSize) {
  const batch = testFiles.slice(index, index + batchSize);
  const batchNumber = Math.floor(index / batchSize) + 1;
  const batchCount = Math.ceil(testFiles.length / batchSize);
  console.log(`\nRunning unit test batch ${batchNumber}/${batchCount} (${batch.length} files)...`);

  const result = spawnSync(
    process.execPath,
    [vitestCli, "run", ...batch, "--pool=threads", "--maxWorkers=1"],
    { cwd: projectRoot, env: process.env, stdio: "inherit" },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`\nAll ${testFiles.length} unit and component test files passed.`);
