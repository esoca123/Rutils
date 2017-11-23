'use strict';

import * as R from 'ramda';;



module.exports = R.curry( (projFnsOrIndexFn, xs, objs) => {


    let projFns = R.is( Function, projFnsOrIndexFn ) ?
        [projFnsOrIndexFn, R.identity ]
      : projFnsOrIndexFn;


    let [ indexFn, nextFn ] = projFns;


    let objsIndexed = R.indexBy( indexFn, objs );


    const go = function go( xs ){

        if( R.isNil(xs) ){
            return null
        };

        if( R.is( Array, xs ) ){
            return R.map( go, xs )
        }


        if( R.is( Object, xs ) ){

            let key = indexFn( xs );
            return nextFn(objsIndexed[ key ]);
        }

        return nextFn( objsIndexed[ xs ] )
    };

    return go( xs );
} );
