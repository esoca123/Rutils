'use strict';

import * as R from 'ramda';;



module.exports = R.curry( (f,obj) =>  {

    const rFn = (obj,[k,v]) =>  R.assoc( f(k) ,v,obj);

    let kvPairs = R.toPairs( obj );

    return R.reduce( rFn,  {} ,kvPairs )
})
