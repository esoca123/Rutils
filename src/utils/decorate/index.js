'use strict';

import * as R from 'ramda';;

module.exports = (...rest) => {

  let decorators = R.init(rest);
  let fnToDecorate = R.last(rest);

  return R.compose( ...decorators )( fnToDecorate );
}
