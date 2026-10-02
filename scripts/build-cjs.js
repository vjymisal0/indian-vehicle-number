// Generates src/index.cjs from the ESM source so both stay in sync.
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
const names = [...src.matchAll(/^export (?:const|function) (\w+)/gm)].map((m) => m[1]);
const body = src
  .replace(/^export (const|function) /gm, "$1 ")
  .replace("// src/index.cjs is generated from this file by scripts/build-cjs.js.", "// Generated from src/index.js by scripts/build-cjs.js. Do not edit.");
writeFileSync(
  new URL("../src/index.cjs", import.meta.url),
  `"use strict";\n${body}\nmodule.exports = { ${names.join(", ")} };\n`
);
