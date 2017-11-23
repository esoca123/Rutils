'use strict';

import * as R from 'ramda';;



module.exports = R.curry( (list, obj) => {

    const reducerFn = ( [allFieldsToPack, o], [name, fields]) => {

        let nextAllFieldsTopack = R.concat( allFieldsToPack, fields );
        let nextObj = R.merge( o, pack( name, fields, obj ) );

        return [ nextAllFieldsTopack, nextObj ];
    }

    let [ allFieldsToPack, objPacked ] = R.reduce( reducerFn, [[], {}],  list );

    return R.omit(allFieldsToPack, objPacked );
} );
