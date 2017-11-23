'use strict';

import * as R from 'ramda';;


import isPlainObj from '../isPlainObj';


module.exports = R.curry( function deepMapKeys( mapping,value ){

    //plain obj case. the recursive traversal continues with heach value. The keys are mapping
    if( isPlainObj( value ) ){

        let values = R.values( value );
        let valuesModified = R.map( x => deepMapKeys(mapping, x),  values  );

        let keys = R.keys( value  );
        let transformedKeys = R.map( mapping , keys);

        return R.zipObj(transformedKeys,   valuesModified )
    }


    //array case. the recursive traversal continue in each array element.
    if( R.is( Array, value ) ){

        return R.map( x => deepMapKeys(mapping ,x), value )
    }

    //bottom of the recursive traversal
    return value
})
