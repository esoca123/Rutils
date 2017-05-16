'use strict';

const R = require('ramda');
const _ = require('lodash');

const F = require('fluture');

const futurizeLib = require('futurize');
const futurize  = futurizeLib.futurize( F );
const futurizeV = futurizeLib.futurizeV( F );
const futurizeP = futurizeLib.futurizeP( F );

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


const isPlainObj = R.both(
   isNotArray,
   R.is( Object )
)




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
    let _obj = R.defaultTo( {}, obj  );



    return merge( R.defaultTo, _defaultObj, _obj );
} )


const defaultDeepObjTo = _mkDefaultObjTo( deepMergeWith )

const defaultObjTo = _mkDefaultObjTo( R.mergeWith )






const pack = R.curry( (name, fields, obj) => {

    return R.lift( R.assoc(name) )(R.pick(fields), R.omit(fields))(obj);
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







const _setFuturizeAllDefaultOptionsSpec = defaultObjTo({
    suffix          : 'F',
    futurizeFn      : futurize
});

const futurizeAll = (obj, optionsSpec) => {

    let {
        suffix,
        futurizeFn
    } = _setFuturizeAllDefaultOptionsSpec( optionsSpec )


    const mkNewKVpair = ([k, fn]) => [`${k}${suffix}`, futurizeFn( fn.bind(obj) )]

    const futurizeKey = R.chain( R.pair, mkNewKVpair );

    const valueIsFn = R.pipe(
        R.nth(1),
        R.is( Function )
    )

    const futurizeKeyIfFn = R.ifElse(
        valueIsFn,
        futurizeKey,
        R.of
    )

    const go = R.pipe(
        toPairsProtoChain,
        R.chain( futurizeKeyIfFn ),
        R.fromPairs
    );


    return go( obj );
};



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






// alias
const I     = R.identity;
const compl = R.complement;
const K     = R.always;


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
    packMany,

    futurizeAll,
    toPairsProtoChain,

    I,
    compl,
    K
}
