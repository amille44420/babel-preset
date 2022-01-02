module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['@amille/eslint-config', 'plugin:@typescript-eslint/recommended', 'prettier'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
    rules: {
        'import/extensions': [
            'error',
            'always',
            {
                js: 'never',
                ts: 'never',
            },
        ],
    },
};
