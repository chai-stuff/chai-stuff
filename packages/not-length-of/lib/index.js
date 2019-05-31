const getNotLengthOf = (alias = 'notLengthOf') => ({assert}, {addMethod, inspect}) => (
  addMethod(assert, alias, (actual, expected) => {
    let _actual = inspect(actual);
    try {
      assert.throws(() => assert.lengthOf(actual, expected));
    } catch (err) {
      if (actual[Symbol.iterator] && !Array.isArray(actual) && typeof actual !== 'string')
        _actual = `${actual.constructor.name} ${inspect([...actual])
          .replace(/^\[/, '{').replace(/\]$/, '}')}`;
      if (typeof actual === 'function')
        _actual = actual.toString();
      err.message = `expected ${
        _actual
      } not to have a length of ${
        inspect(expected)
      }`;
      throw err;
    }
  })
);

const notLengthOf = getNotLengthOf();
const getNotLengthOfAlias = alias => getNotLengthOf(alias);

Object.defineProperty(notLengthOf, 'name', {
  value: 'notLengthOf', configurable: true,
});

export {
  notLengthOf,
  getNotLengthOfAlias,
};
