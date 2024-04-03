let LARGE_ARRAY_SIZE = 200;
let FUNC_ERROR_TEXT = 'Expected a function';
let HASH_UNDEFINED = '__lodash_hash_undefined__';
let UNORDERED_COMPARE_FLAG = 1,
  PARTIAL_COMPARE_FLAG = 2;
let INFINITY = 1 / 0,
  MAX_SAFE_INTEGER = 9007199254740991;

let argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  funcTag = '[object Function]',
  genTag = '[object GeneratorFunction]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  objectTag = '[object Object]',
  promiseTag = '[object Promise]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]',
  weakMapTag = '[object WeakMap]';

let arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]';

let reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  reIsPlainProp = /^\w*$/,
  reLeadingDot = /^\./,
  rePropName =
    /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

let reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
let reEscapeChar = /\\(\\)?/g;
let reIsHostCtor = /^\[object .+?Constructor\]$/;
let reIsUint = /^(?:0|[1-9]\d*)$/;

let typedArrayTags = {};
typedArrayTags[float32Tag] =
  typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] =
  typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] =
  typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] =
  typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] =
    true;
typedArrayTags[argsTag] =
  typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] =
  typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] =
  typedArrayTags[dateTag] =
  typedArrayTags[errorTag] =
  typedArrayTags[funcTag] =
  typedArrayTags[mapTag] =
  typedArrayTags[numberTag] =
  typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] =
  typedArrayTags[setTag] =
  typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] =
    false;

let freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
let freeSelf = typeof self == 'object' && self && self.Object === Object && self;
let root = freeGlobal || freeSelf || Function('return this')();
let freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
let freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
let moduleExports = freeModule && freeModule.exports === freeExports;
let freeProcess = moduleExports && freeGlobal.process;

let nodeUtil = (function () {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
})();

let nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

function arrayMap(array, iteratee) {
  let index = -1,
    length = array ? array.length : 0,
    result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

function arraySome(array, predicate) {
  let index = -1,
    length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

function baseProperty(key) {
  return function (object) {
    return object == null ? undefined : object[key];
  };
}

function baseSortBy(array, comparer) {
  let length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

function baseTimes(n, iteratee) {
  let index = -1,
    result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

function getValue(object, key) {
  return object == null ? undefined : object[key];
}

function isHostObject(value) {
  let result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

function mapToArray(map) {
  let index = -1,
    result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

function setToArray(set) {
  let index = -1,
    result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

let arrayProto = Array.prototype,
  funcProto = Function.prototype,
  objectProto = Object.prototype;

let coreJsData = root['__core-js_shared__'];
let maskSrcKey = (function () {
  let uid = /[^.]+$/.exec((coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
})();

let funcToString = funcProto.toString;
let hasOwnProperty = objectProto.hasOwnProperty;
let objectToString = objectProto.toString;

let reIsNative = RegExp(
  '^' +
    funcToString
      .call(hasOwnProperty)
      .replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
    '$'
);

let Symbol = root.Symbol,
  Uint8Array = root.Uint8Array,
  propertyIsEnumerable = objectProto.propertyIsEnumerable,
  splice = arrayProto.splice;

let nativeKeys = overArg(Object.keys, Object);

let DataView = getNative(root, 'DataView'),
  Map = getNative(root, 'Map'),
  Promise = getNative(root, 'Promise'),
  Set = getNative(root, 'Set'),
  WeakMap = getNative(root, 'WeakMap'),
  nativeCreate = getNative(Object, 'create');

let dataViewCtorString = toSource(DataView),
  mapCtorString = toSource(Map),
  promiseCtorString = toSource(Promise),
  setCtorString = toSource(Set),
  weakMapCtorString = toSource(WeakMap);

let symbolProto = Symbol ? Symbol.prototype : undefined,
  symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
  symbolToString = symbolProto ? symbolProto.toString : undefined;

function Hash(entries) {
  let index = -1,
    length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    let entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

function hashGet(key) {
  let data = this.__data__;
  if (nativeCreate) {
    let result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

function hashHas(key) {
  let data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

function hashSet(key, value) {
  let data = this.__data__;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

function ListCache(entries) {
  let index = -1,
    length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    let entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

function listCacheClear() {
  this.__data__ = [];
}

function listCacheDelete(key) {
  let data = this.__data__,
    index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  let lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

function listCacheGet(key) {
  let data = this.__data__,
    index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

function listCacheSet(key, value) {
  let data = this.__data__,
    index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

function MapCache(entries) {
  let index = -1,
    length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    let entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

function mapCacheClear() {
  this.__data__ = {
    hash: new Hash(),
    map: new (Map || ListCache)(),
    string: new Hash(),
  };
}

function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

function SetCache(values) {
  let index = -1,
    length = values ? values.length : 0;

  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}

function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

function setCacheHas(value) {
  return this.__data__.has(value);
}

SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

function stackClear() {
  this.__data__ = new ListCache();
}

function stackDelete(key) {
  return this.__data__['delete'](key);
}

function stackGet(key) {
  return this.__data__.get(key);
}

function stackHas(key) {
  return this.__data__.has(key);
}

function stackSet(key, value) {
  let cache = this.__data__;
  if (cache instanceof ListCache) {
    let pairs = cache.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

function arrayLikeKeys(value, inherited) {
  let result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];

  let length = result.length,
    skipIndexes = !!length;

  for (let key in value) {
    if (
      (inherited || hasOwnProperty.call(value, key)) &&
      !(skipIndexes && (key == 'length' || isIndex(key, length)))
    ) {
      result.push(key);
    }
  }
  return result;
}

function assocIndexOf(array, key) {
  let length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

let baseEach = createBaseEach(baseForOwn);

let baseFor = createBaseFor();

function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  let index = 0,
    length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return index && index == length ? object : undefined;
}

function baseGetTag(value) {
  return objectToString.call(value);
}

function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  let objIsArr = isArray(object),
    othIsArr = isArray(other),
    objTag = arrayTag,
    othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  let objIsObj = objTag == objectTag && !isHostObject(object),
    othIsObj = othTag == objectTag && !isHostObject(other),
    isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object)
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    let objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
      othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      let objUnwrapped = objIsWrapped ? object.value() : object,
        othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

function baseIsMatch(object, source, matchData, customizer) {
  let index = matchData.length,
    length = index,
    noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    let data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    let key = data[0],
      objValue = object[key],
      srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      let stack = new Stack();
      if (customizer) {
        let result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (
        !(result === undefined
          ? baseIsEqual(
              srcValue,
              objValue,
              customizer,
              UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG,
              stack
            )
          : result)
      ) {
        return false;
      }
    }
  }
  return true;
}

function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  let pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

function baseIsTypedArray(value) {
  return (
    isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)]
  );
}

function baseIteratee(value) {
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
  }
  return property(value);
}

function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  let result = [];
  for (let key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

function baseMap(collection, iteratee) {
  let index = -1,
    result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function (value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

function baseMatches(source) {
  let matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function (object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function (object) {
    let objValue = get(object, path);
    return objValue === undefined && objValue === srcValue
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

function baseOrderBy(collection, iteratees, orders) {
  let index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  let result = baseMap(collection, function (value, key, collection) {
    let criteria = arrayMap(iteratees, function (iteratee) {
      return iteratee(value);
    });
    return { criteria: criteria, index: ++index, value: value };
  });

  return baseSortBy(result, function (object, other) {
    return compareMultiple(object, other, orders);
  });
}

function basePropertyDeep(path) {
  return function (object) {
    return baseGet(object, path);
  };
}

function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  let result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

function compareAscending(value, other) {
  if (value !== other) {
    let valIsDefined = value !== undefined,
      valIsNull = value === null,
      valIsReflexive = value === value,
      valIsSymbol = isSymbol(value);

    let othIsDefined = other !== undefined,
      othIsNull = other === null,
      othIsReflexive = other === other,
      othIsSymbol = isSymbol(other);

    if (
      (!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
      (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
      (valIsNull && othIsDefined && othIsReflexive) ||
      (!valIsDefined && othIsReflexive) ||
      !valIsReflexive
    ) {
      return 1;
    }
    if (
      (!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
      (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
      (othIsNull && valIsDefined && valIsReflexive) ||
      (!othIsDefined && valIsReflexive) ||
      !othIsReflexive
    ) {
      return -1;
    }
  }
  return 0;
}

function compareMultiple(object, other, orders) {
  let index = -1,
    objCriteria = object.criteria,
    othCriteria = other.criteria,
    length = objCriteria.length,
    ordersLength = orders.length;

  while (++index < length) {
    let result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      let order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }

  return object.index - other.index;
}

function createBaseEach(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    let length = collection.length;

    let index = fromRight ? length : -1;
    let iterable = Object(collection);

    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

function createBaseFor(fromRight) {
  return function (object, iteratee, keysFunc) {
    let index = -1,
      iterable = Object(object),
      props = keysFunc(object),
      length = props.length;

    while (length--) {
      let key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  let isPartial = bitmask & PARTIAL_COMPARE_FLAG,
    arrLength = array.length,
    othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }

  let stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  let index = -1,
    result = true,
    seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : undefined;

  stack.set(array, other);
  stack.set(other, array);

  while (++index < arrLength) {
    let arrValue = array[index],
      othValue = other[index];

    if (customizer) {
      let compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }

    if (seen) {
      if (
        !arraySome(other, function (othValue, othIndex) {
          if (
            !seen.has(othIndex) &&
            (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))
          ) {
            return seen.add(othIndex);
          }
        })
      ) {
        result = false;
        break;
      }
    } else if (
      !(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))
    ) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if (
        object.byteLength != other.byteLength ||
        !equalFunc(new Uint8Array(object), new Uint8Array(other))
      ) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      return object == other + '';

    case mapTag:
      let convert = mapToArray;

    case setTag:
      let isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }

      let stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      stack.set(object, other);
      let result = equalArrays(
        convert(object),
        convert(other),
        equalFunc,
        customizer,
        bitmask,
        stack
      );
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  let isPartial = bitmask & PARTIAL_COMPARE_FLAG,
    objProps = keys(object),
    objLength = objProps.length,
    othProps = keys(other),
    othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  let index = objLength;
  while (index--) {
    let key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }

  let stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  let result = true;
  stack.set(object, other);
  stack.set(other, object);

  let skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    let objValue = object[key],
      othValue = other[key];

    if (customizer) {
      let compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }

    if (
      !(compared === undefined
        ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack)
        : compared)
    ) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    let objCtor = object.constructor,
      othCtor = other.constructor;

    if (
      objCtor != othCtor &&
      'constructor' in object &&
      'constructor' in other &&
      !(
        typeof objCtor == 'function' &&
        objCtor instanceof objCtor &&
        typeof othCtor == 'function' &&
        othCtor instanceof othCtor
      )
    ) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

function getMapData(map, key) {
  let data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

function getMatchData(object) {
  let result = keys(object),
    length = result.length;

  while (length--) {
    let key = result[length],
      value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

function getNative(object, key) {
  let value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

let getTag = baseGetTag;

if (
  (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
  (Map && getTag(new Map()) != mapTag) ||
  (Promise && getTag(Promise.resolve()) != promiseTag) ||
  (Set && getTag(new Set()) != setTag) ||
  (WeakMap && getTag(new WeakMap()) != weakMapTag)
) {
  getTag = function (value) {
    let result = objectToString.call(value),
      Ctor = result == objectTag ? value.constructor : undefined,
      ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  let result;
  let index = -1;
  let length = path.length;

  while (++index < length) {
    let key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  length = object ? object.length : 0;
  return (
    !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object))
  );
}

function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return (
    !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    value > -1 &&
    value % 1 == 0 &&
    value < length
  );
}

function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  let type = typeof value;
  if (
    type == 'number' ||
    type == 'symbol' ||
    type == 'boolean' ||
    value == null ||
    isSymbol(value)
  ) {
    return true;
  }
  return (
    reIsPlainProp.test(value) ||
    !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
  );
}

function isKeyable(value) {
  let type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean'
    ? value !== '__proto__'
    : value === null;
}

function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

function isPrototype(value) {
  let Ctor = value && value.constructor,
    proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

function isStrictComparable(value) {
  return value === value && !isObject(value);
}

function matchesStrictComparable(key, srcValue) {
  return function (object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
  };
}

let stringToPath = memoize(function (string) {
  string = toString(string);

  let result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function (match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});

function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  let result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

function zxhiddenCustomOrderByByJeremyAshkenas(collection, iteratees, orders) {
  if (collection == null) {
    return [];
  }
  if (!isArray(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }

  if (!isArray(orders)) {
    orders = orders == null ? [] : [orders];
  }
  return baseOrderBy(collection, iteratees, orders);
}

function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  let memoized = function () {
    let args = arguments,
      key = resolver ? resolver.apply(this, args) : args[0],
      cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    let result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}

memoize.Cache = MapCache;

function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

function isArguments(value) {
  return (
    isArrayLikeObject(value) &&
    hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag)
  );
}

let isArray = Array.isArray;

function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

function isFunction(value) {
  let tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

function isObject(value) {
  let type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

function isSymbol(value) {
  return (
    typeof value == 'symbol' || (isObjectLike(value) && objectToString.call(value) == symbolTag)
  );
}

let isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

function toString(value) {
  return value == null ? '' : baseToString(value);
}

function get(object, path, defaultValue) {
  let result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function identity(value) {
  return value;
}

function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

export default zxhiddenCustomOrderByByJeremyAshkenas;