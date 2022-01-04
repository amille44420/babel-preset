import path from 'path';
import { ConfigAPI, TransformOptions } from '@babel/core';

export type Options = Partial<{
    helpers: boolean;
    absoluteRuntime: boolean;
}>;

const isNotFalse = <T>(item: T | false | null | undefined): item is T =>
    !((typeof item === 'boolean' && item === false) || item === null || item === undefined);

/* eslint-disable global-require */
const index = (api: ConfigAPI, options: Options = {}): TransformOptions => {
    const isLoadIntentTest = process.env.NODE_ENV === 'test';
    const isLoadIntentDevelopment = process.env.NODE_ENV === 'development';
    const isCallerDevelopment = api.caller((caller: any) => caller?.isDev);
    const isTest = isCallerDevelopment == null && isLoadIntentTest;
    const isDevelopment = isCallerDevelopment === true || (isCallerDevelopment == null && isLoadIntentDevelopment);
    const isProduction = !(isTest || isDevelopment);

    let absoluteRuntimePath;

    if (options.absoluteRuntime) {
        absoluteRuntimePath = path.dirname(require.resolve('@babel/runtime/package.json'));
    }

    return {
        sourceType: 'unambiguous',

        presets: [
            isTest && [
                require.resolve('@babel/preset-env'),
                {
                    targets: {
                        node: 'current',
                    },
                    // Exclude transforms that make all code slower
                    exclude: ['transform-typeof-symbol'],
                },
            ],
            (isProduction || isDevelopment) && [
                // Latest stable ECMAScript features
                require.resolve('@babel/preset-env'),
                {
                    // Allow importing core-js in entrypoint and use browserlist to select polyfills
                    useBuiltIns: 'entry',
                    // Set the corejs version we are using to avoid warnings in console
                    // This will need to change once we upgrade to corejs@3
                    corejs: 3,
                    // Exclude transforms that make all code slower
                    exclude: ['transform-typeof-symbol'],
                },
            ],
        ].filter(isNotFalse),

        plugins: [
            // Polyfills the runtime needed for async/await, generators, and friends
            // https://babeljs.io/docs/en/babel-plugin-transform-runtime
            [
                require.resolve('@babel/plugin-transform-runtime'),
                {
                    corejs: false,
                    helpers: options.helpers || false,
                    // By default, babel assumes babel/runtime version 7.0.0-beta.0,
                    // explicitly resolving to match the provided helper functions.
                    // https://github.com/babel/babel/issues/10261
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    version: require('@babel/runtime/package.json').version,
                    regenerator: true,
                    // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
                    // We should turn this on once the lowest version of Node LTS
                    // supports ES Modules.
                    useESModules: isDevelopment || isProduction,
                    // Undocumented option that lets us encapsulate our runtime, ensuring
                    // the correct version is used
                    // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
                    absoluteRuntime: absoluteRuntimePath,
                },
            ],
        ],
    };
};

export default index;
