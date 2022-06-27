#!/usr/bin/env node
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

import { Command, Option } from 'commander';
import packageJson from './package.json';
import { init, templateNames } from './create-liff-app';
import type { Answers } from 'inquirer';

const answers = parseFlags();
init(answers);

function parseFlags() {
  const answers: Answers = {};

  new Command(packageJson.name)
    .version(packageJson.version, '-v, --version')
    .usage('[project name] [options]')
    .arguments('[projectName]')
    .addOption(
      new Option('-t, --template <template>', 'Choose a template to bootstrap the app with').choices(templateNames)
    )
    .option(
      '-l, --liffid <liff id>',
      'Liff id. For more information, please visit https://developers.line.biz/ja/docs/liff/getting-started/'
    )
    .option('--js, --javascript', 'Initialize as a JavaScript project')
    .option('--ts, --typescript', 'Initialize as a TypeScript project')
    .option('--npm, --use-npm', 'Bootstrap the app using npm')
    .option('--yarn, --use-yarn', 'Bootstrap the app using yarn')
    .action((projectName, options) => {
      const { template, liffid, javascript, typescript, useNpm, useYarn } = options;

      // projectName
      if (typeof projectName === 'string') answers.projectName = projectName;

      // template
      if (typeof template === 'string') answers.template = template;

      // liffId
      if (typeof liffid === 'string') answers.liffId = liffid;

      // language
      if (javascript) answers.language = 'JavaScript';
      if (typescript) answers.language = 'TypeScript';

      // packageManager
      if (useNpm) answers.packageManager = 'npm';
      if (useYarn) answers.packageManager = 'yarn';
    })
    .parse(process.argv);

  return answers;
}
