const chai = require('chai');

const {notLengthOf, getNotLengthOfAlias} = require('../dist');

chai.use(notLengthOf);
chai.use(getNotLengthOfAlias('alias'));

const {assert} = chai;

describe('notLengthOf', () => {
  context('assert', () => {
    it('should set appropriate exports', () => { /* eslint-disable global-require */
      assert.deepEqual(
        Object.keys(require('../dist')),
        ['getNotLengthOfAlias', 'notLengthOf'],
      );
    });

    context('should be available to chai', () => {
      it('notLengthOf', () => {
        const chai2 = require('chai');
        chai2.use(notLengthOf);
        assert.notEqual(chai2.assert.notLengthOf, undefined);
      });
      it('using getNotLengthOfAlias', () => {
        const chai3 = require('chai');
        chai3.use(getNotLengthOfAlias('someAlias'));
        assert.notEqual(chai3.assert.someAlias, undefined);
      });
    });

    it('should work w/ aliases', () => {
      const chai5 = require('chai');
      chai5.use(getNotLengthOfAlias('differentLength'));
      chai5.assert.differentLength({length: 1}, 2);

      const chai6 = require('chai');
      chai6.use(getNotLengthOfAlias('hasDifferentLength'));
      chai6.assert.hasDifferentLength({length: 1}, 2);
    });

    it('should set a custom message', () => {
      const customMessage = 'the length is equal!';
      try {
        assert.notLengthOf({length: 1}, 1, customMessage);
      } catch (err) {
        assert.equal(err.message, customMessage);
      }
    });

    it('should pass when object has a different length or size', () => {
      assert.notLengthOf({length: 1}, 2);
      assert.notLengthOf([1], 2);
      assert.notLengthOf('a', 2);
      assert.notLengthOf(a => a, 2);
      const err = new Error();
      err.length = 1;
      assert.notLengthOf(err, 2);
    });

    it('should fail when object has the expected length or size', () => {
      assert.throws(() => assert.notLengthOf({length: 1}, 1));
      assert.throws(() => assert.notLengthOf([1], 1));
      assert.throws(() => assert.notLengthOf('a', 1));
      assert.throws(() => assert.notLengthOf(a => a, 1));
      const err = new Error();
      err.length = 1;
      assert.throws(() => assert.notLengthOf(err, 1));
    });

    it('should work with Maps and Sets when chai is v4.20 or higher', () => {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const chai420 = require('chai-4.2.0');
      chai420.use(notLengthOf);

      const {assert} = chai420;

      assert.notLengthOf(new Set([1]), 2);
      assert.notLengthOf(new Map([['a', 1]]), 2);
      assert.throws(() => assert.notLengthOf(new Set([1]), 1));
      assert.throws(() => assert.notLengthOf(new Map([['a', 1]]), 1));
    });
  }); /* eslint-enable global-require */
});
