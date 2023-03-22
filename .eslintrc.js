module.exports = {
    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
    ],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        'object-curly-newline': ['error', {'multiline': true }],
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/object-curly-spacing': ['error', 'never'],
    },
};
