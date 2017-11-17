'use strict';

const R = require('ramda');
const _ = require('lodash');


const snakeCase = _.snakeCase;
const camelCase = _.camelCase;


const decorate = (...rest) => {

  let decorators = R.init(rest);
  let fnToDecorate = R.last(rest);

  return R.compose( ...decorators )( fnToDecorate );
}





const mapKeys = R.curry( (f,obj) =>  {

    const rFn = (obj,[k,v]) =>  R.assoc( f(k) ,v,obj);

    let kvPairs = R.toPairs( obj );

    return R.reduce( rFn,  {} ,kvPairs )
})



const camelCaseKeys = mapKeys( _.camelCase )

const snakeCaseKeys = mapKeys( _.snakeCase )







const parseJSON = R.curry( (keysToParse, obj) => {

    let keysInObjToParse = R.intersection( R.keys(obj), keysToParse );

    let newObj = R.reduce( (newObj, key) => {

        return R.assoc(key, JSON.parse(obj[key]), newObj)

    }, {}, keysInObjToParse )


    return R.merge(obj, newObj)
})








const isNotNil = R.complement( R.isNil );







const rename = R.curry( ( oldName, newName, obj ) => {

    if(R.isNil(obj)){
        return null
    }


    const go = R.pipe(
        R.prop( oldName ),
        R.assoc( newName, R.__, obj ),
        R.omit([oldName])
    );

    return go( obj );
})


const renameAll = R.curry( (namesArr, obj) => {

    const rFn = (obj, [oldName, newName]) => rename( oldName, newName, obj );

    return R.reduce( rFn, obj, namesArr);
})




const splitWithArr = function splitWithArr(splitNumbers, xs){

    if( R.isEmpty( splitNumbers ) ){
        return [];
    }

    let [ n, ...splitNumbersNext ] = splitNumbers;

    let [ xsSplitL, xsSplitR ] = R.splitAt( n, xs );

    return [ xsSplitL, ...splitWithArr(splitNumbersNext,  xsSplitR ) ]
}


const omitBy = R.curry( (p,obj) =>  {

    const rFn = (obj,[k,v]) => p(v,k) ? obj : R.assoc(k,v,obj);

    let kvPairs = R.toPairs( obj );

    return R.reduce( rFn,  {} ,kvPairs )
})






const isUpperCase = R.chain( R.equals, R.toUpper );
const isLowerCase = R.chain( R.equals, R.toLower );

const isEmptyString = R.both( R.is(String), R.isEmpty );


const lookupFrom = R.flip( R.prop );



const preserveOrderBy = R.curry( (fn, xs, objs) => {

    let objsIndexed = R.indexBy( fn, objs );

    return R.map(  x => objsIndexed[ x ] || null  ,  xs )
} );


const preserveOrderByIds = preserveOrderBy( R.prop('id') );




const preserveGroupOrderBy = R.curry( ( fn , ids, objs) => {

    const objsGroupedByFn = R.groupBy( fn, objs );

    return R.map( id =>  objsGroupedByFn[ id ] || [] ,  ids )
});







const preserveStructureBy = R.curry( (projFnsOrIndexFn, xs, objs) => {


    let projFns = R.is( Function, projFnsOrIndexFn ) ?
        [projFnsOrIndexFn, R.identity ]
      : projFnsOrIndexFn;


    let [ indexFn, nextFn ] = projFns;


    let objsIndexed = R.indexBy( indexFn, objs );


    const go = function go( xs ){

        if( R.isNil(xs) ){
            return null
        };

        if( R.is( Array, xs ) ){
            return R.map( go, xs )
        }


        if( R.is( Object, xs ) ){

            let key = indexFn( xs );
            return nextFn(objsIndexed[ key ]);
        }

        return nextFn( objsIndexed[ xs ] )
    };

    return go( xs );
} );


const preserveStructureByIds = preserveStructureBy( R.prop('id') );





const flattenAndClean = R.unless(
    R.isNil,
    R.pipe(
        R.flatten,
        R.reject( R.isNil )
    )
);






const concatAll = R.reduce( R.concat, [] );


const indexesFromList = R.lift( R.times( R.identity ) )( R.length );









const _sortingMappingChaining = R.curry( R.pipe(
    R.zipWith( R.flip( R.pair) ),
    R.fromPairs
))

const _mkSortingMapping = R.chain( _sortingMappingChaining, indexesFromList  );



const sortUsing = R.curry( (fn, orderList) => {

    const sortingMapping = _mkSortingMapping( orderList );
    const lookupFromSortingMapping = lookupFrom( sortingMapping );

    const sortingFn = R.pipe(
        fn,
        lookupFromSortingMapping
    )

    return R.sortBy( sortingFn );
})



const inside = R.flip( R.contains );


const propInside = R.curry( (k, list, obj) => {

    let prop = R.prop(k, obj);
    return inside(list, prop);
} );




const toCapitalCase = R.pipe(
    R.toLower,
    R.lift( R.concat )(R.compose( R.toUpper, R.head), R.tail)
);

const toCapitalCaseEachWord = R.pipe(
    R.split(' '),
    R.map( toCapitalCase ),
    R.join(' ')
);


const isNotArray = R.complement( R.is( Array ) );


const isPlainObj = _.isPlainObject;
const isNotPlainObj = R.complement( isPlainObj );



const deepMergeWith = R.curry( (f, objX, objY) => {

  const _deepMerge = function _deepMerge( objX, objY){

      if( isPlainObj( objX ) && isPlainObj( objY ) ){

         return R.mergeWith( _deepMerge, objX, objY )
      }

      return f( objX, objY )
  };

  return R.mergeWith( _deepMerge, objX, objY  )
} );


const deepMerge = deepMergeWith( R.nthArg(1) )






const _mkDefaultObjTo = R.curry( (merge, defaultObj, obj) => {

    let _defaultObj = R.defaultTo( {}, defaultObj  );
    let _obj = R.defaultTo( _defaultObj, obj  );



    return merge( R.defaultTo, _defaultObj, _obj );
} )


const defaultDeepObjTo = _mkDefaultObjTo( deepMergeWith )

const defaultObjTo = _mkDefaultObjTo( R.mergeWith )






const pack = R.curry( (name, fields, obj) => {

    return R.lift( R.assoc(name) )(R.pick(fields), R.omit(fields))(obj);
} );



const unpack = R.curry( (name, fields, obj) => {

    let nameObj = obj[ name ];

    let newNameObj = R.omit( fields, nameObj );
    let newObj = R.assoc(name, newNameObj, obj );

    let topNewNameObj = R.pick( fields, nameObj );

    return R.merge( newObj, topNewNameObj)
} );







const packMany = R.curry( (list, obj) => {

    const reducerFn = ( [allFieldsToPack, o], [name, fields]) => {

        let nextAllFieldsTopack = R.concat( allFieldsToPack, fields );
        let nextObj = R.merge( o, pack( name, fields, obj ) );

        return [ nextAllFieldsTopack, nextObj ];
    }

    let [ allFieldsToPack, objPacked ] = R.reduce( reducerFn, [[], {}],  list );

    return R.omit(allFieldsToPack, objPacked );
} );





const toPairsProtoChain = obj => {

    let kvPairs = [];

    _.forIn( obj, (v,k,context) => kvPairs.push([k, v]) )

    return kvPairs;
}




const maxAll = R.reduce( R.max, -Infinity );



const maxCodBy = R.curry( (fn,x,y) => {

  let xRes = fn( x )
  let yRes = fn( y ) ;

  return xRes > yRes ? xRes : yRes;
});


const maxByAll = R.curry( ( fn, xs ) => {

    return R.reduce( R.maxBy(fn) , -Infinity, xs )
})



const maxCodByAll = R.curry( ( fn, xs ) => {

    return R.reduce( maxCodBy(fn) , -Infinity, xs )
})



const zipAllWith = R.curry( (f, xss) => {

    const fFixArity = R.apply( f );

    const go = R.pipe(
        R.transpose,
        R.map( fFixArity )
    );

    return go( xss )
});





const _fillNullsLongest = xss => {

    let maxXsLength = maxCodByAll( R.when( R.is( Array ), R.length) , xss );

    const fillNull = xs => {

        let xsLength = R.length( xs );

        let nullListSize = maxXsLength - xsLength;

        let nullList = R.repeat( null,  nullListSize);

        return R.concat( xs, nullList )
    };

    return R.map(  R.when( xs => R.length(xs) < maxXsLength, fillNull ),  xss )
}



const zipLongAllWith = R.curry( (f, xss) => {

    const fFixArity = R.apply( f );

    const go = R.pipe(
        _fillNullsLongest,
        R.transpose,
        R.map( fFixArity )
    );

    return go( xss )
});



const zipLongWith = R.curry( (fn, xs, ys)  => {
    let l1 = xs;
    let l2 = ys;

    if (xs.length < ys.length) {
        l1 = R.concat(xs, R.repeat(null, ys.length - xs.length))
    }
    else if (ys.length < xs.length) {
        l2 = R.concat(ys, R.repeat(null, xs.length - ys.length))
    }

    return R.zipWith(fn,l1, l2)
});


const zipLong = zipLongWith( R.pair );




const fst = R.nth( 0 );
const snd = R.nth( 1 );
const thd = R.nth( 2 );

const lensFst = R.lensIndex( 0 );
const lensSnd = R.lensIndex( 1 );
const lensThd = R.lensIndex( 2 );

const fstArg = R.nthArg( 0 );
const sndArg = R.nthArg( 1 );
const thdArg = R.nthArg( 2 );


const between = R.curry( (l,r,xs) => {

    const go = R.cond([
        [ R.is( String ),           str => `${l}${str}${r}`     ],
        [ R.is( Array ),            R.compose( R.prepend(l), R.append(r)  )],
        [ R.T,                      x => [l,x,r]             ],
    ])

    return go( xs )
} )



const mapIndexed = R.addIndex( R.map );


const xor = R.curry( (x,y) =>  (x || y) &&  !( x && y )  )
const xnor = R.complement( xor )

const notEq = R.complement( R.equals );

const mergeAllWith = R.curry( (fn, xs) =>  R.reduce( R.mergeWith( fn ), {}, xs ) );





const deepMapKeys = R.curry( function deepMapKeys( mapping,value ){

    //plain obj case. the recursive traversal continues with heach value. The keys are mapping
    if( isPlainObj( value ) ){

        let values = R.values( value );
        let valuesModified = R.map( x => deepMapKeys(mapping, x),  values  );

        let keys = R.keys( value  );
        let transformedKeys = R.map( mapping , keys);

        return R.zipObj(transformedKeys,   valuesModified )
    }


    //array case. the recursive traversal continue in each array element.
    if( R.is( Array, value ) ){

        return R.map( x => deepMapKeys(mapping ,x), value )
    }

    //bottom of the recursive traversal
    return value
})





const deepCamelCaseKeys = deepMapKeys( _.camelCase )

const deepSnakeCaseKeys = deepMapKeys( _.snakeCase )

const whenT = R.when( R.equals( true ) );
const whenF = R.when( R.equals( false ) );
const whenNil = R.when( R.isNil )
const whenNotNil = R.when( isNotNil )

// alias
const I     = R.identity;
const compl = R.complement;
const K     = R.always;
const eq    = R.equals;


module.exports = {
    decorate,

    snakeCase,
    camelCase,
    snakeCaseKeys,
    camelCaseKeys,
    mapKeys,
    parseJSON,
    toCapitalCase,
    toCapitalCaseEachWord,

    isNotNil,
    rename,
    renameAll,
    splitWithArr,
    omitBy,
    isUpperCase,
    isLowerCase,
    isEmptyString,
    lookupFrom,

    preserveOrderBy,
    preserveOrderByIds,
    preserveGroupOrderBy,
    preserveStructureBy,
    preserveStructureByIds,
    // preserveListStructureGroupedBy,
    // preserveListStructureGroupedByIds,
    // flattenAndCleanIds,
    flattenAndClean,

    zipAllWith,
    zipLongWith,
    zipLong,
    zipLongAllWith,

    maxAll,
    maxCodBy,
    maxByAll,
    maxCodByAll,


    concatAll,
    indexesFromList,
    sortUsing,
    inside,
    propInside,

    isNotArray,
    isPlainObj,
    deepMergeWith,
    deepMerge,
    defaultDeepObjTo,
    defaultObjTo,

    pack,
    unpack,
    packMany,

    toPairsProtoChain,

    fst,
    snd,
    thd,
    fstArg,
    sndArg,
    thdArg,

    between,

    I,
    compl,
    K,

    mapIndexed,

    xor,
    xnor,
    notEq,
    eq,

    mergeAllWith,

    lensFst,
    lensSnd,
    lensThd,

    deepMapKeys,
    deepCamelCaseKeys,
    deepSnakeCaseKeys,

    whenT,
    whenF
}
