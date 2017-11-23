'use strict';

import * as R from 'ramda';;

module.exports = R.lift( R.times( R.identity ) )( R.length );
