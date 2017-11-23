'use strict';

import * as R from 'ramda';;

module.exports = R.curry( (x,y) =>  (x || y) &&  !( x && y )  )
