import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repository = path.resolve(import.meta.dirname, "..");
const allowedProjects = new Set(["todo", "reddit", "shopping", "erp"]);
const allowedModes = new Set(["evidence", "plain"]);
const slug = /^[a-z0-9][a-z0-9.-]*$/;
const runId =
  /^[0-9a-f]{12}-[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const commit = /^[0-9a-f]{40}$/i;

const manifests = [];
visit(repository);
const include = manifests
  .sort((left, right) => left.relative.localeCompare(right.relative))
  .map(({ relative, manifest, packageManager, frontendPackage }) => ({
    name: `${manifest.agent}/${manifest.model}/${manifest.project}/${manifest.mode}`,
    path: relative,
    pnpm: packageManager,
    frontend: frontendPackage,
  }));
process.stdout.write(`${JSON.stringify({ include })}\n`);

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const location = path.join(directory, entry.name);
    if (entry.isSymbolicLink())
      throw new Error(`Symbolic links are forbidden: ${relative(location)}`);
    if (entry.isDirectory()) visit(location);
    else if (entry.isFile() && entry.name === "benchmark.json")
      manifests.push(readManifest(path.dirname(location)));
    else if (!entry.isFile())
      throw new Error(`Non-regular entries are forbidden: ${relative(location)}`);
  }
}

function readManifest(leaf) {
  const relativeLeaf = relative(leaf);
  const segments = relativeLeaf.split("/");
  if (
    segments.length !== 4 ||
    !slug.test(segments[0]) ||
    !slug.test(segments[1]) ||
    !allowedProjects.has(segments[2]) ||
    !allowedModes.has(segments[3])
  )
    throw new Error(
      `Result leaf must be <agent>/<model>/<project>/<mode>: ${relativeLeaf}`,
    );
  const manifest = JSON.parse(
    fs.readFileSync(path.join(leaf, "benchmark.json"), "utf8"),
  );
  const [agent, model, project, mode] = segments;
  if (
    manifest.schemaVersion !== 1 ||
    manifest.agent !== agent ||
    manifest.model !== model ||
    manifest.project !== project ||
    manifest.mode !== mode ||
    manifest.status !== "accepted" ||
    !runId.test(manifest.runId ?? "") ||
    !commit.test(manifest.sourceCommit ?? "") ||
    !/^[0-9a-f]{64}$/i.test(manifest.instructionsTreeSha256 ?? "") ||
    !/^[0-9a-f]{64}$/i.test(manifest.requirementsTreeSha256 ?? "") ||
    !/^[0-9a-f]{64}$/i.test(manifest.completedWorkspaceTreeSha256 ?? "")
  )
    throw new Error(`Invalid benchmark identity: ${relativeLeaf}/benchmark.json`);
  for (const required of [
    "benchmark-report.json",
    "package.json",
    "pnpm-lock.yaml",
  ])
    if (!fs.statSync(path.join(leaf, required), { throwIfNoEntry: false })?.isFile())
      throw new Error(`Missing ${relativeLeaf}/${required}`);
  rejectPrivateEntries(leaf);
  if (mode === "evidence") {
    const archiveRoot = path.join(leaf, ".benchmark-deps");
    if (
      !fs.statSync(archiveRoot, { throwIfNoEntry: false })?.isDirectory() ||
      fs.readdirSync(archiveRoot).some((name) => !name.endsWith(".tgz")) ||
      fs.readdirSync(archiveRoot).length === 0
    )
      throw new Error(
        `Evidence result must retain only package archives in ${relativeLeaf}/.benchmark-deps`,
      );
  }
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(leaf, "package.json"), "utf8"),
  );
  const packageManager = /^pnpm@(\d+\.\d+\.\d+)$/.exec(
    packageJson.packageManager ?? "",
  )?.[1];
  if (packageManager === undefined)
    throw new Error(`Leaf must pin packageManager to pnpm: ${relativeLeaf}`);
  const frontendPackageJson = JSON.parse(
    fs.readFileSync(
      path.join(leaf, "packages", "frontend", "package.json"),
      "utf8",
    ),
  );
  const frontendPackage = frontendPackageJson.name;
  if (
    typeof frontendPackage !== "string" ||
    !/^@[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/.test(frontendPackage)
  )
    throw new Error(`Leaf must use a safe scoped frontend package: ${relativeLeaf}`);
  return {
    relative: relativeLeaf,
    manifest,
    packageManager,
    frontendPackage,
  };
}

function rejectPrivateEntries(root) {
  const stack = [root];
  while (stack.length !== 0) {
    const directory = stack.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const location = path.join(directory, entry.name);
      const name = entry.name;
      if (
        name === ".git" ||
        name === "node_modules" ||
        name === ".env" ||
        (name.startsWith(".env.") && name !== ".env.example")
      )
        throw new Error(`Private or generated entry is forbidden: ${relative(location)}`);
      if (entry.isSymbolicLink())
        throw new Error(`Symbolic links are forbidden: ${relative(location)}`);
      if (entry.isDirectory()) stack.push(location);
      else if (!entry.isFile())
        throw new Error(`Non-regular entries are forbidden: ${relative(location)}`);
    }
  }
}

function relative(location) {
  return path.relative(repository, location).replaceAll("\\", "/");
}
