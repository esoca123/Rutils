'use strict';

import * as R from 'ramda';;


import snakeCase from '../snakeCase';
import mapKeys from '../mapKeys';


module.exports = mapKeys( snakeCase );
