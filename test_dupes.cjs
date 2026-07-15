const fs = require('fs');

const sql = fs.readFileSync('database/kebunin.sql', 'utf8');

// Find all matches of scan_history INSERT blocks
const matches = sql.match(/INSERT INTO `scan_history`[\s\S]*?VALUES[\s\S]*?;/g);
if (!matches) {
  console.log('No scan_history INSERT statements found.');
  process.exit(0);
}

console.log(`Found ${matches.length} INSERT statements for scan_history.`);

const allIds = [];
const duplicates = [];
const seen = new Set();

matches.forEach((block, blockIdx) => {
  // Find all UUIDs (e.g. ('52b23a9e-8003-11f1-98b1-005056c00001')
  const uuidRegex = /\(\s*'([0-9a-fA-F-]+)'/g;
  let match;
  let count = 0;
  while ((match = uuidRegex.exec(block)) !== null) {
    const id = match[1];
    count++;
    allIds.push(id);
    if (seen.has(id)) {
      duplicates.push({ id, blockIdx: blockIdx + 1 });
    }
    seen.add(id);
  }
  console.log(`Block #${blockIdx + 1} has ${count} rows.`);
});

if (duplicates.length > 0) {
  console.log(`Found ${duplicates.length} duplicate primary key IDs:`);
  duplicates.forEach(d => {
    console.log(`- Duplicate ID '${d.id}' found in Block #${d.blockIdx}`);
  });
} else {
  console.log('No duplicate primary key IDs found!');
}
