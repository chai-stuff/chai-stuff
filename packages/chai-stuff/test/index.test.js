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
      assert.exists(chai2.assert.sameProps);
    });
    it('getSamePropsAlias', () => {
      chai2.use(chaiStuff.getSamePropsAlias('someAlias'));
      assert.exists(chai2.assert.someAlias);
    });
  }); /* eslint-enable global-require */
});
