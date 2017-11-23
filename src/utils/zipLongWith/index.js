'use strict';

import * as R from 'ramda';;



module.exports = R.curry( (fn, xs, ys)  => {
    let l1 = xs;
    let l2 = ys;

    if (xs.length < ys.length) {
        l1 = R.concat(xs, R.repeat(null, ys.length - xs.length))
    }
    else if (ys.length < xs.length) {
        l2 = R.concat(ys, R.repeat(null, xs.length - ys.length))
    }

    return R.zipWith(fn,l1, l2)
});
