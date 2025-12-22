# RPRC Website

A revamped website for the Richmond Poverty Reduction Coalition

## Features

- A brand new look!
- Membership and admin sign in/log in
- Membership and admin dashboard
- News feed
- Events calendar

## Pre-requisites

- **NodeJS LTS**: if you are on windows, install with [nvm windows](https://github.com/coreybutler/nvm-windows)

- **npm**: npm is shipped as the default package manager for NodeJS

- **VSCode extensions**: while these extensions are not a hard requirement for developing, these speed up linting and formating quite a lot
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): these catches any linting error by showing highlights on VSCode's problems tab
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): for formatting our code to look pretty :). It automatically picks up the configuration in the`.prettierrc` file
  - [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint): this README follows the default configuration laid out from this extension, markdownlint is not currently installed on this project yet as a dependency

## Linting and formatting

You can leave for the GitHub Actions runner to catch any linting/formatting error. But to save time, it is best that this is done locally.

```shell
npm run lint
npm run format
```

## Testing

Running your test is also only one command away:

```shell
npm run test
```

## Installation

```shell
npm install
npm run dev
```

## Contribute

Refer to the current [RPRC Development Guideline](https://docs.google.com/document/d/1SECkBGbbApRFhOrFFFYxbfcnb0HVOsZOI5pVPgn1XLs/edit?usp=sharing)
