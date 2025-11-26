const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');

try {
  const packageJson = require(packageJsonPath);
  const versionParts = packageJson.version.split('.');
  
  // Increment patch version
  versionParts[2] = parseInt(versionParts[2]) + 1;
  
  const newVersion = versionParts.join('.');
  packageJson.version = newVersion;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`Version updated to ${newVersion}`);
} catch (error) {
  console.error('Error updating version:', error);
  process.exit(1);
}
