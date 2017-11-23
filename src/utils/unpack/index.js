'use strict';

import * as R from 'ramda';;



module.exports = R.curry( (name, fields, obj) => {

    let nameObj = obj[ name ];

    let newNameObj = R.omit( fields, nameObj );
    let newObj = R.assoc(name, newNameObj, obj );

    let topNewNameObj = R.pick( fields, nameObj );

    return R.merge( newObj, topNewNameObj)
} );
