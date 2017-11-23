'use strict';

import * as R from 'ramda';;

import deepMapKeys from '../deepMapKeys';
import snakeCase from '../snakeCase';

module.exports = deepMapKeys( snakeCase );
