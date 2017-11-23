'use strict';

import * as R from 'ramda';;



module.exports = R.pipe(
    R.toLower,
    R.lift( R.concat )(R.compose( R.toUpper, R.head), R.tail)
);
