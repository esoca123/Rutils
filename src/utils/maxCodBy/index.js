'use strict';

import * as R from 'ramda';;



module.exports = R.curry( (fn,x,y) => {

  let xRes = fn( x )
  let yRes = fn( y ) ;

  return xRes > yRes ? xRes : yRes;
});
