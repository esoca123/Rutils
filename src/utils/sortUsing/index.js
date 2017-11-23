'use strict';

import * as R from 'ramda';;

import indexesFromList from '../indexesFromList';



const sortingMappingChaining = R.curry( R.pipe(
    R.zipWith( R.flip( R.pair) ),
    R.fromPairs
))


const mkSortingMapping = R.chain( sortingMappingChaining, indexesFromList  );



module.exports = R.curry( (fn, orderList) => {

    const sortingMapping = mkSortingMapping( orderList );
    const lookupFromSortingMapping = lookupFrom( sortingMapping );

    const sortingFn = R.pipe(
        fn,
        lookupFromSortingMapping
    )

    return R.sortBy( sortingFn );
});
