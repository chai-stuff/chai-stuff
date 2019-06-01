class ChaiStuffError extends Error {}

const fillObj = nonObj => [
  ...Object.getOwnPropertyNames(nonObj),
  ...Object.getOwnPropertySymbols(nonObj),
].reduce((obj, key) => ({...obj, [key]: nonObj[key]}), {});

const getOwnSortedPropertyNames = obj => Object.getOwnPropertyNames(obj).sort();

const strictEqual = (actual, expected) => {
  if (actual !== expected)
    throw new ChaiStuffError(`expected ${actual} to equal ${expected}`);
};

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

export {
  ChaiStuffError,
  fillObj,
  getOwnSortedPropertyNames,
  strictEqual,
  types,
};
