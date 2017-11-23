'use strict';

import * as R from 'ramda';;
import _ from 'lodash';





module.exports = obj => {

    let kvPairs = [];

    _.forIn( obj, (v,k,context) => kvPairs.push([k, v]) )

    return kvPairs;
}
