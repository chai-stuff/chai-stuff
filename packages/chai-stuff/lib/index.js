const {notLengthOf, getNotLengthOfAlias} = require('@chai-stuff/not-length-of');
const {sameProps, getSamePropsAlias} = require('@chai-stuff/same-props');

const chaiStuff = (chai, utils) => {
  notLengthOf(chai, utils);
  sameProps(chai, utils);
};

Object.assign(chaiStuff, {
  notLengthOf,
  getNotLengthOfAlias,
  sameProps,
  getSamePropsAlias,
});

export default chaiStuff;
