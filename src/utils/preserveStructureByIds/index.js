'use strict';

import * as R from 'ramda';;

import preserveStructureBy from '../preserveStructureBy';


module.exports = preserveStructureBy( R.prop('id') );
