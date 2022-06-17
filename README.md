# @line/create-liff-app
[![License](https://img.shields.io/badge/license-Apache-red)](https://www.apache.org/licenses/LICENSE-2.0)
[![Node](https://img.shields.io/badge/node-%E2%89%A7%2014-green?logo=node.js)](https://www.npmjs.com/package/@line/create-liff-app)

Start developing LIFF application with a simple CLI command.

- [About](#about)
  - [LIFF](#liff)
  - [Templates](#templates)
- [Getting Started](#getting-started)
  - [Create LIFF Channel](#create-liff-channel)
  - [Installation](#installation)
  - [Options](#options)
- [License](#license)

## About

### LIFF
LINE Front-end Framework (LIFF) is a platform for web apps provided by LINE. The web apps running on this platform are called LIFF apps.

Do you want to know more about LIFF? [Learn more](https://developers.line.biz/en/docs/liff/overview/)

### Templates
`create-liff-app` provides JavaScript & TypeScript templates of LIFF application.

Available frameworks are: `nextjs` `nuxtjs` `react` `vue` `svelte` `vanilla`.


## Getting Started

### Create LIFF Channel
Before you run `create-liff-app`, we recommend creating a LIFF Channel first. See the [documentation](https://developers.line.biz/en/docs/liff/getting-started/).

### Installation

Run npm command like:
```bash
npx @line/create-liff-app
```

To create a new app in a specific folder, you can send a name as an argument.
```bash
npx @line/create-liff-app my-app
```

### Options

`create-liff-app` comes with the following options:

- **-t, --template &lt;template&gt;** - A template to bootstrap the app with. (available templates: "vanilla", "react", "vue", "svelte", "nextjs", "nuxtjs")
- **-l, --liffid &lt;liff id&gt;** - Liff id. For more information, please visit <https://developers.line.biz/ja/docs/liff/getting-started/>
- **--js, --javascript** - Initialize as a JavaScript project
- **--ts, --typescript** - Initialize as a TypeScript project
- **--npm, --use-npm** - Bootstrap the app using npm
- **--yarn, --use-yarn** - Bootstrap the app using yarn
- **-v, --version** - output the version number
- **-h, --help** - display help for command

## [License](https://github.com/line/create-liff-app/blob/master/LINCENSE.txt)

This project is licensed under the **Apache license**. 
See [LICENSE](https://github.com/line/create-liff-app/blob/master/LINCENSE.txt) for more information.

Also, using LIFF means you agree to the [LINE Developers Agreement](https://terms2.line.me/LINE_Developers_Agreement).
