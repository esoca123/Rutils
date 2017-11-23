'use strict';

import * as R from 'ramda';;


module.exports = R.curry( ( fn, xs ) => {

    return R.reduce( R.maxBy(fn) , -Infinity, xs )
});
