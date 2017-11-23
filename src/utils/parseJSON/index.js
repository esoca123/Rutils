'use strict';

import * as R from 'ramda';;



module.exports = R.curry( (keysToParse, obj) => {

    let keysInObjToParse = R.intersection( R.keys(obj), keysToParse );

    let newObj = R.reduce( (newObj, key) => {

        return R.assoc(key, JSON.parse(obj[key]), newObj)

    }, {}, keysInObjToParse )


    return R.merge(obj, newObj)
});
