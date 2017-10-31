'use strict';

let Ru = require('../lib/index');
// let Ru = require('../src/index');


let res = Ru.addIndex( Ru.map )( Ru.add(1), [1,2,3] );
// let res = Ru.mapIndexed( Ru.add(1), [1,2,3] );

console.log('res', res)
