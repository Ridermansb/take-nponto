/* eslint-env node, mocha */

var nponto = require('../src/app');
var chai = require('chai');
chai.should();
var expect = chai.expect;

describe('take-nponto', function() {
    it('should export', function() {
        nponto.should.exist;
    });

    it('should export a function', function() {
        nponto.should.to.be.a('function');
    });

    it('when call with missing pdf should return a error', function() {
        // expect(nponto(undefined)).to.throw('Ops error!');
    });
});
