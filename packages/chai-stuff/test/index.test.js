const chai = require('chai');

const chaiStuff = require('../dist');

const {assert} = chai;

describe('should be available to chai', () => {
  context('assert', () => { /* eslint-disable global-require */
    let chai2;
    beforeEach(() => {
      chai2 = require('chai');
      chai2.use(chaiStuff);
    });
    it('sameProps', () => {
      assert.notEqual(chai2.assert.sameProps, undefined);
    });
    it('getSamePropsAlias', () => {
      chai2.use(chaiStuff.getSamePropsAlias('someAlias'));
      assert.notEqual(chai2.assert.someAlias, undefined);
    });
  }); /* eslint-enable global-require */
});
