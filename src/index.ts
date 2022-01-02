import { dirname } from 'path';
import { ConfigAPI, TransformOptions } from '@babel/core';
import { Options as PresetEnvOptions } from '@babel/preset-env';

export type Options = Partial<{
    'preset-env': PresetEnvOptions;
    'preset-react': Partial<{
        pragma: string;
        development: boolean;
        pragmaFrag: string;
        throwIfNamespace: boolean;
        runtime: string;
        importSource: string;
        useBuiltIns: boolean;
        useSpread: boolean;
    }>;
    'preset-typescript': Partial<{
        isTSX: boolean;
        jsxPragma: string;
        jsxPragmaFrag: string;
        allExtensions: boolean;
        allowNamespaces: boolean;
        allowDeclareFields: boolean;
        disallowAmbiguousJSXLike: boolean;
        onlyRemoveTypeImports: boolean;
        optimizeConstEnums: boolean;
    }>;
    'class-properties': Partial<{
        loose: boolean;
    }>;
    'transform-runtime': Partial<{
        corejs: false | 2 | 3 | { version: 2 | 3; proposals: boolean };
        helpers: boolean;
        regenerator: boolean;
        useESModules: boolean;
        absoluteRuntime: boolean | string;
        version: string;
    }>;
}>;

const isNotFalse = <T>(item: T | false | null | undefined): item is T =>
    !((typeof item === 'boolean' && item === false) || item === null || item === undefined);

/* eslint-disable global-require */
const index = (api: ConfigAPI, options: Options = {}): TransformOptions => {
    const isLoadIntentTest = process.env.NODE_ENV === 'test';
    const isLoadIntentDevelopment = process.env.NODE_ENV === 'development';

    const supportsESM = api.caller(caller => !!caller?.supportsStaticESM);
    const isServer = api.caller((caller: any) => !!caller && caller.isServer);
    const isCallerDevelopment = api.caller((caller: any) => caller?.isDev);

    // Look at external intent if used without a caller (e.g. via Jest):
    const isTest = isCallerDevelopment == null && isLoadIntentTest;

    // Look at external intent if used without a caller (e.g. Storybook):
    const isDevelopment = isCallerDevelopment === true || (isCallerDevelopment == null && isLoadIntentDevelopment);

    // Default to production mode if not `test` nor `development`:
    const isProduction = !(isTest || isDevelopment);

    const isBabelLoader = api.caller(caller => !!caller && caller.name === 'babel-loader');

    const useJsxRuntime =
        options['preset-react']?.runtime === 'automatic' ||
        (Boolean(api.caller((caller: any) => !!caller && caller.hasJsxRuntime)) &&
            options['preset-react']?.runtime !== 'classic');

    const presetEnvConfig = {
        // In the test environment `modules` is often needed to be set to true,
        // babel figures that out by itself using the `'auto'` option || Boolean(options.hasJsxRuntime);
        // In production/development this option is set to `false`
        // so that webpack can handle import/export with tree-shaking
        modules: 'auto',
        exclude: ['transform-typeof-symbol'],
        include: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-proposal-nullish-coalescing-operator'],
        ...options['preset-env'],
    };

    // When transpiling for the server or tests, target the current Node version
    // if not explicitly specified:
    if (
        (isServer || isTest) &&
        (!presetEnvConfig.targets ||
            !(typeof presetEnvConfig.targets === 'object' && 'node' in presetEnvConfig.targets))
    ) {
        presetEnvConfig.targets = {
            // Targets the current process' version of Node. This requires apps be
            // built and deployed on the same version of Node.
            // This is the same as using "current" but explicit
            node: process.versions.node,
        };
    }

    return {
        sourceType: 'unambiguous',

        presets: [
            [require.resolve('@babel/preset-env'), presetEnvConfig],
            [
                require.resolve('@babel/preset-react'),
                {
                    // This adds @babel/plugin-transform-react-jsx-source and
                    // @babel/plugin-transform-react-jsx-self automatically in development
                    development: isDevelopment || isTest,
                    ...(useJsxRuntime ? { runtime: 'automatic' } : { pragma: '__jsx' }),
                    ...options['preset-react'],
                },
            ],
            [require.resolve('@babel/preset-typescript'), { allowNamespaces: true, ...options['preset-typescript'] }],
        ],

        plugins: [
            [
                require.resolve('babel-plugin-styled-components'),
                {
                    ssr: true,
                },
            ],
            [
                require.resolve('babel-plugin-import'),
                {
                    libraryName: 'antd',
                    style: !isServer,
                    css: !isServer,
                },
            ],
            !useJsxRuntime && [
                require.resolve('@babel/plugin-transform-react-jsx'),
                {
                    module: 'react',
                    importAs: 'React',
                    pragma: '__jsx',
                    property: 'createElement',
                },
            ],
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            [require.resolve('@babel/plugin-proposal-class-properties'), options['class-properties'] || {}],
            [
                require.resolve('@babel/plugin-proposal-object-rest-spread'),
                {
                    useBuiltIns: true,
                },
            ],
            !isServer && [
                require.resolve('@babel/plugin-transform-runtime'),
                {
                    corejs: false,
                    helpers: true,
                    regenerator: true,
                    useESModules: supportsESM && presetEnvConfig.modules !== 'commonjs',
                    absoluteRuntime: isBabelLoader
                        ? dirname(require.resolve('@babel/runtime/package.json'))
                        : undefined,
                    ...options['transform-runtime'],
                },
            ],
            isProduction && [
                require.resolve('babel-plugin-transform-react-remove-prop-types'),
                {
                    removeImport: true,
                },
            ],
            // Always compile numeric separator because the resulting number is
            // smaller.
            require.resolve('@babel/plugin-proposal-numeric-separator'),
            require.resolve('@babel/plugin-transform-modules-commonjs'),
        ].filter(isNotFalse),
    };
};

export default index;
