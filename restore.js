import fs from "node:fs";

const dumpPath = "C:\\Users\\Ali Novian\\.gemini\\antigravity-ide\\brain\\6f90ceb9-be7d-4bc8-a72d-78417380839d\\scratch\\match_6f90ceb9-be7d-4bc8-a72d-78417380839d.db_594.txt";
const destPath = "src/lib/api/db.functions.ts";

const lines = fs.readFileSync(dumpPath, "utf8").split("\n");
const codeLines = [];

for (let i = 2374; i < 3982; i++) {
  let line = lines[i];
  if (line === undefined) continue;
  
  // Trim leading space ONLY if there was a line-number prefix issue, but here we just push the line raw since there are no prefixes
  codeLines.push(line);
}

// Clean any binary prefix on the first line if present
if (codeLines[0]) {
  const importIdx = codeLines[0].indexOf("import ");
  if (importIdx !== -1) {
    codeLines[0] = codeLines[0].slice(importIdx);
  }
}

fs.writeFileSync(destPath, codeLines.join("\n"), "utf8");
console.log("Successfully restored db.functions.ts!");
