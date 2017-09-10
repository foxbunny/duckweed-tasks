webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var elements = __webpack_require__(37);
var css = __webpack_require__(41);
var duckweed = __webpack_require__(5);
var aside = __webpack_require__(38);
var fx = __webpack_require__(39);
// View
var view = function () {
    return (duckweed.html("div", { class: elements.wrapper, style: fx.dropInTwistOut() },
        duckweed.html("main", { class: elements.main },
            duckweed.html("h1", { class: css.title }, "About this app"),
            duckweed.html("div", { class: css.body },
                duckweed.html("p", null,
                    "This is a demo app for the ",
                    duckweed.html("a", { href: "https://github.com/foxbunny/duckweed" }, "Duckweed"),
                    " microframework."),
                duckweed.html("p", null,
                    "You can see the source code ",
                    duckweed.html("a", { href: "https://github.com/foxbunny/selm" }, "on GitHub"),
                    ". It is available under the terms of the MIT license."),
                duckweed.html("p", null, "\u00A9 2017 Hajime Yamasaki Vukelic."))),
        duckweed.html(aside.view, null)));
};
exports.view = view;


/***/ }),
/* 9 */
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
var elements = __webpack_require__(37);
var css = __webpack_require__(44);
var duckweed = __webpack_require__(5);
var aside = __webpack_require__(38);
var fx = __webpack_require__(39);
var task = __webpack_require__(45);
// Storage management
var STORAGE_KEY = "tasks";
var retrieve = function () {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};
var store = function (tasks) {
    var data = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, data);
};
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
    Action["SetHeight"] = "SetHeight";
})(Action || (Action = {}));
exports.Action = Action;
var sortByDate = function (tasks) {
    return tasks.concat([]).sort(function (a, b) { return b.created - a.created; });
};
var filterDone = function (done, tasks) {
    return tasks.filter(function (t) { return t.done === done; });
};
var notEmpty = function (t) { return t.text.trim() !== "" || t.editing; };
var splitTask = function (done, tasks) {
    return sortByDate(filterDone(done, tasks));
};
var splitTasks = function (tasks) {
    return [splitTask(false, tasks), splitTask(true, tasks)];
};
var sortTasks = function (tasks) {
    return (_a = []).concat.apply(_a, __spread(splitTasks(tasks)));
    var _a;
};
var raf = function (fn) { return requestAnimationFrame(function () { return requestAnimationFrame(fn); }); };
var actions = (_a = {},
    _a[Action.Update] = function (patch, id, taskAction, arg) {
        var scoped = patch.as(["tasks", id], function (model) {
            var tasks = sortTasks(model.tasks).filter(notEmpty);
            store(tasks);
            return __assign({}, model, { tasks: tasks });
        });
        // FIXME: Temporary workaround until we figure out why we can't just do
        // await task.actions[taskAction](taskPatch, arg)
        task.actions[taskAction](scoped, arg);
    },
    _a[Action.Add] = function (patch) {
        patch(function (model) { return (__assign({}, model, { tasks: [task.init({ editing: true })].concat(model.tasks) })); });
    },
    _a[Action.ClearDone] = function (patch) {
        patch(function (model) {
            var tasks = filterDone(false, model.tasks);
            store(tasks);
            return __assign({}, model, { tasks: tasks });
        });
    },
    _a[Action.SetHeight] = function (patch, vnode, newVnode) {
        if (newVnode) {
            vnode = newVnode;
        }
        var h = vnode.children
            .map(function (c) { return c.elm; })
            .reduce(function (n, c) {
            raf(function () { return c.style.transform = "translateY(" + n + "px)"; });
            return n + c.offsetHeight + 10;
        }, 0);
        vnode.elm.style.paddingBottom = h + "px";
    },
    _a);
exports.actions = actions;
var view = function (_a) {
    var model = _a.model, act = _a.act;
    return (duckweed.html("div", { class: elements.wrapper, style: fx.dropInTwistOut() },
        duckweed.html("main", { class: elements.main },
            duckweed.html("h1", { class: css.title }, "Task list"),
            duckweed.html("p", { class: css.buttonBar },
                duckweed.html("button", { class: css.actionButton, "on-click": act(Action.Add) }, "+ Add task"),
                duckweed.html("button", { class: css.actionButton, "on-click": act(Action.ClearDone) }, "Clear done")),
            duckweed.html("div", { class: css.tasks, "hook-insert": act(Action.SetHeight), "hook-postpatch": act(Action.SetHeight) }, model.tasks.map(function (item, index) {
                return duckweed.html(task.view, { model: item, act: act.as(Action.Update, index), classes: [css.task], styles: {
                        delayed: {
                            opacity: 1,
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
/* 10 */
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
__webpack_require__(47);
__export(__webpack_require__(48));


/***/ }),
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
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"wrapper":"wrapper-1mVco","main":"main-3Cs3s"};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var css = __webpack_require__(42);
var badge = __webpack_require__(43);
var duckweed = __webpack_require__(5);
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
/* 39 */
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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var qs = __webpack_require__(7);
var go = function (path, query) {
    if (query === void 0) { query = {}; }
    // tslint:disable:no-console
    var q = qs.stringify(query);
    var next = "/duckweed-tasks" + path + (q ? "?" + q : "");
    window.history.pushState(undefined, "", next);
    try {
        window.dispatchEvent(new Event("popstate"));
    }
    catch (e) {
        // This is probably IE, where event constructor cannot be used
        var ev = document.createEvent("PopStateEvent");
        ev.initPopStateEvent("popstate", true, true, {});
        window.dispatchEvent(ev);
    }
};
exports.go = go;
var match = function (prefix, re, path) {
    if (path === void 0) { path = location.pathname; }
    var m = re.exec(path.slice(prefix.length));
    return m
        ? m.slice(1)
        : false;
};
exports.match = match;


/***/ }),
/* 41 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"title":"title-3wfn8","body":"body-29zdx"};

/***/ }),
/* 42 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"aside":"aside-3sF2l"};

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgIGlkPSJzdmc4IgogICB2ZXJzaW9uPSIxLjEiCiAgIHZpZXdCb3g9IjAgMCA4NC41MDgyOTIgMTAuNDQ0MTYiCiAgIGhlaWdodD0iMTAuNDQ0MTZtbSIKICAgd2lkdGg9Ijg0LjUwODI5M21tIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDQ1MjIiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojOGNjMzNhO3N0b3Atb3BhY2l0eToxIgogICAgICAgICBvZmZzZXQ9IjAiCiAgICAgICAgIGlkPSJzdG9wNDUxOCIgLz4KICAgICAgPHN0b3AKICAgICAgICAgc3R5bGU9InN0b3AtY29sb3I6IzNmN2MwNDtzdG9wLW9wYWNpdHk6MSIKICAgICAgICAgb2Zmc2V0PSIxIgogICAgICAgICBpZD0ic3RvcDQ1MjAiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50CiAgICAgICBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC4yMzUyMjAwNSwwLjMyMTI5NTg4LC0wLjQzNDczNDQ2LDAuMzE4MjY3NDIsMTE4LjY4MTA5LDcwLjgzNzc4NykiCiAgICAgICByPSI1MS4xNjc5MTIiCiAgICAgICBmeT0iODQuODQwNDg1IgogICAgICAgZng9Ii0xNTguMzU2OTIiCiAgICAgICBjeT0iODQuODQwNDg1IgogICAgICAgY3g9Ii0xNTguMzU2OTIiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NDkzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDUyMiIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuMjIyNjY2NzIsMC41Mzc4MDM1MSwtMC40MzY1MzYwMywwLjE4MDczODk1LDk3LjUzOTIzMiwxMTUuNjQ1OSkiCiAgICAgICByPSIzMC41NDYwMzQiCiAgICAgICBmeT0iMTguOTg1OTUyIgogICAgICAgZng9Ii0xNTYuMjA3MjEiCiAgICAgICBjeT0iMTguOTg1OTUyIgogICAgICAgY3g9Ii0xNTYuMjA3MjEiCiAgICAgICBpZD0icmFkaWFsR3JhZGllbnQ0NTAzIgogICAgICAgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50NDUyMiIgLz4KICAgIDxyYWRpYWxHcmFkaWVudAogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiCiAgICAgICBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAuNTQ2NjkwNDQsMCwwLDAuNDUwNDU2NzcsMTAxLjU3NDg3LDExLjg3NTE1KSIKICAgICAgIHI9IjMzLjcxMDI0NyIKICAgICAgIGZ5PSI3Mi43ODI1OTMiCiAgICAgICBmeD0iLTc4LjM3ODUzMiIKICAgICAgIGN5PSI3Mi43ODI1OTMiCiAgICAgICBjeD0iLTc4LjM3ODUzMiIKICAgICAgIGlkPSJyYWRpYWxHcmFkaWVudDQ1MTUiCiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQ0NTIyIiAvPgogIDwvZGVmcz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE1Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZwogICAgIHN0eWxlPSJzdHJva2Utd2lkdGg6My4zMTUxMTI1OSIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMzAxNjQ4ODgsMCwwLDAuMzAxNjQ4ODgsLTExLjMxODk1MSwtNy40OTY1NzU2KSI+CiAgICA8cmVjdAogICAgICAgcnk9IjQuMjQxODMzMiIKICAgICAgIHJ4PSI0LjI0MTgzMzIiCiAgICAgICB5PSIyOS42NjEzOTIiCiAgICAgICB4PSI0OS43NTExOTgiCiAgICAgICBoZWlnaHQ9IjI0LjIzOTA0OCIKICAgICAgIHdpZHRoPSIyNjcuOTI2OTEiCiAgICAgICBpZD0icmVjdDQ1MDMiCiAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6IzMzMzMzMztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC44NzcxMjM1MztzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjEiIC8+CiAgICA8ZwogICAgICAgc3R5bGU9InN0cm9rZS13aWR0aDo0LjE1NDE5ODE3IgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC43OTgwMTUwMiwwLDAsMC43OTgwMTUwMiwyMC4yMjA4MDIsNi43MTY2NTY4KSIKICAgICAgIGlkPSJnNDUwNiI+CiAgICAgIDxwYXRoCiAgICAgICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDp1cmwoI3JhZGlhbEdyYWRpZW50NDQ5Myk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMDk5MTMxNTg7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICBkPSJNIDI0Ljg2MTU3OCw1OS42NzY0MzYgQyAzMS44MjQxOTgsNzAuNDgwNSA0OS4xODkyMTksNjYuOTI4NTkzIDUyLjQ3MTk2OCw1NC42MzQ1MzcgNTYuNDE2NzU3LDM5Ljg2MTEwOCA0OS41MzUzNjYsMzcuMjg2NTY0IDM5LjAyNjkxMSwzOC41NDg0ODQgMzAuNzk5NDI4LDM5LjUzNjQ5MSAxNC44OTc4Myw0NC43OTA4MzMgMjQuODYxNTc4LDU5LjY3NjQzNiBaIgogICAgICAgICBpZD0icGF0aDQ0ODUiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDp1cmwoI3JhZGlhbEdyYWRpZW50NDUwMyk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMDk5MTMxNTg7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxIgogICAgICAgICBkPSJtIDQ1LjY0NzM3NSwyNS40OTE3MzggYyAtNC4zNjEzNjIsNy40NTc3NjYgMC4wNDg1NiwxMS42ODI0NDkgMy45MjQ4MjYsMTMuNjc3NTk1IDQuMzIyNjQ4LDIuMjI0OTA0IDcuMTczOTIyLDQuOTQ4NjM1IDEwLjAwNzY3MSwtMS43ODc2OTUgMS4wOTI3MjQsLTIuMDQ2NTA3IDQuMzc3NjgxLC0xMS40MTkyODMgLTMuMTk2NTYxLC0xMy42NjgwNiAtNy41NzQyNDcsLTIuMjQ4NzggLTkuMjM1MTQzLC0wLjIyNzQ3NiAtMTAuNzM1OTM2LDEuNzc4MTYgeiIKICAgICAgICAgaWQ9InBhdGg0NDk1IiAvPgogICAgICA8cGF0aAogICAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6dXJsKCNyYWRpYWxHcmFkaWVudDQ1MTUpO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjA5OTEzMTU4O3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICAgICAgZD0ibSA1NC4zODI1MjMsNDMuMjMyMDc5IGMgNC4wMDQxMzEsLTIuOTcwMDExIDYuMDIzNjkyLC00LjMyOTA1NCAxMS4wMjAyMjIsLTMuNDgyNDI5IDQuOTk2NTI5LDAuODQ2NjI1IDEyLjQ4NTg3Niw4LjE3NzQ1NCA2LjE2OTY5NywxMy43MjgzNTEgLTYuMzE2MTc5LDUuNTUwODk0IC0xMi4xMDQ1MzksMS40NzE2NDMgLTE0LjE5NDIzNSwtMS43MjgzOTUgLTEuODU1NDEyLC0yLjg0MTI2NyAtNS4wOTA4MDUsLTYuMjIzNTYgLTIuOTk1Njg0LC04LjUxNzUyNyB6IgogICAgICAgICBpZD0icGF0aDQ1MDUiIC8+CiAgICA8L2c+CiAgICA8ZwogICAgICAgaWQ9InRleHQ0NTAxIgogICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjE3LjczMTgzMDZweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OkFyaWFsOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246QXJpYWw7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LWZlYXR1cmUtc2V0dGluZ3M6bm9ybWFsO3RleHQtYWxpZ246ZW5kO3dyaXRpbmctbW9kZTpsci10Yjt0ZXh0LWFuY2hvcjplbmQ7b3BhY2l0eToxO2ZpbGw6I2U2ZTZlNjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC44NzcxMjM0ODtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBhcmlhLWxhYmVsPSJEVUNLV0VFRCBGUkFNRVdPUksiPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MDkiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDg0Ljc2NDAxNCwzNS43MzkwNjcgYyAtMC4yMTI3ODIsMCAtMC4yODM3MDksMC4wNzA5MyAtMC4yODM3MDksMC4yODM3MDkgdiAxMS44NDQ4NjMgYyAwLDAuMjEyNzgyIDAuMDg4NjYsMC4yODM3MDkgMC4yODM3MDksMC4yODM3MDkgaCA0LjM0NDI5OSBjIDMuNDkzMTcsMCA2LjE3MDY3NywtMi42Nzc1MDYgNi4xNzA2NzcsLTYuMjA2MTQxIDAsLTMuNTI4NjM0IC0yLjY3NzUwNywtNi4yMDYxNCAtNi4xNzA2NzcsLTYuMjA2MTQgeiBtIDQuMzI2NTY3LDEuMjA1NzY0IGMgMi44OTAyODgsMCA0Ljc2OTg2MiwyLjMyMjg3IDQuNzY5ODYyLDUuMDAwMzc2IDAsMi42NTk3NzUgLTEuODc5NTc0LDUuMDAwMzc3IC00Ljc2OTg2Miw1LjAwMDM3NyBIIDg1Ljg4MTExOSBWIDM2Ljk0NDgzMSBaIiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MTEiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDEwMi41MTAyNSw0OC4zODE4NjIgYyAyLjg5MDI5LDAgNS4wMTgxMSwtMS44MDg2NDcgNS4wMTgxMSwtNS4zMzcyODEgdiAtNy4wMjE4MDUgYyAwLC0wLjIxMjc4MiAtMC4wNTMyLC0wLjI4MzcwOSAtMC4yNjU5OCwtMC4yODM3MDkgaCAtMC44NTExMyBjIC0wLjIxMjc4LDAgLTAuMjgzNywwLjA3MDkzIC0wLjI4MzcsMC4yODM3MDkgdiA2LjkzMzE0NiBjIDAsMi45NDM0ODQgLTEuNDg5NDgsNC4xODQ3MTIgLTMuNjE3Myw0LjE4NDcxMiAtMi4xMjc4MiwwIC0zLjYxNzI5MiwtMS4yNDEyMjggLTMuNjE3MjkyLC00LjE4NDcxMiB2IC02LjkzMzE0NiBjIDAsLTAuMjEyNzgyIC0wLjA3MDkzLC0wLjI4MzcwOSAtMC4yODM3MDksLTAuMjgzNzA5IGggLTAuODMzMzk2IGMgLTAuMjEyNzgyLDAgLTAuMjgzNzA5LDAuMDUzMiAtMC4yODM3MDksMC4yODM3MDkgdiA3LjAyMTgwNSBjIDAsMy41Mjg2MzQgMi4xMjc4MTksNS4zMzcyODEgNS4wMTgxMDYsNS4zMzcyODEgeiIgLz4KICAgICAgPHBhdGgKICAgICAgICAgaWQ9InBhdGg0NTEzIgogICAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LWZhbWlseTonQWNoZXJ1cyBHcm90ZXNxdWUnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0FjaGVydXMgR3JvdGVzcXVlJzt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtYW5jaG9yOnN0YXJ0O2ZpbGw6I2U2ZTZlNjtzdHJva2Utd2lkdGg6MC44NzcxMjM0OCIKICAgICAgICAgZD0ibSAxMTYuMTA2OTYsNDcuMTQwNjM0IGMgLTIuNzY2MTYsMCAtNC45Mjk0NCwtMi41MTc5MiAtNC45Mjk0NCwtNS4xOTU0MjcgMCwtMi42Nzc1MDYgMi4xNjMyOCwtNS4xOTU0MjYgNC45Mjk0NCwtNS4xOTU0MjYgMS42NDkwNiwwIDIuOTI1NzYsMC43MjcwMDUgMy43MDU5NiwxLjU2MDQwMSAwLjE0MTg1LDAuMTQxODU1IDAuMjY1OTcsMC4xNDE4NTUgMC40MDc4MywtMC4wMTc3MyBsIDAuNTE0MjIsLTAuNTY3NDE4IGMgMC4xNDE4NiwtMC4xNTk1ODcgMC4xNTk1OSwtMC4yNDgyNDYgMC4wMTc3LC0wLjM5MDEwMSAtMS4xMzQ4MywtMS4xMzQ4MzcgLTIuOTI1NzUsLTEuODI2Mzc4IC00LjY0NTc0LC0xLjgyNjM3OCAtMy40OTMxNywwIC02LjM0Nzk5LDIuOTA4MDIgLTYuMzQ3OTksNi40MzY2NTQgMCwzLjUyODYzNSAyLjg1NDgyLDYuNDM2NjU1IDYuMzQ3OTksNi40MzY2NTUgMS43MTk5OSwwIDMuNTEwOTEsLTAuNjkxNTQxIDQuNjQ1NzQsLTEuODI2Mzc5IDAuMTU5NTksLTAuMTU5NTg2IDAuMTU5NTksLTAuMjQ4MjQ1IDAuMDE3NywtMC40MjU1NjQgbCAtMC41MzE5NiwtMC41Njc0MTggYyAtMC4xMjQxMiwtMC4xMjQxMjMgLTAuMjMwNTEsLTAuMTU5NTg3IC0wLjM5MDEsLTAuMDE3NzMgLTAuODMzNCwwLjg2ODg2IC0yLjA5MjM2LDEuNTk1ODY1IC0zLjc0MTQyLDEuNTk1ODY1IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUxNSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMTI2LjA1MDA5LDQxLjY2MTQ5OCA2LjI0MTYsLTUuNjM4NzIyIGMgMC4xNTk1OSwtMC4xOTUwNSAwLjA3MDksLTAuMjgzNzA5IC0wLjEwNjM5LC0wLjI4MzcwOSBoIC0xLjEzNDg0IGMgLTAuMjEyNzgsMCAtMC4yODM3MSwwLjA3MDkzIC0wLjQ5NjQ5LDAuMjgzNzA5IGwgLTUuNjkxOTEsNS4xNTk5NjMgdiAtNS4xNTk5NjMgYyAwLC0wLjIzMDUxNCAtMC4wNzA5LC0wLjI4MzcwOSAtMC4yODM3MSwtMC4yODM3MDkgaCAtMC44NTExMyBjIC0wLjIxMjc4LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yMTI3ODIgMC4wNzA5LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgaCAwLjg1MTEzIGMgMC4yMTI3OCwwIDAuMjgzNzEsLTAuMDUzMTkgMC4yODM3MSwtMC4yODM3MDkgdiAtNS42NzQxODYgbCA2LjAxMTA5LDUuNjc0MTg2IGMgMC4xOTUwNSwwLjIxMjc4MiAwLjI4MzcxLDAuMjgzNzA5IDAuNDYxMDIsMC4yODM3MDkgaCAxLjIwNTc3IGMgMC4xNTk1OCwwIDAuMjgzNzEsLTAuMDcwOTMgMC4wODg3LC0wLjI4MzcwOSB6IiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MTciCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDEzNS4wNjM5NSwzNi4wMjI3NzYgYyAtMC4wNzA5LC0wLjIxMjc4MiAtMC4xNTk1OCwtMC4yODM3MDkgLTAuMzU0NjMsLTAuMjgzNzA5IGggLTEuMDgxNjQgYyAtMC4xNzczMiwwIC0wLjIxMjc5LDAuMDcwOTMgLTAuMTI0MTMsMC4yODM3MDkgbCA0LjU5MjU1LDEyLjE4MTc2OCBjIDAuMDcwOSwwLjE3NzMxOCAwLjEyNDEyLDAuMjQ4MjQ1IDAuMTk1MDUsMC4yNDgyNDUgaCAwLjEyNDEyIGMgMC4wNzA5LDAgMC4xMjQxMiwtMC4wODg2NiAwLjE5NTA1LC0wLjI0ODI0NSBsIDMuMTIwOCwtMTAuMDUzOTQ4IDMuMTIwOCwxMC4wNTM5NDggYyAwLjA3MDksMC4xNTk1ODYgMC4xMjQxMywwLjI0ODI0NSAwLjE5NTA1LDAuMjQ4MjQ1IGggMC4xMjQxMyBjIDAuMDg4NywwIDAuMTI0MTIsLTAuMDg4NjYgMC4xOTUwNSwtMC4yNDgyNDUgbCA0LjU5MjU0LC0xMi4xODE3NjggYyAwLjA4ODcsLTAuMjEyNzgyIDAuMDUzMiwtMC4yODM3MDkgLTAuMTI0MTIsLTAuMjgzNzA5IGggLTEuMDgxNjQgYyAtMC4xOTUwNSwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMzU0NjQsMC4yODM3MDkgbCAtMy4zNTEzMiw5LjQ1MTA2NiAtMi45Nzg5NCwtOS42ODE1OCBjIC0wLjA3MDksLTAuMTk1MDUgLTAuMTI0MTMsLTAuMjgzNzA5IC0wLjI0ODI1LC0wLjI4MzcwOSBoIC0wLjE3NzMyIGMgLTAuMTI0MTIsMCAtMC4xNzczMiwwLjA4ODY2IC0wLjI0ODI0LDAuMjgzNzA5IGwgLTIuOTc4OTUsOS42ODE1OCB6IiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MTkiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDE2MC4xMDAxOSw0OC4xNTEzNDggYyAwLjIxMjc4LDAgMC4yNjU5NywtMC4wNzA5MyAwLjI2NTk3LC0wLjI4MzcwOSB2IC0wLjY1NjA3OCBjIDAsLTAuMjEyNzgyIC0wLjA1MzIsLTAuMjgzNzA5IC0wLjI2NTk3LC0wLjI4MzcwOSBoIC02Ljc3MzU2IHYgLTQuNDMyOTU4IGggNi40NTQzOCBjIDAuMjEyNzksMCAwLjI4MzcxLC0wLjA3MDkzIDAuMjgzNzEsLTAuMjgzNzA5IHYgLTAuNjU2MDc4IGMgMCwtMC4yMTI3ODIgLTAuMDcwOSwtMC4yODM3MDkgLTAuMjgzNzEsLTAuMjgzNzA5IGggLTYuNDU0MzggdiAtNC4zMDg4MzUgaCA2Ljc3MzU2IGMgMC4xOTUwNSwwIDAuMjY1OTcsLTAuMDcwOTMgMC4yNjU5NywtMC4yODM3MDkgdiAtMC42NTYwNzggYyAwLC0wLjIxMjc4MiAtMC4wNzA5LC0wLjI4MzcwOSAtMC4yNjU5NywtMC4yODM3MDkgaCAtNy44OTA2NyBjIC0wLjIxMjc4LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yMTI3ODIgMC4wNzA5LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgeiIgLz4KICAgICAgPHBhdGgKICAgICAgICAgaWQ9InBhdGg0NTIxIgogICAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LWZhbWlseTonQWNoZXJ1cyBHcm90ZXNxdWUnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0FjaGVydXMgR3JvdGVzcXVlJzt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtYW5jaG9yOnN0YXJ0O2ZpbGw6I2U2ZTZlNjtzdHJva2Utd2lkdGg6MC44NzcxMjM0OCIKICAgICAgICAgZD0ibSAxNzEuMzU1NzUsNDguMTUxMzQ4IGMgMC4yMTI3OCwwIDAuMjY1OTgsLTAuMDcwOTMgMC4yNjU5OCwtMC4yODM3MDkgdiAtMC42NTYwNzggYyAwLC0wLjIxMjc4MiAtMC4wNTMyLC0wLjI4MzcwOSAtMC4yNjU5OCwtMC4yODM3MDkgaCAtNi43NzM1NiB2IC00LjQzMjk1OCBoIDYuNDU0MzkgYyAwLjIxMjc4LDAgMC4yODM3LC0wLjA3MDkzIDAuMjgzNywtMC4yODM3MDkgdiAtMC42NTYwNzggYyAwLC0wLjIxMjc4MiAtMC4wNzA5LC0wLjI4MzcwOSAtMC4yODM3LC0wLjI4MzcwOSBoIC02LjQ1NDM5IHYgLTQuMzA4ODM1IGggNi43NzM1NiBjIDAuMTk1MDUsMCAwLjI2NTk4LC0wLjA3MDkzIDAuMjY1OTgsLTAuMjgzNzA5IHYgLTAuNjU2MDc4IGMgMCwtMC4yMTI3ODIgLTAuMDcwOSwtMC4yODM3MDkgLTAuMjY1OTgsLTAuMjgzNzA5IGggLTcuODkwNjcgYyAtMC4yMTI3OCwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMjgzNzEsMC4yODM3MDkgdiAxMS44NDQ4NjMgYyAwLDAuMjEyNzgyIDAuMDcwOSwwLjI4MzcwOSAwLjI4MzcxLDAuMjgzNzA5IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUyMyIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMTc0Ljc3MzgzLDM1LjczOTA2NyBjIC0wLjIxMjc4LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yMTI3ODIgMC4wODg3LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgaCA0LjM0NDMgYyAzLjQ5MzE3LDAgNi4xNzA2OCwtMi42Nzc1MDYgNi4xNzA2OCwtNi4yMDYxNDEgMCwtMy41Mjg2MzQgLTIuNjc3NTEsLTYuMjA2MTQgLTYuMTcwNjgsLTYuMjA2MTQgeiBtIDQuMzI2NTcsMS4yMDU3NjQgYyAyLjg5MDI5LDAgNC43Njk4NiwyLjMyMjg3IDQuNzY5ODYsNS4wMDAzNzYgMCwyLjY1OTc3NSAtMS44Nzk1Nyw1LjAwMDM3NyAtNC43Njk4Niw1LjAwMDM3NyBoIC0zLjIwOTQ2IFYgMzYuOTQ0ODMxIFoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUyNSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMTkzLjgzMDU3LDQyLjQ5NDg5NCBoIDYuNTk2MjQgYyAwLjIxMjc4LDAgMC4yODM3MSwtMC4wNzA5MyAwLjI4MzcxLC0wLjI4MzcwOSB2IC0wLjY1NjA3OCBjIDAsLTAuMjEyNzgyIC0wLjA3MDksLTAuMjgzNzA5IC0wLjI4MzcxLC0wLjI4MzcwOSBoIC02LjU5NjI0IHYgLTQuMzA4ODM1IGggNi43NTU4MiBjIDAuMTk1MDUsMCAwLjI4MzcxLC0wLjA3MDkzIDAuMjgzNzEsLTAuMjgzNzA5IHYgLTAuNjU2MDc4IGMgMCwtMC4yMTI3ODIgLTAuMDcwOSwtMC4yODM3MDkgLTAuMjgzNzEsLTAuMjgzNzA5IGggLTcuODcyOTMgYyAtMC4yMTI3OCwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMjgzNzEsMC4yODM3MDkgdiAxMS44NDQ4NjMgYyAwLDAuMjEyNzgyIDAuMDcwOSwwLjI4MzcwOSAwLjI4MzcxLDAuMjgzNzA5IGggMC44NTExMyBjIDAuMTk1MDUsMCAwLjI2NTk4LC0wLjA3MDkzIDAuMjY1OTgsLTAuMjgzNzA5IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUyNyIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMjEyLjI5MDIzLDM5LjQ2Mjc1MSBjIDAsLTIuODcyNTU2IC0yLjI4NzQsLTMuNzIzNjg0IC00LjMwODgzLC0zLjcyMzY4NCBoIC00LjIyMDE4IGMgLTAuMjEyNzgsMCAtMC4yODM3MSwwLjA3MDkzIC0wLjI4MzcxLDAuMjgzNzA5IHYgMTEuODQ0ODYzIGMgMCwwLjI0ODI0NSAwLjA3MDksMC4yODM3MDkgMC4yODM3MSwwLjI4MzcwOSBoIDAuODMzNCBjIDAuMjEyNzgsMCAwLjI4MzcxLC0wLjA1MzE5IDAuMjgzNzEsLTAuMjgzNzA5IHYgLTQuNTc0ODEyIGggMy4xNzM5OSBsIDMuMjYyNjYsNC41NzQ4MTIgYyAwLjEyNDEyLDAuMTc3MzE4IDAuMjY1OTgsMC4yODM3MDkgMC40Nzg3NiwwLjI4MzcwOSBoIDAuODMzNCBjIDAuMjEyNzgsMCAwLjM1NDYzLC0wLjEwNjM5MSAwLjIxMjc4LC0wLjMzNjkwNSBsIC0zLjMzMzU5LC00LjY4MTIwMyBjIDEuNjQ5MDcsLTAuNDQzMjk2IDIuNzgzOSwtMS41NjA0MDEgMi43ODM5LC0zLjY3MDQ4OSB6IG0gLTcuNDExOSwyLjYyNDMxMSB2IC01LjE0MjIzMSBoIDMuMDE0NDEgYyAxLjgyNjM4LDAgMy4wMzIxNCwwLjc0NDczNyAzLjAzMjE0LDIuNTE3OTIgMCwxLjYxMzU5NyAtMC45MjIwNSwyLjYyNDMxMSAtMy4wMzIxNCwyLjYyNDMxMSB6IiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MjkiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDIxOS45MTQzNywzNy44NjY4ODYgMi42MDY1OCw1Ljc4MDU3NyBoIC01LjIzMDg5IGwgMi42MDY1OCwtNS43ODA1NzcgeiBtIDAuMjMwNTEsLTIuMTgxMDE1IGMgLTAuMDcwOSwtMC4xNDE4NTQgLTAuMTI0MTIsLTAuMjQ4MjQ1IC0wLjIxMjc4LC0wLjI0ODI0NSBoIC0wLjA1MzIgYyAtMC4xMDYzOSwwIC0wLjE0MTg2LDAuMTA2MzkxIC0wLjIzMDUyLDAuMjQ4MjQ1IGwgLTUuNzgwNTcsMTIuMTgxNzY4IGMgLTAuMDcwOSwwLjE1OTU4NiAwLDAuMjgzNzA5IDAuMTU5NTgsMC4yODM3MDkgaCAxLjAyODQ1IGMgMC4xOTUwNSwwIDAuMjY1OTgsLTAuMDcwOTMgMC4zNzIzNywtMC4yODM3MDkgbCAxLjM4MzA4LC0zLjAxNDQxMSBoIDYuMTg4NDEgbCAxLjM4MzA4LDMuMDE0NDExIGMgMC4xMDYzOSwwLjIxMjc4MiAwLjE3NzMyLDAuMjgzNzA5IDAuMzU0NjQsMC4yODM3MDkgaCAxLjAyODQ1IGMgMC4xNzczMSwwIDAuMjQ4MjQsLTAuMTI0MTIzIDAuMTc3MzEsLTAuMjgzNzA5IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUzMSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMjQwLjI1MDg0LDM4LjYyOTM1NSAxLjAyODQ1LDkuMjM4Mjg0IGMgMC4wMTc3LDAuMjEyNzgyIDAuMDcwOSwwLjI4MzcwOSAwLjI2NTk3LDAuMjgzNzA5IGggMC44Njg4NiBjIDAuMjEyNzgsMCAwLjI4MzcxLC0wLjA4ODY2IDAuMjY1OTgsLTAuMjgzNzA5IGwgLTEuNDg5NDcsLTEyLjE5OTUgYyAtMC4wMTc3LC0wLjEyNDEyMiAtMC4wMzU1LC0wLjE1OTU4NiAtMC4xNTk1OSwtMC4xNTk1ODYgaCAtMC4xMDYzOSBjIC0wLjA3MDksMCAtMC4xMjQxMiwwLjAxNzczIC0wLjIxMjc4LDAuMTU5NTg2IGwgLTUuNjc0MTksMTAuNzI3NzU4IC01LjY3NDE4LC0xMC43Mjc3NTggYyAtMC4wODg3LC0wLjE0MTg1NCAtMC4xNDE4NiwtMC4xNTk1ODYgLTAuMjEyNzksLTAuMTU5NTg2IGggLTAuMTA2MzkgYyAtMC4xMjQxMiwwIC0wLjE0MTg1LDAuMDM1NDYgLTAuMTU5NTgsMC4xNTk1ODYgbCAtMS40ODk0OCwxMi4xOTk1IGMgLTAuMDM1NSwwLjE5NTA1IDAuMDUzMiwwLjI4MzcwOSAwLjI0ODI1LDAuMjgzNzA5IGggMC44Njg4NiBjIDAuMjEyNzgsMCAwLjI0ODI0LC0wLjA3MDkzIDAuMjgzNzEsLTAuMjgzNzA5IGwgMS4wNDYxNywtOS4yMjA1NTIgNC43ODc2LDkuNDUxMDY2IGMgMC4xMjQxMiwwLjE3NzMxOCAwLjE5NTA1LDAuMjgzNzA5IDAuMzM2OSwwLjI4MzcwOSBoIDAuMTQxODYgYyAwLjE0MTg1LDAgMC4yMzA1MSwtMC4xMDYzOTEgMC4zMTkxNywtMC4yODM3MDkgeiIgLz4KICAgICAgPHBhdGgKICAgICAgICAgaWQ9InBhdGg0NTMzIgogICAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LWZhbWlseTonQWNoZXJ1cyBHcm90ZXNxdWUnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0FjaGVydXMgR3JvdGVzcXVlJzt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtYW5jaG9yOnN0YXJ0O2ZpbGw6I2U2ZTZlNjtzdHJva2Utd2lkdGg6MC44NzcxMjM0OCIKICAgICAgICAgZD0ibSAyNTMuNzQ2NDMsNDguMTUxMzQ4IGMgMC4yMTI3OCwwIDAuMjY1OTcsLTAuMDcwOTMgMC4yNjU5NywtMC4yODM3MDkgdiAtMC42NTYwNzggYyAwLC0wLjIxMjc4MiAtMC4wNTMyLC0wLjI4MzcwOSAtMC4yNjU5NywtMC4yODM3MDkgaCAtNi43NzM1NiB2IC00LjQzMjk1OCBoIDYuNDU0MzggYyAwLjIxMjc5LDAgMC4yODM3MSwtMC4wNzA5MyAwLjI4MzcxLC0wLjI4MzcwOSB2IC0wLjY1NjA3OCBjIDAsLTAuMjEyNzgyIC0wLjA3MDksLTAuMjgzNzA5IC0wLjI4MzcxLC0wLjI4MzcwOSBoIC02LjQ1NDM4IHYgLTQuMzA4ODM1IGggNi43NzM1NiBjIDAuMTk1MDUsMCAwLjI2NTk3LC0wLjA3MDkzIDAuMjY1OTcsLTAuMjgzNzA5IHYgLTAuNjU2MDc4IGMgMCwtMC4yMTI3ODIgLTAuMDcwOSwtMC4yODM3MDkgLTAuMjY1OTcsLTAuMjgzNzA5IGggLTcuODkwNjcgYyAtMC4yMTI3OCwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMjgzNzEsMC4yODM3MDkgdiAxMS44NDQ4NjMgYyAwLDAuMjEyNzgyIDAuMDcwOSwwLjI4MzcwOSAwLjI4MzcxLDAuMjgzNzA5IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUzNSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMjU3LjAwNDkyLDM2LjAyMjc3NiBjIC0wLjA3MDksLTAuMjEyNzgyIC0wLjE1OTU4LC0wLjI4MzcwOSAtMC4zNTQ2MywtMC4yODM3MDkgaCAtMS4wODE2NCBjIC0wLjE3NzMyLDAgLTAuMjEyNzksMC4wNzA5MyAtMC4xMjQxMywwLjI4MzcwOSBsIDQuNTkyNTUsMTIuMTgxNzY4IGMgMC4wNzA5LDAuMTc3MzE4IDAuMTI0MTIsMC4yNDgyNDUgMC4xOTUwNSwwLjI0ODI0NSBoIDAuMTI0MTIgYyAwLjA3MDksMCAwLjEyNDEyLC0wLjA4ODY2IDAuMTk1MDUsLTAuMjQ4MjQ1IGwgMy4xMjA4LC0xMC4wNTM5NDggMy4xMjA4MSwxMC4wNTM5NDggYyAwLjA3MDksMC4xNTk1ODYgMC4xMjQxMiwwLjI0ODI0NSAwLjE5NTA1LDAuMjQ4MjQ1IGggMC4xMjQxMiBjIDAuMDg4NywwIDAuMTI0MTIsLTAuMDg4NjYgMC4xOTUwNSwtMC4yNDgyNDUgbCA0LjU5MjU0LC0xMi4xODE3NjggYyAwLjA4ODcsLTAuMjEyNzgyIDAuMDUzMiwtMC4yODM3MDkgLTAuMTI0MTIsLTAuMjgzNzA5IGggLTEuMDgxNjQgYyAtMC4xOTUwNSwwIC0wLjI4MzcxLDAuMDcwOTMgLTAuMzU0NjQsMC4yODM3MDkgbCAtMy4zNTEzMSw5LjQ1MTA2NiAtMi45Nzg5NSwtOS42ODE1OCBjIC0wLjA3MDksLTAuMTk1MDUgLTAuMTI0MTIsLTAuMjgzNzA5IC0wLjI0ODI1LC0wLjI4MzcwOSBoIC0wLjE3NzMyIGMgLTAuMTI0MTIsMCAtMC4xNzczMSwwLjA4ODY2IC0wLjI0ODI0LDAuMjgzNzA5IGwgLTIuOTc4OTUsOS42ODE1OCB6IiAvPgogICAgICA8cGF0aAogICAgICAgICBpZD0icGF0aDQ1MzciCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtZmFtaWx5OidBY2hlcnVzIEdyb3Rlc3F1ZSc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQWNoZXJ1cyBHcm90ZXNxdWUnO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojZTZlNmU2O3N0cm9rZS13aWR0aDowLjg3NzEyMzQ4IgogICAgICAgICBkPSJtIDI3Mi44Nzc5Niw0MS45NDUyMDcgYyAwLDMuNTI4NjM1IDIuODU0ODIsNi40MzY2NTUgNi4zNDc5OSw2LjQzNjY1NSAzLjQ5MzE3LDAgNi4zNDgsLTIuOTA4MDIgNi4zNDgsLTYuNDM2NjU1IDAsLTMuNTI4NjM0IC0yLjg1NDgzLC02LjQzNjY1NCAtNi4zNDgsLTYuNDM2NjU0IC0zLjQ5MzE3LDAgLTYuMzQ3OTksMi45MDgwMiAtNi4zNDc5OSw2LjQzNjY1NCB6IG0gMS40MTg1NCwwIGMgMCwtMi42Nzc1MDYgMi4xNjMyOCwtNS4xOTU0MjYgNC45Mjk0NSwtNS4xOTU0MjYgMi44MDE2MywwIDQuOTI5NDUsMi41MTc5MiA0LjkyOTQ1LDUuMTk1NDI2IDAsMi42NTk3NzUgLTIuMTI3ODIsNS4xOTU0MjcgLTQuOTI5NDUsNS4xOTU0MjcgLTIuNzY2MTcsMCAtNC45Mjk0NSwtMi41MzU2NTIgLTQuOTI5NDUsLTUuMTk1NDI3IHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDUzOSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMjk2LjkzMjAyLDM5LjQ2Mjc1MSBjIDAsLTIuODcyNTU2IC0yLjI4NzQxLC0zLjcyMzY4NCAtNC4zMDg4NCwtMy43MjM2ODQgaCAtNC4yMjAxNyBjIC0wLjIxMjc5LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yNDgyNDUgMC4wNzA5LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgaCAwLjgzMzM5IGMgMC4yMTI3OCwwIDAuMjgzNzEsLTAuMDUzMTkgMC4yODM3MSwtMC4yODM3MDkgdiAtNC41NzQ4MTIgaCAzLjE3NCBsIDMuMjYyNjYsNC41NzQ4MTIgYyAwLjEyNDEyLDAuMTc3MzE4IDAuMjY1OTcsMC4yODM3MDkgMC40Nzg3NiwwLjI4MzcwOSBoIDAuODMzMzkgYyAwLjIxMjc4LDAgMC4zNTQ2NCwtMC4xMDYzOTEgMC4yMTI3OCwtMC4zMzY5MDUgbCAtMy4zMzM1OCwtNC42ODEyMDMgYyAxLjY0OTA2LC0wLjQ0MzI5NiAyLjc4MzksLTEuNTYwNDAxIDIuNzgzOSwtMy42NzA0ODkgeiBtIC03LjQxMTkxLDIuNjI0MzExIHYgLTUuMTQyMjMxIGggMy4wMTQ0MSBjIDEuODI2MzgsMCAzLjAzMjE1LDAuNzQ0NzM3IDMuMDMyMTUsMi41MTc5MiAwLDEuNjEzNTk3IC0wLjkyMjA2LDIuNjI0MzExIC0zLjAzMjE1LDIuNjI0MzExIHoiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGlkPSJwYXRoNDU0MSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6J0FjaGVydXMgR3JvdGVzcXVlJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidBY2hlcnVzIEdyb3Rlc3F1ZSc7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWFuY2hvcjpzdGFydDtmaWxsOiNlNmU2ZTY7c3Ryb2tlLXdpZHRoOjAuODc3MTIzNDgiCiAgICAgICAgIGQ9Im0gMzAyLjY0MTEsNDEuNjYxNDk4IDYuMjQxNjEsLTUuNjM4NzIyIGMgMC4xNTk1OCwtMC4xOTUwNSAwLjA3MDksLTAuMjgzNzA5IC0wLjEwNjM5LC0wLjI4MzcwOSBoIC0xLjEzNDg0IGMgLTAuMjEyNzgsMCAtMC4yODM3MSwwLjA3MDkzIC0wLjQ5NjQ5LDAuMjgzNzA5IGwgLTUuNjkxOTIsNS4xNTk5NjMgdiAtNS4xNTk5NjMgYyAwLC0wLjIzMDUxNCAtMC4wNzA5LC0wLjI4MzcwOSAtMC4yODM3MSwtMC4yODM3MDkgaCAtMC44NTExMyBjIC0wLjIxMjc4LDAgLTAuMjgzNzEsMC4wNzA5MyAtMC4yODM3MSwwLjI4MzcwOSB2IDExLjg0NDg2MyBjIDAsMC4yMTI3ODIgMC4wNzA5LDAuMjgzNzA5IDAuMjgzNzEsMC4yODM3MDkgaCAwLjg1MTEzIGMgMC4yMTI3OCwwIDAuMjgzNzEsLTAuMDUzMTkgMC4yODM3MSwtMC4yODM3MDkgdiAtNS42NzQxODYgbCA2LjAxMTA5LDUuNjc0MTg2IGMgMC4xOTUwNSwwLjIxMjc4MiAwLjI4MzcxLDAuMjgzNzA5IDAuNDYxMDMsMC4yODM3MDkgaCAxLjIwNTc2IGMgMC4xNTk1OSwwIDAuMjgzNzEsLTAuMDcwOTMgMC4wODg3LC0wLjI4MzcwOSB6IiAvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=="

/***/ }),
/* 44 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"title":"title-2Vzar","buttonBar":"buttonBar-3RWL3","tasks":"tasks-mY1lL","task":"task-18Jn4","actionButton":"actionButton-3rOZ_"};

/***/ }),
/* 45 */
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
var css = __webpack_require__(46);
var duckweed = __webpack_require__(5);
var E = __webpack_require__(6);
var init = function (options) { return ({
    created: new Date().getTime(),
    done: options.done || false,
    editing: options.editing || false,
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
})(Action || (Action = {}));
exports.Action = Action;
var actions = (_a = {},
    _a[Action.Toggle] = function (patch, checked) {
        patch(function (model) { return (__assign({}, model, { done: checked, editing: checked ? false : model.editing })); });
    },
    _a[Action.ToggleEditing] = function (patch) {
        patch(function (model) { return (__assign({}, model, { editing: !model.editing })); });
    },
    _a[Action.Update] = function (patch, text) {
        patch(function (model) { return (__assign({}, model, { text: text })); });
    },
    _a[Action.Focus] = function (patch, vnode) {
        vnode.elm.focus();
    },
    _a);
exports.actions = actions;
var view = function (_a) {
    var model = _a.model, act = _a.act, _b = _a.classes, classes = _b === void 0 ? [] : _b, _c = _a.styles, styles = _c === void 0 ? {} : _c;
    return (duckweed.html("div", { class: classes.concat([css.task]), style: Object.assign({}, style, styles), key: model.created },
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
/* 46 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"task":"task-y7fco","toggleDone":"toggleDone-hF3mY","toggleCheckbox":"toggleCheckbox-1F668","toggleDoneLabel":"toggleDoneLabel-16y6c","editBox":"editBox-2Mb0s","text":"text-39h4M","long":"long-dnv71","done":"done-5xpXe","editButton":"editButton-paaFV"};

/***/ }),
/* 47 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 48 */
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
var duckweed = __webpack_require__(5);
var route = __webpack_require__(40);
var navbar = __webpack_require__(49);
// Utility functions
var matchRoute = function (rm, path) { return route.match("/duckweed-tasks", rm.re, path); };
var getMatchingRoute = function (routes, path) {
    if (!routes.length) {
        // tslint:disable:no-console
        console.log("No futher routes found");
        return undefined;
    }
    var _a = __read(routes), current = _a[0], remaining = _a.slice(1);
    var args = matchRoute(current, path);
    if (args === false) {
        return getMatchingRoute(remaining, path) || {
            args: [],
            mod: current.mod,
        };
    }
    return {
        args: args,
        mod: current.mod,
    };
};
var routeTable = [];
var init = function (links, routes, path) {
    if (path === void 0) { path = location.pathname; }
    routeTable = routes ? routes : routeTable;
    var mod = getMatchingRoute(routeTable, path).mod;
    if (!routeTable.length) {
        throw Error("No route definitions found");
    }
    return {
        links: links,
        model: mod.init ? mod.init() : undefined,
        path: location.pathname,
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
        if (!moduleActions) {
            // The module does not define any actions, no point in doing anything
            return;
        }
        var scoped = patch.as(["model"]);
        var action = moduleActions[moduleAction];
        if (action) {
            action.apply(void 0, __spread([scoped], args));
        }
    },
    _a[Action.SwitchRoute] = function (patch, _a) {
        var pathname = _a.pathname;
        var mod = getMatchingRoute(routeTable, pathname).mod;
        patch(function (model) { return (__assign({}, model, { model: mod.init ? mod.init() : undefined, path: location.pathname })); });
    },
    _a[Action.NavbarAction] = function (_, action, path) {
        // Navbar does not need the patcher, so not passing it
        navbar.actions[action](undefined, path);
    },
    _a);
exports.actions = actions;
var view = function (_a) {
    var model = _a.model, act = _a.act;
    var mod = getMatchingRoute(routeTable, model.path).mod;
    return (duckweed.html("div", { route: act(Action.SwitchRoute) },
        duckweed.html(navbar.view, { act: act.as(Action.NavbarAction), links: model.links }),
        duckweed.html(mod.view, { model: model.model, act: act.as(Action.ModuleAction, mod.actions), key: model.path })));
};
exports.view = view;
var _a;


/***/ }),
/* 49 */
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
var css = __webpack_require__(50);
var duckweed = __webpack_require__(5);
var route_1 = __webpack_require__(40);
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
/* 50 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"nav":"nav-mLhoT","link":"link-3zPtL"};

/***/ })
]);
//# sourceMappingURL=0-b735d.js.map