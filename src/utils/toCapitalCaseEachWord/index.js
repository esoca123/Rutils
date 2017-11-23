'use strict';

import * as R from 'ramda';;


import toCapitalCase from '../toCapitalCase';


module.exports = R.pipe(
    R.split(' '),
    R.map( toCapitalCase ),
    R.join(' ')
);
