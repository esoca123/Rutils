'use strict';

import * as R from 'ramda';;

import deepMergeWith from '../deepMergeWith';


module.exports = deepMergeWith( R.nthArg(1) );
