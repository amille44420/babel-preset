# @amille/babel-preset

![npm](https://img.shields.io/npm/v/@amille/babel-preset)
![CircleCI](https://img.shields.io/circleci/build/github/amille44420/babel-preset)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```sh
# using npm
npm install --save-dev @amille/babel-preset

# or using yarn
yarn add -D @amille/babel-preset
```

Then create a file named `.babelrc` with following contents in the root folder of your project:

```json
{
  "presets": ["@amille/babel-preset"]
}
```

## Options

Options are

* `preset-env` [https://babeljs.io/docs/en/babel-preset-env]
* `preset-react` [https://babeljs.io/docs/en/babel-preset-react/]
* `preset-typescript` [https://babeljs.io/docs/en/babel-preset-typescript]
* `class-properties` [https://babeljs.io/docs/en/babel-plugin-proposal-class-properties] 
* `transform-runtime` [https://babeljs.io/docs/en/babel-plugin-transform-runtime]
