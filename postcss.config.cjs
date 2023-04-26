module.exports = {
    plugins: [
        require('postcss-mixins'),
        // https://github.com/postcss/postcss-nested
        require('postcss-nested'),
        require('postcss-simple-vars')({}),
        require('postcss-each')({
            plugins: {
                afterEach: [
                    require('postcss-at-rules-variables'),
                ],
            }
        }),
        require('postcss-atroot'),
        require('postcss-html'),

        require('postcss-import'),

        // https://www.npmjs.com/package/postcss-place
        // place-content: space-between center; ==> align-content: space-between;justify-content: center;place-content: space-between center;
        require('postcss-place'),
        require('autoprefixer'),

        require('postcss-preset-env')({
            browsers: '>0.3%, IE >= 11',
            features: {
                'custom-properties': true,
                'nesting-rules': true,
                'color-function': true,
                'color-functional-notation': true,
            },
            autoprefixer: {
                grid: true,
                flexbox: 'no-2009',
            },
        }),
    ],
}
