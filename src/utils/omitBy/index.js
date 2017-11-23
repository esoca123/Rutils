'use strict';

import * as R from 'ramda';;

module.exports = R.curry( (p,obj) =>  {

    const rFn = (obj,[k,v]) => p(v,k) ? obj : R.assoc(k,v,obj);

    let kvPairs = R.toPairs( obj );

    return R.reduce( rFn,  {} ,kvPairs )
});
