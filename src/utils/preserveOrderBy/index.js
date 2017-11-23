'use strict';

import * as R from 'ramda';;


module.exports = R.curry( (fn, xs, objs) => {

    let objsIndexed = R.indexBy( fn, objs );

    return R.map(  x => objsIndexed[ x ] || null  ,  xs )
} );
