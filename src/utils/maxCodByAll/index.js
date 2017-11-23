'use strict';

import * as R from 'ramda';;


import maxCodBy '../maxCodBy'


module.exports = R.curry( ( fn, xs ) => {

    return R.reduce( maxCodBy(fn) , -Infinity, xs )
});
