'use strict';

import * as R from 'ramda';;


module.exports = R.curry( (name, fields, obj) => {

    return R.lift( R.assoc(name) )(R.pick(fields), R.omit(fields))(obj);
} );
