# @amille/babel-preset

This package includes the Babel preset (inspired by [babel-preset-react-app][cra-preset]).

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
