'use strict';

import * as R from 'ramda';;

import preserveOrderBy from '../preserveOrderBy'


module.exports = preserveOrderBy( R.prop('id') );
