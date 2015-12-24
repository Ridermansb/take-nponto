/* eslint-env node, mocha */

var nponto = require('../src/app');
require('chai').should();

describe('take-nponto', function() {
    it('should export', function() {
        nponto.should.exist;
    });

    it('should export a function', function() {
        nponto.should.to.be.a('function');
    });
});
