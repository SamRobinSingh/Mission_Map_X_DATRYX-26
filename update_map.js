import fs from 'fs';

const coords = [
  { x: 40.0, y: 82.0 },
  { x: 33.9, y: 74.9 },
  { x: 38.7, y: 68.1 },
  { x: 35.1, y: 64.1 },
  { x: 45.3, y: 53.3 },
  { x: 41.3, y: 49.9 },
  { x: 49.1, y: 44.4 },
  { x: 54.3, y: 46.9 },
  { x: 59.1, y: 50.5 },
  { x: 70.6, y: 49.2 },
  { x: 62.8, y: 56.6 },
  { x: 68.3, y: 63.8 },
  { x: 80.5, y: 58.8 },
  { x: 82.2, y: 50.2 },
  { x: 76.9, y: 38.8 }
];

const mapFile = 'c:/Users/ss876/Downloads/cyber-ops-arena-main/cyber-ops-arena-main/src/data/gameMap.ts';
let content = fs.readFileSync(mapFile, 'utf-8');

// The R2 nodes are named R2_START, R2_N2, R2_N3 ... R2_N15
const nodeNames = ['R2_START', ...Array.from({length: 14}, (_, i) => \`R2_N\${i+2}\`)];

nodeNames.forEach((nodeName, i) => {
  const coord = coords[i];
  
  // Replace the exact lines for the main nodes
  const regex = new RegExp(\`(\${nodeName}: \\{[\\s\\S]*?)x: [\\d\\.]+, y: [\\d\\.]+(,\\n\\s*\\})\`);
  content = content.replace(regex, \`$1x: \${coord.x}, y: \${coord.y}$2\`);

  // Offset traps based on the main node coordinates
  // Traps are named R2_T{i+1}_1 and R2_T{i+1}_2
  const t1 = \`R2_T\${i+1}_1\`;
  const t2 = \`R2_T\${i+1}_2\`;

  const regexT1 = new RegExp(\`(\${t1}: \\{[\\s\\S]*?)x: [\\d\\.]+, y: [\\d\\.]+(,\\n\\s*\\})\`);
  content = content.replace(regexT1, \`$1x: \${(coord.x - 4).toFixed(1)}, y: \${(coord.y + 4).toFixed(1)}$2\`);

  const regexT2 = new RegExp(\`(\${t2}: \\{[\\s\\S]*?)x: [\\d\\.]+, y: [\\d\\.]+(,\\n\\s*\\})\`);
  content = content.replace(regexT2, \`$1x: \${(coord.x + 4).toFixed(1)}, y: \${(coord.y + 4).toFixed(1)}$2\`);
});

// For R2_FINAL, put it near the last node
const lastCoord = coords[14];
const regexFinal = new RegExp(\`(R2_FINAL: \\{[\\s\\S]*?)x: [\\d\\.]+, y: [\\d\\.]+(,\\n\\s*\\})\`);
content = content.replace(regexFinal, \`$1x: \${(lastCoord.x + 5).toFixed(1)}, y: \${Math.max(0, lastCoord.y - 10).toFixed(1)}$2\`);

fs.writeFileSync(mapFile, content);
console.log('Update Complete');
