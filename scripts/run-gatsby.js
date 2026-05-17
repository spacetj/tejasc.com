#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const isBuildCommand = process.argv[2] === "build";
let prunedProductionArtifacts = false;

function walkFiles(dir, visitor) {
  if (!fs.existsSync(dir)) {
    return;
  }

  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(filePath, visitor);
    } else if (entry.isFile()) {
      visitor(filePath);
    }
  });
}

function stripSourceMapReferences(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const stripped = source
    .replace(/\n?\/\/# sourceMappingURL=.*?\.map\s*$/gm, "")
    .replace(/\/\*# sourceMappingURL=.*?\.map\s*\*\//g, "");

  if (stripped !== source) {
    fs.writeFileSync(filePath, stripped);
    return true;
  }

  return false;
}

function pruneProductionArtifacts() {
  if (prunedProductionArtifacts || !fs.existsSync(publicDir)) {
    return;
  }

  prunedProductionArtifacts = true;
  let removedSourceMaps = 0;
  let strippedReferences = 0;

  walkFiles(publicDir, filePath => {
    if (filePath.endsWith(".map")) {
      fs.rmSync(filePath, { force: true });
      removedSourceMaps += 1;
      return;
    }

    if (/\.(css|js)$/.test(filePath) && stripSourceMapReferences(filePath)) {
      strippedReferences += 1;
    }
  });

  if (removedSourceMaps || strippedReferences) {
    console.log(
      `Pruned production artifacts: removed ${removedSourceMaps} source maps and stripped ${strippedReferences} references.`
    );
  }
}

if (isBuildCommand) {
  fs.rmSync(publicDir, { recursive: true, force: true });
  process.once("beforeExit", () => {
    if (!process.exitCode) {
      pruneProductionArtifacts();
    }
  });
  process.once("exit", code => {
    if (code === 0) {
      pruneProductionArtifacts();
    }
  });
}

const polyfillPath = path.join(__dirname, "globalthis-polyfill.js");
const requireFlag = `--require "${polyfillPath}"`;
if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes(polyfillPath)) {
  process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
    ? `${process.env.NODE_OPTIONS} ${requireFlag}`
    : requireFlag;
}

require(polyfillPath);
require("gatsby/dist/bin/gatsby");
