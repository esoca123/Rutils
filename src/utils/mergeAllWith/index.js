'use strict';

import * as R from 'ramda';;


import maxCodBy '../maxCodBy'



module.exports = R.curry( (fn, xs) =>  R.reduce( R.mergeWith( fn ), {}, xs ) );
