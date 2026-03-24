import fs from 'fs';

const coords = [
  [40.0, 53.0],
  [45.7, 62.5],
  [45.3, 67.7],
  [35.0, 65.2],
  [29.3, 60.9],
  [24.5, 54.6],
  [27.7, 48.1],
  [24.8, 45.3],
  [28.1, 37.1],
  [36.1, 32.7],
  [45.8, 31.3],
  [52.5, 28.0],
  [62.4, 31.0],
  [73.5, 36.0],
  [77.9, 39.6],
  [83.8, 40.2],
  [91.7, 46.5],
  [89.4, 51.9],
  [85.8, 60.2],
  [79.8, 69.8]
];

const filePath = 'c:/Users/ss876/Downloads/cyber-ops-arena-main/cyber-ops-arena-main/src/data/gameMap.ts';
let code = fs.readFileSync(filePath, 'utf8');

for (let i = 1; i <= 20; i++) {
  const [newX, newY] = coords[i-1];
  
  // Find R1_NX block and update its x: and y:
  const regex = new RegExp(`(id:\\s*'R1_N${i}'[\\s\\S]*?nextOnCorrect:[\\s\\S]*?x:\\s*)[0-9.]+([^y]*y:\\s*)[0-9.]+`, 'g');
  code = code.replace(regex, `$1${newX}$2${newY}`);
}

fs.writeFileSync(filePath, code);
console.log('Update complete');
