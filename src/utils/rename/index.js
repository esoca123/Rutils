'use strict';

import * as R from 'ramda';;



module.exports = R.curry( ( oldName, newName, obj ) => {

    if(R.isNil(obj)){
        return null
    }


    const go = R.pipe(
        R.prop( oldName ),
        R.assoc( newName, R.__, obj ),
        R.omit([oldName])
    );

    return go( obj );
});
