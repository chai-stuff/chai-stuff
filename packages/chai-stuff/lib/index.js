import {sameProps, getSamePropsAlias} from '../../same-props/lib/index';

const chaiStuff = (chai, utils) => {
  sameProps(chai, utils);
};

Object.assign(chaiStuff, {
  sameProps,
  getSamePropsAlias,
});

export default chaiStuff;
