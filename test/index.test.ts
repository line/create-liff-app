import fs from'fs';
import path from 'path';
import execa from 'execa';

const cliPath = path.join(__dirname, '../dist/index.js');
const templatePath = path.join(__dirname, '../templates/vanilla');
const projectName = 'test-app';
const projectPath = path.join(__dirname, projectName);
const ENTER = '\x0D';

// Increase timeout
jest.setTimeout(1000 * 60 * (process.env.RUNNER_OS === 'macOS' ? 10 : 5));

const rename: Record<string, string> = {
  '.gitignore.default': '.gitignore'
};
const generatedFiles = [
  '.env',
  'node_modules',
  'yarn.lock'
];

function removeProject() {
  fs.rmSync(projectPath, {
    recursive: true,
    force: true
  });
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function installProject({ args = [] as string[], inputs = [] as string[] }) {
  const result = execa('node', [cliPath, ...args], { cwd: __dirname });
  result.stdout?.on('data', chunk =>
    process.stdout.write(chunk.toString('utf8'))
  );
  for (const input of inputs) {
    result.stdin?.write(input);
    await timeout(500);
  }
  result.stdin?.end();
  await result;
  const files = fs.existsSync(projectPath) ? fs.readdirSync(projectPath) : [];
  return {
    exitCode: result.exitCode,
    files
  };
}

beforeEach(() => {
  removeProject();
});
afterEach(async () => {
  removeProject();
});

const commands = {
  vanilla: [projectName, ENTER, ENTER, ENTER, ENTER, ENTER],
};
const flags = {
  vanilla: [projectName, '-t', 'vanilla', '-l', 'id', '--js', '--use-yarn'],
};

describe('create-liff-app', () => {
  it('files properly created', async () => {
    const result = await installProject({ inputs: commands.vanilla });
    const templateFiles = fs.readdirSync(templatePath).map(f => rename[f] ? rename[f] : f);
    const expectedFiles = templateFiles.concat(generatedFiles);
    expect(result.files.sort()).toEqual(expectedFiles.sort());
    expect(result.exitCode).toBe(0);
  });

  it('creates app using only flags', async () => {
    const result = await installProject({ args: flags.vanilla });
    const templateFiles = fs.readdirSync(templatePath).map(f => rename[f] ? rename[f] : f);
    const expectedFiles = templateFiles.concat(generatedFiles);
    expect(result.files.sort()).toEqual(expectedFiles.sort());
    expect(result.exitCode).toBe(0);
  });
});
