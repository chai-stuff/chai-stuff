const chai = require('chai');

const {sameProps, getSamePropsAlias} = require('../dist');

chai.use(sameProps);
chai.use(getSamePropsAlias('alias'));

const {assert} = chai;

describe('assert', () => {
  it('should set appropriate exports', () => { /* eslint-disable global-require */
    assert.deepEqual(Object.keys(require('../dist')), ['getSamePropsAlias', 'sameProps']);
  });

  context('should be available to chai', () => {
    it('sameProps', () => {
      const chai2 = require('chai');
      chai2.use(sameProps);
      assert.notEqual(chai2.assert.sameProps, undefined);
    });
    it('using getSamePropsAlias', () => {
      const chai3 = require('chai');
      chai3.use(getSamePropsAlias('someAlias'));
      assert.notEqual(chai3.assert.someAlias, undefined);
    });
  });

  it('should work w/ aliases', () => {
    const chai5 = require('chai');
    chai5.use(getSamePropsAlias('sameKeysAndValues'));
    chai5.assert.sameKeysAndValues({}, {});

    const chai6 = require('chai');
    chai6.use(getSamePropsAlias('deepEqualNoConstructorCheck'));
    chai6.assert.deepEqualNoConstructorCheck({}, {});
  }); /* eslint-enable global-require */

  it('should set a custom message', () => {
    const customMessage = 'the props aren\'t the same!';
    try {
      assert.sameProps({a: 1}, {a: 2}, customMessage);
    } catch (err) {
      assert.equal(err.message, customMessage);
    }
  });

  context('should work w/ objects:', () => {
    it('deeply equal native objects', () => {
      assert.sameProps({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
      assert.throws(() => assert.sameProps({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 4}));
    });
    it('deeply equal arrays', () => {
      assert.sameProps([1, 2, 3], [1, 2, 3]);
      assert.throws(() => assert.sameProps([1, 2, 3], [1, 2, 4]));
    });
    it('arrays and array-like objects', () => {
      assert.sameProps([1, 2, 3], {0: 1, 1: 2, 2: 3, length: 3});
      assert.sameProps({0: 1, 1: 2, 2: 3, length: 3}, [1, 2, 3]);
      assert.throws(() => assert.sameProps([1, 2, 3], {0: 1, 1: 2, 2: 3}));
    });
    it('Maps', () => {
      assert.sameProps(new Map([['a', 1]]), new Map([['a', 1]]));
      assert.throws(() => assert.sameProps(new Map([['a', 1]]), new Map([['a', 2]])));
    });
    it('Sets', () => {
      assert.sameProps(new Set([1, 2, 3]), new Set([1, 2, 3]));
      assert.throws(() => assert.sameProps(new Set([1, 2, 3]), new Set([1, 2, 4])));
    });
    it('custom iterables', () => {
      class Iterable extends Array {
        constructor(...elements) {
          super();
          this.array = elements;
          this.length = elements.length;
        }
        * [Symbol.iterator]() {
          for (const el of this.array)
            yield el;
        }
      }
      assert.sameProps(new Iterable(1, 2, 3), new Iterable(1, 2, 3));
      // TODO: Fix this; test passed against lib but not transpiled dist
      // assert.throws(() => assert.sameProps(new Iterable(1, 2, 3), new Iterable(1, 2, 4)));
    });
    it('errors', () => {
      const err1 = new Error('abc');
      const err2 = new Error('abc');
      err1.status = 400;
      err2.status = 400;
      assert.sameProps(err1, err2);

      err2.status = 200;
      assert.throws(() => assert.sameProps(err1, err2));
    });
    it('custom errors', () => {
      class MyError extends ReferenceError {}
      const err1 = new MyError('abc');
      const err2 = new MyError('abc');
      err1.status = 400;
      err2.status = 400;
      assert.sameProps(err1, err2);

      err2.status = 200;
      assert.throws(() => assert.sameProps(err1, err2));
    });
    it('primitives', () => { // not technically objects, but it's OK
      assert.sameProps(2, 2);
      assert.throws(() => assert.sameProps(1, 2));

      assert.sameProps('string', 'string');
      assert.throws(() => assert.sameProps('string', 'stringy'));

      assert.sameProps(null, null);
      assert.throws(() => assert.sameProps(null, undefined));

      assert.sameProps(undefined, undefined);
      assert.throws(() => assert.sameProps(undefined, null));

      assert.sameProps(true, true);
      assert.throws(() => assert.sameProps(true, false));
    });
    it('objectified primitives', () => { /* eslint-disable no-new-wrappers */
      // Numbers
      const num1 = new Number('1');
      const num2 = new Number('1');
      num1.key = 'value';
      num2.key = 'value';
      assert.sameProps(num1, num2);
      num2.key = 'anotherValue';
      assert.throws(() => assert.sameProps(num1, num2));

      const num3 = new Number('3');
      const num4 = new Number('4');
      assert.throws(() => assert.sameProps(num3, num4));

      // Strings
      const str1 = new String(123);
      const str2 = new String(123);
      str1.key = 'value';
      str2.key = 'value';
      assert.sameProps(str1, str2);
      str2.key = 'anotherValue';
      assert.throws(() => assert.sameProps(str1, str2));

      const str3 = new String(1);
      const str4 = new String(2);
      assert.throws(() => assert.sameProps(str3, str4));

      // Booleans
      const bool1 = new Boolean(1);
      const bool2 = new Boolean(1);
      bool1.key = 'value';
      bool2.key = 'value';
      assert.sameProps(bool1, bool2);
      bool2.key = 'anotherValue';
      assert.throws(() => assert.sameProps(bool1, bool2));

      const bool3 = new Boolean(1);
      const bool4 = new Boolean(0);
      assert.throws(() => assert.sameProps(bool3, bool4));

      // null
      const null1 = Object.create(null);
      const null2 = Object.create(null);
      null1.key = 'value';
      null2.key = 'value';
      assert.sameProps(null1, null2);
      null2.key = 'anotherValue';
      assert.throws(() => assert.sameProps(null1, null2));
    }); /* eslint-enable no-new-wrappers */
  });

  it('should not depend on order of props', () => {
    assert.sameProps(
      {c: null, b: null, a: null, 3: null, 2: null, 1: null},
      {a: null, b: null, c: null, 1: null, 2: null, 3: null},
    );
  });

  it('should not pass just because objects have the same number of props', () => {
    assert.throw(() => assert.sameProps(
      {a: undefined, b: undefined, c: undefined},
      {d: undefined, e: undefined, f: undefined},
    ));
  });

  context('should not work w/ objects:', () => {
    it('WeakMaps', () => {
      assert.throws(() => assert.sameProps(new WeakMap([[{}, 1]]), new WeakMap([[{}, 1]])));
    });
    it('WeakSets', () => {
      assert.throws(() => assert.sameProps(new WeakSet([{}]), new WeakSet([{}])));
    });
  });

  it('should ignore symbol props', () => {
    const obj1 = {a: 1, [Symbol('foo')]: 1};
    const obj2 = {a: 1, [Symbol('foo')]: 2};
    assert.sameProps(obj1, obj2);
  });
});
