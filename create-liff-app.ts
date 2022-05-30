/* Copyright 2022 LINE Corporation

* LINE Corporation licenses this file to you under the Apache License,
* version 2.0 (the "License"); you may not use this file except in compliance
* with the License. You may obtain a copy of the License at:

* https://www.apache.org/licenses/LICENSE-2.0

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations
* under the License.
*/

import fs from 'fs';
import path from 'path';
import { Answers } from 'inquirer';
import spawn from 'cross-spawn';
import chalk from 'chalk';
import validate from 'validate-npm-package-name';
import inquirer, { ListQuestion, Question } from 'inquirer';

const rename: Record<string, string> = {
  '.gitignore.default': '.gitignore'
};

export function init() {
  console.log(
    `${chalk.greenBright('Welcome')} to the ${chalk.cyan('Create LIFF App')}`
  );
  prompt(questions).then(async (answers) => await createLiffApp(answers));
}

type PackageManager = 'npm' | 'yarn'

export async function createLiffApp(answers: Answers) {
  const { projectName, template, language, installNow, liffId } = answers;
  const templateConfig = templates[template];
  const isTypescript = language === 'TypeScript';
  const cwd = process.cwd();
  const root = path.join(cwd, projectName);
  const packageManager: PackageManager = installNow
    ? await inquirer
      .prompt({
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager do you want to use?',
        choices: [
          {
            key: 'yarn',
            value: 'yarn',
            checked: true,
          },
          {
            key: 'npm',
            value: 'npm',
            checked: false,
          },
        ],
      })
      .then(({ packageManager }) => packageManager as PackageManager)
    : 'npm';

  try {
    // create directory
    fs.mkdirSync(root, { recursive: true });

    // copy files
    const templateName = `${template}${isTypescript ? '-ts' : ''}`;
    const templateDir = path.join(__dirname, '../templates', templateName);
    const files = fs.readdirSync(templateDir);
    for(const file of files.filter(f => f !== 'package.json')) {
      const src = path.join(templateDir, file);
      const dest = rename[file] ? path.join(root, rename[file]) : path.join(root, file);
      copy(src, dest);
    }

    // create package.json
    const packageName = isValidPackageName(projectName) ? projectName : toValidPackageName(projectName);
    const pkg = require(path.join(templateDir, 'package.json'));
    pkg.name = packageName;
    fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg, null, 2));

    // create .env file
    const content = `${templateConfig.envPrefix}LIFF_ID=${liffId}`;
    const envFileName = templateConfig?.envFileNameVariant || '.env';
    fs.writeFileSync(path.join(root, envFileName), content);

    // install
    const isYarn = packageManager === 'yarn';
    const { dependencies, devDependencies, tsDevDependencies } = templateConfig;
    if (isTypescript) devDependencies.push(...tsDevDependencies);

    console.log(`\n${installNow ? 'Installing' : 'Updating'} dependencies:`);
    dependencies.forEach((dependency) => console.log(`- ${chalk.blue(dependency)}`));
    console.log();
    await install({ root, isYarn, dependencies, isDev: false, installNow });

    console.log(`\n${installNow ? 'Installing' : 'Updating'} devDependencies:`);
    devDependencies.forEach((dependency) => console.log(`- ${chalk.blue(dependency)}`));
    console.log();
    await install({ root, isYarn, dependencies: devDependencies, isDev: true, installNow });

    // Done
    showDoneComments({ projectName, installNow, isYarn });
  } catch(error) {
    console.error(error);
    process.exit(1);
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for(const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isValidPackageName(name: string): boolean {
  const {
    validForNewPackages
  } = validate(name);
  return validForNewPackages;
}

function toValidPackageName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');
}

function install({
  root,
  dependencies,
  isYarn,
  isDev,
  installNow
}: {
  root: string;
  dependencies: string[];
  isYarn: boolean;
  isDev: boolean;
  installNow: boolean;
}) {
  return new Promise<void>((resolve, reject) => {
    try {
      // `isYarn` is false when `installNow` is false
      const command = isYarn ? 'yarnpkg' : 'npm';
      const args: string[] = [];
      if (isYarn) {
        args.push('add', '--exact', '--cwd', root);
        if (isDev) args.push('--dev');
      } else {
        args.push('install', '--save-exact', '--prefix', root);
        if (isDev) args.push('--save-dev');
      }
      if (!installNow) args.push('--no-package-lock', '--package-lock-only');
      args.push(...dependencies);

      const child = spawn(command, args, {
        stdio: 'inherit',
        env: { ...process.env, ADBLOCK: '1', DISABLE_OPENCOLLECTIVE: '1' }
      });
      child.on('close', code => {
        if (code !== 0) {
          reject({ command: `${command} ${args.join(' ')}` });
          return;
        }

        // deletes package-lock.json if it gets created, for some reason
        if (!installNow) fs.rmSync(path.join(root, 'package-lock.json'));

        resolve();
      });
    } catch(error) {
      reject(`Error occurred during installation: ${error}`);
    }
  });
}

function showDoneComments({projectName, installNow, isYarn}: {projectName: string, installNow: boolean, isYarn: boolean}){
  console.log('\n\nDone! Now run: \n');
  console.log(`  cd ${chalk.blue(projectName)}`);
  if (!installNow) {
    if (isYarn) {
      console.log('  yarn');
    } else {
      console.log('  npm install');
    }
  }
  if (isYarn) {
    console.log('  yarn dev\n\n');
  } else {
    console.log('  npm run dev\n\n');
  }
}

const prompt = inquirer.createPromptModule();
const questions: Array<Question | ListQuestion> = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter your project name: ',
    default: 'my-app',
    validate: (input: string) => {
      const projectName = input.trim();
      if (!projectName) {
        console.log(`\n${chalk.yellow('Project name is required.')}`);
        return false;
      }
      if (fs.existsSync(path.basename(projectName)) && fs.readdirSync(projectName).length !== 0) {
        console.log(`\n${chalk.yellow('The project is already exists.')}`);
        return false;
      }

      return true;
    },
  },
  {
    type: 'list',
    name: 'template',
    message: 'Which template do you want to use?',
    choices: [
      {
        value: 'vanilla',
        checked: true,
      },
      {
        value: 'react',
        checked: false,
      },
      {
        value: 'vue',
        checked: false,
      },
      {
        value: 'svelte',
        checked: false,
      },
      {
        value: 'nextjs',
        checked: false,
      },
      {
        value: 'nuxtjs',
        checked: false,
      },
    ],
  },
  {
    type: 'list',
    name: 'language',
    message: 'JavaScript or TypeScript?',
    choices: [
      {
        value: 'JavaScript',
        checked: true
      },
      {
        value: 'TypeScript',
        checked: false
      }
    ]
  },
  {
    type: 'input',
    name: 'liffId',
    message: `Please enter your LIFF ID: \n ${chalk.gray('Don\'t you have LIFF ID? Check out https://developers.line.biz/ja/docs/liff/getting-started/')}`,
    default: 'liffId',
    validate: (input: string) => {
      const liffId = input.trim();
      if (!liffId) {
        console.log();
        console.log(`${chalk.yellow('LIFF ID is required.')}`);
        return false;
      }
      return true;
    }
  },
  {
    type: 'confirm',
    name: 'installNow',
    message: 'Do you want to install it now with package manager?'
  }
];

type TemplateOptions = {
  envPrefix: string;
  envFileNameVariant?: string;
  dependencies: string[];
  devDependencies: string[];
  tsDevDependencies: string[];
};
const templates: Record<string, TemplateOptions> = {
  vanilla: {
    envPrefix: 'VITE_',
    dependencies: ['@line/liff'],
    devDependencies: ['vite'],
    tsDevDependencies: ['typescript'],
  },
  react: {
    envPrefix: 'VITE_',
    dependencies: ['@line/liff', 'react', 'react-dom'],
    devDependencies: ['@vitejs/plugin-react', 'vite'],
    tsDevDependencies: ['@types/react', '@types/react-dom', 'typescript'],
  },
  vue: {
    envPrefix: 'VITE_',
    dependencies: ['@line/liff', 'vue'],
    devDependencies: ['@vitejs/plugin-vue', 'vite'],
    tsDevDependencies: ['typescript', 'vue-tsc'],
  },
  svelte: {
    envPrefix: 'VITE_',
    dependencies: ['@line/liff'],
    devDependencies: ['@sveltejs/vite-plugin-svelte', 'svelte', 'vite'],
    tsDevDependencies: ['@tsconfig/svelte', 'svelte-check', 'svelte-preprocess', 'tslib', 'typescript'],
  },
  nextjs: {
    envPrefix: 'NEXT_PUBLIC_',
    envFileNameVariant: '.env.local',
    dependencies: ['@line/liff', 'next', 'react', 'react-dom'],
    devDependencies: ['eslint', 'eslint-config-next'],
    tsDevDependencies: ['@types/node', '@types/react', '@types/react-dom', 'typescript'],
  },
  nuxtjs: {
    envPrefix: '',
    dependencies: [
      '@line/liff',
      '@nuxtjs/axios',
      'core-js',
      'nuxt',
      'vue@2',
      'vue-server-renderer@2',
      'vue-template-compiler@2',
      'webpack'
    ],
    devDependencies: [
      '@babel/eslint-parser',
      '@nuxtjs/eslint-config',
      '@nuxtjs/eslint-module',
      'eslint',
      'eslint-plugin-nuxt',
      'eslint-plugin-vue',
    ],
    tsDevDependencies: ['@nuxt/types', '@nuxt/typescript-build', '@nuxtjs/eslint-config-typescript'],
  },
};
