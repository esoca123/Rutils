'use strict';

import * as R from 'ramda';


export default R.curry( (l,r,xs) => {

    const go = R.cond([
        [ R.is( String ),           str => `${l}${str}${r}`     ],
        [ R.is( Array ),            R.compose( R.prepend(l), R.append(r)  )],
        [ R.T,                      x => [l,x,r]             ],
    ])

    return go( xs )
} );
