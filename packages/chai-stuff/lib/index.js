import {notLengthOf, getNotLengthOfAlias} from '../../not-length-of/lib/index';
import {sameProps, getSamePropsAlias} from '../../same-props/lib/index';

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
