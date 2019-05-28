class ChaiStuffError extends Error {}

const fillObj = nonObj => Reflect.ownKeys(nonObj).reduce((obj, key) => ({
  ...obj,
  [key]: nonObj[key],
}), {});

const types = new Map([
  [Map, map => [...map].reduce((obj, [key, val]) => ({
    ...obj,
    [key]: val,
  }), {})],
  [Set, set => [...set]],
  [WeakMap, () => { throw new ChaiStuffError('WeakMaps cannot be compared'); }],
  [WeakSet, () => { throw new ChaiStuffError('WeakSets cannot be compared'); }],
  [Number, num => ({Number: +num, ...num})],
  [String, str => fillObj(str)],
  [Boolean, bool => ({Boolean: bool.valueOf(), ...bool})],
]);

const strictEqual = (actual, expected) => {
  if (actual !== expected)
    throw new ChaiStuffError(`expected ${actual} to equal ${expected}`);
};

const getSameProps = (alias = 'sameProps') => ({assert}, {addMethod, inspect}) => {
  addMethod(assert, alias, (actual, expected) => {
    const _actual = {original: actual, converted: actual};
    const _expected = {original: expected, converted: expected};
    try {
      if (Object(actual) !== actual || Object(expected) !== expected)
        return strictEqual(actual, expected);
      if (actual instanceof Error) {
        _actual.converted = fillObj(actual);
        delete _actual.converted.stack;
      }
      if (expected instanceof Error) {
        _expected.converted = fillObj(expected);
        delete _expected.converted.stack;
      }
      if (types.has(actual.constructor))
        _actual.converted = types.get(actual.constructor)(actual);
      else if (actual[Symbol.iterator])
        _actual.converted = [...actual];
      if (types.has(expected.constructor))
        _expected.converted = types.get(expected.constructor)(expected);
      else if (expected[Symbol.iterator])
        _expected.converted = [...expected];
      const actualKeys = Object.getOwnPropertyNames(_actual.converted);
      assert.deepEqual(actualKeys, Object.getOwnPropertyNames(_expected.converted));
      assert.isTrue(
        actualKeys.every(key => _actual.converted[key] === _expected.converted[key]),
      );
    } catch (err) {
      if (err instanceof ChaiStuffError) throw err;
      const prettify = ({original, converted}) => `${
        original && original.constructor && original.constructor.name || ''
      } ${inspect([Object, Array]
        .some(Class => converted.constructor === Class) ? converted : fillObj(converted))}`;
      err.message = `expected ${
        prettify(_actual)
      } to have the same properties as ${
        prettify(_expected)
      }`;
      err.showDiff = true;
      err.actual = _actual.converted;
      err.expected = _expected.converted;
      throw err;
    }
  });
};

const sameProps = getSameProps();
const getSamePropsAlias = alias => getSameProps(alias);

Object.defineProperty(sameProps, 'name', {
  value: 'sameProps', configurable: true,
});

export {
  sameProps,
  getSamePropsAlias,
};
