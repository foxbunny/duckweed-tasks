webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var elements = __webpack_require__(35);
var css = __webpack_require__(54);
var duckweed = __webpack_require__(4);
var aside = __webpack_require__(36);
var fx = __webpack_require__(37);
// View
var view = function () {
    return (duckweed.html("div", { class: elements.wrapper, style: fx.dropInTwistOut() },
        duckweed.html("main", { class: elements.main },
            duckweed.html("h1", { class: css.title }, "About this app"),
            duckweed.html("div", { class: css.body },
                duckweed.html("p", null, "This is a demo app for the [Duckweed](https://github.com/foxbunny/duckweed) microframework."),
                duckweed.html("p", null,
                    "You can see the source code ",
                    duckweed.html("a", { href: "https://github.com/foxbunny/selm" }, "on GitHub"),
                    ". It is available under the terms of the MIT license."),
                duckweed.html("p", null, "\u00A9 2017 Hajime Yamasaki Vukelic."))),
        duckweed.html(aside.view, null)));
};
exports.view = view;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var elements = __webpack_require__(35);
var css = __webpack_require__(57);
var duckweed = __webpack_require__(4);
var aside = __webpack_require__(36);
var adjust = __webpack_require__(58);
var apply = __webpack_require__(59);
var concat = __webpack_require__(60);
var descend = __webpack_require__(83);
var filter = __webpack_require__(42);
var lensProp = __webpack_require__(45);
var map = __webpack_require__(47);
var over = __webpack_require__(49);
var pipe = __webpack_require__(50);
var prepend = __webpack_require__(90);
var prop = __webpack_require__(34);
var propEq = __webpack_require__(91);
var sort = __webpack_require__(92);
var sum = __webpack_require__(93);
var tap = __webpack_require__(95);
var fx = __webpack_require__(37);
var task = __webpack_require__(96);
// Storage management
var STORAGE_KEY = "tasks";
var retrieve = function () {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};
var store = pipe(JSON.stringify, localStorage.setItem.bind(localStorage, STORAGE_KEY));
var init = function () {
    try {
        var tasks = retrieve();
        return {
            tasks: tasks,
        };
    }
    catch (e) {
        // tslint:disable:no-console
        console.error("Cannot parse stored data");
        return {
            tasks: [],
        };
    }
};
exports.init = init;
// Action
var Action;
(function (Action) {
    Action["Update"] = "Update";
    Action["Add"] = "Add";
    Action["ClearDone"] = "ClearDone";
})(Action || (Action = {}));
exports.Action = Action;
var sortByDate = sort(descend(prop("created")));
var filterDone = function (done) { return filter(pipe(propEq("done", done))); };
var notEmpty = function (t) { return t.text.trim() !== "" || t.editing; };
var splitTask = function (done) { return pipe(filterDone(done), sortByDate); };
var splitTasks = function (tasks) {
    return [splitTask(false)(tasks), splitTask(true)(tasks)];
};
var sortTasks = pipe(splitTasks, apply(concat));
var actions = (_a = {},
    _a[Action.Update] = function (patch, id, taskAction, arg) {
        // The scoped patcher will perform a patch on a particular item in the
        // array. This is how we delegate to the task action.
        var taskPatch = function (fn) {
            // FIXME: Come up with a nice utility function for creating scoped patchers
            return patch(over(lensProp("tasks"), pipe(adjust(fn, id), sortTasks, filter(notEmpty), tap(store))));
        };
        // FIXME: Temporary workaround until we figure out why we can't just do
        // await task.actions[taskAction](taskPatch, arg)
        task.actions[taskAction](taskPatch, arg);
    },
    _a[Action.Add] = function (patch) {
        patch(over(lensProp("tasks"), prepend(task.init({ editing: true }))));
    },
    _a[Action.ClearDone] = function (patch) {
        patch(pipe(over(lensProp("tasks"), pipe(filterDone(false), tap(store)))));
    },
    _a);
exports.actions = actions;
var view = function (_a) {
    var model = _a.model, act = _a.act;
    var listHeight = Math.max(46, sum(map(prop("itemHeight"), model.tasks)) + model.tasks.length * 10);
    var listItemOffsets = model.tasks.reduce(function (offsets, _a) {
        var itemHeight = _a.itemHeight;
        offsets.offsets.push(offsets.lastValue);
        offsets.lastValue += itemHeight + 10;
        return offsets;
    }, { lastValue: 0, offsets: [] }).offsets;
    return (duckweed.html("div", { class: elements.wrapper, style: fx.dropInTwistOut() },
        duckweed.html("main", { class: elements.main },
            duckweed.html("h1", { class: css.title }, "Task list"),
            duckweed.html("p", { class: css.buttonBar },
                duckweed.html("button", { class: css.actionButton, "on-click": act(Action.Add) }, "+ Add task"),
                duckweed.html("button", { class: css.actionButton, "on-click": act(Action.ClearDone) }, "Clear done")),
            duckweed.html("div", { class: css.tasks, style: {
                    delayed: {
                        paddingBottom: listHeight + "px",
                    },
                    paddingBottom: "40px",
                    transition: "padding-bottom 1s",
                } }, model.tasks.map(function (item, index) {
                return duckweed.html(task.view, { model: item, act: act.as(Action.Update, index), classes: [css.task], styles: {
                        delayed: {
                            opacity: 1,
                            transform: "translateY(" + listItemOffsets[index] + "px)",
                        },
                        opacity: 0,
                        remove: {
                            opacity: 0,
                            transform: "translateX(-100vw)",
                        },
                        transform: "translateY(0)",
                        transition: "transform 1s, opacity ease-out 0.5s",
                    } });
            }))),
        duckweed.html(aside.view, null)));
};
exports.view = view;
var _a;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(100);
__export(__webpack_require__(101));


/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(26);
var _isPlaceholder = __webpack_require__(28);


/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2
             : _curry1(function(_b) { return fn(a, _b); });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2
             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b); })
             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b); })
             : fn(a, b);
    }
  };
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var _isPlaceholder = __webpack_require__(28);


/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(26);
var _curry2 = __webpack_require__(25);
var _isPlaceholder = __webpack_require__(28);


/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3
             : _curry2(function(_b, _c) { return fn(a, _b, _c); });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3
             : _isPlaceholder(a) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
             : _isPlaceholder(b) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
             : _curry1(function(_c) { return fn(a, b, _c); });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3
             : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) { return fn(_a, _b, c); })
             : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
             : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b, c); })
             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b, c); })
             : _isPlaceholder(c) ? _curry1(function(_c) { return fn(a, b, _c); })
             : fn(a, b, c);
    }
  };
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = function _isPlaceholder(a) {
  return a != null &&
         typeof a === 'object' &&
         a['@@functional/placeholder'] === true;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
module.exports = Array.isArray || function _isArray(val) {
  return (val != null &&
          val.length >= 0 &&
          Object.prototype.toString.call(val) === '[object Array]');
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(26);
var _has = __webpack_require__(32);
var _isArguments = __webpack_require__(70);


/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @see R.keysIn, R.values
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */
module.exports = (function() {
  // cover IE < 9 keys issues
  var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
                            'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  // Safari bug
  var hasArgsEnumBug = (function() {
    'use strict';
    return arguments.propertyIsEnumerable('length');
  }());

  var contains = function contains(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };

  return typeof Object.keys === 'function' && !hasArgsEnumBug ?
    _curry1(function keys(obj) {
      return Object(obj) !== obj ? [] : Object.keys(obj);
    }) :
    _curry1(function keys(obj) {
      if (Object(obj) !== obj) {
        return [];
      }
      var prop, nIdx;
      var ks = [];
      var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
      for (prop in obj) {
        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
          ks[ks.length] = prop;
        }
      }
      if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;
        while (nIdx >= 0) {
          prop = nonEnumerableProps[nIdx];
          if (_has(prop, obj) && !contains(ks, prop)) {
            ks[ks.length] = prop;
          }
          nIdx -= 1;
        }
      }
      return ks;
    });
}());


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0: return function() { return fn.apply(this, arguments); };
    case 1: return function(a0) { return fn.apply(this, arguments); };
    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var _isArrayLike = __webpack_require__(79);
var _xwrap = __webpack_require__(80);
var bind = __webpack_require__(81);


module.exports = (function() {
  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      idx += 1;
    }
    return xf['@@transducer/result'](acc);
  }

  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      step = iter.next();
    }
    return xf['@@transducer/result'](acc);
  }

  function _methodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
  }

  var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
  return function _reduce(fn, acc, list) {
    if (typeof fn === 'function') {
      fn = _xwrap(fn);
    }
    if (_isArrayLike(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list['fantasy-land/reduce'] === 'function') {
      return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
      return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
      return _methodReduce(fn, acc, list, 'reduce');
    }

    throw new TypeError('reduce: list must be array or iterable');
  };
}());


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);


/**
 * Returns a function that when supplied an object returns the indicated
 * property of that object, if it exists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig s -> {s: a} -> a | Undefined
 * @param {String} p The property name
 * @param {Object} obj The object to query
 * @return {*} The value at `obj.p`.
 * @see R.path
 * @example
 *
 *      R.prop('x', {x: 100}); //=> 100
 *      R.prop('x', {}); //=> undefined
 */
module.exports = _curry2(function prop(p, obj) { return obj[p]; });


/***/ }),
/* 35 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"wrapper":"wrapper-1mVco","main":"main-3Cs3s"};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var css = __webpack_require__(55);
var badge = __webpack_require__(56);
var duckweed = __webpack_require__(4);
var view = function () {
    return (duckweed.html("aside", { class: css.aside },
        duckweed.html("p", null,
            duckweed.html("a", { href: "https://github.com/foxbunny/duckweed" },
                duckweed.html("img", { src: badge }))),
        duckweed.html("p", null,
            "See the source code ",
            duckweed.html("a", { href: "https://github.com/foxbunny/selm" }, "on GitHub"))));
};
exports.view = view;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
"This line is intentionally left blank";
/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Style for cross-fade transition
 *
 * Use on the root container in your view.
 */
var crossFade = function () { return ({
    delayed: {
        opacity: 1,
    },
    opacity: 0,
    remove: {
        opacity: 0,
    },
    transition: "opacity ease-in 0.3s",
}); };
exports.crossFade = crossFade;
/**
 * Styles for fly-in transition
 *
 * Use on the root container in your views.
 */
var flyIn = function (direction) { return ({
    delayed: {
        opacity: 1,
        transform: "translateX(0)",
    },
    opacity: 0,
    remove: {
        opacity: 0,
        transform: "translateX(" + (direction === "left" ? -100 : 100) + "vw)",
    },
    transform: "translateX(" + (direction === "left" ? -100 : 100) + "vw)",
    transition: "transform ease-out 0.5s, opacity ease-in 0.3s",
}); };
exports.flyIn = flyIn;
var zoom = function () { return ({
    delayed: {
        opacity: 1,
        transform: "scale(1)",
    },
    opacity: 0,
    remove: {
        opacity: 0,
        transform: "scale(0)",
    },
    transform: "scale(0)",
    transition: "transform 0.5s, opacity ease-in 0.3s",
}); };
exports.zoom = zoom;
var dropInTwistOut = function () { return ({
    delayed: {
        opacity: 1,
        transform: "scale(1) translateY(0)",
    },
    opacity: 0,
    remove: {
        opacity: 0,
        transform: "rotateY(-90deg)",
        transition: "transform 0.5s, opacity ease-out 0.5s",
    },
    transform: "scale(0) translateY(-100vh)",
    transition: "transform 0.5s, opacity ease-in 0.3s",
}); };
exports.dropInTwistOut = dropInTwistOut;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * Private `concat` function to merge two array-like objects.
 *
 * @private
 * @param {Array|Arguments} [set1=[]] An array-like object.
 * @param {Array|Arguments} [set2=[]] An array-like object.
 * @return {Array} A new, merged array.
 * @example
 *
 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 */
module.exports = function _concat(set1, set2) {
  set1 = set1 || [];
  set2 = set2 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set2.length;
  var result = [];

  idx = 0;
  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }
  idx = 0;
  while (idx < len2) {
    result[result.length] = set2[idx];
    idx += 1;
  }
  return result;
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);
var _equals = __webpack_require__(66);


/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      var a = {}; a.v = a;
 *      var b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */
module.exports = _curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);
var _dispatchable = __webpack_require__(43);
var _filter = __webpack_require__(77);
var _isObject = __webpack_require__(78);
var _reduce = __webpack_require__(33);
var _xfilter = __webpack_require__(82);
var keys = __webpack_require__(30);


/**
 * Takes a predicate and a `Filterable`, and returns a new filterable of the
 * same type containing the members of the given filterable which satisfy the
 * given predicate. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * Dispatches to the `filter` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array} Filterable
 * @see R.reject, R.transduce, R.addIndex
 * @example
 *
 *      var isEven = n => n % 2 === 0;
 *
 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */
module.exports = _curry2(_dispatchable(['filter'], _xfilter, function(pred, filterable) {
  return (
    _isObject(filterable) ?
      _reduce(function(acc, key) {
        if (pred(filterable[key])) {
          acc[key] = filterable[key];
        }
        return acc;
      }, {}, keys(filterable)) :
    // else
      _filter(pred, filterable)
  );
}));


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var _isArray = __webpack_require__(29);
var _isTransformer = __webpack_require__(76);


/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer [xf] to return a new transformer (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} xf transducer to initialize if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */
module.exports = function _dispatchable(methodNames, xf, fn) {
  return function() {
    if (arguments.length === 0) {
      return fn();
    }
    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.pop();
    if (!_isArray(obj)) {
      var idx = 0;
      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, args);
        }
        idx += 1;
      }
      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = {
  init: function() {
    return this.xf['@@transducer/init']();
  },
  result: function(result) {
    return this.xf['@@transducer/result'](result);
  }
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(26);
var assoc = __webpack_require__(46);
var lens = __webpack_require__(84);
var prop = __webpack_require__(34);


/**
 * Returns a lens whose focus is the specified property.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig String -> Lens s a
 * @param {String} k
 * @return {Lens}
 * @see R.view, R.set, R.over
 * @example
 *
 *      var xLens = R.lensProp('x');
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */
module.exports = _curry1(function lensProp(k) {
  return lens(prop(k), assoc(k));
});


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var _curry3 = __webpack_require__(27);


/**
 * Makes a shallow clone of an object, setting or overriding the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @sig String -> a -> {k: v} -> {k: v}
 * @param {String} prop The property name to set
 * @param {*} val The new value
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original except for the changed property.
 * @see R.dissoc
 * @example
 *
 *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
 */
module.exports = _curry3(function assoc(prop, val, obj) {
  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  result[prop] = val;
  return result;
});


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);
var _dispatchable = __webpack_require__(43);
var _map = __webpack_require__(41);
var _reduce = __webpack_require__(33);
var _xmap = __webpack_require__(85);
var curryN = __webpack_require__(48);
var keys = __webpack_require__(30);


/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex
 * @example
 *
 *      var double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 * @symb R.map(f, [a, b]) = [f(a), f(b)]
 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
 * @symb R.map(f, functor_o) = functor_o.map(f)
 */
module.exports = _curry2(_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function() {
        return fn.call(this, functor.apply(this, arguments));
      });
    case '[object Object]':
      return _reduce(function(acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));
    default:
      return _map(fn, functor);
  }
}));


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__(31);
var _curry1 = __webpack_require__(26);
var _curry2 = __webpack_require__(25);
var _curryN = __webpack_require__(86);


/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      var sumArgs = (...args) => R.sum(args);
 *
 *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var _curry3 = __webpack_require__(27);


/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the result of applying the given function to
 * the focused value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> (a -> a) -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.prop, R.lensIndex, R.lensProp
 * @example
 *
 *      var headLens = R.lensIndex(0);
 *
 *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
 */
module.exports = (function() {
  // `Identity` is a functor that holds a single value, where `map` simply
  // transforms the held value with the provided function.
  var Identity = function(x) {
    return {value: x, map: function(f) { return Identity(f(x)); }};
  };

  return _curry3(function over(lens, f, x) {
    // The value returned by the getter function is first transformed with `f`,
    // then set as the value of an `Identity`. This is then mapped over with the
    // setter function of the lens.
    return lens(function(y) { return Identity(f(y)); })(x).value;
  });
}());


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__(31);
var _pipe = __webpack_require__(87);
var reduce = __webpack_require__(51);
var tail = __webpack_require__(88);


/**
 * Performs left-to-right function composition. The leftmost function may have
 * any arity; the remaining functions must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      var f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
 */
module.exports = function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }
  return _arity(arguments[0].length,
                reduce(_pipe, arguments[0], tail(arguments)));
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var _curry3 = __webpack_require__(27);
var _reduce = __webpack_require__(33);


/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to shortcut the iteration.
 *
 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
 * is *(value, acc)*.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present. When
 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
 * shortcuting, as this is not implemented by `reduce`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex, R.reduceRight
 * @example
 *
 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
 *                -               -10
 *               / \              / \
 *              -   4           -6   4
 *             / \              / \
 *            -   3   ==>     -3   3
 *           / \              / \
 *          -   2           -1   2
 *         / \              / \
 *        0   1            0   1
 *
 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
 */
module.exports = _curry3(_reduce);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var _isArray = __webpack_require__(29);


/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */
module.exports = function _checkForMethod(methodname, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
      fn.apply(this, arguments) :
      obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var curry = __webpack_require__(102);
var qs = __webpack_require__(5);
var go = function (path, query) {
    if (query === void 0) { query = {}; }
    // tslint:disable:no-console
    var q = qs.stringify(query);
    var next = "" + path + (q ? "?" + q : "");
    window.history.pushState(undefined, "", next);
    window.dispatchEvent(new Event("popstate"));
};
exports.go = go;
var match = curry(function (prefix, re) {
    var m = re.exec(location.pathname.slice(prefix.length));
    return m
        ? m.slice(1)
        : false;
});
exports.match = match;


/***/ }),
/* 54 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"title":"title-3wfn8","body":"body-29zdx"};

/***/ }),
/* 55 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"aside":"aside-3sF2l"};

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIGlkPSJzdmc4IgogICB2ZXJzaW9uPSIxLjEiCiAgIHZpZXdCb3g9IjAgMCA4NC41MDgyOTIgMTAuNDQ0MTYiCiAgIGhlaWdodD0iMTAuNDQ0MTZtbSIKICAgd2lkdGg9Ijg0LjUwODI5M21tIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MjIiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojOGNjMzNhO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDUxOCIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzNmN2MwNDtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQ1MjAiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4yMzUyMjAwNSwwLjMyMTI5NTg4LC0wLjQzNDczNDQ2LDAuMzE4MjY3NDIsMTE4LjY4MTA5LDcwLjgzNzc4NykiCiAgICAgICByPSI1MS4xNjc5MTIiCiAgICAgICBmeT0iODQuODQwNDg1IgogICAgICAgZng9Ii0xNTguMzU2OTIiCiAgICAgICBjeT0iODQuODQwNDg1IgogICAgICAgY3g9Ii0xNTguMzU2OTIiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NDkzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDUyMiIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjIyNjY2NzIsMC41Mzc4MDM1MSwtMC40MzY1MzYwMywwLjE4MDczODk1LDk3LjUzOTIzMiwxMTUuNjQ1OSkiCiAgICAgICByPSIzMC41NDYwMzQiCiAgICAgICBmeT0iMTguOTg1OTUyIgogICAgICAgZng9Ii0xNTYuMjA3MjEiCiAgICAgICBjeT0iMTguOTg1OTUyIgogICAgICAgY3g9Ii0xNTYuMjA3MjEiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTAzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDUyMiIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNTQ2NjkwNDQsMCwwLDAuNDUwNDU2NzcsMTAxLjU3NDg3LDExLjg3NTE1KSIKICAgICAgIHI9IjMzLjcxMDI0NyIKICAgICAgIGZ5PSI3Mi43ODI1OTMiCiAgICAgICBmeD0iLTc4LjM3ODUzMiIKICAgICAgIGN5PSI3Mi43ODI1OTMiCiAgICAgICBjeD0iLTc4LjM3ODUzMiIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MTUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0NTIyIiAvPgogIDwvZGVmcz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE1Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZwogICAgIHN0eWxlPSJzdHJva2Utd2lkdGg6My4zMTUxMTI1OSIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMzAxNjQ4ODgsMCwwLDAuMzAxNjQ4ODgsLTExLjMxODk1MSwtNy40OTY1NzU2KSI+CiAgICA8cmVjdAogICAgICAgcnk9IjQuMjQxODMzMiIKICAgICAgIHJ4PSI0LjI0MTgzMzIiCiAgICAgICB5PSIyOS42NjEzOTIiCiAgICAgICB4PSI0OS43NTExOTgiCiAgICAgICBoZWlnaHQ9IjI0LjIzOTA0OCIKICAgICAgIHdpZHRoPSIyNjcuOTI2OTEiCiAgICAgICBpZD0icmVjdDQ1MDMiCiAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6IzMzMzMzMztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC44NzcxMjM1MztzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjEiIC8+CiAgICA8ZwogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDo0LjE1NDE5ODE3IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC43OTgwMTUwMiwwLDAsMC43OTgwMTUwMiwyMC4yMjA4MDIsNi43MTY2NTY4KSIKICAgICAgIGlkPSJnNDUwNiI+CiAgICAgIDxwYXRoCiAgICAgICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDp1cmwoI3JhZGlhbEdyYWRpZW50NDQ5Myk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMDk5MTMxNTg7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICBkPSJNIDI0Ljg2MTU3OCw1OS42NzY0MzYgQyAzMS44MjQxOTgsNzAuNDgwNSA0OS4xODkyMTksNjYuOTI4NTkzIDUyLjQ3MTk2OCw1NC42MzQ1MzcgNTYuNDE2NzU3LDM5Ljg2MTEwOCA0OS41MzUzNjYsMzcuMjg2NTY0IDM5LjAyNjkxMSwzOC41NDg0ODQgMzAuNzk5NDI4LDM5LjUzNjQ5MSAxNC44OTc4Myw0NC43OTA4MzMgMjQuODYxNTc4LDU5LjY3NjQzNiBaIgogICAgICAgICBpZD0icGF0aDQ0ODUiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDp1cmwoI3JhZGlhbEdyYWRpZW50NDUwMyk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMDk5MTMxNTg7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICBkPSJtIDQ1LjY0NzM3NSwyNS40OTE3MzggYyAtNC4zNjEzNjIsNy40NTc3NjYgMC4wNDg1NiwxMS42ODI0NDkgMy45MjQ4MjYsMTMuNjc3NTk1IDQuMzIyNjQ4LDIuMjI0OTA0IDcuMTczOTIyLDQuOTQ4NjM1IDEwLjAwNzY3MSwtMS43ODc2OTUgMS4wOTI3MjQsLTIuMDQ2NTA3IDQuMzc3NjgxLC0xMS40MTkyODMgLTMuMTk2NTYxLC0xMy42NjgwNiAtNy41NzQyNDcsLTIuMjQ4NzggLTkuMjM1MTQzLC0wLjIyNzQ3NiAtMTAuNzM1OTM2LDEuNzc4MTYgeiIKICAgICAgICAgaWQ9InBhdGg0NDk1IiAvPgogICAgICA8cGF0aAogICAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6dXJsKCNyYWRpYWxHcmFkaWVudDQ1MTUpO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjA5OTEzMTU4O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgZD0ibSA1NC4zODI1MjMsNDMuMjMyMDc5IGMgNC4wMDQxMzEsLTIuOTcwMDExIDYuMDIzNjkyLC00LjMyOTA1NCAxMS4wMjAyMjIsLTMuNDgyNDI5IDQuOTk2NTI5LDAuODQ2NjI1IDEyLjQ4NTg3Niw4LjE3NzQ1NCA2LjE2OTY5NywxMy43MjgzNTEgLTYuMzE2MTc5LDUuNTUwODk0IC0xMi4xMDQ1MzksMS40NzE2NDMgLTE0LjE5NDIzNSwtMS43MjgzOTUgLTEuODU1NDEyLC0yLjg0MTI2NyAtNS4wOTA4MDUsLTYuMjIzNTYgLTIuOTk1Njg0LC04LjUxNzUyNyB6IgogICAgICAgICBpZD0icGF0aDQ1MDUiIC8+CiAgICA8L2c+CiAgICA8ZwogICAgICAgaWQ9InRleHQ0NTAxIgogICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjE3LjczMTgzMDZweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OkFyaWFsOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246QXJpYWw7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LWZlYXR1cmUtc2V0dGluZ3M6bm9ybWFsO3RleHQtYWxpZ246ZW5kO3dyaXRpbmctbW9kZTpsci10Yjt0ZXh0LWFuY2hvcjplbmQ7b3BhY2l0eToxO2ZpbGw6I2U2ZTZlNjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC44NzcxMjM0ODtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBhcmlhLWxhYmVsPSJEVUNLV0VFRCBGUkFNRVdPUksiPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MDkiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDg0Ljc2NDAxNCwzNS43MzkwNjcgYyAtMC4yMTI3ODIsMCAtMC4yODM3MDksMC4wNzA5MyAtMC4yODM3MDksMC4yODM3MDkgdiAxMS44NDQ4NjMgYyAwLDAuMjEyNzgyIDAuMDg4NjYsMC4yODM3MDkgMC4yODM3MDksMC4yODM3MDkgaCA0LjM0NDI5OSBjIDMuNDkzMTcsMCA2LjE3MDY3NywtMi42Nzc1MDYgNi4xNzA2NzcsLTYuMjA2MTQxIDAsLTMuNTI4NjM0IC0yLjY3NzUwNywtNi4yMDYxNCAtNi4xNzA2NzcsLTYuMjA2MTQgeiBtIDQuMzI2NTY3LDEuMjA1NzY0IGMgMi44OTAyODgsMCA0Ljc2OTg2MiwyLjMyMjg3IDQuNzY5ODYyLDUuMDAwMzc2IDAsMi42NTk3NzUgLTEuODc5NTc0LDUuMDAwMzc3IC00Ljc2OTg2Miw1LjAwMDM3NyBIIDg1Ljg4MTExOSBWIDM2Ljk0NDgzMSBaIiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MTEiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDEwMi41MTAyNSw0OC4zODE4NjIgYyAyLjg5MDI5LDAgNS4wMTgxMSwtMS44MDg2NDcgNS4wMTgxMSwtNS4zMzcyODEgdiAtNy4wMjE4MDUgYyAwLC0wLjIxMjc4MiAtMC4wNTMyLC0wLjI4MzcwOSAtMC4yNjU5OCwtMC4yODM3MDkgaCAtMC44NTExMyBjIC0wLjIxMjc4LDAgLTAuMjgzNywwLjA3MDkzIC0wLjI4MzcsMC4yODM3MDkgdiA2LjkzMzE0NiBjIDAsMi45NDM0ODQgLTEuNDg5NDgsNC4xODQ3MTIgLTMuNjE3Myw0LjE4NDcxMiAtMi4xMjc4MiwwIC0zLjYxNzI5MiwtMS4yNDEyMjggLTMuNjE3MjkyLC00LjE4NDcxMiB2IC02LjkzMzE0NiBjIDAsLTAuMjEyNzgyIC0wLjA3MDkzLC0wLjI4MzcwOSAtMC4yODM3MDksLTAuMjgzNzA5IGggLTAuODMzMzk2IGMgLTAuMjEyNzgyLDAgLTAuMjgzNzA5LDAuMDUzMiAtMC4yODM3MDksMC4yODM3MDkgdiA3LjAyMTgwNSBjIDAsMy41Mjg2MzQgMi4xMjc4MTksNS4zMzcyODEgNS4wMTgxMDYsNS4zMzcyODEgeiIgLz4KICAgICAgPHBhdGgKICAgICAgICAgaWQ9InBhdGg0NTEzIgogICAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LWZhbWlseTonQWNoZXJ1cyBHcm90ZXNxdWUnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0FjaGVydXMgR3JvdGVzcXVlJzt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtYW5jaG9yOnN0YXJ0O2ZpbGw6I2U2ZTZlNjtzdHJva2Utd2lkdGg6MC44NzcxMjM0OCIKICAgICAgICAgZD0ibSAxMTYuMTA2OTYsNDcuMTQwNjM0IGMgLTIuNzY2MTYsMCAtNC45Mjk0NCwtMi41MTc5MiAtNC45Mjk0NCwtNS4xOTU0MjcgMCwtMi42Nzc1MDYgMi4xNjMyOCwtNS4xOTU0MjYgNC45Mjk0NCwtNS4xOTU0MjYgMS42NDkwNiwwIDIuOTI1NzYsMC43MjcwMDUgMy43MDU5NiwxLjU2MDQwMSAwLjE0MTg1LDAuMTQxODU1IDAuMjY1OTcsMC4xNDE4NTUgMC40MDc4MywtMC4wMTc3MyBsIDAuNTE0MjIsLTAuNTY3NDE4IGMgMC4xNDE4NiwtMC4xNTk1ODcgMC4xNTk1OSwtMC4yNDgyNDYgMC4wMTc3LC0wLjM5MDEwMSAtMS4xMzQ4MywtMS4xMzQ4MzcgLTIuOTI1NzUsLTEuODI2Mzc4IC00LjY0NTc0LC0xLjgyNjM3OCAtMy40OTMxNywwIC02LjM0Nzk5LDIuOTA4MDIgLTYuMzQ3OTksNi40MzY2NTQgMCwzLjUyODYzNSAyLjg1NDgyLDYuNDM2NjU1IDYuMzQ3OTksNi40MzY2NTUgMS43MTk5OSwwIDMuNTEwOTEsLTAuNjkxNTQxIDQuNjQ1NzQsLTEuODI2Mzc5IDAuMTU5NTksLTAuMTU5NTg2IDAuMTU5NTksLTAuMjQ4MjQ1IDAuMDE3NywtMC40MjU1NjQgbCAtMC41MzE5NiwtMC41Njc0MTggYyAtMC4xMjQxMiwtMC4xMjQxMjMgLTAuMjMwNTEsLTAuMTU5NTg3IC0wLjM5MDEsLTAuMDE3NzMgLTAuODMzNCwwLjg2ODg2IC0yLjA5MjM2LDEuNTk1ODY1IC0zLjc0MTQyLDEuNTk1ODY1IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUxNSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMTI2LjA1MDA5LDQxLjY2MTQ5OCA2LjI0MTYsLTUuNjM4NzIyIGMgMC4xNTk1OSwtMC4xOTUwNSAwLjA3MDksLTAuMjgzNzA5IC0wLjEwNjM5LC0wLjI4MzcwOSBoIC0xLjEzNDg0IGMgLTAuMjEyNzgsMCAtMC4yODM3MSwwLjA3MDkzIC0wLjQ5NjQ5LDAuMjgzNzA5IGwgLTUuNjkxOTEsNS4xNTk5NjMgdiAtNS4xNTk5NjMgYyAwLC0wLjIzMDUxNCAtMC4wNzA5LC0wLjI4MzcwOSAtMC4yODM3MSwtMC4yODM3MDkgaCAtMC44NTExMyBjIC0wLjIxMjc4LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yMTI3ODIgMC4wNzA5LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgaCAwLjg1MTEzIGMgMC4yMTI3OCwwIDAuMjgzNzEsLTAuMDUzMTkgMC4yODM3MSwtMC4yODM3MDkgdiAtNS42NzQxODYgbCA2LjAxMTA5LDUuNjc0MTg2IGMgMC4xOTUwNSwwLjIxMjc4MiAwLjI4MzcxLDAuMjgzNzA5IDAuNDYxMDIsMC4yODM3MDkgaCAxLjIwNTc3IGMgMC4xNTk1OCwwIDAuMjgzNzEsLTAuMDcwOTMgMC4wODg3LC0wLjI4MzcwOSB6IiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MTciCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDEzNS4wNjM5NSwzNi4wMjI3NzYgYyAtMC4wNzA5LC0wLjIxMjc4MiAtMC4xNTk1OCwtMC4yODM3MDkgLTAuMzU0NjMsLTAuMjgzNzA5IGggLTEuMDgxNjQgYyAtMC4xNzczMiwwIC0wLjIxMjc5LDAuMDcwOTMgLTAuMTI0MTMsMC4yODM3MDkgbCA0LjU5MjU1LDEyLjE4MTc2OCBjIDAuMDcwOSwwLjE3NzMxOCAwLjEyNDEyLDAuMjQ4MjQ1IDAuMTk1MDUsMC4yNDgyNDUgaCAwLjEyNDEyIGMgMC4wNzA5LDAgMC4xMjQxMiwtMC4wODg2NiAwLjE5NTA1LC0wLjI0ODI0NSBsIDMuMTIwOCwtMTAuMDUzOTQ4IDMuMTIwOCwxMC4wNTM5NDggYyAwLjA3MDksMC4xNTk1ODYgMC4xMjQxMywwLjI0ODI0NSAwLjE5NTA1LDAuMjQ4MjQ1IGggMC4xMjQxMyBjIDAuMDg4NywwIDAuMTI0MTIsLTAuMDg4NjYgMC4xOTUwNSwtMC4yNDgyNDUgbCA0LjU5MjU0LC0xMi4xODE3NjggYyAwLjA4ODcsLTAuMjEyNzgyIDAuMDUzMiwtMC4yODM3MDkgLTAuMTI0MTIsLTAuMjgzNzA5IGggLTEuMDgxNjQgYyAtMC4xOTUwNSwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMzU0NjQsMC4yODM3MDkgbCAtMy4zNTEzMiw5LjQ1MTA2NiAtMi45Nzg5NCwtOS42ODE1OCBjIC0wLjA3MDksLTAuMTk1MDUgLTAuMTI0MTMsLTAuMjgzNzA5IC0wLjI0ODI1LC0wLjI4MzcwOSBoIC0wLjE3NzMyIGMgLTAuMTI0MTIsMCAtMC4xNzczMiwwLjA4ODY2IC0wLjI0ODI0LDAuMjgzNzA5IGwgLTIuOTc4OTUsOS42ODE1OCB6IiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MTkiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDE2MC4xMDAxOSw0OC4xNTEzNDggYyAwLjIxMjc4LDAgMC4yNjU5NywtMC4wNzA5MyAwLjI2NTk3LC0wLjI4MzcwOSB2IC0wLjY1NjA3OCBjIDAsLTAuMjEyNzgyIC0wLjA1MzIsLTAuMjgzNzA5IC0wLjI2NTk3LC0wLjI4MzcwOSBoIC02Ljc3MzU2IHYgLTQuNDMyOTU4IGggNi40NTQzOCBjIDAuMjEyNzksMCAwLjI4MzcxLC0wLjA3MDkzIDAuMjgzNzEsLTAuMjgzNzA5IHYgLTAuNjU2MDc4IGMgMCwtMC4yMTI3ODIgLTAuMDcwOSwtMC4yODM3MDkgLTAuMjgzNzEsLTAuMjgzNzA5IGggLTYuNDU0MzggdiAtNC4zMDg4MzUgaCA2Ljc3MzU2IGMgMC4xOTUwNSwwIDAuMjY1OTcsLTAuMDcwOTMgMC4yNjU5NywtMC4yODM3MDkgdiAtMC42NTYwNzggYyAwLC0wLjIxMjc4MiAtMC4wNzA5LC0wLjI4MzcwOSAtMC4yNjU5NywtMC4yODM3MDkgaCAtNy44OTA2NyBjIC0wLjIxMjc4LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yMTI3ODIgMC4wNzA5LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgeiIgLz4KICAgICAgPHBhdGgKICAgICAgICAgaWQ9InBhdGg0NTIxIgogICAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LWZhbWlseTonQWNoZXJ1cyBHcm90ZXNxdWUnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0FjaGVydXMgR3JvdGVzcXVlJzt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtYW5jaG9yOnN0YXJ0O2ZpbGw6I2U2ZTZlNjtzdHJva2Utd2lkdGg6MC44NzcxMjM0OCIKICAgICAgICAgZD0ibSAxNzEuMzU1NzUsNDguMTUxMzQ4IGMgMC4yMTI3OCwwIDAuMjY1OTgsLTAuMDcwOTMgMC4yNjU5OCwtMC4yODM3MDkgdiAtMC42NTYwNzggYyAwLC0wLjIxMjc4MiAtMC4wNTMyLC0wLjI4MzcwOSAtMC4yNjU5OCwtMC4yODM3MDkgaCAtNi43NzM1NiB2IC00LjQzMjk1OCBoIDYuNDU0MzkgYyAwLjIxMjc4LDAgMC4yODM3LC0wLjA3MDkzIDAuMjgzNywtMC4yODM3MDkgdiAtMC42NTYwNzggYyAwLC0wLjIxMjc4MiAtMC4wNzA5LC0wLjI4MzcwOSAtMC4yODM3LC0wLjI4MzcwOSBoIC02LjQ1NDM5IHYgLTQuMzA4ODM1IGggNi43NzM1NiBjIDAuMTk1MDUsMCAwLjI2NTk4LC0wLjA3MDkzIDAuMjY1OTgsLTAuMjgzNzA5IHYgLTAuNjU2MDc4IGMgMCwtMC4yMTI3ODIgLTAuMDcwOSwtMC4yODM3MDkgLTAuMjY1OTgsLTAuMjgzNzA5IGggLTcuODkwNjcgYyAtMC4yMTI3OCwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMjgzNzEsMC4yODM3MDkgdiAxMS44NDQ4NjMgYyAwLDAuMjEyNzgyIDAuMDcwOSwwLjI4MzcwOSAwLjI4MzcxLDAuMjgzNzA5IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUyMyIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMTc0Ljc3MzgzLDM1LjczOTA2NyBjIC0wLjIxMjc4LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yMTI3ODIgMC4wODg3LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgaCA0LjM0NDMgYyAzLjQ5MzE3LDAgNi4xNzA2OCwtMi42Nzc1MDYgNi4xNzA2OCwtNi4yMDYxNDEgMCwtMy41Mjg2MzQgLTIuNjc3NTEsLTYuMjA2MTQgLTYuMTcwNjgsLTYuMjA2MTQgeiBtIDQuMzI2NTcsMS4yMDU3NjQgYyAyLjg5MDI5LDAgNC43Njk4NiwyLjMyMjg3IDQuNzY5ODYsNS4wMDAzNzYgMCwyLjY1OTc3NSAtMS44Nzk1Nyw1LjAwMDM3NyAtNC43Njk4Niw1LjAwMDM3NyBoIC0zLjIwOTQ2IFYgMzYuOTQ0ODMxIFoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUyNSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMTkzLjgzMDU3LDQyLjQ5NDg5NCBoIDYuNTk2MjQgYyAwLjIxMjc4LDAgMC4yODM3MSwtMC4wNzA5MyAwLjI4MzcxLC0wLjI4MzcwOSB2IC0wLjY1NjA3OCBjIDAsLTAuMjEyNzgyIC0wLjA3MDksLTAuMjgzNzA5IC0wLjI4MzcxLC0wLjI4MzcwOSBoIC02LjU5NjI0IHYgLTQuMzA4ODM1IGggNi43NTU4MiBjIDAuMTk1MDUsMCAwLjI4MzcxLC0wLjA3MDkzIDAuMjgzNzEsLTAuMjgzNzA5IHYgLTAuNjU2MDc4IGMgMCwtMC4yMTI3ODIgLTAuMDcwOSwtMC4yODM3MDkgLTAuMjgzNzEsLTAuMjgzNzA5IGggLTcuODcyOTMgYyAtMC4yMTI3OCwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMjgzNzEsMC4yODM3MDkgdiAxMS44NDQ4NjMgYyAwLDAuMjEyNzgyIDAuMDcwOSwwLjI4MzcwOSAwLjI4MzcxLDAuMjgzNzA5IGggMC44NTExMyBjIDAuMTk1MDUsMCAwLjI2NTk4LC0wLjA3MDkzIDAuMjY1OTgsLTAuMjgzNzA5IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUyNyIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMjEyLjI5MDIzLDM5LjQ2Mjc1MSBjIDAsLTIuODcyNTU2IC0yLjI4NzQsLTMuNzIzNjg0IC00LjMwODgzLC0zLjcyMzY4NCBoIC00LjIyMDE4IGMgLTAuMjEyNzgsMCAtMC4yODM3MSwwLjA3MDkzIC0wLjI4MzcxLDAuMjgzNzA5IHYgMTEuODQ0ODYzIGMgMCwwLjI0ODI0NSAwLjA3MDksMC4yODM3MDkgMC4yODM3MSwwLjI4MzcwOSBoIDAuODMzNCBjIDAuMjEyNzgsMCAwLjI4MzcxLC0wLjA1MzE5IDAuMjgzNzEsLTAuMjgzNzA5IHYgLTQuNTc0ODEyIGggMy4xNzM5OSBsIDMuMjYyNjYsNC41NzQ4MTIgYyAwLjEyNDEyLDAuMTc3MzE4IDAuMjY1OTgsMC4yODM3MDkgMC40Nzg3NiwwLjI4MzcwOSBoIDAuODMzNCBjIDAuMjEyNzgsMCAwLjM1NDYzLC0wLjEwNjM5MSAwLjIxMjc4LC0wLjMzNjkwNSBsIC0zLjMzMzU5LC00LjY4MTIwMyBjIDEuNjQ5MDcsLTAuNDQzMjk2IDIuNzgzOSwtMS41NjA0MDEgMi43ODM5LC0zLjY3MDQ4OSB6IG0gLTcuNDExOSwyLjYyNDMxMSB2IC01LjE0MjIzMSBoIDMuMDE0NDEgYyAxLjgyNjM4LDAgMy4wMzIxNCwwLjc0NDczNyAzLjAzMjE0LDIuNTE3OTIgMCwxLjYxMzU5NyAtMC45MjIwNSwyLjYyNDMxMSAtMy4wMzIxNCwyLjYyNDMxMSB6IiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MjkiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDIxOS45MTQzNywzNy44NjY4ODYgMi42MDY1OCw1Ljc4MDU3NyBoIC01LjIzMDg5IGwgMi42MDY1OCwtNS43ODA1NzcgeiBtIDAuMjMwNTEsLTIuMTgxMDE1IGMgLTAuMDcwOSwtMC4xNDE4NTQgLTAuMTI0MTIsLTAuMjQ4MjQ1IC0wLjIxMjc4LC0wLjI0ODI0NSBoIC0wLjA1MzIgYyAtMC4xMDYzOSwwIC0wLjE0MTg2LDAuMTA2MzkxIC0wLjIzMDUyLDAuMjQ4MjQ1IGwgLTUuNzgwNTcsMTIuMTgxNzY4IGMgLTAuMDcwOSwwLjE1OTU4NiAwLDAuMjgzNzA5IDAuMTU5NTgsMC4yODM3MDkgaCAxLjAyODQ1IGMgMC4xOTUwNSwwIDAuMjY1OTgsLTAuMDcwOTMgMC4zNzIzNywtMC4yODM3MDkgbCAxLjM4MzA4LC0zLjAxNDQxMSBoIDYuMTg4NDEgbCAxLjM4MzA4LDMuMDE0NDExIGMgMC4xMDYzOSwwLjIxMjc4MiAwLjE3NzMyLDAuMjgzNzA5IDAuMzU0NjQsMC4yODM3MDkgaCAxLjAyODQ1IGMgMC4xNzczMSwwIDAuMjQ4MjQsLTAuMTI0MTIzIDAuMTc3MzEsLTAuMjgzNzA5IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUzMSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMjQwLjI1MDg0LDM4LjYyOTM1NSAxLjAyODQ1LDkuMjM4Mjg0IGMgMC4wMTc3LDAuMjEyNzgyIDAuMDcwOSwwLjI4MzcwOSAwLjI2NTk3LDAuMjgzNzA5IGggMC44Njg4NiBjIDAuMjEyNzgsMCAwLjI4MzcxLC0wLjA4ODY2IDAuMjY1OTgsLTAuMjgzNzA5IGwgLTEuNDg5NDcsLTEyLjE5OTUgYyAtMC4wMTc3LC0wLjEyNDEyMiAtMC4wMzU1LC0wLjE1OTU4NiAtMC4xNTk1OSwtMC4xNTk1ODYgaCAtMC4xMDYzOSBjIC0wLjA3MDksMCAtMC4xMjQxMiwwLjAxNzczIC0wLjIxMjc4LDAuMTU5NTg2IGwgLTUuNjc0MTksMTAuNzI3NzU4IC01LjY3NDE4LC0xMC43Mjc3NTggYyAtMC4wODg3LC0wLjE0MTg1NCAtMC4xNDE4NiwtMC4xNTk1ODYgLTAuMjEyNzksLTAuMTU5NTg2IGggLTAuMTA2MzkgYyAtMC4xMjQxMiwwIC0wLjE0MTg1LDAuMDM1NDYgLTAuMTU5NTgsMC4xNTk1ODYgbCAtMS40ODk0OCwxMi4xOTk1IGMgLTAuMDM1NSwwLjE5NTA1IDAuMDUzMiwwLjI4MzcwOSAwLjI0ODI1LDAuMjgzNzA5IGggMC44Njg4NiBjIDAuMjEyNzgsMCAwLjI0ODI0LC0wLjA3MDkzIDAuMjgzNzEsLTAuMjgzNzA5IGwgMS4wNDYxNywtOS4yMjA1NTIgNC43ODc2LDkuNDUxMDY2IGMgMC4xMjQxMiwwLjE3NzMxOCAwLjE5NTA1LDAuMjgzNzA5IDAuMzM2OSwwLjI4MzcwOSBoIDAuMTQxODYgYyAwLjE0MTg1LDAgMC4yMzA1MSwtMC4xMDYzOTEgMC4zMTkxNywtMC4yODM3MDkgeiIgLz4KICAgICAgPHBhdGgKICAgICAgICAgaWQ9InBhdGg0NTMzIgogICAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LWZhbWlseTonQWNoZXJ1cyBHcm90ZXNxdWUnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0FjaGVydXMgR3JvdGVzcXVlJzt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtYW5jaG9yOnN0YXJ0O2ZpbGw6I2U2ZTZlNjtzdHJva2Utd2lkdGg6MC44NzcxMjM0OCIKICAgICAgICAgZD0ibSAyNTMuNzQ2NDMsNDguMTUxMzQ4IGMgMC4yMTI3OCwwIDAuMjY1OTcsLTAuMDcwOTMgMC4yNjU5NywtMC4yODM3MDkgdiAtMC42NTYwNzggYyAwLC0wLjIxMjc4MiAtMC4wNTMyLC0wLjI4MzcwOSAtMC4yNjU5NywtMC4yODM3MDkgaCAtNi43NzM1NiB2IC00LjQzMjk1OCBoIDYuNDU0MzggYyAwLjIxMjc5LDAgMC4yODM3MSwtMC4wNzA5MyAwLjI4MzcxLC0wLjI4MzcwOSB2IC0wLjY1NjA3OCBjIDAsLTAuMjEyNzgyIC0wLjA3MDksLTAuMjgzNzA5IC0wLjI4MzcxLC0wLjI4MzcwOSBoIC02LjQ1NDM4IHYgLTQuMzA4ODM1IGggNi43NzM1NiBjIDAuMTk1MDUsMCAwLjI2NTk3LC0wLjA3MDkzIDAuMjY1OTcsLTAuMjgzNzA5IHYgLTAuNjU2MDc4IGMgMCwtMC4yMTI3ODIgLTAuMDcwOSwtMC4yODM3MDkgLTAuMjY1OTcsLTAuMjgzNzA5IGggLTcuODkwNjcgYyAtMC4yMTI3OCwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMjgzNzEsMC4yODM3MDkgdiAxMS44NDQ4NjMgYyAwLDAuMjEyNzgyIDAuMDcwOSwwLjI4MzcwOSAwLjI4MzcxLDAuMjgzNzA5IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUzNSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMjU3LjAwNDkyLDM2LjAyMjc3NiBjIC0wLjA3MDksLTAuMjEyNzgyIC0wLjE1OTU4LC0wLjI4MzcwOSAtMC4zNTQ2MywtMC4yODM3MDkgaCAtMS4wODE2NCBjIC0wLjE3NzMyLDAgLTAuMjEyNzksMC4wNzA5MyAtMC4xMjQxMywwLjI4MzcwOSBsIDQuNTkyNTUsMTIuMTgxNzY4IGMgMC4wNzA5LDAuMTc3MzE4IDAuMTI0MTIsMC4yNDgyNDUgMC4xOTUwNSwwLjI0ODI0NSBoIDAuMTI0MTIgYyAwLjA3MDksMCAwLjEyNDEyLC0wLjA4ODY2IDAuMTk1MDUsLTAuMjQ4MjQ1IGwgMy4xMjA4LC0xMC4wNTM5NDggMy4xMjA4MSwxMC4wNTM5NDggYyAwLjA3MDksMC4xNTk1ODYgMC4xMjQxMiwwLjI0ODI0NSAwLjE5NTA1LDAuMjQ4MjQ1IGggMC4xMjQxMiBjIDAuMDg4NywwIDAuMTI0MTIsLTAuMDg4NjYgMC4xOTUwNSwtMC4yNDgyNDUgbCA0LjU5MjU0LC0xMi4xODE3NjggYyAwLjA4ODcsLTAuMjEyNzgyIDAuMDUzMiwtMC4yODM3MDkgLTAuMTI0MTIsLTAuMjgzNzA5IGggLTEuMDgxNjQgYyAtMC4xOTUwNSwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMzU0NjQsMC4yODM3MDkgbCAtMy4zNTEzMSw5LjQ1MTA2NiAtMi45Nzg5NSwtOS42ODE1OCBjIC0wLjA3MDksLTAuMTk1MDUgLTAuMTI0MTIsLTAuMjgzNzA5IC0wLjI0ODI1LC0wLjI4MzcwOSBoIC0wLjE3NzMyIGMgLTAuMTI0MTIsMCAtMC4xNzczMSwwLjA4ODY2IC0wLjI0ODI0LDAuMjgzNzA5IGwgLTIuOTc4OTUsOS42ODE1OCB6IiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MzciCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDI3Mi44Nzc5Niw0MS45NDUyMDcgYyAwLDMuNTI4NjM1IDIuODU0ODIsNi40MzY2NTUgNi4zNDc5OSw2LjQzNjY1NSAzLjQ5MzE3LDAgNi4zNDgsLTIuOTA4MDIgNi4zNDgsLTYuNDM2NjU1IDAsLTMuNTI4NjM0IC0yLjg1NDgzLC02LjQzNjY1NCAtNi4zNDgsLTYuNDM2NjU0IC0zLjQ5MzE3LDAgLTYuMzQ3OTksMi45MDgwMiAtNi4zNDc5OSw2LjQzNjY1NCB6IG0gMS40MTg1NCwwIGMgMCwtMi42Nzc1MDYgMi4xNjMyOCwtNS4xOTU0MjYgNC45Mjk0NSwtNS4xOTU0MjYgMi44MDE2MywwIDQuOTI5NDUsMi41MTc5MiA0LjkyOTQ1LDUuMTk1NDI2IDAsMi42NTk3NzUgLTIuMTI3ODIsNS4xOTU0MjcgLTQuOTI5NDUsNS4xOTU0MjcgLTIuNzY2MTcsMCAtNC45Mjk0NSwtMi41MzU2NTIgLTQuOTI5NDUsLTUuMTk1NDI3IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUzOSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMjk2LjkzMjAyLDM5LjQ2Mjc1MSBjIDAsLTIuODcyNTU2IC0yLjI4NzQxLC0zLjcyMzY4NCAtNC4zMDg4NCwtMy43MjM2ODQgaCAtNC4yMjAxNyBjIC0wLjIxMjc5LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yNDgyNDUgMC4wNzA5LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgaCAwLjgzMzM5IGMgMC4yMTI3OCwwIDAuMjgzNzEsLTAuMDUzMTkgMC4yODM3MSwtMC4yODM3MDkgdiAtNC41NzQ4MTIgaCAzLjE3NCBsIDMuMjYyNjYsNC41NzQ4MTIgYyAwLjEyNDEyLDAuMTc3MzE4IDAuMjY1OTcsMC4yODM3MDkgMC40Nzg3NiwwLjI4MzcwOSBoIDAuODMzMzkgYyAwLjIxMjc4LDAgMC4zNTQ2NCwtMC4xMDYzOTEgMC4yMTI3OCwtMC4zMzY5MDUgbCAtMy4zMzM1OCwtNC42ODEyMDMgYyAxLjY0OTA2LC0wLjQ0MzI5NiAyLjc4MzksLTEuNTYwNDAxIDIuNzgzOSwtMy42NzA0ODkgeiBtIC03LjQxMTkxLDIuNjI0MzExIHYgLTUuMTQyMjMxIGggMy4wMTQ0MSBjIDEuODI2MzgsMCAzLjAzMjE1LDAuNzQ0NzM3IDMuMDMyMTUsMi41MTc5MiAwLDEuNjEzNTk3IC0wLjkyMjA2LDIuNjI0MzExIC0zLjAzMjE1LDIuNjI0MzExIHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDU0MSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMzAyLjY0MTEsNDEuNjYxNDk4IDYuMjQxNjEsLTUuNjM4NzIyIGMgMC4xNTk1OCwtMC4xOTUwNSAwLjA3MDksLTAuMjgzNzA5IC0wLjEwNjM5LC0wLjI4MzcwOSBoIC0xLjEzNDg0IGMgLTAuMjEyNzgsMCAtMC4yODM3MSwwLjA3MDkzIC0wLjQ5NjQ5LDAuMjgzNzA5IGwgLTUuNjkxOTIsNS4xNTk5NjMgdiAtNS4xNTk5NjMgYyAwLC0wLjIzMDUxNCAtMC4wNzA5LC0wLjI4MzcwOSAtMC4yODM3MSwtMC4yODM3MDkgaCAtMC44NTExMyBjIC0wLjIxMjc4LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yMTI3ODIgMC4wNzA5LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgaCAwLjg1MTEzIGMgMC4yMTI3OCwwIDAuMjgzNzEsLTAuMDUzMTkgMC4yODM3MSwtMC4yODM3MDkgdiAtNS42NzQxODYgbCA2LjAxMTA5LDUuNjc0MTg2IGMgMC4xOTUwNSwwLjIxMjc4MiAwLjI4MzcxLDAuMjgzNzA5IDAuNDYxMDMsMC4yODM3MDkgaCAxLjIwNTc2IGMgMC4xNTk1OSwwIDAuMjgzNzEsLTAuMDcwOTMgMC4wODg3LC0wLjI4MzcwOSB6IiAvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="

/***/ }),
/* 57 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"title":"title-2Vzar","buttonBar":"buttonBar-3RWL3","tasks":"tasks-mY1lL","task":"task-18Jn4","actionButton":"actionButton-3rOZ_"};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var _concat = __webpack_require__(38);
var _curry3 = __webpack_require__(27);


/**
 * Applies a function to the value at the given index of an array, returning a
 * new copy of the array with the element at the given index replaced with the
 * result of the function application.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig (a -> a) -> Number -> [a] -> [a]
 * @param {Function} fn The function to apply.
 * @param {Number} idx The index.
 * @param {Array|Arguments} list An array-like object whose value
 *        at the supplied index will be replaced.
 * @return {Array} A copy of the supplied array-like object with
 *         the element at index `idx` replaced with the value
 *         returned by applying `fn` to the existing element.
 * @see R.update
 * @example
 *
 *      R.adjust(R.add(10), 1, [1, 2, 3]);     //=> [1, 12, 3]
 *      R.adjust(R.add(10))(1)([1, 2, 3]);     //=> [1, 12, 3]
 * @symb R.adjust(f, -1, [a, b]) = [a, f(b)]
 * @symb R.adjust(f, 0, [a, b]) = [f(a), b]
 */
module.exports = _curry3(function adjust(fn, idx, list) {
  if (idx >= list.length || idx < -list.length) {
    return list;
  }
  var start = idx < 0 ? list.length : 0;
  var _idx = start + idx;
  var _list = _concat(list);
  _list[_idx] = fn(list[_idx]);
  return _list;
});


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);


/**
 * Applies function `fn` to the argument list `args`. This is useful for
 * creating a fixed-arity function from a variadic function. `fn` should be a
 * bound function if context is significant.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig (*... -> a) -> [*] -> a
 * @param {Function} fn The function which will be called with `args`
 * @param {Array} args The arguments to call `fn` with
 * @return {*} result The result, equivalent to `fn(...args)`
 * @see R.call, R.unapply
 * @example
 *
 *      var nums = [1, 2, 3, -99, 42, 6, 7];
 *      R.apply(Math.max, nums); //=> 42
 * @symb R.apply(f, [a, b, c]) = f(a, b, c)
 */
module.exports = _curry2(function apply(fn, args) {
  return fn.apply(this, args);
});


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);
var _isArray = __webpack_require__(29);
var _isFunction = __webpack_require__(61);
var _isString = __webpack_require__(39);
var toString = __webpack_require__(62);


/**
 * Returns the result of concatenating the given lists or strings.
 *
 * Note: `R.concat` expects both arguments to be of the same type,
 * unlike the native `Array.prototype.concat` method. It will throw
 * an error if you `concat` an Array with a non-Array value.
 *
 * Dispatches to the `concat` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a] -> [a]
 * @sig String -> String -> String
 * @param {Array|String} firstList The first list
 * @param {Array|String} secondList The second list
 * @return {Array|String} A list consisting of the elements of `firstList` followed by the elements of
 * `secondList`.
 *
 * @example
 *
 *      R.concat('ABC', 'DEF'); // 'ABCDEF'
 *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 *      R.concat([], []); //=> []
 */
module.exports = _curry2(function concat(a, b) {
  if (_isArray(a)) {
    if (_isArray(b)) {
      return a.concat(b);
    }
    throw new TypeError(toString(b) + ' is not an array');
  }
  if (_isString(a)) {
    if (_isString(b)) {
      return a + b;
    }
    throw new TypeError(toString(b) + ' is not a string');
  }
  if (a != null && _isFunction(a['fantasy-land/concat'])) {
    return a['fantasy-land/concat'](b);
  }
  if (a != null && _isFunction(a.concat)) {
    return a.concat(b);
  }
  throw new TypeError(toString(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
});


/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = function _isFunction(x) {
  return Object.prototype.toString.call(x) === '[object Function]';
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(26);
var _toString = __webpack_require__(63);


/**
 * Returns the string representation of the given value. `eval`'ing the output
 * should result in a value equivalent to the input value. Many of the built-in
 * `toString` methods do not satisfy this requirement.
 *
 * If the given value is an `[object Object]` with a `toString` method other
 * than `Object.prototype.toString`, this method is invoked with no arguments
 * to produce the return value. This means user-defined constructor functions
 * can provide a suitable `toString` method. For example:
 *
 *     function Point(x, y) {
 *       this.x = x;
 *       this.y = y;
 *     }
 *
 *     Point.prototype.toString = function() {
 *       return 'new Point(' + this.x + ', ' + this.y + ')';
 *     };
 *
 *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category String
 * @sig * -> String
 * @param {*} val
 * @return {String}
 * @example
 *
 *      R.toString(42); //=> '42'
 *      R.toString('abc'); //=> '"abc"'
 *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
 *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
 *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
 */
module.exports = _curry1(function toString(val) { return _toString(val, []); });


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var _contains = __webpack_require__(64);
var _map = __webpack_require__(41);
var _quote = __webpack_require__(72);
var _toISOString = __webpack_require__(73);
var keys = __webpack_require__(30);
var reject = __webpack_require__(74);


module.exports = function _toString(x, seen) {
  var recur = function recur(y) {
    var xs = seen.concat([x]);
    return _contains(y, xs) ? '<Circular>' : _toString(y, xs);
  };

  //  mapPairs :: (Object, [String]) -> [String]
  var mapPairs = function(obj, keys) {
    return _map(function(k) { return _quote(k) + ': ' + recur(obj[k]); }, keys.slice().sort());
  };

  switch (Object.prototype.toString.call(x)) {
    case '[object Arguments]':
      return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
    case '[object Array]':
      return '[' + _map(recur, x).concat(mapPairs(x, reject(function(k) { return /^\d+$/.test(k); }, keys(x)))).join(', ') + ']';
    case '[object Boolean]':
      return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
    case '[object Date]':
      return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';
    case '[object Null]':
      return 'null';
    case '[object Number]':
      return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
    case '[object String]':
      return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
    case '[object Undefined]':
      return 'undefined';
    default:
      if (typeof x.toString === 'function') {
        var repr = x.toString();
        if (repr !== '[object Object]') {
          return repr;
        }
      }
      return '{' + mapPairs(x, keys(x)).join(', ') + '}';
  }
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var _indexOf = __webpack_require__(65);


module.exports = function _contains(a, list) {
  return _indexOf(list, a, 0) >= 0;
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var equals = __webpack_require__(40);


module.exports = function _indexOf(list, a, idx) {
  var inf, item;
  // Array.prototype.indexOf doesn't exist below IE9
  if (typeof list.indexOf === 'function') {
    switch (typeof a) {
      case 'number':
        if (a === 0) {
          // manually crawl the list to distinguish between +0 and -0
          inf = 1 / a;
          while (idx < list.length) {
            item = list[idx];
            if (item === 0 && 1 / item === inf) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        } else if (a !== a) {
          // NaN
          while (idx < list.length) {
            item = list[idx];
            if (typeof item === 'number' && item !== item) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }
        // non-zero numbers can utilise Set
        return list.indexOf(a, idx);

      // all these types can utilise Set
      case 'string':
      case 'boolean':
      case 'function':
      case 'undefined':
        return list.indexOf(a, idx);

      case 'object':
        if (a === null) {
          // null can utilise Set
          return list.indexOf(a, idx);
        }
    }
  }
  // anything else not covered above, defer to R.equals
  while (idx < list.length) {
    if (equals(list[idx], a)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var _arrayFromIterator = __webpack_require__(67);
var _functionName = __webpack_require__(68);
var _has = __webpack_require__(32);
var identical = __webpack_require__(69);
var keys = __webpack_require__(30);
var type = __webpack_require__(71);


module.exports = function _equals(a, b, stackA, stackB) {
  if (identical(a, b)) {
    return true;
  }

  if (type(a) !== type(b)) {
    return false;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) &&
           typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) &&
           typeof b.equals === 'function' && b.equals(a);
  }

  switch (type(a)) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' &&
          _functionName(a.constructor) === 'Promise') {
        return a === b;
      }
      break;
    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && identical(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case 'Date':
      if (!identical(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case 'Error':
      return a.name === b.name && a.message === b.message;
    case 'RegExp':
      if (!(a.source === b.source &&
            a.global === b.global &&
            a.ignoreCase === b.ignoreCase &&
            a.multiline === b.multiline &&
            a.sticky === b.sticky &&
            a.unicode === b.unicode)) {
        return false;
      }
      break;
    case 'Map':
    case 'Set':
      if (!_equals(_arrayFromIterator(a.entries()), _arrayFromIterator(b.entries()), stackA, stackB)) {
        return false;
      }
      break;
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
      break;
    case 'ArrayBuffer':
      break;
    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys(a);
  if (keysA.length !== keys(b).length) {
    return false;
  }

  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }

  stackA.push(a);
  stackB.push(b);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has(key, b) && _equals(b[key], a[key], stackA, stackB))) {
      return false;
    }
    idx -= 1;
  }
  stackA.pop();
  stackB.pop();
  return true;
};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);


/**
 * Returns true if its arguments are identical, false otherwise. Values are
 * identical if they reference the same memory. `NaN` is identical to `NaN`;
 * `0` and `-0` are not identical.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      var o = {};
 *      R.identical(o, o); //=> true
 *      R.identical(1, 1); //=> true
 *      R.identical(1, '1'); //=> false
 *      R.identical([], []); //=> false
 *      R.identical(0, -0); //=> false
 *      R.identical(NaN, NaN); //=> true
 */
module.exports = _curry2(function identical(a, b) {
  // SameValue algorithm
  if (a === b) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
});


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var _has = __webpack_require__(32);


module.exports = (function() {
  var toString = Object.prototype.toString;
  return toString.call(arguments) === '[object Arguments]' ?
    function _isArguments(x) { return toString.call(x) === '[object Arguments]'; } :
    function _isArguments(x) { return _has('callee', x); };
}());


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(26);


/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 */
module.exports = _curry1(function type(val) {
  return val === null      ? 'Null'      :
         val === undefined ? 'Undefined' :
         Object.prototype.toString.call(val).slice(8, -1);
});


/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = function _quote(s) {
  var escaped = s
    .replace(/\\/g, '\\\\')
    .replace(/[\b]/g, '\\b')  // \b matches word boundary; [\b] matches backspace
    .replace(/\f/g, '\\f')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\v/g, '\\v')
    .replace(/\0/g, '\\0');

  return '"' + escaped.replace(/"/g, '\\"') + '"';
};


/***/ }),
/* 73 */
/***/ (function(module, exports) {

/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */
module.exports = (function() {
  var pad = function pad(n) { return (n < 10 ? '0' : '') + n; };

  return typeof Date.prototype.toISOString === 'function' ?
    function _toISOString(d) {
      return d.toISOString();
    } :
    function _toISOString(d) {
      return (
        d.getUTCFullYear() + '-' +
        pad(d.getUTCMonth() + 1) + '-' +
        pad(d.getUTCDate()) + 'T' +
        pad(d.getUTCHours()) + ':' +
        pad(d.getUTCMinutes()) + ':' +
        pad(d.getUTCSeconds()) + '.' +
        (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z'
      );
    };
}());


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var _complement = __webpack_require__(75);
var _curry2 = __webpack_require__(25);
var filter = __webpack_require__(42);


/**
 * The complement of [`filter`](#filter).
 *
 * Acts as a transducer if a transformer is given in list position. Filterable
 * objects include plain objects or any object that has a filter method such
 * as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array}
 * @see R.filter, R.transduce, R.addIndex
 * @example
 *
 *      var isOdd = (n) => n % 2 === 1;
 *
 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */
module.exports = _curry2(function reject(pred, filterable) {
  return filter(_complement(pred), filterable);
});


/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = function _complement(f) {
  return function() {
    return !f.apply(this, arguments);
  };
};


/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = function _isTransformer(obj) {
  return typeof obj['@@transducer/step'] === 'function';
};


/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
};


/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(26);
var _isArray = __webpack_require__(29);
var _isString = __webpack_require__(39);


/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
module.exports = _curry1(function isArrayLike(x) {
  if (_isArray(x)) { return true; }
  if (!x) { return false; }
  if (typeof x !== 'object') { return false; }
  if (_isString(x)) { return false; }
  if (x.nodeType === 1) { return !!x.length; }
  if (x.length === 0) { return true; }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});


/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = (function() {
  function XWrap(fn) {
    this.f = fn;
  }
  XWrap.prototype['@@transducer/init'] = function() {
    throw new Error('init not implemented on XWrap');
  };
  XWrap.prototype['@@transducer/result'] = function(acc) { return acc; };
  XWrap.prototype['@@transducer/step'] = function(acc, x) {
    return this.f(acc, x);
  };

  return function _xwrap(fn) { return new XWrap(fn); };
}());


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__(31);
var _curry2 = __webpack_require__(25);


/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      var log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */
module.exports = _curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);
var _xfBase = __webpack_require__(44);


module.exports = (function() {
  function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XFilter.prototype['@@transducer/init'] = _xfBase.init;
  XFilter.prototype['@@transducer/result'] = _xfBase.result;
  XFilter.prototype['@@transducer/step'] = function(result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return _curry2(function _xfilter(f, xf) { return new XFilter(f, xf); });
}());


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var _curry3 = __webpack_require__(27);


/**
 * Makes a descending comparator function out of a function that returns a value
 * that can be compared with `<` and `>`.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Function
 * @sig Ord b => (a -> b) -> a -> a -> Number
 * @param {Function} fn A function of arity one that returns a value that can be compared
 * @param {*} a The first item to be compared.
 * @param {*} b The second item to be compared.
 * @return {Number} `-1` if fn(a) > fn(b), `1` if fn(b) > fn(a), otherwise `0`
 * @see R.ascend
 * @example
 *
 *      var byAge = R.descend(R.prop('age'));
 *      var people = [
 *        // ...
 *      ];
 *      var peopleByOldestFirst = R.sort(byAge, people);
 */
module.exports = _curry3(function descend(fn, a, b) {
  var aa = fn(a);
  var bb = fn(b);
  return aa > bb ? -1 : aa < bb ? 1 : 0;
});


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);
var map = __webpack_require__(47);


/**
 * Returns a lens for the given getter and setter functions. The getter "gets"
 * the value of the focus; the setter "sets" the value of the focus. The setter
 * should not mutate the data structure.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
 * @param {Function} getter
 * @param {Function} setter
 * @return {Lens}
 * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
 * @example
 *
 *      var xLens = R.lens(R.prop('x'), R.assoc('x'));
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */
module.exports = _curry2(function lens(getter, setter) {
  return function(toFunctorFn) {
    return function(target) {
      return map(
        function(focus) {
          return setter(focus, target);
        },
        toFunctorFn(getter(target))
      );
    };
  };
});


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);
var _xfBase = __webpack_require__(44);


module.exports = (function() {
  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;
  XMap.prototype['@@transducer/step'] = function(result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return _curry2(function _xmap(f, xf) { return new XMap(f, xf); });
}());


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var _arity = __webpack_require__(31);
var _isPlaceholder = __webpack_require__(28);


/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curryN(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (!_isPlaceholder(received[combinedIdx]) ||
           argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined)
                     : _arity(left, _curryN(length, combined, fn));
  };
};


/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var _checkForMethod = __webpack_require__(52);
var _curry1 = __webpack_require__(26);
var slice = __webpack_require__(89);


/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */
module.exports = _curry1(_checkForMethod('tail', slice(1, Infinity)));


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var _checkForMethod = __webpack_require__(52);
var _curry3 = __webpack_require__(27);


/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */
module.exports = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var _concat = __webpack_require__(38);
var _curry2 = __webpack_require__(25);


/**
 * Returns a new list with the given element at the front, followed by the
 * contents of the list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The item to add to the head of the output list.
 * @param {Array} list The array to add to the tail of the output list.
 * @return {Array} A new array.
 * @see R.append
 * @example
 *
 *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
 */
module.exports = _curry2(function prepend(el, list) {
  return _concat([el], list);
});


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var _curry3 = __webpack_require__(27);
var equals = __webpack_require__(40);


/**
 * Returns `true` if the specified object property is equal, in
 * [`R.equals`](#equals) terms, to the given value; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig String -> a -> Object -> Boolean
 * @param {String} name
 * @param {*} val
 * @param {*} obj
 * @return {Boolean}
 * @see R.equals, R.propSatisfies
 * @example
 *
 *      var abby = {name: 'Abby', age: 7, hair: 'blond'};
 *      var fred = {name: 'Fred', age: 12, hair: 'brown'};
 *      var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
 *      var alois = {name: 'Alois', age: 15, disposition: 'surly'};
 *      var kids = [abby, fred, rusty, alois];
 *      var hasBrownHair = R.propEq('hair', 'brown');
 *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
 */
module.exports = _curry3(function propEq(name, val, obj) {
  return equals(val, obj[name]);
});


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);


/**
 * Returns a copy of the list, sorted according to the comparator function,
 * which should accept two values at a time and return a negative number if the
 * first value is smaller, a positive number if it's larger, and zero if they
 * are equal. Please note that this is a **copy** of the list. It does not
 * modify the original.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a,a -> Number) -> [a] -> [a]
 * @param {Function} comparator A sorting function :: a -> b -> Int
 * @param {Array} list The list to sort
 * @return {Array} a new array with its elements sorted by the comparator function.
 * @example
 *
 *      var diff = function(a, b) { return a - b; };
 *      R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
 */
module.exports = _curry2(function sort(comparator, list) {
  return Array.prototype.slice.call(list, 0).sort(comparator);
});


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var add = __webpack_require__(94);
var reduce = __webpack_require__(51);


/**
 * Adds together all the elements of a list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list An array of numbers
 * @return {Number} The sum of all the numbers in the list.
 * @see R.reduce
 * @example
 *
 *      R.sum([2,4,6,8,100,1]); //=> 121
 */
module.exports = reduce(add, 0);


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);


/**
 * Adds two values.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 * @see R.subtract
 * @example
 *
 *      R.add(2, 3);       //=>  5
 *      R.add(7)(10);      //=> 17
 */
module.exports = _curry2(function add(a, b) {
  return Number(a) + Number(b);
});


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var _curry2 = __webpack_require__(25);


/**
 * Runs the given function with the supplied object, then returns the object.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (a -> *) -> a -> a
 * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
 * @param {*} x
 * @return {*} `x`.
 * @example
 *
 *      var sayX = x => console.log('x is ' + x);
 *      R.tap(sayX, 100); //=> 100
 *      // logs 'x is 100'
 * @symb R.tap(f, a) = a
 */
module.exports = _curry2(function tap(fn, x) {
  fn(x);
  return x;
});


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var css = __webpack_require__(97);
var duckweed = __webpack_require__(4);
var E = __webpack_require__(98);
var assoc = __webpack_require__(46);
var lensProp = __webpack_require__(45);
var not = __webpack_require__(99);
var over = __webpack_require__(49);
var init = function (options) { return ({
    created: new Date().getTime(),
    done: options.done || false,
    editing: options.editing || false,
    itemHeight: 0,
    text: options.text || "",
}); };
exports.init = init;
// Action
var Action;
(function (Action) {
    Action["Toggle"] = "Toggle";
    Action["ToggleEditing"] = "ToggleEditing";
    Action["Update"] = "Update";
    Action["Focus"] = "Focus";
    Action["RecalcHeight"] = "RecalcHeight";
})(Action || (Action = {}));
exports.Action = Action;
var actions = (_a = {},
    _a[Action.Toggle] = function (patch, checked) {
        patch(function (model) { return (__assign({}, model, { done: checked, editing: checked ? false : model.editing })); });
    },
    _a[Action.ToggleEditing] = function (patch) {
        patch(over(lensProp("editing"), not));
    },
    _a[Action.Update] = function (patch, text) {
        patch(assoc("text", text));
    },
    _a[Action.Focus] = function (patch, vnode) {
        vnode.elm.focus();
    },
    _a[Action.RecalcHeight] = function (patch, vnode) {
        var h = vnode.elm.offsetHeight;
        patch(assoc("itemHeight", h));
    },
    _a);
exports.actions = actions;
var view = function (_a) {
    var model = _a.model, act = _a.act, _b = _a.classes, classes = _b === void 0 ? [] : _b, _c = _a.styles, styles = _c === void 0 ? {} : _c;
    return (duckweed.html("div", { class: classes.concat([css.task]), style: Object.assign({}, style, styles), key: model.created, "hook-insert": act(Action.RecalcHeight) },
        duckweed.html("label", { class: css.toggleDone, for: "task-" + model.created },
            duckweed.html("input", { class: css.toggleCheckbox, id: "task-" + model.created, type: "checkbox", "on-change": E.from(E.checkboxEvent, act(Action.Toggle)), checked: model.done }),
            duckweed.html("span", { class: css.toggleDoneLabel }, model.done
                ? duckweed.html("span", null, "+")
                : duckweed.html("span", null, "\u2014"))),
        model.editing
            ? duckweed.html("input", { class: (_d = {}, _d[css.editBox] = true, _d[css.long] = model.text.length > 30, _d), value: model.text, placeholder: "What would you want to accomplish?", "on-input": E.from(E.inputEvent, act(Action.Update)), "keys-enter": act(Action.ToggleEditing), "keys-escape": act(Action.ToggleEditing), "hook-insert": act(Action.Focus), autofocus: true })
            : duckweed.html("span", { class: (_e = {}, _e[css.text] = true, _e[css.long] = model.text.length > 30, _e[css.done] = model.done, _e), style: { color: model.done ? "grey" : "black" }, "on-click": model.done ? act(null) : act(Action.ToggleEditing) }, model.text),
        model.done || !model.editing
            ? null
            : duckweed.html("button", { class: css.editButton, "on-click": act(Action.ToggleEditing) }, "Save")));
    var _d, _e;
};
exports.view = view;
// Styles
var style = {
    opacity: 1,
    remove: {
        opacity: 0,
    },
};
var _a;


/***/ }),
/* 97 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"task":"task-y7fco","toggleDone":"toggleDone-hF3mY","toggleCheckbox":"toggleCheckbox-1F668","toggleDoneLabel":"toggleDoneLabel-16y6c","editBox":"editBox-2Mb0s","text":"text-39h4M","long":"long-dnv71","done":"done-5xpXe","editButton":"editButton-paaFV"};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var is = __webpack_require__(6);
/**
 * Decorates an event handler with a processor
 */
var from = function (processor, handler) { return function () {
    var eventArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        eventArgs[_i] = arguments[_i];
    }
    return handler.apply(void 0, __spread(processor.apply(void 0, __spread(eventArgs))));
}; };
exports.from = from;
/**
 * Processor that handles input DOM events
 */
var inputEvent = function (event) {
    return [event.target.value];
};
exports.inputEvent = inputEvent;
/**
 * Processor that handles change DOM events on checkboxes
 */
var checkboxEvent = function (event) {
    return [event.target.checked, event.target.value];
};
exports.checkboxEvent = checkboxEvent;
/**
 * Automatic processor that handles various events and hooks
 */
var auto = function () {
    var eventCallbackArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        eventCallbackArgs[_i] = arguments[_i];
    }
    var first = eventCallbackArgs[0];
    if (is.vnode(first)) {
        // This is mostly for hooks. We add the vnode objects to args.
        return eventCallbackArgs;
    }
    else if (is.changeEvent(first) && is.checkbox(first.target)) {
        return checkboxEvent(first);
    }
    else if (is.inputEvent(first) && is.input(first.target)) {
        first.preventDefault();
        return inputEvent(first);
    }
    else if (is.pathData(first)) {
        return [first];
    }
    return [];
};
exports.auto = auto;
//# sourceMappingURL=events.js.map

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(26);


/**
 * A function that returns the `!` of its argument. It will return `true` when
 * passed false-y value, and `false` when passed a truth-y one.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig * -> Boolean
 * @param {*} a any value
 * @return {Boolean} the logical inverse of passed argument.
 * @see R.complement
 * @example
 *
 *      R.not(true); //=> false
 *      R.not(false); //=> true
 *      R.not(0); //=> true
 *      R.not(1); //=> false
 */
module.exports = _curry1(function not(a) {
  return !a;
});


/***/ }),
/* 100 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var duckweed = __webpack_require__(4);
var pipe = __webpack_require__(50);
var prop = __webpack_require__(34);
var route = __webpack_require__(53);
var navbar = __webpack_require__(103);
// Utility functions
var matchRoute = pipe(prop("re"), route.match(""));
var getMatchingRoute = function (routes) {
    if (!routes.length) {
        // tslint:disable:no-console
        console.log("No futher routes found");
        return undefined;
    }
    var _a = __read(routes), current = _a[0], remaining = _a.slice(1);
    var args = matchRoute(current);
    if (args === false) {
        return getMatchingRoute(remaining) || {
            args: [],
            mod: current.mod,
        };
    }
    return {
        args: args,
        mod: current.mod,
    };
};
var init = function (routes, links) {
    if (!routes.length) {
        throw Error("No route definitions found");
    }
    var _a = getMatchingRoute(routes), mod = _a.mod, args = _a.args;
    return {
        actions: mod.actions,
        links: links,
        model: mod.init && mod.init.apply(mod, __spread(args)),
        path: location.pathname,
        routes: routes,
        view: mod.view,
    };
};
exports.init = init;
// Actions
var Action;
(function (Action) {
    Action["SwitchRoute"] = "SwitchRoute";
    Action["ModuleAction"] = "ModuleAction";
    Action["NavbarAction"] = "NavbarAction";
})(Action || (Action = {}));
exports.Action = Action;
var actions = (_a = {},
    _a[Action.ModuleAction] = function (patch, moduleActions, moduleAction) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var modulePatcher, action;
            return __generator(this, function (_a) {
                if (!moduleActions) {
                    return [2 /*return*/];
                }
                modulePatcher = function (fn) { return patch(function (model) { return (__assign({}, model, { model: fn(model.model) })); }); };
                action = moduleActions[moduleAction];
                if (action) {
                    action.apply(void 0, __spread([modulePatcher], args));
                }
                return [2 /*return*/];
            });
        });
    },
    _a[Action.SwitchRoute] = function (patch) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            patch(function (model) { return (__assign({}, model, init(model.routes, model.links))); });
            return [2 /*return*/];
        });
    }); },
    _a[Action.NavbarAction] = function (_, action, path) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navbar.actions[action](_, path)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    _a);
exports.actions = actions;
var view = function (_a) {
    var model = _a.model, act = _a.act;
    return (duckweed.html("div", { route: act(Action.SwitchRoute) },
        duckweed.html(navbar.view, { act: act.as(Action.NavbarAction), links: model.links }),
        duckweed.html(model.view, { model: model.model, act: act.as(Action.ModuleAction, model.actions), key: model.path })));
};
exports.view = view;
var _a;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var _curry1 = __webpack_require__(26);
var curryN = __webpack_require__(48);


/**
 * Returns a curried equivalent of the provided function. The curried function
 * has two unusual capabilities. First, its arguments needn't be provided one
 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN
 * @example
 *
 *      var addFourNumbers = (a, b, c, d) => a + b + c + d;
 *
 *      var curriedAddFourNumbers = R.curry(addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry1(function curry(fn) {
  return curryN(fn.length, fn);
});


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var css = __webpack_require__(104);
var duckweed = __webpack_require__(4);
var route_1 = __webpack_require__(53);
// Action
var Action;
(function (Action) {
    Action["Go"] = "Go";
})(Action || (Action = {}));
exports.Action = Action;
var actions = (_a = {},
    _a[Action.Go] = function (_, path) {
        route_1.go(path);
    },
    _a);
exports.actions = actions;
var view = function (_a) {
    var links = _a.links, act = _a.act;
    return (duckweed.html("nav", { class: css.nav }, links.map(function (_a) {
        var _b = __read(_a, 2), path = _b[0], label = _b[1];
        return duckweed.html("a", { class: css.link, "on-click": act(Action.Go, path) }, label);
    })));
};
exports.view = view;
var _a;


/***/ }),
/* 104 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"nav":"nav-mLhoT","link":"link-3zPtL"};

/***/ })
]);
//# sourceMappingURL=0-e64ee.js.map