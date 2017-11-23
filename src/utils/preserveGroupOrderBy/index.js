'use strict';

import * as R from 'ramda';;


module.exports = R.curry( ( fn , ids, objs) => {

    const objsGroupedByFn = R.groupBy( fn, objs );

    return R.map( id =>  objsGroupedByFn[ id ] || [] ,  ids )
});
