'use strict';

const u = require('./src/index.js');

const R = require( 'ramda');


// const merge = (Robj, uObj) => {
//
//     let RPairs = R.toPairs( Robj );
//     let uPairs = R.toPairs( uObj );
//
//     let RuPairs = R.concat( RPairs, uPairs );
//
//     let RuObj = R.fromPairs( RuPairs );
//
//     return RuObj;
// }


const Ru = merge( R, u );

console.log( R.keys( Ru ) )

module.exports = Ru;
