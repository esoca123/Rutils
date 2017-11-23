'use strict';

import * as R from 'ramda';;

import inside from '../inside';



module.exports = R.curry( (k, list, obj) => {

    let prop = R.prop(k, obj);
    return inside(list, prop);
} );
