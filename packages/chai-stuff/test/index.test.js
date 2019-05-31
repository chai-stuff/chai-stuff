const chai = require('chai');

const chaiStuff = require('../dist');

const {assert} = chai;

describe('should be available to chai', () => {
  context('assert', () => {
    let chai2;
    beforeEach(() => {
      chai2 = require('chai'); // eslint-disable-line global-require
      chai2.use(chaiStuff);
    });

    it('sameProps', () => {
      assert.notEqual(chai2.assert.sameProps, undefined);
    });
    it('getSamePropsAlias', () => {
      chai2.use(chaiStuff.getSamePropsAlias('samePropsAlias'));
      assert.notEqual(chai2.assert.samePropsAlias, undefined);
    });

    it('notLengthOf', () => {
      assert.notEqual(chai2.assert.notLengthOf, undefined);
    });
    it('getNotLengthOfAlias', () => {
      chai2.use(chaiStuff.getNotLengthOfAlias('notLengthOfAlias'));
      assert.notEqual(chai2.assert.notLengthOfAlias, undefined);
    });
  });
});
