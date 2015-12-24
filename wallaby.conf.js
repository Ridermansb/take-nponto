/*eslint-env node, browser */
var babel = require('babel-core');
var fs = require('fs');
var path = require('path');

var babelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc')));
babelConfig.babel = babel;

module.exports = function (wallaby) {
    return {
        files: [
            'node_modules/chai/chai.js',
            'src/**/*.js'
        ],

        tests: [
            'test/**/*Test.js'
        ],

        debug: true,

        testFramework: 'mocha',

        compilers: {
            '**/*.js': wallaby.compilers.babel(babelConfig)
        },

        env: {
            type: 'node',
            params: {
                runner: '--harmony --harmony_arrow_functions',
                env: 'TEST=true'
            }
        },

        bootstrap: function (wallaby) {
            var mocha = wallaby.testFramework;
            mocha.ui('bdd');
        }
    };
};
