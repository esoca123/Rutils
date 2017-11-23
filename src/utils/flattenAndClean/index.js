'use strict';

import * as R from 'ramda';;




module.exports = R.unless(
    R.isNil,
    R.pipe(
        R.flatten,
        R.reject( R.isNil )
    )
);
