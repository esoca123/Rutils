'use strict';

import * as R from 'ramda';;

import isPlainObj from '../isPlainObj';


module.exports = R.curry( (f, objX, objY) => {

  const _deepMerge = function _deepMerge( objX, objY){

      if( isPlainObj( objX ) && isPlainObj( objY ) ){

         return R.mergeWith( _deepMerge, objX, objY )
      }

      return f( objX, objY )
  };

  return R.mergeWith( _deepMerge, objX, objY  )
} );
