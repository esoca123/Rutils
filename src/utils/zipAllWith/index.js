'use strict';

import * as R from 'ramda';;



module.exports = R.curry( (f, xss) => {

    const fFixArity = R.apply( f );

    const go = R.pipe(
        R.transpose,
        R.map( fFixArity )
    );

    return go( xss )
});
