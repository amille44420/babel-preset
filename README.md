# @amille/babel-preset

![npm](https://img.shields.io/npm/v/@amille/babel-preset)
![CircleCI](https://img.shields.io/circleci/build/github/amille44420/babel-preset)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This package includes babel presets (inspired by [babel-preset-react-app][cra-preset]).

[cra-preset]: https://www.npmjs.com/package/babel-preset-react-app

## Installation

If you want to use this Babel preset in a project not built with Create React App, you can install it with the following steps.

First, [install Babel][babel].

Then install `@amille/babel-preset`.

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

This preset uses the `useBuiltIns` option with [transform-object-rest-spread] and [transform-react-jsx], which assumes that `Object.assign` is available or polyfilled.

[transform-object-rest-spread]: http://babeljs.io/docs/plugins/transform-object-rest-spread/
[transform-react-jsx]: http://babeljs.io/docs/plugins/transform-react-jsx/
[babel]: https://babeljs.io/docs/setup/

## Variants

This package comes with 3 available presets.
Ths configuration may change depending of your environment
which is specified trough environment variables in the following order :
`BABEL_ENV`, `NODE_ENV`.

#### Node/React (default)

This preset configures babel for the current node version with react support.

```json
{
  "presets": ["@amille/babel-preset"]
}
```

#### Node

This preset configures babel for the current node version and drop the react support.

```json
{
  "presets": ["@amille/babel-preset/no-react"]
}
```

You may also use the `noReact` options from any other variants.

```json
{
  "presets": [["@amille/babel-preset/no-react", { "noReact": true }]]
}
```

#### Browsers

This preset configures babel for browsers with react support.

```json
{
  "presets": ["@amille/babel-preset/browsers"]
}
```

The automatic configuration only support two kind of environment `production` and `development`.
You may manually override the browser list.

```json
{
  "presets": [
    [
      "@amille/babel-preset/browsers",
      {
        "browsers": ["last 1 chrome version"]
      }
    ]
  ]
}
```
