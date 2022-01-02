import { ConfigAPI, TransformOptions } from '@babel/core';
import { Options as PresetEnvOptions, BrowserslistQuery } from '@babel/preset-env';

export type Options = Partial<{
    browsers: BrowserslistQuery | ReadonlyArray<BrowserslistQuery>;
    helpers: boolean;
    noReact: boolean;
}>;

const isNotFalse = <T>(item: T | false | null | undefined): item is T =>
    !((typeof item === 'boolean' && item === false) || item === null || item === undefined);

/* eslint-disable global-require */
const create = (env: string, api: ConfigAPI, options?: Options): TransformOptions => {
    // list environment for which we have specific behaviors
    const isEnvTest = env === 'test';
    const isEnvDevelopment = env === 'development';
    const isEnvProduction = env === 'production';

    // get options
    const { browsers, helpers = isEnvDevelopment, noReact = false } = options || {};
    const isReactApp = !noReact;

    // preset env options (by default on the current node version)
    let presetEnvOptions: PresetEnvOptions = { targets: { node: 'current' } };

    if (browsers) {
        // we switch to browsers
        presetEnvOptions = {
            targets: { browsers },

            // Allow importing core-js in entrypoint and use browserlist to select polyfills
            useBuiltIns: 'entry',

            // Set the corejs version we are using to avoid warnings in console
            // This will need to change once we upgrade to corejs@3
            corejs: 3,

            // Do not transform modules to CJS
            modules: false,

            // Exclude transforms that make all code slower
            exclude: ['transform-typeof-symbol'],
        };
    }

    return {
        presets: [
            // A Babel preset that can automatically determine the Babel plugins and polyfills
            // https://github.com/babel/babel-preset-env
            ['@babel/preset-env', presetEnvOptions],

            // JSX
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react
            isReactApp && [
                '@babel/preset-react',
                {
                    // Adds component stack to warning messages
                    // Adds __self attribute to JSX which React will use for some warnings
                    development: isEnvDevelopment,

                    // Will use the native built-in instead of trying to polyfill
                    // behavior for any plugins that require one.
                    useBuiltIns: true,
                },
            ],
        ].filter(isNotFalse),

        plugins: [
            // Experimental macros support. Will be documented after it's had some time
            // in the wild.
            require('babel-plugin-macros'),

            // Necessary to include regardless of the environment because
            // in practice some other transforms (such as object-rest-spread)
            // don't work without it: https://github.com/babel/babel/issues/7215
            [
                require.resolve('@babel/plugin-transform-destructuring'),
                {
                    // Use loose mode for performance:
                    // https://github.com/facebook/create-react-app/issues/5602
                    loose: false,

                    ...(isReactApp && {
                        selectiveLoose: [
                            'useState',
                            'useEffect',
                            'useContext',
                            'useReducer',
                            'useCallback',
                            'useMemo',
                            'useRef',
                            'useImperativeHandle',
                            'useLayoutEffect',
                            'useDebugValue',
                        ],
                    }),
                },
            ],

            // Adds Numeric Separators
            require.resolve('@babel/plugin-proposal-numeric-separator'),

            // The following two plugins use Object.assign directly, instead of Babel's
            // extends helper. Note that this assumes `Object.assign` is available.
            // { ...todo, completed: true }
            [
                require.resolve('@babel/plugin-proposal-object-rest-spread'),
                {
                    useBuiltIns: true,
                },
            ],

            // class { handleClick = () => { } }
            // Enable loose mode to use assignment instead of defineProperty
            // See discussion in https://github.com/facebook/create-react-app/issues/4263
            [
                require.resolve('@babel/plugin-proposal-class-properties'),
                {
                    loose: true,
                },
            ],

            // Polyfills the runtime needed for async/await, generators, and friends
            // https://babeljs.io/docs/en/babel-plugin-transform-runtime
            [
                require.resolve('@babel/plugin-transform-runtime'),
                {
                    corejs: false,
                    helpers,
                    // By default, babel assumes babel/runtime version 7.0.0-beta.0,
                    // explicitly resolving to match the provided helper functions.
                    // https://github.com/babel/babel/issues/10261
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    version: require('@babel/runtime/package.json').version,
                    regenerator: true,
                    // Undocumented option that lets us encapsulate our runtime, ensuring
                    // the correct version is used
                    // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
                    absoluteRuntime: true,
                },
            ],

            // Remove PropTypes from production build
            isReactApp &&
                isEnvProduction && [
                    require.resolve('babel-plugin-transform-react-remove-prop-types'),
                    {
                        removeImport: true,
                    },
                ],

            // Adds syntax support for import()
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            // Adds syntax support for optional chaining (?.)
            require.resolve('@babel/plugin-proposal-optional-chaining'),
            // Adds syntax support for default value using ?? operator
            require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
            // Transform dynamic import to require
            isEnvTest && require.resolve('babel-plugin-dynamic-import-node'),
        ].filter(isNotFalse),
    };
};

export default create;
