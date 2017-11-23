'use strict';

import * as R from 'ramda';;


import maxCodByAll from '../maxCodByAll';


const _fillNullsLongest = xss => {

    let maxXsLength = maxCodByAll( R.when( R.is( Array ), R.length) , xss );

    const fillNull = xs => {

        let xsLength = R.length( xs );

        let nullListSize = maxXsLength - xsLength;

        let nullList = R.repeat( null,  nullListSize);

        return R.concat( xs, nullList )
    };

    return R.map(  R.when( xs => R.length(xs) < maxXsLength, fillNull ),  xss )
}



module.exports = R.curry( (f, xss) => {

    const fFixArity = R.apply( f );

    const go = R.pipe(
        _fillNullsLongest,
        R.transpose,
        R.map( fFixArity )
    );

    return go( xss )
});
