'use strict';

import * as R from 'ramda';;

import rename from '../rename';


module.exports = R.curry( (namesArr, obj) => {

    const rFn = (obj, [oldName, newName]) => rename( oldName, newName, obj );

    return R.reduce( rFn, obj, namesArr);
})
