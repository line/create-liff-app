const fs = require('fs');
const path = require('path');
const execa = require('execa');
const chalk = require('chalk');

const templatesDir = path.join(__dirname, '../templates');
let updatedFiles = 0;

async function updateLiffVersions() {
  const version = await getLatestLiffVersion();
  const templates = fs.readdirSync(templatesDir);
  templates.forEach(templateName => {
    updateLiffVersion(templateName, version);
  });
  console.log(`Updated ${chalk.green('@line/liff')} version of ${chalk.yellow(updatedFiles)} templates to ${chalk.cyan(version)}`);
}

function updateLiffVersion(templateName, version) {
  const pkgPath = path.join(templatesDir, templateName, 'package.json');
  const pkg = require(pkgPath);
  if (pkg.dependencies['@line/liff'] === version) {
    return;
  }
  pkg.dependencies['@line/liff'] = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), { encoding: 'utf-8', flag: 'w' });
  updatedFiles++;
}

async function getLatestLiffVersion() {
  const result = execa('npm', ['show', '@line/liff', 'version']);
  let version = '';
  result.stdout.on('data', chunk => {
    version = version + chunk.toString('utf-8');
  });

  await result;
  return version.replace('\n', '');
}

updateLiffVersions();
