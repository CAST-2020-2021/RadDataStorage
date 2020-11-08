module.exports = {
    env: {
        es2021: true,
        node: true,
        browser: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        indent: ['error', 4],
    },
};
