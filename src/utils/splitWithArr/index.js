'use strict';

import * as R from 'ramda';;


module.exports = function splitWithArr(splitNumbers, xs){

    if( R.isEmpty( splitNumbers ) ){
        return [];
    }

    let [ n, ...splitNumbersNext ] = splitNumbers;

    let [ xsSplitL, xsSplitR ] = R.splitAt( n, xs );

    return [ xsSplitL, ...splitWithArr(splitNumbersNext,  xsSplitR ) ]
};
