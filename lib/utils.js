'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var R = require('ramda');
var _ = require('lodash');

var snakeCase = _.snakeCase;
var camelCase = _.camelCase;

var decorate = function decorate() {
    for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
        rest[_key] = arguments[_key];
    }

    var decorators = R.init(rest);
    var fnToDecorate = R.last(rest);

    return R.compose.apply(R, _toConsumableArray(decorators))(fnToDecorate);
};

var mapKeys = R.curry(function (f, obj) {

    var rFn = function rFn(obj, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            k = _ref2[0],
            v = _ref2[1];

        return R.assoc(f(k), v, obj);
    };

    var kvPairs = R.toPairs(obj);

    return R.reduce(rFn, {}, kvPairs);
});

var camelCaseKeys = mapKeys(_.camelCase);

var snakeCaseKeys = mapKeys(_.snakeCase);

var parseJSON = R.curry(function (keysToParse, obj) {

    var keysInObjToParse = R.intersection(R.keys(obj), keysToParse);

    var newObj = R.reduce(function (newObj, key) {

        return R.assoc(key, JSON.parse(obj[key]), newObj);
    }, {}, keysInObjToParse);

    return R.merge(obj, newObj);
});

var isNotNil = R.complement(R.isNil);

var rename = R.curry(function (oldName, newName, obj) {

    if (R.isNil(obj)) {
        return null;
    }

    var go = R.pipe(R.prop(oldName), R.assoc(newName, R.__, obj), R.omit([oldName]));

    return go(obj);
});

var renameAll = R.curry(function (namesArr, obj) {

    var rFn = function rFn(obj, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            oldName = _ref4[0],
            newName = _ref4[1];

        return rename(oldName, newName, obj);
    };

    return R.reduce(rFn, obj, namesArr);
});

var splitWithArr = function splitWithArr(splitNumbers, xs) {

    if (R.isEmpty(splitNumbers)) {
        return [];
    }

    var _splitNumbers = _toArray(splitNumbers),
        n = _splitNumbers[0],
        splitNumbersNext = _splitNumbers.slice(1);

    var _R$splitAt = R.splitAt(n, xs),
        _R$splitAt2 = _slicedToArray(_R$splitAt, 2),
        xsSplitL = _R$splitAt2[0],
        xsSplitR = _R$splitAt2[1];

    return [xsSplitL].concat(_toConsumableArray(splitWithArr(splitNumbersNext, xsSplitR)));
};

var omitBy = R.curry(function (p, obj) {

    var rFn = function rFn(obj, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            k = _ref6[0],
            v = _ref6[1];

        return p(v, k) ? obj : R.assoc(k, v, obj);
    };

    var kvPairs = R.toPairs(obj);

    return R.reduce(rFn, {}, kvPairs);
});

var isUpperCase = R.chain(R.equals, R.toUpper);
var isLowerCase = R.chain(R.equals, R.toLower);

var isEmptyString = R.both(R.is(String), R.isEmpty);

var lookupFrom = R.flip(R.prop);

var preserveOrderBy = R.curry(function (fn, xs, objs) {

    var objsIndexed = R.indexBy(fn, objs);

    return R.map(function (x) {
        return objsIndexed[x] || null;
    }, xs);
});

var preserveOrderByIds = preserveOrderBy(R.prop('id'));

var preserveGroupOrderBy = R.curry(function (fn, ids, objs) {

    var objsGroupedByFn = R.groupBy(fn, objs);

    return R.map(function (id) {
        return objsGroupedByFn[id] || [];
    }, ids);
});

var preserveStructureBy = R.curry(function (projFnsOrIndexFn, xs, objs) {

    var projFns = R.is(Function, projFnsOrIndexFn) ? [projFnsOrIndexFn, R.identity] : projFnsOrIndexFn;

    var _projFns = _slicedToArray(projFns, 2),
        indexFn = _projFns[0],
        nextFn = _projFns[1];

    var objsIndexed = R.indexBy(indexFn, objs);

    var go = function go(xs) {

        if (R.isNil(xs)) {
            return null;
        };

        if (R.is(Array, xs)) {
            return R.map(go, xs);
        }

        if (R.is(Object, xs)) {

            var key = indexFn(xs);
            return nextFn(objsIndexed[key]);
        }

        return nextFn(objsIndexed[xs]);
    };

    return go(xs);
});

var preserveStructureByIds = preserveStructureBy(R.prop('id'));

var flattenAndClean = R.unless(R.isNil, R.pipe(R.flatten, R.reject(R.isNil)));

var concatAll = R.reduce(R.concat, []);

var indexesFromList = R.lift(R.times(R.identity))(R.length);

var _sortingMappingChaining = R.curry(R.pipe(R.zipWith(R.flip(R.pair)), R.fromPairs));

var _mkSortingMapping = R.chain(_sortingMappingChaining, indexesFromList);

var sortUsing = R.curry(function (fn, orderList) {

    var sortingMapping = _mkSortingMapping(orderList);
    var lookupFromSortingMapping = lookupFrom(sortingMapping);

    var sortingFn = R.pipe(fn, lookupFromSortingMapping);

    return R.sortBy(sortingFn);
});

var inside = R.flip(R.contains);

var propInside = R.curry(function (k, list, obj) {

    var prop = R.prop(k, obj);
    return inside(list, prop);
});

var toCapitalCase = R.pipe(R.toLower, R.lift(R.concat)(R.compose(R.toUpper, R.head), R.tail));

var toCapitalCaseEachWord = R.pipe(R.split(' '), R.map(toCapitalCase), R.join(' '));

var isNotArray = R.complement(R.is(Array));

var isPlainObj = _.isPlainObject;
var isNotPlainObj = R.complement(isPlainObj);

var deepMergeWith = R.curry(function (f, objX, objY) {

    var _deepMerge = function _deepMerge(objX, objY) {

        if (isPlainObj(objX) && isPlainObj(objY)) {

            return R.mergeWith(_deepMerge, objX, objY);
        }

        return f(objX, objY);
    };

    return R.mergeWith(_deepMerge, objX, objY);
});

var deepMerge = deepMergeWith(R.nthArg(1));

var _mkDefaultObjTo = R.curry(function (merge, defaultObj, obj) {

    var _defaultObj = R.defaultTo({}, defaultObj);
    var _obj = R.defaultTo(_defaultObj, obj);

    return merge(R.defaultTo, _defaultObj, _obj);
});

var defaultDeepObjTo = _mkDefaultObjTo(deepMergeWith);

var defaultObjTo = _mkDefaultObjTo(R.mergeWith);

var pack = R.curry(function (name, fields, obj) {

    return R.lift(R.assoc(name))(R.pick(fields), R.omit(fields))(obj);
});

var unpack = R.curry(function (name, fields, obj) {

    var nameObj = obj[name];

    var newNameObj = R.omit(fields, nameObj);
    var newObj = R.assoc(name, newNameObj, obj);

    var topNewNameObj = R.pick(fields, nameObj);

    return R.merge(newObj, topNewNameObj);
});

var packMany = R.curry(function (list, obj) {

    var reducerFn = function reducerFn(_ref7, _ref8) {
        var _ref10 = _slicedToArray(_ref7, 2),
            allFieldsToPack = _ref10[0],
            o = _ref10[1];

        var _ref9 = _slicedToArray(_ref8, 2),
            name = _ref9[0],
            fields = _ref9[1];

        var nextAllFieldsTopack = R.concat(allFieldsToPack, fields);
        var nextObj = R.merge(o, pack(name, fields, obj));

        return [nextAllFieldsTopack, nextObj];
    };

    var _R$reduce = R.reduce(reducerFn, [[], {}], list),
        _R$reduce2 = _slicedToArray(_R$reduce, 2),
        allFieldsToPack = _R$reduce2[0],
        objPacked = _R$reduce2[1];

    return R.omit(allFieldsToPack, objPacked);
});

var toPairsProtoChain = function toPairsProtoChain(obj) {

    var kvPairs = [];

    _.forIn(obj, function (v, k, context) {
        return kvPairs.push([k, v]);
    });

    return kvPairs;
};

var maxAll = R.reduce(R.max, -Infinity);

var maxCodBy = R.curry(function (fn, x, y) {

    var xRes = fn(x);
    var yRes = fn(y);

    return xRes > yRes ? xRes : yRes;
});

var maxByAll = R.curry(function (fn, xs) {

    return R.reduce(R.maxBy(fn), -Infinity, xs);
});

var maxCodByAll = R.curry(function (fn, xs) {

    return R.reduce(maxCodBy(fn), -Infinity, xs);
});

var zipAllWith = R.curry(function (f, xss) {

    var fFixArity = R.apply(f);

    var go = R.pipe(R.transpose, R.map(fFixArity));

    return go(xss);
});

var _fillNullsLongest = function _fillNullsLongest(xss) {

    var maxXsLength = maxCodByAll(R.when(R.is(Array), R.length), xss);

    var fillNull = function fillNull(xs) {

        var xsLength = R.length(xs);

        var nullListSize = maxXsLength - xsLength;

        var nullList = R.repeat(null, nullListSize);

        return R.concat(xs, nullList);
    };

    return R.map(R.when(function (xs) {
        return R.length(xs) < maxXsLength;
    }, fillNull), xss);
};

var zipLongAllWith = R.curry(function (f, xss) {

    var fFixArity = R.apply(f);

    var go = R.pipe(_fillNullsLongest, R.transpose, R.map(fFixArity));

    return go(xss);
});

var zipLongWith = R.curry(function (fn, xs, ys) {
    var l1 = xs;
    var l2 = ys;

    if (xs.length < ys.length) {
        l1 = R.concat(xs, R.repeat(null, ys.length - xs.length));
    } else if (ys.length < xs.length) {
        l2 = R.concat(ys, R.repeat(null, xs.length - ys.length));
    }

    return R.zipWith(fn, l1, l2);
});

var zipLong = zipLongWith(R.pair);

var fst = R.nth(0);
var snd = R.nth(1);
var thd = R.nth(2);

var lensFst = R.lensIndex(0);
var lensSnd = R.lensIndex(1);
var lensThd = R.lensIndex(2);

var fstArg = R.nthArg(0);
var sndArg = R.nthArg(1);
var thdArg = R.nthArg(2);

var between = R.curry(function (l, r, xs) {

    var go = R.cond([[R.is(String), function (str) {
        return '' + l + str + r;
    }], [R.is(Array), R.compose(R.prepend(l), R.append(r))], [R.T, function (x) {
        return [l, x, r];
    }]]);

    return go(xs);
});

var mapIndexed = R.addIndex(R.map);

var xor = R.curry(function (x, y) {
    return (x || y) && !(x && y);
});
var xnor = R.complement(xor);

var notEq = R.complement(R.equals);

var mergeAllWith = R.curry(function (fn, xs) {
    return R.reduce(R.mergeWith(fn), {}, xs);
});

var deepMapKeys = R.curry(function deepMapKeys(mapping, value) {

    //plain obj case. the recursive traversal continues with heach value. The keys are mapping
    if (isPlainObj(value)) {

        var values = R.values(value);
        var valuesModified = R.map(function (x) {
            return deepMapKeys(mapping, x);
        }, values);

        var keys = R.keys(value);
        var transformedKeys = R.map(mapping, keys);

        return R.zipObj(transformedKeys, valuesModified);
    }

    //array case. the recursive traversal continue in each array element.
    if (R.is(Array, value)) {

        return R.map(function (x) {
            return deepMapKeys(mapping, x);
        }, value);
    }

    //bottom of the recursive traversal
    return value;
});

var deepCamelCaseKeys = deepMapKeys(_.camelCase);

var deepSnakeCaseKeys = deepMapKeys(_.snakeCase);

var whenT = R.when(R.equals(true));
var whenF = R.when(R.equals(false));
var whenNil = R.when(R.isNil);
var whenNotNil = R.when(isNotNil);

// alias
var I = R.identity;
var compl = R.complement;
var K = R.always;
var eq = R.equals;

module.exports = {
    decorate: decorate,

    snakeCase: snakeCase,
    camelCase: camelCase,
    snakeCaseKeys: snakeCaseKeys,
    camelCaseKeys: camelCaseKeys,
    mapKeys: mapKeys,
    parseJSON: parseJSON,
    toCapitalCase: toCapitalCase,
    toCapitalCaseEachWord: toCapitalCaseEachWord,

    isNotNil: isNotNil,
    rename: rename,
    renameAll: renameAll,
    splitWithArr: splitWithArr,
    omitBy: omitBy,
    isUpperCase: isUpperCase,
    isLowerCase: isLowerCase,
    isEmptyString: isEmptyString,
    lookupFrom: lookupFrom,

    preserveOrderBy: preserveOrderBy,
    preserveOrderByIds: preserveOrderByIds,
    preserveGroupOrderBy: preserveGroupOrderBy,
    preserveStructureBy: preserveStructureBy,
    preserveStructureByIds: preserveStructureByIds,
    // preserveListStructureGroupedBy,
    // preserveListStructureGroupedByIds,
    // flattenAndCleanIds,
    flattenAndClean: flattenAndClean,

    zipAllWith: zipAllWith,
    zipLongWith: zipLongWith,
    zipLong: zipLong,
    zipLongAllWith: zipLongAllWith,

    maxAll: maxAll,
    maxCodBy: maxCodBy,
    maxByAll: maxByAll,
    maxCodByAll: maxCodByAll,

    concatAll: concatAll,
    indexesFromList: indexesFromList,
    sortUsing: sortUsing,
    inside: inside,
    propInside: propInside,

    isNotArray: isNotArray,
    isPlainObj: isPlainObj,
    deepMergeWith: deepMergeWith,
    deepMerge: deepMerge,
    defaultDeepObjTo: defaultDeepObjTo,
    defaultObjTo: defaultObjTo,

    pack: pack,
    unpack: unpack,
    packMany: packMany,

    toPairsProtoChain: toPairsProtoChain,

    fst: fst,
    snd: snd,
    thd: thd,
    fstArg: fstArg,
    sndArg: sndArg,
    thdArg: thdArg,

    between: between,

    I: I,
    compl: compl,
    K: K,

    mapIndexed: mapIndexed,

    xor: xor,
    xnor: xnor,
    notEq: notEq,
    eq: eq,

    mergeAllWith: mergeAllWith,

    lensFst: lensFst,
    lensSnd: lensSnd,
    lensThd: lensThd,

    deepMapKeys: deepMapKeys,
    deepCamelCaseKeys: deepCamelCaseKeys,
    deepSnakeCaseKeys: deepSnakeCaseKeys,

    whenT: whenT,
    whenF: whenF
};