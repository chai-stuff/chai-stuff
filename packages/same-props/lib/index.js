import {
  ChaiStuffError,
  fillObj,
  getOwnSortedPropertyNames,
  strictEqual,
  types,
} from './helpers';

const getSameProps = (alias = 'sameProps') => ({assert}, {addMethod, inspect}) => (
  addMethod(assert, alias, (actual, expected, message) => {
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
      const actualKeys = getOwnSortedPropertyNames(_actual.converted);
      assert.deepEqual(actualKeys, getOwnSortedPropertyNames(_expected.converted));
      assert.isTrue(
        actualKeys.every(key => _actual.converted[key] === _expected.converted[key]),
      );
    } catch (err) {
      if (err instanceof ChaiStuffError) throw err;
      const prettify = ({original, converted}) => `${
        original && original.constructor && original.constructor.name || ''
      } ${inspect([Object, Array]
        .some(Class => converted.constructor === Class) ? converted : fillObj(converted))}`;
      err.message = message || `expected ${
        prettify(_actual)
      } to have the same properties as ${
        prettify(_expected)
      }`;
      err.showDiff = true;
      err.actual = _actual.converted;
      err.expected = _expected.converted;
      throw err;
    }
  })
);

const sameProps = getSameProps();
const getSamePropsAlias = alias => getSameProps(alias);

Object.defineProperty(sameProps, 'name', {
  value: 'sameProps', configurable: true,
});

export {
  sameProps,
  getSamePropsAlias,
};
