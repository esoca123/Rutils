'use strict';

const R = require('ramda');
const _ = require('lodash');




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


    const process = R.pipe(
        R.prop( oldName ),
        R.tap( console.log ),
        R.assoc( newName, R.__, obj ),
        R.omit([oldName])
    );

    return process( obj );
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





const preserveOrderBy = R.curry( ( fn , ids, objs) => {

    const objsIndexedByFn = R.indexBy( fn, objs );


    return R.map( R.prop(R.__, objsIndexedByFn ) ,  ids )
})


const preserveOrderByIds = preserveOrderBy( R.prop('id') );




const preserveGroupOrderBy = R.curry( ( fn , ids, objs) => {

    const objsGroupedByFn = R.groupBy( fn, objs );

    return R.map( id =>  objsGroupedByFn[ id ] || [] ,  ids )
});




const lookupFrom = R.flip( R.prop );



const preserveListStructureBy = R.curry( (fn, ks, objs) => {

    let objsIndexedByFn = R.indexBy( fn, objs );

    const go = function go( term ){

        if( R.isNil( term ) ){
            return null
        }

        if( R.is( Array, term ) ){
            return R.map( go, term )
        }

        return objsIndexedByFn[ term ]
    }

    return go( ks );
} )

const preserveListStructureByIds = preserveListStructureBy( R.prop('id') )



const preserveListStructureGroupedBy = R.curry( (fn, ks, objs) => {

    let objsGroupedByFn = R.groupBy( fn, objs );

    const go = function go( term ){

        if( R.isNil( term ) ){
            return null
        }

        if( R.is( Array, term ) ){
            return R.map( go, term )
        }

        return objsGroupedByFn[ term ]
    }

    return go( ks );
} )

const preserveListStructureGroupedByIds = preserveListStructureGroupedBy( R.prop('id') )




const flattenAndCleanIds = R.pipe(
    R.flatten,
    R.uniq,
    R.reject( R.isNil )
)



const zipAllWith = R.curry( (f, xss) => {

    const fFixArity = R.apply( f );

    const go = R.pipe(
        R.transpose,
        R.map( fFixArity )
    );

    return go( xss )
});


const concatAll = R.reduce( R.concat, [] );


const indexesFromList = R.lift( R.times( R.identity ) )( R.length );



const defaultObjTo = R.mergeWith( R.defaultTo );





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



const defaultDeepObjTo = deepMergeWith( R.defaultTo );





// alias

const id = R.identity;

const compl = R.complement;



module.exports = {
    decorate,
    mapKeys,
    camelCaseKeys,
    snakeCaseKeys,
    parseJSON,
    isNotNil,
    rename,
    renameAll,
    splitWithArr,
    omitBy,
    isUpperCase,
    isLowerCase,
    isEmptyString,
    preserveOrderBy,
    preserveOrderByIds,
    preserveGroupOrderBy,
    lookupFrom,
    preserveListStructureBy,
    preserveListStructureByIds,
    preserveListStructureGroupedBy,
    preserveListStructureGroupedByIds,
    flattenAndCleanIds,
    zipAllWith,
    concatAll,
    indexesFromList,
    defaultObjTo,
    sortUsing,
    inside,
    propInside,
    toCapitalCase,
    toCapitalCaseEachWord,
    isNotArray,
    isPlainObj,
    deepMergeWith,
    deepMerge,
    defaultDeepObjTo,
    id,
    compl,
}
