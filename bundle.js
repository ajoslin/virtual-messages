(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./src/init')()

},{"./src/init":71}],2:[function(require,module,exports){
/*!
 * array-last <https://github.com/jonschlinkert/array-last>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

var isNumber = require('is-number');

module.exports = function last(arr, n) {
  if (!Array.isArray(arr)) {
    throw new Error('expected the first argument to be an array');
  }

  var len = arr.length;
  if (len === 0) {
    return null;
  }

  n = isNumber(n) ? +n : 1;
  if (n === 1) {
    return arr[len - 1];
  }

  var res = new Array(n);
  while (n--) {
    res[n] = arr[--len];
  }
  return res;
};

},{"is-number":3}],3:[function(require,module,exports){
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

module.exports = function isNumber(n) {
  return !!(+n) || n === 0 || n === '0';
};

},{}],4:[function(require,module,exports){
'use strict'

module.exports = function assertOk (value, message) {
  if (!value) {
    throw new Error(message || 'Expected true, got ' + value)
  }
}

},{}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
module.exports = function(obj) {
    if (typeof obj === 'string') return camelCase(obj);
    return walk(obj);
};

function walk (obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (isDate(obj) || isRegex(obj)) return obj;
    if (isArray(obj)) return map(obj, walk);
    return reduce(objectKeys(obj), function (acc, key) {
        var camel = camelCase(key);
        acc[camel] = walk(obj[key]);
        return acc;
    }, {});
}

function camelCase(str) {
    return str.replace(/[_.-](\w|$)/g, function (_,x) {
        return x.toUpperCase();
    });
}

var isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

var isDate = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
};

var isRegex = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var has = Object.prototype.hasOwnProperty;
var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) {
        if (has.call(obj, key)) keys.push(key);
    }
    return keys;
};

function map (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
    }
    return res;
}

function reduce (xs, f, acc) {
    if (xs.reduce) return xs.reduce(f, acc);
    for (var i = 0; i < xs.length; i++) {
        acc = f(acc, xs[i], i);
    }
    return acc;
}

},{}],9:[function(require,module,exports){
'use strict'

var assert = require('assert-ok')

module.exports = function createDataUri (options, data) {
  var type = typeof options === 'object'
    ? [options.type, options.charset].filter(Boolean).join(';charset=')
    : options

  assert(typeof type === 'string', 'mime type required')
  assert(data, 'data required')

  return ['data:' + type, 'base64,' + data].join(';')
}

},{"assert-ok":4}],10:[function(require,module,exports){
/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */

/*global window, navigator, document, require, process, module */
(function (app) {
  'use strict';
  var namespace = 'cuid',
    c = 0,
    blockSize = 4,
    base = 36,
    discreteValues = Math.pow(base, blockSize),

    pad = function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
    },

    randomBlock = function randomBlock() {
      return pad((Math.random() *
            discreteValues << 0)
            .toString(base), blockSize);
    },

    safeCounter = function () {
      c = (c < discreteValues) ? c : 0;
      c++; // this is not subliminal
      return c - 1;
    },

    api = function cuid() {
      // Starting with a lowercase letter makes
      // it HTML element ID friendly.
      var letter = 'c', // hard-coded allows for sequential access

        // timestamp
        // warning: this exposes the exact date and time
        // that the uid was created.
        timestamp = (new Date().getTime()).toString(base),

        // Prevent same-machine collisions.
        counter,

        // A few chars to generate distinct ids for different
        // clients (so different computers are far less
        // likely to generate the same id)
        fingerprint = api.fingerprint(),

        // Grab some more chars from Math.random()
        random = randomBlock() + randomBlock();

        counter = pad(safeCounter().toString(base), blockSize);

      return  (letter + timestamp + counter + fingerprint + random);
    };

  api.slug = function slug() {
    var date = new Date().getTime().toString(36),
      counter,
      print = api.fingerprint().slice(0,1) +
        api.fingerprint().slice(-1),
      random = randomBlock().slice(-2);

      counter = safeCounter().toString(36).slice(-4);

    return date.slice(-2) +
      counter + print + random;
  };

  api.globalCount = function globalCount() {
    // We want to cache the results of this
    var cache = (function calc() {
        var i,
          count = 0;

        for (i in window) {
          count++;
        }

        return count;
      }());

    api.globalCount = function () { return cache; };
    return cache;
  };

  api.fingerprint = function browserPrint() {
    return pad((navigator.mimeTypes.length +
      navigator.userAgent.length).toString(36) +
      api.globalCount().toString(36), 4);
  };

  // don't change anything from here down.
  if (app.register) {
    app.register(namespace, api);
  } else if (typeof module !== 'undefined') {
    module.exports = api;
  } else {
    app[namespace] = api;
  }

}(this.applitude || this));

},{}],11:[function(require,module,exports){
var EvStore = require("ev-store")

module.exports = addEvent

function addEvent(target, type, handler) {
    var events = EvStore(target)
    var event = events[type]

    if (!event) {
        events[type] = handler
    } else if (Array.isArray(event)) {
        if (event.indexOf(handler) === -1) {
            event.push(handler)
        }
    } else if (event !== handler) {
        events[type] = [event, handler]
    }
}

},{"ev-store":20}],12:[function(require,module,exports){
var globalDocument = require("global/document")
var EvStore = require("ev-store")
var createStore = require("weakmap-shim/create-store")

var addEvent = require("./add-event.js")
var removeEvent = require("./remove-event.js")
var ProxyEvent = require("./proxy-event.js")

var HANDLER_STORE = createStore()

module.exports = DOMDelegator

function DOMDelegator(document) {
    if (!(this instanceof DOMDelegator)) {
        return new DOMDelegator(document);
    }

    document = document || globalDocument

    this.target = document.documentElement
    this.events = {}
    this.rawEventListeners = {}
    this.globalListeners = {}
}

DOMDelegator.prototype.addEventListener = addEvent
DOMDelegator.prototype.removeEventListener = removeEvent

DOMDelegator.allocateHandle =
    function allocateHandle(func) {
        var handle = new Handle()

        HANDLER_STORE(handle).func = func;

        return handle
    }

DOMDelegator.transformHandle =
    function transformHandle(handle, broadcast) {
        var func = HANDLER_STORE(handle).func

        return this.allocateHandle(function (ev) {
            broadcast(ev, func);
        })
    }

DOMDelegator.prototype.addGlobalEventListener =
    function addGlobalEventListener(eventName, fn) {
        var listeners = this.globalListeners[eventName] || [];
        if (listeners.indexOf(fn) === -1) {
            listeners.push(fn)
        }

        this.globalListeners[eventName] = listeners;
    }

DOMDelegator.prototype.removeGlobalEventListener =
    function removeGlobalEventListener(eventName, fn) {
        var listeners = this.globalListeners[eventName] || [];

        var index = listeners.indexOf(fn)
        if (index !== -1) {
            listeners.splice(index, 1)
        }
    }

DOMDelegator.prototype.listenTo = function listenTo(eventName) {
    if (!(eventName in this.events)) {
        this.events[eventName] = 0;
    }

    this.events[eventName]++;

    if (this.events[eventName] !== 1) {
        return
    }

    var listener = this.rawEventListeners[eventName]
    if (!listener) {
        listener = this.rawEventListeners[eventName] =
            createHandler(eventName, this)
    }

    this.target.addEventListener(eventName, listener, true)
}

DOMDelegator.prototype.unlistenTo = function unlistenTo(eventName) {
    if (!(eventName in this.events)) {
        this.events[eventName] = 0;
    }

    if (this.events[eventName] === 0) {
        throw new Error("already unlistened to event.");
    }

    this.events[eventName]--;

    if (this.events[eventName] !== 0) {
        return
    }

    var listener = this.rawEventListeners[eventName]

    if (!listener) {
        throw new Error("dom-delegator#unlistenTo: cannot " +
            "unlisten to " + eventName)
    }

    this.target.removeEventListener(eventName, listener, true)
}

function createHandler(eventName, delegator) {
    var globalListeners = delegator.globalListeners;
    var delegatorTarget = delegator.target;

    return handler

    function handler(ev) {
        var globalHandlers = globalListeners[eventName] || []

        if (globalHandlers.length > 0) {
            var globalEvent = new ProxyEvent(ev);
            globalEvent.currentTarget = delegatorTarget;
            callListeners(globalHandlers, globalEvent)
        }

        findAndInvokeListeners(ev.target, ev, eventName)
    }
}

function findAndInvokeListeners(elem, ev, eventName) {
    var listener = getListener(elem, eventName)

    if (listener && listener.handlers.length > 0) {
        var listenerEvent = new ProxyEvent(ev);
        listenerEvent.currentTarget = listener.currentTarget
        callListeners(listener.handlers, listenerEvent)

        if (listenerEvent._bubbles) {
            var nextTarget = listener.currentTarget.parentNode
            findAndInvokeListeners(nextTarget, ev, eventName)
        }
    }
}

function getListener(target, type) {
    // terminate recursion if parent is `null`
    if (target === null || typeof target === "undefined") {
        return null
    }

    var events = EvStore(target)
    // fetch list of handler fns for this event
    var handler = events[type]
    var allHandler = events.event

    if (!handler && !allHandler) {
        return getListener(target.parentNode, type)
    }

    var handlers = [].concat(handler || [], allHandler || [])
    return new Listener(target, handlers)
}

function callListeners(handlers, ev) {
    handlers.forEach(function (handler) {
        if (typeof handler === "function") {
            handler(ev)
        } else if (typeof handler.handleEvent === "function") {
            handler.handleEvent(ev)
        } else if (handler.type === "dom-delegator-handle") {
            HANDLER_STORE(handler).func(ev)
        } else {
            throw new Error("dom-delegator: unknown handler " +
                "found: " + JSON.stringify(handlers));
        }
    })
}

function Listener(target, handlers) {
    this.currentTarget = target
    this.handlers = handlers
}

function Handle() {
    this.type = "dom-delegator-handle"
}

},{"./add-event.js":11,"./proxy-event.js":14,"./remove-event.js":15,"ev-store":20,"global/document":23,"weakmap-shim/create-store":64}],13:[function(require,module,exports){
var Individual = require("individual")
var cuid = require("cuid")
var globalDocument = require("global/document")

var DOMDelegator = require("./dom-delegator.js")

var versionKey = "13"
var cacheKey = "__DOM_DELEGATOR_CACHE@" + versionKey
var cacheTokenKey = "__DOM_DELEGATOR_CACHE_TOKEN@" + versionKey
var delegatorCache = Individual(cacheKey, {
    delegators: {}
})
var commonEvents = [
    "blur", "change", "click",  "contextmenu", "dblclick",
    "error","focus", "focusin", "focusout", "input", "keydown",
    "keypress", "keyup", "load", "mousedown", "mouseup",
    "resize", "select", "submit", "touchcancel",
    "touchend", "touchstart", "unload"
]

/*  Delegator is a thin wrapper around a singleton `DOMDelegator`
        instance.

    Only one DOMDelegator should exist because we do not want
        duplicate event listeners bound to the DOM.

    `Delegator` will also `listenTo()` all events unless
        every caller opts out of it
*/
module.exports = Delegator

function Delegator(opts) {
    opts = opts || {}
    var document = opts.document || globalDocument

    var cacheKey = document[cacheTokenKey]

    if (!cacheKey) {
        cacheKey =
            document[cacheTokenKey] = cuid()
    }

    var delegator = delegatorCache.delegators[cacheKey]

    if (!delegator) {
        delegator = delegatorCache.delegators[cacheKey] =
            new DOMDelegator(document)
    }

    if (opts.defaultEvents !== false) {
        for (var i = 0; i < commonEvents.length; i++) {
            delegator.listenTo(commonEvents[i])
        }
    }

    return delegator
}

Delegator.allocateHandle = DOMDelegator.allocateHandle;
Delegator.transformHandle = DOMDelegator.transformHandle;

},{"./dom-delegator.js":12,"cuid":10,"global/document":23,"individual":24}],14:[function(require,module,exports){
var inherits = require("inherits")

var ALL_PROPS = [
    "altKey", "bubbles", "cancelable", "ctrlKey",
    "eventPhase", "metaKey", "relatedTarget", "shiftKey",
    "target", "timeStamp", "type", "view", "which"
]
var KEY_PROPS = ["char", "charCode", "key", "keyCode"]
var MOUSE_PROPS = [
    "button", "buttons", "clientX", "clientY", "layerX",
    "layerY", "offsetX", "offsetY", "pageX", "pageY",
    "screenX", "screenY", "toElement"
]

var rkeyEvent = /^key|input/
var rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/

module.exports = ProxyEvent

function ProxyEvent(ev) {
    if (!(this instanceof ProxyEvent)) {
        return new ProxyEvent(ev)
    }

    if (rkeyEvent.test(ev.type)) {
        return new KeyEvent(ev)
    } else if (rmouseEvent.test(ev.type)) {
        return new MouseEvent(ev)
    }

    for (var i = 0; i < ALL_PROPS.length; i++) {
        var propKey = ALL_PROPS[i]
        this[propKey] = ev[propKey]
    }

    this._rawEvent = ev
    this._bubbles = false;
}

ProxyEvent.prototype.preventDefault = function () {
    this._rawEvent.preventDefault()
}

ProxyEvent.prototype.startPropagation = function () {
    this._bubbles = true;
}

function MouseEvent(ev) {
    for (var i = 0; i < ALL_PROPS.length; i++) {
        var propKey = ALL_PROPS[i]
        this[propKey] = ev[propKey]
    }

    for (var j = 0; j < MOUSE_PROPS.length; j++) {
        var mousePropKey = MOUSE_PROPS[j]
        this[mousePropKey] = ev[mousePropKey]
    }

    this._rawEvent = ev
}

inherits(MouseEvent, ProxyEvent)

function KeyEvent(ev) {
    for (var i = 0; i < ALL_PROPS.length; i++) {
        var propKey = ALL_PROPS[i]
        this[propKey] = ev[propKey]
    }

    for (var j = 0; j < KEY_PROPS.length; j++) {
        var keyPropKey = KEY_PROPS[j]
        this[keyPropKey] = ev[keyPropKey]
    }

    this._rawEvent = ev
}

inherits(KeyEvent, ProxyEvent)

},{"inherits":25}],15:[function(require,module,exports){
var EvStore = require("ev-store")

module.exports = removeEvent

function removeEvent(target, type, handler) {
    var events = EvStore(target)
    var event = events[type]

    if (!event) {
        return
    } else if (Array.isArray(event)) {
        var index = event.indexOf(handler)
        if (index !== -1) {
            event.splice(index, 1)
        }
    } else if (event === handler) {
        events[type] = null
    }
}

},{"ev-store":20}],16:[function(require,module,exports){
'use strict'

var extend = require('xtend')
var Struct = require('observ-struct')
var Observ = require('observ')
var Delegator = require('dom-delegator')
var mapValues = require('map-values')
var isObject = require('is-obj')

module.exports = function State (state) {
  var copy = extend(state)
  var $channels = copy.channels

  if ($channels) {
    copy.channels = Observ(null)
  }

  var observable = Struct(copy)

  if ($channels) {
    observable.channels.set(channels($channels, observable))
  }

  observable.set = protectSet(observable)

  return observable
}

function channels (fns, context) {
  fns = mapValues(fns, function createHandle (fn) {
    return Delegator.allocateHandle(fn.bind(null, context))
  })

  Object.defineProperty(fns, 'toJSON', {
    value: noop,
    writable: true,
    configurable: true,
    enumerable: false
  })

  return fns
}

function protectSet (observable) {
  var set = observable.set
  return function setState (value) {
    if (isObject(value) && observable.channels) {
      value.channels = observable.channels()
    }
    return set(value)
  }
}

function noop () {}

},{"dom-delegator":13,"is-obj":27,"map-values":30,"observ":33,"observ-struct":31,"xtend":17}],17:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],18:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],19:[function(require,module,exports){
var camelize = require("camelize")
var template = require("string-template")
var extend = require("xtend/mutable")

module.exports = TypedError

function TypedError(args) {
    if (!args) {
        throw new Error("args is required");
    }
    if (!args.type) {
        throw new Error("args.type is required");
    }
    if (!args.message) {
        throw new Error("args.message is required");
    }

    var message = args.message

    if (args.type && !args.name) {
        var errorName = camelize(args.type) + "Error"
        args.name = errorName[0].toUpperCase() + errorName.substr(1)
    }

    extend(createError, args);
    createError._name = args.name;

    return createError;

    function createError(opts) {
        var result = new Error()

        Object.defineProperty(result, "type", {
            value: result.type,
            enumerable: true,
            writable: true,
            configurable: true
        })

        var options = extend({}, args, opts)

        extend(result, options)
        result.message = template(message, options)

        return result
    }
}


},{"camelize":8,"string-template":36,"xtend/mutable":18}],20:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":22}],21:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],22:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":21}],23:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"min-document":5}],24:[function(require,module,exports){
(function (global){
var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual

function Individual(key, value) {
    if (root[key]) {
        return root[key]
    }

    Object.defineProperty(root, key, {
        value: value
        , configurable: true
    })

    return value
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],25:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],26:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],27:[function(require,module,exports){
'use strict';
module.exports = function (x) {
	var type = typeof x;
	return x !== null && (type === 'object' || type === 'function');
};

},{}],28:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],29:[function(require,module,exports){
var raf = require("raf")
var TypedError = require("error/typed")

var InvalidUpdateInRender = TypedError({
    type: "main-loop.invalid.update.in-render",
    message: "main-loop: Unexpected update occurred in loop.\n" +
        "We are currently rendering a view, " +
            "you can't change state right now.\n" +
        "The diff is: {stringDiff}.\n" +
        "SUGGESTED FIX: find the state mutation in your view " +
            "or rendering function and remove it.\n" +
        "The view should not have any side effects.\n",
    diff: null,
    stringDiff: null
})

module.exports = main

function main(initialState, view, opts) {
    opts = opts || {}

    var currentState = initialState
    var create = opts.create
    var diff = opts.diff
    var patch = opts.patch
    var redrawScheduled = false

    var tree = opts.initialTree || view(currentState)
    var target = opts.target || create(tree, opts)
    var inRenderingTransaction = false

    currentState = null

    var loop = {
        state: initialState,
        target: target,
        update: update
    }
    return loop

    function update(state) {
        if (inRenderingTransaction) {
            throw InvalidUpdateInRender({
                diff: state._diff,
                stringDiff: JSON.stringify(state._diff)
            })
        }

        if (currentState === null && !redrawScheduled) {
            redrawScheduled = true
            raf(redraw)
        }

        currentState = state
        loop.state = state
    }

    function redraw() {
        redrawScheduled = false
        if (currentState === null) {
            return
        }

        inRenderingTransaction = true
        var newTree = view(currentState)

        if (opts.createOnly) {
            inRenderingTransaction = false
            create(newTree, opts)
        } else {
            var patches = diff(tree, newTree, opts)
            inRenderingTransaction = false
            target = patch(target, patches, opts)
        }

        tree = newTree
        currentState = null
    }
}

},{"error/typed":19,"raf":35}],30:[function(require,module,exports){
"use strict";

var hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function(obj, map) {
	var result = {};
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) {
			result[key] = map(obj[key], key, obj);
		}
	}
	return result;
};

},{}],31:[function(require,module,exports){
var Observ = require("observ")
var extend = require("xtend")

var blackList = {
    "length": "Clashes with `Function.prototype.length`.\n",
    "name": "Clashes with `Function.prototype.name`.\n",
    "_diff": "_diff is reserved key of observ-struct.\n",
    "_type": "_type is reserved key of observ-struct.\n",
    "_version": "_version is reserved key of observ-struct.\n"
}
var NO_TRANSACTION = {}

function setNonEnumerable(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    })
}

/* ObservStruct := (Object<String, Observ<T>>) =>
    Object<String, Observ<T>> &
        Observ<Object<String, T> & {
            _diff: Object<String, Any>
        }>

*/
module.exports = ObservStruct

function ObservStruct(struct) {
    var keys = Object.keys(struct)

    var initialState = {}
    var currentTransaction = NO_TRANSACTION
    var nestedTransaction = NO_TRANSACTION

    keys.forEach(function (key) {
        if (blackList.hasOwnProperty(key)) {
            throw new Error("cannot create an observ-struct " +
                "with a key named '" + key + "'.\n" +
                blackList[key]);
        }

        var observ = struct[key]
        initialState[key] = typeof observ === "function" ?
            observ() : observ
    })

    var obs = Observ(initialState)
    keys.forEach(function (key) {
        var observ = struct[key]
        obs[key] = observ

        if (typeof observ === "function") {
            observ(function (value) {
                if (nestedTransaction === value) {
                    return
                }

                var state = extend(obs())
                state[key] = value
                var diff = {}
                diff[key] = value && value._diff ?
                    value._diff : value

                setNonEnumerable(state, "_diff", diff)
                currentTransaction = state
                obs.set(state)
                currentTransaction = NO_TRANSACTION
            })
        }
    })
    var _set = obs.set
    obs.set = function trackDiff(value) {
        if (currentTransaction === value) {
            return _set(value)
        }

        var newState = extend(value)
        setNonEnumerable(newState, "_diff", value)
        _set(newState)
    }

    obs(function (newState) {
        if (currentTransaction === newState) {
            return
        }

        keys.forEach(function (key) {
            var observ = struct[key]
            var newObservValue = newState[key]

            if (typeof observ === "function" &&
                observ() !== newObservValue
            ) {
                nestedTransaction = newObservValue
                observ.set(newState[key])
                nestedTransaction = NO_TRANSACTION
            }
        })
    })

    obs._type = "observ-struct"
    obs._version = "5"

    return obs
}

},{"observ":33,"xtend":32}],32:[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],33:[function(require,module,exports){
module.exports = Observable

function Observable(value) {
    var listeners = []
    value = value === undefined ? null : value

    observable.set = function (v) {
        value = v
        listeners.forEach(function (f) {
            f(v)
        })
    }

    return observable

    function observable(listener) {
        if (!listener) {
            return value
        }

        listeners.push(listener)

        return function remove() {
            listeners.splice(listeners.indexOf(listener), 1)
        }
    }
}

},{}],34:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.6.3
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

/*

*/

}).call(this,require('_process'))

},{"_process":7}],35:[function(require,module,exports){
var now = require('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]
  , isNative = true

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  isNative = false

  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  if(!isNative) {
    return raf.call(global, fn)
  }
  return raf.call(global, function() {
    try{
      fn.apply(this, arguments)
    } catch(e) {
      setTimeout(function() { throw e }, 0)
    }
  })
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":34}],36:[function(require,module,exports){
var nargs = /\{([0-9a-zA-Z]+)\}/g
var slice = Array.prototype.slice

module.exports = template

function template(string) {
    var args

    if (arguments.length === 2 && typeof arguments[1] === "object") {
        args = arguments[1]
    } else {
        args = slice.call(arguments, 1)
    }

    if (!args || !args.hasOwnProperty) {
        args = {}
    }

    return string.replace(nargs, function replaceArg(match, i, index) {
        var result

        if (string[index - 1] === "{" &&
            string[index + match.length] === "}") {
            return i
        } else {
            result = args.hasOwnProperty(i) ? args[i] : null
            if (result === null || result === undefined) {
                return ""
            }

            return result
        }
    })
}

},{}],37:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":43}],38:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":63}],39:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":50}],40:[function(require,module,exports){
var diff = require("./diff.js")
var patch = require("./patch.js")
var h = require("./h.js")
var create = require("./create-element.js")
var VNode = require('./vnode/vnode.js')
var VText = require('./vnode/vtext.js')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}

},{"./create-element.js":37,"./diff.js":38,"./h.js":39,"./patch.js":41,"./vnode/vnode.js":59,"./vnode/vtext.js":61}],41:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":46}],42:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":54,"is-object":28}],43:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":52,"../vnode/is-vnode.js":55,"../vnode/is-vtext.js":56,"../vnode/is-widget.js":57,"./apply-properties":42,"global/document":23}],44:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],45:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":57,"../vnode/vpatch.js":60,"./apply-properties":42,"./update-widget":47}],46:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":43,"./dom-index":44,"./patch-op":45,"global/document":23,"x-is-array":66}],47:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":57}],48:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":20}],49:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],50:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":53,"../vnode/is-vhook":54,"../vnode/is-vnode":55,"../vnode/is-vtext":56,"../vnode/is-widget":57,"../vnode/vnode.js":59,"../vnode/vtext.js":61,"./hooks/ev-hook.js":48,"./hooks/soft-set-hook.js":49,"./parse-tag.js":51,"x-is-array":66}],51:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":6}],52:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":53,"./is-vnode":55,"./is-vtext":56,"./is-widget":57}],53:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],54:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],55:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":58}],56:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":58}],57:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],58:[function(require,module,exports){
module.exports = "2"

},{}],59:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":53,"./is-vhook":54,"./is-vnode":55,"./is-widget":57,"./version":58}],60:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":58}],61:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":58}],62:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":54,"is-object":28}],63:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":52,"../vnode/is-thunk":53,"../vnode/is-vnode":55,"../vnode/is-vtext":56,"../vnode/is-widget":57,"../vnode/vpatch":60,"./diff-props":62,"x-is-array":66}],64:[function(require,module,exports){
var hiddenStore = require('./hidden-store.js');

module.exports = createStore;

function createStore() {
    var key = {};

    return function (obj) {
        if ((typeof obj !== 'object' || obj === null) &&
            typeof obj !== 'function'
        ) {
            throw new Error('Weakmap-shim: Key must be object')
        }

        var store = obj.valueOf(key);
        return store && store.identity === key ?
            store : hiddenStore(obj, key);
    };
}

},{"./hidden-store.js":65}],65:[function(require,module,exports){
module.exports = hiddenStore;

function hiddenStore(obj, key) {
    var store = { identity: key };
    var valueOf = obj.valueOf;

    Object.defineProperty(obj, "valueOf", {
        value: function (value) {
            return value !== key ?
                valueOf.apply(this, arguments) : store;
        },
        writable: true
    });

    return store;
}

},{}],66:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],67:[function(require,module,exports){
var State = require('dover')
var h = require('virtual-dom/h')
var sf = 0
var Header = require('../header')
var Messages = require('../messages')

var sheet = ((require('insert-css')("._b2ad99b3 {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  min-height: 100%;\n  font-family: Helvetica Neue;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL2FwcC9zcmMvY29tcG9uZW50cy9hcHAvaW5kZXguY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UscUJBQWM7RUFBZCxzQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLDZCQUF1QjtFQUF2Qiw4QkFBdUI7RUFBdkIsK0JBQXVCO01BQXZCLDJCQUF1QjtVQUF2Qix1QkFBdUI7RUFDdkIsaUJBQWlCO0VBQ2pCLDRCQUE0QjtDQUM3QiIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIG1pbi1oZWlnaHQ6IDEwMCU7XG4gIGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2EgTmV1ZTtcbn0iXX0= */") || true) && "_b2ad99b3")

module.exports = App

function App (data) {
  data = data || {}

  return State({
    header: Header(),
    messages: Messages({list: data.messages})
  })
}

App.render = function render (state) {
  return h('div', {className: sheet}, [
    Header.render(state.header),
    Messages.render(state.messages)
  ])
}

},{"../header":68,"../messages":69,"dover":16,"insert-css":26,"virtual-dom/h":39}],68:[function(require,module,exports){
var State = require('dover')
var Observ = require('observ')
var h = require('virtual-dom/h')
var sf = 0

var sheet = ((require('insert-css')("._06f559c3 {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  height: 40px;\n  -webkit-flex-shrink: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n  text-align: center;\n  border-bottom: 1px solid #eee;\n}\n\n._06f559c3 h1 {\n  font-size: 24px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL2hlYWRlci9zcmMvY29tcG9uZW50cy9oZWFkZXIvaW5kZXguY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UscUJBQWM7RUFBZCxzQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLDBCQUFvQjtFQUFwQiw0QkFBb0I7TUFBcEIsdUJBQW9CO1VBQXBCLG9CQUFvQjtFQUNwQix5QkFBd0I7RUFBeEIsZ0NBQXdCO01BQXhCLHNCQUF3QjtVQUF4Qix3QkFBd0I7RUFDeEIsYUFBYTtFQUNiLHVCQUFlO01BQWYscUJBQWU7VUFBZixlQUFlO0VBQ2YsbUJBQW1CO0VBQ25CLDhCQUE4QjtDQUMvQjs7QUFFRDtFQUNFLGdCQUFnQjtDQUNqQiIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBoZWlnaHQ6IDQwcHg7XG4gIGZsZXgtc2hyaW5rOiAwO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZWVlO1xufVxuXG5oMSB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbn0iXX0= */") || true) && "_06f559c3")

module.exports = Header

function Header (data) {
  data = data || {}

  return State({
    title: Observ(data.title || 'Messages')
  })
}

Header.render = function render (state) {
  return h('header', {className: sheet}, [
    h('h1.title', state.title)
  ])
}

},{"dover":16,"insert-css":26,"observ":33,"virtual-dom/h":39}],69:[function(require,module,exports){
var State = require('dover')
var Observ = require('observ')
var sf = 0
var h = require('virtual-dom/h')
var last = require('array-last')
var Scroll = require('../scroll')

var sheet = ((require('insert-css')("\n._7908889d .conversation {\n  padding: 8px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  height: 64px;\n}\n\n._7908889d img {\n  border-radius: 50%;\n  border: 1px solid #eee;\n  height: 48px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL21lc3NhZ2VzL3NyYy9jb21wb25lbnRzL21lc3NhZ2VzL2luZGV4LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7RUFDRSxhQUFhO0VBQ2IscUJBQWM7RUFBZCxzQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLGFBQWE7Q0FDZDs7QUFFRDtFQUNFLG1CQUFtQjtFQUNuQix1QkFBdUI7RUFDdkIsYUFBYTtDQUNkIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLmNvbnZlcnNhdGlvbiB7XG4gIHBhZGRpbmc6IDhweDtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiA2NHB4O1xufVxuXG5pbWcge1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlZWU7XG4gIGhlaWdodDogNDhweDtcbn0iXX0= */") || true) && "_7908889d")

module.exports = Messages

function Messages (data) {
  data = data || {}

  return State({
    list: Observ(data.list || [])
  })
}

Messages.render = function render (state) {
  return Scroll.render(
    h('div', {className: sheet}, state.list.map(renderMessage))
  )
}

function renderMessage (conversation) {
  var message = last(conversation.messages)

  return h('conversation', {className: sheet}, [
    h('img', {
      src: conversation.with.photo
    }),
    h('container', [
      h('top', [
        h('name', conversation.with.firstName + ' ' + conversation.with.lastName),
        h('time', '12:42'),
        h('arrow')
      ]),
      h('summary', message ? message.text : 'Summary here!')
    ])
  ])
}

},{"../scroll":70,"array-last":2,"dover":16,"insert-css":26,"observ":33,"virtual-dom/h":39}],70:[function(require,module,exports){
var h = require('virtual-dom/h')
var sf = 0

var sheet = ((require('insert-css')("._f28e9e9b {\n  height: 100%;\n  overflow-y: scroll;\n  -webkit-overflow-scrolling: touch;\n  will-change: transform;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb21wb25lbnRzL3Njcm9sbC9zcmMvY29tcG9uZW50cy9zY3JvbGwvaW5kZXguY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixrQ0FBa0M7RUFDbEMsdUJBQXVCO0NBQ3hCIiwiZmlsZSI6InRvLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvdmVyZmxvdy15OiBzY3JvbGw7XG4gIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcbiAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcbn0iXX0= */") || true) && "_f28e9e9b")

exports.render = function render (content) {
  return h('scroll', {className: sheet}, content)
}

},{"insert-css":26,"virtual-dom/h":39}],71:[function(require,module,exports){
var Delegator = require('dom-delegator')
var vdom = require('virtual-dom')
var mainLoop = require('main-loop')
var sf = 0
var cuid = require('cuid')
var DataUri = require('create-data-uri')

var photos = require('./photos')
var messages = require('./messages.json')
var App = require('./components/app')

// Unique ids for all mock data
messages.forEach(prepareData)

module.exports = function init () {
  var reset = ((require('insert-css')("/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nol, ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9yZXNldC5jc3Mvbm9kZV9tb2R1bGVzL3Jlc2V0LmNzcy9yZXNldC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztFQUdFOztBQUVGOzs7Ozs7Ozs7Ozs7O0NBYUMsVUFBVTtDQUNWLFdBQVc7Q0FDWCxVQUFVO0NBQ1YsZ0JBQWdCO0NBQ2hCLGNBQWM7Q0FDZCx5QkFBeUI7Q0FDekI7QUFDRCxpREFBaUQ7QUFDakQ7O0NBRUMsZUFBZTtDQUNmO0FBQ0Q7Q0FDQyxlQUFlO0NBQ2Y7QUFDRDtDQUNDLGlCQUFpQjtDQUNqQjtBQUNEO0NBQ0MsYUFBYTtDQUNiO0FBQ0Q7O0NBRUMsWUFBWTtDQUNaLGNBQWM7Q0FDZDtBQUNEO0NBQ0MsMEJBQTBCO0NBQzFCLGtCQUFrQjtDQUNsQiIsImZpbGUiOiJ0by5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBodHRwOi8vbWV5ZXJ3ZWIuY29tL2VyaWMvdG9vbHMvY3NzL3Jlc2V0LyBcbiAgIHYyLjAgfCAyMDExMDEyNlxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcbiovXG5cbmh0bWwsIGJvZHksIGRpdiwgc3BhbiwgYXBwbGV0LCBvYmplY3QsIGlmcmFtZSxcbmgxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIHAsIGJsb2NrcXVvdGUsIHByZSxcbmEsIGFiYnIsIGFjcm9ueW0sIGFkZHJlc3MsIGJpZywgY2l0ZSwgY29kZSxcbmRlbCwgZGZuLCBlbSwgaW1nLCBpbnMsIGtiZCwgcSwgcywgc2FtcCxcbnNtYWxsLCBzdHJpa2UsIHN0cm9uZywgc3ViLCBzdXAsIHR0LCB2YXIsXG5iLCB1LCBpLCBjZW50ZXIsXG5kbCwgZHQsIGRkLCBvbCwgdWwsIGxpLFxuZmllbGRzZXQsIGZvcm0sIGxhYmVsLCBsZWdlbmQsXG50YWJsZSwgY2FwdGlvbiwgdGJvZHksIHRmb290LCB0aGVhZCwgdHIsIHRoLCB0ZCxcbmFydGljbGUsIGFzaWRlLCBjYW52YXMsIGRldGFpbHMsIGVtYmVkLCBcbmZpZ3VyZSwgZmlnY2FwdGlvbiwgZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgXG5tZW51LCBuYXYsIG91dHB1dCwgcnVieSwgc2VjdGlvbiwgc3VtbWFyeSxcbnRpbWUsIG1hcmssIGF1ZGlvLCB2aWRlbyB7XG5cdG1hcmdpbjogMDtcblx0cGFkZGluZzogMDtcblx0Ym9yZGVyOiAwO1xuXHRmb250LXNpemU6IDEwMCU7XG5cdGZvbnQ6IGluaGVyaXQ7XG5cdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cbi8qIEhUTUw1IGRpc3BsYXktcm9sZSByZXNldCBmb3Igb2xkZXIgYnJvd3NlcnMgKi9cbmFydGljbGUsIGFzaWRlLCBkZXRhaWxzLCBmaWdjYXB0aW9uLCBmaWd1cmUsIFxuZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBzZWN0aW9uIHtcblx0ZGlzcGxheTogYmxvY2s7XG59XG5ib2R5IHtcblx0bGluZS1oZWlnaHQ6IDE7XG59XG5vbCwgdWwge1xuXHRsaXN0LXN0eWxlOiBub25lO1xufVxuYmxvY2txdW90ZSwgcSB7XG5cdHF1b3Rlczogbm9uZTtcbn1cbmJsb2NrcXVvdGU6YmVmb3JlLCBibG9ja3F1b3RlOmFmdGVyLFxucTpiZWZvcmUsIHE6YWZ0ZXIge1xuXHRjb250ZW50OiAnJztcblx0Y29udGVudDogbm9uZTtcbn1cbnRhYmxlIHtcblx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcblx0Ym9yZGVyLXNwYWNpbmc6IDA7XG59Il19 */") || true) && "_ba1d59b0")

  Delegator()

  var state = App({
    messages: messages
  })
  var loop = mainLoop(state(), App.render, vdom)
  var root = document.getElementById('app')

  root.appendChild(loop.target)
  root.classList.add(reset)

  state(loop.update)

  return state
}


function prepareData (conversation, index) {
  conversation.id = cuid()
  conversation.with.photo = DataUri('image/jpeg', photos[index])
  conversation.messages = conversation.messages || []
  conversation.messages.forEach(function (message) {
    message.id = cuid()
  })
}

},{"./components/app":67,"./messages.json":72,"./photos":73,"create-data-uri":9,"cuid":10,"dom-delegator":13,"insert-css":26,"main-loop":29,"virtual-dom":40}],72:[function(require,module,exports){
module.exports=[
  {
    "with": {
      "firstName": "Jordon",
      "lastName": "Silva"
    },
    "messages": [{
      "me": false,
      "text": "Hey did you have dinner plans for tonight? I was thinking we go to the Crafter."
    }, {
      "me": true,
      "text": "I don't know man, that sounds really crazy."
    }, {
      "me": true,
      "text": "How about we just go to the other place instead?"
    }, {
      "me": false,
      "text": "That's dumb. The Crafter is where it's at. Remember how last time we saw all that cool stuff there? We saw the fireworks."
    }, {
      "me": false,
      "text": "We even saw Zuckerberg there -- Zuck knows where it's at, dude. I know he wears the same T-Shirt every day, but he knows his food. You should really go."
    }, {
      "me": true,
      "text": "Zuck is super lame. And you are too for liking his taste in food."
    }]
  },
  {
    "with": {
      "firstName": "Lawerence",
      "lastName": "Morgan"
    },
  },
  {
    "with": {
      "firstName": "Trula",
      "lastName": "Ramirez"
    },
  },
  {
    "with": {
      "firstName": "Melda",
      "lastName": "Young"
    },
  },
  {
    "with": {
      "firstName": "Emerita",
      "lastName": "Blake"
    },
  },
  {
    "with": {
      "firstName": "Shenita",
      "lastName": "Day"
    },
  },
  {
    "with": {
      "firstName": "Tesha",
      "lastName": "Fowler"
    },
  },
  {
    "with": {
      "firstName": "Josiah",
      "lastName": "Murphy"
    },
  },
  {
    "with": {
      "firstName": "Delpha",
      "lastName": "Hansen"
    },
  },
  {
    "with": {
      "firstName": "Jefferey",
      "lastName": "Freeman"
    },
  },
  {
    "with": {
      "firstName": "Larry",
      "lastName": "Kennedy"
    },
  },
  {
    "with": {
      "firstName": "Brett",
      "lastName": "Chavez"
    },
  },
  {
    "with": {
      "firstName": "Exie",
      "lastName": "Robertson"
    },
  },
  {
    "with": {
      "firstName": "Berry",
      "lastName": "Green"
    },
  },
  {
    "with": {
      "firstName": "Margareta",
      "lastName": "Wise"
    }
  }
]

},{}],73:[function(require,module,exports){


module.exports = [
  "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"
]

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbml0LmpzIiwibm9kZV9tb2R1bGVzL2FycmF5LWxhc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXJyYXktbGFzdC9ub2RlX21vZHVsZXMvaXMtbnVtYmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Fzc2VydC1vay9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXJlc29sdmUvZW1wdHkuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1zcGxpdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvY2FtZWxpemUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY3JlYXRlLWRhdGEtdXJpL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2N1aWQvZGlzdC9icm93c2VyLWN1aWQuanMiLCJub2RlX21vZHVsZXMvZG9tLWRlbGVnYXRvci9hZGQtZXZlbnQuanMiLCJub2RlX21vZHVsZXMvZG9tLWRlbGVnYXRvci9kb20tZGVsZWdhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2RvbS1kZWxlZ2F0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZG9tLWRlbGVnYXRvci9wcm94eS1ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb20tZGVsZWdhdG9yL3JlbW92ZS1ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb3Zlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb3Zlci9ub2RlX21vZHVsZXMveHRlbmQvaW1tdXRhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2Vycm9yL25vZGVfbW9kdWxlcy94dGVuZC9tdXRhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2Vycm9yL3R5cGVkLmpzIiwibm9kZV9tb2R1bGVzL2V2LXN0b3JlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2V2LXN0b3JlL25vZGVfbW9kdWxlcy9pbmRpdmlkdWFsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2V2LXN0b3JlL25vZGVfbW9kdWxlcy9pbmRpdmlkdWFsL29uZS12ZXJzaW9uLmpzIiwibm9kZV9tb2R1bGVzL2dsb2JhbC9kb2N1bWVudC5qcyIsIm5vZGVfbW9kdWxlcy9pbmRpdmlkdWFsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaW5zZXJ0LWNzcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1vYmovaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtb2JqZWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21haW4tbG9vcC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXAtdmFsdWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29ic2Vydi1zdHJ1Y3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JzZXJ2LXN0cnVjdC9ub2RlX21vZHVsZXMveHRlbmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JzZXJ2L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BlcmZvcm1hbmNlLW5vdy9saWIvcGVyZm9ybWFuY2Utbm93LmpzIiwibm9kZV9tb2R1bGVzL3JhZi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdHJpbmctdGVtcGxhdGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdmlydHVhbC1kb20vY3JlYXRlLWVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvdmlydHVhbC1kb20vZGlmZi5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS9oLmpzIiwibm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3BhdGNoLmpzIiwibm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3Zkb20vYXBwbHktcHJvcGVydGllcy5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92ZG9tL2NyZWF0ZS1lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3Zkb20vZG9tLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3Zkb20vcGF0Y2gtb3AuanMiLCJub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdmRvbS9wYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92ZG9tL3VwZGF0ZS13aWRnZXQuanMiLCJub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdmlydHVhbC1oeXBlcnNjcmlwdC9ob29rcy9ldi1ob29rLmpzIiwibm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3ZpcnR1YWwtaHlwZXJzY3JpcHQvaG9va3Mvc29mdC1zZXQtaG9vay5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92aXJ0dWFsLWh5cGVyc2NyaXB0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3ZpcnR1YWwtaHlwZXJzY3JpcHQvcGFyc2UtdGFnLmpzIiwibm9kZV9tb2R1bGVzL3ZpcnR1YWwtZG9tL3Zub2RlL2hhbmRsZS10aHVuay5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy10aHVuay5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy12aG9vay5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy12bm9kZS5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy12dGV4dC5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS9pcy13aWRnZXQuanMiLCJub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdm5vZGUvdmVyc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS92bm9kZS5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92bm9kZS92cGF0Y2guanMiLCJub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdm5vZGUvdnRleHQuanMiLCJub2RlX21vZHVsZXMvdmlydHVhbC1kb20vdnRyZWUvZGlmZi1wcm9wcy5qcyIsIm5vZGVfbW9kdWxlcy92aXJ0dWFsLWRvbS92dHJlZS9kaWZmLmpzIiwibm9kZV9tb2R1bGVzL3dlYWttYXAtc2hpbS9jcmVhdGUtc3RvcmUuanMiLCJub2RlX21vZHVsZXMvd2Vha21hcC1zaGltL2hpZGRlbi1zdG9yZS5qcyIsIm5vZGVfbW9kdWxlcy94LWlzLWFycmF5L2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvYXBwL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvaGVhZGVyL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvbWVzc2FnZXMvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9zY3JvbGwvaW5kZXguanMiLCJzcmMvaW5pdC5qcyIsInNyYy9tZXNzYWdlcy5qc29uIiwic3JjL3Bob3Rvcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL2luaXQnKSgpXG4iLCIvKiFcbiAqIGFycmF5LWxhc3QgPGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2FycmF5LWxhc3Q+XG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEpvbiBTY2hsaW5rZXJ0LCBjb250cmlidXRvcnMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxudmFyIGlzTnVtYmVyID0gcmVxdWlyZSgnaXMtbnVtYmVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbGFzdChhcnIsIG4pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIHRoZSBmaXJzdCBhcmd1bWVudCB0byBiZSBhbiBhcnJheScpO1xuICB9XG5cbiAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XG4gIGlmIChsZW4gPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG4gPSBpc051bWJlcihuKSA/ICtuIDogMTtcbiAgaWYgKG4gPT09IDEpIHtcbiAgICByZXR1cm4gYXJyW2xlbiAtIDFdO1xuICB9XG5cbiAgdmFyIHJlcyA9IG5ldyBBcnJheShuKTtcbiAgd2hpbGUgKG4tLSkge1xuICAgIHJlc1tuXSA9IGFyclstLWxlbl07XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG4iLCIvKiFcbiAqIGlzLW51bWJlciA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtbnVtYmVyPlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNCBKb24gU2NobGlua2VydCwgY29udHJpYnV0b3JzLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTnVtYmVyKG4pIHtcbiAgcmV0dXJuICEhKCtuKSB8fCBuID09PSAwIHx8IG4gPT09ICcwJztcbn07XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhc3NlcnRPayAodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdFeHBlY3RlZCB0cnVlLCBnb3QgJyArIHZhbHVlKVxuICB9XG59XG4iLCIiLCIvKiFcbiAqIENyb3NzLUJyb3dzZXIgU3BsaXQgMS4xLjFcbiAqIENvcHlyaWdodCAyMDA3LTIwMTIgU3RldmVuIExldml0aGFuIDxzdGV2ZW5sZXZpdGhhbi5jb20+XG4gKiBBdmFpbGFibGUgdW5kZXIgdGhlIE1JVCBMaWNlbnNlXG4gKiBFQ01BU2NyaXB0IGNvbXBsaWFudCwgdW5pZm9ybSBjcm9zcy1icm93c2VyIHNwbGl0IG1ldGhvZFxuICovXG5cbi8qKlxuICogU3BsaXRzIGEgc3RyaW5nIGludG8gYW4gYXJyYXkgb2Ygc3RyaW5ncyB1c2luZyBhIHJlZ2V4IG9yIHN0cmluZyBzZXBhcmF0b3IuIE1hdGNoZXMgb2YgdGhlXG4gKiBzZXBhcmF0b3IgYXJlIG5vdCBpbmNsdWRlZCBpbiB0aGUgcmVzdWx0IGFycmF5LiBIb3dldmVyLCBpZiBgc2VwYXJhdG9yYCBpcyBhIHJlZ2V4IHRoYXQgY29udGFpbnNcbiAqIGNhcHR1cmluZyBncm91cHMsIGJhY2tyZWZlcmVuY2VzIGFyZSBzcGxpY2VkIGludG8gdGhlIHJlc3VsdCBlYWNoIHRpbWUgYHNlcGFyYXRvcmAgaXMgbWF0Y2hlZC5cbiAqIEZpeGVzIGJyb3dzZXIgYnVncyBjb21wYXJlZCB0byB0aGUgbmF0aXZlIGBTdHJpbmcucHJvdG90eXBlLnNwbGl0YCBhbmQgY2FuIGJlIHVzZWQgcmVsaWFibHlcbiAqIGNyb3NzLWJyb3dzZXIuXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIFN0cmluZyB0byBzcGxpdC5cbiAqIEBwYXJhbSB7UmVnRXhwfFN0cmluZ30gc2VwYXJhdG9yIFJlZ2V4IG9yIHN0cmluZyB0byB1c2UgZm9yIHNlcGFyYXRpbmcgdGhlIHN0cmluZy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbbGltaXRdIE1heGltdW0gbnVtYmVyIG9mIGl0ZW1zIHRvIGluY2x1ZGUgaW4gdGhlIHJlc3VsdCBhcnJheS5cbiAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2Ygc3Vic3RyaW5ncy5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQmFzaWMgdXNlXG4gKiBzcGxpdCgnYSBiIGMgZCcsICcgJyk7XG4gKiAvLyAtPiBbJ2EnLCAnYicsICdjJywgJ2QnXVxuICpcbiAqIC8vIFdpdGggbGltaXRcbiAqIHNwbGl0KCdhIGIgYyBkJywgJyAnLCAyKTtcbiAqIC8vIC0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBCYWNrcmVmZXJlbmNlcyBpbiByZXN1bHQgYXJyYXlcbiAqIHNwbGl0KCcuLndvcmQxIHdvcmQyLi4nLCAvKFthLXpdKykoXFxkKykvaSk7XG4gKiAvLyAtPiBbJy4uJywgJ3dvcmQnLCAnMScsICcgJywgJ3dvcmQnLCAnMicsICcuLiddXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uIHNwbGl0KHVuZGVmKSB7XG5cbiAgdmFyIG5hdGl2ZVNwbGl0ID0gU3RyaW5nLnByb3RvdHlwZS5zcGxpdCxcbiAgICBjb21wbGlhbnRFeGVjTnBjZyA9IC8oKT8/Ly5leGVjKFwiXCIpWzFdID09PSB1bmRlZixcbiAgICAvLyBOUENHOiBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cFxuICAgIHNlbGY7XG5cbiAgc2VsZiA9IGZ1bmN0aW9uKHN0ciwgc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgIC8vIElmIGBzZXBhcmF0b3JgIGlzIG5vdCBhIHJlZ2V4LCB1c2UgYG5hdGl2ZVNwbGl0YFxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc2VwYXJhdG9yKSAhPT0gXCJbb2JqZWN0IFJlZ0V4cF1cIikge1xuICAgICAgcmV0dXJuIG5hdGl2ZVNwbGl0LmNhbGwoc3RyLCBzZXBhcmF0b3IsIGxpbWl0KTtcbiAgICB9XG4gICAgdmFyIG91dHB1dCA9IFtdLFxuICAgICAgZmxhZ3MgPSAoc2VwYXJhdG9yLmlnbm9yZUNhc2UgPyBcImlcIiA6IFwiXCIpICsgKHNlcGFyYXRvci5tdWx0aWxpbmUgPyBcIm1cIiA6IFwiXCIpICsgKHNlcGFyYXRvci5leHRlbmRlZCA/IFwieFwiIDogXCJcIikgKyAvLyBQcm9wb3NlZCBmb3IgRVM2XG4gICAgICAoc2VwYXJhdG9yLnN0aWNreSA/IFwieVwiIDogXCJcIiksXG4gICAgICAvLyBGaXJlZm94IDMrXG4gICAgICBsYXN0TGFzdEluZGV4ID0gMCxcbiAgICAgIC8vIE1ha2UgYGdsb2JhbGAgYW5kIGF2b2lkIGBsYXN0SW5kZXhgIGlzc3VlcyBieSB3b3JraW5nIHdpdGggYSBjb3B5XG4gICAgICBzZXBhcmF0b3IgPSBuZXcgUmVnRXhwKHNlcGFyYXRvci5zb3VyY2UsIGZsYWdzICsgXCJnXCIpLFxuICAgICAgc2VwYXJhdG9yMiwgbWF0Y2gsIGxhc3RJbmRleCwgbGFzdExlbmd0aDtcbiAgICBzdHIgKz0gXCJcIjsgLy8gVHlwZS1jb252ZXJ0XG4gICAgaWYgKCFjb21wbGlhbnRFeGVjTnBjZykge1xuICAgICAgLy8gRG9lc24ndCBuZWVkIGZsYWdzIGd5LCBidXQgdGhleSBkb24ndCBodXJ0XG4gICAgICBzZXBhcmF0b3IyID0gbmV3IFJlZ0V4cChcIl5cIiArIHNlcGFyYXRvci5zb3VyY2UgKyBcIiQoPyFcXFxccylcIiwgZmxhZ3MpO1xuICAgIH1cbiAgICAvKiBWYWx1ZXMgZm9yIGBsaW1pdGAsIHBlciB0aGUgc3BlYzpcbiAgICAgKiBJZiB1bmRlZmluZWQ6IDQyOTQ5NjcyOTUgLy8gTWF0aC5wb3coMiwgMzIpIC0gMVxuICAgICAqIElmIDAsIEluZmluaXR5LCBvciBOYU46IDBcbiAgICAgKiBJZiBwb3NpdGl2ZSBudW1iZXI6IGxpbWl0ID0gTWF0aC5mbG9vcihsaW1pdCk7IGlmIChsaW1pdCA+IDQyOTQ5NjcyOTUpIGxpbWl0IC09IDQyOTQ5NjcyOTY7XG4gICAgICogSWYgbmVnYXRpdmUgbnVtYmVyOiA0Mjk0OTY3Mjk2IC0gTWF0aC5mbG9vcihNYXRoLmFicyhsaW1pdCkpXG4gICAgICogSWYgb3RoZXI6IFR5cGUtY29udmVydCwgdGhlbiB1c2UgdGhlIGFib3ZlIHJ1bGVzXG4gICAgICovXG4gICAgbGltaXQgPSBsaW1pdCA9PT0gdW5kZWYgPyAtMSA+Pj4gMCA6IC8vIE1hdGgucG93KDIsIDMyKSAtIDFcbiAgICBsaW1pdCA+Pj4gMDsgLy8gVG9VaW50MzIobGltaXQpXG4gICAgd2hpbGUgKG1hdGNoID0gc2VwYXJhdG9yLmV4ZWMoc3RyKSkge1xuICAgICAgLy8gYHNlcGFyYXRvci5sYXN0SW5kZXhgIGlzIG5vdCByZWxpYWJsZSBjcm9zcy1icm93c2VyXG4gICAgICBsYXN0SW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgIGlmIChsYXN0SW5kZXggPiBsYXN0TGFzdEluZGV4KSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHN0ci5zbGljZShsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAvLyBGaXggYnJvd3NlcnMgd2hvc2UgYGV4ZWNgIG1ldGhvZHMgZG9uJ3QgY29uc2lzdGVudGx5IHJldHVybiBgdW5kZWZpbmVkYCBmb3JcbiAgICAgICAgLy8gbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXBzXG4gICAgICAgIGlmICghY29tcGxpYW50RXhlY05wY2cgJiYgbWF0Y2gubGVuZ3RoID4gMSkge1xuICAgICAgICAgIG1hdGNoWzBdLnJlcGxhY2Uoc2VwYXJhdG9yMiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSA9PT0gdW5kZWYpIHtcbiAgICAgICAgICAgICAgICBtYXRjaFtpXSA9IHVuZGVmO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCA+IDEgJiYgbWF0Y2guaW5kZXggPCBzdHIubGVuZ3RoKSB7XG4gICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3V0cHV0LCBtYXRjaC5zbGljZSgxKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdExlbmd0aCA9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgbGFzdExhc3RJbmRleCA9IGxhc3RJbmRleDtcbiAgICAgICAgaWYgKG91dHB1dC5sZW5ndGggPj0gbGltaXQpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNlcGFyYXRvci5sYXN0SW5kZXggPT09IG1hdGNoLmluZGV4KSB7XG4gICAgICAgIHNlcGFyYXRvci5sYXN0SW5kZXgrKzsgLy8gQXZvaWQgYW4gaW5maW5pdGUgbG9vcFxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobGFzdExhc3RJbmRleCA9PT0gc3RyLmxlbmd0aCkge1xuICAgICAgaWYgKGxhc3RMZW5ndGggfHwgIXNlcGFyYXRvci50ZXN0KFwiXCIpKSB7XG4gICAgICAgIG91dHB1dC5wdXNoKFwiXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaChzdHIuc2xpY2UobGFzdExhc3RJbmRleCkpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0Lmxlbmd0aCA+IGxpbWl0ID8gb3V0cHV0LnNsaWNlKDAsIGxpbWl0KSA6IG91dHB1dDtcbiAgfTtcblxuICByZXR1cm4gc2VsZjtcbn0pKCk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSByZXR1cm4gY2FtZWxDYXNlKG9iaik7XG4gICAgcmV0dXJuIHdhbGsob2JqKTtcbn07XG5cbmZ1bmN0aW9uIHdhbGsgKG9iaikge1xuICAgIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSByZXR1cm4gb2JqO1xuICAgIGlmIChpc0RhdGUob2JqKSB8fCBpc1JlZ2V4KG9iaikpIHJldHVybiBvYmo7XG4gICAgaWYgKGlzQXJyYXkob2JqKSkgcmV0dXJuIG1hcChvYmosIHdhbGspO1xuICAgIHJldHVybiByZWR1Y2Uob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbiAoYWNjLCBrZXkpIHtcbiAgICAgICAgdmFyIGNhbWVsID0gY2FtZWxDYXNlKGtleSk7XG4gICAgICAgIGFjY1tjYW1lbF0gPSB3YWxrKG9ialtrZXldKTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIGNhbWVsQ2FzZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tfLi1dKFxcd3wkKS9nLCBmdW5jdGlvbiAoXyx4KSB7XG4gICAgICAgIHJldHVybiB4LnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG59XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxudmFyIGlzRGF0ZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbn07XG5cbnZhciBpc1JlZ2V4ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59O1xuXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoaGFzLmNhbGwob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG59O1xuXG5mdW5jdGlvbiBtYXAgKHhzLCBmKSB7XG4gICAgaWYgKHhzLm1hcCkgcmV0dXJuIHhzLm1hcChmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIHJlZHVjZSAoeHMsIGYsIGFjYykge1xuICAgIGlmICh4cy5yZWR1Y2UpIHJldHVybiB4cy5yZWR1Y2UoZiwgYWNjKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFjYyA9IGYoYWNjLCB4c1tpXSwgaSk7XG4gICAgfVxuICAgIHJldHVybiBhY2M7XG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydC1vaycpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRGF0YVVyaSAob3B0aW9ucywgZGF0YSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0J1xuICAgID8gW29wdGlvbnMudHlwZSwgb3B0aW9ucy5jaGFyc2V0XS5maWx0ZXIoQm9vbGVhbikuam9pbignO2NoYXJzZXQ9JylcbiAgICA6IG9wdGlvbnNcblxuICBhc3NlcnQodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnLCAnbWltZSB0eXBlIHJlcXVpcmVkJylcbiAgYXNzZXJ0KGRhdGEsICdkYXRhIHJlcXVpcmVkJylcblxuICByZXR1cm4gWydkYXRhOicgKyB0eXBlLCAnYmFzZTY0LCcgKyBkYXRhXS5qb2luKCc7Jylcbn1cbiIsIi8qKlxuICogY3VpZC5qc1xuICogQ29sbGlzaW9uLXJlc2lzdGFudCBVSUQgZ2VuZXJhdG9yIGZvciBicm93c2VycyBhbmQgbm9kZS5cbiAqIFNlcXVlbnRpYWwgZm9yIGZhc3QgZGIgbG9va3VwcyBhbmQgcmVjZW5jeSBzb3J0aW5nLlxuICogU2FmZSBmb3IgZWxlbWVudCBJRHMgYW5kIHNlcnZlci1zaWRlIGxvb2t1cHMuXG4gKlxuICogRXh0cmFjdGVkIGZyb20gQ0xDVFJcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEVyaWMgRWxsaW90dCAyMDEyXG4gKiBNSVQgTGljZW5zZVxuICovXG5cbi8qZ2xvYmFsIHdpbmRvdywgbmF2aWdhdG9yLCBkb2N1bWVudCwgcmVxdWlyZSwgcHJvY2VzcywgbW9kdWxlICovXG4oZnVuY3Rpb24gKGFwcCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciBuYW1lc3BhY2UgPSAnY3VpZCcsXG4gICAgYyA9IDAsXG4gICAgYmxvY2tTaXplID0gNCxcbiAgICBiYXNlID0gMzYsXG4gICAgZGlzY3JldGVWYWx1ZXMgPSBNYXRoLnBvdyhiYXNlLCBibG9ja1NpemUpLFxuXG4gICAgcGFkID0gZnVuY3Rpb24gcGFkKG51bSwgc2l6ZSkge1xuICAgICAgdmFyIHMgPSBcIjAwMDAwMDAwMFwiICsgbnVtO1xuICAgICAgcmV0dXJuIHMuc3Vic3RyKHMubGVuZ3RoLXNpemUpO1xuICAgIH0sXG5cbiAgICByYW5kb21CbG9jayA9IGZ1bmN0aW9uIHJhbmRvbUJsb2NrKCkge1xuICAgICAgcmV0dXJuIHBhZCgoTWF0aC5yYW5kb20oKSAqXG4gICAgICAgICAgICBkaXNjcmV0ZVZhbHVlcyA8PCAwKVxuICAgICAgICAgICAgLnRvU3RyaW5nKGJhc2UpLCBibG9ja1NpemUpO1xuICAgIH0sXG5cbiAgICBzYWZlQ291bnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGMgPSAoYyA8IGRpc2NyZXRlVmFsdWVzKSA/IGMgOiAwO1xuICAgICAgYysrOyAvLyB0aGlzIGlzIG5vdCBzdWJsaW1pbmFsXG4gICAgICByZXR1cm4gYyAtIDE7XG4gICAgfSxcblxuICAgIGFwaSA9IGZ1bmN0aW9uIGN1aWQoKSB7XG4gICAgICAvLyBTdGFydGluZyB3aXRoIGEgbG93ZXJjYXNlIGxldHRlciBtYWtlc1xuICAgICAgLy8gaXQgSFRNTCBlbGVtZW50IElEIGZyaWVuZGx5LlxuICAgICAgdmFyIGxldHRlciA9ICdjJywgLy8gaGFyZC1jb2RlZCBhbGxvd3MgZm9yIHNlcXVlbnRpYWwgYWNjZXNzXG5cbiAgICAgICAgLy8gdGltZXN0YW1wXG4gICAgICAgIC8vIHdhcm5pbmc6IHRoaXMgZXhwb3NlcyB0aGUgZXhhY3QgZGF0ZSBhbmQgdGltZVxuICAgICAgICAvLyB0aGF0IHRoZSB1aWQgd2FzIGNyZWF0ZWQuXG4gICAgICAgIHRpbWVzdGFtcCA9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSkudG9TdHJpbmcoYmFzZSksXG5cbiAgICAgICAgLy8gUHJldmVudCBzYW1lLW1hY2hpbmUgY29sbGlzaW9ucy5cbiAgICAgICAgY291bnRlcixcblxuICAgICAgICAvLyBBIGZldyBjaGFycyB0byBnZW5lcmF0ZSBkaXN0aW5jdCBpZHMgZm9yIGRpZmZlcmVudFxuICAgICAgICAvLyBjbGllbnRzIChzbyBkaWZmZXJlbnQgY29tcHV0ZXJzIGFyZSBmYXIgbGVzc1xuICAgICAgICAvLyBsaWtlbHkgdG8gZ2VuZXJhdGUgdGhlIHNhbWUgaWQpXG4gICAgICAgIGZpbmdlcnByaW50ID0gYXBpLmZpbmdlcnByaW50KCksXG5cbiAgICAgICAgLy8gR3JhYiBzb21lIG1vcmUgY2hhcnMgZnJvbSBNYXRoLnJhbmRvbSgpXG4gICAgICAgIHJhbmRvbSA9IHJhbmRvbUJsb2NrKCkgKyByYW5kb21CbG9jaygpO1xuXG4gICAgICAgIGNvdW50ZXIgPSBwYWQoc2FmZUNvdW50ZXIoKS50b1N0cmluZyhiYXNlKSwgYmxvY2tTaXplKTtcblxuICAgICAgcmV0dXJuICAobGV0dGVyICsgdGltZXN0YW1wICsgY291bnRlciArIGZpbmdlcnByaW50ICsgcmFuZG9tKTtcbiAgICB9O1xuXG4gIGFwaS5zbHVnID0gZnVuY3Rpb24gc2x1ZygpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKDM2KSxcbiAgICAgIGNvdW50ZXIsXG4gICAgICBwcmludCA9IGFwaS5maW5nZXJwcmludCgpLnNsaWNlKDAsMSkgK1xuICAgICAgICBhcGkuZmluZ2VycHJpbnQoKS5zbGljZSgtMSksXG4gICAgICByYW5kb20gPSByYW5kb21CbG9jaygpLnNsaWNlKC0yKTtcblxuICAgICAgY291bnRlciA9IHNhZmVDb3VudGVyKCkudG9TdHJpbmcoMzYpLnNsaWNlKC00KTtcblxuICAgIHJldHVybiBkYXRlLnNsaWNlKC0yKSArXG4gICAgICBjb3VudGVyICsgcHJpbnQgKyByYW5kb207XG4gIH07XG5cbiAgYXBpLmdsb2JhbENvdW50ID0gZnVuY3Rpb24gZ2xvYmFsQ291bnQoKSB7XG4gICAgLy8gV2Ugd2FudCB0byBjYWNoZSB0aGUgcmVzdWx0cyBvZiB0aGlzXG4gICAgdmFyIGNhY2hlID0gKGZ1bmN0aW9uIGNhbGMoKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgIGNvdW50ID0gMDtcblxuICAgICAgICBmb3IgKGkgaW4gd2luZG93KSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgIH0oKSk7XG5cbiAgICBhcGkuZ2xvYmFsQ291bnQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjYWNoZTsgfTtcbiAgICByZXR1cm4gY2FjaGU7XG4gIH07XG5cbiAgYXBpLmZpbmdlcnByaW50ID0gZnVuY3Rpb24gYnJvd3NlclByaW50KCkge1xuICAgIHJldHVybiBwYWQoKG5hdmlnYXRvci5taW1lVHlwZXMubGVuZ3RoICtcbiAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQubGVuZ3RoKS50b1N0cmluZygzNikgK1xuICAgICAgYXBpLmdsb2JhbENvdW50KCkudG9TdHJpbmcoMzYpLCA0KTtcbiAgfTtcblxuICAvLyBkb24ndCBjaGFuZ2UgYW55dGhpbmcgZnJvbSBoZXJlIGRvd24uXG4gIGlmIChhcHAucmVnaXN0ZXIpIHtcbiAgICBhcHAucmVnaXN0ZXIobmFtZXNwYWNlLCBhcGkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBhcGk7XG4gIH0gZWxzZSB7XG4gICAgYXBwW25hbWVzcGFjZV0gPSBhcGk7XG4gIH1cblxufSh0aGlzLmFwcGxpdHVkZSB8fCB0aGlzKSk7XG4iLCJ2YXIgRXZTdG9yZSA9IHJlcXVpcmUoXCJldi1zdG9yZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZEV2ZW50XG5cbmZ1bmN0aW9uIGFkZEV2ZW50KHRhcmdldCwgdHlwZSwgaGFuZGxlcikge1xuICAgIHZhciBldmVudHMgPSBFdlN0b3JlKHRhcmdldClcbiAgICB2YXIgZXZlbnQgPSBldmVudHNbdHlwZV1cblxuICAgIGlmICghZXZlbnQpIHtcbiAgICAgICAgZXZlbnRzW3R5cGVdID0gaGFuZGxlclxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShldmVudCkpIHtcbiAgICAgICAgaWYgKGV2ZW50LmluZGV4T2YoaGFuZGxlcikgPT09IC0xKSB7XG4gICAgICAgICAgICBldmVudC5wdXNoKGhhbmRsZXIpXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGV2ZW50ICE9PSBoYW5kbGVyKSB7XG4gICAgICAgIGV2ZW50c1t0eXBlXSA9IFtldmVudCwgaGFuZGxlcl1cbiAgICB9XG59XG4iLCJ2YXIgZ2xvYmFsRG9jdW1lbnQgPSByZXF1aXJlKFwiZ2xvYmFsL2RvY3VtZW50XCIpXG52YXIgRXZTdG9yZSA9IHJlcXVpcmUoXCJldi1zdG9yZVwiKVxudmFyIGNyZWF0ZVN0b3JlID0gcmVxdWlyZShcIndlYWttYXAtc2hpbS9jcmVhdGUtc3RvcmVcIilcblxudmFyIGFkZEV2ZW50ID0gcmVxdWlyZShcIi4vYWRkLWV2ZW50LmpzXCIpXG52YXIgcmVtb3ZlRXZlbnQgPSByZXF1aXJlKFwiLi9yZW1vdmUtZXZlbnQuanNcIilcbnZhciBQcm94eUV2ZW50ID0gcmVxdWlyZShcIi4vcHJveHktZXZlbnQuanNcIilcblxudmFyIEhBTkRMRVJfU1RPUkUgPSBjcmVhdGVTdG9yZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gRE9NRGVsZWdhdG9yXG5cbmZ1bmN0aW9uIERPTURlbGVnYXRvcihkb2N1bWVudCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBET01EZWxlZ2F0b3IpKSB7XG4gICAgICAgIHJldHVybiBuZXcgRE9NRGVsZWdhdG9yKGRvY3VtZW50KTtcbiAgICB9XG5cbiAgICBkb2N1bWVudCA9IGRvY3VtZW50IHx8IGdsb2JhbERvY3VtZW50XG5cbiAgICB0aGlzLnRhcmdldCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgIHRoaXMuZXZlbnRzID0ge31cbiAgICB0aGlzLnJhd0V2ZW50TGlzdGVuZXJzID0ge31cbiAgICB0aGlzLmdsb2JhbExpc3RlbmVycyA9IHt9XG59XG5cbkRPTURlbGVnYXRvci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGFkZEV2ZW50XG5ET01EZWxlZ2F0b3IucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSByZW1vdmVFdmVudFxuXG5ET01EZWxlZ2F0b3IuYWxsb2NhdGVIYW5kbGUgPVxuICAgIGZ1bmN0aW9uIGFsbG9jYXRlSGFuZGxlKGZ1bmMpIHtcbiAgICAgICAgdmFyIGhhbmRsZSA9IG5ldyBIYW5kbGUoKVxuXG4gICAgICAgIEhBTkRMRVJfU1RPUkUoaGFuZGxlKS5mdW5jID0gZnVuYztcblxuICAgICAgICByZXR1cm4gaGFuZGxlXG4gICAgfVxuXG5ET01EZWxlZ2F0b3IudHJhbnNmb3JtSGFuZGxlID1cbiAgICBmdW5jdGlvbiB0cmFuc2Zvcm1IYW5kbGUoaGFuZGxlLCBicm9hZGNhc3QpIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBIQU5ETEVSX1NUT1JFKGhhbmRsZSkuZnVuY1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFsbG9jYXRlSGFuZGxlKGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgYnJvYWRjYXN0KGV2LCBmdW5jKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbkRPTURlbGVnYXRvci5wcm90b3R5cGUuYWRkR2xvYmFsRXZlbnRMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gYWRkR2xvYmFsRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdsb2JhbExpc3RlbmVyc1tldmVudE5hbWVdIHx8IFtdO1xuICAgICAgICBpZiAobGlzdGVuZXJzLmluZGV4T2YoZm4pID09PSAtMSkge1xuICAgICAgICAgICAgbGlzdGVuZXJzLnB1c2goZm4pXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdsb2JhbExpc3RlbmVyc1tldmVudE5hbWVdID0gbGlzdGVuZXJzO1xuICAgIH1cblxuRE9NRGVsZWdhdG9yLnByb3RvdHlwZS5yZW1vdmVHbG9iYWxFdmVudExpc3RlbmVyID1cbiAgICBmdW5jdGlvbiByZW1vdmVHbG9iYWxFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2xvYmFsTGlzdGVuZXJzW2V2ZW50TmFtZV0gfHwgW107XG5cbiAgICAgICAgdmFyIGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoZm4pXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgIH1cbiAgICB9XG5cbkRPTURlbGVnYXRvci5wcm90b3R5cGUubGlzdGVuVG8gPSBmdW5jdGlvbiBsaXN0ZW5UbyhldmVudE5hbWUpIHtcbiAgICBpZiAoIShldmVudE5hbWUgaW4gdGhpcy5ldmVudHMpKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSAwO1xuICAgIH1cblxuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0rKztcblxuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdICE9PSAxKSB7XG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHZhciBsaXN0ZW5lciA9IHRoaXMucmF3RXZlbnRMaXN0ZW5lcnNbZXZlbnROYW1lXVxuICAgIGlmICghbGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIgPSB0aGlzLnJhd0V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV0gPVxuICAgICAgICAgICAgY3JlYXRlSGFuZGxlcihldmVudE5hbWUsIHRoaXMpXG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyLCB0cnVlKVxufVxuXG5ET01EZWxlZ2F0b3IucHJvdG90eXBlLnVubGlzdGVuVG8gPSBmdW5jdGlvbiB1bmxpc3RlblRvKGV2ZW50TmFtZSkge1xuICAgIGlmICghKGV2ZW50TmFtZSBpbiB0aGlzLmV2ZW50cykpIHtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYWxyZWFkeSB1bmxpc3RlbmVkIHRvIGV2ZW50LlwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLS07XG5cbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSAhPT0gMCkge1xuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgbGlzdGVuZXIgPSB0aGlzLnJhd0V2ZW50TGlzdGVuZXJzW2V2ZW50TmFtZV1cblxuICAgIGlmICghbGlzdGVuZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZG9tLWRlbGVnYXRvciN1bmxpc3RlblRvOiBjYW5ub3QgXCIgK1xuICAgICAgICAgICAgXCJ1bmxpc3RlbiB0byBcIiArIGV2ZW50TmFtZSlcbiAgICB9XG5cbiAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXIsIHRydWUpXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUhhbmRsZXIoZXZlbnROYW1lLCBkZWxlZ2F0b3IpIHtcbiAgICB2YXIgZ2xvYmFsTGlzdGVuZXJzID0gZGVsZWdhdG9yLmdsb2JhbExpc3RlbmVycztcbiAgICB2YXIgZGVsZWdhdG9yVGFyZ2V0ID0gZGVsZWdhdG9yLnRhcmdldDtcblxuICAgIHJldHVybiBoYW5kbGVyXG5cbiAgICBmdW5jdGlvbiBoYW5kbGVyKGV2KSB7XG4gICAgICAgIHZhciBnbG9iYWxIYW5kbGVycyA9IGdsb2JhbExpc3RlbmVyc1tldmVudE5hbWVdIHx8IFtdXG5cbiAgICAgICAgaWYgKGdsb2JhbEhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBnbG9iYWxFdmVudCA9IG5ldyBQcm94eUV2ZW50KGV2KTtcbiAgICAgICAgICAgIGdsb2JhbEV2ZW50LmN1cnJlbnRUYXJnZXQgPSBkZWxlZ2F0b3JUYXJnZXQ7XG4gICAgICAgICAgICBjYWxsTGlzdGVuZXJzKGdsb2JhbEhhbmRsZXJzLCBnbG9iYWxFdmVudClcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBbmRJbnZva2VMaXN0ZW5lcnMoZXYudGFyZ2V0LCBldiwgZXZlbnROYW1lKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmluZEFuZEludm9rZUxpc3RlbmVycyhlbGVtLCBldiwgZXZlbnROYW1lKSB7XG4gICAgdmFyIGxpc3RlbmVyID0gZ2V0TGlzdGVuZXIoZWxlbSwgZXZlbnROYW1lKVxuXG4gICAgaWYgKGxpc3RlbmVyICYmIGxpc3RlbmVyLmhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyRXZlbnQgPSBuZXcgUHJveHlFdmVudChldik7XG4gICAgICAgIGxpc3RlbmVyRXZlbnQuY3VycmVudFRhcmdldCA9IGxpc3RlbmVyLmN1cnJlbnRUYXJnZXRcbiAgICAgICAgY2FsbExpc3RlbmVycyhsaXN0ZW5lci5oYW5kbGVycywgbGlzdGVuZXJFdmVudClcblxuICAgICAgICBpZiAobGlzdGVuZXJFdmVudC5fYnViYmxlcykge1xuICAgICAgICAgICAgdmFyIG5leHRUYXJnZXQgPSBsaXN0ZW5lci5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGVcbiAgICAgICAgICAgIGZpbmRBbmRJbnZva2VMaXN0ZW5lcnMobmV4dFRhcmdldCwgZXYsIGV2ZW50TmFtZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0TGlzdGVuZXIodGFyZ2V0LCB0eXBlKSB7XG4gICAgLy8gdGVybWluYXRlIHJlY3Vyc2lvbiBpZiBwYXJlbnQgaXMgYG51bGxgXG4gICAgaWYgKHRhcmdldCA9PT0gbnVsbCB8fCB0eXBlb2YgdGFyZ2V0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgdmFyIGV2ZW50cyA9IEV2U3RvcmUodGFyZ2V0KVxuICAgIC8vIGZldGNoIGxpc3Qgb2YgaGFuZGxlciBmbnMgZm9yIHRoaXMgZXZlbnRcbiAgICB2YXIgaGFuZGxlciA9IGV2ZW50c1t0eXBlXVxuICAgIHZhciBhbGxIYW5kbGVyID0gZXZlbnRzLmV2ZW50XG5cbiAgICBpZiAoIWhhbmRsZXIgJiYgIWFsbEhhbmRsZXIpIHtcbiAgICAgICAgcmV0dXJuIGdldExpc3RlbmVyKHRhcmdldC5wYXJlbnROb2RlLCB0eXBlKVxuICAgIH1cblxuICAgIHZhciBoYW5kbGVycyA9IFtdLmNvbmNhdChoYW5kbGVyIHx8IFtdLCBhbGxIYW5kbGVyIHx8IFtdKVxuICAgIHJldHVybiBuZXcgTGlzdGVuZXIodGFyZ2V0LCBoYW5kbGVycylcbn1cblxuZnVuY3Rpb24gY2FsbExpc3RlbmVycyhoYW5kbGVycywgZXYpIHtcbiAgICBoYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGV2KVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBoYW5kbGVyLmhhbmRsZUV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGhhbmRsZXIuaGFuZGxlRXZlbnQoZXYpXG4gICAgICAgIH0gZWxzZSBpZiAoaGFuZGxlci50eXBlID09PSBcImRvbS1kZWxlZ2F0b3ItaGFuZGxlXCIpIHtcbiAgICAgICAgICAgIEhBTkRMRVJfU1RPUkUoaGFuZGxlcikuZnVuYyhldilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImRvbS1kZWxlZ2F0b3I6IHVua25vd24gaGFuZGxlciBcIiArXG4gICAgICAgICAgICAgICAgXCJmb3VuZDogXCIgKyBKU09OLnN0cmluZ2lmeShoYW5kbGVycykpO1xuICAgICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gTGlzdGVuZXIodGFyZ2V0LCBoYW5kbGVycykge1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IHRhcmdldFxuICAgIHRoaXMuaGFuZGxlcnMgPSBoYW5kbGVyc1xufVxuXG5mdW5jdGlvbiBIYW5kbGUoKSB7XG4gICAgdGhpcy50eXBlID0gXCJkb20tZGVsZWdhdG9yLWhhbmRsZVwiXG59XG4iLCJ2YXIgSW5kaXZpZHVhbCA9IHJlcXVpcmUoXCJpbmRpdmlkdWFsXCIpXG52YXIgY3VpZCA9IHJlcXVpcmUoXCJjdWlkXCIpXG52YXIgZ2xvYmFsRG9jdW1lbnQgPSByZXF1aXJlKFwiZ2xvYmFsL2RvY3VtZW50XCIpXG5cbnZhciBET01EZWxlZ2F0b3IgPSByZXF1aXJlKFwiLi9kb20tZGVsZWdhdG9yLmpzXCIpXG5cbnZhciB2ZXJzaW9uS2V5ID0gXCIxM1wiXG52YXIgY2FjaGVLZXkgPSBcIl9fRE9NX0RFTEVHQVRPUl9DQUNIRUBcIiArIHZlcnNpb25LZXlcbnZhciBjYWNoZVRva2VuS2V5ID0gXCJfX0RPTV9ERUxFR0FUT1JfQ0FDSEVfVE9LRU5AXCIgKyB2ZXJzaW9uS2V5XG52YXIgZGVsZWdhdG9yQ2FjaGUgPSBJbmRpdmlkdWFsKGNhY2hlS2V5LCB7XG4gICAgZGVsZWdhdG9yczoge31cbn0pXG52YXIgY29tbW9uRXZlbnRzID0gW1xuICAgIFwiYmx1clwiLCBcImNoYW5nZVwiLCBcImNsaWNrXCIsICBcImNvbnRleHRtZW51XCIsIFwiZGJsY2xpY2tcIixcbiAgICBcImVycm9yXCIsXCJmb2N1c1wiLCBcImZvY3VzaW5cIiwgXCJmb2N1c291dFwiLCBcImlucHV0XCIsIFwia2V5ZG93blwiLFxuICAgIFwia2V5cHJlc3NcIiwgXCJrZXl1cFwiLCBcImxvYWRcIiwgXCJtb3VzZWRvd25cIiwgXCJtb3VzZXVwXCIsXG4gICAgXCJyZXNpemVcIiwgXCJzZWxlY3RcIiwgXCJzdWJtaXRcIiwgXCJ0b3VjaGNhbmNlbFwiLFxuICAgIFwidG91Y2hlbmRcIiwgXCJ0b3VjaHN0YXJ0XCIsIFwidW5sb2FkXCJcbl1cblxuLyogIERlbGVnYXRvciBpcyBhIHRoaW4gd3JhcHBlciBhcm91bmQgYSBzaW5nbGV0b24gYERPTURlbGVnYXRvcmBcbiAgICAgICAgaW5zdGFuY2UuXG5cbiAgICBPbmx5IG9uZSBET01EZWxlZ2F0b3Igc2hvdWxkIGV4aXN0IGJlY2F1c2Ugd2UgZG8gbm90IHdhbnRcbiAgICAgICAgZHVwbGljYXRlIGV2ZW50IGxpc3RlbmVycyBib3VuZCB0byB0aGUgRE9NLlxuXG4gICAgYERlbGVnYXRvcmAgd2lsbCBhbHNvIGBsaXN0ZW5UbygpYCBhbGwgZXZlbnRzIHVubGVzc1xuICAgICAgICBldmVyeSBjYWxsZXIgb3B0cyBvdXQgb2YgaXRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IERlbGVnYXRvclxuXG5mdW5jdGlvbiBEZWxlZ2F0b3Iob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9XG4gICAgdmFyIGRvY3VtZW50ID0gb3B0cy5kb2N1bWVudCB8fCBnbG9iYWxEb2N1bWVudFxuXG4gICAgdmFyIGNhY2hlS2V5ID0gZG9jdW1lbnRbY2FjaGVUb2tlbktleV1cblxuICAgIGlmICghY2FjaGVLZXkpIHtcbiAgICAgICAgY2FjaGVLZXkgPVxuICAgICAgICAgICAgZG9jdW1lbnRbY2FjaGVUb2tlbktleV0gPSBjdWlkKClcbiAgICB9XG5cbiAgICB2YXIgZGVsZWdhdG9yID0gZGVsZWdhdG9yQ2FjaGUuZGVsZWdhdG9yc1tjYWNoZUtleV1cblxuICAgIGlmICghZGVsZWdhdG9yKSB7XG4gICAgICAgIGRlbGVnYXRvciA9IGRlbGVnYXRvckNhY2hlLmRlbGVnYXRvcnNbY2FjaGVLZXldID1cbiAgICAgICAgICAgIG5ldyBET01EZWxlZ2F0b3IoZG9jdW1lbnQpXG4gICAgfVxuXG4gICAgaWYgKG9wdHMuZGVmYXVsdEV2ZW50cyAhPT0gZmFsc2UpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tb25FdmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRlbGVnYXRvci5saXN0ZW5Ubyhjb21tb25FdmVudHNbaV0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVsZWdhdG9yXG59XG5cbkRlbGVnYXRvci5hbGxvY2F0ZUhhbmRsZSA9IERPTURlbGVnYXRvci5hbGxvY2F0ZUhhbmRsZTtcbkRlbGVnYXRvci50cmFuc2Zvcm1IYW5kbGUgPSBET01EZWxlZ2F0b3IudHJhbnNmb3JtSGFuZGxlO1xuIiwidmFyIGluaGVyaXRzID0gcmVxdWlyZShcImluaGVyaXRzXCIpXG5cbnZhciBBTExfUFJPUFMgPSBbXG4gICAgXCJhbHRLZXlcIiwgXCJidWJibGVzXCIsIFwiY2FuY2VsYWJsZVwiLCBcImN0cmxLZXlcIixcbiAgICBcImV2ZW50UGhhc2VcIiwgXCJtZXRhS2V5XCIsIFwicmVsYXRlZFRhcmdldFwiLCBcInNoaWZ0S2V5XCIsXG4gICAgXCJ0YXJnZXRcIiwgXCJ0aW1lU3RhbXBcIiwgXCJ0eXBlXCIsIFwidmlld1wiLCBcIndoaWNoXCJcbl1cbnZhciBLRVlfUFJPUFMgPSBbXCJjaGFyXCIsIFwiY2hhckNvZGVcIiwgXCJrZXlcIiwgXCJrZXlDb2RlXCJdXG52YXIgTU9VU0VfUFJPUFMgPSBbXG4gICAgXCJidXR0b25cIiwgXCJidXR0b25zXCIsIFwiY2xpZW50WFwiLCBcImNsaWVudFlcIiwgXCJsYXllclhcIixcbiAgICBcImxheWVyWVwiLCBcIm9mZnNldFhcIiwgXCJvZmZzZXRZXCIsIFwicGFnZVhcIiwgXCJwYWdlWVwiLFxuICAgIFwic2NyZWVuWFwiLCBcInNjcmVlbllcIiwgXCJ0b0VsZW1lbnRcIlxuXVxuXG52YXIgcmtleUV2ZW50ID0gL15rZXl8aW5wdXQvXG52YXIgcm1vdXNlRXZlbnQgPSAvXig/Om1vdXNlfHBvaW50ZXJ8Y29udGV4dG1lbnUpfGNsaWNrL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb3h5RXZlbnRcblxuZnVuY3Rpb24gUHJveHlFdmVudChldikge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQcm94eUV2ZW50KSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5RXZlbnQoZXYpXG4gICAgfVxuXG4gICAgaWYgKHJrZXlFdmVudC50ZXN0KGV2LnR5cGUpKSB7XG4gICAgICAgIHJldHVybiBuZXcgS2V5RXZlbnQoZXYpXG4gICAgfSBlbHNlIGlmIChybW91c2VFdmVudC50ZXN0KGV2LnR5cGUpKSB7XG4gICAgICAgIHJldHVybiBuZXcgTW91c2VFdmVudChldilcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IEFMTF9QUk9QUy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvcEtleSA9IEFMTF9QUk9QU1tpXVxuICAgICAgICB0aGlzW3Byb3BLZXldID0gZXZbcHJvcEtleV1cbiAgICB9XG5cbiAgICB0aGlzLl9yYXdFdmVudCA9IGV2XG4gICAgdGhpcy5fYnViYmxlcyA9IGZhbHNlO1xufVxuXG5Qcm94eUV2ZW50LnByb3RvdHlwZS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9yYXdFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG59XG5cblByb3h5RXZlbnQucHJvdG90eXBlLnN0YXJ0UHJvcGFnYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fYnViYmxlcyA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIE1vdXNlRXZlbnQoZXYpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IEFMTF9QUk9QUy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvcEtleSA9IEFMTF9QUk9QU1tpXVxuICAgICAgICB0aGlzW3Byb3BLZXldID0gZXZbcHJvcEtleV1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IE1PVVNFX1BST1BTLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBtb3VzZVByb3BLZXkgPSBNT1VTRV9QUk9QU1tqXVxuICAgICAgICB0aGlzW21vdXNlUHJvcEtleV0gPSBldlttb3VzZVByb3BLZXldXG4gICAgfVxuXG4gICAgdGhpcy5fcmF3RXZlbnQgPSBldlxufVxuXG5pbmhlcml0cyhNb3VzZUV2ZW50LCBQcm94eUV2ZW50KVxuXG5mdW5jdGlvbiBLZXlFdmVudChldikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQUxMX1BST1BTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwcm9wS2V5ID0gQUxMX1BST1BTW2ldXG4gICAgICAgIHRoaXNbcHJvcEtleV0gPSBldltwcm9wS2V5XVxuICAgIH1cblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgS0VZX1BST1BTLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHZhciBrZXlQcm9wS2V5ID0gS0VZX1BST1BTW2pdXG4gICAgICAgIHRoaXNba2V5UHJvcEtleV0gPSBldltrZXlQcm9wS2V5XVxuICAgIH1cblxuICAgIHRoaXMuX3Jhd0V2ZW50ID0gZXZcbn1cblxuaW5oZXJpdHMoS2V5RXZlbnQsIFByb3h5RXZlbnQpXG4iLCJ2YXIgRXZTdG9yZSA9IHJlcXVpcmUoXCJldi1zdG9yZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW92ZUV2ZW50XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50KHRhcmdldCwgdHlwZSwgaGFuZGxlcikge1xuICAgIHZhciBldmVudHMgPSBFdlN0b3JlKHRhcmdldClcbiAgICB2YXIgZXZlbnQgPSBldmVudHNbdHlwZV1cblxuICAgIGlmICghZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgICB2YXIgaW5kZXggPSBldmVudC5pbmRleE9mKGhhbmRsZXIpXG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGV2ZW50LnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IGhhbmRsZXIpIHtcbiAgICAgICAgZXZlbnRzW3R5cGVdID0gbnVsbFxuICAgIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgneHRlbmQnKVxudmFyIFN0cnVjdCA9IHJlcXVpcmUoJ29ic2Vydi1zdHJ1Y3QnKVxudmFyIE9ic2VydiA9IHJlcXVpcmUoJ29ic2VydicpXG52YXIgRGVsZWdhdG9yID0gcmVxdWlyZSgnZG9tLWRlbGVnYXRvcicpXG52YXIgbWFwVmFsdWVzID0gcmVxdWlyZSgnbWFwLXZhbHVlcycpXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCdpcy1vYmonKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFN0YXRlIChzdGF0ZSkge1xuICB2YXIgY29weSA9IGV4dGVuZChzdGF0ZSlcbiAgdmFyICRjaGFubmVscyA9IGNvcHkuY2hhbm5lbHNcblxuICBpZiAoJGNoYW5uZWxzKSB7XG4gICAgY29weS5jaGFubmVscyA9IE9ic2VydihudWxsKVxuICB9XG5cbiAgdmFyIG9ic2VydmFibGUgPSBTdHJ1Y3QoY29weSlcblxuICBpZiAoJGNoYW5uZWxzKSB7XG4gICAgb2JzZXJ2YWJsZS5jaGFubmVscy5zZXQoY2hhbm5lbHMoJGNoYW5uZWxzLCBvYnNlcnZhYmxlKSlcbiAgfVxuXG4gIG9ic2VydmFibGUuc2V0ID0gcHJvdGVjdFNldChvYnNlcnZhYmxlKVxuXG4gIHJldHVybiBvYnNlcnZhYmxlXG59XG5cbmZ1bmN0aW9uIGNoYW5uZWxzIChmbnMsIGNvbnRleHQpIHtcbiAgZm5zID0gbWFwVmFsdWVzKGZucywgZnVuY3Rpb24gY3JlYXRlSGFuZGxlIChmbikge1xuICAgIHJldHVybiBEZWxlZ2F0b3IuYWxsb2NhdGVIYW5kbGUoZm4uYmluZChudWxsLCBjb250ZXh0KSlcbiAgfSlcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm5zLCAndG9KU09OJywge1xuICAgIHZhbHVlOiBub29wLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KVxuXG4gIHJldHVybiBmbnNcbn1cblxuZnVuY3Rpb24gcHJvdGVjdFNldCAob2JzZXJ2YWJsZSkge1xuICB2YXIgc2V0ID0gb2JzZXJ2YWJsZS5zZXRcbiAgcmV0dXJuIGZ1bmN0aW9uIHNldFN0YXRlICh2YWx1ZSkge1xuICAgIGlmIChpc09iamVjdCh2YWx1ZSkgJiYgb2JzZXJ2YWJsZS5jaGFubmVscykge1xuICAgICAgdmFsdWUuY2hhbm5lbHMgPSBvYnNlcnZhYmxlLmNoYW5uZWxzKClcbiAgICB9XG4gICAgcmV0dXJuIHNldCh2YWx1ZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBub29wICgpIHt9XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBleHRlbmRcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iLCJ2YXIgY2FtZWxpemUgPSByZXF1aXJlKFwiY2FtZWxpemVcIilcbnZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoXCJzdHJpbmctdGVtcGxhdGVcIilcbnZhciBleHRlbmQgPSByZXF1aXJlKFwieHRlbmQvbXV0YWJsZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFR5cGVkRXJyb3JcblxuZnVuY3Rpb24gVHlwZWRFcnJvcihhcmdzKSB7XG4gICAgaWYgKCFhcmdzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZ3MgaXMgcmVxdWlyZWRcIik7XG4gICAgfVxuICAgIGlmICghYXJncy50eXBlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFyZ3MudHlwZSBpcyByZXF1aXJlZFwiKTtcbiAgICB9XG4gICAgaWYgKCFhcmdzLm1lc3NhZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXJncy5tZXNzYWdlIGlzIHJlcXVpcmVkXCIpO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlID0gYXJncy5tZXNzYWdlXG5cbiAgICBpZiAoYXJncy50eXBlICYmICFhcmdzLm5hbWUpIHtcbiAgICAgICAgdmFyIGVycm9yTmFtZSA9IGNhbWVsaXplKGFyZ3MudHlwZSkgKyBcIkVycm9yXCJcbiAgICAgICAgYXJncy5uYW1lID0gZXJyb3JOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBlcnJvck5hbWUuc3Vic3RyKDEpXG4gICAgfVxuXG4gICAgZXh0ZW5kKGNyZWF0ZUVycm9yLCBhcmdzKTtcbiAgICBjcmVhdGVFcnJvci5fbmFtZSA9IGFyZ3MubmFtZTtcblxuICAgIHJldHVybiBjcmVhdGVFcnJvcjtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG9wdHMpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBFcnJvcigpXG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3VsdCwgXCJ0eXBlXCIsIHtcbiAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudHlwZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9KVxuXG4gICAgICAgIHZhciBvcHRpb25zID0gZXh0ZW5kKHt9LCBhcmdzLCBvcHRzKVxuXG4gICAgICAgIGV4dGVuZChyZXN1bHQsIG9wdGlvbnMpXG4gICAgICAgIHJlc3VsdC5tZXNzYWdlID0gdGVtcGxhdGUobWVzc2FnZSwgb3B0aW9ucylcblxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBPbmVWZXJzaW9uQ29uc3RyYWludCA9IHJlcXVpcmUoJ2luZGl2aWR1YWwvb25lLXZlcnNpb24nKTtcblxudmFyIE1ZX1ZFUlNJT04gPSAnNyc7XG5PbmVWZXJzaW9uQ29uc3RyYWludCgnZXYtc3RvcmUnLCBNWV9WRVJTSU9OKTtcblxudmFyIGhhc2hLZXkgPSAnX19FVl9TVE9SRV9LRVlAJyArIE1ZX1ZFUlNJT047XG5cbm1vZHVsZS5leHBvcnRzID0gRXZTdG9yZTtcblxuZnVuY3Rpb24gRXZTdG9yZShlbGVtKSB7XG4gICAgdmFyIGhhc2ggPSBlbGVtW2hhc2hLZXldO1xuXG4gICAgaWYgKCFoYXNoKSB7XG4gICAgICAgIGhhc2ggPSBlbGVtW2hhc2hLZXldID0ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhc2g7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qZ2xvYmFsIHdpbmRvdywgZ2xvYmFsKi9cblxudmFyIHJvb3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/XG4gICAgd2luZG93IDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgP1xuICAgIGdsb2JhbCA6IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEluZGl2aWR1YWw7XG5cbmZ1bmN0aW9uIEluZGl2aWR1YWwoa2V5LCB2YWx1ZSkge1xuICAgIGlmIChrZXkgaW4gcm9vdCkge1xuICAgICAgICByZXR1cm4gcm9vdFtrZXldO1xuICAgIH1cblxuICAgIHJvb3Rba2V5XSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgSW5kaXZpZHVhbCA9IHJlcXVpcmUoJy4vaW5kZXguanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPbmVWZXJzaW9uO1xuXG5mdW5jdGlvbiBPbmVWZXJzaW9uKG1vZHVsZU5hbWUsIHZlcnNpb24sIGRlZmF1bHRWYWx1ZSkge1xuICAgIHZhciBrZXkgPSAnX19JTkRJVklEVUFMX09ORV9WRVJTSU9OXycgKyBtb2R1bGVOYW1lO1xuICAgIHZhciBlbmZvcmNlS2V5ID0ga2V5ICsgJ19FTkZPUkNFX1NJTkdMRVRPTic7XG5cbiAgICB2YXIgdmVyc2lvblZhbHVlID0gSW5kaXZpZHVhbChlbmZvcmNlS2V5LCB2ZXJzaW9uKTtcblxuICAgIGlmICh2ZXJzaW9uVmFsdWUgIT09IHZlcnNpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gb25seSBoYXZlIG9uZSBjb3B5IG9mICcgK1xuICAgICAgICAgICAgbW9kdWxlTmFtZSArICcuXFxuJyArXG4gICAgICAgICAgICAnWW91IGFscmVhZHkgaGF2ZSB2ZXJzaW9uICcgKyB2ZXJzaW9uVmFsdWUgK1xuICAgICAgICAgICAgJyBpbnN0YWxsZWQuXFxuJyArXG4gICAgICAgICAgICAnVGhpcyBtZWFucyB5b3UgY2Fubm90IGluc3RhbGwgdmVyc2lvbiAnICsgdmVyc2lvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIEluZGl2aWR1YWwoa2V5LCBkZWZhdWx0VmFsdWUpO1xufVxuIiwidmFyIHRvcExldmVsID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOlxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDoge31cbnZhciBtaW5Eb2MgPSByZXF1aXJlKCdtaW4tZG9jdW1lbnQnKTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50O1xufSBlbHNlIHtcbiAgICB2YXIgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddO1xuXG4gICAgaWYgKCFkb2NjeSkge1xuICAgICAgICBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J10gPSBtaW5Eb2M7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBkb2NjeTtcbn1cbiIsInZhciByb290ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgP1xuICAgIHdpbmRvdyA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID9cbiAgICBnbG9iYWwgOiB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbmRpdmlkdWFsXG5cbmZ1bmN0aW9uIEluZGl2aWR1YWwoa2V5LCB2YWx1ZSkge1xuICAgIGlmIChyb290W2tleV0pIHtcbiAgICAgICAgcmV0dXJuIHJvb3Rba2V5XVxuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyb290LCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICwgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSlcblxuICAgIHJldHVybiB2YWx1ZVxufVxuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJ2YXIgaW5zZXJ0ZWQgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzLCBvcHRpb25zKSB7XG4gICAgaWYgKGluc2VydGVkW2Nzc10pIHJldHVybjtcbiAgICBpbnNlcnRlZFtjc3NdID0gdHJ1ZTtcbiAgICBcbiAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcblxuICAgIGlmICgndGV4dENvbnRlbnQnIGluIGVsZW0pIHtcbiAgICAgIGVsZW0udGV4dENvbnRlbnQgPSBjc3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICAgIH1cbiAgICBcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wcmVwZW5kKSB7XG4gICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKGVsZW0sIGhlYWQuY2hpbGROb2Rlc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCkge1xuXHR2YXIgdHlwZSA9IHR5cGVvZiB4O1xuXHRyZXR1cm4geCAhPT0gbnVsbCAmJiAodHlwZSA9PT0gJ29iamVjdCcgfHwgdHlwZSA9PT0gJ2Z1bmN0aW9uJyk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNPYmplY3QoeCkge1xuXHRyZXR1cm4gdHlwZW9mIHggPT09IFwib2JqZWN0XCIgJiYgeCAhPT0gbnVsbDtcbn07XG4iLCJ2YXIgcmFmID0gcmVxdWlyZShcInJhZlwiKVxudmFyIFR5cGVkRXJyb3IgPSByZXF1aXJlKFwiZXJyb3IvdHlwZWRcIilcblxudmFyIEludmFsaWRVcGRhdGVJblJlbmRlciA9IFR5cGVkRXJyb3Ioe1xuICAgIHR5cGU6IFwibWFpbi1sb29wLmludmFsaWQudXBkYXRlLmluLXJlbmRlclwiLFxuICAgIG1lc3NhZ2U6IFwibWFpbi1sb29wOiBVbmV4cGVjdGVkIHVwZGF0ZSBvY2N1cnJlZCBpbiBsb29wLlxcblwiICtcbiAgICAgICAgXCJXZSBhcmUgY3VycmVudGx5IHJlbmRlcmluZyBhIHZpZXcsIFwiICtcbiAgICAgICAgICAgIFwieW91IGNhbid0IGNoYW5nZSBzdGF0ZSByaWdodCBub3cuXFxuXCIgK1xuICAgICAgICBcIlRoZSBkaWZmIGlzOiB7c3RyaW5nRGlmZn0uXFxuXCIgK1xuICAgICAgICBcIlNVR0dFU1RFRCBGSVg6IGZpbmQgdGhlIHN0YXRlIG11dGF0aW9uIGluIHlvdXIgdmlldyBcIiArXG4gICAgICAgICAgICBcIm9yIHJlbmRlcmluZyBmdW5jdGlvbiBhbmQgcmVtb3ZlIGl0LlxcblwiICtcbiAgICAgICAgXCJUaGUgdmlldyBzaG91bGQgbm90IGhhdmUgYW55IHNpZGUgZWZmZWN0cy5cXG5cIixcbiAgICBkaWZmOiBudWxsLFxuICAgIHN0cmluZ0RpZmY6IG51bGxcbn0pXG5cbm1vZHVsZS5leHBvcnRzID0gbWFpblxuXG5mdW5jdGlvbiBtYWluKGluaXRpYWxTdGF0ZSwgdmlldywgb3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9XG5cbiAgICB2YXIgY3VycmVudFN0YXRlID0gaW5pdGlhbFN0YXRlXG4gICAgdmFyIGNyZWF0ZSA9IG9wdHMuY3JlYXRlXG4gICAgdmFyIGRpZmYgPSBvcHRzLmRpZmZcbiAgICB2YXIgcGF0Y2ggPSBvcHRzLnBhdGNoXG4gICAgdmFyIHJlZHJhd1NjaGVkdWxlZCA9IGZhbHNlXG5cbiAgICB2YXIgdHJlZSA9IG9wdHMuaW5pdGlhbFRyZWUgfHwgdmlldyhjdXJyZW50U3RhdGUpXG4gICAgdmFyIHRhcmdldCA9IG9wdHMudGFyZ2V0IHx8IGNyZWF0ZSh0cmVlLCBvcHRzKVxuICAgIHZhciBpblJlbmRlcmluZ1RyYW5zYWN0aW9uID0gZmFsc2VcblxuICAgIGN1cnJlbnRTdGF0ZSA9IG51bGxcblxuICAgIHZhciBsb29wID0ge1xuICAgICAgICBzdGF0ZTogaW5pdGlhbFN0YXRlLFxuICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgdXBkYXRlOiB1cGRhdGVcbiAgICB9XG4gICAgcmV0dXJuIGxvb3BcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZShzdGF0ZSkge1xuICAgICAgICBpZiAoaW5SZW5kZXJpbmdUcmFuc2FjdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgSW52YWxpZFVwZGF0ZUluUmVuZGVyKHtcbiAgICAgICAgICAgICAgICBkaWZmOiBzdGF0ZS5fZGlmZixcbiAgICAgICAgICAgICAgICBzdHJpbmdEaWZmOiBKU09OLnN0cmluZ2lmeShzdGF0ZS5fZGlmZilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFN0YXRlID09PSBudWxsICYmICFyZWRyYXdTY2hlZHVsZWQpIHtcbiAgICAgICAgICAgIHJlZHJhd1NjaGVkdWxlZCA9IHRydWVcbiAgICAgICAgICAgIHJhZihyZWRyYXcpXG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50U3RhdGUgPSBzdGF0ZVxuICAgICAgICBsb29wLnN0YXRlID0gc3RhdGVcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWRyYXcoKSB7XG4gICAgICAgIHJlZHJhd1NjaGVkdWxlZCA9IGZhbHNlXG4gICAgICAgIGlmIChjdXJyZW50U3RhdGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaW5SZW5kZXJpbmdUcmFuc2FjdGlvbiA9IHRydWVcbiAgICAgICAgdmFyIG5ld1RyZWUgPSB2aWV3KGN1cnJlbnRTdGF0ZSlcblxuICAgICAgICBpZiAob3B0cy5jcmVhdGVPbmx5KSB7XG4gICAgICAgICAgICBpblJlbmRlcmluZ1RyYW5zYWN0aW9uID0gZmFsc2VcbiAgICAgICAgICAgIGNyZWF0ZShuZXdUcmVlLCBvcHRzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHBhdGNoZXMgPSBkaWZmKHRyZWUsIG5ld1RyZWUsIG9wdHMpXG4gICAgICAgICAgICBpblJlbmRlcmluZ1RyYW5zYWN0aW9uID0gZmFsc2VcbiAgICAgICAgICAgIHRhcmdldCA9IHBhdGNoKHRhcmdldCwgcGF0Y2hlcywgb3B0cylcbiAgICAgICAgfVxuXG4gICAgICAgIHRyZWUgPSBuZXdUcmVlXG4gICAgICAgIGN1cnJlbnRTdGF0ZSA9IG51bGxcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmosIG1hcCkge1xuXHR2YXIgcmVzdWx0ID0ge307XG5cdGZvciAodmFyIGtleSBpbiBvYmopIHtcblx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcblx0XHRcdHJlc3VsdFtrZXldID0gbWFwKG9ialtrZXldLCBrZXksIG9iaik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIE9ic2VydiA9IHJlcXVpcmUoXCJvYnNlcnZcIilcbnZhciBleHRlbmQgPSByZXF1aXJlKFwieHRlbmRcIilcblxudmFyIGJsYWNrTGlzdCA9IHtcbiAgICBcImxlbmd0aFwiOiBcIkNsYXNoZXMgd2l0aCBgRnVuY3Rpb24ucHJvdG90eXBlLmxlbmd0aGAuXFxuXCIsXG4gICAgXCJuYW1lXCI6IFwiQ2xhc2hlcyB3aXRoIGBGdW5jdGlvbi5wcm90b3R5cGUubmFtZWAuXFxuXCIsXG4gICAgXCJfZGlmZlwiOiBcIl9kaWZmIGlzIHJlc2VydmVkIGtleSBvZiBvYnNlcnYtc3RydWN0LlxcblwiLFxuICAgIFwiX3R5cGVcIjogXCJfdHlwZSBpcyByZXNlcnZlZCBrZXkgb2Ygb2JzZXJ2LXN0cnVjdC5cXG5cIixcbiAgICBcIl92ZXJzaW9uXCI6IFwiX3ZlcnNpb24gaXMgcmVzZXJ2ZWQga2V5IG9mIG9ic2Vydi1zdHJ1Y3QuXFxuXCJcbn1cbnZhciBOT19UUkFOU0FDVElPTiA9IHt9XG5cbmZ1bmN0aW9uIHNldE5vbkVudW1lcmFibGUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICB9KVxufVxuXG4vKiBPYnNlcnZTdHJ1Y3QgOj0gKE9iamVjdDxTdHJpbmcsIE9ic2VydjxUPj4pID0+XG4gICAgT2JqZWN0PFN0cmluZywgT2JzZXJ2PFQ+PiAmXG4gICAgICAgIE9ic2VydjxPYmplY3Q8U3RyaW5nLCBUPiAmIHtcbiAgICAgICAgICAgIF9kaWZmOiBPYmplY3Q8U3RyaW5nLCBBbnk+XG4gICAgICAgIH0+XG5cbiovXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VydlN0cnVjdFxuXG5mdW5jdGlvbiBPYnNlcnZTdHJ1Y3Qoc3RydWN0KSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhzdHJ1Y3QpXG5cbiAgICB2YXIgaW5pdGlhbFN0YXRlID0ge31cbiAgICB2YXIgY3VycmVudFRyYW5zYWN0aW9uID0gTk9fVFJBTlNBQ1RJT05cbiAgICB2YXIgbmVzdGVkVHJhbnNhY3Rpb24gPSBOT19UUkFOU0FDVElPTlxuXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKGJsYWNrTGlzdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjYW5ub3QgY3JlYXRlIGFuIG9ic2Vydi1zdHJ1Y3QgXCIgK1xuICAgICAgICAgICAgICAgIFwid2l0aCBhIGtleSBuYW1lZCAnXCIgKyBrZXkgKyBcIicuXFxuXCIgK1xuICAgICAgICAgICAgICAgIGJsYWNrTGlzdFtrZXldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvYnNlcnYgPSBzdHJ1Y3Rba2V5XVxuICAgICAgICBpbml0aWFsU3RhdGVba2V5XSA9IHR5cGVvZiBvYnNlcnYgPT09IFwiZnVuY3Rpb25cIiA/XG4gICAgICAgICAgICBvYnNlcnYoKSA6IG9ic2VydlxuICAgIH0pXG5cbiAgICB2YXIgb2JzID0gT2JzZXJ2KGluaXRpYWxTdGF0ZSlcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgb2JzZXJ2ID0gc3RydWN0W2tleV1cbiAgICAgICAgb2JzW2tleV0gPSBvYnNlcnZcblxuICAgICAgICBpZiAodHlwZW9mIG9ic2VydiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBvYnNlcnYoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5lc3RlZFRyYW5zYWN0aW9uID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBleHRlbmQob2JzKCkpXG4gICAgICAgICAgICAgICAgc3RhdGVba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgdmFyIGRpZmYgPSB7fVxuICAgICAgICAgICAgICAgIGRpZmZba2V5XSA9IHZhbHVlICYmIHZhbHVlLl9kaWZmID9cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuX2RpZmYgOiB2YWx1ZVxuXG4gICAgICAgICAgICAgICAgc2V0Tm9uRW51bWVyYWJsZShzdGF0ZSwgXCJfZGlmZlwiLCBkaWZmKVxuICAgICAgICAgICAgICAgIGN1cnJlbnRUcmFuc2FjdGlvbiA9IHN0YXRlXG4gICAgICAgICAgICAgICAgb2JzLnNldChzdGF0ZSlcbiAgICAgICAgICAgICAgICBjdXJyZW50VHJhbnNhY3Rpb24gPSBOT19UUkFOU0FDVElPTlxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pXG4gICAgdmFyIF9zZXQgPSBvYnMuc2V0XG4gICAgb2JzLnNldCA9IGZ1bmN0aW9uIHRyYWNrRGlmZih2YWx1ZSkge1xuICAgICAgICBpZiAoY3VycmVudFRyYW5zYWN0aW9uID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIF9zZXQodmFsdWUpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV3U3RhdGUgPSBleHRlbmQodmFsdWUpXG4gICAgICAgIHNldE5vbkVudW1lcmFibGUobmV3U3RhdGUsIFwiX2RpZmZcIiwgdmFsdWUpXG4gICAgICAgIF9zZXQobmV3U3RhdGUpXG4gICAgfVxuXG4gICAgb2JzKGZ1bmN0aW9uIChuZXdTdGF0ZSkge1xuICAgICAgICBpZiAoY3VycmVudFRyYW5zYWN0aW9uID09PSBuZXdTdGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIG9ic2VydiA9IHN0cnVjdFtrZXldXG4gICAgICAgICAgICB2YXIgbmV3T2JzZXJ2VmFsdWUgPSBuZXdTdGF0ZVtrZXldXG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JzZXJ2ID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgICAgICBvYnNlcnYoKSAhPT0gbmV3T2JzZXJ2VmFsdWVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIG5lc3RlZFRyYW5zYWN0aW9uID0gbmV3T2JzZXJ2VmFsdWVcbiAgICAgICAgICAgICAgICBvYnNlcnYuc2V0KG5ld1N0YXRlW2tleV0pXG4gICAgICAgICAgICAgICAgbmVzdGVkVHJhbnNhY3Rpb24gPSBOT19UUkFOU0FDVElPTlxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICBvYnMuX3R5cGUgPSBcIm9ic2Vydi1zdHJ1Y3RcIlxuICAgIG9icy5fdmVyc2lvbiA9IFwiNVwiXG5cbiAgICByZXR1cm4gb2JzXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBPYnNlcnZhYmxlXG5cbmZ1bmN0aW9uIE9ic2VydmFibGUodmFsdWUpIHtcbiAgICB2YXIgbGlzdGVuZXJzID0gW11cbiAgICB2YWx1ZSA9IHZhbHVlID09PSB1bmRlZmluZWQgPyBudWxsIDogdmFsdWVcblxuICAgIG9ic2VydmFibGUuc2V0ID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdmFsdWUgPSB2XG4gICAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG4gICAgICAgICAgICBmKHYpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG9ic2VydmFibGVcblxuICAgIGZ1bmN0aW9uIG9ic2VydmFibGUobGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgIH1cblxuICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcilcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lciksIDEpXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuNi4zXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBnZXROYW5vU2Vjb25kcywgaHJ0aW1lLCBsb2FkVGltZTtcblxuICBpZiAoKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCkgJiYgcGVyZm9ybWFuY2Uubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9O1xuICB9IGVsc2UgaWYgKCh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzICE9PSBudWxsKSAmJiBwcm9jZXNzLmhydGltZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKGdldE5hbm9TZWNvbmRzKCkgLSBsb2FkVGltZSkgLyAxZTY7XG4gICAgfTtcbiAgICBocnRpbWUgPSBwcm9jZXNzLmhydGltZTtcbiAgICBnZXROYW5vU2Vjb25kcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGhyO1xuICAgICAgaHIgPSBocnRpbWUoKTtcbiAgICAgIHJldHVybiBoclswXSAqIDFlOSArIGhyWzFdO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBnZXROYW5vU2Vjb25kcygpO1xuICB9IGVsc2UgaWYgKERhdGUubm93KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbG9hZFRpbWU7XG4gICAgfTtcbiAgICBsb2FkVGltZSA9IERhdGUubm93KCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGxvYWRUaW1lO1xuICAgIH07XG4gICAgbG9hZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuXG4vKlxuLy9AIHNvdXJjZU1hcHBpbmdVUkw9cGVyZm9ybWFuY2Utbm93Lm1hcFxuKi9cbiIsInZhciBub3cgPSByZXF1aXJlKCdwZXJmb3JtYW5jZS1ub3cnKVxuICAsIGdsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8ge30gOiB3aW5kb3dcbiAgLCB2ZW5kb3JzID0gWydtb3onLCAnd2Via2l0J11cbiAgLCBzdWZmaXggPSAnQW5pbWF0aW9uRnJhbWUnXG4gICwgcmFmID0gZ2xvYmFsWydyZXF1ZXN0JyArIHN1ZmZpeF1cbiAgLCBjYWYgPSBnbG9iYWxbJ2NhbmNlbCcgKyBzdWZmaXhdIHx8IGdsb2JhbFsnY2FuY2VsUmVxdWVzdCcgKyBzdWZmaXhdXG4gICwgaXNOYXRpdmUgPSB0cnVlXG5cbmZvcih2YXIgaSA9IDA7IGkgPCB2ZW5kb3JzLmxlbmd0aCAmJiAhcmFmOyBpKyspIHtcbiAgcmFmID0gZ2xvYmFsW3ZlbmRvcnNbaV0gKyAnUmVxdWVzdCcgKyBzdWZmaXhdXG4gIGNhZiA9IGdsb2JhbFt2ZW5kb3JzW2ldICsgJ0NhbmNlbCcgKyBzdWZmaXhdXG4gICAgICB8fCBnbG9iYWxbdmVuZG9yc1tpXSArICdDYW5jZWxSZXF1ZXN0JyArIHN1ZmZpeF1cbn1cblxuLy8gU29tZSB2ZXJzaW9ucyBvZiBGRiBoYXZlIHJBRiBidXQgbm90IGNBRlxuaWYoIXJhZiB8fCAhY2FmKSB7XG4gIGlzTmF0aXZlID0gZmFsc2VcblxuICB2YXIgbGFzdCA9IDBcbiAgICAsIGlkID0gMFxuICAgICwgcXVldWUgPSBbXVxuICAgICwgZnJhbWVEdXJhdGlvbiA9IDEwMDAgLyA2MFxuXG4gIHJhZiA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYocXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB2YXIgX25vdyA9IG5vdygpXG4gICAgICAgICwgbmV4dCA9IE1hdGgubWF4KDAsIGZyYW1lRHVyYXRpb24gLSAoX25vdyAtIGxhc3QpKVxuICAgICAgbGFzdCA9IG5leHQgKyBfbm93XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3AgPSBxdWV1ZS5zbGljZSgwKVxuICAgICAgICAvLyBDbGVhciBxdWV1ZSBoZXJlIHRvIHByZXZlbnRcbiAgICAgICAgLy8gY2FsbGJhY2tzIGZyb20gYXBwZW5kaW5nIGxpc3RlbmVyc1xuICAgICAgICAvLyB0byB0aGUgY3VycmVudCBmcmFtZSdzIHF1ZXVlXG4gICAgICAgIHF1ZXVlLmxlbmd0aCA9IDBcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGNwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYoIWNwW2ldLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICBjcFtpXS5jYWxsYmFjayhsYXN0KVxuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGUgfSwgMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIE1hdGgucm91bmQobmV4dCkpXG4gICAgfVxuICAgIHF1ZXVlLnB1c2goe1xuICAgICAgaGFuZGxlOiArK2lkLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgY2FuY2VsbGVkOiBmYWxzZVxuICAgIH0pXG4gICAgcmV0dXJuIGlkXG4gIH1cblxuICBjYWYgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKHF1ZXVlW2ldLmhhbmRsZSA9PT0gaGFuZGxlKSB7XG4gICAgICAgIHF1ZXVlW2ldLmNhbmNlbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbikge1xuICAvLyBXcmFwIGluIGEgbmV3IGZ1bmN0aW9uIHRvIHByZXZlbnRcbiAgLy8gYGNhbmNlbGAgcG90ZW50aWFsbHkgYmVpbmcgYXNzaWduZWRcbiAgLy8gdG8gdGhlIG5hdGl2ZSByQUYgZnVuY3Rpb25cbiAgaWYoIWlzTmF0aXZlKSB7XG4gICAgcmV0dXJuIHJhZi5jYWxsKGdsb2JhbCwgZm4pXG4gIH1cbiAgcmV0dXJuIHJhZi5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKSB7XG4gICAgdHJ5e1xuICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZSB9LCAwKVxuICAgIH1cbiAgfSlcbn1cbm1vZHVsZS5leHBvcnRzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuICBjYWYuYXBwbHkoZ2xvYmFsLCBhcmd1bWVudHMpXG59XG4iLCJ2YXIgbmFyZ3MgPSAvXFx7KFswLTlhLXpBLVpdKylcXH0vZ1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG5cbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGVcblxuZnVuY3Rpb24gdGVtcGxhdGUoc3RyaW5nKSB7XG4gICAgdmFyIGFyZ3NcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIHR5cGVvZiBhcmd1bWVudHNbMV0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50c1sxXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICB9XG5cbiAgICBpZiAoIWFyZ3MgfHwgIWFyZ3MuaGFzT3duUHJvcGVydHkpIHtcbiAgICAgICAgYXJncyA9IHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKG5hcmdzLCBmdW5jdGlvbiByZXBsYWNlQXJnKG1hdGNoLCBpLCBpbmRleCkge1xuICAgICAgICB2YXIgcmVzdWx0XG5cbiAgICAgICAgaWYgKHN0cmluZ1tpbmRleCAtIDFdID09PSBcIntcIiAmJlxuICAgICAgICAgICAgc3RyaW5nW2luZGV4ICsgbWF0Y2gubGVuZ3RoXSA9PT0gXCJ9XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBhcmdzLmhhc093blByb3BlcnR5KGkpID8gYXJnc1tpXSA6IG51bGxcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgcmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH1cbiAgICB9KVxufVxuIiwidmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKFwiLi92ZG9tL2NyZWF0ZS1lbGVtZW50LmpzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRWxlbWVudFxuIiwidmFyIGRpZmYgPSByZXF1aXJlKFwiLi92dHJlZS9kaWZmLmpzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZGlmZlxuIiwidmFyIGggPSByZXF1aXJlKFwiLi92aXJ0dWFsLWh5cGVyc2NyaXB0L2luZGV4LmpzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gaFxuIiwidmFyIGRpZmYgPSByZXF1aXJlKFwiLi9kaWZmLmpzXCIpXHJcbnZhciBwYXRjaCA9IHJlcXVpcmUoXCIuL3BhdGNoLmpzXCIpXHJcbnZhciBoID0gcmVxdWlyZShcIi4vaC5qc1wiKVxyXG52YXIgY3JlYXRlID0gcmVxdWlyZShcIi4vY3JlYXRlLWVsZW1lbnQuanNcIilcclxudmFyIFZOb2RlID0gcmVxdWlyZSgnLi92bm9kZS92bm9kZS5qcycpXHJcbnZhciBWVGV4dCA9IHJlcXVpcmUoJy4vdm5vZGUvdnRleHQuanMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBkaWZmOiBkaWZmLFxyXG4gICAgcGF0Y2g6IHBhdGNoLFxyXG4gICAgaDogaCxcclxuICAgIGNyZWF0ZTogY3JlYXRlLFxyXG4gICAgVk5vZGU6IFZOb2RlLFxyXG4gICAgVlRleHQ6IFZUZXh0XHJcbn1cclxuIiwidmFyIHBhdGNoID0gcmVxdWlyZShcIi4vdmRvbS9wYXRjaC5qc1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGNoXG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKFwiaXMtb2JqZWN0XCIpXG52YXIgaXNIb29rID0gcmVxdWlyZShcIi4uL3Zub2RlL2lzLXZob29rLmpzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHlQcm9wZXJ0aWVzXG5cbmZ1bmN0aW9uIGFwcGx5UHJvcGVydGllcyhub2RlLCBwcm9wcywgcHJldmlvdXMpIHtcbiAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBwcm9wcykge1xuICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdXG5cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZW1vdmVQcm9wZXJ0eShub2RlLCBwcm9wTmFtZSwgcHJvcFZhbHVlLCBwcmV2aW91cyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNIb29rKHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICAgIHJlbW92ZVByb3BlcnR5KG5vZGUsIHByb3BOYW1lLCBwcm9wVmFsdWUsIHByZXZpb3VzKVxuICAgICAgICAgICAgaWYgKHByb3BWYWx1ZS5ob29rKSB7XG4gICAgICAgICAgICAgICAgcHJvcFZhbHVlLmhvb2sobm9kZSxcbiAgICAgICAgICAgICAgICAgICAgcHJvcE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzID8gcHJldmlvdXNbcHJvcE5hbWVdIDogdW5kZWZpbmVkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBwYXRjaE9iamVjdChub2RlLCBwcm9wcywgcHJldmlvdXMsIHByb3BOYW1lLCBwcm9wVmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVQcm9wZXJ0eShub2RlLCBwcm9wTmFtZSwgcHJvcFZhbHVlLCBwcmV2aW91cykge1xuICAgIGlmIChwcmV2aW91cykge1xuICAgICAgICB2YXIgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzW3Byb3BOYW1lXVxuXG4gICAgICAgIGlmICghaXNIb29rKHByZXZpb3VzVmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAocHJvcE5hbWUgPT09IFwiYXR0cmlidXRlc1wiKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BOYW1lID09PSBcInN0eWxlXCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5zdHlsZVtpXSA9IFwiXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgbm9kZVtwcm9wTmFtZV0gPSBcIlwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGVbcHJvcE5hbWVdID0gbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHByZXZpb3VzVmFsdWUudW5ob29rKSB7XG4gICAgICAgICAgICBwcmV2aW91c1ZhbHVlLnVuaG9vayhub2RlLCBwcm9wTmFtZSwgcHJvcFZhbHVlKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBwYXRjaE9iamVjdChub2RlLCBwcm9wcywgcHJldmlvdXMsIHByb3BOYW1lLCBwcm9wVmFsdWUpIHtcbiAgICB2YXIgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzID8gcHJldmlvdXNbcHJvcE5hbWVdIDogdW5kZWZpbmVkXG5cbiAgICAvLyBTZXQgYXR0cmlidXRlc1xuICAgIGlmIChwcm9wTmFtZSA9PT0gXCJhdHRyaWJ1dGVzXCIpIHtcbiAgICAgICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgYXR0clZhbHVlID0gcHJvcFZhbHVlW2F0dHJOYW1lXVxuXG4gICAgICAgICAgICBpZiAoYXR0clZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmKHByZXZpb3VzVmFsdWUgJiYgaXNPYmplY3QocHJldmlvdXNWYWx1ZSkgJiZcbiAgICAgICAgZ2V0UHJvdG90eXBlKHByZXZpb3VzVmFsdWUpICE9PSBnZXRQcm90b3R5cGUocHJvcFZhbHVlKSkge1xuICAgICAgICBub2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZVxuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIWlzT2JqZWN0KG5vZGVbcHJvcE5hbWVdKSkge1xuICAgICAgICBub2RlW3Byb3BOYW1lXSA9IHt9XG4gICAgfVxuXG4gICAgdmFyIHJlcGxhY2VyID0gcHJvcE5hbWUgPT09IFwic3R5bGVcIiA/IFwiXCIgOiB1bmRlZmluZWRcblxuICAgIGZvciAodmFyIGsgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHByb3BWYWx1ZVtrXVxuICAgICAgICBub2RlW3Byb3BOYW1lXVtrXSA9ICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IHJlcGxhY2VyIDogdmFsdWVcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFByb3RvdHlwZSh2YWx1ZSkge1xuICAgIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSlcbiAgICB9IGVsc2UgaWYgKHZhbHVlLl9fcHJvdG9fXykge1xuICAgICAgICByZXR1cm4gdmFsdWUuX19wcm90b19fXG4gICAgfSBlbHNlIGlmICh2YWx1ZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICByZXR1cm4gdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlXG4gICAgfVxufVxuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZShcImdsb2JhbC9kb2N1bWVudFwiKVxuXG52YXIgYXBwbHlQcm9wZXJ0aWVzID0gcmVxdWlyZShcIi4vYXBwbHktcHJvcGVydGllc1wiKVxuXG52YXIgaXNWTm9kZSA9IHJlcXVpcmUoXCIuLi92bm9kZS9pcy12bm9kZS5qc1wiKVxudmFyIGlzVlRleHQgPSByZXF1aXJlKFwiLi4vdm5vZGUvaXMtdnRleHQuanNcIilcbnZhciBpc1dpZGdldCA9IHJlcXVpcmUoXCIuLi92bm9kZS9pcy13aWRnZXQuanNcIilcbnZhciBoYW5kbGVUaHVuayA9IHJlcXVpcmUoXCIuLi92bm9kZS9oYW5kbGUtdGh1bmsuanNcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVFbGVtZW50XG5cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodm5vZGUsIG9wdHMpIHtcbiAgICB2YXIgZG9jID0gb3B0cyA/IG9wdHMuZG9jdW1lbnQgfHwgZG9jdW1lbnQgOiBkb2N1bWVudFxuICAgIHZhciB3YXJuID0gb3B0cyA/IG9wdHMud2FybiA6IG51bGxcblxuICAgIHZub2RlID0gaGFuZGxlVGh1bmsodm5vZGUpLmFcblxuICAgIGlmIChpc1dpZGdldCh2bm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIHZub2RlLmluaXQoKVxuICAgIH0gZWxzZSBpZiAoaXNWVGV4dCh2bm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIGRvYy5jcmVhdGVUZXh0Tm9kZSh2bm9kZS50ZXh0KVxuICAgIH0gZWxzZSBpZiAoIWlzVk5vZGUodm5vZGUpKSB7XG4gICAgICAgIGlmICh3YXJuKSB7XG4gICAgICAgICAgICB3YXJuKFwiSXRlbSBpcyBub3QgYSB2YWxpZCB2aXJ0dWFsIGRvbSBub2RlXCIsIHZub2RlKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgdmFyIG5vZGUgPSAodm5vZGUubmFtZXNwYWNlID09PSBudWxsKSA/XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50KHZub2RlLnRhZ05hbWUpIDpcbiAgICAgICAgZG9jLmNyZWF0ZUVsZW1lbnROUyh2bm9kZS5uYW1lc3BhY2UsIHZub2RlLnRhZ05hbWUpXG5cbiAgICB2YXIgcHJvcHMgPSB2bm9kZS5wcm9wZXJ0aWVzXG4gICAgYXBwbHlQcm9wZXJ0aWVzKG5vZGUsIHByb3BzKVxuXG4gICAgdmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkTm9kZSA9IGNyZWF0ZUVsZW1lbnQoY2hpbGRyZW5baV0sIG9wdHMpXG4gICAgICAgIGlmIChjaGlsZE5vZGUpIHtcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoY2hpbGROb2RlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGVcbn1cbiIsIi8vIE1hcHMgYSB2aXJ0dWFsIERPTSB0cmVlIG9udG8gYSByZWFsIERPTSB0cmVlIGluIGFuIGVmZmljaWVudCBtYW5uZXIuXG4vLyBXZSBkb24ndCB3YW50IHRvIHJlYWQgYWxsIG9mIHRoZSBET00gbm9kZXMgaW4gdGhlIHRyZWUgc28gd2UgdXNlXG4vLyB0aGUgaW4tb3JkZXIgdHJlZSBpbmRleGluZyB0byBlbGltaW5hdGUgcmVjdXJzaW9uIGRvd24gY2VydGFpbiBicmFuY2hlcy5cbi8vIFdlIG9ubHkgcmVjdXJzZSBpbnRvIGEgRE9NIG5vZGUgaWYgd2Uga25vdyB0aGF0IGl0IGNvbnRhaW5zIGEgY2hpbGQgb2Zcbi8vIGludGVyZXN0LlxuXG52YXIgbm9DaGlsZCA9IHt9XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tSW5kZXhcblxuZnVuY3Rpb24gZG9tSW5kZXgocm9vdE5vZGUsIHRyZWUsIGluZGljZXMsIG5vZGVzKSB7XG4gICAgaWYgKCFpbmRpY2VzIHx8IGluZGljZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7fVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGljZXMuc29ydChhc2NlbmRpbmcpXG4gICAgICAgIHJldHVybiByZWN1cnNlKHJvb3ROb2RlLCB0cmVlLCBpbmRpY2VzLCBub2RlcywgMClcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlY3Vyc2Uocm9vdE5vZGUsIHRyZWUsIGluZGljZXMsIG5vZGVzLCByb290SW5kZXgpIHtcbiAgICBub2RlcyA9IG5vZGVzIHx8IHt9XG5cblxuICAgIGlmIChyb290Tm9kZSkge1xuICAgICAgICBpZiAoaW5kZXhJblJhbmdlKGluZGljZXMsIHJvb3RJbmRleCwgcm9vdEluZGV4KSkge1xuICAgICAgICAgICAgbm9kZXNbcm9vdEluZGV4XSA9IHJvb3ROb2RlXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdkNoaWxkcmVuID0gdHJlZS5jaGlsZHJlblxuXG4gICAgICAgIGlmICh2Q2hpbGRyZW4pIHtcblxuICAgICAgICAgICAgdmFyIGNoaWxkTm9kZXMgPSByb290Tm9kZS5jaGlsZE5vZGVzXG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJvb3RJbmRleCArPSAxXG5cbiAgICAgICAgICAgICAgICB2YXIgdkNoaWxkID0gdkNoaWxkcmVuW2ldIHx8IG5vQ2hpbGRcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEluZGV4ID0gcm9vdEluZGV4ICsgKHZDaGlsZC5jb3VudCB8fCAwKVxuXG4gICAgICAgICAgICAgICAgLy8gc2tpcCByZWN1cnNpb24gZG93biB0aGUgdHJlZSBpZiB0aGVyZSBhcmUgbm8gbm9kZXMgZG93biBoZXJlXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4SW5SYW5nZShpbmRpY2VzLCByb290SW5kZXgsIG5leHRJbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShjaGlsZE5vZGVzW2ldLCB2Q2hpbGQsIGluZGljZXMsIG5vZGVzLCByb290SW5kZXgpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcm9vdEluZGV4ID0gbmV4dEluZGV4XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZXNcbn1cblxuLy8gQmluYXJ5IHNlYXJjaCBmb3IgYW4gaW5kZXggaW4gdGhlIGludGVydmFsIFtsZWZ0LCByaWdodF1cbmZ1bmN0aW9uIGluZGV4SW5SYW5nZShpbmRpY2VzLCBsZWZ0LCByaWdodCkge1xuICAgIGlmIChpbmRpY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICB2YXIgbWluSW5kZXggPSAwXG4gICAgdmFyIG1heEluZGV4ID0gaW5kaWNlcy5sZW5ndGggLSAxXG4gICAgdmFyIGN1cnJlbnRJbmRleFxuICAgIHZhciBjdXJyZW50SXRlbVxuXG4gICAgd2hpbGUgKG1pbkluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9ICgobWF4SW5kZXggKyBtaW5JbmRleCkgLyAyKSA+PiAwXG4gICAgICAgIGN1cnJlbnRJdGVtID0gaW5kaWNlc1tjdXJyZW50SW5kZXhdXG5cbiAgICAgICAgaWYgKG1pbkluZGV4ID09PSBtYXhJbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRJdGVtID49IGxlZnQgJiYgY3VycmVudEl0ZW0gPD0gcmlnaHRcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50SXRlbSA8IGxlZnQpIHtcbiAgICAgICAgICAgIG1pbkluZGV4ID0gY3VycmVudEluZGV4ICsgMVxuICAgICAgICB9IGVsc2UgIGlmIChjdXJyZW50SXRlbSA+IHJpZ2h0KSB7XG4gICAgICAgICAgICBtYXhJbmRleCA9IGN1cnJlbnRJbmRleCAtIDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGFzY2VuZGluZyhhLCBiKSB7XG4gICAgcmV0dXJuIGEgPiBiID8gMSA6IC0xXG59XG4iLCJ2YXIgYXBwbHlQcm9wZXJ0aWVzID0gcmVxdWlyZShcIi4vYXBwbHktcHJvcGVydGllc1wiKVxuXG52YXIgaXNXaWRnZXQgPSByZXF1aXJlKFwiLi4vdm5vZGUvaXMtd2lkZ2V0LmpzXCIpXG52YXIgVlBhdGNoID0gcmVxdWlyZShcIi4uL3Zub2RlL3ZwYXRjaC5qc1wiKVxuXG52YXIgdXBkYXRlV2lkZ2V0ID0gcmVxdWlyZShcIi4vdXBkYXRlLXdpZGdldFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGx5UGF0Y2hcblxuZnVuY3Rpb24gYXBwbHlQYXRjaCh2cGF0Y2gsIGRvbU5vZGUsIHJlbmRlck9wdGlvbnMpIHtcbiAgICB2YXIgdHlwZSA9IHZwYXRjaC50eXBlXG4gICAgdmFyIHZOb2RlID0gdnBhdGNoLnZOb2RlXG4gICAgdmFyIHBhdGNoID0gdnBhdGNoLnBhdGNoXG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBWUGF0Y2guUkVNT1ZFOlxuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZU5vZGUoZG9tTm9kZSwgdk5vZGUpXG4gICAgICAgIGNhc2UgVlBhdGNoLklOU0VSVDpcbiAgICAgICAgICAgIHJldHVybiBpbnNlcnROb2RlKGRvbU5vZGUsIHBhdGNoLCByZW5kZXJPcHRpb25zKVxuICAgICAgICBjYXNlIFZQYXRjaC5WVEVYVDpcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdQYXRjaChkb21Ob2RlLCB2Tm9kZSwgcGF0Y2gsIHJlbmRlck9wdGlvbnMpXG4gICAgICAgIGNhc2UgVlBhdGNoLldJREdFVDpcbiAgICAgICAgICAgIHJldHVybiB3aWRnZXRQYXRjaChkb21Ob2RlLCB2Tm9kZSwgcGF0Y2gsIHJlbmRlck9wdGlvbnMpXG4gICAgICAgIGNhc2UgVlBhdGNoLlZOT0RFOlxuICAgICAgICAgICAgcmV0dXJuIHZOb2RlUGF0Y2goZG9tTm9kZSwgdk5vZGUsIHBhdGNoLCByZW5kZXJPcHRpb25zKVxuICAgICAgICBjYXNlIFZQYXRjaC5PUkRFUjpcbiAgICAgICAgICAgIHJlb3JkZXJDaGlsZHJlbihkb21Ob2RlLCBwYXRjaClcbiAgICAgICAgICAgIHJldHVybiBkb21Ob2RlXG4gICAgICAgIGNhc2UgVlBhdGNoLlBST1BTOlxuICAgICAgICAgICAgYXBwbHlQcm9wZXJ0aWVzKGRvbU5vZGUsIHBhdGNoLCB2Tm9kZS5wcm9wZXJ0aWVzKVxuICAgICAgICAgICAgcmV0dXJuIGRvbU5vZGVcbiAgICAgICAgY2FzZSBWUGF0Y2guVEhVTks6XG4gICAgICAgICAgICByZXR1cm4gcmVwbGFjZVJvb3QoZG9tTm9kZSxcbiAgICAgICAgICAgICAgICByZW5kZXJPcHRpb25zLnBhdGNoKGRvbU5vZGUsIHBhdGNoLCByZW5kZXJPcHRpb25zKSlcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBkb21Ob2RlXG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVOb2RlKGRvbU5vZGUsIHZOb2RlKSB7XG4gICAgdmFyIHBhcmVudE5vZGUgPSBkb21Ob2RlLnBhcmVudE5vZGVcblxuICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZSlcbiAgICB9XG5cbiAgICBkZXN0cm95V2lkZ2V0KGRvbU5vZGUsIHZOb2RlKTtcblxuICAgIHJldHVybiBudWxsXG59XG5cbmZ1bmN0aW9uIGluc2VydE5vZGUocGFyZW50Tm9kZSwgdk5vZGUsIHJlbmRlck9wdGlvbnMpIHtcbiAgICB2YXIgbmV3Tm9kZSA9IHJlbmRlck9wdGlvbnMucmVuZGVyKHZOb2RlLCByZW5kZXJPcHRpb25zKVxuXG4gICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChuZXdOb2RlKVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnROb2RlXG59XG5cbmZ1bmN0aW9uIHN0cmluZ1BhdGNoKGRvbU5vZGUsIGxlZnRWTm9kZSwgdlRleHQsIHJlbmRlck9wdGlvbnMpIHtcbiAgICB2YXIgbmV3Tm9kZVxuXG4gICAgaWYgKGRvbU5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgZG9tTm9kZS5yZXBsYWNlRGF0YSgwLCBkb21Ob2RlLmxlbmd0aCwgdlRleHQudGV4dClcbiAgICAgICAgbmV3Tm9kZSA9IGRvbU5vZGVcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IGRvbU5vZGUucGFyZW50Tm9kZVxuICAgICAgICBuZXdOb2RlID0gcmVuZGVyT3B0aW9ucy5yZW5kZXIodlRleHQsIHJlbmRlck9wdGlvbnMpXG5cbiAgICAgICAgaWYgKHBhcmVudE5vZGUgJiYgbmV3Tm9kZSAhPT0gZG9tTm9kZSkge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgZG9tTm9kZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdOb2RlXG59XG5cbmZ1bmN0aW9uIHdpZGdldFBhdGNoKGRvbU5vZGUsIGxlZnRWTm9kZSwgd2lkZ2V0LCByZW5kZXJPcHRpb25zKSB7XG4gICAgdmFyIHVwZGF0aW5nID0gdXBkYXRlV2lkZ2V0KGxlZnRWTm9kZSwgd2lkZ2V0KVxuICAgIHZhciBuZXdOb2RlXG5cbiAgICBpZiAodXBkYXRpbmcpIHtcbiAgICAgICAgbmV3Tm9kZSA9IHdpZGdldC51cGRhdGUobGVmdFZOb2RlLCBkb21Ob2RlKSB8fCBkb21Ob2RlXG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV3Tm9kZSA9IHJlbmRlck9wdGlvbnMucmVuZGVyKHdpZGdldCwgcmVuZGVyT3B0aW9ucylcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50Tm9kZSA9IGRvbU5vZGUucGFyZW50Tm9kZVxuXG4gICAgaWYgKHBhcmVudE5vZGUgJiYgbmV3Tm9kZSAhPT0gZG9tTm9kZSkge1xuICAgICAgICBwYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdOb2RlLCBkb21Ob2RlKVxuICAgIH1cblxuICAgIGlmICghdXBkYXRpbmcpIHtcbiAgICAgICAgZGVzdHJveVdpZGdldChkb21Ob2RlLCBsZWZ0Vk5vZGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld05vZGVcbn1cblxuZnVuY3Rpb24gdk5vZGVQYXRjaChkb21Ob2RlLCBsZWZ0Vk5vZGUsIHZOb2RlLCByZW5kZXJPcHRpb25zKSB7XG4gICAgdmFyIHBhcmVudE5vZGUgPSBkb21Ob2RlLnBhcmVudE5vZGVcbiAgICB2YXIgbmV3Tm9kZSA9IHJlbmRlck9wdGlvbnMucmVuZGVyKHZOb2RlLCByZW5kZXJPcHRpb25zKVxuXG4gICAgaWYgKHBhcmVudE5vZGUgJiYgbmV3Tm9kZSAhPT0gZG9tTm9kZSkge1xuICAgICAgICBwYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdOb2RlLCBkb21Ob2RlKVxuICAgIH1cblxuICAgIHJldHVybiBuZXdOb2RlXG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lXaWRnZXQoZG9tTm9kZSwgdykge1xuICAgIGlmICh0eXBlb2Ygdy5kZXN0cm95ID09PSBcImZ1bmN0aW9uXCIgJiYgaXNXaWRnZXQodykpIHtcbiAgICAgICAgdy5kZXN0cm95KGRvbU5vZGUpXG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW9yZGVyQ2hpbGRyZW4oZG9tTm9kZSwgbW92ZXMpIHtcbiAgICB2YXIgY2hpbGROb2RlcyA9IGRvbU5vZGUuY2hpbGROb2Rlc1xuICAgIHZhciBrZXlNYXAgPSB7fVxuICAgIHZhciBub2RlXG4gICAgdmFyIHJlbW92ZVxuICAgIHZhciBpbnNlcnRcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW92ZXMucmVtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICByZW1vdmUgPSBtb3Zlcy5yZW1vdmVzW2ldXG4gICAgICAgIG5vZGUgPSBjaGlsZE5vZGVzW3JlbW92ZS5mcm9tXVxuICAgICAgICBpZiAocmVtb3ZlLmtleSkge1xuICAgICAgICAgICAga2V5TWFwW3JlbW92ZS5rZXldID0gbm9kZVxuICAgICAgICB9XG4gICAgICAgIGRvbU5vZGUucmVtb3ZlQ2hpbGQobm9kZSlcbiAgICB9XG5cbiAgICB2YXIgbGVuZ3RoID0gY2hpbGROb2Rlcy5sZW5ndGhcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1vdmVzLmluc2VydHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaW5zZXJ0ID0gbW92ZXMuaW5zZXJ0c1tqXVxuICAgICAgICBub2RlID0ga2V5TWFwW2luc2VydC5rZXldXG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIHdlaXJkZXN0IGJ1ZyBpJ3ZlIGV2ZXIgc2VlbiBpbiB3ZWJraXRcbiAgICAgICAgZG9tTm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgaW5zZXJ0LnRvID49IGxlbmd0aCsrID8gbnVsbCA6IGNoaWxkTm9kZXNbaW5zZXJ0LnRvXSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VSb290KG9sZFJvb3QsIG5ld1Jvb3QpIHtcbiAgICBpZiAob2xkUm9vdCAmJiBuZXdSb290ICYmIG9sZFJvb3QgIT09IG5ld1Jvb3QgJiYgb2xkUm9vdC5wYXJlbnROb2RlKSB7XG4gICAgICAgIG9sZFJvb3QucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Um9vdCwgb2xkUm9vdClcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Um9vdDtcbn1cbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoXCJnbG9iYWwvZG9jdW1lbnRcIilcbnZhciBpc0FycmF5ID0gcmVxdWlyZShcIngtaXMtYXJyYXlcIilcblxudmFyIHJlbmRlciA9IHJlcXVpcmUoXCIuL2NyZWF0ZS1lbGVtZW50XCIpXG52YXIgZG9tSW5kZXggPSByZXF1aXJlKFwiLi9kb20taW5kZXhcIilcbnZhciBwYXRjaE9wID0gcmVxdWlyZShcIi4vcGF0Y2gtb3BcIilcbm1vZHVsZS5leHBvcnRzID0gcGF0Y2hcblxuZnVuY3Rpb24gcGF0Y2gocm9vdE5vZGUsIHBhdGNoZXMsIHJlbmRlck9wdGlvbnMpIHtcbiAgICByZW5kZXJPcHRpb25zID0gcmVuZGVyT3B0aW9ucyB8fCB7fVxuICAgIHJlbmRlck9wdGlvbnMucGF0Y2ggPSByZW5kZXJPcHRpb25zLnBhdGNoICYmIHJlbmRlck9wdGlvbnMucGF0Y2ggIT09IHBhdGNoXG4gICAgICAgID8gcmVuZGVyT3B0aW9ucy5wYXRjaFxuICAgICAgICA6IHBhdGNoUmVjdXJzaXZlXG4gICAgcmVuZGVyT3B0aW9ucy5yZW5kZXIgPSByZW5kZXJPcHRpb25zLnJlbmRlciB8fCByZW5kZXJcblxuICAgIHJldHVybiByZW5kZXJPcHRpb25zLnBhdGNoKHJvb3ROb2RlLCBwYXRjaGVzLCByZW5kZXJPcHRpb25zKVxufVxuXG5mdW5jdGlvbiBwYXRjaFJlY3Vyc2l2ZShyb290Tm9kZSwgcGF0Y2hlcywgcmVuZGVyT3B0aW9ucykge1xuICAgIHZhciBpbmRpY2VzID0gcGF0Y2hJbmRpY2VzKHBhdGNoZXMpXG5cbiAgICBpZiAoaW5kaWNlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHJvb3ROb2RlXG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0gZG9tSW5kZXgocm9vdE5vZGUsIHBhdGNoZXMuYSwgaW5kaWNlcylcbiAgICB2YXIgb3duZXJEb2N1bWVudCA9IHJvb3ROb2RlLm93bmVyRG9jdW1lbnRcblxuICAgIGlmICghcmVuZGVyT3B0aW9ucy5kb2N1bWVudCAmJiBvd25lckRvY3VtZW50ICE9PSBkb2N1bWVudCkge1xuICAgICAgICByZW5kZXJPcHRpb25zLmRvY3VtZW50ID0gb3duZXJEb2N1bWVudFxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5kaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZUluZGV4ID0gaW5kaWNlc1tpXVxuICAgICAgICByb290Tm9kZSA9IGFwcGx5UGF0Y2gocm9vdE5vZGUsXG4gICAgICAgICAgICBpbmRleFtub2RlSW5kZXhdLFxuICAgICAgICAgICAgcGF0Y2hlc1tub2RlSW5kZXhdLFxuICAgICAgICAgICAgcmVuZGVyT3B0aW9ucylcbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdE5vZGVcbn1cblxuZnVuY3Rpb24gYXBwbHlQYXRjaChyb290Tm9kZSwgZG9tTm9kZSwgcGF0Y2hMaXN0LCByZW5kZXJPcHRpb25zKSB7XG4gICAgaWYgKCFkb21Ob2RlKSB7XG4gICAgICAgIHJldHVybiByb290Tm9kZVxuICAgIH1cblxuICAgIHZhciBuZXdOb2RlXG5cbiAgICBpZiAoaXNBcnJheShwYXRjaExpc3QpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0Y2hMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBuZXdOb2RlID0gcGF0Y2hPcChwYXRjaExpc3RbaV0sIGRvbU5vZGUsIHJlbmRlck9wdGlvbnMpXG5cbiAgICAgICAgICAgIGlmIChkb21Ob2RlID09PSByb290Tm9kZSkge1xuICAgICAgICAgICAgICAgIHJvb3ROb2RlID0gbmV3Tm9kZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV3Tm9kZSA9IHBhdGNoT3AocGF0Y2hMaXN0LCBkb21Ob2RlLCByZW5kZXJPcHRpb25zKVxuXG4gICAgICAgIGlmIChkb21Ob2RlID09PSByb290Tm9kZSkge1xuICAgICAgICAgICAgcm9vdE5vZGUgPSBuZXdOb2RlXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdE5vZGVcbn1cblxuZnVuY3Rpb24gcGF0Y2hJbmRpY2VzKHBhdGNoZXMpIHtcbiAgICB2YXIgaW5kaWNlcyA9IFtdXG5cbiAgICBmb3IgKHZhciBrZXkgaW4gcGF0Y2hlcykge1xuICAgICAgICBpZiAoa2V5ICE9PSBcImFcIikge1xuICAgICAgICAgICAgaW5kaWNlcy5wdXNoKE51bWJlcihrZXkpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGluZGljZXNcbn1cbiIsInZhciBpc1dpZGdldCA9IHJlcXVpcmUoXCIuLi92bm9kZS9pcy13aWRnZXQuanNcIilcblxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGVXaWRnZXRcblxuZnVuY3Rpb24gdXBkYXRlV2lkZ2V0KGEsIGIpIHtcbiAgICBpZiAoaXNXaWRnZXQoYSkgJiYgaXNXaWRnZXQoYikpIHtcbiAgICAgICAgaWYgKFwibmFtZVwiIGluIGEgJiYgXCJuYW1lXCIgaW4gYikge1xuICAgICAgICAgICAgcmV0dXJuIGEuaWQgPT09IGIuaWRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhLmluaXQgPT09IGIuaW5pdFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdlN0b3JlID0gcmVxdWlyZSgnZXYtc3RvcmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdkhvb2s7XG5cbmZ1bmN0aW9uIEV2SG9vayh2YWx1ZSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBFdkhvb2spKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXZIb29rKHZhbHVlKTtcbiAgICB9XG5cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG59XG5cbkV2SG9vay5wcm90b3R5cGUuaG9vayA9IGZ1bmN0aW9uIChub2RlLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICB2YXIgZXMgPSBFdlN0b3JlKG5vZGUpO1xuICAgIHZhciBwcm9wTmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHIoMyk7XG5cbiAgICBlc1twcm9wTmFtZV0gPSB0aGlzLnZhbHVlO1xufTtcblxuRXZIb29rLnByb3RvdHlwZS51bmhvb2sgPSBmdW5jdGlvbihub2RlLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICB2YXIgZXMgPSBFdlN0b3JlKG5vZGUpO1xuICAgIHZhciBwcm9wTmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHIoMyk7XG5cbiAgICBlc1twcm9wTmFtZV0gPSB1bmRlZmluZWQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvZnRTZXRIb29rO1xuXG5mdW5jdGlvbiBTb2Z0U2V0SG9vayh2YWx1ZSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTb2Z0U2V0SG9vaykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTb2Z0U2V0SG9vayh2YWx1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xufVxuXG5Tb2Z0U2V0SG9vay5wcm90b3R5cGUuaG9vayA9IGZ1bmN0aW9uIChub2RlLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICBpZiAobm9kZVtwcm9wZXJ0eU5hbWVdICE9PSB0aGlzLnZhbHVlKSB7XG4gICAgICAgIG5vZGVbcHJvcGVydHlOYW1lXSA9IHRoaXMudmFsdWU7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCd4LWlzLWFycmF5Jyk7XG5cbnZhciBWTm9kZSA9IHJlcXVpcmUoJy4uL3Zub2RlL3Zub2RlLmpzJyk7XG52YXIgVlRleHQgPSByZXF1aXJlKCcuLi92bm9kZS92dGV4dC5qcycpO1xudmFyIGlzVk5vZGUgPSByZXF1aXJlKCcuLi92bm9kZS9pcy12bm9kZScpO1xudmFyIGlzVlRleHQgPSByZXF1aXJlKCcuLi92bm9kZS9pcy12dGV4dCcpO1xudmFyIGlzV2lkZ2V0ID0gcmVxdWlyZSgnLi4vdm5vZGUvaXMtd2lkZ2V0Jyk7XG52YXIgaXNIb29rID0gcmVxdWlyZSgnLi4vdm5vZGUvaXMtdmhvb2snKTtcbnZhciBpc1ZUaHVuayA9IHJlcXVpcmUoJy4uL3Zub2RlL2lzLXRodW5rJyk7XG5cbnZhciBwYXJzZVRhZyA9IHJlcXVpcmUoJy4vcGFyc2UtdGFnLmpzJyk7XG52YXIgc29mdFNldEhvb2sgPSByZXF1aXJlKCcuL2hvb2tzL3NvZnQtc2V0LWhvb2suanMnKTtcbnZhciBldkhvb2sgPSByZXF1aXJlKCcuL2hvb2tzL2V2LWhvb2suanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBoO1xuXG5mdW5jdGlvbiBoKHRhZ05hbWUsIHByb3BlcnRpZXMsIGNoaWxkcmVuKSB7XG4gICAgdmFyIGNoaWxkTm9kZXMgPSBbXTtcbiAgICB2YXIgdGFnLCBwcm9wcywga2V5LCBuYW1lc3BhY2U7XG5cbiAgICBpZiAoIWNoaWxkcmVuICYmIGlzQ2hpbGRyZW4ocHJvcGVydGllcykpIHtcbiAgICAgICAgY2hpbGRyZW4gPSBwcm9wZXJ0aWVzO1xuICAgICAgICBwcm9wcyA9IHt9O1xuICAgIH1cblxuICAgIHByb3BzID0gcHJvcHMgfHwgcHJvcGVydGllcyB8fCB7fTtcbiAgICB0YWcgPSBwYXJzZVRhZyh0YWdOYW1lLCBwcm9wcyk7XG5cbiAgICAvLyBzdXBwb3J0IGtleXNcbiAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoJ2tleScpKSB7XG4gICAgICAgIGtleSA9IHByb3BzLmtleTtcbiAgICAgICAgcHJvcHMua2V5ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnQgbmFtZXNwYWNlXG4gICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KCduYW1lc3BhY2UnKSkge1xuICAgICAgICBuYW1lc3BhY2UgPSBwcm9wcy5uYW1lc3BhY2U7XG4gICAgICAgIHByb3BzLm5hbWVzcGFjZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBmaXggY3Vyc29yIGJ1Z1xuICAgIGlmICh0YWcgPT09ICdJTlBVVCcgJiZcbiAgICAgICAgIW5hbWVzcGFjZSAmJlxuICAgICAgICBwcm9wcy5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSAmJlxuICAgICAgICBwcm9wcy52YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICFpc0hvb2socHJvcHMudmFsdWUpXG4gICAgKSB7XG4gICAgICAgIHByb3BzLnZhbHVlID0gc29mdFNldEhvb2socHJvcHMudmFsdWUpO1xuICAgIH1cblxuICAgIHRyYW5zZm9ybVByb3BlcnRpZXMocHJvcHMpO1xuXG4gICAgaWYgKGNoaWxkcmVuICE9PSB1bmRlZmluZWQgJiYgY2hpbGRyZW4gIT09IG51bGwpIHtcbiAgICAgICAgYWRkQ2hpbGQoY2hpbGRyZW4sIGNoaWxkTm9kZXMsIHRhZywgcHJvcHMpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIG5ldyBWTm9kZSh0YWcsIHByb3BzLCBjaGlsZE5vZGVzLCBrZXksIG5hbWVzcGFjZSk7XG59XG5cbmZ1bmN0aW9uIGFkZENoaWxkKGMsIGNoaWxkTm9kZXMsIHRhZywgcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIGMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNoaWxkTm9kZXMucHVzaChuZXcgVlRleHQoYykpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGMgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNoaWxkTm9kZXMucHVzaChuZXcgVlRleHQoU3RyaW5nKGMpKSk7XG4gICAgfSBlbHNlIGlmIChpc0NoaWxkKGMpKSB7XG4gICAgICAgIGNoaWxkTm9kZXMucHVzaChjKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkoYykpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhZGRDaGlsZChjW2ldLCBjaGlsZE5vZGVzLCB0YWcsIHByb3BzKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYyA9PT0gbnVsbCB8fCBjID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IFVuZXhwZWN0ZWRWaXJ0dWFsRWxlbWVudCh7XG4gICAgICAgICAgICBmb3JlaWduT2JqZWN0OiBjLFxuICAgICAgICAgICAgcGFyZW50Vm5vZGU6IHtcbiAgICAgICAgICAgICAgICB0YWdOYW1lOiB0YWcsXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczogcHJvcHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wZXJ0aWVzKHByb3BzKSB7XG4gICAgZm9yICh2YXIgcHJvcE5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuXG4gICAgICAgICAgICBpZiAoaXNIb29rKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocHJvcE5hbWUuc3Vic3RyKDAsIDMpID09PSAnZXYtJykge1xuICAgICAgICAgICAgICAgIC8vIGFkZCBldi1mb28gc3VwcG9ydFxuICAgICAgICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGV2SG9vayh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzQ2hpbGQoeCkge1xuICAgIHJldHVybiBpc1ZOb2RlKHgpIHx8IGlzVlRleHQoeCkgfHwgaXNXaWRnZXQoeCkgfHwgaXNWVGh1bmsoeCk7XG59XG5cbmZ1bmN0aW9uIGlzQ2hpbGRyZW4oeCkge1xuICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ3N0cmluZycgfHwgaXNBcnJheSh4KSB8fCBpc0NoaWxkKHgpO1xufVxuXG5mdW5jdGlvbiBVbmV4cGVjdGVkVmlydHVhbEVsZW1lbnQoZGF0YSkge1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcblxuICAgIGVyci50eXBlID0gJ3ZpcnR1YWwtaHlwZXJzY3JpcHQudW5leHBlY3RlZC52aXJ0dWFsLWVsZW1lbnQnO1xuICAgIGVyci5tZXNzYWdlID0gJ1VuZXhwZWN0ZWQgdmlydHVhbCBjaGlsZCBwYXNzZWQgdG8gaCgpLlxcbicgK1xuICAgICAgICAnRXhwZWN0ZWQgYSBWTm9kZSAvIFZ0aHVuayAvIFZXaWRnZXQgLyBzdHJpbmcgYnV0OlxcbicgK1xuICAgICAgICAnZ290OlxcbicgK1xuICAgICAgICBlcnJvclN0cmluZyhkYXRhLmZvcmVpZ25PYmplY3QpICtcbiAgICAgICAgJy5cXG4nICtcbiAgICAgICAgJ1RoZSBwYXJlbnQgdm5vZGUgaXM6XFxuJyArXG4gICAgICAgIGVycm9yU3RyaW5nKGRhdGEucGFyZW50Vm5vZGUpXG4gICAgICAgICdcXG4nICtcbiAgICAgICAgJ1N1Z2dlc3RlZCBmaXg6IGNoYW5nZSB5b3VyIGBoKC4uLiwgWyAuLi4gXSlgIGNhbGxzaXRlLic7XG4gICAgZXJyLmZvcmVpZ25PYmplY3QgPSBkYXRhLmZvcmVpZ25PYmplY3Q7XG4gICAgZXJyLnBhcmVudFZub2RlID0gZGF0YS5wYXJlbnRWbm9kZTtcblxuICAgIHJldHVybiBlcnI7XG59XG5cbmZ1bmN0aW9uIGVycm9yU3RyaW5nKG9iaikge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsICcgICAgJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3BsaXQgPSByZXF1aXJlKCdicm93c2VyLXNwbGl0Jyk7XG5cbnZhciBjbGFzc0lkU3BsaXQgPSAvKFtcXC4jXT9bYS16QS1aMC05XFx1MDA3Ri1cXHVGRkZGXzotXSspLztcbnZhciBub3RDbGFzc0lkID0gL15cXC58Iy87XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VUYWc7XG5cbmZ1bmN0aW9uIHBhcnNlVGFnKHRhZywgcHJvcHMpIHtcbiAgICBpZiAoIXRhZykge1xuICAgICAgICByZXR1cm4gJ0RJVic7XG4gICAgfVxuXG4gICAgdmFyIG5vSWQgPSAhKHByb3BzLmhhc093blByb3BlcnR5KCdpZCcpKTtcblxuICAgIHZhciB0YWdQYXJ0cyA9IHNwbGl0KHRhZywgY2xhc3NJZFNwbGl0KTtcbiAgICB2YXIgdGFnTmFtZSA9IG51bGw7XG5cbiAgICBpZiAobm90Q2xhc3NJZC50ZXN0KHRhZ1BhcnRzWzFdKSkge1xuICAgICAgICB0YWdOYW1lID0gJ0RJVic7XG4gICAgfVxuXG4gICAgdmFyIGNsYXNzZXMsIHBhcnQsIHR5cGUsIGk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgdGFnUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGFydCA9IHRhZ1BhcnRzW2ldO1xuXG4gICAgICAgIGlmICghcGFydCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlID0gcGFydC5jaGFyQXQoMCk7XG5cbiAgICAgICAgaWYgKCF0YWdOYW1lKSB7XG4gICAgICAgICAgICB0YWdOYW1lID0gcGFydDtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnLicpIHtcbiAgICAgICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzIHx8IFtdO1xuICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKHBhcnQuc3Vic3RyaW5nKDEsIHBhcnQubGVuZ3RoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJyMnICYmIG5vSWQpIHtcbiAgICAgICAgICAgIHByb3BzLmlkID0gcGFydC5zdWJzdHJpbmcoMSwgcGFydC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgICAgaWYgKHByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKHByb3BzLmNsYXNzTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9wcy5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvcHMubmFtZXNwYWNlID8gdGFnTmFtZSA6IHRhZ05hbWUudG9VcHBlckNhc2UoKTtcbn1cbiIsInZhciBpc1ZOb2RlID0gcmVxdWlyZShcIi4vaXMtdm5vZGVcIilcbnZhciBpc1ZUZXh0ID0gcmVxdWlyZShcIi4vaXMtdnRleHRcIilcbnZhciBpc1dpZGdldCA9IHJlcXVpcmUoXCIuL2lzLXdpZGdldFwiKVxudmFyIGlzVGh1bmsgPSByZXF1aXJlKFwiLi9pcy10aHVua1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhbmRsZVRodW5rXG5cbmZ1bmN0aW9uIGhhbmRsZVRodW5rKGEsIGIpIHtcbiAgICB2YXIgcmVuZGVyZWRBID0gYVxuICAgIHZhciByZW5kZXJlZEIgPSBiXG5cbiAgICBpZiAoaXNUaHVuayhiKSkge1xuICAgICAgICByZW5kZXJlZEIgPSByZW5kZXJUaHVuayhiLCBhKVxuICAgIH1cblxuICAgIGlmIChpc1RodW5rKGEpKSB7XG4gICAgICAgIHJlbmRlcmVkQSA9IHJlbmRlclRodW5rKGEsIG51bGwpXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYTogcmVuZGVyZWRBLFxuICAgICAgICBiOiByZW5kZXJlZEJcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlclRodW5rKHRodW5rLCBwcmV2aW91cykge1xuICAgIHZhciByZW5kZXJlZFRodW5rID0gdGh1bmsudm5vZGVcblxuICAgIGlmICghcmVuZGVyZWRUaHVuaykge1xuICAgICAgICByZW5kZXJlZFRodW5rID0gdGh1bmsudm5vZGUgPSB0aHVuay5yZW5kZXIocHJldmlvdXMpXG4gICAgfVxuXG4gICAgaWYgKCEoaXNWTm9kZShyZW5kZXJlZFRodW5rKSB8fFxuICAgICAgICAgICAgaXNWVGV4dChyZW5kZXJlZFRodW5rKSB8fFxuICAgICAgICAgICAgaXNXaWRnZXQocmVuZGVyZWRUaHVuaykpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInRodW5rIGRpZCBub3QgcmV0dXJuIGEgdmFsaWQgbm9kZVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVuZGVyZWRUaHVua1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBpc1RodW5rXHJcblxyXG5mdW5jdGlvbiBpc1RodW5rKHQpIHtcclxuICAgIHJldHVybiB0ICYmIHQudHlwZSA9PT0gXCJUaHVua1wiXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBpc0hvb2tcblxuZnVuY3Rpb24gaXNIb29rKGhvb2spIHtcbiAgICByZXR1cm4gaG9vayAmJlxuICAgICAgKHR5cGVvZiBob29rLmhvb2sgPT09IFwiZnVuY3Rpb25cIiAmJiAhaG9vay5oYXNPd25Qcm9wZXJ0eShcImhvb2tcIikgfHxcbiAgICAgICB0eXBlb2YgaG9vay51bmhvb2sgPT09IFwiZnVuY3Rpb25cIiAmJiAhaG9vay5oYXNPd25Qcm9wZXJ0eShcInVuaG9va1wiKSlcbn1cbiIsInZhciB2ZXJzaW9uID0gcmVxdWlyZShcIi4vdmVyc2lvblwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVmlydHVhbE5vZGVcblxuZnVuY3Rpb24gaXNWaXJ0dWFsTm9kZSh4KSB7XG4gICAgcmV0dXJuIHggJiYgeC50eXBlID09PSBcIlZpcnR1YWxOb2RlXCIgJiYgeC52ZXJzaW9uID09PSB2ZXJzaW9uXG59XG4iLCJ2YXIgdmVyc2lvbiA9IHJlcXVpcmUoXCIuL3ZlcnNpb25cIilcblxubW9kdWxlLmV4cG9ydHMgPSBpc1ZpcnR1YWxUZXh0XG5cbmZ1bmN0aW9uIGlzVmlydHVhbFRleHQoeCkge1xuICAgIHJldHVybiB4ICYmIHgudHlwZSA9PT0gXCJWaXJ0dWFsVGV4dFwiICYmIHgudmVyc2lvbiA9PT0gdmVyc2lvblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBpc1dpZGdldFxuXG5mdW5jdGlvbiBpc1dpZGdldCh3KSB7XG4gICAgcmV0dXJuIHcgJiYgdy50eXBlID09PSBcIldpZGdldFwiXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiMlwiXG4iLCJ2YXIgdmVyc2lvbiA9IHJlcXVpcmUoXCIuL3ZlcnNpb25cIilcbnZhciBpc1ZOb2RlID0gcmVxdWlyZShcIi4vaXMtdm5vZGVcIilcbnZhciBpc1dpZGdldCA9IHJlcXVpcmUoXCIuL2lzLXdpZGdldFwiKVxudmFyIGlzVGh1bmsgPSByZXF1aXJlKFwiLi9pcy10aHVua1wiKVxudmFyIGlzVkhvb2sgPSByZXF1aXJlKFwiLi9pcy12aG9va1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpcnR1YWxOb2RlXG5cbnZhciBub1Byb3BlcnRpZXMgPSB7fVxudmFyIG5vQ2hpbGRyZW4gPSBbXVxuXG5mdW5jdGlvbiBWaXJ0dWFsTm9kZSh0YWdOYW1lLCBwcm9wZXJ0aWVzLCBjaGlsZHJlbiwga2V5LCBuYW1lc3BhY2UpIHtcbiAgICB0aGlzLnRhZ05hbWUgPSB0YWdOYW1lXG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcyB8fCBub1Byb3BlcnRpZXNcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW4gfHwgbm9DaGlsZHJlblxuICAgIHRoaXMua2V5ID0ga2V5ICE9IG51bGwgPyBTdHJpbmcoa2V5KSA6IHVuZGVmaW5lZFxuICAgIHRoaXMubmFtZXNwYWNlID0gKHR5cGVvZiBuYW1lc3BhY2UgPT09IFwic3RyaW5nXCIpID8gbmFtZXNwYWNlIDogbnVsbFxuXG4gICAgdmFyIGNvdW50ID0gKGNoaWxkcmVuICYmIGNoaWxkcmVuLmxlbmd0aCkgfHwgMFxuICAgIHZhciBkZXNjZW5kYW50cyA9IDBcbiAgICB2YXIgaGFzV2lkZ2V0cyA9IGZhbHNlXG4gICAgdmFyIGhhc1RodW5rcyA9IGZhbHNlXG4gICAgdmFyIGRlc2NlbmRhbnRIb29rcyA9IGZhbHNlXG4gICAgdmFyIGhvb2tzXG5cbiAgICBmb3IgKHZhciBwcm9wTmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gcHJvcGVydGllc1twcm9wTmFtZV1cbiAgICAgICAgICAgIGlmIChpc1ZIb29rKHByb3BlcnR5KSAmJiBwcm9wZXJ0eS51bmhvb2spIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhvb2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGhvb2tzID0ge31cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBob29rc1twcm9wTmFtZV0gPSBwcm9wZXJ0eVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgICAgIGlmIChpc1ZOb2RlKGNoaWxkKSkge1xuICAgICAgICAgICAgZGVzY2VuZGFudHMgKz0gY2hpbGQuY291bnQgfHwgMFxuXG4gICAgICAgICAgICBpZiAoIWhhc1dpZGdldHMgJiYgY2hpbGQuaGFzV2lkZ2V0cykge1xuICAgICAgICAgICAgICAgIGhhc1dpZGdldHMgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaGFzVGh1bmtzICYmIGNoaWxkLmhhc1RodW5rcykge1xuICAgICAgICAgICAgICAgIGhhc1RodW5rcyA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFkZXNjZW5kYW50SG9va3MgJiYgKGNoaWxkLmhvb2tzIHx8IGNoaWxkLmRlc2NlbmRhbnRIb29rcykpIHtcbiAgICAgICAgICAgICAgICBkZXNjZW5kYW50SG9va3MgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWhhc1dpZGdldHMgJiYgaXNXaWRnZXQoY2hpbGQpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoaWxkLmRlc3Ryb3kgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGhhc1dpZGdldHMgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWhhc1RodW5rcyAmJiBpc1RodW5rKGNoaWxkKSkge1xuICAgICAgICAgICAgaGFzVGh1bmtzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY291bnQgPSBjb3VudCArIGRlc2NlbmRhbnRzXG4gICAgdGhpcy5oYXNXaWRnZXRzID0gaGFzV2lkZ2V0c1xuICAgIHRoaXMuaGFzVGh1bmtzID0gaGFzVGh1bmtzXG4gICAgdGhpcy5ob29rcyA9IGhvb2tzXG4gICAgdGhpcy5kZXNjZW5kYW50SG9va3MgPSBkZXNjZW5kYW50SG9va3Ncbn1cblxuVmlydHVhbE5vZGUucHJvdG90eXBlLnZlcnNpb24gPSB2ZXJzaW9uXG5WaXJ0dWFsTm9kZS5wcm90b3R5cGUudHlwZSA9IFwiVmlydHVhbE5vZGVcIlxuIiwidmFyIHZlcnNpb24gPSByZXF1aXJlKFwiLi92ZXJzaW9uXCIpXG5cblZpcnR1YWxQYXRjaC5OT05FID0gMFxuVmlydHVhbFBhdGNoLlZURVhUID0gMVxuVmlydHVhbFBhdGNoLlZOT0RFID0gMlxuVmlydHVhbFBhdGNoLldJREdFVCA9IDNcblZpcnR1YWxQYXRjaC5QUk9QUyA9IDRcblZpcnR1YWxQYXRjaC5PUkRFUiA9IDVcblZpcnR1YWxQYXRjaC5JTlNFUlQgPSA2XG5WaXJ0dWFsUGF0Y2guUkVNT1ZFID0gN1xuVmlydHVhbFBhdGNoLlRIVU5LID0gOFxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpcnR1YWxQYXRjaFxuXG5mdW5jdGlvbiBWaXJ0dWFsUGF0Y2godHlwZSwgdk5vZGUsIHBhdGNoKSB7XG4gICAgdGhpcy50eXBlID0gTnVtYmVyKHR5cGUpXG4gICAgdGhpcy52Tm9kZSA9IHZOb2RlXG4gICAgdGhpcy5wYXRjaCA9IHBhdGNoXG59XG5cblZpcnR1YWxQYXRjaC5wcm90b3R5cGUudmVyc2lvbiA9IHZlcnNpb25cblZpcnR1YWxQYXRjaC5wcm90b3R5cGUudHlwZSA9IFwiVmlydHVhbFBhdGNoXCJcbiIsInZhciB2ZXJzaW9uID0gcmVxdWlyZShcIi4vdmVyc2lvblwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpcnR1YWxUZXh0XG5cbmZ1bmN0aW9uIFZpcnR1YWxUZXh0KHRleHQpIHtcbiAgICB0aGlzLnRleHQgPSBTdHJpbmcodGV4dClcbn1cblxuVmlydHVhbFRleHQucHJvdG90eXBlLnZlcnNpb24gPSB2ZXJzaW9uXG5WaXJ0dWFsVGV4dC5wcm90b3R5cGUudHlwZSA9IFwiVmlydHVhbFRleHRcIlxuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZShcImlzLW9iamVjdFwiKVxudmFyIGlzSG9vayA9IHJlcXVpcmUoXCIuLi92bm9kZS9pcy12aG9va1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRpZmZQcm9wc1xuXG5mdW5jdGlvbiBkaWZmUHJvcHMoYSwgYikge1xuICAgIHZhciBkaWZmXG5cbiAgICBmb3IgKHZhciBhS2V5IGluIGEpIHtcbiAgICAgICAgaWYgKCEoYUtleSBpbiBiKSkge1xuICAgICAgICAgICAgZGlmZiA9IGRpZmYgfHwge31cbiAgICAgICAgICAgIGRpZmZbYUtleV0gPSB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhVmFsdWUgPSBhW2FLZXldXG4gICAgICAgIHZhciBiVmFsdWUgPSBiW2FLZXldXG5cbiAgICAgICAgaWYgKGFWYWx1ZSA9PT0gYlZhbHVlKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGFWYWx1ZSkgJiYgaXNPYmplY3QoYlZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKGdldFByb3RvdHlwZShiVmFsdWUpICE9PSBnZXRQcm90b3R5cGUoYVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGRpZmYgPSBkaWZmIHx8IHt9XG4gICAgICAgICAgICAgICAgZGlmZlthS2V5XSA9IGJWYWx1ZVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0hvb2soYlZhbHVlKSkge1xuICAgICAgICAgICAgICAgICBkaWZmID0gZGlmZiB8fCB7fVxuICAgICAgICAgICAgICAgICBkaWZmW2FLZXldID0gYlZhbHVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBvYmplY3REaWZmID0gZGlmZlByb3BzKGFWYWx1ZSwgYlZhbHVlKVxuICAgICAgICAgICAgICAgIGlmIChvYmplY3REaWZmKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPSBkaWZmIHx8IHt9XG4gICAgICAgICAgICAgICAgICAgIGRpZmZbYUtleV0gPSBvYmplY3REaWZmXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlmZiA9IGRpZmYgfHwge31cbiAgICAgICAgICAgIGRpZmZbYUtleV0gPSBiVmFsdWVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGJLZXkgaW4gYikge1xuICAgICAgICBpZiAoIShiS2V5IGluIGEpKSB7XG4gICAgICAgICAgICBkaWZmID0gZGlmZiB8fCB7fVxuICAgICAgICAgICAgZGlmZltiS2V5XSA9IGJbYktleV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkaWZmXG59XG5cbmZ1bmN0aW9uIGdldFByb3RvdHlwZSh2YWx1ZSkge1xuICBpZiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSlcbiAgfSBlbHNlIGlmICh2YWx1ZS5fX3Byb3RvX18pIHtcbiAgICByZXR1cm4gdmFsdWUuX19wcm90b19fXG4gIH0gZWxzZSBpZiAodmFsdWUuY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlXG4gIH1cbn1cbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZShcIngtaXMtYXJyYXlcIilcblxudmFyIFZQYXRjaCA9IHJlcXVpcmUoXCIuLi92bm9kZS92cGF0Y2hcIilcbnZhciBpc1ZOb2RlID0gcmVxdWlyZShcIi4uL3Zub2RlL2lzLXZub2RlXCIpXG52YXIgaXNWVGV4dCA9IHJlcXVpcmUoXCIuLi92bm9kZS9pcy12dGV4dFwiKVxudmFyIGlzV2lkZ2V0ID0gcmVxdWlyZShcIi4uL3Zub2RlL2lzLXdpZGdldFwiKVxudmFyIGlzVGh1bmsgPSByZXF1aXJlKFwiLi4vdm5vZGUvaXMtdGh1bmtcIilcbnZhciBoYW5kbGVUaHVuayA9IHJlcXVpcmUoXCIuLi92bm9kZS9oYW5kbGUtdGh1bmtcIilcblxudmFyIGRpZmZQcm9wcyA9IHJlcXVpcmUoXCIuL2RpZmYtcHJvcHNcIilcblxubW9kdWxlLmV4cG9ydHMgPSBkaWZmXG5cbmZ1bmN0aW9uIGRpZmYoYSwgYikge1xuICAgIHZhciBwYXRjaCA9IHsgYTogYSB9XG4gICAgd2FsayhhLCBiLCBwYXRjaCwgMClcbiAgICByZXR1cm4gcGF0Y2hcbn1cblxuZnVuY3Rpb24gd2FsayhhLCBiLCBwYXRjaCwgaW5kZXgpIHtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgYXBwbHkgPSBwYXRjaFtpbmRleF1cbiAgICB2YXIgYXBwbHlDbGVhciA9IGZhbHNlXG5cbiAgICBpZiAoaXNUaHVuayhhKSB8fCBpc1RodW5rKGIpKSB7XG4gICAgICAgIHRodW5rcyhhLCBiLCBwYXRjaCwgaW5kZXgpXG4gICAgfSBlbHNlIGlmIChiID09IG51bGwpIHtcblxuICAgICAgICAvLyBJZiBhIGlzIGEgd2lkZ2V0IHdlIHdpbGwgYWRkIGEgcmVtb3ZlIHBhdGNoIGZvciBpdFxuICAgICAgICAvLyBPdGhlcndpc2UgYW55IGNoaWxkIHdpZGdldHMvaG9va3MgbXVzdCBiZSBkZXN0cm95ZWQuXG4gICAgICAgIC8vIFRoaXMgcHJldmVudHMgYWRkaW5nIHR3byByZW1vdmUgcGF0Y2hlcyBmb3IgYSB3aWRnZXQuXG4gICAgICAgIGlmICghaXNXaWRnZXQoYSkpIHtcbiAgICAgICAgICAgIGNsZWFyU3RhdGUoYSwgcGF0Y2gsIGluZGV4KVxuICAgICAgICAgICAgYXBwbHkgPSBwYXRjaFtpbmRleF1cbiAgICAgICAgfVxuXG4gICAgICAgIGFwcGx5ID0gYXBwZW5kUGF0Y2goYXBwbHksIG5ldyBWUGF0Y2goVlBhdGNoLlJFTU9WRSwgYSwgYikpXG4gICAgfSBlbHNlIGlmIChpc1ZOb2RlKGIpKSB7XG4gICAgICAgIGlmIChpc1ZOb2RlKGEpKSB7XG4gICAgICAgICAgICBpZiAoYS50YWdOYW1lID09PSBiLnRhZ05hbWUgJiZcbiAgICAgICAgICAgICAgICBhLm5hbWVzcGFjZSA9PT0gYi5uYW1lc3BhY2UgJiZcbiAgICAgICAgICAgICAgICBhLmtleSA9PT0gYi5rZXkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcHNQYXRjaCA9IGRpZmZQcm9wcyhhLnByb3BlcnRpZXMsIGIucHJvcGVydGllcylcbiAgICAgICAgICAgICAgICBpZiAocHJvcHNQYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBhcHBseSA9IGFwcGVuZFBhdGNoKGFwcGx5LFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFZQYXRjaChWUGF0Y2guUFJPUFMsIGEsIHByb3BzUGF0Y2gpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhcHBseSA9IGRpZmZDaGlsZHJlbihhLCBiLCBwYXRjaCwgYXBwbHksIGluZGV4KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcHBseSA9IGFwcGVuZFBhdGNoKGFwcGx5LCBuZXcgVlBhdGNoKFZQYXRjaC5WTk9ERSwgYSwgYikpXG4gICAgICAgICAgICAgICAgYXBwbHlDbGVhciA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFwcGx5ID0gYXBwZW5kUGF0Y2goYXBwbHksIG5ldyBWUGF0Y2goVlBhdGNoLlZOT0RFLCBhLCBiKSlcbiAgICAgICAgICAgIGFwcGx5Q2xlYXIgPSB0cnVlXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzVlRleHQoYikpIHtcbiAgICAgICAgaWYgKCFpc1ZUZXh0KGEpKSB7XG4gICAgICAgICAgICBhcHBseSA9IGFwcGVuZFBhdGNoKGFwcGx5LCBuZXcgVlBhdGNoKFZQYXRjaC5WVEVYVCwgYSwgYikpXG4gICAgICAgICAgICBhcHBseUNsZWFyID0gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKGEudGV4dCAhPT0gYi50ZXh0KSB7XG4gICAgICAgICAgICBhcHBseSA9IGFwcGVuZFBhdGNoKGFwcGx5LCBuZXcgVlBhdGNoKFZQYXRjaC5WVEVYVCwgYSwgYikpXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzV2lkZ2V0KGIpKSB7XG4gICAgICAgIGlmICghaXNXaWRnZXQoYSkpIHtcbiAgICAgICAgICAgIGFwcGx5Q2xlYXIgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICBhcHBseSA9IGFwcGVuZFBhdGNoKGFwcGx5LCBuZXcgVlBhdGNoKFZQYXRjaC5XSURHRVQsIGEsIGIpKVxuICAgIH1cblxuICAgIGlmIChhcHBseSkge1xuICAgICAgICBwYXRjaFtpbmRleF0gPSBhcHBseVxuICAgIH1cblxuICAgIGlmIChhcHBseUNsZWFyKSB7XG4gICAgICAgIGNsZWFyU3RhdGUoYSwgcGF0Y2gsIGluZGV4KVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZGlmZkNoaWxkcmVuKGEsIGIsIHBhdGNoLCBhcHBseSwgaW5kZXgpIHtcbiAgICB2YXIgYUNoaWxkcmVuID0gYS5jaGlsZHJlblxuICAgIHZhciBvcmRlcmVkU2V0ID0gcmVvcmRlcihhQ2hpbGRyZW4sIGIuY2hpbGRyZW4pXG4gICAgdmFyIGJDaGlsZHJlbiA9IG9yZGVyZWRTZXQuY2hpbGRyZW5cblxuICAgIHZhciBhTGVuID0gYUNoaWxkcmVuLmxlbmd0aFxuICAgIHZhciBiTGVuID0gYkNoaWxkcmVuLmxlbmd0aFxuICAgIHZhciBsZW4gPSBhTGVuID4gYkxlbiA/IGFMZW4gOiBiTGVuXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBsZWZ0Tm9kZSA9IGFDaGlsZHJlbltpXVxuICAgICAgICB2YXIgcmlnaHROb2RlID0gYkNoaWxkcmVuW2ldXG4gICAgICAgIGluZGV4ICs9IDFcblxuICAgICAgICBpZiAoIWxlZnROb2RlKSB7XG4gICAgICAgICAgICBpZiAocmlnaHROb2RlKSB7XG4gICAgICAgICAgICAgICAgLy8gRXhjZXNzIG5vZGVzIGluIGIgbmVlZCB0byBiZSBhZGRlZFxuICAgICAgICAgICAgICAgIGFwcGx5ID0gYXBwZW5kUGF0Y2goYXBwbHksXG4gICAgICAgICAgICAgICAgICAgIG5ldyBWUGF0Y2goVlBhdGNoLklOU0VSVCwgbnVsbCwgcmlnaHROb2RlKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdhbGsobGVmdE5vZGUsIHJpZ2h0Tm9kZSwgcGF0Y2gsIGluZGV4KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzVk5vZGUobGVmdE5vZGUpICYmIGxlZnROb2RlLmNvdW50KSB7XG4gICAgICAgICAgICBpbmRleCArPSBsZWZ0Tm9kZS5jb3VudFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9yZGVyZWRTZXQubW92ZXMpIHtcbiAgICAgICAgLy8gUmVvcmRlciBub2RlcyBsYXN0XG4gICAgICAgIGFwcGx5ID0gYXBwZW5kUGF0Y2goYXBwbHksIG5ldyBWUGF0Y2goXG4gICAgICAgICAgICBWUGF0Y2guT1JERVIsXG4gICAgICAgICAgICBhLFxuICAgICAgICAgICAgb3JkZXJlZFNldC5tb3Zlc1xuICAgICAgICApKVxuICAgIH1cblxuICAgIHJldHVybiBhcHBseVxufVxuXG5mdW5jdGlvbiBjbGVhclN0YXRlKHZOb2RlLCBwYXRjaCwgaW5kZXgpIHtcbiAgICAvLyBUT0RPOiBNYWtlIHRoaXMgYSBzaW5nbGUgd2Fsaywgbm90IHR3b1xuICAgIHVuaG9vayh2Tm9kZSwgcGF0Y2gsIGluZGV4KVxuICAgIGRlc3Ryb3lXaWRnZXRzKHZOb2RlLCBwYXRjaCwgaW5kZXgpXG59XG5cbi8vIFBhdGNoIHJlY29yZHMgZm9yIGFsbCBkZXN0cm95ZWQgd2lkZ2V0cyBtdXN0IGJlIGFkZGVkIGJlY2F1c2Ugd2UgbmVlZFxuLy8gYSBET00gbm9kZSByZWZlcmVuY2UgZm9yIHRoZSBkZXN0cm95IGZ1bmN0aW9uXG5mdW5jdGlvbiBkZXN0cm95V2lkZ2V0cyh2Tm9kZSwgcGF0Y2gsIGluZGV4KSB7XG4gICAgaWYgKGlzV2lkZ2V0KHZOb2RlKSkge1xuICAgICAgICBpZiAodHlwZW9mIHZOb2RlLmRlc3Ryb3kgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcGF0Y2hbaW5kZXhdID0gYXBwZW5kUGF0Y2goXG4gICAgICAgICAgICAgICAgcGF0Y2hbaW5kZXhdLFxuICAgICAgICAgICAgICAgIG5ldyBWUGF0Y2goVlBhdGNoLlJFTU9WRSwgdk5vZGUsIG51bGwpXG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzVk5vZGUodk5vZGUpICYmICh2Tm9kZS5oYXNXaWRnZXRzIHx8IHZOb2RlLmhhc1RodW5rcykpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdk5vZGUuY2hpbGRyZW5cbiAgICAgICAgdmFyIGxlbiA9IGNoaWxkcmVuLmxlbmd0aFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgICAgICAgICAgaW5kZXggKz0gMVxuXG4gICAgICAgICAgICBkZXN0cm95V2lkZ2V0cyhjaGlsZCwgcGF0Y2gsIGluZGV4KVxuXG4gICAgICAgICAgICBpZiAoaXNWTm9kZShjaGlsZCkgJiYgY2hpbGQuY291bnQpIHtcbiAgICAgICAgICAgICAgICBpbmRleCArPSBjaGlsZC5jb3VudFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1RodW5rKHZOb2RlKSkge1xuICAgICAgICB0aHVua3Modk5vZGUsIG51bGwsIHBhdGNoLCBpbmRleClcbiAgICB9XG59XG5cbi8vIENyZWF0ZSBhIHN1Yi1wYXRjaCBmb3IgdGh1bmtzXG5mdW5jdGlvbiB0aHVua3MoYSwgYiwgcGF0Y2gsIGluZGV4KSB7XG4gICAgdmFyIG5vZGVzID0gaGFuZGxlVGh1bmsoYSwgYilcbiAgICB2YXIgdGh1bmtQYXRjaCA9IGRpZmYobm9kZXMuYSwgbm9kZXMuYilcbiAgICBpZiAoaGFzUGF0Y2hlcyh0aHVua1BhdGNoKSkge1xuICAgICAgICBwYXRjaFtpbmRleF0gPSBuZXcgVlBhdGNoKFZQYXRjaC5USFVOSywgbnVsbCwgdGh1bmtQYXRjaClcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhc1BhdGNoZXMocGF0Y2gpIHtcbiAgICBmb3IgKHZhciBpbmRleCBpbiBwYXRjaCkge1xuICAgICAgICBpZiAoaW5kZXggIT09IFwiYVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG59XG5cbi8vIEV4ZWN1dGUgaG9va3Mgd2hlbiB0d28gbm9kZXMgYXJlIGlkZW50aWNhbFxuZnVuY3Rpb24gdW5ob29rKHZOb2RlLCBwYXRjaCwgaW5kZXgpIHtcbiAgICBpZiAoaXNWTm9kZSh2Tm9kZSkpIHtcbiAgICAgICAgaWYgKHZOb2RlLmhvb2tzKSB7XG4gICAgICAgICAgICBwYXRjaFtpbmRleF0gPSBhcHBlbmRQYXRjaChcbiAgICAgICAgICAgICAgICBwYXRjaFtpbmRleF0sXG4gICAgICAgICAgICAgICAgbmV3IFZQYXRjaChcbiAgICAgICAgICAgICAgICAgICAgVlBhdGNoLlBST1BTLFxuICAgICAgICAgICAgICAgICAgICB2Tm9kZSxcbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkS2V5cyh2Tm9kZS5ob29rcylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodk5vZGUuZGVzY2VuZGFudEhvb2tzIHx8IHZOb2RlLmhhc1RodW5rcykge1xuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdk5vZGUuY2hpbGRyZW5cbiAgICAgICAgICAgIHZhciBsZW4gPSBjaGlsZHJlbi5sZW5ndGhcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDFcblxuICAgICAgICAgICAgICAgIHVuaG9vayhjaGlsZCwgcGF0Y2gsIGluZGV4KVxuXG4gICAgICAgICAgICAgICAgaWYgKGlzVk5vZGUoY2hpbGQpICYmIGNoaWxkLmNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ICs9IGNoaWxkLmNvdW50XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1RodW5rKHZOb2RlKSkge1xuICAgICAgICB0aHVua3Modk5vZGUsIG51bGwsIHBhdGNoLCBpbmRleClcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVuZGVmaW5lZEtleXMob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxufVxuXG4vLyBMaXN0IGRpZmYsIG5haXZlIGxlZnQgdG8gcmlnaHQgcmVvcmRlcmluZ1xuZnVuY3Rpb24gcmVvcmRlcihhQ2hpbGRyZW4sIGJDaGlsZHJlbikge1xuICAgIC8vIE8oTSkgdGltZSwgTyhNKSBtZW1vcnlcbiAgICB2YXIgYkNoaWxkSW5kZXggPSBrZXlJbmRleChiQ2hpbGRyZW4pXG4gICAgdmFyIGJLZXlzID0gYkNoaWxkSW5kZXgua2V5c1xuICAgIHZhciBiRnJlZSA9IGJDaGlsZEluZGV4LmZyZWVcblxuICAgIGlmIChiRnJlZS5sZW5ndGggPT09IGJDaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBiQ2hpbGRyZW4sXG4gICAgICAgICAgICBtb3ZlczogbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTyhOKSB0aW1lLCBPKE4pIG1lbW9yeVxuICAgIHZhciBhQ2hpbGRJbmRleCA9IGtleUluZGV4KGFDaGlsZHJlbilcbiAgICB2YXIgYUtleXMgPSBhQ2hpbGRJbmRleC5rZXlzXG4gICAgdmFyIGFGcmVlID0gYUNoaWxkSW5kZXguZnJlZVxuXG4gICAgaWYgKGFGcmVlLmxlbmd0aCA9PT0gYUNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY2hpbGRyZW46IGJDaGlsZHJlbixcbiAgICAgICAgICAgIG1vdmVzOiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPKE1BWChOLCBNKSkgbWVtb3J5XG4gICAgdmFyIG5ld0NoaWxkcmVuID0gW11cblxuICAgIHZhciBmcmVlSW5kZXggPSAwXG4gICAgdmFyIGZyZWVDb3VudCA9IGJGcmVlLmxlbmd0aFxuICAgIHZhciBkZWxldGVkSXRlbXMgPSAwXG5cbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggYSBhbmQgbWF0Y2ggYSBub2RlIGluIGJcbiAgICAvLyBPKE4pIHRpbWUsXG4gICAgZm9yICh2YXIgaSA9IDAgOyBpIDwgYUNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhSXRlbSA9IGFDaGlsZHJlbltpXVxuICAgICAgICB2YXIgaXRlbUluZGV4XG5cbiAgICAgICAgaWYgKGFJdGVtLmtleSkge1xuICAgICAgICAgICAgaWYgKGJLZXlzLmhhc093blByb3BlcnR5KGFJdGVtLmtleSkpIHtcbiAgICAgICAgICAgICAgICAvLyBNYXRjaCB1cCB0aGUgb2xkIGtleXNcbiAgICAgICAgICAgICAgICBpdGVtSW5kZXggPSBiS2V5c1thSXRlbS5rZXldXG4gICAgICAgICAgICAgICAgbmV3Q2hpbGRyZW4ucHVzaChiQ2hpbGRyZW5baXRlbUluZGV4XSlcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgb2xkIGtleWVkIGl0ZW1zXG4gICAgICAgICAgICAgICAgaXRlbUluZGV4ID0gaSAtIGRlbGV0ZWRJdGVtcysrXG4gICAgICAgICAgICAgICAgbmV3Q2hpbGRyZW4ucHVzaChudWxsKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTWF0Y2ggdGhlIGl0ZW0gaW4gYSB3aXRoIHRoZSBuZXh0IGZyZWUgaXRlbSBpbiBiXG4gICAgICAgICAgICBpZiAoZnJlZUluZGV4IDwgZnJlZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgaXRlbUluZGV4ID0gYkZyZWVbZnJlZUluZGV4KytdXG4gICAgICAgICAgICAgICAgbmV3Q2hpbGRyZW4ucHVzaChiQ2hpbGRyZW5baXRlbUluZGV4XSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlcmUgYXJlIG5vIGZyZWUgaXRlbXMgaW4gYiB0byBtYXRjaCB3aXRoXG4gICAgICAgICAgICAgICAgLy8gdGhlIGZyZWUgaXRlbXMgaW4gYSwgc28gdGhlIGV4dHJhIGZyZWUgbm9kZXNcbiAgICAgICAgICAgICAgICAvLyBhcmUgZGVsZXRlZC5cbiAgICAgICAgICAgICAgICBpdGVtSW5kZXggPSBpIC0gZGVsZXRlZEl0ZW1zKytcbiAgICAgICAgICAgICAgICBuZXdDaGlsZHJlbi5wdXNoKG51bGwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGFzdEZyZWVJbmRleCA9IGZyZWVJbmRleCA+PSBiRnJlZS5sZW5ndGggP1xuICAgICAgICBiQ2hpbGRyZW4ubGVuZ3RoIDpcbiAgICAgICAgYkZyZWVbZnJlZUluZGV4XVxuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGIgYW5kIGFwcGVuZCBhbnkgbmV3IGtleXNcbiAgICAvLyBPKE0pIHRpbWVcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJDaGlsZHJlbi5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgbmV3SXRlbSA9IGJDaGlsZHJlbltqXVxuXG4gICAgICAgIGlmIChuZXdJdGVtLmtleSkge1xuICAgICAgICAgICAgaWYgKCFhS2V5cy5oYXNPd25Qcm9wZXJ0eShuZXdJdGVtLmtleSkpIHtcbiAgICAgICAgICAgICAgICAvLyBBZGQgYW55IG5ldyBrZXllZCBpdGVtc1xuICAgICAgICAgICAgICAgIC8vIFdlIGFyZSBhZGRpbmcgbmV3IGl0ZW1zIHRvIHRoZSBlbmQgYW5kIHRoZW4gc29ydGluZyB0aGVtXG4gICAgICAgICAgICAgICAgLy8gaW4gcGxhY2UuIEluIGZ1dHVyZSB3ZSBzaG91bGQgaW5zZXJ0IG5ldyBpdGVtcyBpbiBwbGFjZS5cbiAgICAgICAgICAgICAgICBuZXdDaGlsZHJlbi5wdXNoKG5ld0l0ZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoaiA+PSBsYXN0RnJlZUluZGV4KSB7XG4gICAgICAgICAgICAvLyBBZGQgYW55IGxlZnRvdmVyIG5vbi1rZXllZCBpdGVtc1xuICAgICAgICAgICAgbmV3Q2hpbGRyZW4ucHVzaChuZXdJdGVtKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNpbXVsYXRlID0gbmV3Q2hpbGRyZW4uc2xpY2UoKVxuICAgIHZhciBzaW11bGF0ZUluZGV4ID0gMFxuICAgIHZhciByZW1vdmVzID0gW11cbiAgICB2YXIgaW5zZXJ0cyA9IFtdXG4gICAgdmFyIHNpbXVsYXRlSXRlbVxuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBiQ2hpbGRyZW4ubGVuZ3RoOykge1xuICAgICAgICB2YXIgd2FudGVkSXRlbSA9IGJDaGlsZHJlbltrXVxuICAgICAgICBzaW11bGF0ZUl0ZW0gPSBzaW11bGF0ZVtzaW11bGF0ZUluZGV4XVxuXG4gICAgICAgIC8vIHJlbW92ZSBpdGVtc1xuICAgICAgICB3aGlsZSAoc2ltdWxhdGVJdGVtID09PSBudWxsICYmIHNpbXVsYXRlLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVtb3Zlcy5wdXNoKHJlbW92ZShzaW11bGF0ZSwgc2ltdWxhdGVJbmRleCwgbnVsbCkpXG4gICAgICAgICAgICBzaW11bGF0ZUl0ZW0gPSBzaW11bGF0ZVtzaW11bGF0ZUluZGV4XVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzaW11bGF0ZUl0ZW0gfHwgc2ltdWxhdGVJdGVtLmtleSAhPT0gd2FudGVkSXRlbS5rZXkpIHtcbiAgICAgICAgICAgIC8vIGlmIHdlIG5lZWQgYSBrZXkgaW4gdGhpcyBwb3NpdGlvbi4uLlxuICAgICAgICAgICAgaWYgKHdhbnRlZEl0ZW0ua2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHNpbXVsYXRlSXRlbSAmJiBzaW11bGF0ZUl0ZW0ua2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGFuIGluc2VydCBkb2Vzbid0IHB1dCB0aGlzIGtleSBpbiBwbGFjZSwgaXQgbmVlZHMgdG8gbW92ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoYktleXNbc2ltdWxhdGVJdGVtLmtleV0gIT09IGsgKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVzLnB1c2gocmVtb3ZlKHNpbXVsYXRlLCBzaW11bGF0ZUluZGV4LCBzaW11bGF0ZUl0ZW0ua2V5KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbXVsYXRlSXRlbSA9IHNpbXVsYXRlW3NpbXVsYXRlSW5kZXhdXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcmVtb3ZlIGRpZG4ndCBwdXQgdGhlIHdhbnRlZCBpdGVtIGluIHBsYWNlLCB3ZSBuZWVkIHRvIGluc2VydCBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzaW11bGF0ZUl0ZW0gfHwgc2ltdWxhdGVJdGVtLmtleSAhPT0gd2FudGVkSXRlbS5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRzLnB1c2goe2tleTogd2FudGVkSXRlbS5rZXksIHRvOiBrfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0ZW1zIGFyZSBtYXRjaGluZywgc28gc2tpcCBhaGVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2ltdWxhdGVJbmRleCsrXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRzLnB1c2goe2tleTogd2FudGVkSXRlbS5rZXksIHRvOiBrfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0cy5wdXNoKHtrZXk6IHdhbnRlZEl0ZW0ua2V5LCB0bzoga30pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGsrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYSBrZXkgaW4gc2ltdWxhdGUgaGFzIG5vIG1hdGNoaW5nIHdhbnRlZCBrZXksIHJlbW92ZSBpdFxuICAgICAgICAgICAgZWxzZSBpZiAoc2ltdWxhdGVJdGVtICYmIHNpbXVsYXRlSXRlbS5rZXkpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVzLnB1c2gocmVtb3ZlKHNpbXVsYXRlLCBzaW11bGF0ZUluZGV4LCBzaW11bGF0ZUl0ZW0ua2V5KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNpbXVsYXRlSW5kZXgrK1xuICAgICAgICAgICAgaysrXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZW1vdmUgYWxsIHRoZSByZW1haW5pbmcgbm9kZXMgZnJvbSBzaW11bGF0ZVxuICAgIHdoaWxlKHNpbXVsYXRlSW5kZXggPCBzaW11bGF0ZS5sZW5ndGgpIHtcbiAgICAgICAgc2ltdWxhdGVJdGVtID0gc2ltdWxhdGVbc2ltdWxhdGVJbmRleF1cbiAgICAgICAgcmVtb3Zlcy5wdXNoKHJlbW92ZShzaW11bGF0ZSwgc2ltdWxhdGVJbmRleCwgc2ltdWxhdGVJdGVtICYmIHNpbXVsYXRlSXRlbS5rZXkpKVxuICAgIH1cblxuICAgIC8vIElmIHRoZSBvbmx5IG1vdmVzIHdlIGhhdmUgYXJlIGRlbGV0ZXMgdGhlbiB3ZSBjYW4ganVzdFxuICAgIC8vIGxldCB0aGUgZGVsZXRlIHBhdGNoIHJlbW92ZSB0aGVzZSBpdGVtcy5cbiAgICBpZiAocmVtb3Zlcy5sZW5ndGggPT09IGRlbGV0ZWRJdGVtcyAmJiAhaW5zZXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBuZXdDaGlsZHJlbixcbiAgICAgICAgICAgIG1vdmVzOiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjaGlsZHJlbjogbmV3Q2hpbGRyZW4sXG4gICAgICAgIG1vdmVzOiB7XG4gICAgICAgICAgICByZW1vdmVzOiByZW1vdmVzLFxuICAgICAgICAgICAgaW5zZXJ0czogaW5zZXJ0c1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmUoYXJyLCBpbmRleCwga2V5KSB7XG4gICAgYXJyLnNwbGljZShpbmRleCwgMSlcblxuICAgIHJldHVybiB7XG4gICAgICAgIGZyb206IGluZGV4LFxuICAgICAgICBrZXk6IGtleVxuICAgIH1cbn1cblxuZnVuY3Rpb24ga2V5SW5kZXgoY2hpbGRyZW4pIHtcbiAgICB2YXIga2V5cyA9IHt9XG4gICAgdmFyIGZyZWUgPSBbXVxuICAgIHZhciBsZW5ndGggPSBjaGlsZHJlbi5sZW5ndGhcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblxuICAgICAgICBpZiAoY2hpbGQua2V5KSB7XG4gICAgICAgICAgICBrZXlzW2NoaWxkLmtleV0gPSBpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcmVlLnB1c2goaSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGtleXM6IGtleXMsICAgICAvLyBBIGhhc2ggb2Yga2V5IG5hbWUgdG8gaW5kZXhcbiAgICAgICAgZnJlZTogZnJlZSAgICAgIC8vIEFuIGFycmF5IG9mIHVua2V5ZWQgaXRlbSBpbmRpY2VzXG4gICAgfVxufVxuXG5mdW5jdGlvbiBhcHBlbmRQYXRjaChhcHBseSwgcGF0Y2gpIHtcbiAgICBpZiAoYXBwbHkpIHtcbiAgICAgICAgaWYgKGlzQXJyYXkoYXBwbHkpKSB7XG4gICAgICAgICAgICBhcHBseS5wdXNoKHBhdGNoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXBwbHkgPSBbYXBwbHksIHBhdGNoXVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFwcGx5XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhdGNoXG4gICAgfVxufVxuIiwidmFyIGhpZGRlblN0b3JlID0gcmVxdWlyZSgnLi9oaWRkZW4tc3RvcmUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVTdG9yZTtcblxuZnVuY3Rpb24gY3JlYXRlU3RvcmUoKSB7XG4gICAgdmFyIGtleSA9IHt9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKCh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBvYmogPT09IG51bGwpICYmXG4gICAgICAgICAgICB0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXZWFrbWFwLXNoaW06IEtleSBtdXN0IGJlIG9iamVjdCcpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RvcmUgPSBvYmoudmFsdWVPZihrZXkpO1xuICAgICAgICByZXR1cm4gc3RvcmUgJiYgc3RvcmUuaWRlbnRpdHkgPT09IGtleSA/XG4gICAgICAgICAgICBzdG9yZSA6IGhpZGRlblN0b3JlKG9iaiwga2V5KTtcbiAgICB9O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBoaWRkZW5TdG9yZTtcblxuZnVuY3Rpb24gaGlkZGVuU3RvcmUob2JqLCBrZXkpIHtcbiAgICB2YXIgc3RvcmUgPSB7IGlkZW50aXR5OiBrZXkgfTtcbiAgICB2YXIgdmFsdWVPZiA9IG9iai52YWx1ZU9mO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgXCJ2YWx1ZU9mXCIsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICE9PSBrZXkgP1xuICAgICAgICAgICAgICAgIHZhbHVlT2YuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IHN0b3JlO1xuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHN0b3JlO1xufVxuIiwidmFyIG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlSXNBcnJheSB8fCBpc0FycmF5XG5cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiXG59XG4iLCJ2YXIgU3RhdGUgPSByZXF1aXJlKCdkb3ZlcicpXG52YXIgaCA9IHJlcXVpcmUoJ3ZpcnR1YWwtZG9tL2gnKVxudmFyIHNmID0gMFxudmFyIEhlYWRlciA9IHJlcXVpcmUoJy4uL2hlYWRlcicpXG52YXIgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9tZXNzYWdlcycpXG5cbnZhciBzaGVldCA9ICgocmVxdWlyZSgnaW5zZXJ0LWNzcycpKFwiLl9iMmFkOTliMyB7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC13ZWJraXQtZmxleDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XFxuICAtd2Via2l0LWJveC1kaXJlY3Rpb246IG5vcm1hbDtcXG4gIC13ZWJraXQtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgICAtbXMtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIG1pbi1oZWlnaHQ6IDEwMCU7XFxuICBmb250LWZhbWlseTogSGVsdmV0aWNhIE5ldWU7XFxufVxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbk55WXk5amIyMXdiMjVsYm5SekwyRndjQzl6Y21NdlkyOXRjRzl1Wlc1MGN5OWhjSEF2YVc1a1pYZ3VZM056SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk8wVkJRMFVzY1VKQlFXTTdSVUZCWkN4elFrRkJZenRGUVVGa0xIRkNRVUZqTzBWQlFXUXNZMEZCWXp0RlFVTmtMRFpDUVVGMVFqdEZRVUYyUWl3NFFrRkJkVUk3UlVGQmRrSXNLMEpCUVhWQ08wMUJRWFpDTERKQ1FVRjFRanRWUVVGMlFpeDFRa0ZCZFVJN1JVRkRka0lzYVVKQlFXbENPMFZCUTJwQ0xEUkNRVUUwUWp0RFFVTTNRaUlzSW1acGJHVWlPaUowYnk1amMzTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUk2YUc5emRDQjdYRzRnSUdScGMzQnNZWGs2SUdac1pYZzdYRzRnSUdac1pYZ3RaR2x5WldOMGFXOXVPaUJqYjJ4MWJXNDdYRzRnSUcxcGJpMW9aV2xuYUhRNklERXdNQ1U3WEc0Z0lHWnZiblF0Wm1GdGFXeDVPaUJJWld4MlpYUnBZMkVnVG1WMVpUdGNibjBpWFgwPSAqL1wiKSB8fCB0cnVlKSAmJiBcIl9iMmFkOTliM1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxuXG5mdW5jdGlvbiBBcHAgKGRhdGEpIHtcbiAgZGF0YSA9IGRhdGEgfHwge31cblxuICByZXR1cm4gU3RhdGUoe1xuICAgIGhlYWRlcjogSGVhZGVyKCksXG4gICAgbWVzc2FnZXM6IE1lc3NhZ2VzKHtsaXN0OiBkYXRhLm1lc3NhZ2VzfSlcbiAgfSlcbn1cblxuQXBwLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAoc3RhdGUpIHtcbiAgcmV0dXJuIGgoJ2RpdicsIHtjbGFzc05hbWU6IHNoZWV0fSwgW1xuICAgIEhlYWRlci5yZW5kZXIoc3RhdGUuaGVhZGVyKSxcbiAgICBNZXNzYWdlcy5yZW5kZXIoc3RhdGUubWVzc2FnZXMpXG4gIF0pXG59XG4iLCJ2YXIgU3RhdGUgPSByZXF1aXJlKCdkb3ZlcicpXG52YXIgT2JzZXJ2ID0gcmVxdWlyZSgnb2JzZXJ2JylcbnZhciBoID0gcmVxdWlyZSgndmlydHVhbC1kb20vaCcpXG52YXIgc2YgPSAwXG5cbnZhciBzaGVldCA9ICgocmVxdWlyZSgnaW5zZXJ0LWNzcycpKFwiLl8wNmY1NTljMyB7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC13ZWJraXQtZmxleDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XFxuICAtd2Via2l0LWFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgICAgLW1zLWZsZXgtYWxpZ246IGNlbnRlcjtcXG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIC13ZWJraXQtYm94LXBhY2s6IGNlbnRlcjtcXG4gIC13ZWJraXQtanVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgICAgLW1zLWZsZXgtcGFjazogY2VudGVyO1xcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGhlaWdodDogNDBweDtcXG4gIC13ZWJraXQtZmxleC1zaHJpbms6IDA7XFxuICAgICAgLW1zLWZsZXgtbmVnYXRpdmU6IDA7XFxuICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlZWU7XFxufVxcblxcbi5fMDZmNTU5YzMgaDEge1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbn1cXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW5OeVl5OWpiMjF3YjI1bGJuUnpMMmhsWVdSbGNpOXpjbU12WTI5dGNHOXVaVzUwY3k5b1pXRmtaWEl2YVc1a1pYZ3VZM056SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk8wVkJRMFVzY1VKQlFXTTdSVUZCWkN4elFrRkJZenRGUVVGa0xIRkNRVUZqTzBWQlFXUXNZMEZCWXp0RlFVTmtMREJDUVVGdlFqdEZRVUZ3UWl3MFFrRkJiMEk3VFVGQmNFSXNkVUpCUVc5Q08xVkJRWEJDTEc5Q1FVRnZRanRGUVVOd1FpeDVRa0ZCZDBJN1JVRkJlRUlzWjBOQlFYZENPMDFCUVhoQ0xITkNRVUYzUWp0VlFVRjRRaXgzUWtGQmQwSTdSVUZEZUVJc1lVRkJZVHRGUVVOaUxIVkNRVUZsTzAxQlFXWXNjVUpCUVdVN1ZVRkJaaXhsUVVGbE8wVkJRMllzYlVKQlFXMUNPMFZCUTI1Q0xEaENRVUU0UWp0RFFVTXZRanM3UVVGRlJEdEZRVU5GTEdkQ1FVRm5RanREUVVOcVFpSXNJbVpwYkdVaU9pSjBieTVqYzNNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5STZhRzl6ZENCN1hHNGdJR1JwYzNCc1lYazZJR1pzWlhnN1hHNGdJR0ZzYVdkdUxXbDBaVzF6T2lCalpXNTBaWEk3WEc0Z0lHcDFjM1JwWm5rdFkyOXVkR1Z1ZERvZ1kyVnVkR1Z5TzF4dUlDQm9aV2xuYUhRNklEUXdjSGc3WEc0Z0lHWnNaWGd0YzJoeWFXNXJPaUF3TzF4dUlDQjBaWGgwTFdGc2FXZHVPaUJqWlc1MFpYSTdYRzRnSUdKdmNtUmxjaTFpYjNSMGIyMDZJREZ3ZUNCemIyeHBaQ0FqWldWbE8xeHVmVnh1WEc1b01TQjdYRzRnSUdadmJuUXRjMmw2WlRvZ01qUndlRHRjYm4waVhYMD0gKi9cIikgfHwgdHJ1ZSkgJiYgXCJfMDZmNTU5YzNcIilcblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJcblxuZnVuY3Rpb24gSGVhZGVyIChkYXRhKSB7XG4gIGRhdGEgPSBkYXRhIHx8IHt9XG5cbiAgcmV0dXJuIFN0YXRlKHtcbiAgICB0aXRsZTogT2JzZXJ2KGRhdGEudGl0bGUgfHwgJ01lc3NhZ2VzJylcbiAgfSlcbn1cblxuSGVhZGVyLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAoc3RhdGUpIHtcbiAgcmV0dXJuIGgoJ2hlYWRlcicsIHtjbGFzc05hbWU6IHNoZWV0fSwgW1xuICAgIGgoJ2gxLnRpdGxlJywgc3RhdGUudGl0bGUpXG4gIF0pXG59XG4iLCJ2YXIgU3RhdGUgPSByZXF1aXJlKCdkb3ZlcicpXG52YXIgT2JzZXJ2ID0gcmVxdWlyZSgnb2JzZXJ2JylcbnZhciBzZiA9IDBcbnZhciBoID0gcmVxdWlyZSgndmlydHVhbC1kb20vaCcpXG52YXIgbGFzdCA9IHJlcXVpcmUoJ2FycmF5LWxhc3QnKVxudmFyIFNjcm9sbCA9IHJlcXVpcmUoJy4uL3Njcm9sbCcpXG5cbnZhciBzaGVldCA9ICgocmVxdWlyZSgnaW5zZXJ0LWNzcycpKFwiXFxuLl83OTA4ODg5ZCAuY29udmVyc2F0aW9uIHtcXG4gIHBhZGRpbmc6IDhweDtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLXdlYmtpdC1mbGV4O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgaGVpZ2h0OiA2NHB4O1xcbn1cXG5cXG4uXzc5MDg4ODlkIGltZyB7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZWVlO1xcbiAgaGVpZ2h0OiA0OHB4O1xcbn1cXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW5OeVl5OWpiMjF3YjI1bGJuUnpMMjFsYzNOaFoyVnpMM055WXk5amIyMXdiMjVsYm5SekwyMWxjM05oWjJWekwybHVaR1Y0TG1OemN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRMEU3UlVGRFJTeGhRVUZoTzBWQlEySXNjVUpCUVdNN1JVRkJaQ3h6UWtGQll6dEZRVUZrTEhGQ1FVRmpPMFZCUVdRc1kwRkJZenRGUVVOa0xHRkJRV0U3UTBGRFpEczdRVUZGUkR0RlFVTkZMRzFDUVVGdFFqdEZRVU51UWl4MVFrRkJkVUk3UlVGRGRrSXNZVUZCWVR0RFFVTmtJaXdpWm1sc1pTSTZJblJ2TG1OemN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbHh1TG1OdmJuWmxjbk5oZEdsdmJpQjdYRzRnSUhCaFpHUnBibWM2SURod2VEdGNiaUFnWkdsemNHeGhlVG9nWm14bGVEdGNiaUFnYUdWcFoyaDBPaUEyTkhCNE8xeHVmVnh1WEc1cGJXY2dlMXh1SUNCaWIzSmtaWEl0Y21Ga2FYVnpPaUExTUNVN1hHNGdJR0p2Y21SbGNqb2dNWEI0SUhOdmJHbGtJQ05sWldVN1hHNGdJR2hsYVdkb2REb2dORGh3ZUR0Y2JuMGlYWDA9ICovXCIpIHx8IHRydWUpICYmIFwiXzc5MDg4ODlkXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZXNcblxuZnVuY3Rpb24gTWVzc2FnZXMgKGRhdGEpIHtcbiAgZGF0YSA9IGRhdGEgfHwge31cblxuICByZXR1cm4gU3RhdGUoe1xuICAgIGxpc3Q6IE9ic2VydihkYXRhLmxpc3QgfHwgW10pXG4gIH0pXG59XG5cbk1lc3NhZ2VzLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAoc3RhdGUpIHtcbiAgcmV0dXJuIFNjcm9sbC5yZW5kZXIoXG4gICAgaCgnZGl2Jywge2NsYXNzTmFtZTogc2hlZXR9LCBzdGF0ZS5saXN0Lm1hcChyZW5kZXJNZXNzYWdlKSlcbiAgKVxufVxuXG5mdW5jdGlvbiByZW5kZXJNZXNzYWdlIChjb252ZXJzYXRpb24pIHtcbiAgdmFyIG1lc3NhZ2UgPSBsYXN0KGNvbnZlcnNhdGlvbi5tZXNzYWdlcylcblxuICByZXR1cm4gaCgnY29udmVyc2F0aW9uJywge2NsYXNzTmFtZTogc2hlZXR9LCBbXG4gICAgaCgnaW1nJywge1xuICAgICAgc3JjOiBjb252ZXJzYXRpb24ud2l0aC5waG90b1xuICAgIH0pLFxuICAgIGgoJ2NvbnRhaW5lcicsIFtcbiAgICAgIGgoJ3RvcCcsIFtcbiAgICAgICAgaCgnbmFtZScsIGNvbnZlcnNhdGlvbi53aXRoLmZpcnN0TmFtZSArICcgJyArIGNvbnZlcnNhdGlvbi53aXRoLmxhc3ROYW1lKSxcbiAgICAgICAgaCgndGltZScsICcxMjo0MicpLFxuICAgICAgICBoKCdhcnJvdycpXG4gICAgICBdKSxcbiAgICAgIGgoJ3N1bW1hcnknLCBtZXNzYWdlID8gbWVzc2FnZS50ZXh0IDogJ1N1bW1hcnkgaGVyZSEnKVxuICAgIF0pXG4gIF0pXG59XG4iLCJ2YXIgaCA9IHJlcXVpcmUoJ3ZpcnR1YWwtZG9tL2gnKVxudmFyIHNmID0gMFxuXG52YXIgc2hlZXQgPSAoKHJlcXVpcmUoJ2luc2VydC1jc3MnKShcIi5fZjI4ZTllOWIge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgb3ZlcmZsb3cteTogc2Nyb2xsO1xcbiAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xcbiAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcXG59XFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluTnlZeTlqYjIxd2IyNWxiblJ6TDNOamNtOXNiQzl6Y21NdlkyOXRjRzl1Wlc1MGN5OXpZM0p2Ykd3dmFXNWtaWGd1WTNOeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPMFZCUTBVc1lVRkJZVHRGUVVOaUxHMUNRVUZ0UWp0RlFVTnVRaXhyUTBGQmEwTTdSVUZEYkVNc2RVSkJRWFZDTzBOQlEzaENJaXdpWm1sc1pTSTZJblJ2TG1OemN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJanBvYjNOMElIdGNiaUFnYUdWcFoyaDBPaUF4TURBbE8xeHVJQ0J2ZG1WeVpteHZkeTE1T2lCelkzSnZiR3c3WEc0Z0lDMTNaV0pyYVhRdGIzWmxjbVpzYjNjdGMyTnliMnhzYVc1bk9pQjBiM1ZqYUR0Y2JpQWdkMmxzYkMxamFHRnVaMlU2SUhSeVlXNXpabTl5YlR0Y2JuMGlYWDA9ICovXCIpIHx8IHRydWUpICYmIFwiX2YyOGU5ZTliXCIpXG5cbmV4cG9ydHMucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyIChjb250ZW50KSB7XG4gIHJldHVybiBoKCdzY3JvbGwnLCB7Y2xhc3NOYW1lOiBzaGVldH0sIGNvbnRlbnQpXG59XG4iLCJ2YXIgRGVsZWdhdG9yID0gcmVxdWlyZSgnZG9tLWRlbGVnYXRvcicpXG52YXIgdmRvbSA9IHJlcXVpcmUoJ3ZpcnR1YWwtZG9tJylcbnZhciBtYWluTG9vcCA9IHJlcXVpcmUoJ21haW4tbG9vcCcpXG52YXIgc2YgPSAwXG52YXIgY3VpZCA9IHJlcXVpcmUoJ2N1aWQnKVxudmFyIERhdGFVcmkgPSByZXF1aXJlKCdjcmVhdGUtZGF0YS11cmknKVxuXG52YXIgcGhvdG9zID0gcmVxdWlyZSgnLi9waG90b3MnKVxudmFyIG1lc3NhZ2VzID0gcmVxdWlyZSgnLi9tZXNzYWdlcy5qc29uJylcbnZhciBBcHAgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYXBwJylcblxuLy8gVW5pcXVlIGlkcyBmb3IgYWxsIG1vY2sgZGF0YVxubWVzc2FnZXMuZm9yRWFjaChwcmVwYXJlRGF0YSlcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbml0ICgpIHtcbiAgdmFyIHJlc2V0ID0gKChyZXF1aXJlKCdpbnNlcnQtY3NzJykoXCIvKiBodHRwOi8vbWV5ZXJ3ZWIuY29tL2VyaWMvdG9vbHMvY3NzL3Jlc2V0LyBcXG4gICB2Mi4wIHwgMjAxMTAxMjZcXG4gICBMaWNlbnNlOiBub25lIChwdWJsaWMgZG9tYWluKVxcbiovXFxuXFxuaHRtbCwgYm9keSwgZGl2LCBzcGFuLCBhcHBsZXQsIG9iamVjdCwgaWZyYW1lLFxcbmgxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIHAsIGJsb2NrcXVvdGUsIHByZSxcXG5hLCBhYmJyLCBhY3JvbnltLCBhZGRyZXNzLCBiaWcsIGNpdGUsIGNvZGUsXFxuZGVsLCBkZm4sIGVtLCBpbWcsIGlucywga2JkLCBxLCBzLCBzYW1wLFxcbnNtYWxsLCBzdHJpa2UsIHN0cm9uZywgc3ViLCBzdXAsIHR0LCB2YXIsXFxuYiwgdSwgaSwgY2VudGVyLFxcbmRsLCBkdCwgZGQsIG9sLCB1bCwgbGksXFxuZmllbGRzZXQsIGZvcm0sIGxhYmVsLCBsZWdlbmQsXFxudGFibGUsIGNhcHRpb24sIHRib2R5LCB0Zm9vdCwgdGhlYWQsIHRyLCB0aCwgdGQsXFxuYXJ0aWNsZSwgYXNpZGUsIGNhbnZhcywgZGV0YWlscywgZW1iZWQsIFxcbmZpZ3VyZSwgZmlnY2FwdGlvbiwgZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgXFxubWVudSwgbmF2LCBvdXRwdXQsIHJ1YnksIHNlY3Rpb24sIHN1bW1hcnksXFxudGltZSwgbWFyaywgYXVkaW8sIHZpZGVvIHtcXG5cXHRtYXJnaW46IDA7XFxuXFx0cGFkZGluZzogMDtcXG5cXHRib3JkZXI6IDA7XFxuXFx0Zm9udC1zaXplOiAxMDAlO1xcblxcdGZvbnQ6IGluaGVyaXQ7XFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxuYXJ0aWNsZSwgYXNpZGUsIGRldGFpbHMsIGZpZ2NhcHRpb24sIGZpZ3VyZSwgXFxuZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBzZWN0aW9uIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuYm9keSB7XFxuXFx0bGluZS1oZWlnaHQ6IDE7XFxufVxcbm9sLCB1bCB7XFxuXFx0bGlzdC1zdHlsZTogbm9uZTtcXG59XFxuYmxvY2txdW90ZSwgcSB7XFxuXFx0cXVvdGVzOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlOmJlZm9yZSwgYmxvY2txdW90ZTphZnRlcixcXG5xOmJlZm9yZSwgcTphZnRlciB7XFxuXFx0Y29udGVudDogJyc7XFxuXFx0Y29udGVudDogbm9uZTtcXG59XFxudGFibGUge1xcblxcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuXFx0Ym9yZGVyLXNwYWNpbmc6IDA7XFxufVxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbTV2WkdWZmJXOWtkV3hsY3k5eVpYTmxkQzVqYzNNdmJtOWtaVjl0YjJSMWJHVnpMM0psYzJWMExtTnpjeTl5WlhObGRDNWpjM01pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN096dEZRVWRGT3p0QlFVVkdPenM3T3pzN096czdPenM3TzBOQllVTXNWVUZCVlR0RFFVTldMRmRCUVZjN1EwRkRXQ3hWUVVGVk8wTkJRMVlzWjBKQlFXZENPME5CUTJoQ0xHTkJRV003UTBGRFpDeDVRa0ZCZVVJN1EwRkRla0k3UVVGRFJDeHBSRUZCYVVRN1FVRkRha1E3TzBOQlJVTXNaVUZCWlR0RFFVTm1PMEZCUTBRN1EwRkRReXhsUVVGbE8wTkJRMlk3UVVGRFJEdERRVU5ETEdsQ1FVRnBRanREUVVOcVFqdEJRVU5FTzBOQlEwTXNZVUZCWVR0RFFVTmlPMEZCUTBRN08wTkJSVU1zV1VGQldUdERRVU5hTEdOQlFXTTdRMEZEWkR0QlFVTkVPME5CUTBNc01FSkJRVEJDTzBOQlF6RkNMR3RDUVVGclFqdERRVU5zUWlJc0ltWnBiR1VpT2lKMGJ5NWpjM01pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpQm9kSFJ3T2k4dmJXVjVaWEozWldJdVkyOXRMMlZ5YVdNdmRHOXZiSE12WTNOekwzSmxjMlYwTHlCY2JpQWdJSFl5TGpBZ2ZDQXlNREV4TURFeU5seHVJQ0FnVEdsalpXNXpaVG9nYm05dVpTQW9jSFZpYkdsaklHUnZiV0ZwYmlsY2Jpb3ZYRzVjYm1oMGJXd3NJR0p2Wkhrc0lHUnBkaXdnYzNCaGJpd2dZWEJ3YkdWMExDQnZZbXBsWTNRc0lHbG1jbUZ0WlN4Y2JtZ3hMQ0JvTWl3Z2FETXNJR2cwTENCb05Td2dhRFlzSUhBc0lHSnNiMk5yY1hWdmRHVXNJSEJ5WlN4Y2JtRXNJR0ZpWW5Jc0lHRmpjbTl1ZVcwc0lHRmtaSEpsYzNNc0lHSnBaeXdnWTJsMFpTd2dZMjlrWlN4Y2JtUmxiQ3dnWkdadUxDQmxiU3dnYVcxbkxDQnBibk1zSUd0aVpDd2djU3dnY3l3Z2MyRnRjQ3hjYm5OdFlXeHNMQ0J6ZEhKcGEyVXNJSE4wY205dVp5d2djM1ZpTENCemRYQXNJSFIwTENCMllYSXNYRzVpTENCMUxDQnBMQ0JqWlc1MFpYSXNYRzVrYkN3Z1pIUXNJR1JrTENCdmJDd2dkV3dzSUd4cExGeHVabWxsYkdSelpYUXNJR1p2Y20wc0lHeGhZbVZzTENCc1pXZGxibVFzWEc1MFlXSnNaU3dnWTJGd2RHbHZiaXdnZEdKdlpIa3NJSFJtYjI5MExDQjBhR1ZoWkN3Z2RISXNJSFJvTENCMFpDeGNibUZ5ZEdsamJHVXNJR0Z6YVdSbExDQmpZVzUyWVhNc0lHUmxkR0ZwYkhNc0lHVnRZbVZrTENCY2JtWnBaM1Z5WlN3Z1ptbG5ZMkZ3ZEdsdmJpd2dabTl2ZEdWeUxDQm9aV0ZrWlhJc0lHaG5jbTkxY0N3Z1hHNXRaVzUxTENCdVlYWXNJRzkxZEhCMWRDd2djblZpZVN3Z2MyVmpkR2x2Yml3Z2MzVnRiV0Z5ZVN4Y2JuUnBiV1VzSUcxaGNtc3NJR0YxWkdsdkxDQjJhV1JsYnlCN1hHNWNkRzFoY21kcGJqb2dNRHRjYmx4MGNHRmtaR2x1WnpvZ01EdGNibHgwWW05eVpHVnlPaUF3TzF4dVhIUm1iMjUwTFhOcGVtVTZJREV3TUNVN1hHNWNkR1p2Ym5RNklHbHVhR1Z5YVhRN1hHNWNkSFpsY25ScFkyRnNMV0ZzYVdkdU9pQmlZWE5sYkdsdVpUdGNibjFjYmk4cUlFaFVUVXcxSUdScGMzQnNZWGt0Y205c1pTQnlaWE5sZENCbWIzSWdiMnhrWlhJZ1luSnZkM05sY25NZ0tpOWNibUZ5ZEdsamJHVXNJR0Z6YVdSbExDQmtaWFJoYVd4ekxDQm1hV2RqWVhCMGFXOXVMQ0JtYVdkMWNtVXNJRnh1Wm05dmRHVnlMQ0JvWldGa1pYSXNJR2huY205MWNDd2diV1Z1ZFN3Z2JtRjJMQ0J6WldOMGFXOXVJSHRjYmx4MFpHbHpjR3hoZVRvZ1lteHZZMnM3WEc1OVhHNWliMlI1SUh0Y2JseDBiR2x1WlMxb1pXbG5hSFE2SURFN1hHNTlYRzV2YkN3Z2RXd2dlMXh1WEhSc2FYTjBMWE4wZVd4bE9pQnViMjVsTzF4dWZWeHVZbXh2WTJ0eGRXOTBaU3dnY1NCN1hHNWNkSEYxYjNSbGN6b2dibTl1WlR0Y2JuMWNibUpzYjJOcmNYVnZkR1U2WW1WbWIzSmxMQ0JpYkc5amEzRjFiM1JsT21GbWRHVnlMRnh1Y1RwaVpXWnZjbVVzSUhFNllXWjBaWElnZTF4dVhIUmpiMjUwWlc1ME9pQW5KenRjYmx4MFkyOXVkR1Z1ZERvZ2JtOXVaVHRjYm4xY2JuUmhZbXhsSUh0Y2JseDBZbTl5WkdWeUxXTnZiR3hoY0hObE9pQmpiMnhzWVhCelpUdGNibHgwWW05eVpHVnlMWE53WVdOcGJtYzZJREE3WEc1OUlsMTkgKi9cIikgfHwgdHJ1ZSkgJiYgXCJfYmExZDU5YjBcIilcblxuICBEZWxlZ2F0b3IoKVxuXG4gIHZhciBzdGF0ZSA9IEFwcCh7XG4gICAgbWVzc2FnZXM6IG1lc3NhZ2VzXG4gIH0pXG4gIHZhciBsb29wID0gbWFpbkxvb3Aoc3RhdGUoKSwgQXBwLnJlbmRlciwgdmRvbSlcbiAgdmFyIHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcblxuICByb290LmFwcGVuZENoaWxkKGxvb3AudGFyZ2V0KVxuICByb290LmNsYXNzTGlzdC5hZGQocmVzZXQpXG5cbiAgc3RhdGUobG9vcC51cGRhdGUpXG5cbiAgcmV0dXJuIHN0YXRlXG59XG5cblxuZnVuY3Rpb24gcHJlcGFyZURhdGEgKGNvbnZlcnNhdGlvbiwgaW5kZXgpIHtcbiAgY29udmVyc2F0aW9uLmlkID0gY3VpZCgpXG4gIGNvbnZlcnNhdGlvbi53aXRoLnBob3RvID0gRGF0YVVyaSgnaW1hZ2UvanBlZycsIHBob3Rvc1tpbmRleF0pXG4gIGNvbnZlcnNhdGlvbi5tZXNzYWdlcyA9IGNvbnZlcnNhdGlvbi5tZXNzYWdlcyB8fCBbXVxuICBjb252ZXJzYXRpb24ubWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIG1lc3NhZ2UuaWQgPSBjdWlkKClcbiAgfSlcbn1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbiAge1xuICAgIFwid2l0aFwiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiBcIkpvcmRvblwiLFxuICAgICAgXCJsYXN0TmFtZVwiOiBcIlNpbHZhXCJcbiAgICB9LFxuICAgIFwibWVzc2FnZXNcIjogW3tcbiAgICAgIFwibWVcIjogZmFsc2UsXG4gICAgICBcInRleHRcIjogXCJIZXkgZGlkIHlvdSBoYXZlIGRpbm5lciBwbGFucyBmb3IgdG9uaWdodD8gSSB3YXMgdGhpbmtpbmcgd2UgZ28gdG8gdGhlIENyYWZ0ZXIuXCJcbiAgICB9LCB7XG4gICAgICBcIm1lXCI6IHRydWUsXG4gICAgICBcInRleHRcIjogXCJJIGRvbid0IGtub3cgbWFuLCB0aGF0IHNvdW5kcyByZWFsbHkgY3JhenkuXCJcbiAgICB9LCB7XG4gICAgICBcIm1lXCI6IHRydWUsXG4gICAgICBcInRleHRcIjogXCJIb3cgYWJvdXQgd2UganVzdCBnbyB0byB0aGUgb3RoZXIgcGxhY2UgaW5zdGVhZD9cIlxuICAgIH0sIHtcbiAgICAgIFwibWVcIjogZmFsc2UsXG4gICAgICBcInRleHRcIjogXCJUaGF0J3MgZHVtYi4gVGhlIENyYWZ0ZXIgaXMgd2hlcmUgaXQncyBhdC4gUmVtZW1iZXIgaG93IGxhc3QgdGltZSB3ZSBzYXcgYWxsIHRoYXQgY29vbCBzdHVmZiB0aGVyZT8gV2Ugc2F3IHRoZSBmaXJld29ya3MuXCJcbiAgICB9LCB7XG4gICAgICBcIm1lXCI6IGZhbHNlLFxuICAgICAgXCJ0ZXh0XCI6IFwiV2UgZXZlbiBzYXcgWnVja2VyYmVyZyB0aGVyZSAtLSBadWNrIGtub3dzIHdoZXJlIGl0J3MgYXQsIGR1ZGUuIEkga25vdyBoZSB3ZWFycyB0aGUgc2FtZSBULVNoaXJ0IGV2ZXJ5IGRheSwgYnV0IGhlIGtub3dzIGhpcyBmb29kLiBZb3Ugc2hvdWxkIHJlYWxseSBnby5cIlxuICAgIH0sIHtcbiAgICAgIFwibWVcIjogdHJ1ZSxcbiAgICAgIFwidGV4dFwiOiBcIlp1Y2sgaXMgc3VwZXIgbGFtZS4gQW5kIHlvdSBhcmUgdG9vIGZvciBsaWtpbmcgaGlzIHRhc3RlIGluIGZvb2QuXCJcbiAgICB9XVxuICB9LFxuICB7XG4gICAgXCJ3aXRoXCI6IHtcbiAgICAgIFwiZmlyc3ROYW1lXCI6IFwiTGF3ZXJlbmNlXCIsXG4gICAgICBcImxhc3ROYW1lXCI6IFwiTW9yZ2FuXCJcbiAgICB9LFxuICB9LFxuICB7XG4gICAgXCJ3aXRoXCI6IHtcbiAgICAgIFwiZmlyc3ROYW1lXCI6IFwiVHJ1bGFcIixcbiAgICAgIFwibGFzdE5hbWVcIjogXCJSYW1pcmV6XCJcbiAgICB9LFxuICB9LFxuICB7XG4gICAgXCJ3aXRoXCI6IHtcbiAgICAgIFwiZmlyc3ROYW1lXCI6IFwiTWVsZGFcIixcbiAgICAgIFwibGFzdE5hbWVcIjogXCJZb3VuZ1wiXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIFwid2l0aFwiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiBcIkVtZXJpdGFcIixcbiAgICAgIFwibGFzdE5hbWVcIjogXCJCbGFrZVwiXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIFwid2l0aFwiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiBcIlNoZW5pdGFcIixcbiAgICAgIFwibGFzdE5hbWVcIjogXCJEYXlcIlxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBcIndpdGhcIjoge1xuICAgICAgXCJmaXJzdE5hbWVcIjogXCJUZXNoYVwiLFxuICAgICAgXCJsYXN0TmFtZVwiOiBcIkZvd2xlclwiXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIFwid2l0aFwiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiBcIkpvc2lhaFwiLFxuICAgICAgXCJsYXN0TmFtZVwiOiBcIk11cnBoeVwiXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIFwid2l0aFwiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiBcIkRlbHBoYVwiLFxuICAgICAgXCJsYXN0TmFtZVwiOiBcIkhhbnNlblwiXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIFwid2l0aFwiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiBcIkplZmZlcmV5XCIsXG4gICAgICBcImxhc3ROYW1lXCI6IFwiRnJlZW1hblwiXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIFwid2l0aFwiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiBcIkxhcnJ5XCIsXG4gICAgICBcImxhc3ROYW1lXCI6IFwiS2VubmVkeVwiXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIFwid2l0aFwiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiBcIkJyZXR0XCIsXG4gICAgICBcImxhc3ROYW1lXCI6IFwiQ2hhdmV6XCJcbiAgICB9LFxuICB9LFxuICB7XG4gICAgXCJ3aXRoXCI6IHtcbiAgICAgIFwiZmlyc3ROYW1lXCI6IFwiRXhpZVwiLFxuICAgICAgXCJsYXN0TmFtZVwiOiBcIlJvYmVydHNvblwiXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIFwid2l0aFwiOiB7XG4gICAgICBcImZpcnN0TmFtZVwiOiBcIkJlcnJ5XCIsXG4gICAgICBcImxhc3ROYW1lXCI6IFwiR3JlZW5cIlxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBcIndpdGhcIjoge1xuICAgICAgXCJmaXJzdE5hbWVcIjogXCJNYXJnYXJldGFcIixcbiAgICAgIFwibGFzdE5hbWVcIjogXCJXaXNlXCJcbiAgICB9XG4gIH1cbl1cbiIsIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgXCIvOWovNEFBUVNrWkpSZ0FCQVFFQVNBQklBQUQvNGd4WVNVTkRYMUJTVDBaSlRFVUFBUUVBQUF4SVRHbHVid0lRQUFCdGJuUnlVa2RDSUZoWldpQUh6Z0FDQUFrQUJnQXhBQUJoWTNOd1RWTkdWQUFBQUFCSlJVTWdjMUpIUWdBQUFBQUFBQUFBQUFBQUFRQUE5dFlBQVFBQUFBRFRMVWhRSUNBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCRmpjSEowQUFBQlVBQUFBRE5rWlhOakFBQUJoQUFBQUd4M2RIQjBBQUFCOEFBQUFCUmlhM0IwQUFBQ0JBQUFBQlJ5V0ZsYUFBQUNHQUFBQUJSbldGbGFBQUFDTEFBQUFCUmlXRmxhQUFBQ1FBQUFBQlJrYlc1a0FBQUNWQUFBQUhCa2JXUmtBQUFDeEFBQUFJaDJkV1ZrQUFBRFRBQUFBSVoyYVdWM0FBQUQxQUFBQUNSc2RXMXBBQUFEK0FBQUFCUnRaV0Z6QUFBRURBQUFBQ1IwWldOb0FBQUVNQUFBQUF4eVZGSkRBQUFFUEFBQUNBeG5WRkpEQUFBRVBBQUFDQXhpVkZKREFBQUVQQUFBQ0F4MFpYaDBBQUFBQUVOdmNIbHlhV2RvZENBb1l5a2dNVGs1T0NCSVpYZHNaWFIwTFZCaFkydGhjbVFnUTI5dGNHRnVlUUFBWkdWell3QUFBQUFBQUFBU2MxSkhRaUJKUlVNMk1UazJOaTB5TGpFQUFBQUFBQUFBQUFBQUFCSnpVa2RDSUVsRlF6WXhPVFkyTFRJdU1RQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBV0ZsYUlBQUFBQUFBQVBOUkFBRUFBQUFCRnN4WVdWb2dBQUFBQUFBQUFBQUFBQUFBQUFBQUFGaFpXaUFBQUFBQUFBQnZvZ0FBT1BVQUFBT1FXRmxhSUFBQUFBQUFBR0taQUFDM2hRQUFHTnBZV1ZvZ0FBQUFBQUFBSktBQUFBK0VBQUMyejJSbGMyTUFBQUFBQUFBQUZrbEZReUJvZEhSd09pOHZkM2QzTG1sbFl5NWphQUFBQUFBQUFBQUFBQUFBRmtsRlF5Qm9kSFJ3T2k4dmQzZDNMbWxsWXk1amFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQmtaWE5qQUFBQUFBQUFBQzVKUlVNZ05qRTVOall0TWk0eElFUmxabUYxYkhRZ1VrZENJR052Ykc5MWNpQnpjR0ZqWlNBdElITlNSMElBQUFBQUFBQUFBQUFBQUM1SlJVTWdOakU1TmpZdE1pNHhJRVJsWm1GMWJIUWdVa2RDSUdOdmJHOTFjaUJ6Y0dGalpTQXRJSE5TUjBJQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFaR1Z6WXdBQUFBQUFBQUFzVW1WbVpYSmxibU5sSUZacFpYZHBibWNnUTI5dVpHbDBhVzl1SUdsdUlFbEZRell4T1RZMkxUSXVNUUFBQUFBQUFBQUFBQUFBTEZKbFptVnlaVzVqWlNCV2FXVjNhVzVuSUVOdmJtUnBkR2x2YmlCcGJpQkpSVU0yTVRrMk5pMHlMakVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBSFpwWlhjQUFBQUFBQk9rL2dBVVh5NEFFTThVQUFQdHpBQUVFd3NBQTF5ZUFBQUFBVmhaV2lBQUFBQUFBRXdKVmdCUUFBQUFWeC9uYldWaGN3QUFBQUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFvOEFBQUFDYzJsbklBQUFBQUJEVWxRZ1kzVnlkZ0FBQUFBQUFBUUFBQUFBQlFBS0FBOEFGQUFaQUI0QUl3QW9BQzBBTWdBM0FEc0FRQUJGQUVvQVR3QlVBRmtBWGdCakFHZ0FiUUJ5QUhjQWZBQ0JBSVlBaXdDUUFKVUFtZ0NmQUtRQXFRQ3VBTElBdHdDOEFNRUF4Z0RMQU5BQTFRRGJBT0FBNVFEckFQQUE5Z0Q3QVFFQkJ3RU5BUk1CR1FFZkFTVUJLd0V5QVRnQlBnRkZBVXdCVWdGWkFXQUJad0Z1QVhVQmZBR0RBWXNCa2dHYUFhRUJxUUd4QWJrQndRSEpBZEVCMlFIaEFla0I4Z0g2QWdNQ0RBSVVBaDBDSmdJdkFqZ0NRUUpMQWxRQ1hRSm5BbkVDZWdLRUFvNENtQUtpQXF3Q3RnTEJBc3NDMVFMZ0F1c0M5UU1BQXdzREZnTWhBeTBET0FOREEwOERXZ05tQTNJRGZnT0tBNVlEb2dPdUE3b0R4d1BUQStBRDdBUDVCQVlFRXdRZ0JDMEVPd1JJQkZVRVl3UnhCSDRFakFTYUJLZ0V0Z1RFQk5NRTRRVHdCUDRGRFFVY0JTc0ZPZ1ZKQlZnRlp3VjNCWVlGbGdXbUJiVUZ4UVhWQmVVRjlnWUdCaFlHSndZM0JrZ0dXUVpxQm5zR2pBYWRCcThHd0FiUkJ1TUc5UWNIQnhrSEt3YzlCMDhIWVFkMEI0WUhtUWVzQjc4SDBnZmxCL2dJQ3dnZkNESUlSZ2hhQ0c0SWdnaVdDS29JdmdqU0NPY0krd2tRQ1NVSk9nbFBDV1FKZVFtUENhUUp1Z25QQ2VVSit3b1JDaWNLUFFwVUNtb0tnUXFZQ3E0S3hRcmNDdk1MQ3dzaUN6a0xVUXRwQzRBTG1BdXdDOGdMNFF2NURCSU1LZ3hEREZ3TWRReU9ES2NNd0F6WkRQTU5EUTBtRFVBTldnMTBEWTROcVEzRERkNE4rQTRURGk0T1NRNWtEbjhPbXc2MkR0SU83ZzhKRHlVUFFROWVEM29QbGcrekQ4OFA3QkFKRUNZUVF4QmhFSDRRbXhDNUVOY1E5UkVURVRFUlR4RnRFWXdScWhISkVlZ1NCeEltRWtVU1pCS0VFcU1Td3hMakV3TVRJeE5ERTJNVGd4T2tFOFVUNVJRR0ZDY1VTUlJxRklzVXJSVE9GUEFWRWhVMEZWWVZlQldiRmIwVjRCWURGaVlXU1Jac0ZvOFdzaGJXRnZvWEhSZEJGMlVYaVJldUY5SVg5eGdiR0VBWVpSaUtHSzhZMVJqNkdTQVpSUmxyR1pFWnR4bmRHZ1FhS2hwUkduY2FuaHJGR3V3YkZCczdHMk1iaWh1eUc5b2NBaHdxSEZJY2V4eWpITXdjOVIwZUhVY2RjQjJaSGNNZDdCNFdIa0FlYWg2VUhyNGU2UjhUSHo0ZmFSK1VINzhmNmlBVklFRWdiQ0NZSU1RZzhDRWNJVWdoZFNHaEljNGgreUluSWxVaWdpS3ZJdDBqQ2lNNEkyWWpsQ1BDSS9Ba0h5Uk5KSHdrcXlUYUpRa2xPQ1ZvSlpjbHh5WDNKaWNtVnlhSEpyY202Q2NZSjBrbmVpZXJKOXdvRFNnL0tIRW9vaWpVS1FZcE9DbHJLWjBwMENvQ0tqVXFhQ3FiS3M4ckFpczJLMmtyblN2UkxBVXNPU3h1TEtJczF5ME1MVUV0ZGkyckxlRXVGaTVNTG9JdXR5N3VMeVF2V2krUkw4Y3YvakExTUd3d3BERGJNUkl4U2pHQ01ib3g4aklxTW1NeW16TFVNdzB6UmpOL003Z3o4VFFyTkdVMG5qVFlOUk0xVFRXSE5jSTEvVFkzTm5JMnJqYnBOeVEzWURlY045YzRGRGhRT0l3NHlEa0ZPVUk1ZnptOE9mazZOanAwT3JJNjd6c3RPMnM3cWp2b1BDYzhaVHlrUE9NOUlqMWhQYUU5NEQ0Z1BtQStvRDdnUHlFL1lUK2lQK0pBSTBCa1FLWkE1MEVwUVdwQnJFSHVRakJDY2tLMVF2ZERPa045UThCRUEwUkhSSXBFemtVU1JWVkZta1hlUmlKR1owYXJSdkJITlVkN1I4QklCVWhMU0pGSTEwa2RTV05KcVVud1NqZEtmVXJFU3d4TFUwdWFTK0pNS2t4eVRMcE5BazFLVFpOTjNFNGxUbTVPdDA4QVQwbFBrMC9kVUNkUWNWQzdVUVpSVUZHYlVlWlNNVko4VXNkVEUxTmZVNnBUOWxSQ1ZJOVUyMVVvVlhWVndsWVBWbHhXcVZiM1YwUlhrbGZnV0M5WWZWakxXUnBaYVZtNFdnZGFWbHFtV3ZWYlJWdVZXK1ZjTlZ5R1hOWmRKMTE0WGNsZUdsNXNYcjFmRDE5aFg3TmdCV0JYWUtwZy9HRlBZYUpoOVdKSllweGk4R05EWTVkajYyUkFaSlJrNldVOVpaSmw1Mlk5WnBKbTZHYzlaNU5uNldnL2FKWm83R2xEYVpwcDhXcElhcDlxOTJ0UGE2ZHIvMnhYYks5dENHMWdiYmx1RW01cmJzUnZIbTk0YjlGd0szQ0djT0J4T25HVmNmQnlTM0ttY3dGelhYTzRkQlIwY0hUTWRTaDFoWFhoZGo1Mm0zYjRkMVozczNnUmVHNTR6SGtxZVlsNTUzcEdlcVY3Qkh0amU4SjhJWHlCZk9GOVFYMmhmZ0YrWW43Q2Z5Ti9oSC9sZ0VlQXFJRUtnV3VCellJd2dwS0M5SU5YZzdxRUhZU0FoT09GUjRXcmhnNkdjb2JYaHp1SG40Z0VpR21Jem9remlabUovb3BraXNxTE1JdVdpL3lNWTR6S2pUR05tSTMvam1hT3pvODJqNTZRQnBCdWtOYVJQNUdva2hHU2VwTGprMDJUdHBRZ2xJcVU5SlZmbGNtV05KYWZsd3FYZFpmZ21FeVl1SmtrbVpDWi9KcG9tdFdiUXB1dm5CeWNpWnozbldTZDBwNUFucTZmSForTG4vcWdhYURZb1VlaHRxSW1vcGFqQnFOMm8rYWtWcVRIcFRpbHFhWWFwb3VtL2FkdXArQ29VcWpFcVRlcHFhb2NxbytyQXF0MXErbXNYS3pRclVTdHVLNHRycUd2RnErTHNBQ3dkYkRxc1dDeDFySkxzc0t6T0xPdXRDVzBuTFVUdFlxMkFiWjV0dkMzYUxmZ3VGbTQwYmxLdWNLNk83cTF1eTY3cDd3aHZKdTlGYjJQdmdxK2hMNy92M3EvOWNCd3dPekJaOEhqd2wvQzI4Tll3OVRFVWNUT3hVdkZ5TVpHeHNQSFFjZS95RDNJdk1rNnlibktPTXEzeXpiTHRzdzF6TFhOTmMyMXpqYk90czgzejdqUU9kQzYwVHpSdnRJLzBzSFRSTlBHMUVuVXk5Vk8xZEhXVmRiWTExelg0TmhrMk9qWmJObngybmJhKzl1QTNBWGNpdDBRM1piZUhONmkzeW5mcitBMjRMM2hST0hNNGxQaTIrTmo0K3ZrYytUODVZVG1EZWFXNXgvbnFlZ3k2THpwUnVuUTZsdnE1ZXR3Ni92c2h1MFI3Wnp1S082MDcwRHZ6UEJZOE9YeGN2SC84b3p6R2ZPbjlEVDB3dlZROWQ3MmJmYjc5NHI0R2ZpbytUajV4L3BYK3VmN2Qvd0gvSmo5S2YyNi9rdiszUDl0Ly8vLzJ3QkRBQUlDQWdJQ0FRSUNBZ0lEQWdJREF3WUVBd01EQXdjRkJRUUdDQWNKQ0FnSENBZ0pDZzBMQ1FvTUNnZ0lDdzhMREEwT0RnOE9DUXNRRVJBT0VRME9EZzcvMndCREFRSURBd01EQXdjRUJBY09DUWdKRGc0T0RnNE9EZzRPRGc0T0RnNE9EZzRPRGc0T0RnNE9EZzRPRGc0T0RnNE9EZzRPRGc0T0RnNE9EZzRPRGc0T0RnNy93QUFSQ0FDQUFJQURBUkVBQWhFQkF4RUIvOFFBSGdBQUFRUURBUUVCQUFBQUFBQUFBQUFBQ0FVR0J3a0FBd1FDQVFyL3hBQStFQUFCQXdNREFnVUNCQU1IQVFrQUFBQUJBZ01FQlFZUkFBY2hFakVJRXlKQlVUSmhGQ05DY1JXQmtRa2tVbUtoc2RIaEZoYzBRM09Ub3NIdy84UUFIQUVBQVFRREFRQUFBQUFBQUFBQUFBQUFCUUFEQkFZQkFnY0kvOFFBTnhFQUFRTURBZ1FEQmdZQkJBTUFBQUFBQVFJREVRQUVJUkl4QlVGUllSTWljUVl5Z2FHeDhCUkNrY0hSNFZJVkkzTHhRMktDLzlvQURBTUJBQUlSQXhFQVB3Qy96U3BWbWxTck5LbFh3cVNNNU9OWW1sVEp2UGNPemJCdDlkUnV5dnhhUXhnZENIRjlUcnBQWUliR1ZLemoyR3NTSXBoMTV0a2VjeFFtUGVOT2pWTjI0WlZ2V2ZPYXQra3hSSUZUcWg2Rnp6bkhsTXNONVVsUkdTQ3M0NHdRTyttMzFLUkNFUnFPUFQxb003eExTUUcwek8vcHpqdlVBWDM0cU54WGFKY3RXaTE2YlM2RkNaVzhwNmx3RXRpTWpweWpDaWtsUkhBVVNlNTFIWkx6cmlFQWlWRVlvZjhBaU9JT3ZFSlZDZlNoY3RyZEhkdTlyVXB0ZE81MTdTWTh1WTR3bVcvV0pNZHAxYVFDb0lDTUJTazUra2ZJem83ZHhhdWx0UUVqTVUwKzljdExoU2pCKytWVGxaVzRPNUZ2N29XL1I1ZTVGMU1HcU5NVEdGVk9XdVVseEk2dk1TcjZ2S3lCbnBVTThnNnExemNyZHQxdUlIdVNNR1BUZmVPdE5OcnVWbVFzZyt0SFJUcjJ2eUxkN3lHYTZhdFM1VGdkaHFxRUZLUUVZQVduSUFQU2xSd0QzT3FpbmpWNGxtVmJqY1lQem82bFZ3eW9ncUtncmFZL2FwZG1ibVV5MzZBM0l1SkN3OEcwcmRFRmhiZzU5d1BZZnoxTXN2YUEzVGdRdHVKeElJK2hqNVVWTG9iU05lL09uelJiZ3BGZHBxSkZMbnRTa0ZJVVVoV0ZwQi94SlBJL25xM3MzTER3T2hRTVUrQ0R0UzJGQW5nZzZtVFdhKzZ6U3JOS2xXYVZLczBxVlpwVXE1NU1wbUpHY2ZrT29ZWWJRVnVPT0tDVUlTQmtxVVR3QUJ6azZ4TktxNGQ3UEdwSVRjN1ZyYkx3L3dDSnhoSjhxcVhTNDNsb0pIZE1NSGhST0NBOHIwakhwQjc2a0J0SVFvcU1IcFFhNHZrSlNVb09hZ1doYkxYSnZQZk5lcU5QclVwaUk3RmFmZXJ0Vm5MbVNIRmw0WmJKVnpucERod2s0VGdBOXhxdHZjVlRadHBMM25XWndNZkgwb1BiTXZYcmhLOTQzbzI5dGRwTGUyOHBEVldtQmlyWEJIaXFpS25Gdjh0TEE3QkRaNFNTbmxlTytTTTR4cWdYdkVYSHpBOHFabU8vclZxcytIaGtnYnE2MDVxN2JHMzl4MG1URFRDcDBlWFVZYjBaTWxsaEpDMjFuelhVZHVrazlmWGhRUFBQSUJHbUc3MXhEZ0lVY1FmMG93bTFlWlVWRkVBYi9IKzZqKzJ0bUxEczJWYTZnK2gySFRLWXFGRHA0aHR0UlF0YmhjVzhFcDlJVXRQUUNCeDZBUmp0cVJkOFpmY0Npb21WR1NaaytrOUsxRmdxNFZJUkFUeS9yblRyUXF6bXR6S1RUb2NhS3FzQ0k4cHRiclNWbGFVcERlQ2UvVjA5UHpsTFkrQWRBbFh6anFDQWNldUFlUW9namc2bW1UY0xFRGIrL3ZyVDNxTWRkVHM1NytGdHBFbHNLeTJ3c1pXbFE1NkQ4NUFVQjdrSFNZVjR2T0NEOEtCWHJDMnhwU0QycU1idnVDTEFodTB4d0NUVEhJaUhYbXp3NkEzaEpDMDl3ZWNrSDJCMC9aV2JxejRwOTRFaWVWUUZMUW82YzVIL0FIU1RSNmpJRXBjaTM2a1k2M1dnaENtMUZ0V0VuT1I3OGFKQlRqSzBxWGhRNmIvclVjVE1nMU9GcWJseUcwQ0xkeUZSME5xQ0JVL0o2RUtKN2RZOXMvNGh4OGdhdWRueGRDeUVQYjlmNXFVaHhTVHBYVTJOUE52TkljYVdGb1VrS1NwSkJCQjdFRWR4cTFnelV1dHVzMHF6U3BWbWxTclJJZlJIaktlZFdsdHBDU3BhMXFDUWtBWkpKUEFBSE9zSGFsVmNXOFcrZHJiMjdPYm1XdlFLN050dWlRS1JMZWcxSjF3c1Jxd0dGQkMzVlk5YW1lc2RLVy8xNUNpTVkwRXZiaTh0YjlnTmpVZ3FBVUJ2SnpIVGFxN2NYYVhsRnRKZ0NxdGJqVlZiV3QyaFRKSm4wYWgzTkFRbU5VVVV0WTZHL01IUzYwRkZJVUZwUzZFakk2bHBIWUhPcm5hK0ZkdUxTbUZLYjNFNTIyUG9ZbnRKcU16YmEzRWh6SE9ldmFyMmJRZzI1YXUwRkJvTm94aWJmajAxaitIdkJhQXFVZ29CRHF5Unl0UTVVVGdray9HdlBWM2N1UFhTMVBlOFNaOWVucFY5YXRkS1JwalBLbUpjKzRFZWlRSmthWElFVXVoUVFYaU9uSjR4MUFqL0FFSVA5TWFpZ3R2ZVVIUDBxNE1jTmNkSVcybVkrOGloS203Mk8ycSsxUGZVbDZQVHFsR2NJYmVEclR6Q0ZGUFZqQUxibmxxS0NGQUJRNlNrbm5WMnQrRm9lYkFUbFJCenRKam1OcTJ1bFM4VSs2MnFRWjNUT1NCRzRuTThzelJCU3J4cDlTdFdaVXFGSWFUUVZFcEljZElSRVdNcWJBV01ob0w2MDlKSUFPVWpQT05WL3dBRUVsRHVEdDYweWxwNXBhRkFTZDU2ajAvTjNBMnFPNHRWdUEyeEZxVmFteFpRalBxTWlaQ2NQOTFiOHcrUzZ0YWZVMFR5Q29laktTTW50cDE2enN0WlMzMEcvWCtxbHMzVnlER21Ka0FEbmpJQ1RoWHB2bWlZdEN1VkdTMlhQeEtKTWxMWVc2d1d3bDBJUElQbzlEaVQrbHhIQjdrQWtqVlg4SlRUaFVuOVBRMEx2RzJDZ0pLU0IxNWZQS2ZRL0RGTHRkdFdpWGowU1hnbGEzMnlHSmFCMHZ4empDa2pQMUlPU2xTRmZ2eGc2TXMzRGpZQ2tuQjNGVmxiWVNkSzArWlB6QisvanRVRlNySHJGbVJJOEtiWGxLU2xJZWpTMEpLVkZRNFZoUjdEc1NEMjBlRndoOG1VYjdpcTY4andqSXJsRnp1VDRybEhtekdwYjhkSlVYVzhxV29IanE2Z2NZSTBrMnlXajRxQkFQS215U3FOUStWUzN0MXVnM2JNcURRS3ZJTDl2dXA2V0pCeVRFVm5BR2ZkSjduNDBmc2J4eG9hWFBkK245VTgyN29PbFZGaTA0SEdVcVNRVWtaU1FjZ2o1R3JhREltaU5iZGJVcThxUFNncVBBSGZTcFZXWjQ0ZC9aY1dULzNKMlhVVEdxRHpLWk56eTJsY3R0SDFJaUUrd1dQVTRlL1QwcC9VZFRHV3hHdFcxQXIrNDBndGo0MEI5SWN1NjlJTnUwcWliZnZNMGN5R2tRNTd3QVhQbEJLbTFLWlV2QVUyVkFBb0hIVU5EbnpaMnlscmRlQlVKSkFueXBKRVQzajVVQVMySkptVFJFM3hiMDJIL1o1N2wyVmNRbFYyNjNLZFRxS3pRWElpWG5LWTY2NGxjWlNDRGh0S2puQ3NrWlRnWXhqVktzcmhCOW9tTHBpRXR5dFdxWUNnTUdlcDdSUkZ0WVNncmpJZ0hPdzdldFR2UTl3NkZaZXc5blU2cTNOQ1N3elRZVlBqeTZrdGFIVlBCcERTbTFvUHFVNFhrckNRQVBZS3hqSkVYTml1K3ZuQzBqekVsVURhQ1ptZWtmRTEwdTB1RXBZRGlqNUR6NWsveFRabFdPM3ZOUVpOYXB0NVRaRkhMNm82SFlzZnlVS2NTY0xSaFFCOVBBUEdPUmduVFRWbzlZT3lwSTFiNXpqbFZydFBhUzJDZkNiYXdOeWR6NmRxYkI4SWxrSWdFVk9vVmlwTEtTbjExQXBTbEpPU0FCN1o5dTNPckdPTDNxUGRnZkFVUGN2UmNLeW5IcVRTNHh0Ui93QmtLWEhZdHF2VElpbVdESENKRHhmU3RvLytVc0g2MGNuQ1Q5UHRqUU4rNDhkenhISUpORXJhN1NwcndscGxQTEptZW9QTDkrZGROSHR5bzA1TUNheTI1QW14MHJDWlZPZkNNSVVmVTJwRGd3NDJTY2xDaWZzZVRrYTgrVmt5S2tLTFlDa0JmbFZ1RkNjanVNZzl3S2xpeVpVT0NsdGlRWTlKbklRUUc0eWxDTzZNakphU01sbko1Q0FSZzU0STBFZGNVSEpUZzFEdUdsclJJbFE3NzlNOWZVMFNOR21zVG9TSGtCdDVaR1ZCcFlXbFhHTWcrM0duMlZoeE5VUzdhVXlxRlNQV2tQY3UxNDl6N1NTWXFVS00yTCtkRXdjZFNramxDdmtLSGY4QTZhTFd6d1pVS0hBRlVwKzgwQ0ZHcWM2RFg1TFFpTXJWSWJWZ0xUNmxFWkJTQ1BqdHEyTFFsYVJuYWg2d0FKbkZTRFFKSWVvL2tpTW1JRktVcFRDbDU4cysyTSszNzZHWEE4TXpOTUtTQ2NtaWgyZnYwT3lHN09xSG10S0NDYVc4KzUxRnpBeXRzbjVISlNQalB4bzd3bTZVVStDNFpJMi9pcGpLd1BKUkZwT1JxMDFPcmpuUzBSYVRJZkp6MElKR0JrNTl2OWRRYnU2YnRMWlR5OWhTMzJxdVNWNFJMYWw3cDNaZEYwVmVzWGhPckMveFhucWZRdytvckpVVUs2UUU5UlYzeHgwNEFBeHFpM1h0WmNnSWJiaFBXTS85VlhqWnZxZktWU29mei9GVFdyWlNrUzdOZ1Vta1RqUkRUNHpJcHgvQnR2Q0U4azU2bWljRk9Ud1NPZmZPcXV4eEF2WEd0d1NWVE9jR2VScVlxeDhwU0RtUG55K2RWdDNudVRFcU83UWgzV3RjRzRJaUpWR1hLWmJTdGxRNjFvQ25tTTRXNjBza29VVHdTVkRYV0xQaFNXN1llQ2ZLWVZIUGJJQjVBakI3VlhGS2NVZ0pWblQvQUhqNTAwcVhRWlc2Y2pidXdJQm0xQzU2WEtURlRKVXoxZjNaR1BNbUxVbzlQNVdDcFJWeVR4M1VORnlVV0tubjhCSzVNY3YrSTlkaDBvbzNjM0Z3MmhvOHR2U3JjS2ZTb2xBdE9CUjRaTDBhR3dHdzRwSVNwNVhkYnFnT0FwYWlWSDdxMXpWWjFyMUhueTZkcXROdW5TSXBFcU01b0ZTQ2VnL3VNalE1MXlKbXJOYnNua0tqMm9UVStlUTBrTEpIdU9EOXovem9ZWGZOaXJJaG55K2FvcXZhNzVGT283TWVHQy9JQ2oxcUtjb2JIdndPQ280d08rQUNUN2FtTnRKV3ZOUHNNS1dvazdmZS93QzlROVFycnVDcTNHR0VTNWFXUE5DVW9ZV0U1Skp4Z0hBVXBSNEJKeHdTU0FNNklQMmpDR3hnVVNRQ2xSQTM2bmwzSHAyelZpMXZLbVFiRHBjT3FWeUtha0d2ekF0c09xSUl5a0tVa2hXT1BxSEpQWTQxVzBxUW5FaXVlM0tRN2NMVzIyZFBZeDlSSHdxUno1cXFVKzNJQ0hXSEU5S0ZlWmtoSjR6eno4Y0RQN25SREpTYXJuazFEVE9QdjBvTWI2c3MyTnVUQk1LTXQ2a1MwRlVXU1ZZWG5xOVRhbG5zUWZqR1FSOTlXSmk0THpQbVBtSDBxRStDRGpha21FKzNBbVRtMy9JUzBIZ1hXR3hra3E1d3MvcCsrc09qeEVpSnFDRktRY2lhNFkxeWZnYSszTG8weGJNeGgxRHJUblVWSVFzSEtlUjI3WVB0ZzZrb1E0alNvZkNtL05JTVJGV09XWGMwVzd0dEtSY0VZcFNKVE9YVzBuSWJjSEMwZnlVRC9MR3J1MDRIR3dzYzZOSlZxRTBPbmlwM1RuYlpiWFV1ZlQ0VTZxS0VwSmZpMHpoOVpWbERXVkgwb2J5RmRTbGNZSEhPZ3Qrd0w5NUZrVkJNeW9sVzBEdHozd0tGM2J6elMwK0VyU2R6NlJGUWpiKzhOWHFHeXRIY29Ua2U2cnNsekVGK2l5WGcxK0ZDL3FiTGljbFlTVDBoWHVjYW9yM0JVL2pscFdkQ0VqM2htZThkZTFNMnE3bHhYaEIweHo2eHpvUWJqOGF1NlZIdVRkQzJLN0ZrV3ZQVkcvQTB4NkdoQ0p0RG1NWmJYa0xCUXNMNzVVTTVDU08vSFE3UDJQNGJwdDdoZzZveVFUNVZnNXh6RVZMRndXa3FiM1BVOXFZc08xNm5VTGVwcWFlWUZXdUZ5QTB1Zk1xdUNPcDhwdzUxQWtxS2VvcU9lU1JrYWxydUcwdkVLbEtaTUFiNDVSVlhRc0tkazRrMFIvaC9wOW1iU1ZpNExpbjNaVWJqclVxa0piRWIrQkVLYmJYSVFwQ2dHM1hDWEpBTEJRbkNUMHFUbnVjUStKS2R1M0c3WktOTTVHY1FCSE1RTk9aL1dyamJXZmhNS3YxRWVHRG9Ja0FnNmRXQnVjRGZyamNpaUFWdlU1WDdmY3E5ajJ5OWRsSlROZWhoMzhVSWJyN2pLdWh6eUVPZ0IwQldVNUN1U2tnYUZLNE5mTm56Q2NUZ3pqNGRzOXFubzRqd1ZMM2czTng0S3pFQlFJR2RwVm1QalNiRDNDcGQxUkZQTVI1TUtRbFJRNjA2MlFwdFk0VWhZL1NRUWNnOGpIYlZPdkVOSVdVcU1HdWxNOFB1N2RJSkFJNVFRY2RxOFJhaW1SVW5JOGtsS3V3NHdDQ1BiUUFLQ1hJTkdGc3E4TFVtbVhlbEdIOEpmaUZBTEswbFRiZ0hLL2taSDMwUkRvUXNLRk0yc2xYbU9lbEQvT29zbUZjQWVRMmw0OU9Hd2ZwUU1lL0lISHpvOGg5TGplbWlJUW5WcW5JL21pRzIvdldkS1ZUbTVOVkRFZU82RU54WXdES0JuMGhBd090ekk1S3ZwU0R3ZW81MVhybGhEWUVERzgwT3VtRUVxQVRLanZPZTg5QisvWUNLTmlqVDB5S2FodHBLMlcxdUpUMUhxeXJQZFE2dVFEakdPK0NDY1oxbzBzRkVqRmMxdW1sb2NsV2QrbjdjNlM5ejJJYiswRXljOHRJWWlTRXVsUzJldElUMWRDaGo3anQyNUErY0Vxd29oZmw1MEVJSkpCNlVJMVVUUkUweVU4cDF1UEhrOUw0S3dwQWNRbmpDYytvam5KU2VSeCsraTdhbmk0T2NZb2RxYzBsSUh4cEhvMUFWT211c1IzbFFBVmRDbEZ4SVM2MmVla2o1K3cwN2NYSVpTRktFL3NhY2FTcHhjRGZ2UlkrSEN1QkJ1TzBTd0lqVEt4Tmh0WjV3VDVidi93QWdnL3pPckJ3eDBxU1VFenpwMWxaVmcxRC9BSWhOd0xZbVg3Y2xvSnE2YlRyc2w5dWt1MXVVeXB4dHRwQ090UlFuNlRna3BJNzVPb2R6YlhLNzR2bEd0Q0JoSTNKMk9malFTNWNTcDhwMDU2MEozaDR1TzFtYS9VSEo5WmRxRllpVG5DMDJsdnlrU1EwNmxTSEc4Z1lDa3BHVTkvdHFaeFZpNUFUNFlnUURubEk1OVlyUkpMS3RZeEFwaGVMN2JhanYzVmZ1N3RzVWlxTXpqVWc1ZHNkNlFqeUcxdnBRR2wrV3IxSlAwNTlqbkk5OUcvWmppTHl2Q3NYbENDRG9PU2NiaWFmZUtqY3FTb1FmNkIvZWhQMitxdFdPNk5Nb2NOK2JQY2xMYlpsUW9McW5USTZoMDlLVUorc2hKSUErY1kxZGIxaHMyNm5JQUhJbkdCMzdtdGd5a3JFam5Wa3QxMmhaRmlXbk1xVldsVk9nT0dxT1NvRVJKRHhwbVVsdUdsMURSSWNjUTRJL0hVZWdKQ2ZxSjF5aEYyN2MzeVVOblVzSWdua1lNcXllc245YTZXeXpkamhPZ29TR3k0RDdvMUdSQUdvNUNTQkpITWdFMHpLL2ZOeFNmRGUxWWRyME5GbHhJRkVZaE55U0ZDUklMWmJTU1FWSjhwTHA4d2txNkZCVG1WWXh6YlFoS25pdHhjeVp4dDFnZFl4K242YzRUd1ZscTdOMG9hcG5FRlE1eGpiSEw1YlVnV1RUdHhZY2UyNmhGbGZ4dERVTkxNaDJmT1NWeWkydGFNcWNTRmRRd0IzVXZnQTUxenpqNjdkeTZjUTZqU1p3VTV3UURtU005Y1Y2cTlsbXZaNUhBRW91TGh4S2xhcFQ0U1lTWjNCd1RIWDVWT0RzNitQeGlKS3JOaG5LQnd6Y0RTOC9QZHNhb25oc0ovT1Qvd0RCL1kwVEZwd0J4RUp2VkQxWlVQb28waDNkZVZ5c21oUTM3WlZUMmxPdVB2OEFtVFVQQlREU011Y3Q1NmNaVHlyQTVBQnljYUtXekxUN1MxU1RHMkl5ZHQvbkUwUEhDckJDeXBxOVNUamREZy9ZaWY3clRXYXBDbHhBM09vNzBOMURSQ25tbEpYOUl5ZlQvbEJ3Zi93MUJiOFJFUnY2ZjNXR3VIaGF2OXE0U3ZVZHAweFBLVkFEUGNpbVhiNzF5VTJvT1M3YmI4cHlhMzBwbnZJSllRZ2tCS3ljZnBWa2dISTdkeU1hTU9yczFwMFBtWXlRTjZoUDJqN1VwV0Q1ZVdESHoyUE9KeFJrd2EvSHRBUnFPaDZSVXFoVDRqVDdrdEtpcEszbmNOdGhSVnoxclVUaHZ1T1ZLd0FOVnB3T0xIaWpBekh3L2puVkpOc0x0UlVZQVVZNWJESnh0SGYwQW9oNjdLWWo3UzFndUg4dEVGd0ZKUUhQVjJHVW42aG51UGduUk5seVNNMXpsVFpVOUIrOFpxc1RjQkZacGttTEpjVzZJTldqSWtNTnJkQzBzaEtpRk1xT1RoU0ZoV0R3U25CQjVPdWgyU20xQWpvYzk2YUtCTXQ3R2tPZ3phZ3E3STdjU1RKaEdSdzY0d2t2cVVRTWpDRC9BTGp0cVM4aEhoa2tBeDF4ODZpT0JJU1NhS3JZU2RQamVJZTNwTVJVbVZUWlJmalRYSlRvVXBIVWc4Y2UzbUFZSDMxR3RWb2F1UWxVQW5hS2JiQjF6UVNiNVhOSnJ1OEc2OVVxTGtGVENidGtVeU9ZMFFKY2U4cVNwQ0VsMHF3aHpJSXpqSkExWmtOQkYybEtRWjk0NTZqZjA1MEhlU2ZIT090ZG0xOWd5NU83U0Nxbnk1VEVSdGIwdHFLNjIvVFk2bTI4cFpLaU1sMEVaS2s5ajhhRTMzRUEzYStSUUJPTWp6Wk1FK25RVkRWcGQ4cDU0cGcvMmdnL2czaVJvMGRFT1RDaFZTZ3haVWdzU1ZxVEtjVmtnS1BaZlIwOEE1SXp4d2RXYjJGYVV1MldTUVZKVVFKM0ErK2xGMU5uOFdzcTNNSGZxSVAwcUt2RFRXNDluK05HejdsTk5lbFJXRVA5YlBsL20vbXgxTnFXMlRqMXBDc2dIdmoyeU5IK05OdVhYRGxzQlFDanNaeGpJbnR5bmVuR25VMjc2SEhSSUJFajc1MVpQY2RKdCsrcmFubDV5UXFpb0JpbDlDd2hLeXBQWGhRUHJiVW5nZ0tIMUJKNUIxNXNjZDRsd1c4UXQxQkNnTVl3Wk1ZSXdmdWE5QmNQdU9IY1dzUzNiT0pYcWdrWkNrbE1RSU1ZUGJjVFNyYmRrMDZwVys3T2RkYmt4WmpTMm5GeUdWTktjUVQzVWhZeUNUejc1UElKNzZPRzljMEVwVkE1ZmZXZ2wwMGJhNFMwcHZ6b000eUo3RUdJKzRGUG1EYUVLblVLTERpTm9EYkxZUWtqUHJJSEtzSHRrNU9QYlZWdTMxUHVGd21wclQ2a3AwYmJtT2ttWXIyaW4rV0Nqb3lNOGpHU05DZFJJaXBwV1NKcmxxbHJNVkpzdUxTaEg1WFFFcVRrOExDeC9xbFBIK1Vha0lXNEUrV3NvdUEyWTNrejhpUDNOYVlxTGZvbElaUk9qdkVRK3BjWmFVZ3FlY3gxRkdEOWFsKy94Mzl0TXZMVU1ublRxV2JpN2ZLV296djBBR0Fld0ZQbW0xSndPVyt1VEphZGFxQmNibEZwZ05JTEpTb2xJVCtub1QxZTU1U0Q5OURRODU0cmEwUWRSK1JNZkxuenFGY1d6WWJmQ0VsUGh3UkpraFVqTTg1eCtzVkVGa21XNVUvNHBWbWxHWlZKaXFpN0hRTXVOTWhZalFtQWUrVHdvbnY2bkZmR2psNHB2d2docWRLQUI2ODFFL0hBcDk5a3RxVUFSaVFET0IrWlI2YmJqWUdBRHZVMGJyM05KbzIzYmxMWmNRSjB4cytibFFDV0d4Mno4RWs1Qi95SzBWNFN3cHh6VXZsWEpiMWFHd0NnYjgrdFY2eTMxUHdGUmx5ZzVJSkNIWENlcEpTbFJVa2Z5SnlNZmY1T3Vub1JCd01VTUM2MXM5VVZsbFVHVzQyNmxKYlc0SE9oU2VvSElHT2VkT0tBTWhReFRST28wL05rN2puMDNlR3dZTUZ6OFBIZXVCZ1Mya3FQNW1YZ24xWjdubk9zRmxDbmc0UkpFUlNjdzRCVG4zVjJTbHdhemVzcTFMZk5idStkYzA2WklZbVBvQ3BLWEpmbU1yYVNyOHRJUVY4cVZ6MDZlUTQrNWVPT1hIbFpRbkI5Qm1lWm1NUnpxaTNQRTJXN3p3aWNna1JGYmFkZGxzYkE3T1BYbGVqYjdFOXVzcWoxcURRbG9lZGlsekk4cFRJd1N2cUMxOGNLVGpCSU9xbitEZjQ5Y2kzdHlDQ21VcVZnZXM5T1hZMFVaUTBzaFp6SnFMZkUxVXJiM0M4Zit3KzJsWGFFQzJJOFdNOVg0ZFphTWRyOE8rUytncGRIcUJXeWpvT0RoS3ZUa0VIRjM5bkdsY080WGMzcnBnN0FnLzQ0MlBJR0RSVVdOM2VPK0RhdGxUcWhDUWthaWVtTjlwT05oazB4OTU3VXNUYlArMHEyaXBtMU1HbjBxMjU5dnJrUDArbnZPUEJMd0xpUXRSV1ZmV2pweDZ2MDV3T00ySGg5MmI3Z3p6OXd2VXBLaG5FUWZTazl3Mi9zd3R1N2JVa3pncWtaRzhkYzQ2RFkwYTFoM0pIVnMxVDNxbFNKZE9aUlVKQ1pVeHRucmJmZUNoMU9LQUpWakJTbmdZSFFmYlhLK09oYWIzVVBNaUJIWWZlZnJYUWZaeXpEdGlyd29DNXlDWW4wNUhwayttS2tsRTZGTm9yRTZtVG84Nkk4b0R6SXpvV2tLVDdaSHVQalZQZGRFVlpnMDgwNlcza2xLaHlJaXU1cFlVa0pBU1UrL3dDMmhaVUZWdHAwbWs2VTJzekFVNUFCN0FZenFNc0Vya1ZQUkFSV0tTNG1HNityS2tOSkpJU1BiOXRiN0N0VXdWQktlZFJkY05BcVZ3VmRxV0xyZGlzVStUK1ZRMktjMnRiTGhTQVZxVUZoU2lzSEl6amc4YTFVNmhMQjFJa2tuT1ozNURiOUt1L0RyeTNzMEZINGNFckdYQ29nRWJnYkVDRGc5NitYaGRFZXpZRkR0cW9LZmJsekI1Q3lsUFcvRWpMUDVyaXduT0hYUitXbHRPU2xLbFo1VndyS3lVNENSQ1NrR09vbmMvRWN1VlEwb040dGQwMEpUSXpIbFVzZTZuL2lrNUt2ektqWUNuT3dtc1dINGZxM2ZsU1UzTXVLREJUS2l3dzFtTzFNY1Y1VEtIQW5sWGxCZklKd0NQdHFmWnNJdTc1TGFSQ1A0My9XcUJ4TzliQkxLWktaSUpQdlJ1WW5BMUVBZHgxbWd2dWpjQzVicnE4cHlxVkIyUzg2MlFwOHFHQ2xPZlQ3RGpxVmpqc2RkYXQ3TzN0a0FOaXVmS1V0U3dWYkNjVTB1cVVFT21JdEpIQVNsSXp4ait1ZFRjVEJwUTJCa1VzTHB5NDIzRlpreUpyTWFkSmJDV0U1S25DcEhQWWZUbjVPbzVVUzhsSUdCVEtWcDhRUVBXbm5zMERWUEVsdExFanRKWjZhckhVOHR0eFNpNlE2RlpJUGI2Y0VqMjA5RUxNbWMvcFRpa1FWRlZISnZ0Vkl0a2I0Mi9jVlFxTGlhYkptQm9SSTBOYnpyanJxY05vNDRBVXBKNVBBd2M2YnVMeGx5MXV1SEpBOFlwQkVtUEx6UHd6WE1PSjhBNGk1ZkMrYVRMWlZFeU1Fam1LclIyNXA5RnFualczUXZqZVN3WmxlVFdKVXh5Qy9EcUlXaW12cElTeWx0SFVPc0ZDZWtML1NlY0VjNkt1M0tXZUVXMXBZdWdlR0VnalQ3dzV5ZlhPT1ZYZTI0Vzh6Ym8xSjViOWFjZE1rN3UzdnZuWjBuZFdIVGJuc0tpMW5xYlJWZklOU2pSeDFEeTJuV2drbFdGY2drcEpHc09EaENiUmJiR0Z1Q0RFNlNaR1NKMm8zWVhIRXVDM2FMeTFWcGNia3BKam1DREU3WWtUVWkrSVN4ZHJyYzNDMmgzQ29SYXRtb0pteldGVXRnbis5TWRIVWw0cEp5bkdRTTlqa0RRN2c3am40YTR0MlJLREU1MlVERzNmbkhyUnIybzQzZlg2V1JmdUZ4eENRVXFQK0NoS2t5TVFGQUVjNUo1VFJFYkpRWmF0bmFwVnBMemNtajFTcnJlcFNSNmdscExhVzFySHNBcHhDaUFQOEpQdnFwOFpTaHhhRWpDMHA4M3JQOFZDNFE0NDBnd2ZLb2dqOUI5TnFlM1UyMjg2MDAwbHR0VG1TbEtjWlB5Zms5dWRVQmVxU0s2RUlLUW9uTmRrVkRmU2trNVNCMnp5TllRQU42YWNLcGl0em9DbGVuOXVOYW1PVllCSTNycVI1TGJKNmlNbmpudG5XSzE4eFBhbWJhOXBzMG5lbTliemlURUdUY0FqTnV0SXB6VFMyZ3lrcEhVOG44eDN2d0ZIMEQwampVdTV1MXUyVE50RUJyVkdTWjFHZGp0SGJmZXNyUUFrazUxUmpsNVJIejN6OE9kY0U2eUt6VXR4Sk15bG9XM1BlUW56WjRIVVVJNnNCbnRrZGZLampuSVQ3YXI3TGppUnAzbWZuTldSUEViTnExQ1hUNVVuQ2VwM240Ylo1RTBGL2l2OEFFbmFreTFHOXA5dnBMazFtRldZN2xmcjFQY0g0YnFqSkpSRmpMVHdzaHhTdXRYMDVid25QSjEzdjJUOW03dG9DOHV3QVNrNlVuZUR6STVmK3ZNMXlEaWQwSG5DbVRNNTdaa2p1U0lQWWI1b1pLRnVQVTNOdUoxU210MCthSWJwVCtJbEs2WlQ2VkRrQUp3VllHUFVlMnJvOXc1b1hTVzBFZ3E1RFlWWHk2b0hUdUtka2E3SzhxMEo5V1RaazBVZUhTa1ZLVTlISTZHbUNzSTh6SkhVUmtnWjBQTm0yWFV0aDBhaWRNZDZ5MitrYml1TmpjeGlwN2MxdVMzR1RGandnRlNpc2RicXdwV0JnZkdjRFc2dUd1TnZvUVRsVmJGeno0VFUyZUNxVlc3OS90QUxLV3FDKzNScVVpVFVKSzB0RkxUZmxzcUNFa2dZeVZ1SjR6cVpjMmJWczNqSnB4VHhjV1J0UjFlT3lzN3AybHQ3WkZ4YmVGTGxLWFVsdzYyZ3RKS21GRlBYSGVTcy9SOUxpTSt4VW5WY1Z3M2hGeTc0OTVoUUVBOVpPMVlUdzdpbkVuUERzWkpBSklFREE1NUkyMnFyTFo2K0tyY201bDdVNmZIYmlvaU50dXR0b1dWS0NsS1BVU2Vja25SUGk5Z3hZV2pEeUNUcW5mb05oVnBzM1hIMXJRdkJ4anZFZnRSRjAyclRGU21nV1hIVUJRYkJUeU92SC9IT3EzSktkY1l4VGEyMnZGL0RCWThUZjRWT05VMmxzSGRFMmpYcjNFNmRVS2ZSa1JJaVdKcnpLRXRoUlZnaEhCNTk5Tlc5NjlhcGNRd2tBS0pKMm1lZFZhNXQyZzVDMTdWTU5PTnNXRnQvUjdNcEt2NFpUV0lUenNOdDV4Zm9TRmxTa3BLK1ZjcVVjWnozNE9xL2ZXdDFmT3FlU2ZNWStPSXFiWThTc3JCYUdIampPZmpUVWhiaFdKTnJGTmdMdldqUnFoUEFWQmp5NWdZY2taOWtkWUFKKzJjL2JWY2Q0SnhwSUtsTW1CdVJtS3ZxT0w4TVhoRGsvQTFKcWFlK3lNT0k1QnhnSE9OQVNsd0hOVC94REs4aXZiYkpRVDB0NEpQSko3YTJTQ2NWaGEweHZYRlBiVTZ5cERneTBvRkpTRDNIYkg5TlBoR0tUYnVnNE9hY2xuMGtUSDB4ME5oTFRLUWtKQndBa1lBQS9wclR3OVppb1BFTHN0STF6ay9XblB1WFZwTmc3QTNQY1ZFb1VpNHF4SGluOEZUb2JLbHV5SGlBaEF3bms0NzU0K251TytqTmxaTk9YQ1VMSVNra1NUc1BXcUwrSkxpNWNPQlA5QWVwcWdxdStHL3hFM0pmWDhSVHRSWFVQMVo1MldFTGJZWURwSjYxcTZRc0pRZlVUakE3bmpYbysyNDl3TzF0OUtyaEowWTVtT1c4WnFBc09PTEs0alZuZnJTcGJYaDAzeXE4MnRNdjdaVGt2SlFZYlptVkJpS2xoYWNJSUtWTDlXU1FNOXZma2FpM0hHdURvQ2REd0kzd0NUOUsxOEJ6cFJDMi80YU44SDZuZE5QdTJ5MjRGRXJkTlpwS3kzZGpPWWpDY0tLazlKSVVFbElJVGprNnF6bkcrRkFOclljbFNDVmU0Y25wSnJWTnNkWUJ3UFdsT2wrR0NCdGFibm0xdThEVjZhOHlXNllpTEhRVnE2aG5wZDdqSU9RQVBqUHZyVlhHM2VLTFFFTjZDRG1UOU9sRjNyZGh0QmhlckhTTTBkSGdvdFZNT3licHVjdzNJN0xzb1FJYmpqYVVlWWxBQ25DQVBicTZSKzRPakYwb0tVQUtydHF5VXFVczg2SnZlZmJTRnU1NFlMMDI5bVBHR0t6VFZzeDVTVkVHTStQVXk1K3lYRXBKKzJSNzZZWldscDFLeUpnMFZCVVBkTVYrZWJiUGJpOXRtUEUvTHQvZEZsRmtycVQ0aFNwODFDbm9yUytva0xLMi8wRThaOXNnblIzamR4YWNZdEVwdHZNVzV4c2VoRVZ2dy9pQXNIVkNOL3dCcU15enJIdW00dDhyaHR1TTR1WkFqdEtFZW8wK0xsbHh3RVlXQm42Q0QzVWNmdnFuUEp0MjdOS2lJOVQ5ZS9wWExMYjJnNHl2MmpLb2xzS1VDSTNFY3VkRmRJaFVyYWJhYW15TDBranJaeEhRWTRMc2lTdFI5TGJUYWZyV2ZaS2VjYy9mVUcyWlZ4QjBvdGhQUE8zeFBTckpkY1NjSy9FY0VUeUVWSGRiM0RrVjZLMUZwTzNUcnNWdktVT1hQS2FqOUtUM3cwZ0xVTS9CMVpXZUE2QnFjZEFuL0FCRS9Nd0tyRjF4ZTNWQVg1b3h0VU4zTGJraDh4RXo3WXNsTENtMWZnbVpGSWNsK1VFakpTRktLZjl0V0J1emFFd3RjOHpJRk5OY1hVNE5LUkFvdzdCcXhyK3lOQW5QdU1PVkJtT0kwN3lVRkNVdXQrbmhKSklCU0VrWlBZNjRkN1FjT1RaY1VjUUFkSnlQUS93QWJWMlhnVi84QWpiQkN3WklrRWN3UjErdE9JTkRySTl5ZWM2cTRSaXJVWERGY3N0b2ZoVmUyT1IrMnNsTUN0MHJKTTEwV3pYMmFOVlZGOGZsazR5TytmK21tQ29vVk1VcnUyVmN0UW5lcG1ucGJyOW15bTRieVYrYTJTMnNFRWRRNUdkR2JkMUtWcFh5cm5yekswUzJzUlFuWEZkRTIyYWcvSHJFS293cE1mc2hjWmdkeHdVa3JPVW41R3VpVzdURndtVzRnL2ZTcTBzT05yaFpOUVBXL0VPOVRnNEVVQVRYc2tBTExLRDFENU9UOGFNbzRhQ1BlajRHcGlFb1Z5K2RTN1orN1ZoN2tXMnFBeFVCYk5lYktHMUxLTUlMaWg5UEl3ZmNjZjFHZ3IxcmMycXlWRFVuOXFsZmgyajVrN2ltaGZkbVZPQmN0dndxdlU1VlNZcWxTYWkweGNHa0xkWVc4NGNOdHFLQ1Fra251ckF3RHpxWmFGdTRrdGlDTndTSisvU25RNDZNQVZZenQvWjBDd3RvNkphdFBDUzFCWXc2NGxQVDVycWoxT0x4L21VU2YyeHFlVEpxZUJBaW5tb1pTUmpPc1Z0UTQ3dWJMMjllZHd0WEhWVkJtQTJ6aXFNK1NsUmNDZXl3VHdqamhSK0FEN0hReDlEaUQ0clNaVjk1NytsQmVJTnI4TFdrd0J2Ry93cUE3L3dCK2RzdGpkdkhLZGFyRk9ja05vd0lzVjlKQ1RqZ3VyQlBmSGJKUDJHcE5uN1AzdkUxK1BlU2xIY0g1Q3FXTGthL0J0QUpPNU8vOTBObTF2aWwyMnVtNWF0YzEvVkNvVHJ5angxdlE1VHNSYnNDTzJWOVA0ZUVoQVBTckdPcFJIVXJQSndNYXQxM3dpNVEwTGV6U0V0OHhzVHpsUk8vWWNxeGNXcjdLdGEvTVR0SkErNDYxM3Zield1K2x5WkJwRmZxajc3aGNEYUtRcG9ISjV5cGVBTkV2dzd5VWhNWUVWV1A5T2RLdk10STM1L3hUV3VIZEVWYVZSM0k5cDFLR1dBK0ZzekpNZHRSSlRnQUhyeHozenFheGF1aEtwNXhUN2RzMnlUTG8rRS94VWo3RzdoUzI5NElORWwwc1U2blZyKzZ1ZVpVMlh1aDdwS21WQktNNVBVQ2c4OWxmYlZhOXFPR0c3NFlwNER6TitiYjhzd29mTUVkNnRIQUx4Rm54QUpEa2h6eXhrWk94K3M5ZHFNNHMvd0I1T0IvcnJ6L0FtdTNCWGxBcFBtSjZVSzQ3OEFEV2loVWhvbWFaeW9iaTVpOEpQVG5nYWpxUVpvc2wwSkVWS1ZsZmpZcElMeTBReWZXTVo2ajhENCs1OXYzMUlZWVhKVU1DcXR4VzV0eUFraVZjdTFLMjRPM0ZJM0RvRFRFcVZJcGsrTVQrRm1SVjlLazU1S1ZEOVNjKzNzZWRHcksrZHNISkFrSGNWVkhHa3VKZzFYM3VKdHRiZHIzY3FuM0tiOFZLR1NsMkxHYThpU00vV2xaY0FVRDlzYTZoWjNpcmx2VzBVUjMzRkNGSWZhd1lxSFpFZmFPTlhJRWxGUHYxY3lLLzUwZFg0NkkxZy91WHRFOU4wcEpHcE9leC9pdDByZVR6RldVK0dDMnFvN1lLTHdtVExnYm8waEtrVWFuMXg1bGFuR3lmL0ZEeTg0Q3VVb3llUmxXT1JvUXRsdERrd05YVVVXWUN6NWwwWEE3YXhVMnZ1bFNybmt4MjVNTnhoMXREclRpU2x4RGlRcEtra1lJSVBjRWUyc1ptUldDSkVHcWYvRjV0QS9zZENmM0R0YTE2cGNPM0MzVkxteDZVV2tpZ3FVZTdnS1NmSUo0RG5QU1RoWEdEcnBIRE9LRzdTR0hmZjduZis2bzcvQTFwZUsyRmFVblBjZjFWYXNMeEEwK2lVbDZGYmxtTGlzTGtPUDhBUkxyRG5TRkxPVllDTUFjLzAxWi9CSVY5L2VLMWM0T3Q4aFRybTNiK2FScGZpRXVxUy9saURSNENNOFpZVThRUDNXbzUwaWhmV2EyUndTekF5VCtzZlNrTmU5dDgrWGlQVzJvN3ZuK1lIV29iWVVqajZSNmUydGZCWHVyOXFJZjZiWng3dnpOR240YU5tL0VidS9XTGMzRnF0NlZDeWR0NFZRWnFDS3ZVQ1VycVNHWFVyVUlzY0FGYUZkSFQ1aStsdms0NisydWY4ZTQ1WVdTVjJvR3R3Z3BJR3drY3ord3oxcDlyaDFtMFFzTmlSa2V2V3JoNUtDdVV0eExZUjFMVVNNL1NDZTMvQU5hODc2ZEpnVmVVT2VYTklVMUJJK2VkYmVFVFVvUEFDdXFuMFV2QkRqd0xUQS9WK3BYN2Y4NmxJWUZDcmppSVJJUnZUM2p4ME5Ob1MyankyMERDVWoyMUx3QkFxc2xTbkZhbEhOT0NOS0xZU2g1UVArY0gvZlVCMXNISXFRbGNZTmM5d1d6UXJwb0RsT3I5TGoxU0dvRWhEN1FLa0VqNmtIdWsvY2Y5Tk5zdlBNTDF0S2c5ZnZlbnlBb1pGRHhTdkNGYks5MkkxVm0xSmNtMDQ2ZzhpbC9oR0VMZlVEbnluVkpiR1cva2pCSTQ0enJwdGh4RzV1V0pjVEhmT2U4VXltMlRxbmwwbzBZMGRxTERiWVphUXl5MmdJYmJiU0VwUWtEQUFBNEFBNEFHcGRFYTM2VktzMHFWWnBVcTVaY09QTmd2eHBURGNtTzgycHA1cDFBV2h4Q2hoU1ZKUEJCQndRZURwWkJrYjBxcHE4Vkg5bWExTWtWQytmRGhEaXhwYXlwNmJaRXA3eTJIQ2VWR0M2bzRiSjcrU3M5R2ZwVW42ZFh2aHZINGhxN1VZL3lITDE1bW82bXlmZHFtQzRLVGM5b1h2T3RxNkxaazJ4Y0VOWlJLcHRTZ0taZlpJK1VyNXg4RVpCN2drYTZHaExUNk5hRjZoNjB4cG5lamE4Qld3Tk0zMDhROVpyRjZ4RXpiRXRGaG1STXA1YkFicVV0MVN2SWp1RWNsc0J0YmkwajZnRXBQQ2pybnZ0YnhSZkNyVktMZkRqa3dmOFFOejY1Z0drcUVqTmZvRmtRMlhLSW1CSGJiaXN0b1FsbHREWVMyaEtDT2xJU01BSkdBTURBR0JyendEQzlSelRBVVFyVWFTUlRaWFN2ek9oUHdvS3lEcEVKVWFtL2lRQld0bWxSVzVBY1duOFE2UGRZOUlQeUJwd1lxTTVkT0xFVXBKU0Fja1pQeWZiOXRiMUVyWVZCQUJJNmoyU24vQUJIU2pGTGF0N0tIWFhrdHBRWEhGSEFTZ1ovMDFxbEJXclNrU2F5QXBSeFQ0cGRMZGJqSU0zQkk0U2dIc1BnbjMwYXR1RUkxK0krUGhSVnRLZ256YjA0a3BDVTRBeDl2alZxQUEycCt2V3RxVlpwVXF6U3BWbWxTck5LbFhrcEJTUjg2eEFwVkVtNm14VzAyOVZ0SnBtNTFqVXU3RzJrNGpTSlRHSk1iL3dCSjlPSEVmT0FySDJPcGJGM2RXcGxsWlRXSXBnYk4rR0d4OWg2WGRsTzI3Vy9HcFZicUxVMWNhV1F0VFJiWkRRVDVnNVdPQ2NxNTV4ejMwSTRxbTU0bVVMY1hLa2dqUFFtYVljYktqSXhVdHUwV290OEJqekI4b1VEcXBLNGZkSi9MUHBVVXRPQ2s5VUNkZ2hVTjRFSC9BQUU2Wi9EM0NUN2gvU21pbHlJSXJSK0FucUE2WWIvL0FMWjA0TGQ4N0lQNkdtOURoNVYzTlVHcFBKQ1RIOG9IdjVpZ05TRTJOMHI4c2V0UEJsd2pwU3JIdFlDV0haY2txQVRoS0drOXY1blJKdmhnL3dESXFueGJEOHhwMFJvTVdLejB4Mmt0Zzl5QnlmNTZNdE1Oc2lFQ0tscFNsRzFkbUJxVFc5ZmRLbFdhVktzMHFWZi8yUT09XCIsXG4gIFwiLzlqLzRBQVFTa1pKUmdBQkFRRUFTQUJJQUFELzJ3QkRBQU1DQWdJQ0FnTUNBZ0lEQXdNREJBWUVCQVFFQkFnR0JnVUdDUWdLQ2drSUNRa0tEQThNQ2dzT0N3a0pEUkVORGc4UUVCRVFDZ3dTRXhJUUV3OFFFQkQvMndCREFRTURBd1FEQkFnRUJBZ1FDd2tMRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCRC93QUFSQ0FDQUFJQURBU0lBQWhFQkF4RUIvOFFBSFFBQUFRUURBUUVBQUFBQUFBQUFBQUFBQ0FVR0J3a0JBZ1FEQVAvRUFEc1FBQUVEQXdJREJnTUdCQVlEQUFBQUFBRUNBd1FBQlJFR0lRY1NNUWdUSWtGUllYR0JrUWtVTWtLaHdSVWpzZEVrVW1MaDhQRVdOS0wveEFBYkFRQURBUUVCQVFFQUFBQUFBQUFBQUFBREJBWUZBZ0FCQi8vRUFDY1JBQUlDQWdJQkF3UURBUUFBQUFBQUFBRUNBQU1FRVJJaE1RVVRRU0pSWVlFVU1uSFIvOW9BREFNQkFBSVJBeEVBUHdDMGJyWDNuV0RYMlNSU3U1MU0xcXJhc2srZGNkeXVNYTJ3bjdoTmVTMHhIUXB4eGFqZ0pTQmtuTmVKbmdJMStLZkZEVEhDWFNNM1YrcXB5V0kwVkhoUU4xdXVmbFFnZWFqNlZWSHg4N1FHdnUwSGUzNWwxbU9RckN3cy9jcmNod2h0cFBrVmVTbEh6SitWZC9hMzdSRjQ0MjY5ZVlpeUZwMDNhSG5HTGJHYk9BN2c0NzFYcVRqcjVEYWgwMURxR1hGai9jMmxxQ3orVnM5UG41MXd2MW5meEhPSHNqdnlZbmFndWdndXVSMmxNN2JjeVNTU2ZqVFNKdXQxbHBZanJXODR0V0VZNjFoOURyenBXNlZMY1Vlbis5U2ZwR3dwc21rSkdyVnhncVNGY2pLSEU0VHVPbzlUOEtJNzhCdWNLbk14aU5XdThzdm1GTmxOc3VNS0k4UnlVK29GZDBGdWJhWm5mVythdDFTdHlDTVpQbml1VHVKZHltdVBqbVc0cFJVcmxQaUh3cFpqTVRHV1ZMY0ljTGU2Zkk0OWZqNml2RGM5MTRoVTltRHRyNnE0WDNPRnBuWGx3a1hQU2NncGE1blNWT3dNbnFrbmNwSG9mbFZsOXAxVkF2ZHZqWGV6elc1Y09ZMmw1aDl0WE1sYUNNZ2cxUkxLdWlYZ1dIMmtBOHVBNE5qbjNvMS9zK2UwTytpU3ZneHFtNEZiYTh1V1p4eFdlVlg1bVI3RWJnZkdnV3JvY2hPMVhjc1JUY2lIRGxRcnNZbjgzNXFhNWZKY0pGZXpNcFNEa0twY01aNG9JOEdKby9NZHE3VU9jd3lEVFhqVEE2T3VDUEtsU0hNS1R5azdVVlhnV1NPSTFyaXQrdm5XRG4xcGt3TTEzSXhRbi9hQmNYWE5FY01rNk90MDBSNW1vMUZwMVNUNDB4azdySStPdytab3NOOFZVbDlvRHhLVHJYam5Oc1VTU2x5RnAxcE1US1ZaU0ZqeEwrWUp4OHFIWjQxR2NWUVgyZmlEMDB3WnpoWEdkVzBrREpXcE93SDk2eTF3MzFGcU5TMVdDMHk1UVVmRTkzZWViNEhwaXBjN1BmQm1WeEhuL3dBVXZQTzNhb3FnT1E5WEQvbC92UnY2VzRjV2EwUWtSSUZ2WllhUUFBQWpxS3ljajFFMU53cmxWaWVqQzVQZHUrWUNmQ2ZzazZsdUZ4UmVOU1cwdFIyaHpoRDM1MWVReDUwNmVKUEEzV0xyQWpwajRpdEpJYmJRT1VKVDdZMit0SC9iZExSZzBsQVNsSStGY3VvdEp4TzY3dmxDcytvcEpzN0lZOHpIbDlNdzFIdGdkeXFHWHdxdTFwZVc1S2dQQW85QWZyLzFUWXZPWXBWeUJSMndzS0dEbi9ublZtdXB1SFZya01MN3lJM2pCNkpvTytQSERpSlpuM0owSmtKYlVTVnBBNkUwL2krcEYyNHVKbDVubzZWcnpRd1lIM0ZLVnpaSkE2NTlLV3RMWCs1YU4xQmJOVTJlU3BtUkJrdHZ0clNmd3JTY2cvcFNWY21neThlVWVITzQvd0NldGF3bGh4aGNOYWpqR3hQNlZxTTJ4dVlxVjZPcGRod3gxekU0amFFc2V0SVNoeVhTRzI4cElQNFY0d3RQeVVEVHZRckZCbjluSnhFWGVORDNiaDlQZjVwRmtrZC9IU1R2M1MrbytBVVAxb3lFS3lLVEkwZFRsaDNPNk8rVUtCQnBaanU4NENnYWJpVkVVcDI1L3dESVQ4SytpRFlTUmF4bmZwWDJSV3A2VStURW8wZUxtdVkzRGZodHFQVzhsUUF0VnZkZlFDZnhPWXdoUHpVUUtvWjE5cWU0M2k5dnlwVWhUdHd1ODM3eEpkSnlvcVd2Ty8xelZzUDJqK3JsMlhneEMwNHc4VXF2ZHhTSFVnN2xscEpXZi9ybHFuOWFYcmhmbzc2amxUOHhzRFBRZU1Zb2Y5bjE5by9TdkNybDhreTFEZ1pwZUpwM1I5cnRzVkkvbHgwS1dyelVvakpKK2RUVmJHU3RHU2NKRzFRZm9zOFRJRm5oQzMyNnh1Z01JL2xxZVdGbmI2VktlbnI5ZFg0NldieGF6QmxqOFRZV0ZKUHVEVWs2RlNYSjNQMEt1MVhBckFJajdpcFZnQWJZcm12YVhGQUpIWEZKdHl2VDBDRVhvN1hldWhQZ1FEam1QcG1tRGNMenJ1NG52N2xyYXphZmJKOERQZHBVb0QzVXNqSnJ0QUhYVzlSZXd0VS9MVzRzYWpTaE1WWUNnVmtINVVQL0FCTDBVblV0c2VqdW9ITTRraEp4NTFJOTBqYXRaeEtaMVREdXJKM1VGTXBRVmU2VkpPSzU1TEpreGtvY1FFcVR1Um1nTVRVMndZeXVybDB3bGFmRTNSbHkwYmVYVzVUQ2pHV1NrbjBwa05ML0FKdktEa2p3Z2o4dy92Umc5cHZUYk1tQW90TUF1SkpQVHJRNDZFNFA2bTFwZlc3ZmIyeU84U280d2M3RC9xcVBGeWxlam01MUpQTXduVEtOZFEyREppN0R1czE2UjQ2MnVLcDNFWFVEYTRUdnVvaktmbmtENjFhZzJSamJ6cWx6UjF4bWFBNGlRMVRrcmpYUFQ5elFwYVRzUXR0ZTRQMHE0L1RWN2g2aHNVQzlRSFF0aWJIUThnZzUyVUFhN1k3TVJ1VGozRmdFWnJvanI1RmhRTmNnUHZYb2xXQjFyNUY5U1ZTY2JWam1yUFd2Q1c4M0ZqdXlYVkJLR1VGYWlmSUFaTlB4Q1Y3L0FHaWQrR29lSWRqMHcwL2xpMHdYRk9venR6ckJXZHZnZ1ZYODNaa3B1ckNOeDNVMWdaSFVmekJtaks0OXMzSFVsMmk4VTVqS2gvNVJJdWI4WkN0d21JeUEwMnI1am1JK05DaStBemMzSHdvZUJZZHdmUEN1WWYwcFVNUVNadDExaHExSDJoTjJ6Z2x4Umw2eGkzaGk2M1hDWmkzbjVqYzFUYVZSbFlLVXBTVGdGSXlBT25TaXVzSXZEa21TMjgwditITUpDbzdqenZlT2dqcUZFQUExNjhMNWtEVStqclRkMGdjc3FLMDRGQWRjcEZPUzl2TVJZZjNWdGZpY1VFZktwNjNMYXhPRER4SytqQVdtem1oUGMwdldUQ1pEU3dGT0lKQTkvS2haMXJ3TDFkcnJWMFhVRjFmYWJkanVLRWh0Y2x3b2ZhNXNwU0VrWVNjREJJelJPNmhVeWhtTVcxRWQyQm5GZHRybTJ1NU5KNVZOS1hqQzBrYmcwR3ZJT1BadFl4azRxNU5RVi9FSFcxOEg5YnAxZzdmYmJPaVdLMHZLeTdhb1JjY1pWL3E4UndrL0FBZTFTRGNJaGhvUzNrcVVoT0NTTVpxWEpjQnR1M3E3aHRJejZWR2VvRzFOdXE1em5CcGZMdWF4dVRRMkZqMXBYeFQ0ZzljY0xJcWZiRnZnSElQMXJxNFFXeVBvZStxdXNpMmY0TVc5aExyM0wrQjVaOHZYd2daK1ZLSEdhN1FMWHBtWEttdUJEVFhqVW8rUUhXbUp4cTdTdkQ2emNKNDFoNGYzdUxlTHpjNHdhWVZGUE1HVmNnQ2x1SEd4VG5wMXpUT0t0dHlCRUh6QVpMMFl6dFpZd0hYNy9VR1BqZGNZbDY0dGFqdjl1VUNpUmMzU1NrN2MyZCtsV0JkZ3ppRE4xTHd3WHBXN1BGeVRZMUF4M0QxVkhYbkErS1ZCUXF0SXhsdFd0S2xMSzNlVXVMVWR5VjV5U2YxbzRQczZia3BWeXYwQW53cWh0dUpIbnN2eStwcWpkZmJVTDlwRjJ0Ny9BQ3MxcmZjT3dkTjYzVWVVVjVvT0RYeE9kdmV1SWxKY3BEMXN3L00waGVvc1RKZmRnU0VONDZsUmJPS1d5UGV2Snp4SktUdUQxclFQY3p4MGR3R08waHA2TU9FV2hydGJwTWR1TmE3QnlGb3BJVVM0MEFjZkFnL09xK2JoaitJeXNkQUJ0OGpSODl1UmhPa1lyZGd0TXhZaVhOYTFOdy95eHdQRXNwOUFWSzZlNW9CYmlnbVM0b2JGekErRklGdnJJbEZqSWZaVm9jWFkwNHFSYnp3M0dsNUxtSnVuMUZqbEozTFJ5VUg5dmxVNXlacG5KYWxoc0tLRjh3U1Q1Vldid0U0cnh1RjNFdGlYYzMrN3R0eElqeUZLUGhHZndrMVlGcTFNOU5qaTZyMHJkVkZsMUxib0NDRk51Tm5CK3VLd2N6SGF1LzhBQjdsZjZaa0Mrb0lEOVE2LzVIdGNybGNiby9FaXhMVzN5QTRXNDZjSlNQWGJjbXRyVnA4UkxoSW15NUE1blVoSVEzc2xPUFA0MG9hWDBkYzcxYll0enR1cDRMMGFVa2dPYjVRTWJaSGtmSWltdnFyVHhpUVhXWmVzcEVpYXNGS1dJVG5LRXJDOEVLVU00R00xeWNkdkxRNHlhbVB0MXQzOWdEdU9oNitxWWJNTnhYTmo4S2djNXBxVDQ3MXlrTFV2WkdLeG96U2FMSXdaRDBtVklVNnBTMUdRNlZrWjh0L0lWalUyb0lPbnJkSW12dUpUeUpKMzZVbGNtbjFESS9CZENDWDIwcjVHc25EMmJFUTRBOUljU3drWjNKSjMvUUdoTVlpUkU4SWRNM1ZsaENwS0x4Tmp2T2M0Q2draHRTVWxQWEhVNTk4VTdPMWJyMlpyclVrU0d5NG93Mm5scVNueVdyL05TUzdDZFk0SVdpRThWOGlMMnVRNGM3SlN0QUNVNDljcEorWXFvd0svNCtNdjNZeUU5V3Uva1p4QjhLTmZ2ekU2M3NtU2hUUnhoWE1rRDVHaWE3QnQ2L2cvRVNLeTQ2RXBuUjNZaWg2cXh6RCtob2JMQXBMZmNxNjdnL0xOVEgyWDV5clpyMXBhU2Y4QUR5Vkt3QnVNRTdmTVV4ZjRnNmwyQ1A4QVphZGtFY3dWa0d0Z1NWSk9hUzdaTkQ4WkRtZVpDMGhTVDdHbEpQNHM1NkNneEVqVWx2bTlSWGhLZVF3MHQ5MVlTaHNjeWlUMEFyMVNlcVQxQnBBdmF6Y3k1REdSRVpHWDFaL0dmSkEvZXRFblFpQ0RabGVIYlMxQTdxSFhrcDZRUWhNVnRMTVJrbmNOQUFsWjlDb3IrZ0ZDTlBJNVB2Q1VnQUtLVkEvSE9mNjBRM2FrbUNicnZVOTZDamlZNXlzRTlBMjBTM2dlbTZCUXkyWFVMVDc4aXozTkk1WDhwU1R0eXE5UWYyck5BSll0S2VvaGFsUS9NYld1WUtBMmw2TWZDb0l5UE5KQm9zZXhQeC9FKzJ1Y0U5Y1RlZHRUWk5vZmVWNkRKWnlmcVBuUW82d0VpUEdNV1NGY3phaHlySDVodmlrdlRzMlpBa3hybEFrTGp6WWJpWFduRUhDZ3BKeURScnFseUtPSi9VRlRjK0psQjEvZjVsdkZvMDVKZ29MVVowbEN0OEFxR1I3Z2JHbkxiOUxKV3RNbVFoUE1Qd3BDT1ZJUHJqMTl6VVI5blB0QVJPSVdsWTdsNlk3cTZ4VzB0eUZvVGxDeUJqbXgxR2FrblVQRmEzUUk2bzBRdVB2SzJDVzJ5Y2ZwVTBYYXNsWGx5MlUrUW8wZk1WdFJYaURZYmM1M2p5VXBRbmNrNG9VZUordTdqcnVjNVpMTnppQzJUektINThmdFQzMWVyV1d2SGVSVExzS0NUc2hXeFVQZWt3YVBoYVl0VHBDUXA1UThTajF6UzRiYmNvRmdGWFVDSGl0WVB1T3BHVXZEUGRwVVRuMU5KRGpLbHhmdTdwVXB0c2M1UVNlVUx4MXg4TVZKWEdtQWlScUZtVXJBU0NlYytnRzUvcFVmUEhOdE1qT0MrRkwrUk8zNkNxbkdibFFzajh1c0RJY3pGcUFTMXo4dU82Q0NmclV3Y0F5MUM0b1FsTDhLSnJ5VTduQUtpbkIvcFVPVzU1SVE2bnJsQ2ZybXBJNGYzTnVKcWUwVEZFaExUOGR4U3M0d09ZQTExZWVweFFzczcwUElXdXpOODV5R3Y1WUI2akcxT2lPb0VLeG5yZ1UwZEV1Qnl6TlNtem52RTh4OThrMDZZNmtwU0QvbTNJcmhmRVFzOG1TNWNuRnRzRmJROGFzSkFIdlNiS1o1SVNZclc1UDRpUFU5U2FVTGk2aGxDSEZrQktGQWtueXBsYXcxL1p0S3hISk1wMU9NaE82eG54SEhUclR6c0Y3TVFxUm4wRkc1WGIyb2JHTEhlNTFzZmJVSEk4eVFsWVdOMXNPT0YxcFkrUE9VNTlxRXU0V041aVg5NmhEbTVWOTRnZ1oyOWZpS0wvdGNhMUhFTFViTnpZaE4yOXBMWlpZVnplTjFwS3Z6ajQ3aWhjdWIzM0p4K0tWY2h4a1o4eFNGYmptU3ZpVVlyUHNxRzh4RWxKUlB0N2pVaEljSkE2akpiUDhBYW1jL0NjdHpwVzBwQ1ZBNUFCMk5PV1BOUWllVWQ1M2VUc3Z5U3IzOWpYUnFHMHR5bXc0dzJHWkEvR3lmUDNTZjJvNFBEL0lNajNSK1pOUFpaMWU3WXRReFZMWC9BSWFZUTA4bk93SjZINjBlN2RwZ3lBM0lRMGxYT2tIT0tyVjRQS1JIbVIwOTRCazduMElOV0phRXZUODdUa1J4Wnl0S0FsUjY3Z1ZPNXlqM0NaVFloSnFXTFV5MU5OTlpDUURqMHFMOWZqdW9Ub1NENTU5Nmx0OTF4Mk9TbEdTUmlvNTFaYUhKRG83MUpJNjRwTlIzMUdIT2hvd0x1TmtaMWxyY2JxU0U1QTZnOWFpNjd1b2FpdHgwY3ZnUUUvSUNpQjdSTmtNT3hwdW5MaEpmREtQVEEvM29aTDFNVXBleEo2aXFQQ2JrZ0VuYzVRcmxqTXhKWlFjWkI1azQvV25wWUxoOTJlaE9MM1N2K1djSGNiMUhNSjQ5NDNuY0hLU2FYNHN4eHBobkN6a0wyK3ROV0x2cUpVdnJ1V3djR0x3emM5RjJ4enZDY3NvVHY1NEhXcElTT1lsSU9SN2Z0UVpkbkxqUkJ0Z3Q5cXVpdVdMS3cyaFJPeUhCZ0VVWDFvdlZ1bUxVaUpLYlh5WUNrZzdwejBGQXJjZjFQbUxaRkxLeFlEcUl2RkxpbGYxeFZNSmNVRXZxN3REREcyU1R0azlhZ25WTTZWYVl5NXQ4bVBFdm9JUE12SkNUdGdaOHdjVk9GNTA2M01rc3ZQN2d1L2k5TUE0L1dvUTdTYkM0bW1Bb0VCeGtsUklIbVA4QWZlc2F2SnNhemxZZDdsWFpnMHBVRXBHaVB0Qkc0bTZ3bEx2TXlMS2Uvd0RVNVdPVlg0c2dEOXpURm5QcHVpTTg1eU4yejY3ZEJTSnJlOFNicGQ1THhjVWVad3JjV2Q4cU8zN1V1YWZobDYxTVNpdkhkTFFoSXg1azdWdUNzSWdNd1RhWHNLeHB6V1ZJVUV1Sk9IUVFTUFA0VXB3Sjc3dGpaYm1MNzBOZUZwWi9FZ1p3Qm1sRFU5cVZES1hYR2lsbGhIT3I1azRGSXRtWllkdTl0dGpqZ1MycVNoeFFKNmduZjZWMnA1SnVjRWNMTkNQblNVditIeTJpK0NGNTZZd2NrZWY2VllGd1J1ckUzU2tacDQ4cWlTcmYwb1A3N28xbTczQnQyMUFkNDlKYlNBamM1NVFUajRiVVQzQnREMFdFMWJaUURiN0JERG85RGpZajRpc0RKWU9RUkszSHIwbWpKN1lNRkxZSlVNMHpkWk9OTnNQeVk3WE9vYmdBYlV2aTJySXlIRkd1bGRsWmZqZDB0QVVBTi9qUU5Id0lZMW9QcUpnRjlwMjh6VGFMYmJYMkMyaFBNNGY5UlBVMEo5d2ZLNUttd3JBU00wWm5iYWd4WTEwaXRzbzVBeENMaHg3bkFvTEphRkNYeitTaGtlKzFibnBvK2p1VG5yUkhMNmZFekdKY1F0dEd5MG5tU0tjRnRYMzhkQ2h0aFFDa255Tk5wcDBzeUV2SkhoVjAvdFR6dGNSQ280blIwYzZUZ09vOVI2MC9aMU1panZxUG14dlB3NExxa3VMNVFBNFNnOUQ1Sy9TcHc0VThYTDIxQWJpL3hGeGNoTWdGWkozV2hJd0ZBOWZQRkRRcTl1UVgwb0NUM0pQaUFQbFMzcHZVamxpdXNLZTNJUDNWeDRrNFBRRTROWjJSV1NDUjVtbGpzdXdyK0ovLzJRPT1cIixcbiAgXCIvOWovNEFBUVNrWkpSZ0FCQVFJQUhBQWNBQUQvNGhuOFNVTkRYMUJTVDBaSlRFVUFBUUVBQUJuc1lYQndiQUlRQUFCdGJuUnlVa2RDSUZoWldpQUgyd0FEQUJ3QUNRQWtBQ0JoWTNOd1FWQlFUQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUE5dFlBQVFBQUFBRFRMV0Z3Y0d3QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCRmtaWE5qQUFBQlVBQUFBR0prYzJOdEFBQUJ0QUFBQWtKamNISjBBQUFEK0FBQUFOQjNkSEIwQUFBRXlBQUFBQlJ5V0ZsYUFBQUUzQUFBQUJSbldGbGFBQUFFOEFBQUFCUmlXRmxhQUFBRkJBQUFBQlJ5VkZKREFBQUZHQUFBQ0F4aFlYSm5BQUFOSkFBQUFDQjJZMmQwQUFBTlJBQUFCaEp1WkdsdUFBQVRXQUFBQmo1amFHRmtBQUFabUFBQUFDeHRiVzlrQUFBWnhBQUFBQ2hpVkZKREFBQUZHQUFBQ0F4blZGSkRBQUFGR0FBQUNBeGhZV0puQUFBTkpBQUFBQ0JoWVdkbkFBQU5KQUFBQUNCa1pYTmpBQUFBQUFBQUFBaEVhWE53YkdGNUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWJXeDFZd0FBQUFBQUFBQVNBQUFBREc1c1Rrd0FBQUFXQUFBQTZHUmhSRXNBQUFBY0FBQUEvbkJzVUV3QUFBQVNBQUFCR21WdVZWTUFBQUFTQUFBQkxHNWlUazhBQUFBU0FBQUJQbVp5UmxJQUFBQVdBQUFCVUhCMFFsSUFBQUFZQUFBQlpuQjBVRlFBQUFBV0FBQUJmbnBvUTA0QUFBQU1BQUFCbEdWelJWTUFBQUFTQUFBQm9HcGhTbEFBQUFBT0FBQUJzbkoxVWxVQUFBQWtBQUFCd0hOMlUwVUFBQUFRQUFBQjVIcG9WRmNBQUFBT0FBQUI5R1JsUkVVQUFBQVFBQUFDQW1acFJra0FBQUFRQUFBQ0VtbDBTVlFBQUFBVUFBQUNJbXR2UzFJQUFBQU1BQUFDTmdCTEFHd0FaUUIxQUhJQVpRQnVBQzBBVEFCREFFUUFUQUJEQUVRQUxRQm1BR0VBY2dCMkFHVUFjd0JyQU9ZQWNnQnRBRXNBYndCc0FHOEFjZ0FnQUV3QVF3QkVBRU1BYndCc0FHOEFjZ0FnQUV3QVF3QkVBRVlBWVFCeUFHY0FaUUF0QUV3QVF3QkVBRXdBUXdCRUFDQUFZd0J2QUhVQWJBQmxBSFVBY2dCTUFFTUFSQUFnQUVNQWJ3QnNBRzhBY2dCcEFHUUFid0JNQUVNQVJBQWdBR0VBSUFCREFHOEFjZ0JsQUhOZmFZSnlBQ0FBVEFCREFFUUFUQUJEQUVRQUlBQmpBRzhBYkFCdkFISXdxekRwTVB3QUlBQk1BRU1BUkFRbUJESUVOUVJDQkQwRVBnUTVBQ0FFRmdRYUFDMEVOQVE0QkVFRVB3UTdCRFVFT1FCR0FPUUFjZ0JuQUMwQVRBQkRBRVJmYVlKeWJiSm1kcGh2ZVRwV2FBQkdBR0VBY2dCaUFDMEFUQUJEQUVRQVZnRGtBSElBYVFBdEFFd0FRd0JFQUV3QVF3QkVBQ0FBWXdCdkFHd0Fid0J5QUduTzdMZnNBQ0FBVEFCREFFUUFBSFJsZUhRQUFBQUFRMjl3ZVhKcFoyaDBJRUZ3Y0d4bExDQkpibU11TENBeU1ERXhBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJZV1ZvZ0FBQUFBQUFBODFJQUFRQUFBQUVXejFoWldpQUFBQUFBQUFCdGd3QUFPWlFBQUFKYldGbGFJQUFBQUFBQUFHUGdBQUMzOFFBQUNlWllXVm9nQUFBQUFBQUFKWE1BQUE1OEFBREc2Mk4xY25ZQUFBQUFBQUFFQUFBQUFBVUFDZ0FQQUJRQUdRQWVBQ01BS0FBdEFESUFOZ0E3QUVBQVJRQktBRThBVkFCWkFGNEFZd0JvQUcwQWNnQjNBSHdBZ1FDR0FJc0FrQUNWQUpvQW53Q2pBS2dBclFDeUFMY0F2QURCQU1ZQXl3RFFBTlVBMndEZ0FPVUE2d0R3QVBZQSt3RUJBUWNCRFFFVEFSa0JId0VsQVNzQk1nRTRBVDRCUlFGTUFWSUJXUUZnQVdjQmJnRjFBWHdCZ3dHTEFaSUJtZ0doQWFrQnNRRzVBY0VCeVFIUkFka0I0UUhwQWZJQitnSURBZ3dDRkFJZEFpWUNMd0k0QWtFQ1N3SlVBbDBDWndKeEFub0NoQUtPQXBnQ29nS3NBcllDd1FMTEF0VUM0QUxyQXZVREFBTUxBeFlESVFNdEF6Z0RRd05QQTFvRFpnTnlBMzREaWdPV0E2SURyZ082QThjRDB3UGdBK3dEK1FRR0JCTUVJQVF0QkRzRVNBUlZCR01FY1FSK0JJd0VtZ1NvQkxZRXhBVFRCT0VFOEFUK0JRMEZIQVVyQlRvRlNRVllCV2NGZHdXR0JaWUZwZ1cxQmNVRjFRWGxCZllHQmdZV0JpY0dOd1pJQmxrR2FnWjdCb3dHblFhdkJzQUcwUWJqQnZVSEJ3Y1pCeXNIUFFkUEIyRUhkQWVHQjVrSHJBZS9COUlINVFmNENBc0lId2d5Q0VZSVdnaHVDSUlJbGdpcUNMNEkwZ2puQ1BzSkVBa2xDVG9KVHdsa0NYa0pqd21rQ2JvSnp3bmxDZnNLRVFvbkNqMEtWQXBxQ29FS21BcXVDc1VLM0FyekN3c0xJZ3M1QzFFTGFRdUFDNWdMc0F2SUMrRUwrUXdTRENvTVF3eGNESFVNamd5bkRNQU0yUXp6RFEwTkpnMUFEVm9OZEEyT0Rha053dzNlRGZnT0V3NHVEa2tPWkE1L0Rwc090ZzdTRHU0UENROGxEMEVQWGc5NkQ1WVBzdy9QRCt3UUNSQW1FRU1RWVJCK0VKc1F1UkRYRVBVUkV4RXhFVThSYlJHTUVhb1J5UkhvRWdjU0poSkZFbVFTaEJLakVzTVM0eE1ERXlNVFF4TmpFNE1UcEJQRkUrVVVCaFFuRkVrVWFoU0xGSzBVemhUd0ZSSVZOQlZXRlhnVm14VzlGZUFXQXhZbUZra1diQmFQRnJJVzFoYjZGeDBYUVJkbEY0a1hyaGZTRi9jWUd4aEFHR1VZaWhpdkdOVVkraGtnR1VVWmF4bVJHYmNaM1JvRUdpb2FVUnAzR3A0YXhScnNHeFFiT3h0akc0b2JzaHZhSEFJY0toeFNISHNjb3h6TUhQVWRIaDFISFhBZG1SM0RIZXdlRmg1QUhtb2VsQjYrSHVrZkV4OCtIMmtmbEIrL0grb2dGU0JCSUd3Z21DREVJUEFoSENGSUlYVWhvU0hPSWZzaUp5SlZJb0lpcnlMZEl3b2pPQ05tSTVRandpUHdKQjhrVFNSOEpLc2syaVVKSlRnbGFDV1hKY2NsOXlZbkpsY21oeWEzSnVnbkdDZEpKM29ucXlmY0tBMG9QeWh4S0tJbzFDa0dLVGdwYXltZEtkQXFBaW8xS21ncW15clBLd0lyTml0cEs1MHIwU3dGTERrc2JpeWlMTmN0REMxQkxYWXRxeTNoTGhZdVRDNkNMcmN1N2k4a0wxb3ZrUy9ITC80d05UQnNNS1F3MnpFU01Vb3hnakc2TWZJeUtqSmpNcHN5MURNTk0wWXpmek80TS9FMEt6UmxOSjQwMkRVVE5VMDFoelhDTmYwMk56WnlOcTQyNlRja04yQTNuRGZYT0JRNFVEaU1PTWc1QlRsQ09YODV2RG41T2pZNmREcXlPdTg3TFR0ck82bzc2RHduUEdVOHBEempQU0k5WVQyaFBlQStJRDVnUHFBKzREOGhQMkUvb2ovaVFDTkFaRUNtUU9kQktVRnFRYXhCN2tJd1FuSkN0VUwzUXpwRGZVUEFSQU5FUjBTS1JNNUZFa1ZWUlpwRjNrWWlSbWRHcTBid1J6VkhlMGZBU0FWSVMwaVJTTmRKSFVsalNhbEo4RW8zU24xS3hFc01TMU5MbWt2aVRDcE1ja3k2VFFKTlNrMlRUZHhPSlU1dVRyZFBBRTlKVDVOUDNWQW5VSEZRdTFFR1VWQlJtMUhtVWpGU2ZGTEhVeE5UWDFPcVUvWlVRbFNQVk50VktGVjFWY0pXRDFaY1ZxbFc5MWRFVjVKWDRGZ3ZXSDFZeTFrYVdXbFp1Rm9IV2xaYXBscjFXMFZibFZ2bFhEVmNobHpXWFNkZGVGM0pYaHBlYkY2OVh3OWZZVit6WUFWZ1YyQ3FZUHhoVDJHaVlmVmlTV0tjWXZCalEyT1hZK3RrUUdTVVpPbGxQV1dTWmVkbVBXYVNadWhuUFdlVForbG9QMmlXYU94cFEybWFhZkZxU0dxZmF2ZHJUMnVuYS85c1YyeXZiUWh0WUcyNWJoSnVhMjdFYng1dmVHL1JjQ3R3aG5EZ2NUcHhsWEh3Y2t0eXBuTUJjMTF6dUhRVWRIQjB6SFVvZFlWMTRYWStkcHQyK0hkV2Q3TjRFWGh1ZU14NUtubUplZWQ2Um5xbGV3UjdZM3ZDZkNGOGdYemhmVUY5b1g0QmZtSit3bjhqZjRSLzVZQkhnS2lCQ29GcmdjMkNNSUtTZ3ZTRFY0TzZoQjJFZ0lUamhVZUZxNFlPaG5LRzE0YzdoNStJQklocGlNNkpNNG1aaWY2S1pJcktpekNMbG92OGpHT015bzB4alppTi80NW1qczZQTm8rZWtBYVFicERXa1QrUnFKSVJrbnFTNDVOTms3YVVJSlNLbFBTVlg1WEpsalNXbjVjS2wzV1g0SmhNbUxpWkpKbVFtZnlhYUpyVm0wS2JyNXdjbkltYzk1MWtuZEtlUUo2dW54MmZpNS82b0dtZzJLRkhvYmFpSnFLV293YWpkcVBtcEZha3g2VTRwYW1tR3FhTHB2Mm5icWZncUZLb3hLazNxYW1xSEtxUHF3S3JkYXZwckZ5czBLMUVyYml1TGE2aHJ4YXZpN0FBc0hXdzZyRmdzZGF5UzdMQ3N6aXpyclFsdEp5MUU3V0t0Z0cyZWJid3QyaTM0TGhadU5HNVNybkN1anU2dGJzdXU2ZThJYnlidlJXOWo3NEt2b1MrLzc5NnYvWEFjTURzd1dmQjQ4SmZ3dHZEV01QVXhGSEV6c1ZMeGNqR1JzYkR4MEhIdjhnOXlMekpPc201eWpqS3Q4czJ5N2JNTmN5MXpUWE50YzQyenJiUE44KzQwRG5RdXRFODBiN1NQOUxCMDBUVHh0UkoxTXZWVHRYUjFsWFcyTmRjMStEWVpOam8yV3paOGRwMjJ2dmJnTndGM0lyZEVOMlczaHplb3Q4cDM2L2dOdUM5NFVUaHpPSlQ0dHZqWStQcjVIUGsvT1dFNWczbWx1Y2Y1Nm5vTXVpODZVYnAwT3BiNnVYcmNPdjc3SWJ0RWUyYzdpanV0TzlBNzh6d1dQRGw4WEx4Ly9LTTh4bnpwL1EwOU1MMVVQWGU5bTMyKy9lSytCbjRxUGs0K2NmNlYvcm4rM2Y4Qi95WS9Tbjl1djVML3R6L2JmLy9jR0Z5WVFBQUFBQUFBd0FBQUFKbVpnQUE4cWNBQUExWkFBQVQwQUFBQ2c1MlkyZDBBQUFBQUFBQUFBQUFBd0VBQUFJQUFBQUdBQndBUkFDQkFOTUJIZ0ZkQWFrQ0FBSllBcnNESndPYUJCY0VuQVVzQmNjR2JnY2ZCOU1JbFFsZ0NpNExCQXZlRFBFT0RROHpFRnNSZ2hLeEUrY1ZIQlpaRjVjWTNCb2xHM0Fjdmg0UEgyY2d2aUlaSTNJa3ZDWDZKellvY0Ntbkt0b3NCeTB0TGs0dlpqQjRNWUV5aFRPQ05IMDFkRFpuTjFFNEtqa0VPZDQ2dVR1V1BIVTlWVDQzUHh0QUFrRHNRZGRDeFVPMVJLZEZuRWFTUjRwSWdrbDdTblJMYmt4cFRXVk9aRTlrVUdSUmFGSnVVM1JVZlZXR1ZvNVhsMWlmV2FkYXIxdTJYTHhkd2w3R1g4dGd6MkhUWXRkajIyVGlaZTVtL21nVGFTeHFTR3RtYklodHJHN1FiL1J4RjNJNGMxbDBlSFdNZHB0M3JIaStlZEo2Nlh3Q2ZSNStQWDlmZ0lPQnFvTFRnLzZGSG9ZeGgwT0lWNGx0aW9lTHBJekhqZStQSFpCU2tZeVN5NVFQbFZXV21aZmNtUnlhV3B1WG5OQ2VDSjlBb0hpaHI2TG9wQ0tsWEtaeXA0Q29rS21pcXJpcjBxendyaE92TzdCcHNadXl6N1FJdFRlMlZyZDB1SkM1cTdyQ3U5Vzg1YjN4dnZxLy84RUR3Z1REQnNRSnhRckdCOGI5eCt6STBNbW55bkxMTWN2bnpKSE5OODNnenF2UGRkQS8wUWpSMHRLYjAyVFVMdFQ1MWNYV2t0ZGgyRGpaR3RuOTJ1SGJ4TnlsM1liZVpkOUI0QnpnOU9ISzRwL2pkdVJRNVMzbURlYng1OXJveWVtODZyVHJzZXl3N2JQdXJ1K284SzN4dy9MdzlEajFuUGNlK0wzNmMvdysvaG4vL3dBQUFBVUFHUUE4QUhFQXVBRUtBVVFCaUFIWEFpc0Nnd0xsQTA4RHdnUTlCTDhGVEFYbEJva0hOZ2ZtQ0owSlhBb2hDdXdMNnd6eERnQVBEUkFrRVRnU1VoTjBGSlVWdWhibEdCSVpRUnAzRzYwYzZCNGxIMk1nb1NIUUl2WWtHaVU3SmxzbmN5aUpLWmtxb2l1akxKNHRreTZDTDJ3d1VqRTBNaE15NXpPek5IMDFSellRTnRrM29qaHNPVFk2QURySk81SThYRDBtUGU4K3VqK0lRRjFCT0VJVVF1OUR5MFNuUllSR1lrZEFTQjFJL0VuYlNycExtVXg0VFZwT1AwOG1VQTFROVZIZlVzcFR0MVNqVlpGV2dWZHlXR0ZaVTFwRVd6VmNKVjBXWGdsZS9WL3pZT3RoNUdMZ1k5MWsyMlhiWnR4bjNXamZhZDlxM1d2YmJOcHQybTdiYjkxdzRISGxjdXR6ODNUOGRnWjNFbmdiZVNGNkozc3VmRFo5UDM1SmYxV0FZNEYwZ29hRG00U3loY3VHNllnT2lUT0tXWXQ5aktLTnhvN3FrQkNSTnBKZGs0YVVyNVhYbHUrWUFKa1NtaWFiUFp4WG5YU2VscCs5b09laUZhTkhwSHlscWFiSXArZXBCcW9tcTBXc1pLMkRycVN2eHJEcHNnMnpNclJTdFdtMmZiZVJ1S1M1dHJySHU5aTg2TDM1dndyQUhNRXV3alBESmNRVHhRREY3TWJYeDhISXE4bVV5bnpMWmN4T3pUak9LTThoMEJ6UkdkSVoweHJVSHRVajFpalhMOWcxMlRyYVFOdEczRTdkV3Q1cjM0UGdvdUhLNHYza09lVjk1c2ZvR09scjZzSHNKKzJoN3pIdzR2S3o5S2YydlBqdSt6ZjlsUC8vQUFBQUJBQVVBREFBV2dDVEFOd0JIUUZXQVprQjVBSTBBb29DNlFOT0E3b0VNQVN1QlRVRndnWllCdlFIbEFnN0NPZ0pwUXA0QzJBTVRBMDREaVVQRnhBTkVRY1NBUk1ERkFVVkJoWVBGeHNZSmhrMUdrVWJWaHhwSFd3ZVloOVlJRXNoUENJb0l3OGo4Q1RMSmFBbWJpYzRKL2tvdFNsdUtpVXExeXQvTENBc3dDMWhMZ0V1cEM5SUwrd3drakU1TWVFeWl6TTNNK0kwanpVK05lczJsemRDTiswNG1UbEZPZkE2bXp0SE8vTThuejFNUGZnK3BEOVNQLzlBdGtGeVFqSkM4ME8wUkhWRk5rWDNScmRIZVVnN1NQdEp2VXArUzBCTUFFekNUWVJPU0U4TlQ5UlFuRkZuVWpOVEFsUFJWS05WZFZaSlZ4MVg3bGkvV1pCYVkxczFYQWhjM0YyeFhvaGZYMkE0WVJOaDcyTE1ZNnhra0dWMVpsbG5QV2doYVFWcDZXck5hN0ZzbFcxNWJsMXZRbkFyY1JseUIzTDFjK0owejNXNmRxTjNpM2h4ZVZWNk9Ic1pmQUY4K240QmZ3bUFFb0VhZ2lPREs0UXpoVHFHUUlkR2lFdUpVSXBkaTNLTWlJMmZqck9QeHBEWGtlV1M3NVAzbFB5Vi9wYittQXFaTUpwWm00U2NycDNYbndDZ0o2Rk5vbktqbHFTNHBkbW0vNmd4cVdTcWw2dk1yUUN1Tks5cHNKNngwN01IdER5MWNiYWx0OWU1Q2JvNnUydThtcjNJdnZUQUg4Rkl3bkhEbU1TL3hlTEhCY2dweVUvS2VjdW96TjNPR3M5ZTBLblIrOU5TMU1QV1g5Z1kyZnJjS3Q2LzRkSGxkT20zN3BQejlQbkkvLzhBQUc1a2FXNEFBQUFBQUFBR05nQUFvNklBQUZja0FBQlNUUUFBcEN3QUFDVXlBQUFOdndBQVVBMEFBRlE1QUFJWm1RQUJ3bzhBQVVldUFBTUJBQUFDQUFBQURnQXFBRW9BYkFDUEFMSUExUUQ2QVI0QlJBRnJBWk1Cc3dIVkFmY0NHZ0kvQW1RQ2lnS3dBdGdEQUFNcEExTURmUU9vQTlRRUFBUXVCRndFaWdTNkJPb0ZHd1ZOQllFRnVnWDBCakFHYlFhc0J1MEhNQWQyQjc4SUNnaFpDS3NKQWdsY0Nic0tIUXFEQ3V3TFd3dlhERlVNMWcxWURkd09ZZzdwRDNFUCtoQ0VFUThSbXhJb0VyWVRSUlBWRkdnVS9CV1NGaW9XeEJkZkYvc1ltQmszR2RZYWRoc1lHN29jWGgwRkhhMGVXQjhGSDdRZ1ppRWFJZEVpaXlOSEpBVWt4aVdKSms4bkZpZmJLSjhwWWlva0t1WXJxQ3hxTFN3dDdpNnlMM2N3UHpFSk1kWXlwVE4zTkZNMU5qWVpOdjQzNHpqSU9hMDZranQzUEZ3OVFENGxQd2svNzBEVVFicEN0RU8wUkxWRnQwYTVSN2xJdVVtMlNyRkxxa3lmVFpOT2hFOTBVR05SVUZKQVV6SlVKbFVlVmhoWEZsZ1dXUnBhSUZzb1hETmRQMTVOWDF0Z2FtRjZZbzFqMEdVVFpsWm5tR2paYWhkclUyeU1iY051OW5BbmNWWnloWE95ZE41MktIZDFlTVo2RzN0MGZOTitPSCtrZ1JlQ2tZUVNoWm1ISllpMmlrU0wySTEwangyUTE1S3FsSitXdTVrT201V2VPYUJpb3BHa3hxYi9xVDZyZjYzQnNBU3lSN1NKdHArNHRick52T3EvRGNFM3cydkZxY2Z5eWtYTW9NN3owVVBUaTlYTDJBTGFMdHhSM216Z2dlS1M1S0RteHVqdDZ2YnM0ZTZ0OEYzeDlQTjA5Ti8yTy9lTStOVDZFZnRKL0gzOXF2N1cvLzhBQUFBUUFDOEFVd0I0QUo4QXhRRHJBUk1CUEFGbUFaRUJ0QUhaQWY0Q0pRSk1BblVDbndMSkF2UURJUU5PQTN3RHF3UGJCQXNFUFFSdkJLSUUxZ1VMQlVFRmVRVzJCZlVHTmdaNUJyMEhCUWRQQjV3SDdBaEJDSm9JOXdsWkNjQUtLd3FiQ3c4TGpRd1VESjROS3cyOERsQU81dytCRUI4UXdSRmxFZzBTdHhOZEZBRVVweFZRRmZ3V3FoZGFHQTBZd3hsN0dqVWE4eHV6SEhRZE5SMzNIcnNmZ1NCSUlSQWgyeUtuSTNRa1F5VVZKZWdtdmllV0tITXBVQ291S3cwcjdTek9MYTh1a1M5ME1Ga3hQaklsTXc0eitUVHFOZDQyMHpmSk9NRTV1anExTzdBOHJEMnBQcWMvcGtDbVFhZENyME83Uk1oRjEwYm5SL2hKQ2tvY1N5OU1RVTFUVG1aUGVGQ0xVWjFTcUZPMFZNTlYwMWJtVi9wWkVWb3BXME5jWFYxNVhwWmZzMkRTWWZGaklHUmdaYUJtNEdnZ2FWOXFuR3ZZYlJGdVNHOStjTEZ4NDNNVmRFVjFnWGJOZUJwNWFucThmQkI5Wm42K2dCZUJjWUxNaENlRmc0YmdpRDJKcW9zaWpKeU9Hbytia1IrU3BwUXdsYjJYVEpqZG1tK2NBNTJZbjJDaE9hTVdwUG1tNEtqTnFyK3N0SzZ1c0txeXFMU210b3k0Y0xwU3ZETytFci93d2M3RHJjV054Mi9KVmNzK3pTblBGTkQ4MHQvVXV0YU0yRlRhRXR2RjNYRGZFK0N3NGtuajNPVnQ1d1hvaytvVzY0enM5ZTVTNzUzdzIvSVA4emYwVXZWcDluUDNldmg2K1hYNmJmdGcvRkw5UC80cy94WC8vd0FBQUJRQU9RQmlBSTBBdUFEa0FSRUJRQUZ3QVo0Qnh3SHhBaDBDU3dKNkFxb0Myd01PQTBFRGRnT3RBK1FFSEFSV0JKRUV6UVVMQlVrRmpBWFdCaUlHY1FiREJ4a0hjd2ZTQ0RjSW93a1dDWkVLRlFxZkN6RUwyQXlFRFRVTjZBNmZEMWdRRkJEU0VaUVNXQk1oRS9JVXh4V2hGbjhYWXhoS0dUWWFKaHNiSEJNYy9SM21IdEVmd1NDMElhc2lwaU9rSktjbHJTYTNKOFlvMkNuckt2OHNGQzBwTGo4dlZUQnNNWVV5bnpPN05PQTJDRGN5T0Y4NWpqcStPL0E5SXo1WFA0eEF3a0g0UXlwRVhrV1dSdEJJRFVsT1NwSkwyVTBqVG05UHYxRVJVbDFUcGxUelZrUlhtRmp4V2xCYnRGMGZYbzlnQldHQll1NWtPR1dEWnRCb0gybHhhc1ZzRzIxMWJ0SndNbkdWY3Z4MFpYWERkeHA0YzNuT2V5MThrSDM0ZjJhQTJvSlVnOWFGWG9icmlIK0o1WXRDaktHT0FZOWtrTW1TTUpPYmxRbVdlcGZ2bVdlYTQ1eGluZU9mVXFEQW9qQ2pvYVVUcG9lbi9hbDBxdTJzWjYzanIyR3c0YkppcytXMWJMYjN1SU82RWJ1anZUZSt6c0Jwd2dqRHE4VlJ4dnZJcU1wWXpBck54YytCMFQvUy9OUzMxbTdZSXRuUDIzYmRGdDZ4NEViaDErTms1TzdtVmVlazZPdnFJdXRNN0dudGF1NWs3MFR3SC9EaThhWHlVUEw1ODUzME1QVEU5VlgxMlBaYTl0MzNWdmZNK0VMNHQva2wrWkg1L2Zwbyt0RDdOZnVaKy8zOFl2ekIvUi85ZnYzZC9qditsZjd3LzByL3BQLy9BQUJ6WmpNeUFBQUFBQUFCREVJQUFBWGUvLy96SmdBQUI1SUFBUDJSLy8vN292Ly8vYU1BQUFQY0FBREFiRzF0YjJRQUFBQUFBQUFHRUFBQW5MSUFBQUFBeGtOODlRQUFBQUFBQUFBQUFBQUFBQUFBQUFELzJ3QkRBQU1DQWdJQ0FnTUNBZ0lEQXdNREJBWUVCQVFFQkFnR0JnVUdDUWdLQ2drSUNRa0tEQThNQ2dzT0N3a0pEUkVORGc4UUVCRVFDZ3dTRXhJUUV3OFFFQkQvMndCREFRTURBd1FEQkFnRUJBZ1FDd2tMRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCRC93QUFSQ0FDQUFJQURBU0lBQWhFQkF4RUIvOFFBSFFBQUFRUURBUUVBQUFBQUFBQUFBQUFBQkFNRkJnY0JBZ2dKQVAvRUFEd1FBQUlCQWdVQkJnUUZBd01DQndBQUFBRUNBd1FSQUFVR0VpRXhCeE1pUVZGaENCUnhnU015UXBHaEZTUlNNN0hCWW5JV05HT2l3dEhoLzhRQUhBRUFBUVVCQVFFQUFBQUFBQUFBQUFBQUF3QUNCQVVHQVFjSS84UUFNQkVBQVFRQ0FRSURCZ1lEQVFBQUFBQUFBUUFDQXhFRUlURVNRUVZ4b1JNaVVXR1JzU016UW9IUjhBWUhZc0gvMmdBTUF3RUFBaEVERVFBL0FMOGptVWNOeGd0S2lJRGhsL2ZEZlRJOGs0TGhTdkFBT0RXV0srMUlRVGZHVEJzV3R3NXU2Uy96VVVjWmJlcGJvQU1ZU2VEYjRwbE4vTEdWbzZiZ3RFTCtlRmxwcWNDd2hVQURIQ3VVdEVrcHkzRWlqNm5HMDBrQmpmOEFFQjQ5Y1orV295RCtDdjdZUm5ocFVnS3dvbzRON1laYWZXa05uKzBVbEQ0d0IzZlg3NEVwTmpBZUwrY0U1OUdrbERRcXdCSGRlZUI4dkt4UkJWUlQ2WDhzUTV2em5LUkFQd1FqMGlJNUgrK0ZlN2EzQnhySEtMZU5WSHVEYkRVdXZkRHEwcVNhbW9JL2w1UkRMZVM1RG5vb0huOXNQWXh6OU5DNDV3WnNwNFdOd1J5U1BROU1FQ3BrUVdCVmJkQUJpQlZmYnQyWlVPWVNaZFY1MjBObVpZcERIZFo5dHR4VUE3ckQ2WWsyVjZ0MGpuclAvUmRSNWZXaU5RemQzT3R3Q092SjZZTkppeXhONm5OMGhzbmprTkFwMVdWbUFMWEo5eGpMRy9CSDhZK1dTRmh1amRXSHFHdU1iQzdHd09JM0NLUmErREZWQUE1UG1jYlhZaS8vQURqSVhieXh2akJGL3dBd3NQSzJDTlFIQk5WT1lZeUxMejY0VmpYZEpaRHg1azRDV1NObTVSeDZDMkNJSHNmREd3QjQ1eEtCWFMxRjJJdWJtMk5pN0xFWlN3VmJlZm5oTWQ0NmtJaEpQQXd2TEEzZ2hLazhDOXVtRVRZVEFON1E4YnRMR0pWQkN0MHY1NFNyWW5pbzJkSDVYbmI2NE1xWkJIdDhGd09MS09nd2pWbEphUmdPZHc4dlBBWElyZUVGbThkVE5sOUIzZXd0M1Z6YzRIcTZDdXl6S3BheWVlQ0VMVHMrOHRiWklmeUtiZ2dFbjJQWHp3NDFLTWxIUXFWSklpNmZmQit1b2FEUmVnSk0vd0JRS0hreXhSV0NObkNpU1lqd3grOWx2eC9rYmpwaVZoWXd5Y2wzVU5BWDhsRXlzazQ4RFEwN0pYTTJxZTFIVnVTeDFGQWRMdk5XMTBZcDFMMVpxSkl5L2twQVZWYTN0Zm55eEZvOUwwMmxjaXBNL3dDME9qL3FlZjFsUXNueWNVaEtVY1pYd293Nk14M2NucjB0Y1h3WmwrYWFuN1N0UzEyb2Nzb1ZqcEhFRTlDN0tDS2NKd1JjOEhhVDZlWnY1WWpYYVhyUFdHbjB6S2tTU0dUNWtsSExGVWpsRzJ4SjJqdkdKQkl0Y2RTT21MdUtPSEg5N3VPTENyM3ZsbUh5NzdVVzE3bW1RNW5XVVdhWmxrWHl3a2xkSTZHS2NSMlZRUHhlbmg0QUFONzNEY0hESEZtVU5IS3JaRExWUXBLYktzOHdkU1BTNmdBZzM1dml2S2ZOVFVUUnBPc1VDQXNRRlZ0cDJtMWplNUI5TU9zbW8zcEhqK1VaZGw3WEQ5ZjhoYkZkbVRQbGQwdENsNHpHeGpxSlY4ZGxIYXJuV21NMmtrcTVaNmVPR3dtcFpxdGxwU3UzdzdicVJ0UGxZQzNyanJUUldzTXUxbmxDNXBsenJHeW5aTkF6Z3RHM3BjY0VFY2dqcU1lY21VNmtybmxqcFNBNDhTY25sbE56dDlDT3ZIdU1kQWZEanFTcm90VnkwQXFlNFFRL2kwWjRFcVhCM0w5RkpiajBPS3FRTy9WMlZneHpUVmQxMTVaaUxoa0pIbGZDa2NjNVVNOFFBUFR4WWJWbEQyc2QzMDg4Rk5WaTZveWJSYmdYd0pxNjhKbGFlUnFnamR3ZzVQdmdoSkhJNWMyd0xIREI0bWFhUm1iazRNV0duc1B4Mkh0aVRhY1FFdkRVSGNMTVFRTUttcFBtNXdtc0NLQVZtNm0zT0ZtaW9rZTBrc2prRHk2WTdhRlcwaTFRQ3BzMXpicGhUdkN0UHhhNFhHVlRMUndkNEo4emo2ZGN2a2lZSkl3WWpyZ1JPN1JRQlZKV0dINXpNY2twWGF5VE9vYy85TzY1L2dZcXI0d3MvT2M1dnA3SXhXU1JVTmJMSkZWUUsxck5zV1NKK1BRQWo2WXMxcW1LZ2x5MmVWN2QzRklVTnYxYlR0L20yS003Y3NteXZWR1V5VkV1bzB5ck9hS2hhdWQ1b21sVW1ucEpaM2dYYmV3ZEN5RitRQ2hIT0xqdzdmdEd0NUpIMkZLbnpoNzBaUEFCKzVTV21Na3FNcTBOdjAvVExBTXpoanFWbEpLbGdRUVVIa1IxNDhzVkRyblI5ZktrVlRYeDJxRklZazhqenhZdWY5dmVZdzlqV2txUFIrbmMxeURMeGxjTXZ6T2JaUS85d3JKY1BHd3VRbHVRMXVRY1Z4a3ZhNy80dnJJc3MxRDh2STVjS3RSU3RkU09BQ1VJRER6OHJZalpiSmk3cjVwV2VJNkVNOW1SVjhkN1ZXUG9sWGxrSGROR0M1WmJMMDhWeWZmRDlOMk55eHA4M1VVVFAzZ3NKRkIyazI0SjlENjR1N09xSFJlUTAxUG1PWVZ4U0lrc0ZpUU94dDFIUThEQldWZHRYWmpBRkhkWmcxTHdKWlBrMjJXOVNUeWNRSHlUT0ZpMGYyRUxEMG1yK2E1VzFOcE92MHZQUzFKbFlxVDRTQllXdnlMNHNyc1J6K3BYVyttSzFyU3pMbVNVNUREODBNamJXQjlyTzF2ZkZqZkVaazJncS9zK2gxaHBhbW8zZXRualNPcGlKSklQTFc4cjJHS3I3SXN2ZXIxTnB1aXk2TnBhcHEybGpZQzkxL0czay9aQXgrZ3hMWTcya2R1Q3JIZ3h5VTFlZzF4RWRrRUtxcThBL1RHeGJjQVhqako2WDg4Zk1aR1ptQ3J0SlBJT05lOFltMWhZWXJRVlpPRnFPUXlsaUxCcmY5dUNVcWdTRDNaSUJzT01JcFVGWTFBYXhZK1dGRW1QSFBHSkZvaENJU3ZReXFwUTNCdnl2R0NmbUxucUxzYjRGaGt1MXpoWnlqRGxmTEM2a3d0MmxPOEpQQlVlV05pWEtFOTJMZVJ3Sjh2QW9Nb1JySit3d2hYYXQwN2xlVjFHYTEyYzBFRkRTSVROTzFRdXhiRGtYdnlmWVlMRGpUNUg1VENmSUVvVTJUQmpqOFY0SG1hUzJvWkN0TFF0NTdmVDN3LzZPMGxrR1pkcFdsZFFSTEhOQlV3VGlla01GbHBmN2N4ZDJySHFENHp6L243NDRyN1hmajR5V25ncDh0N0xNaC9xRmJDU2tsVm1Ta1JLTC9valEzWW4xSkF4WlB3Yi9FN3EzV3VzOGh5dlgyUzA5TlhacFhWaVVzMFJDRXhSVS9lYmU2L1J5VkhXNTROdUw0dHNQdzNKaGxmSStxMVl1enJ2clhxcWZLOFR4cFlteHN2cTNScXVlMjkraWxYYlBXSFNPV1M5bTJiYWVXc2hvYVdITDZiTWN2VUJ6VHhKM2FYamF6Umt4MlZsQlpUemJnMkZGNVIyTVM2MXlQTllja3lpb1NCS1Uwd3FwcWJZdVhxZkVad3hJTzlRQ1ZDOGxpb0pBdWNkVS9GRGxNS1ZmOVZXbnVzc1FZdjVCajYvemlJOW1XYjB1VDlsV1o1VENYcU02emV1czFPdzJwRlNpd3ZmOVJKTi90aUpMbFNNbmUwOXJQOEFDdThiRmlteG8zanZRUG9EdjRLaU10N0txalJQOVF5SE1zOXpyTlpLMmtwNXNucTY3TVpZaFk3aE11MUdWV2RTQWJkU0NEYnJpeU95cnNTMWZsL2UxbEpxYk5JMXI1VldPR0dvV3BBaDIrSmU2bVI5N0UrbzRBOThXVG0yVzBjdVZmSTFvcGExV1RZRWJiSUE5NzJzZUxBWVgwcDJYNmZvSWhWbWptZ0RjOTNUMWM4Szg5UnRSd01DaHkza0JzZzNXOUQraFI4dkVqRG5HTjJyMXl1ZSswL0pzeHB0SDZvaDE1bGRLMlM1WHFTbnB0S1ZPVkt0Rjg1VUdUYlVUVHdnc0NxQU11MWRvZGdUMEZzU2I0VnRCNVZsTk5tV29LeUNCNnFPc0MwMHJjeVJYak84QSs0Y1g5eGh6N1pkU2RrNjZzeXJST3JjNm9jbHlMVDBBbldtQVA0bFF4Q3BFa2E4dHRVa2srVjdrNHNIUldmZGx3eXFQSzlKNXZseGlTNTI5NXRabVBWanU1SndTVms4c1A0VVpyNUQrRkVoZkN5VzVIaSt3SkNta2s2dHRqUjAyRGtrSGs0VE1pcWZDd3dMQ2FPYm1ua3A1N2MvaFNCdjlqamNsb3hmdUZ4VU9hV0duQ2lyWUZyaGJUYVpHcUE1QVJOZ0h0MXdyQWp5WEt1MXZTMkVvNmxRUzIwU0lPQUxXeGxzNVlnbVBMMjVOZ1dhM0dDMkZJbzhBSXBuV2xVU1RTTUVKNVl0d0FPU1Rpa2UwVDRzdEo2VE05SGxrS1MxTVRsVmFlWUhjb3VBd1JibTNuNS9URmthdjFKRmtta3M3ei9ONHY3V2xvWlN5QTJzQ3BYL0FPV1BNYk5taU5ObW0weU00bGpqbGxiOHprRWk1SjVJUFgrYlkwWGdtUEdZblpFc1lkdWhmR2haMTM1SEt6UGptVEt5VnVQRS9wMVpyblpvYjdjSGhXM3F6NHM5WjZpcjVxdXR6V3FhaUkyeFVWTWhTSUQxWXNSdVAxRmg2SEZiYTM3ZU5ZYTVwa3lpcjdpQ2doQldPQmJXK3BzdHIrK0s4YW9aTHhQYnB4Z0V5V0pOK2NYN2NxWnpTeTZIeVdjZEJFMXdmVm4xUk1HYXRTMVpxVVJlOFVIYXhIUWpvZnRpME95WHREemJRbmFuMlpaNmFpUi82Wm1NZGJVTHZ0dUZXLzRseWY4QTBpZysyS2FxR1l5bHllV0hPSkhsK3pVR1FQVE16UjVoazhXK0NSZXNrSVlXQjkwSjYrbHZUSEdEM1MwZDBuTzk0TytDOVFQaWUxWm5tcDZmSmNvMDluVUR4MWRRSTJXUnp0azIrUkE2aTM4RStlS3AxUkZtdW02cUxKYTVxN0o2cFloM2RUUkI2dW5abTQzcVI0eHgwVWpqMXhXL1lkMm8wMnBOSHdhVzFQVW9tWTBCdlJ6ek9kempxM0ovVmUzMXZmaXh4Y0dXYSt6bW9wYU9HV3QzdWlDWjVUWmlFdWVDZmZqR0x5bXVqbVBXTFc3d3BvUFlBVmY3MG5qTHBOVTBlU1ZPYlpUbmxmbkNwQjNzcjFlV3lSRk5pK1RQYS9wWVhPSjlrZmJWVExvS0ROODI3cWtraGdkcWxtYmFxN2IrTG5wY0RGWmF4N1hkVTZqcDAwdGtpVE5OVXNZQlQwa1plU1ZTTFdBNjN0ZjJHT09PM250RjFEQksvWnREWEdLbmcvOEFQb2ozTE5maU1rY0d4SE52UEN4Y2M1VXRSNkI1VUhNeVJFMGtqanQvYVVhN1krMUN1MS9yNnYxVEJWUDh0TFZPa0pOL3lYNGF4OWVmdGdXaDFGbmxHa1pwTThyRTQ0S3lXeEU2VExhcW95NmFaNFNzREtTc2g0RzVTT25yMXNiZXVIQ2hkdTk3cHVrYTQxWFFJMkJyT3l6UWVYdUxuOTFQOG83ViswREw2eU9lbDFUV0Y0ajRITG5jQ1BjRUhIVm53M2ZFNXJQVkdyTXYwVHJXc3A2K0xNUVk0S21VYlpvNVFwSytMbzZuYmF4OFFKRmljY1JVemdJMWdMazljV3IyU1ozRHByVU9UWjlKQ3N3b3F1Q3FNZjZtRWJYYTN2WWtZaDVVWnltRnI5L0JTOGVVWXJ3NW12aXZSbHBRWkRGc3NGeHVwVWtFQVdIQUJPR3VuajdsVDMwcnlNeHY0amhjTkNPdkgzeGtTVnU2Vk1mRTMycTVka3VRWm5vcUVvOGowYXZYQUc3S0pBVEdMZWgyM3ZqZ3VYVUVkZFJQVEd5eXFyRTNQK29vWUVINmdYQitnT0w2K01TT3Z5THRYcXMxS2swR2RaWlRSR3h1RktweGYzdUwyOURmSExVOC9jVml6SUxxSERGVDVqei9BSXh2c2VtWXNVVFJRNlI2N3Y4QWUxNTFsa3Z5NVpDYlBVZm9OVisxSXVySVdYZGZnODRCTW5VNElxVzNjZjRtMkJHdnlNSm1rSis5cldYa0J2VEJHV1ZyNWRVeHp4bm9iRWVUS1JZZyt4R0IyRjF4OFA4QVRGeDB3Kys2YlhaWE5vaXNvczlyNUpvbzQ0NWc0bmVLTUJmRi9tb0hRSHpBNkcva1JqclRzZzB6cHJVUVdiTTRaKzZWQ2trY1ZRMGU2L21RUE1mOG5IQldrODBxOG1ua3pPa2tLeVFCTmpmVjF1RDdjWXY3SXZpWXk3VDJYcTBHUVZFdGFWc1VTUVJ4N3ZkdXR2dGlyeThkejNXMFdyTEZuYTFuUzlkRzl0V3QremY0Zk5GVithYVd5NkNtMUZuRVRVbE5Mdkx6QzRzemdzU1JZRzNIbmIweDUxektjMHE1dFQ1NkhNZFN4a2ppMzJrbjU0c2YwcDZ0OWhjOUpKcjdYT29PMVBWYTV4cW1wRHhCaUk0STdpT0tGUVdLS1BvT1QxTjhSS3VxWnF5cWQ1V3VGMnJZY0FjY0FldzZBWVBqWS9zUlo1VWFlYnJQU09FUlBYMWViTEhIT3dTS0loSWFlTWJZb1Y2MlZmTG5rbnFUeWJuR3RJZjdtWnYrbkMrVDBabVlvRGEvSk5yMnduVHIzY2tvSnZ4YStEMXFrSzZLSWpZaW52NnZiRWt5bk5acWFlS1dGckdrVll4NzhlTC9BSHRpUDBjWGVReEErVWx6Z21tY3hxa1Y3c1NaSkQ2c2ViZmJIUXpTUmZ1bDZQWnQyNDFNR3RjNnBLT2FPU25wNjJhbWpnTVFJVlZOZ1NmWHJoNW8rMTVab3QxVmw5TkpKc1loZTdBM0VBa0MvbGUxc1ViazA5S29yYW1UYVpaNjJvZHphNUo3dzRjYVBNMVNxRTZRR1ZhZEhuTVlOdHdqVXVSLzdjWWlDYVdYSWF6bnFjQlhtVjlWWnVMaVFlSFNUUGFCME1Kc0FXS2FUZnpQbnl1Y1BpSDdScW5YR3JhK29xNnVRZDVMdkVBVUJJd0JaRlhnR3dIQXhSdGJCZFNVOHViWW4vYUxtTFpubTFSUEpGQUpaSkhsQ0JRTnFFazJYMEF2YTJJSzdzeHNXSDBJc1IveGowRElkMVNHdUY4blIyR2I1UDNXSXlaSVVrdUR1VVgrbzY0UmRiRzF2ZkdhY0ZTOFpQSWJpeDljYlNLZDNKd0trOGxKcVBLMlBnbkJIcmpaUTNtTWIyVSsyRWtqc29rQmpuanQrWkVQMUlZZi9lQzV1QWJpM3BnQ2pacWRKNWVMWFJiL0FGYi9BUE1POFJWMEJJQnZoaUlOaEFBdWl6Vmw5b1dObzR4LzNXQi9qQWNXNlRjU1B6SGNUaDFyb2wrVktBV0JWeVBxTEhEYkJKYU1Jb0hHRWtRbkdrcWZsNVF3ZmI0YmRPRDdZSFJ5U1NlcE55Y0lPek41bjdjWVRWaUwyNjQ2TnBoMG4yanFvNlNubHFBQXhqakpBNjNQUWY3NEZwWGFVL2lrN1R5VjgyK3A4aGdXYXJDMGhpM0h4QUxZZlhHYVR2ckFnaU5UMHZiRGlhWEdpemE3Q3kzTkF1VmxveUFaSlpuUHJ5N0hBMHVwSnFDa3pSSUNnbmZMSnBTWE5nc2JTTEVQM1ptK3lZWmNsVFVNMlR3dFNVRVVrUUxLV1Z1YmhqY0VlUnd6OW8xU3VUMFVGVVlhaU9vekRMMHBKa1ZkNEtSeUVzM0hQNXZRSEdaL3hxS04yY1paUDBOSkhub0Q2V3ZkUDlrZUlaRVhnSWhoQkFsYzFyai9BTTBYSDY5TmVSSVZIYXNLVFprMngyY3ArdTF1ZmJERVk5NjJkZVI1Mnc3Wm94YVo1NUhqTzlpUUZCNEg3WUNCVWpkZStOS2I2bDRZVHBOUGR0VDFaVTJzNHVMSENzblVrazRKcWFhbmtTV291ZStnRVpOaHdWWmlPVCszNzRRYU5uSVZGTEUrUUZ6aDRJMkUxelhOQUo3NzlTUC9BQlppcEttU2xrclZpdkRFVlYydU9DM1FXOC90alVxQ0wyNHdjOGsxSmxrVkt2ZUxIVnQzekN4Q3VGTmw5alk4L1hBZGh4MHcwYlNPa3FpRVVFbDEvTk1vL1pTY09HWE9Xajd0cjhjWVFaQXVYMC9QTWtram42Q3lqL25HS1p6SEx4ME9Hb2pkSndybEFhR3g4TzZ4Ky9HR1FJWXBHaVlXS2txZllqakQ5VXhHb3BHMkw0bEc3ajF3MDVpd2xxUG1RTENvVVNuajlYUmgrNE9HTVBaUGVPNjNvSHAxcklSVnhtU0VTRHZGQnNXVy9UQ0ZiR3NOWExFblJIWlI5TDhmeGhLNUZpQ0xqRHRVNUxuVmJUZjFvMGRxZDRqTVpOd0FJWHI5L2JEdE5kWlRTQzV0Qk0waE5oWUUzSTZEQlVNRWpXWndiK3JHd0ErK0hmUjJVeFo5TG1HV08yeVI2VHZJWC94a1Z3UjlqMCsrR1ZTVWtQZVh1cHNSNlk0Skd1ZTZNY2l2VkZmalNSUXN5SEQzWDJCNWpuN2o2ci8vMlE9PVwiLFxuICBcIi85ai80QUFRU2taSlJnQUJBUUVBU0FCSUFBRC8yd0JEQUFJQ0FnSUNBUUlDQWdJREFnSURBd1lFQXdNREF3Y0ZCUVFHQ0FjSkNBZ0hDQWdKQ2cwTENRb01DZ2dJQ3c4TERBME9EZzhPQ1FzUUVSQU9FUTBPRGc3LzJ3QkRBUUlEQXdNREF3Y0VCQWNPQ1FnSkRnNE9EZzRPRGc0T0RnNE9EZzRPRGc0T0RnNE9EZzRPRGc0T0RnNE9EZzRPRGc0T0RnNE9EZzRPRGc0T0RnNE9EZzcvd0FBUkNBQ0FBSUFEQVNJQUFoRUJBeEVCLzhRQUhRQUFBZ01CQVFFQkFRQUFBQUFBQUFBQUJRWUVCd2dEQWdrQUFmL0VBRGdRQUFFREF3TUNCZ0FGQWdVRUF3QUFBQUVDQXdRQUJSRUdFaUV4UVFjVElsRmhjUlFqTW9HUm9kRVZKRUt4d1ROU2NvTGg4UEgveEFBYkFRQUJCUUVCQUFBQUFBQUFBQUFBQUFBRkF3UUdCd2dDQWYvRUFETVJBQUVEQXdJRkFRWUdBZ01BQUFBQUFBRUFBZ01FQlJFaE1RWVNRVkZ4WVJNaVFvR2gwUlFqTXBIQjRRZXhGWEx4LzlvQURBTUJBQUlSQXhFQVB3RDVHTk5FL1dhSXRNblBBTzJ2VERXVDhmRkZtV1IxeHpWVVNTWVc3YWVueXVDSTV3ZjcxTVRIVVQwL2FpRE1ia1pGVFVNQUpIR2VlS0dPbVJ4bE9NSVVtTmxJNHdlNHFTbU5oSjYwV1RHR1FSWGI4T0FqSjR3T3ROSFRKd0tjQkJ4SDlQUTUrNjlDUGs5Um43b0JxclZjWFQxc1VVb0xqNU9FWk9CbXFPbCtJZW9WdUxNV2F0a0s2bkE0K3ZhamxKYkt1c1p6dDBIcXErdlhGbG5za3ZzWlNYUDZnZEZvN3lVaGUzT0Q3WnI4WTQyZjJyTWRuMUN0T28vOFJ1czZRNHB2MUpTZytweFhzVFQ0UEZLZXVVclpDWWJaSEpIS2ppbmsxbHE0M0FNUE4zNklMUThkV2FwaTU1d1k4bkFHNXgzT05sYmlveHh4ejhacU91TGtZd1FjYzgwdjJ2Vnk3cGFseTJJekxpbXhsMUJkd2NlNHBwdDF6dDkzZ3BkaXVwVm45U004cFBzYUNTUlZFR2VjYmJxZlV0YmI2ME45aThIbUdSNmowUXB5TXJQWGo3cUU1SEpQZithYTNJL29KQkJxQzlHR09CMXJ4a3lkeVU0UFJLcmpCMm5najVCb2ZJWVBsTHh5TUhHYWFIV09TQ0tnUHh6NVN4OEg1b2pITHFFSW1wUVdsVFk3UjJwOTZPTU1la0VjNHFQRVpISHQyeFIxaHJIYitsQ0pwRks2ZUhSZnh0aktSeFU1TEdFNU9NVkpiWkdRVDBvWHFTZC9odW5IRmdFdUxTVXB4OWRhSE5McFpBeHU1UkdZc3BvSFN2MmFNcXZyL3JKY0hWRWkyTVMySTNsSkJCS1FyY2ZZbi9pcTF1SGlGZkYrbHlkNWJaVWNCa2JjZ1VpWEF0TDFSTFVrK1lra2tFNTVOQTFLVVh0eXdDYzFiZEphYVZqQmxvSndOd3NiM2pqTzZ6elBESGxvNWpqQk9NWlI2NVhseTYzQXZUVnVTRUFZYlNUK241b1VsVFFiV3BMWlU1bjlKSHB4VWhFS1pjSDFLaVJGT0lHQVBMUmdVMFFQRHpVczFDVmlHdHBLdW1SelJaMHRMVE13NXdhTzJWQ1dVdDJ1a3hmSEc2UW5yZ242cFdkL0NiVzNHbWlnbkhwei9OZTBSSG5BNHRvTEk3NVRUcko4UHRUTVIzQzVDMmVVTWhPekpwWGRnWHVFNmxjaU82Rkk2WkhBcE9PcGdsR0kzZy9OT3FpMTExSzdOVEE1by82NDhybkZrekxZNHBMVGhDY2VvWndLTVdtNno3ZGUyM1k2OW5tSGxJNUhOS1pVOUxuQU9MeTRzOVZHakRRWEF1YmNlUUVxSUl6dFZsUHh6WGNzVFhOSWNBU2QwblExazBVclhNYzVyV25RNTIvOVdnN1hxd3lYRVJwQzJrdUJPU1ZuRzcvYW5aTzJSRVE4aElLVkRqQnlLei9wcVN5L3FkdUpQQ0pFUmFzQlJHQ241RmFWWmlOdDI1bERTVWhwS1FFYmZhcXZ1a01kTElBMFl6K3kxbnd0WHozU21jK1IyUU5QVkw3MGNrSGpCK0JRdVN6K1dzK3dwdGVaNHlPYUZ5bzQ4bGVCMm9aRkxxRk5Kb1BkSy9SV2tnanNjMHd4MjhqcGlvRVp2Y1FlK2VLT3NOa0VEb0tZelBScW5qd0YzYWE3REFGSXZpRGJIN2hvaDFFRlFUSlFDc0ZTc2NEclZrSmJBWnlUOC9kVVZyeTdKbjZvRWVKUGNhYVpSdFVncjJwVXZQWWY2cVV0YkpKYXdGdnc2b0h4Tk5CQmFYc2sxNTlNQTRPdmJ3cU9pb1ZicGluWG8wZTQ3eG55bitjRDN4a0hQNzBScytsSEx4ZTB2ZVdscU81a2hBNlVHZGpiTlFMVGplRkUvcTY5YTBwNGEyWmwySzB2eXlsS1VlZ2R6ODFaOXlyVFJVeGxhZFNzdDhPV1NPODNBVTBqZmRZYzQvdkNQYU0wSkdoc3B5eDVoem5sUGVyb2g2YlEyd0ZvWVNrZ2RRS0xXRzNOTnRwUVVwSXh4dVBOUGpNUnRLRWhLVWtEcjZ1dFo2dVYybWxtSkpXM2JSWXFTanBtc2phQUFxdmYwK0hBU2xJQ2o4VWg2aTBtdy9CV2x4aE9jWTNKVFdpbm9LQXRKNUh2elNuZW9hRk1MVHR4anZpbTFIYzVXeURCVGl2dE5QTEM1cjI1WHpnMWpvcVhwNjlLa3g4dXdWTHlsU1I2a0gycGJFaUc5QVVIVzFmaVFmOEFyT09rbFo3REhRVnRYVmxvYk52S1Z0cGNTdjhBVUZKNHJHdXFJQ0lsNmRhYXdVcmRLZ1VuSVQ4WTdWb2F6WE0zR0lOay9VT3F4SnhmdzB5d1R1bnB2MFArRTlENktUYVk3a2U0eEgxdU5MUW81R3h3SDlqN0g3clh0a0lmMHBFWGtaQ0FEeldSclRIYURjWlNYa3JlU01rTE9FcEhzUGZOYW4wTkxRL28yTzB0dllTVHNQYjZvTHhHM21ZMXc2RlR2L0hUaEc5OFIwNWhudjJSdDFvRlBRQ2hraGtlVW9EbmltZHhuS1RtaHI3SjhsUUlHTWRqVURpbDFDMEJKRmxwUStDbkp4Mys2WVdVWlhrWnlLQXd4aGZBUFgzcG1qaktSeHo3VnpPZFU3cDJndEFVeExSTEtrbnFSd1RXV3RXNlhWYXRSdnZ6SENxTSs0U3c4VHhrbm9mYXRZdHA0VG5wVlQrTVVjbzBURWx0b1dmTGU5UlNuSUFJL3BUeXlWYjRhMFJqWitpaW5HTnVocXJRNmQ0eVl0Ui9Lb1ptTzAyeTlLZGRhY2xKVmdJUVBTZ1k2ay9WYUI4T0pjT1BibUZTSkNHbWlnRUZaeHV6MEgzV1lIN2t3bEQvQUpVdGNoUkc3WW9IcWVPdmVyeTB2YTRxN1M3T3VLM1l6VVZMYUc5bktsSGFPQVBmUEZUZTh3QjlMaVFrWi9mOWxUbkNOWTBYRDhob0phTmRmWGNuNUxabHFhaE94a0tibVJ3RHp0TGllS1pFd1hVdGJtMUpjQjdJUEZaWGoySk1yVURObGRqM09KZGpzMjdTbFNVbGFTdEtWNFBDaWxKT090WHBvWjZiYWJVNWFwenB5UjVzVlNnY0ZJT0ZESDNWRFhLMy9oMmM3SDVPK0NPbmNGYXJ0MXlOUzdrZEhnYlpCNjlqMlR5dUE0V2d0d3BTY0RJS2dPUHVseTVSbzNsdWY1bHBSVDFBZEhGRE5ZekpkMGFWQXRnY2RTM3krcENzYlNyZ1lIYy9GVTRxeHJnYWhjdEJWY3BOeUNpVnBTamQ2Z2p6Q25QUXJDZWR2WEhha3JmYjNUTTUzdndkOFk2ZDkxMVgzRDJEK1JyTWpiT2V2WWQwUTFhV25yWXRMVGlYT0NRcEJ5T1Btc2R6cmF4S25PU2x1RU1rckN2VGtnaFhPSzAxT2d2UTJvNzhhZXE0VzZVU1FTamFXMUVkQ08xWmluTUZFK1cyeTZ0aVJHbExJVWx6OU9maXJvNGRZSW11YTEzWlp3NDNmN1l4dWtqNzZaOGJmSlRMWEhmdUZ3U2hUQlZEQXcyZHVOb0hWV1IvelYrYUhndnFqdHZyd2lFaklqb0hKVjhtcU9nM2U2WFV4b2JhM0ZsUjhzazRRSFAvQUZISDcxcDdTMXRYYmRNTXgzQUZPSkhxSU9SejJyMit5dWppNVhhRTlQNVNuQmRQRk5QenN5UU56dHIyOER5aXJyZU1kS0dQdDRhVjJvODRrYlBidmloajZCNUt1bFFDSjJvVjdQWjdwU3pGR0ZkZXRNc1k1YkdPdExNTlc1UFBUTk1EQklISEZQNXdkazJwaU1hSmlaUEF5QU05TVZFdmxvWnZPbFpFRjhLVTJ0UElUMXJxd3ZwazBTYk9Fam9QbWduTTZLUVBidUVYZkhIUENZNUJrRVlLK2ZkMnNndC9pZjhBZ3d0MU1mOEFFNEJXa3BVQm5vUld3ZEhXaU5jdE9CcHhyY0NNWkg4WnFzL0Y2MHVSZFJSWnpRWURiNE9TZUZnNTUvOEEyck04Sjd3MDVwZGh0UkJYak5XSmVhdVdzdE1kUXpjS2d1RmJWVDJmaVdwb25iT09SNDdmVlczWTlPcGo2Z2F1cjBscFU1aVA1TGN0eEg1b1JqR00vWGVoNjdpWkhpSVc0RGVHNDdLZ3BZSnl0UlBLamswenJmSmhLVVNDamJrZnhTaG8yQk11VjVueUdtd1NuSk9UamdtcXBZOXoyeVRTbllZV2daR05qY3lHSVl5Y292cDI1Tm03M0NQTWJ5WGwrbHdLd3BsWTZFR3A5MXNpaHFWVjVaZlFtNktZOHBVc0QxbE9OdWZ2SEc3clNqRUxqT3QzQVVsVEtuRkFudDhpckJVKzJtS0FrallleHBLZm5obURvOU9ZTG1BTm1pTFpCK2txc3J0YTJiZFpGTTRLbGZxeVRuOS91c1g2dGJYQjhUTGdXY2JIM01ySDJPVFcyTmEzQ08xcDU4cGNIb1Rra1ZrbExrZTdhZ2ZVVkpWSmRlL0xUdHozd0Fmbkhlck80WWtrYXg4cjlSMVZIOGQwOFZRWXFlTTRkbkkvMHVlZ3RQeXJ0cTZLWXlGckNWYm5IVUFnSUgzMHJZS1dFc3htMng2c0pBSko2MUIwdFkyYkRvNk5FUWhzTDJBclVoR0NUUmg3NEZBTHZjemNLckxSaHJkQjZxZGNNMkZsbG9PVW5MM1lKK3lHT0RKVmpvYUhQZ2VXbzQ0L3BSRjNIT1B2Qk5EWGlQS1VTQVBhaHNlNFV2Y01BcEdoT0VFQlhGTWtkWktCam1sQ0t2QkhJUE9SVEZIZXlSZy9zS1AxRGNvRFRQd0FFeXN1ZWtFRS9WRldsNUh5S1htbDVVT1RSTnAwZGpudFFHVm1TcEJHOEtvdkdsVWNhU2llWU1PQnc3VHRPY1k1R1JWZWVIbDlWSHVTWXU0dEpjVWxMVGFTZlNjOG4rS3Qvd0FVWTVrK0dNbHhLZDYydWNZejE0ck10blpmYkRVanpRMHRKUGxuT01INTcxWlZvampxYk1ZbmR6OTFuVGlhZW90L0ZyYWlNWnkwSFR0NVc3SDlRMjZCWTBwZm5NaHpaNmdYUmtERkpWcThRTFVtNHZpSFBYQ0JSaGJ1M0tWNDR4alBCK2F6bEN0R3A3OWFYcEVKSWNhYmUydktXcmhSK004bXJLMGxvU1krKzFKdWx3dHNhTzJSdWpyZE81ZU94VU9sUitTejIramlmN1dYSjdmMHB0VDhTWGU1MUVZcDZjdGIwSjJQejBWaFdYVnRtVGRIWTR1RGkxbHp6VXJmSTJxSjZrZTMxVmh1WHFFN2FYSEdYMm5Cc0lQckJ4eFdaYjVvbThRcmhMWENsUVpMQldvc0lZZjU1NkE1OXFXWTgyKzIyNnRRcmd0VUh5MEtjWGs1M0p4M05jdnN0TFdZa2hrK1M5SEUxZGIzR0dxZ0kxeGtiZlpNZXVkV0xjOCsydEZYSy9VcEo5S3ZpaGZockNFelhyVHdVMmx3SEo4OFpJeDdZcEd2U3pzWmtKSzFiOHFXVUE0NTc1OXg3VmRmZ3hFWlgrUG5yWlNweE9FdHVLVHpVbnFvMlVGb2R5ZHNmTlYvYjVwcnp4UXdTSFk1SGdhclFxbGdOcFQ3RCthZ3ZPQUE1cjJ0MzA1Qkl6UTk5empHZW52VlFzYVNWcGx6Z0F1RGl2U2U5RFgxZmtLemtjVjNXdkt1S2hQckhsRUVrVVVqYmdoTlhITFNxNmlQWmFUNzBjWWV3ZmYycEJidVVlR2dsOTVMWTZqSjVOZEVheXRLQ1BXOGZwci9BT2FtTDZTV1Q5TGNxdlk3cFN3QUNXUUErVmFqRWdaeDArNjdUTHBIdDFyZmxTWEFocHRKUEp4dU9PQVBtcTVaMXRhU2o5VDJSMjh2bi9lbERVbCtWZXJnQTBwUWdOSi9LU2U1N2svTk5ZclpKSkxpUVlDVnJPSWFXbnBTNkZ3Yy9vQWZyOGtTMUhmYnRxYXd5b3cveThaU0NmS2JYaE9Qay82alZJRzVCcDV1S2hoZTVsWHEzTC9VZmI0KzZ1YTJ1SWMwK2hDU0FwUTVIZWtIVXVuWEZYTkYwaUQ4c0svTWFJMjU5eUttMXVmREM0d0VZSFR5cU80a2hycXVKbGJHNHVmOFhqZlR3cmswTHFDQ05MUllycmFXM000VUcwZFNlZWYycnJjNFNZOXpRMjBwYUl6NnlWdUhzU2M4ZTJLUnRBRnQ5TFlRbFNVTnFWdlhuQlBHVG4rS09hNHZTMDNPUEJaV2xRSkhwU2YwOStmMm9CTFRFWEVzajY2bFQybHJ3NndNbW0rSEFHT3V5ZDlMMjlLL3hNNlNrdnBjSkVmMVpLc2ZIN1ZYSGlCTFU3SGtKanBEY2xJVWhZSGNBNS8rNHA0MFJKa1NZRWgxYWlXR1d6c0xwNFhuaElIelZjZUpqN1J1TDNrZ3BrS2FUalllTjRPTURINzBuUXh1L3dDVkxYYTQvWUx1OVRNSERYdEdhWkI4bngvQ3J1SFBjbDJOdU9SaHd1L3BWMVB6Vi9hS3ZUV21yWitDZmorWTBzN2xyYjRXRDc0NzFRMWh0S2tYQnVUS0ttM1FkNkVFK25uM3EwZzRaVnFTK25PNUJ3ckhYaWoxMVpGS1BaZkNmOXFEY0t5MWRNUHhMOUpBTURQYnF0QnhidkR1RVB6b2I2WDIvWWRVL1k3VjRkZXlPT2ZtcURpVDVFYVlpUkZmL0RQamplT2kvZ2ltNGEwVXcyMStQWUcwbkNubXY3VkFwYlU1ai95OVI5VmV0THhCQkxIK2Y3cEhYcC9TZjF1NEJQOEFGUW5YZnkxWk9EanJtbHlGcW0yM0p3dHgzVkpXRDBjVGpORUhYdnlGSDQ1cEQ4UEpHL0R4Z283SFZ3enhsOFRnNGVpenk2enlweFo1eGhPVDFvZXBYSVBYQm9zNEZPS0lISTk4VjViZ3BVcmM2cjZBcXptdkRkMW5HYW5kSTczQXVFV1A1encza3R0KzlXNUE4UElyUGhKUDFQZFo3a05Qazc0VEpBOWVUZ0ZYL2wySDcwcjZUc3d2ZXZJRnZLY3h5dmUrUjJiVHlmN2Z2VmwrS2w4UzlKaDZkaXBDWXNWSWRlU09tNGpDRTQrQi92VWZyYW1aMVZIVFFuR2RYZWdIMzJVK3MxcG80N1RQY2F0dk1HKzZ3SE9yei9BM1ZVd0VPeGJqdFV2TFJ3RUhzUHVqazFoTDBFc3I2azVCTkFvcmhIcFVrT0l6MHpnL3NhUHpYYmN0MW93V1g3Y0MzaDRQdSthRkhQVUhBd0tVazVqSUNoMU0xbjRaemM2ZGo2L1Q2b1JiWURCbnRManIvd0FQa0RJeW5oS2owd1I4ME0xbGFiNDVMWmVhak95SklRRzFlU25lbFk3RUVkUGJCb3BLM3g1YUZGdllsMGZyQnlsZnlEUldEZkxoRVk4dHA3S0IwU3NicVZFczBjZ2xiZytmdW1iNldrbnAzVWtoTE05Vy9ZcVZwU05kMk5Jb1puUi93S0c4RnR0MDhrKzVGRHBWbWpHNXV5MXJYTGQzYnQ3aHlFbnJ3T2dxZTllcDB0c29kY1NrSC9zVGloRHkzZ3pzL0ZPblBVREZNMkdVeXVlY0F1N0lySzJrYlRNaEFMd3dhRS9iWkMyVzBwdUNzdDdnVDI3Q3AwWmUyNE9OZFVPcC9yWGxDbTIybGtEQUE1SjZtdWtaSVVsaDVRd2ZNM0s5L2luYmprSEtFeFI4cmdHK1ZCZFdXWlN3UitXcitocnNncWR0NjB1RHpXVHhqdUtsWE5EZXdySkFWM3dPbEEyM0ZvUWxwU3RpRnJDUVR4eVRnVW96MzJaQzhrQmhsTERzVi9JMlk3eTFvVXJaMlVlRFZoMm01T1RiT1V2TDNQSTc1NjFYOTJoWE8xM2grM3pJMzRlUTJSeUZia3FHT0NDT3RMM21PdEtVVXlGbFo1SlNTS1ZmVE5xbWc1SHAxWHRQY3BMVEtXbGh3TWdnNmEvTmYvL1pcIixcbiAgXCIvOWovNEFBUVNrWkpSZ0FCQVFFQVNBQklBQUQvMndCREFBTUNBZ0lDQWdNQ0FnSURBd01EQkFZRUJBUUVCQWdHQmdVR0NRZ0tDZ2tJQ1FrS0RBOE1DZ3NPQ3drSkRSRU5EZzhRRUJFUUNnd1NFeElRRXc4UUVCRC8yd0JEQVFNREF3UURCQWdFQkFnUUN3a0xFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJEL3dBQVJDQUNBQUlBREFTSUFBaEVCQXhFQi84UUFIUUFBQWdFRkFRRUFBQUFBQUFBQUFBQUFBQVFJQVFNRkJ3a0dBdi9FQURrUUFBRURBZ01JQUFJSkF3UURBQUFBQUFFQ0F3UUFCUVlSRXdjSUVpRXhRVkZoa2JFVUlpTXlRbEpUWW9FVmNxRVdNM0hCRjRMdy84UUFIQUVBQWdJREFRRUFBQUFBQUFBQUFBQUFBQWNGQmdFQ0NBTUUvOFFBTlJFQUFRRUdCQU1HQkFjQkFRQUFBQUFBQVFJQUF3UUZCaEVoTVVGUkltSFJFaE15VW5HUkkwS2hzUlFWWW5LQjRmREIwdi9hQUF3REFRQUNFUU1SQUQ4QTZwMFVVVU1NVVVVVU1NVVVVVU1NVlltem9kdGl1VHJoS2FqUjJVbFRqcnF3bEtSNUpOZWQyajdTY0s3TE1NeWNVNHN1Q0k4WmhKNEVaL1hlWDJRZ2R5YTVuN2Z0NmZITzJpNE93bVpMdHF3NmhaREVCbFpIR25zWENQdkgxMHF6MDdTMFhVQzdvNFhZelVmc055MWRudFNRc2pSWmZFOE9TUjl6c0dsbnRlMzl0bjJDblhyUmdlS3JFbHhielNYVXE0SXlGZjNkVmZ4VVVNYzc2TzNYR2pqaUdzUml5eFZrOExGdlFFRlAvdjhBZS96V2krRFB6UncrcWMwcm82VXl0STdMc0xWdXJFKzJRL2dNcUpqVmN6bUtqZDUyVTdKdy9zKzdaVzhZeHhaaUJhbkw1aUdmT1VzNXFMN3hXVDhhdzJSSnE1d1ZYZ3F6SWRvZGpzb0ZoeWF2TGVLV2JyTnkxcklnMTZQRFcwVEhXRG4wU01NNG91RnVXZzVqUWVLUWYrUjNyQWNGSEQ2ckR4MGg4bnN2RWdqWTR0bDI5VzZWMmtFZzhtbUxzUTMvQUxFbHFtUjdIdGJZVGNiZXRRYi9BS2l5Z0plYUhUTlFISlEvelU4N0JmN1BpaTBScjdZWjdVeURNYkRqTHpTczBxQnJpUHcrcW1MdUJiYTV0cHhLNXNtdmN4UzdmY2txZHQrb3JrMDhCbVVqUG9DTzNtbGZXVkd3d2hsVENYcDdLazRxU01pTlNCb1I3TXhLVXF4K1g2WUdPVjJnckFLT1lPZ0oxQmJvSlJSUlNkWnFzVVVWUlNrcEhFcFFBSGNtaGhxMWlzVTRtdEdEc1B6c1MzNlVtUEJnTXFlZFdvNWNnT2c5bW5GWEszSU9TcDhZSHdYVWovdW9NYit1MnRkenVVZlpSaCthREVpZ1NMa3RwZVljY1AzV3psMkhYNFZPU0NTdkozSEloUmduTlIyQXo2RG0wUFBKdTdrOEVxSk9KeUEzSnk2bHRCN3dtM1cvN2I4WVBYR1U4dG16eFZxUmI0WVAxVUl6KzhSM1VlNXJWT242cG5UcW1uWFNNSkNPWUZ3bUhoMDJTa1dBWkFSVVU5akh5bjc5VjFLeEpaZlRvMDZZMDZOT3ZvYnd1eStuNm80UFZNNmRHblF4ZGx0T2pUcmQrd1BkZ3hqdHF1Q0ptazViY1B0TEd2UGNTUnhqdWxzZmlOYjUyOGJpOWdzK0NmNjdzc0VwZHd0YlJYS2p2T2Naa29BNXFUNFY2cXZSbFV5eUJqRXdMMTV4bkRESk8zYU9uK3UwOUMwNU1ZeUVWR08wY0F4NW4wR3YrczBGOVAxWHBkbTEvZXdqanl4WWpZY0tGUUpyYjJlZlVBOHhXRVV5cENpaFNTRkpKQkI3R3FCSlNvS1R5STZHcDE2N1MrZHFkcXlJSTkyaEhid3VsaGFjd2IremR1YXNUWjBPMnhYWjArUzNIanNwSzNIWEZCS1VnZHlUUk5teGJkRWVuem4wTXg0NkM0NDRzNUJLUU15VFhPbmVnM25MdnRQdTBqQ3VGWmpzWERNVlpiK3pVVXFscUhWU2lQdytCWE4xUFU5RVZERWQwNndRUEVyYnFUb0dmMCtuMFBJbkhlUE1WSHdwMy9yY3R1amJMdjNXRERiejlqMlpRVVhpVzNtaFU1N01NSlA3UjFWVVVjWWJ5TzJmR3o2M0xwamFjdzBzbjdDSXZSYkE4Wkp5enJYV25ScDA5SlZTc3JsS0FIVHNLVjVsQzUrdVg4TW1abFUweG1haVhqd2hQbFRnUDcvbHIwbSszNlk0WHBWNW11ckp6S2xQcUorZEpQS2VrT0tla09yY2NWMVV0UkpQOG1yK21hTk0xWUVvU253aXpRWmVLVjRpeXVuNnF1blRPbWFOT3RtMXV5dW5ScDAxcDE5c1JIcEx5SThkbFRqcmlnbENFak1xSjdBVUd3WUJ1eWdhVW9oS1JtVHlBQTVtcFY3dEc1eFB4b3VOalhhVEhjaDJVRU9SNFNnVXVTdkJWK1ZQenIzbTYvdWZOUVV4Y2Y3VVlRWElJRHNLMk9EazMzQzNCNTlWTWR0dHRwQ1dta0pRaEF5U2xJeUFIZ1VwNnRycnV5cUJsYXNjbExIMlQxOXQyWjFMMFoyd21NbVNjTXdqL3F1bnV5dG9zOXJzRnVZdE5tZ3N3NGNaQVEweTBrSlNsSTlDbzQ3MDI5VGJOblVDVGdqQnp6VXpFTWx0VGJ6aVRtaUdraklrK1ZlcSt0Nm5laGpiT0lUMkNjRnlVUDRpa29LWG5rbk1RMG52L2Q2cm50T2xUTG5NZXVGd2tPUHlaQ3k0NjY0ck5TMUhxU2ErQ2pxT1ZIcUV5bVE0TTBnL056UEw3K2pmYlZkV0pnUVpmQUhqeUpIeThoeiszcXlMdkc4NHQxdzVxV29xVWZKUE0xOGFkTmFkR242cHpzcEx0UHJmbTJ2UDRmc01iWnRaSlJibFhaT3JPVWhXUlN3RHlUL0pxQitrZXRiUzNoOFdPNDIydllndXluU3RsdVFZekhQbHBvK3FNdmhXdDlPcTlTc3FSS1pXNmRBY1NoMmxlcHgrbVRUbFRUUlUwbVR4NlR3ZzlsUG9PdWJLNlhxalM5VkpiZG4zV3BPMHh4dkYyTVdseDhPTnEremJISmNzanNQQ2ZkYkoyMmJrVnZmakx2dXlZZlIzMms1cnRyaXMwdVpma1VlaDlHdkdKckNVd2tmK0FlcnNyVS9LRHNUdjlCcTNyRDBwTTRxQy9ITzBYR2crWWpjRC9FNk5DRFNvMHVYU3N4ZWJCZHNQWEY2MDNxM3ZRNWJDaWx4cDVCU29Ha2RPck9sU1ZwQ2ttNExWeFFLQ1VxRmlHVjBxTkwxVFduNnE1R2h2ekpEY1dLeXQxNTFRUWhDQm1WS1BRQVZrMkdKYkZ5Y0F5MFMzeVo4bHFIRGpyZWZlVUVOdG9UbXBSUFFBVlBIZGQzVUltRFdZK085b0VORDk2Y1NISXNOWXpURkI2RWp1djVVenV0YnIwYkJNWmpIZU9ZYUhiMjhrTGl4bHB6RVZKNkVqODN5cVQ5Sm1zNjBNU1ZTK1hLNE1sS0d2SWN0enI2TTI2UnBFUTRUSHg2ZVBOS1RwelBQbHA2dFFBQVpBY3EwSnZRYnhjUFpQWkY0ZncrKzI5aVdlMlEya0hQNk1nL2pWNzhDdlhiZXR0Vm8yTjRTZHVEcTBQWGFVa3R3SXVmTlM4dnZIOW9ybWJpZkVWNHhoZlplSWI5TVhKbXpIQzQ0dFJ6NjloNEFyNEtKcFA4MmVDT2l4OEZKd0htUFFhNzVOOXRZVlIrVnUvd0FIQ240cWhpZktPcDAyemJGWEtiT3ZFOSs1M09TNUpsU1hDNDY2NHJOU2xFOHlUUzJsNnByVG8wL1ZQUktRa1dHVEpncUtqYzVzcnBlS05QMVRYQjZvMC9WWnMyTHRrSnJqazJXOUxkT2EzbGxhaWZKcXhwZXFiMHFDMzZvQUFGZzJoVVNibHBpYm9HOEpieEFpN0tzVnVOeG5XYzAyMlNlU1hBVC9BTGF2ZmlwZDllWXJrSXd0Nks4aVJIY1UyNjJvTFF0SnlLU09oQnFkTzY5dkh0WTFoczRHeGxMU2k5eGtCTVo5WnkrbElIYis0ZjVwTzF6U0JkS1ZOSUVjSnhXbmI5UTViN1pzMmFMcXNQVXBsc2FlSVlJTy93Q2s4OXQyMlZ0YzJEWUgydlc1VGQ1aEpqM0ZLU0dKN0tRSEVIdG4rWWVqVUI5cnV3REcyeUs0S1RkWWFwVnNVbzZFOWxKTGFoMjR2eW4vQUpycURTZDJzOXJ2MEI2MTNpQ3pMaXZwS1hHblVoU1NLck5PMWhHeUloMHJqZGVVNmZ0T25wazFrbjlKd2s2QmVKNEh2bUd2cU5mWE51UVNJNjNGcGJiUVZLVVFFZ0RNaytLbTd1cDdzcldIbUkrMFhIVUVLdVRvRGtDSTRuL1lTZWkxRDgzanhYdGNQN29tenpEMjBRWTBqY2JzSnI3VmkydURpYmJkejY1OXdPd3Jld0FTQWxJQUE1QUR0VmhxdXVrekNIRUpMU1FsUTRqa2YyOVMwRFRGRnFnWDVpcGlBVkpQQ014KzdvR3JXQXgxalN5N1A4TXpjVVg2UWxxTkViS3NpZWExZGtqeVNhemp6elVkcGI3emlVTnRwS2xLVWNnQU9wTmMrZDZiYmM5dE14UXJEMWxrcUZndExoUTJFbmsrNk9SV2ZJOFZVNllwOTVVRWFIV1R0T0tqeTI5VHA3dFo2a25ydVJRWmU1clZna2M5L1FOckhhMXRLdm0xakY4ckV0NGRVRUtVVVJXTS9xc3RaOGtqL3V2RjZYT205SWVLTkwxWFIwUER1b1YwbHc1RmtwRmdHNStmeER5SmVxZlBUZFNqY2xsTkwxUnBlcWIwNk5QMVhzM2xkbE5MMVJwVTJHL1ZWMDZHTHN4cDBhZnFtdEtqU0hUS2h2TzdLNmRYNEV1WmJKck54Z1NGc1NJNnc0MDRnNUtTb2RDSys5UDFScGVxd1FGQ3h5YklVVW00TFQyM2JkNFNKdEx0YmVHOFJ2dHM0aGhvQTVuSVNrajhTZmZrVnZldVQ5bXV0enc5YzQ5NHRFdHlOTGlyRGpUaURrUVJYUUhkL3dCdTF1MnIyUk1LNE9OeDcvRFFCSlpKeTFSK2RQcnpTUHJXa0RMVkdQZ2svQ09ZOHAvOG42TTZLT3F3VEZJZ1l3L0ZHUjh3Ni9kdHYwVVY1ZmFUanUyYk9jSVQ4VVhKWXlqdGtNdDU4M0hEOTFJL21sNjRjUElsNmx5NkYxS05nT1phK3ZueUlkMnA2OU5rcEZ5ZVFiU085OXRxT0Y3Ti93Q1BjUFMrRzVYSkdjeHhCNXNzbjhQb241VkI0b0pKSjVtdlE0c3hGZE1aWWhuWWt2RHluWk0xMVRpaVQwQjZBZWhXSTB2VmRLMDNJM2NoZ1V3NmZFY1ZIYzlCa0c1MXFHZFBKM0dxaUZlRVlKR3c2bk1zcnAwYWZxbXRMblJwanhVODBIZGxkUDFScDAxcCtxTlB5S0dHVjA2KzJJajhsNU1lT3l0MXhaNFVvUUNWS1BnQ200OEtSTWtOeFlySzNYblZCQ0VJR1pVVDBBRlRZM2JOMnFQZzloakd1TllpSGJ3NmtMalJsak5NVUh1UitiNVZCVCtmdzBnaHUrZm02ajRVNms5TnkwM0lwSEV6Mkk3bHpna2VKV2dIWFlOQ3ZnbzRQVlpLNjIxNjFYS1RicENTbHlNNHB0UVBZZzBwd1ZPSlVGZ0tHclFhZ1VrcE9ZYXh3VWNGWCtDamdyTGEzYXh3Q3NyaGpFbDR3ZmU0MklMRE1YR2x4VmhTRkpPV2ZvK1FhUjRLT0N0WGp0TDFCUXNYQndJTGJvZUtkS0MwR3hHSUxkRTlpbTJpeTdWOE9wa2FqY2U3UlVnVEl4VnpCL01ueWsxR1BlejJyLzZ6eFdNSldpVHgydXpLS1ZsSitxNi8zUHZMcFdrb0Z4dVZyY1U5Ylo4aUs0b2NKVXk2VUVqeHlwZFlXNG91T0tLbEtPWlVvNWttcVhLYUloSlRNMVI3dFYwL0tueWs1NDY4bXVFMHJTS21rdFRBckZsZk1yekFaWWFjMlc0S09Dci9BQVVjRlhkcVkxamdGSEFLdjhGSEJRdzFqZ3E3R2h2ekpEY1dLeXAxNTFRUWhDUm1WRTlBQlYrTkRrVEgyNHNWbGJyenFnaENFRE1xSjZBQ3BvYnVlN2pId2d3empMR1VWRHQ0ZFNGeDQ2eG1Jd1BjL3UrVlFNL244TklJYnZueHVvK0ZPcFBUY3RPU0dSUk0raWU1YzRKSGlWb0IxMkRXOTNEZHVqNFFZWXhualNLaDI4T3BDNDBkWXpFWUh1ZjNmS3BHMFVWenROWnJFem1KVkZSU3JrNURRRFljbTZCbGNyaHBSRENHaGhZRDNKM0xRVzNxTm1VbkNXT1hjU1JJeC9wbDZWcWhZSEpEdjRrbjUxcEhnOVYwN3hqZzZ4WTVzVWpEK0lJaVg0ejQ1RWo2eUZkbEpQWTFEWGFUdXRZM3dqSmVsNGRqcXZWc3pKUXBrZmFvSGhTZS93REZOK2pheGhvbUdSQXhxd2w0a1dCT0FVQmxqdXlscStrWW1HaVZ4c0VncWRxTnlCbWs2NGJObzdnOVVjQnJJemJQY3JjNlk4K0ErdzRrNUZMaUNDS1granVmcHErRk1aS2txRndjR1hoU3BKc1F5M0I2bzRQTk02RG42YXZoUjlIYy9UVjhLMndiRml5eFI2bzRNNloranVmcHErRkdnNSttcjRVWU1XTExhZnFqZzlVem9PL3BxK0ZHZzUrbXI0VVlNV0xMY0gvMlZYWTBOK1krM0Zpc0xkZWRVRUlRZ1psUlBRQVZmWWd5Wkx5STdEQzF1T0tDVUpBNWtub0ttUnU4YnU4ZkNFZG5HR0w0eUhidzZrTGpzS0dhWXdQYy91K1ZRTS9uOE5JSVh2M3h1bytGT3BQVGN0T1NHUXhNK2llNWNpeVI0bGFBZGRnM3h1N2J1a2ZDRERPTWNZeFVPM2gxSVhIanFHYVlvUGMvdStWU0dvb3JuYWF6V0puTVNxS2lsWEp5R2dHdzVOMEZLNVhEU2VHRU5ESnNCN2s3bm14UlJSVWEwaTMvMlE9PVwiLFxuICBcIi85ai80QUFRU2taSlJnQUJBUUVBU0FCSUFBRC80Z0tnU1VORFgxQlNUMFpKVEVVQUFRRUFBQUtRYkdOdGN3UXdBQUJ0Ym5SeVVrZENJRmhaV2lBSDNRQUxBQVFBRndBb0FDcGhZM053UVZCUVRBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQTl0WUFBUUFBQUFEVExXeGpiWE1BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUF0a1pYTmpBQUFCQ0FBQUFEaGpjSEowQUFBQlFBQUFBRTUzZEhCMEFBQUJrQUFBQUJSamFHRmtBQUFCcEFBQUFDeHlXRmxhQUFBQjBBQUFBQlJpV0ZsYUFBQUI1QUFBQUJSbldGbGFBQUFCK0FBQUFCUnlWRkpEQUFBQ0RBQUFBQ0JuVkZKREFBQUNMQUFBQUNCaVZGSkRBQUFDVEFBQUFDQmphSEp0QUFBQ2JBQUFBQ1J0YkhWakFBQUFBQUFBQUFFQUFBQU1aVzVWVXdBQUFCd0FBQUFjQUhNQVVnQkhBRUlBSUFCaUFIVUFhUUJzQUhRQUxRQnBBRzRBQUcxc2RXTUFBQUFBQUFBQUFRQUFBQXhsYmxWVEFBQUFNZ0FBQUJ3QVRnQnZBQ0FBWXdCdkFIQUFlUUJ5QUdrQVp3Qm9BSFFBTEFBZ0FIVUFjd0JsQUNBQVpnQnlBR1VBWlFCc0FIa0FBQUFBV0ZsYUlBQUFBQUFBQVBiV0FBRUFBQUFBMHkxelpqTXlBQUFBQUFBQkRFb0FBQVhqLy8vektnQUFCNXNBQVAySC8vLzdvdi8vL2FNQUFBUFlBQURBbEZoWldpQUFBQUFBQUFCdmxBQUFPTzRBQUFPUVdGbGFJQUFBQUFBQUFDU2RBQUFQZ3dBQXRyNVlXVm9nQUFBQUFBQUFZcVVBQUxlUUFBQVkzbkJoY21FQUFBQUFBQU1BQUFBQ1ptWUFBUEtuQUFBTldRQUFFOUFBQUFwYmNHRnlZUUFBQUFBQUF3QUFBQUptWmdBQThxY0FBQTFaQUFBVDBBQUFDbHR3WVhKaEFBQUFBQUFEQUFBQUFtWm1BQUR5cHdBQURWa0FBQlBRQUFBS1cyTm9jbTBBQUFBQUFBTUFBQUFBbzljQUFGUjdBQUJNelFBQW1ab0FBQ1ptQUFBUFhQL2JBRU1BQlFNRUJBUURCUVFFQkFVRkJRWUhEQWdIQndjSER3c0xDUXdSRHhJU0VROFJFUk1XSEJjVEZCb1ZFUkVZSVJnYUhSMGZIeDhURnlJa0loNGtIQjRmSHYvYkFFTUJCUVVGQndZSERnZ0lEaDRVRVJRZUhoNGVIaDRlSGg0ZUhoNGVIaDRlSGg0ZUhoNGVIaDRlSGg0ZUhoNGVIaDRlSGg0ZUhoNGVIaDRlSGg0ZUhoNGVIdi9BQUJFSUFJQUFnQU1CSWdBQ0VRRURFUUgveEFBZEFBQUNBZ01CQVFFQUFBQUFBQUFBQUFBRUJ3TUdBZ1VJQVFBSi84UUFQaEFBQVFJRUJBTUdBd1lFQlFVQUFBQUFBUUlEQUFRRkVRWVNJVEVIUVZFVEZDSmhjWUV5a2FFSUkwSmlrckVWVXNIUkpETkRVL0NDazZLeTRmL0VBQnNCQUFJREFRRUJBQUFBQUFBQUFBQUFBQU1GQVFJRUJnQUgvOFFBSmhFQUFnSUNBUU1FQWdNQUFBQUFBQUFBQVFJQUF3UVJFaUV4VVFVVElrRVVZUlV5Z2YvYUFBd0RBUUFDRVFNUkFEOEFZVFRyOWg5Kzcrc3dVMDQvcDk4Ny93Qnd3TXlnQVFXMG55am91azVya1pPMnQ0ZjZ6bjZ6RXlGdmY3cm42ekViU2ZLQ0cwM3RwYUo0aVZMR1pKY2RBdVhYQmI4NWdHYm4zeGNCNXdXMjhSZzJZR1ZoUjJGb1hQRldzVGxOd2xVSnFudWxwOUtRRXJUdWtGUUJJODdSNWdBSktiWTZrZUorSXRHcEx6akQxVmNkbUVmRTB3b3JVRDBPdGdmZUYxaWZpL1dYSE95b2lWeTdmNG5YbEZTL1lYc1ByQ3lJZVVsU2xCZVphajR6K0luejg5WXlicGpqeUJuY0FTUEVVaFZnQis4WkdZbnRONm9xOTVZWnppVmpWd0MySTVsQTMrN3NQWGxHREhFSEd5WEVyWGlLZkdud3FjNStsbzFzcFRHbGhCYWRTY3hOMHRwSk5nQWJtdzlZSlZSMmM2eUczMXRvK0s2RkViNlJIRnBia28rcGI2RHhocmpHUVZVZDZhdHE0MjRVTHQvNm42UXpzTDQ5cDFjQUVsVTNDOEI0bUhGbExnOWlkZlVYam5PZXBLRWttVWNDVGJSQ2pZRWVodDlJQkptNUoxSVdseGh4SjhMaWRMSGxZaVBCbVU5WjdnckRwT3laT3FQRUM3N2g5Vm1EMFRMamlMcGVjOU14am0zaC93QVRwK1JkYmxLK1RNU1pJQ1pvZkcyUHpmekQ2K3NQbW1UWVVFclFzS1NvWEJHeEJneU9HbVowS3phT09Qai9BRm5QMW1CM1hId0RaOTM5WmdzMldtNEVEdkowMmk1MUI3TXdaQUlHa0Z0SjJ2RUxBdmFDMlVnN0NDQVFKTWxiUmV3TUVJUnRmU0kyMGpTSjIwOHJ4WUNVSmtGUVQvaGxBUWt1T0ZiYnBsSlZUUUVMbVo1SlNBc1hDVWN5Zk8rZ2g3UHRaMlZJRzl0STUwKzA3UVhKNWluejdLVG5hY01zNFJ5Q3RVbjJJSTk0SGNTcUVpR3hpRFlBWXJwTkR6eTIwRUJQWnBJdXZ3Z0U4L00rVVhEaDlnMmN4UTg0WlhOMlRMdlp1TFdrZ0JRM0FCMzk5STBmRHVuTUl4QWhFMFZ6TGlFa2tMTndrQWtEOW82UXdKS055RXBabElRWGxGMVlUc0ZLaE5abHRyNHgzWGpEdTAwOVA0TlNIZDBpWm5IbEcvNFZXdGUvSWFjekVsWTRIMEo5bEswenM4dzZrV1N0dHdwMjJ1blkvS0dkS05QcXNwUGl0dkU4eUgxdGtGQk9XTXB0YzlTVE5ZclFEV3B5dHhEd0xYTUtLYWZXK2FuUzFLeUxkVTJDcGxST21ZZnltS2JPSkNKMVVnVUxUTU5vR2RoMVZ3c1d2ZEpQTG45Tkk2eHhFeXB5VmRabUcwT05PSktWcFZheEZvNXU0OFV4bVc3clBTZjNVMHdxemEwN2xQUTlZTFRrT3AweDZRTnVPcC9xTlNsZGl5a0tXaFZtNytOSjF0cmIyOUlmSEFpb1RjNWhkeVduSEM2WkdZTERheWJrb3NGQVg4cjI5TFJ6eEx6eHFETGMwWEV0T0g3dDVKTmdUMWpwcmd2UUg2Vmd5Vzd5MlVQelMxVEN3UlkyT2lmL0FCQVB2RE9vaGpzUmRmOEFFYU1ZY2tDcHM4NDllUnBFOHMwVXRhamxHTHlkTjQxVEJ1UU1nNzJndHBKMGdaclMwRnREYUN3Uk1uYkEwdkJLRTdXaUZybEJEUTFHbG90QkV5UkFGcjJoTC9hRG5HWkhDVSs4NnBLVk9GS0dnZHlzblErMWlmYUhXRWdwdGJsQ2I0NzRZWXIxUFVIMExVNUxYVTJBc2hOK3BIT3dnT1ZzVk1SNGg4TUJybEI4eE5jTVcxTnk3MDh0RGp6aWtvU0FuNGxEa0I2dzI1S2ZxOHZKcG1hdmlhbTRhVTcvQUpFc3V5OHFmUG1vbm5hS3h3TGtXUzJRK0xsRHlrcFNyZXlkQiswTTZjd0ZTYXU4cDZjWkNpNnBLbEhuNGR0ZHhhNWptKytoT25BSU1pNGQ0anhZaXBvVlVLbFQ2blNuRkJJbVdRZVkwMUlGdVVYdkdkZGNwRkdtWHBGbnZjNDZrQ1dhSDQxblFEK3NWcXNTS0tYU0ZTc3ZueUtRaHBLbEVnQkNMWlFBTk5MUVBXWi90SEtNcHMzT1lwSUp0Y0ZCRzQ1eDVocGdBWVJSMGxOVlY4Y1ZCMVRjOWlMQzlNYzJERHpnVTRyeXRwYjV3dGVLUnE2bTNaV3NwbG5IVUFLYm1KY0VJY1RtNkhZaS93QW9jdUlNQTBTb3pncWkyYzAyRWdFTDFTYkp5alE2SFRTOW9vbkVtZ05TbURWeTJkYWx5NlNXMU9HNnNvSU5yKzBTUUZsQ1RET0NlQWFiSzBhV21YWkdYbTVpWmNNeWx4MW9LS0FmaEF1TkxDSGV4VCt5QXpqYUt0d2hwN2tsaHFtU3ppMUw3TmhPVXFHb0Z0QjdDTDY0QWJ4MEZDQUlKemw5aExtYTl4RmhZRFNCWGhwR3dkVEFibzBNRkkzQkF3Um5ZUVcxeWdSbllRVzF5aTRsQ1lXenlnaHBQV0IydVVGTmNvdEJHVG9BMDBpbThRSlZTbVhWb1RjZ0JSMHZzWXVTUGhnR3ZTbmVKUlNnbTZnTEgwaUdYa0NKYXF6MjNEZUlqc0NVL3dEZ21MWnlTVXBCUzRzekNNdXdDN0czcnZEdW9DRXV0SUpBSS9EZUU5V1pZMHpGOG84a0VJY2F5YldKc2Y4QTZJd3F2SE9Yd0pWNWlrMS9ETlNVNGdsY2srdzRqczVsa2p3cThXeHZjRzE3RVJ6VnRMSS9BZlU2bW5JV3djaDJNWmZFNVJaWVFWcXlwYVpVNDdrYkt6bDIwQTUrZktBY1FTbEpWaE9rVFVnOTJyN3EyekxKVHFRZC9sWUc4Y3lZNzQ4NDJ4TldGekZLZFJTSlZDU2xETExhWFhNcDN6cUlQeUZoNnhYNTNpbGp1WmxwVmp2aUdPNmdnS2FsQUZLSjVtNEkrUUVlR094R3pEaTVRTkNkcFRMWVhLTXpCYkFEaUFvWEdvdUlWWEVVZDdtcE9sb1NYTzhUYUVMSDVDUm0ra1VUQlAyanA2V3BKcHVNYWFxcEtiRm1wdVVLRzNBT2kwR3dQcUxla1diaDVYWHNmWXQvakRWTmRrcVpLQUtaTDV1dDVSMEowMHNOUHJFVjBPMWdCRUhmZW9RbVBIREV1RU0zQ1FBa1dBSFNOdXZlSXFRMkc1SWFEV0ozWTZVRFFuS0U3Smdid0hLQW5ocEJ6MjBCdjJ0cEVHRUUxelIyZ3hrYlFDeWRvTGFWRnBWb2F5YlFXM3lnRm82aThGdEsxR2tXZ1RDMGJDTTFwQ2tGSjVpSUVxRmpyRmJ4cmkrbllmcE16T1RVMGhoaGhCVTY2bzZEeUhVbmtPY1NaUUtXT2hLWnhUZGw1Ykk5ZTdrczhsV25RbXhIeVAwZ3VqSm9sZm93a2EzSXljK2xwZDIwekRDWEFtNDBPb050SVJEZUxwN0gyTTAxZDlMckZKbDVvUzhuTEE2TFdwS2lwYm5WV1gyRi9uZmFGVkYwaXB0MHlkQ2tnMlEwNFI4U2IrSFhxTm9RK29mSnd3blM0TlpxVGkwc01saGorQzFsNDBXVmsxU3kxM01xNHlPelFML2h0YTEvZUNzVk1UMDZ4a2JwOGxTbWlDRjltcFRpamZvVm53NmRCZU5tc29xaFF5R2gyaU5uYzF0SUhtYVV6SkpWTnRMUk1GbytJSzF5bU1ZdFlMcU8wQ0g1RWRacVc2SGhpU29yamxVb2xObkpscGc1WFptVlE0NFZjcmtpNU1iZmhqSk5pVE14bFFsYnl2aFNMWlVwMEFBNWM0cCtLcWcvT1RzdEpTcUNGdUlMenR0UWhJT2hQdkZEdzd4T3FXQXNYcXBWZkxrNVNWcTdXWGZRbjcxaENpZExmaVNDQ0xiNmFkSTA0QjR1V2FLZlVFYXhkTDl6cjlsR1JoQ2ZLTVhURmZ3cmpDbFlncHJNNUpUak13dzZMb2RiVmRKL3NmTGVONHRRVllnaXg1aUh3NnptdEVIUmtMMXJRRk1IU0NuVG9kWURlT2tSQ3IybXFaVnRyQmJTbzE3S3RJS2JWRXlHbXdaVUxhd1Vsd0pGeWRJMUxzMnhMb3pQT3BUNm5Vd3QrSTNHWEQySG1YSlZxWkV6T0RRTVM1Q2wzL01kaysrdmxIaTRVYk1xbFRPZEFTNjQzeGRKVUdsUHpzOU5JbHBWa1hXc25VOUFCeko1Q09QT0svRVdvWTJxV1h4eTlLWVZkaVh6YXFQODYrcXYyZ0RpTGppcjQwcVNabWV5c3NNM0RNdTJvbEtiOHpmZFhuRlV0ZmJhRnVSa2wraTlvNXhNTVZmSnU4YzNBdGxwekM3cml4NG1xdWhYcGR1M3R1SWRGWncreFY2VWhMZ3M0bjRYQnVJVnYyWG1relZFcnNxVVp5cHdLQ2V0azJoNzRkS0hwWHNWMkxpQ1VLQjVrZjhBTHhUS3BQdG8vd0NvYW0wR3hrUG1VK21TT0s1UktHMkVvbjBvVGxTb215N2RERVZZWGl0dVdVeXFTWWxFTDN1azZrL3VZdjY1ZHlTVUhtU2N5VGNqcUlBblE5VzZxMkNoU1dHN0VnamUwTHpYdWJVYjl5czB1Zzl3cGkzWmwxVDAyOE03enF4cWROQU9nSElRaU9Pc2lwRXBRcW4yS2tGU0hHSE0yNXNjd1B5MmpwWEZCYlMwV205MWpLZGJXRnRmcEMyKzBkUnpNY01aZWY3RUpYTFBKZDBHeUxsUDlSREhFeGlhWGFaTWk4TFlpeERZRHhyWE1HMUVUZEltZnVsa2R0TE9FbHAwZVk1SDh3MWpxL2haeFhwT0twTktaZDNzNXRDYnZTYnFoblIxSS9tVDVqM3RIRmRpamxwRThuTlB5azAzTXlqN2pEelp6SWNiV1VxU2ZJaUtVM3RXZjFJdnhWdEcvdWZvd3pOdHpEV1pCR3ZLSVgxYVJ5RmhEanRpZWxGcHVwc3MxRnBPaFdEMmJwSHJzVDdRNHNKOGJzSzFzcFpmbXU1UG5USk5BTmsraXJsSitjYjF5VWI3aXg4V3hQcVg1dHdCTnliQVJVZUlQRWlqNFNrd3FaZUtuWEw5azBnWmxydDBIVHpPa1Q0d3JUVkpvMHhOdUtzMncwcDFmb0JlMy9Pc2NlNGdxODdYS3UvVko5MVRqenFpZFRjSUhKSTZBUkY5L3RqUTd5Mk5qQzA3UFlTNDR6NHRZcXI3cmlHWmxWTmxGRWdOc254a2ZtWHY4clJRQ1ZFOWJ4OXVieDlhRjdXTTUyVEd5MXFnMG9ueVFPbXNmV0VaYkNQRDFpSmFPSDdPMDVNU2JVNTNXYVJLcmRmU2xTMUpCMEFHMS9XM3ZEOW9rMjZaMFRDMGtQbGRuMGdXQlVCdjVFaStrYzJjSlptVmFwUzJGdUJMN2syb3QrWGhUejg0ZU9GS210UjdKVHdibUVnZG5tMmZzZmdKNjlEdkQ2cWdQaktsaTYzMUJpUzIwcGtGbGphY1pSTUlRNDFaWVVMZ2pVUmcrd3pJU0Q3N3hRM1lha2kydjlZcmRMcmt4SUxEMlQ3aHdHNlFiNitYbmZsR0V6TXpsVmQ3eThvOTNDL0MyRldCaGIvRzIrN3hQYnpOdjVpZTN5KzVXc1JWTXB2TmRtWFV0a0VOcDFVVGU5bGNoY2dEVSt4aFk4UTUrYlJnMnRUdFFuM25ucHB2cyt5VzZwU015MVdzbE93Q2QvWVJmTVVWUkV5cFV2TFpXNVJtOXlOaVJ2N0RXRUpqREdMZFlYVTZhakwzRXRCTXV1MnFuRUtCemY4QVZyOUkyT1ZwVGdrelZocnJPUmxDdjR5RDZ4N2tBSnNiUjZvWmlZeENyQ3hIMGhKcU9KOHBKMXRyR0lKRVNIVWJ4amw4UG1ObzhScVRPaitQdFJET0RaOXJ0Y3BmVWhvRG1icUJJK1FNYzRYMXQxaHJmYUZxU25abW5TQ1Q0U1Z2cUhVL0NQNndxTDZnd2JJYmJ6TGlMcXVaRFFlOFpKMzlvd093ajF2VXdJZDVwbVIyajRpUGRnQkhnK0lSYVJMamhDV2NGR0V3QlpLbjFKQ3I4d0JwNVF5OE1WVngrV3l6VGdRcHRTVUpkVWJaMUc5aDVtd2lnY1BTb1NLSmN0cmRibVhDaFRhZDFHL2hJOHdkdjdFeHZxeU83dk55TGJtZVdaOFNGZzZQRTd1RDF0WWRBQU9zZlZzVENUTTlOcG9jZGRBZytKeW1WWVV5R1llWTNhTFczRXFMRThWS1FkUW9KdVNlUlA4QWVKY1RZaVM2MEtkSWpzNVpPaTFrMlU1Ynk1Q0ZkaDZ2VGlKbHFUVWd6U1ZLQ1VnL0VQZUtmeE14VFduS3ROVWZJdVFsbTFFRktUNG5VblpSSTVIeWprL1U4Vy9BYjI3UDhQbWFzWlZ5RDBtMjRsWW83N1M1aVFvazBoYmJTd2lkVWk5d2s2REtlYWI2RTlTT3NMaVVZUUpWMmNmSDNTQVVJVGV4Y1dSb1BRRFUrdzV4UGhydkg4WGFUTHBhSVVGQjBPLzVmWlc4ZWY4QUxsdnJ5c0NOYlI5aU10ZDRhUkozN2dsdi9DazdxUVNicVYrWW05L01Ra1k4aHN4elVnckhFVFc3V2p4VnI2eDcrR01TYnd1TTBDZkowank5Z2ZXUFk4VVJjMzVpS21UUC85az1cIixcbiAgXCIvOWovNEFBUVNrWkpSZ0FCQVFFQVNBQklBQUQvMndCREFBRUJBUUVCQVFFQkFRRUJBUUVDQWdNQ0FnSUNBZ1FEQXdJREJRUUZCUVVFQkFRRkJnY0dCUVVIQmdRRUJna0dCd2dJQ0FnSUJRWUpDZ2tJQ2djSUNBai8yd0JEQVFFQkFRSUNBZ1FDQWdRSUJRUUZDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FqL3dBQVJDQUNBQUlBREFTSUFBaEVCQXhFQi84UUFId0FBQWdJQ0F3RUJBUUFBQUFBQUFBQUFDQWtIQ2dVR0F3UUxBZ0FCLzhRQU5oQUFBZ0lDQWdFRUFRTUNCUU1FQXdFQUFRSURCQVVHQnhFU0FBZ1RJUlFKSWpFVlFSWWpNbEZoSkVKeENoY3pnVkppa2NIL3hBQWNBUUFEQUFNQkFRRUFBQUFBQUFBQUFBQUdCd2dFQlFrREFBSC94QUE2RVFBQkFnUUZBZ1FEQmdVRUF3QUFBQUFCQWhFREJBVWhBQVlTTVVFSFVSTWlZWEVJTW9FVUZTTkNvY0VsVXBHeDhETmkwZUVrY3ZILzJnQU1Bd0VBQWhFREVRQS9BR2xmKzVQdDcvVGk1QzlxL3N0enZEbkNQSnZFbTBWNkd3WCtTTTQ4S3ltZWVkb215TGlSSkltVWVFWlVoMUFRcUI5RDdNdlhNMTdPdlo1cDN2Rjl3dkdtM2F0dWZDK2J6RW1lM0t0aTcxU1hIWWNMUlA4QTBkUkU3aVl5RjJZUnQvZWJvOURvZWtwdzczK29sZ3RmMVMxN21PQ3RDd1hCM0dXdDA4WG44aHR1b1l2ODRhNzQvR3RPT2FjdklaNTBSbzQyUUFCK21icjFtT1VlRk1ueEhrdE45MzJwNmx4SHFIdDh0NVRCclQ0UVFXbUZrZmROcE1vcS93Q1M3UytEV1M3UnQyUEJEL0lQcUs1RElTWnBLZkVqTnFJR3BLZ29SVmc2Z2duZEJXUHpIeXBERW00eDB0Ni9kUWNnNWFtNGxLelBXaDl2Vkt4Sm1aTXZGWE5RcHp3NDJ0MWFRUENqS09nSlNna0FncVlNUVhJK3lUM1dlM0hNZTFYbVRsYmluZ1BLKzNMZzNWTVhZeVZ0N1NRQ1BQTWEwa3hrci9FM1RrZUlERS9SWjFBUDE5Qlp1UDZuWER1NSt3V3JzUEpPbjJML0FDektsbXZwbUg4NUJMWGxIY2RhNWRkWlFGNitOM2Y3WldDcU9qNTlldFY1cXA3TmhkZHhudnh4SFBHazZ2bHIyT3BhMnZEYXh4dGljWlYrS1d2SkhPdnlCTzBWSHNlTWtDaFdQVEhvZCtsODhPK3luY3YxQXVUTmQ1YTFmY09HdHI0WnRaTCtwWmJFMTVwc1hTdUNObmhlQ0t6UldXT0Mwbnh2L3JWRmsrd2hSVzh2VFpwV1RjczB5U2lWcW9IdzRhVmhnRkhXRnBGNFFVUjVuVTdxY0pQdGZFVXhNL2ROODc5U1pTVmtvaWx5WWh3WjZZVEVSSGp3bHdGc3BjaXJXTFJ5cElXWmlOcFRwZENFdWNOTzF2R2UxVDlVNGNJN2J5VnpGeTd1dnVQNDF3V0x5R1oxelY2TDFzYlFsL0tXV1NWbE1TTEdKV1FJWmZtallvbmtvNlgwZjI2ZTdIbXpiTlQyekw4VTY1VTFHdmo0bk1LVXNWSnNPWWV1djBaeENwRUtnZEZ3cWlkeXEvU2xpRjlmelROYjRlNE40ZzMzWCtMdGJyOFI3T2x4WHU0MkxGUlZJY3ZOQ2dWWWcwRG41cTdLVlJwa2R2SDkvd0RmeVVobG5kMDMzYXVUc2J4andYamErbDhxVlpLbDNhZjhMVzNoeGRXbzlkNWxteUVVOFN2Slc4T2drMFVmYnkvNVhrcERBVEhtUE9NZXF6U1V5dXFIS3c3cENpRkZDU1hZTUdTSDVZdHRmRkpWbWVrS3JOTEtJYWhLUWxLK3pvaWthSVNTZGFrZ0JLRWxKSmNBRCsrSmgyRFpVMi9odTl0MnF4WVQzbDhnMDZ0S1d5YjJVclI1djhrbFpKdmh4bGdSQ0dkSXg1cFdFVVRnanNBdDlHUnp2dnQ4MFRWdnhlVzlHMUNqeFJzWXF4aklVWUVHTXYyNVN6ZmhiRlhpVDVsbWVSUWU1VVpKMkpSajVEeGFKdHg1WTl0K0cxdkx5N0pzRnpkK1Q0YmRMRzV6YWF1QlY4cmtjakdzalY2VWlSK1ZsWUZEdjlTRWlOV0xFK0piMHZmYi9jcnUyLzNPU09UYzV6WGhjTFZ4NGFDSFg4ZGdZNGNadjJ2Q1JGYWhOa2JSYVNPNGE4MGNEc1ZaRW1qWU0zeHlvVThLTGw5VVdQNDRDbVNiRlJPNmoyQUlKRzRKRFh1MjRGcHVtZU5MQ0RIVG9keUdTUVdETTNZSDJHbGpZdmh2bTllNW5RN3NrOG1ENDI0L3E4djRMRnVhTVdVcVUwYTdqSlZZVHg0Q1poNHpmSkZBNDZZcjRsVVdSRjdBOVJkak9GUFk1WjI3VTh6clBIM0hQQjNLMUxHMk1uRHNPcTFxK0p5dDJ2ZVYxZVNLN1RlTW1hS2RtTHMza3FNZkR4S3Y2WGZWM0xsVGlhQ1BQNmhGTnRXcFluWjMySFdzYi9oaDdlVXNVcjh0ZGNsWGlrbGFUNDNnU3ZlbWpQbUVzb1lpUTVWaDZublh1VU9EZDJ6MjFVYzlnTjB4eTRhZkVmNGUyYkJyVXF5MnNkbUltaW5XRkVpQ3cxbzdNZGNTMWxMc3BnaWRmRUQxdVptUnFFdWt4NE1aUVFReElVZXdGdysxd0d2dWUyUHlVeTdKcFY0TUZDZzcvSjh4ZHhkN016MmZrNE9UU3ZkSHpKN2VkdG0wWDNSUjJ1YVBiL2J1T3VDNVJ3Vkl6NVBWNFkwRWl4N2hRclJoWWw2VHlYSzFrRUpKL3dBMktILzVHWUJ0MjljZTJlUDYvSzJNdjZ2dVdyckNtUnhlWW9YSWJNU3d2MG41bE9jRm8yQ2gvSU1oSUlIOCtsMHJoTS9xbXA3cnluaU5yMkhlcWw3Q1VZOHErdDFvNlZpRzFqSlhEenhQTTd3cVpJWCtOdzY5TUlPaVFUOWFacjl1cDdLK1pUeUxvRmUvUzltKzN6U1lmYU5mU0dPVEVhTnMwa3cvSDJPSVJvRXBVN1R5clZ2SkVCR3Nra05rcjJaWDliM0xPWW9jMU1RNGNWTFJiTVJZUkNCY2Y3U1FkOWxHMitFbDFCeWNESlRCbEZhV1NxNURoSkFzZEpJSklJZlRZbHJOakpUY0o3Wmg5dTVYNG40dXhIQlYzaHV4cWRPcGJ4T2N4RWY0bUYyZTllZ3liL2pNUjVKaXNpQk5LMEJKamp2RHlWZjgwZ0xZMmZpN1pPR3QrNWk0NjJiV3MzaHRZbzdQWW13a3MwVEVaYWt0bVNDcEloOHU1R0NOL3FWZXlZQUNBRDVxNlhFYW5nZDg1MnVhYnRtY3g4eVFhOWZ0YlpnNW1VUjVDSEx5U0xCampZUnd3bXBOUXNTb1QrOVVuQlVKMEdJQ2U3N0JlNFd0dDArNGIxdWV0YmxvR2g2M2pjRkt3L0hseU1tWWx2T1ZPVXJnTVRGWWlncnlwTDBBUks2L3llL1QrbEpreTgySmRSRExTRDhwQmV3OWk5ajdIdmdneTFPak1PVTEwdlVoQk1CTVlBa2xZakk4b0FVSDFMaU14Qlp0YkU2MGtZd09La2hreWVOaHRSQ2RFaXIxY20wN3FyMTQvT1VmSkloVk80bWVZa3N2aVFqb3AvZDBBUTlHZk53VGNkVjZlSStITWpNUjVXelVlZjRIb3ZIWWVGalVlUUNPYVB1MTg4QUpEcTZHUUwrNzZGSFJyR1ZTOWpMRks5alkzaGtuTlc1MzA5V1F4Uk8wZGtPQXhqWnE1Q3QrNHQ4TGZhTkg1c1Yrc1pTeGpjcFVxNXJGMzQ5VnF5U0xicWRGVFdpampaMGxrN2RnWCtvMEVUb1FTQ1I1RHZyRXFNcnBpZ3BEa1A4QTU5TVRYVHFpbG1pa3BKSS9wOVg0RFlYYitrVnc1NzU5djNaK1MvZUhtOXR0Y1RaT0ZNempjZnRlU2p0ejdqY1dCbzY2TFdQa1hocnh5ZG84djlnQ29KK3cwM2lyaVBFKzJyY3ZjejdsK2NOOGgyZWJKYk5KUExrc3hVWEdWTUhTbWF2R2xlRW41UG0vekdqalZ2b0VLb0FCSjlkSDlKL2tMbS9rVDJqYU5lOXltajFjSnZ1dDVXeHJ1djVHVEQvMDZQTFl5QkVoZ3V3UlArN3FSUEwvQURlZ0g2SkgwZldrKzd2Qjh0ZTdMa0RMY1NjZHc4T2Ixd2ZpSm9tMkdsc3QrZXJEbU0xQk9reVFENEZaaEhBSWlTVDM1T1FldWtQcWFzNzUyblppclIwUjFvaHd6K0dwTUlBSlVoSmNBTzl6YTluczlzVVBtYm8vUTR1YUp1Tk5TeUF0TXd1WWNFcVJEaW55cVZDQXNrRUVzR3NvcUxPVGdOZVkvYVpzL052dWk1eTVZOXVtYjl1RlRXY2JKSGtYd2ZJUnVXUDZ4bEJKTFBmbnROVUFldkFmR0ZZNHg4aFlmSVdIUlZRd25qTFpNQnZXRHdtMGFwd3J4THNlMzRHSVlQSU5xQ3o0VktHWW5pL3pFQWtTTnJWYUx6UmhNRllmdUpBREtmU3hjL3lSUDdqK2FNcHdUdzlodUgvYTQrS3dGZkVaek1WSlk3Vm1lM2RqV1JKVXJxMExUMXF6MTVJZmtKQVkyUUIxOWowZU85Vk5uMHJRbjRsMmFYU2VXTjBPRVd0WXp1UDFDYWxOZHZTUytNTFRrTTh0TkpKSXl2bkU1V1B5NzdVQUgwUDVsekJPVGdoQ2VXQ3NCSUE1Q1NBVWc3cElZY0Y4R21WdWxOR29DUHNsSWxVd1BGVXFJVXN3Qko4NmxLU3hVUzRJdUdzUFRFWDdQc1ZUSGJaeDF4cDdnZFEzSGpqbjJ0WXI1akhaVGo3YjY5M0c1SWZPWVZpbTh3SkoxbVlzelVwNEFHL3pQRjJLbGdYMlh1YTN4ZnRPVGx5dWNsdmM4VnNDZ3d0SFlrV2pTdjVEd1o0VFV0eUs4U1JTZnVoYU9ObitJOWx4L3A2VzVwSHQrdlkzbDdpNzNLYzZ6WWpjODFCcjlyWDJ4YVVyTkhEYVhYaWpNODAwdHBtY1diMUl4L0dDR2prS1RHUlFTckFyZDk4SHZ0NUsxN0Q0M0s3RnIrMTRmZ2FQSnJsczNtTHpUdmNuZGJCL0hRczBYemd4aGxhTHRvNDJtWXFYUkY3Tzd5L2xUN3htWWNyVDJKVW13RE5xSmNnT1hVK3dGaWVNR0ZaZ3dSREVWYXlVSnRFTEZpZGd3dXlRMXd6WDN3VitrY1FiUFZ6TGJSeXR5enNXdmJweVpYc1EzY0xnY2QrTlo0OHlYeldwM2pyeUFrU3hTcks4RFdwUU9wWWtkUkxHZWx4dExpV1MzbHR4eWVrN053emV6OU9wVXI1dXpvazJOMkhZOXd5bFM1RlhlV0hGUUNwQ0U4R1FXNEVLUElZcEFJbEk3ZFNYRmZMZTY4M2JybmRqNG4wTGxLVGgrMmtUeWJodWVRcTR5cFNtanJzSTVVa3VYZ0lIYU4yN0NOTVA5RWlxamd1Uk92ZTVQVm01SzUxNDUwNlhZdVpPVmRpbzM0OGpIUnRZN1ZvYVdjbHJ4VnJOeWJKZmwrRnVOL2hTY3kxakhLN2wzWnYzRmZWQzBicFJWWmlORWhrZ0tTRUZRMHA4b2RtVmRrNlEyNWUzYzQ4cTFYNEJnSWlSVjJKSVMrNzdqU0FISVBvN1A2WXN1ZTRERmJUeFR1ZUJnMjdkOEh1VnpJNW1oYUdCZ3MrTnFERll2SUxaaHJ3TEFqVm83NVZmQktkZi9Pbmo4aXdqZFNQVzVYdmN0aStSOVNyeDUvMjcwTlJ1WTdYdGplV3hzOWE1UXpzSHhXR2ZGeVllQjRmeEl1cGF0dEpFWStTT2tmMlBQcjFXWTBiM2YrOW5qL0U2cHhaSHpCaEc1U3d0Z1pJUzRMWUtkdXpWaE1Iai9sQmhZWDZFNU1rL2xDSGJvK1IvbjA3bjJrKzhyV3YxR01keWZyVzNjcDduak9RTmRqcFl3MmNwY3g5UER3L08wY05pUjBKYVdVTzhieXRCRE1pZjV2YTlCbUhvZXpkMHZxRktrek1UTU5LNGFiRmFOVmdTQWtrTllLNDV4OVJxc2lQTlFoRmNxZDNmU2ZZTWI2ZVIrN1liOXdkdCs0Y2U4ZVdMOEd2Ymp5YnJFTkk1VjcxeW5XeVZIRzFyZFV5TlRlV1B3TXpReWhsa1FSZVlVcXkrYXlLZlU2VDV1anVWeTFyV1UxL1NCcTJkVzlVeTJ2MWJNSDRtUldTc3FUaDBKak04YklIOGw4QXhCUFlCQTlLNDQ3NW56T29hVFVvN0xybUkyYkQxd2xUSWEvaTdENHluc0J0WG9xdE93V1pQS1A0SWtrWnlYNjhYK3orMGVpQjBqSVZySEkrbjRpa21zUGhZcTk3TTRHSWlTM0lrMTl4TUt4aG5ieWs4WVl1MDhIOHdGY2dGZTE5VDdVcFdOREtsNnRPa3ZZN2tEanR3ZHVmVEc3bWN0SlhFalJvZzFPRk1vamROOTc3djdXOVh3TCtsYjVaOXZQdkt3M0JudURreEZWc1ZzbFRjOUwycXBhbm4vd0FXYXd5U1kwVFpJU3FYa2tvUVNKQklxZGs5SktXUHlNZlRDL2NQaU5objNEa21ocCtuUjRQWStTdENpeWViL01zSkxMUXRZRy9YaGpiNE8vOEFNaW5vVFNTSHI5MGF3eHV2WmNqMUdmTm1INHoyckw4SDh1WDh6eHhzTkRqdmRxR3gxWEN6UXlERjMza2l6TUlhZnpTU3FLdDJHUjBCRWF5VlY4d25rUEhsOXdmSFB1YTlxVzIrM2paTll5T0Y1MzFHemw5ZDFiZTlqenM3ZjFmYnJrMDluR1BVL0ZYc1JKSlN1S0FZejE4MEVaSVk5QTF0UTg4d2EvVDRDb3dDWmxDQ2t2WUtVZzZuSEFmYzd1cG1ZUGhMMERwM1NxWlVKVDdraWZaRlFIVjRVUXZCaUVyOFE2UWRKaHFVZFNsQXFVbFVSWU9obklHclRLZUcyM0JQVHBwWGlxMzRHcTQ3NVpJNEdtZVdaYmNVY1pqa1pYbGdoWWtlSlZuRXkvWGs0WmpqMEMxaThxcHpXNzR1QzVrSVREUjhtaGNHMVhzTlBZTWR4Z29CY01ZK3hJdmY3QXc4U1NQUy9zSnN0M0paVE9ZYTVvOWZYc1RrWlRabDFteFhoWTRuNXE4SWp4c29aU29tWHNJM2ZSOG9leDBldWpad3V3VnFOUy8rUEhkaEUxWVIrVWxoNFZoZUJpc1UwaktqaU56MHlmS3JCQ1FleDk5SDBxa0pTbVozTi82dHlPK0VEVTBRNVdwekV1a2Y2UzFJdmNlVlJBdUNRVzdpM2JITDdPT2NkbzQ2OW1XdmJGa3VTc0g3bnREcTVCTlc0NXltc1lXZGNuWTE2dElLYVc3bGRVSk5xTllua2NLaEk4UjlFSHYxcmU5TDdlZUROb3gvQmVoWGR0cWU1SE81Q1FWcm0xM2NubW1sZXhESVV5RW5rd2ppSGxJcFo0MERxckhvSG9qMG9QOEFSQjl0SEtmRFhzajVIOXkwdklmS0dBNWd6TkhJWmFtbHJ4L29xMFlxaGVCekZLQ0pZM0FrTFNSRldRcjlINlBwcHV1YjNXd3R2M0ErODNTZWVlVjg1bDg1cU5ITHhVTDhWUmRXcFJ3MEluVTFNaEpHV2tBRFNmOEF4eWRobzJWbDc3N2xIUDBuQVJYNXlYZ1JmRWdvV1VncERCU3dRTGk0RjNZdUhiaDhXeFc2Zi9GSXMxQlJwVXBSSlRaTEtMTWxRUU5GcjZtREZUbHNTRG1zcmlkUXd1Rjl2R204cmNCN2J5QnNtT3ptTkdObWxxUVEyN3NNMENORExZc2RUc1k1ZnlBcXFHSlBmYWZSSzc5N2djbG5zRGlPU09STkkxbmR0aDl3bG5YaW1FWFg4MVh0VUpBZ1ZZaytOWkZQZm1UNWo2REFmeC90QTN0VDFQOEFvK3diQjdqdG81YjRteldENUgydDhscTJNeCtpdERLbjVWa0YyYkkybGQ0NWxkNVhFY2Zpbmo5K1hYMkphMi9qbHg3bGMvc2xibFBCUjVPM2NrcFV0ZWh4MEdRbUpraVF4LzhBVXVRc1pCV1IzSFhiS09pd0tnZ0xuREx3RkFRenFDZTdrRzdsT3podVJ3WHZqMmtZR3FjV2lJcTZVcUtsYVNDcGJwMUJUQURTQ3psaUNBSE9CMzk2WE5QQjNDWEEvRm1xZTg3a0hsYWhwTXlwTG5kbndNZjlNeCtUeXhqK1d6WGtOZHZNQStEK0VBUGszaUFEMzZvNis5WDlSYmMvZjV6RGl1S05QdHo4WWUxU3Bzam5XOEhQREdxQ3JINUNPN2tralZWbm1TUHNxckErSG4weGRoNW51ZnJZKy96Y1BkdHpyTHc1a3NjOWJYK0s5ajJMQ1IzbmZ3bHl0ejh2OGVWekRHeGhTSlB4QXNmaU8vM3VTZW1BOUszNFZ1Ung3aEJEZFI3VkpxRjFIUlpYVUtocnlHUWZ0N1llU3I0L1gzOWpyMTFqK0hiNGVvZENvaUszVlVhcDVhU29BdHBodTdGQTJDaWxuUEd3YkU2NXh6ekZtcDM3c2tsUExoVEZuR3N1NStqdnNBK0xlWDZkSHRNOXUzTm5MdkhXaTd4UHNtZG14MENuK212Yk1xM1pGbm1TeFlrREt4V1JoWEVQeWZYVWFsa0trK1hwbTN2Ui9RQzlvRitsekJ5M3BYR21IdzBzK0xlcFdvVkYrQk1VemRkM0lmNVJwWXlTeXhkQlc3NlA4OWpWL3dCQlAycmJyaWRBeHZ1TzNyRTFkUTJLM1FPTnhqV0l5TERRc3p1UzBiZmY3Ukw0ZVIrKzFiN1BmcDUzdUw5dWZLZnVUMG1makhXT2M4aHhiZ3BvV1dVeFlnemZrT3dJODNsV1pHWS9mZmozMS84QXoxSldjTS96c0RNa1g3RE9MQ0VuUzRWWXNiMkJ1SHhUVWVKSlMwOUtTODR1SERoSlFueHRhQ3NBazZsQmdrblVFc2x3eEJkeU1WT1BicitsVjdmT0l0dG9aalhORmJsUEJiTmIxN1g1S1dldkNHaW5rNm03a1pJMWJ5RVNGWkNzWkRxN01vK2xZZHh6ejBlSnYwMmYxYk5CMGJqL0FJMmkwZmcvY3EyS3dWbTlWV3ZQRk1iRmdORForS1h6WHlqa1Q3Vmd2a3BicHZzbGJiUHQyL1M0MWZoalVLMk16WEoyM2NnN2VsNkdleGs3SFNSMlk0VUtSd0dBbGdzYWhtUGlEOWs5bjcrL1Nudi9BRkUzNlhldWNrZTIvVnZkMXFFdVNqM3poNnJETGthOFUzd0xsOENrOFprTWtxL3VSNndKa1J4OWlNeWYzQUlLY3E1M1ZVYXVxV3JNVmNTQkhRWVpKSnVvZ0JCWjJzb0QrNXhvTXc1aG9QaW9rNkFvT0ZFcDh1bEpPb0d6aHhxUzRHMXp3TUdIbnVLK1NPUU5Jd1hJMkI1aXA1UCttVllidUtvWS9Dcmo4dGpJbVJrbW5XNmJRRWtUUVBZa0VFL2xDNDdYeEovalZkQjErSGV0UDBSdFoxckxVbXdiVjdOWnNSaUtkcnh4aXNJMFZZNVhFbFY0ME1oWDRKQ3lIK094MzBFWHRzeUVXTG9RNnhnTlBwYlhydFRXQU5id2F3REoxa3FoV2tlYXBZU1VtM0JPMW1WQ1FRV2pWWkZWdXlQUjBjQnc2dnBPcjNlTmR2MTNINHZYclF0M1l6bXNDYmxiWHIwcmhUamlZbVlNSlBLTjNqVVJsQjBleDVEeG1ITUJNRW1DczJTV1pnUDZnYzk5N3ZmRENtNlpGbHBSYXl5bHFLVkpzeDBsM0Z2bTlMWHZ5UmdoYUdsOGIzZHFtekZ4cDhWamM3aFA2RFoxM1lNQTgxdUtaNmp4bEZKSkRUeXhlRU1rUFFkd2tnQmZ6SFdMNVIzamJObTlnZkhiUWJ2SHRISU1NR3ZVOGprMnZmaTFEZXgyWGpvVEhGMm1BOEwxeWFuSWtTdkl6UmxtWmw3QkRiRHg5cTV4dW1ZSE9nWVhKN1RTc0dqK1JydVdzWEZ0a1dDSWc5R1p5Wk80Wlg2NzZucXQ1QWRpSkNSLzBIa1RaNGVFOW4yek42VHYrOTdmcWV3YlhsYXVNdXFncTQ5Wk40dWZqV0haUW9zWldTdUI4WGpHd0VhZVorM1kramZwaEJpck1hS1VoU1llazhjdUI5RFlPKytKN3psRVJNMU9Ua1V4UHhGeFVwRHJTaFJDQzZtS20yQUhkUUh0Z1ZyZVl5V2E1VTJ6YTEyREw2MWtNOUpsTEtVb2lrbGUzRzFrUzFRNmxYajgvd0RNVUh5RER3RGVKWWREMFlPclRRSnF0T25rZjZtTVVJaGk0WWFjNnBXbGtleDA1ZytRK2NSN21pamFQNUI5dXhIUUk5Qm5ydkpXV3U1TEtaaS9qVXlzZVN5L3lRejFBSW9uOHBwbUZXd2tpRklXQ3hWdkVvM2lXSDBPbUhpVmVCcFEwTE9XWERZS3ZXeDc1R3haeFVUWHBMOE1wbFNSREFWZ0R1cCtPUHlXUWdBU0tBZXUxOVVMVTRTL3cweFVzcElBdDZON2JCc1NuVktraVlxVTFOeW84cTFxSUhvVk8zNmVuMXhvUEVlNzhlOFRON2NQYnZpdVE2YllOTUxpNWRXeXQ3VnBhbFRkY0hMWmFPM1JxUkk3TllqVDVxc2lucjVJMGRHNmFLUW4xSlBOMnk0Vk9UZUplQmVLMW5yYXBrTE5uK3Q0REc0aWhVcjFNelZsOFpqSkJPbndRTFBHeXFTVi9mMFNBN04zNitXdFdNbHk1eDdYMEs3a2RwdzJXZ2x5Mk96RkxIT2MxbGFZa2F4RmkveUdVS2tFYVBOR0dVZWNpZFJraDRXOVRabyt3OE5iTHQrVTN6ZHRYWFlLbFNDQy9SR2N1MVlxc1B3OUpGZWlSdkZtbDhTVWRwV1FxWWdQSHQrL1hQbE5UQmlsZWt1b2VaUi9tSk45azNlN1hZdnM5dWhzdlRSS3dZVXdVbUlVb0owcFozSlpKVTkrOTNCc0x2Z0s3ZnVGM1RjUGVOSHdUa01VK0cwakczNEpjZGdLdFpwS1dQc1J2NFR2V3J3bnFGUS94VENhVUVxbGdvUEZSOWFwK3RON3FOdzluUHNXNUcyWGh6TWE5d255L1h5K0ZnMS9KSzZwYnlMV0ptRWpVNHhFM2RoRWF3N2RrS2hoTEZqMkFTNDl2ZXkzOTg1bTVIdVh0TXRhZERUdk9Ea3JtTmpndVpLazduNEc3VmpMTEg0QlZReS91OFQxL3FVOVZ3di9BRllIdUQwalpkYzlvdkEyRngxM0k1L0Y1Zk9iRU1wTUFyUjBtaWlyckFGQisyTW5tV0xMMlBoVG8vYkQwNGZoK3k2SzduK1FrSXNJZUZEWXJGbEFoQ2RSY0d6S1psYjc0MFhWbXFSWkttRk1GQVI0YUE1U1dZcTJKUEp2eTU1UGZGUC9BR3ZKdGxWcDVISms1Ylk3dG16Y3QyNUpESkxia2xZTVdrWS91Wnl4Y2tuNzdKSjc3NjlQSC9Tdi9UMjB6T2JMeER6NTdqWTgxTHFkckx4ejQ3WDRGS05rbzFQYU5JZXUvQmovQU52MFNQOEF6NkJuOVBMMnRZMzNQKzRLamdkc3V3VmRZdzhMWkMxV2hQYzJRSy9hcXFuNytNa2Z1WWQ5ZngvSjlYTE5GOXQrd1pEa0hpUFV0VXJDdkhpRlM1QkhGQ2V4SENoVVIrUGZRSGlWNkgvSCsvcnBIOFNYVjlOS2hmY01vc29VcEpLMUN6Sklza2UvcHhiR1Q4SnZSdVFub0VYTk5aS2RFTnhEQkxNcElCTVEvd0RyeDYzd2JITlc1ZnFKd2NmNVcveG5zUHRGOXBYSE5PUDhiRTJzL2FhellvMFF2UXNPRlFReHVxZ3Q4Wjh2NCt6L0FENlhMN2RQMU83L0FCTHZ0WEVjcGU5dmpYM1IzdjZoOGVRdTRMSWxZWW95Myt2NC93Qy85d0F2N1FBUDQvazc5dGVpMy9kNzdzOXo0djhBY3IvN21WdUJNZHJVbUkxM0JWS1U4ZFNmTGVIVDVDNHl1aGQ0NUQreUEvdFlCR0ovYVZPOGU1LzlJWDJ5YWg3VE5JV3JybXFSY3NZYkh6QnRueFd0UjQyemRzOXhmalRPa0xza1hrVWN5eHNURzN5dVFxZEwxR3RPalpmZzAwUTZnc0dJc2dzaENiUHlWbDFGanVBUjljVU5JU1VPbDVobHFIVTVKQzRVMmxpcG1ETHVHSUpVVmY3aTk3RUFYeFpSMGYzR2FsdlBEdzVUMS9LVURyUHdsL3pSS3BqQkNkdDVOL0E2L3Y4QThEMGlxWDNuOHVmcUE4cDh2ZTIzaGozY2V6dlhlT0xlSnNZVjhabXNaUGxjcG5sbWlhR2VzSTQzaWlXT1JYSy9Nc2pNdmtDRlkrdHY5aEdlMXliaVBmZmJmdGdwRFZzeExPLzRjc3crS3pCSXFwSUZIL1lyRlQrMGYyWS83K3B4NUgvVFI0SzN2Yk5ZNVkwalE2bkdISW1LdllLNVF1NFZLOVpzYTFPUkJMOFJqaldWbzdFU0tKRloyVmlxdUFEMldINkhPeWtzdUw5ckoxSkRvTEFoeGNXUDl4dGhTNWt5RFNzcFZtYXBjYUUrdUorSEVXRXE4T0hZcFVBWENpOWxBY0FzUVNCaE0vdDA0anE4VWJmTmlWcmIzd0JqOWJ4aXdWc1pEbEJacjQ1S3pGRmtyU2hXaWtRZ1NHVlpmTUFGUkowUUFHR2F2a05ibTNEY0xPd2JGZXNaTzNXUzFCRFBYbHFwK0pHOGthVHZZUjJnbVp6S3hTUlI4eXEwWWRIVkZVeFpRNCt4bUg1dTUzeCtPdTNOSTN5WGFwcGJpWlNXU2FqWHlOaWZxTXN2ZjFEWkpWWEtBRDQ3QUlYeUFZeS94QnN5WUtEWU5KandUNjNtWXIwOGR2SFpWQVRqSmtrNlp4S3dLVFF5TXZpcS9IR0pRUEx2dnRRcHN4VlJVYU5FaUtKVmUvQkhQTG0vZC9jOTI1WEFKaVhDb1EvRUNFV1NiTXE3dUwyYmIySFlFeHVIdVFjRlIwVGpPSEs0eWV4clZPc3V5VnJjK09pam1xVTY3eXRIZmFaUzZGUWxjZkxNT3ZKSmxjaGZOVktydUF1Uk5LMDMyNzBNM2I1SXpEY3Q3bml6bWFGZXBOTVV3WVM2b25yU3VXV1BxdzlsSkxIeHIyU1ZDZmZZOU1BM1REWkgrbnhjYVlmaVhYaHBlN1kzRllPSEhESWs0dWM1TzlIWHN5Z0VoK2xyUGFkbGlLQXBFdmFxRVVlZy93QXp5ZmpkNGh3M0dkVmMxcXVLeCtZeU9PcTVDMXIwT0xXOURXZUtLcitMVEtxOFZGUGhzU0swWjgyU1h6WlcrVHlMczZIUUVvcHN5aENYVEVValZjT0Fuek5zWERuMHhISFVreXNHVlhVa0pBalExQlNWT0NRSWlZcVc1WjFLUVZnRWY2YkVNWEhIeDVXc1V0c3pHQnJXOU9tRkpnOWtZV2grN0lRbTFHWGxINVNFeVFSeHBLNUI3OERHMy9ZeTlUdlBWeGNVZVBzNURZOEhybFpyUzQ2T2VKakpqc21ValFwT3ExNUpQdFdFdmNnY0JCSWpFZUpIcUlOTHplaDVXMXFXWDJxdkp0RnpGWld6RUw5UU1qd2xwbkM5ekk2OUFmdWpNanRHZW43OFg4Q0ROR09mR1lMUDYzTGdhRmVZWDdrRWJqODFWVDhzUnNZcFA4Z3pyNEV0NHN2WURkaFNDVDBHelVZcXpGZGp0N2U3SC9yRWpTNno0WldwUVo3N2x3YkMzcDdqdmo1OXFmSVVPQzN2YmJsYkE4aWNNWks2elhNcnJObkN2ZW13K1JtRFN5Q0c1R3Bpa3BTTXMwNnZYSHdUTjNJZmpsYVJHbS9ENnBXMW5rUEs0WEY2Vm1jOWxOcXEzc3BsN05PdWxvNUptSGJ3eENaekV2MnhrZFFvRW9kV1BtUVQ2aS9oSDNEYjdoTVJwRFpqSmF0dTJ1V3E4a1dKeUZEdW5sc2RCK0lsdUVTWTd4QXRmdEVvYWFCVlloWXl5Tis1eVVtdzdMc2VqVVh5V1NwVWFOTEozYkJ0MG52RVdLMGpxcktZbWlCTWNMVEV5anZwd0hDRWRBRDF6b3IxT2l3WnVKRlprZzNEa3UzMGNFRWZtYytyNDZDcVRNcG1EQjhNYTFwMHMrNVQzWmllL1orMkYzZXpIRzJzVjdqc2pxT0MzVFpjM0RrNTdOZXBFVE04V3ZyRURKTkJOT1FQeVo0dWlFZ21WRENwY0EvU2owaFQvd0JRSjdWbTl6WDZuL0V2RFhHdTI4ZjZ0bEk5Q3NaRExiRmtiSmd4MEVNZGxtWjU0NFRJVW5WbkVUZEtESXhVbitPeGFQNDl1YW53WHladmZLazJyNDdVdGt6VlYvOEFFdVVlMnRpT3ZIRW5uMUdWSVZYN0s5a3FHWWVQOHFvQXFTL3FlODVWTkkvVjJYbDNZbjFxdnh6ZWhwNmJrcDZNNDg0YVVsYU5iTnFkZkVNSGltbGdsQWJyL3dDRmg5L1pGTS9DYlZwcVl6TEhxRlBCVEdSQVd4SUYxTUF6YkhsdTdQamNaNnBraFVhbEwvZTdwcDYvQlNzZ2dsdFExS2ZobVlYMnVkOFIvd0MxVDlQN25YOVB2M2g4Si84QXUzUHIyU3dPMFZaOGZSekdEbWVXaExMR3BrRVJra1ZmRjNCN0hZL2dOMS9IM1pONFY1QldoeWhya2N1ejJzWG02OTVSTEpFcUR5aURmVVhmWCtrL3RCUDhnZjNIb1YvZkxsY2htdU1PYTdGZkkybHh1cVlTbnRHcncvaGVZZk4wby95emJnc2RkaEpvaEtuajVlQlVIcnJzOTRqMjA1L0Q4M2pqTGxTaVlxaTVHS3JMT1VrSlR5YU5HZFF2MTEyU1AvNTlkK21GMVFuSjNNVUZOV25tOFFEd3lRR3VQTUxjV1UzWnhpcHVudVE2VlI2WE0wUlBsUXVINGlSOHphazl6YzhPSExIbkZuYlg5QTBUZjRJY3BleGxWOHczYzBzNGpVTVg2SDd1eC9KNi92NmlIMzU0ZW5qZmJMc0d0Ni9ZZ29VbHJPODdlUUhoR29IbEl6SDcvZ24rZjkvVWo2VGJsMXZYY0xLdHFPekVJVmJ5SDBmSCs1K3ZvbnJyL3dDL1NidjFnUDFYT0d2YVZ4NW5lTXVSZUUrWHVWN095NjVNTWJOaktLUjRjVE9XUVIyci93QW5sQktqQkpDbmgyVktrZDkvU2J5VmxhWnFjN0RrSkdIcWlxSTJJZG52dWNSaFFwK0xUcTdBcWt3dFNwV1ZpQlo1QUFON0g5QllQaFhuQ0h1UTRpNFE1YTRPNU01dTVOZkFRYmpubG82bnJVYVA4dVVvcEtJRm1ZS0Q0eGwrZ1hZZ0ZqNGpzajFidDRBOXpIdCs5d3I4ZzErQXQ1dys5MXRQelExdlk0NmNoa1hFNUlRckthM3lkZUxrSzQ3OFNRQ0dYdnRTQjVQdnRROXBQdkEvVkU1dXhmSG5ITnUvbkxWS0JpK1d6bDZaTVpxOUw1Qy94bzM3akd2bElTc01ROGlTVzYvbGd6NS8welAxclAwaGVmTlcycjIyYkxmazJ6TVhmNmZqTWhvMlRGbkg3TVEzN2ExcW5hVlladzUraEJPdmZaK3VpUWZWdlp3NkhaZlA4TlZVMElud2w5S21DUnl4UDVmTDllY2VYWFBydlU4KzFEN3pUVDFJZ0oxSmhNZk1ZUUlaMGZtSUx1cFBmbG54ZDM5K3ZITmJHN0xtTjR2MUxFdXBaS2pCak1sWGhxQ1pMTU00YUIxbFVkdXlxNWdrSFhYZ1N6ZDlkK2h5MUhpTGVNOXQzRVVtdTdMWDNyTjM4ZjhBMHpZYkdTb3BYdFJVdko3RUg1RFNlU08wWWxFa2ZZRE1WWWROOStvYzluM09mNnpuTU80NXJZLzFMZmF0d2x4THhIVXdsV3pTeFZhckhGbDJtaW4rS2UwOUg4dWR6RklzalNTQ1VoVldJQ0tNK1I5Rkg3bDkyeFhIK3Q1TEwyOHZSeHZKR3ozNldPeHRZc0hvMVpHbVJJb0hkekgrUEU3aVFpVU9pcEdHSkk3SWFDc3g1VW5KU3VHaVFsSWlLSjNoblduek55d1lwNVBwNlkzV1V1b2FvZEFocWpza0pTZk1vT3dBMGpVTjJBODRMaHl3NXhrZC93Q1g2bW5haGtLc25JVzc2SmNubzVXdnF1UkdEVmJGL1lMSGhCM0hISXBTc0tzTWg3OHlPcGJwZFZZSUZDNGRZdytPeDFHaGlhVkt4UnZ5VDE3eHI1Q3k4a0Znb0Y4cFVhUmVvNWhGQ3FoL3MrTERzTUZKOWMzK1A5ejVhMTdSTUR0MlpTNVd3MUVKQUtGdWFVM3NqOHBhV3czZnh4Qnkva3Y3RlVJZjJnZUpCOVRCcXRQS2ZGWHJVYmJRN0RSaWI4cUNLUU9IQ3pzc2JCa1ZldnY0d0c3S3VxL1pIZmw2cWJKK1drMFdRRUZSZFhQL0FON2Q4U0puN01DNmpNS2xvTm9hVkVrQmlDcTRjRUFiRGE1SHpFV09OeHcrZGp0UzA3RkxMSFdjcGRZdlBVakgvVFhiS1JEeFZTNFNKR21qbnNlSDJzZ01DOUVrQStzaGpNcVlLTlRCWS9JYkRMckV5SXNsTElOV2xucnVGK1FnQU1HZndMdiswRUh3RVpCY1JueHdsS09rK1JzUXBpTCtPbXN6MklwSTY4NmlPN1NLR1FSbUpnR2J4a1Jpb0xPdzhsSzk5a2V1NWF4ZFc1aThUTGRweDVYS1JSZlFobFdDU0VSUDBzYUZTM1hZY01BRlh4RGtlSlh2MW5RMG9WRUpKYi9QMjdrNFY5VGlMU0RDVUE0RDlyV2NjNytndmdkUDAwZHUyblN1SHVQL0FHdSs1cXpvTWZMK3ZYTGVXNDJxejVDdnNscU9hcEliaytOdjJhWk0wRjZtakxQR2ZQOEF6S2t3Nlp2aGNlbmk3dGhNSHpabU1QcytwVzhiSGRnbXJUV0xScnY0U0ZPMGtWNVVZTVVWR1llREFqc0RzSHJyMVVJOXF2TEZEMmFjMWUxMnZ5SGs5ZDFyUTkxdEdqcXV6NlBvTUZ2RGJLb2lrTmNZL0x1eTNJVWprblF4MWJFSzNZdm5rZ2I4aXZOR1Jiazl2ZWIwK2ZENXk0bWR1UlZiQk9XbG8yR2FLWVRzRkROSEV3Vi94dms3Nlhza0UrRC9BTGdDWncrSVhKa1dGVVRVSUkvRGp1cFJBT2txS2lGRURnT0dJY3NlYjJxL0pNOU5RSmFLWTZsR05CV29KSmRSMHFJTEtLbktqMlVmWThFODIvNmhxdXc1dk41YkJ5WXEzZzRtRDNyTnB2bGEyMFVmaXhRcW5mWGlXWG9ueDZIOXV2VkR6OVFEUjhqN2dxWEorNVpOTVRYeldUekYvUFFMSkVpelY0SThrOEVMeHhwMTVwTEg5Rnl2WUNwOWtkZDM3ZVI3ZU8wWGozYWQrcTVTdlBobnh0cW5QWHJ3c3FSeVRFUitTb0NmUHJyL0FFOWRudnIvQUk5VTEvY0o3Zk5pMHpBN2p5M29HejByMzUycHlpdlgvQ1g4dW5ITlBBenhTUkFncisxRThldm9NdlhnQ2UvVzUrRnFhVFRxZ3VhMWFGa3BDWEZqZmJzTi93Qk1Na3dsenRIaVFGUXpFUUdEbmNhUmNNM3QrMklBOW1Ydm0zSGFPR3VMdlpudjlYT2JYSG5Oa3pIRnE3UlBaL0hlSlk2VWN1SWh0d01wRWl6UXpUdzlsbFpmaEhZYjc5WmY5SlBudTdyeXR4RmxZMXJSNjdsMnEzbm5zcXhqbVcxSkg0Q01nc1BGWWxCNi93RDFBSDM2VkZ4anQ5YlR0MDVMb1dJc25EZHcyMTZieW5RZDRWaGVDeGk3NlY4aC9sZy9TZmpaU2QvL0FCQWY5ajZteWhuNHZZVCtvdnpIby9JT0NqdGFuZjJDZlAxckVVcnNEUXNrMllTU2UySStPWDc2L2NXQUhZSFo5WHptYklVbE1RWnVUbElZQzR5QkZTa2NxU2ZNUmZzc0JoL1RHNTZOZFc1MkRHbDAxbGV1WGhSRndGS0xPRXhVQVF3bzhzcUdmTWU0dmk3cnZIdkhqL3dyUnJhQmpucldydGJxQ3hQMzJRcDY3V0VEdFByL0FQTCtPeDlIMEV1MGNDN0w3aCtSOWI0NzVMcldzNVd6TTNubHFMUDM4dGNBdTZ5eUE5S1NnWWZYK2s5ZmYyQjZFcm1MMzZjYjZ6eGppYzdvRjZISzVMSVZ3dEdHbFBFYS9rOFlNdlVoSUhTZ2tzMzMyU1YvbjAyZjlNTGs3ajNuRElZZmM4TFNudTJCVWpzNWZKUjl2RERabEtJc1NNZWlENUs1Q243OFFHSUE2N2lXZXkvUFVTVisyb2dsRGtqVWR3ZjI5TVZqVTZwVDh0MFNhaTBxR25XVUtjL01vNnJKZFJPMTlnN250aUsvZm5uZE0vU0E5cDJ4Ylo3ZHVLOVlrelVXSnhXS3E2eGlvMlJyRngvS0pMa3hoSHlDR0ZSSThqbi9BRkZRdllMOSt1SDlERDMwY2krL0Rockw0M255TFQxMlJRMS9GWTJBZU1zN1ZwbFlUcEhJelAxKzBnTVQvd0NENm5mM1krMzdsT1AzSFQ4c2FSbWFWcEpyTHcxWWN1MGMwRnhDQ1RES2tuUStCZ3JMNWZYWFgyZnZ2MFFmNmRXbDR2Yzhua2VYY0Z4dnhweERoSzEyY1QxOEZIQ2syWHVxcFh4Wll5UkRYWHN0NGcvdkpCUDhlaXlRck5HbU1zeElNUlAvQUpKVTVpRW5VUzN5MzNHRVpYcVhLeTJWSWxYaXpxWmhFU1hRTklTaEtvVXhyQlNidXMrVktvZmxzeEw2UU1aM243bVI4VHlqeWx0T3laakVZM0U0ckIxcXRIWG5zTFZ1M3JJZ21zV0lZTEVwRVljMTJhVHo3QUN4djM5cjJVQ0RKYlR6ZHl4bU9XZVc4akhzbWFOKy9pNkdScXp5bXZGaWlQOEFwSzhpK0NNWFVmdGFaa0JJQkhZQ3FSdVB2MzVsMmJiL0FIaSs0elExdkovZytISlVFeCtXclJxWkVnU0tKcHF6aGo5Ukl6eE01VG90OStZWmV2V1U0M29Xa3I0UmZpamh5elRyNEZwb1hNaFVranpoa0k4MmR2SUVEcnNBa2VYa2V5UElHU0VVcVZOV2lFS2pSd0NEMlNSeGZsN3NINzRqcnFQbW1KcCs1WlZPaEtVd3dzbElld0IwaXp0cUFKSnVTQnhnZ2RWeFdIcFVzdmN2TFZ5K0tGbjhpUkg2K1g0NUlTMHJDU0pTUE1TTDJBemxYOGVpb0xIdVVZcVZlN0pRc1lpYjRjdVlETlRranJ5VkpKVlJtTEZGN1Z2KzFaT2grM3NzZkhvOWV0UXF0ajVlMG1SOGI4K1BZRjRaMytKSXk3SzhxTTBoZENZcFZJQmJ4NllkSHIrTmpnb1daSjY5ZDB5VVpvUE44RWRxRHlMTXlkZklrNElKVHgrLzdrZEZlK3ZvNWtWYk9TZC84L3ZoVlRDZ21HQ3poMkhHM2Ztd3htTFZxU2F0TVpWclc2bGlZdFBIK0l5TEl4Y3QwekU5S2VoMEdVQmdQNUk3OGh3VW9uaHlOUmNic0Y2amVsa2lTdllwMkU4REo4WmY0NUNGSitSU2djSzNSYnB2SHNrZzhNdXdXSkhzeTJNVmpueXpTS0RDSy9uNU1pcWZLTi90ZlB0SFVJZXUvTXFBVDAzcjltYXVNR1F5UVNrYkZDUWVETFhIVFNTSVAya0h0V1YzOGtqTVpIa0NDVkIreU1HV0kxcEJ0K3YrZnZnRXFrWlFVcGFTQzF1M2NZODdyamYzWmNoOGY0U2ZTdGx4T3E4dzZTMUtlakJpOW9obHN0aUVhTUlrdU9zTElzMU9lRXBISkRMRXdNYnhqeCtpeXN3UDIvZnFaOG04SzhXMGF2Q251SjN2Vk9aczVsZ3VlcDVYSFIzRmtuK1UvSGtZY25rTFRSUk5JaENUcjRJcitiK1laZnRVcXU0TG55Y25waWZFZ2Y2di9yMTNVVnF6TjFYcnp6ZUt5ZWNxOXF2MS9aRDlINlBYMzMzNjZQVm5wM1NwNUxSb1F1UW9oZ3hQcUM0OWVEdGZCcEpaNHFFRkhocVdWQURTSE53QndGYnR2WXVQVEZwdm12OEFYTDVwMTNBY2U0NjVwVi9XYTk2QUpzVmFDMVhseCtTOEFQS3ppa1NNUnhRU3llYk5HWkxFYU9XRWJnZEw2RGJrUDlUM0RjbFlaRGdNMWtlUE1yZmpXUEpWWkYrV09aU3BCalUvdFZFVWhlbEJib3V4N0hwRjZaUE4xMStLTElXRWdFRTBJVHk4a2lqay93QmFxbjJFRGYzOFFQOEEvZldObU5xZU9PR0xvSiswZUNMMEdQOEFIZjhBeXg3L0FQdjBGVWo0ZU10U2pLaFFFcFVMdW5ZMzVCZkJVdnJKV2pEOEZNVHlrTTNQSElhL3JpWjhyemJ0MTdreUxkRXQxN1YwZmswdmlkQUk1cTA0ZU9XQmxIMTRNa3JyL3dBQWcveXZxMmQrcmI3WGNqN2cvYUp4anlkcE92NGlibGpYNkZTUXpTenhSejNhSnFoYkVIbTNYbS9TSVZCL254UFgyUVBWWlBnbjJXY3Q4ajUvU01sZHdOM0E0UzdMRGRpTmlFK2NsVVM5Zkt5ZGZzUnlqQlBMN2Zva0FqNzlYM2RWYkY1empDUFNNelZ4Tm1sTFRDS3RpUHBVSlFEeDYrdWgyZjRIcEpkZk05eTFMckZObWFVc0tYTDZuQTJZNlF4YjY0cjM0YitrVS9QVUdvbXV3Vm9nelJRQVRaVE1vbFFCdlowa0VpL0dQTzFnNVg1RHhXdVQ4ZlhjenNVT01yMkFaYWt0aHdJQ0I0TWdqSit1d0FPditQc2VueWZvdys4UGxiaGJrckEwUDZ4bDdQSDhza3Rpdld1V1grQzNQR1I0UXFxdDlzU1BINlh0ajB2a1BSTCs4ejlENStYUDhWOHBjSDdsaHFuSXM3TmJPTnNWL3dBZUcxSU9oOEprRE1DU0IySDZCK2gyT2lTRUdWOVQ5dzN0STVKeEd0OG82cnRuRm1aeHR6eWY4bW0wVEZTeWhwSW43SHpBb0NGS04wUXpkSDc5TUNjcnRCenZSSWtuS3FTSXF3NVNyNWdXM0E1dnlNQjh0bGV2NU5yV21mMVRNbXhTRkM2U2dsbVcvd0FwQTNCK2hiSHBoN1p0V0o1MDQyekVtVXo5VEZUckRQamhZRnRaSW9wYkVCSFk2UGl5Z0VmUzlnS0Q2eDNzeHllczhCY0laN1VNRG1LdFBjbHVuOXN0c0dDYjlqTXJKSjJUNGxVQkJQOEFBUGYrL3FteDdWdjFMTVpvbkFtVjBMazdMM3J0bkk1Zkwxc2RWVzNMVmpyMTBweUN0S3JxV0tyODBoTXZrVDVnZlJIajlrMSttbHpuN3ZmZGZ5enVPaWNKNDdJNzNyZGF0K05ObWJVQWlyWXBGamppZ1czUDE0aU1SL0lRRkFkdmticEF4K29hekIwR3JGT2xacGNhSWxFR0dmbU5nb2JXL3dDTU42V3ExR25LWWFRbU1Vd2xxU3NJSUFDZE4yVVhmVGNtOXRtdmlTK2E5dGx5UHVYNWt0WlM3VFhhY250RWxueXJXZzFlSW9QOU1hK1BjY3BEQXN2WlJpQUIwUjBTMjQyMzIwTUxWdUdkSWE5ZVFOSExHWENxUzdBQXNEOWs5L1k3N0FYNjc2OVpIM0dmcFpjZ2F6TC9BSTc0bzJDUGIzUVdMRi9EM0lVcDNJcnl1Zm5hQ3dENFNNN2drK1hnVDJEOWx1dlFUYXp0R2YwckkzOU01R3dld1liS21FTmFwNWFxYWxudjdTTXJISXIrWGpKK08zZllEQVAwUVNTWHJTSXRQbnFWQ2hTTVFLVWhLUVJ6c3hMSGo5TVJQMUhsYW5DcmNlb3hvYlFJaWpvSXVsdGhjYzIydzJKTC93RFVxOXZJVktFRW1Ra3FPWXBHaTdlV0lMRktZbVhwSTV2RStRQUI3QVluNjhmVWhSNC9HMktFVm5IU1dZZGZ0VFRreENGWW5ybzZzcmZIMFN5Zkc1WStQVEJXOGg5ZGVnejR0NUNsdHRacDNwc21GdTEzaHJXb0xkWnZuYnBwR2lNY244U3IwV1ZnQ3hBWUVuNlZpd3dja2xmRldjUkxQOGNUU1MycWN4SUVSa2tBUXh0MmZGQzMyQTNSUnZvTVFlbUlMUFN5b0xwSjIrdHNBMDlPd1loYlNQZHIvd0RIT01ya2J1WFVYSnJVTFdQa1pZcktTUjlQREtxQUVrbjlvWStMbnZwUU94NUQrL3I1c3RaanFmOEFRL2h4MUxEd1JTRjBDQzRpK0FmeFZoMThnQlhvQmV2NUI3SDM2KzVMZVFzL2czOGJRZWN4M0luVTFHOEhicDQrdnRCMkdEb2UxTEg2WWdrajZPdk5rSzY1RzFYb1hiTUZPMVlTM1NFSkpab244RVpDRkxxNVV4a2R4cXJMME8rK2dCaXljSkppQThuNi93Q0g5c0wzTUE4S0FvUFk3YkQvQUw5UGZIbWRLekYvL2pjRWZmUS90NjdDMlpmSHhkMklBNjdQMnlqcitBZjl2djFqWGY4QTByMTE5ZC9mOGowYjNzcjlpZkwzdlUyNjFRMUN0TmdlUE1jeW5QYkxQQXoxOGVwL2lLSlIwWnJMQS90aUgvbGlvKy9YVDNNRmZrcVZLS25wOVlSRFJ1VCtnSGNuZ1lMTXRaWm5xeE93NmRUWVppUm9oWUFmdWRnQnlTd0EzeEEzRG5DbksvdUMzS3JvSEVlbVpqZHRta1Q1R2lxUmZzclJCZ0ROUElmMnh4Z2tBc3hBN0lBN0o2OVc3UFlGK2xsN1krQk5LT1k1ZDEzRzg0ZTRDZWxKZHVYTGtKYkhhK0k1MFI0S0VKNzdaU0Q1V0hIbTMvYjRxZWpQL3Q5OXBQR0hzaDl2NXcyaDFJQmxMdVJxUlp2Tk02eVhzellOaEkySHlCZWdzYU8zZ2g2VUZtSTc3N0pUWjNIWCtKOWwxV0xJR083WnI3cGN3cndxZm80ekk5TkdabVQ3WmhJTysvNEhYMTZnVHFsMXduc3c2NVNtS01LVkJzeFpTMi9tYlllbjlYeDFjNkUvQ2ZUS0hMdzUrcWtScWlTb3BINUVGQWNoTnJrRXBCVWRpYk56c21tZTIzVU53ZllOaDFzNHpGYldvUXkxbGZzTkZDZ1ZIWHYvQUZEeENEOXYxMzM2anpLNHJjOFphdFZUUXQzSzBaZnBva1BpNEIva2VQOEFIUkhmb2pyQ1pMaVRrREhiUGdhOGNsTDVGSGFLQkZNekUrY0JIL1lHOGdRT3Yya2RmZlhYb3paZVA4YnVPb2F4eTFvbFd2a3NOWVlXSksvWFJiNzZrakkvczZrRUVIL2IxR3VaNXFicDAySmhaMXcxN1BmU1J4NmVtSC9NOVMxVXFJbU5NZ1JKZVA4QUlUYlN0cnBKN2xyRStyN1lXOXhMSnRGeS9UZ2trbWpvdklwSWttQWFQdjhBdVFmdi9mOEE4LzhBSG8wdHU5dDJoODFZTzN4MXlMeC9ndVVzRmVybUw4ZS9qMHNJb0krdkJtSGxHZS92eVVxUi9ZK2pCeHZET20vMGVwdGxQWHFkb1NMM01rdGNCLzhBa04xL2NkZlhvdGRJV0czckt2aWNmWHg4MExlQVZJMSt2OSsvN2oxbVN1Y1V4Tk1TRWtwV0xndnQ3WW0vcWoxMmh6S3ZIa29ERDVTQ1F3UHJaemhQSENQNkEvNmExbUxHV09TZmF2cmVjeUZLeUxDMTVNemtXclNQNC9RbFFUQU92MzlvZjJrL3ozNmRCeHR3VHc5d1RwOWZRT0V1Tk5FNHMwcXYwVngyQ3hzVk9Fc0IxNXVFQTgzNi93QzlpVy81OWRyVWIyZGU5WWdzcUkxRGtrbnI5MzJmN2VwSnNocTJPczJwNUVSUXJNU2Zyb2RmejYrckdiSjJkbDlNNUdYRUFmNWxFZ2V6NGk3TlZVbVptZVZGaXFEcWF3MitnMnd0dE50eGVaNUk1dXdVOFU3dGg5MmJEc3F1Q0crZkgxckhrQTMwQ1BsNzYrKy8vdjBPbkp1aDhDN0xRYlN1ZGRMeDJVMFczUExYeG1UYTMxa01CZUV2azhVRmdMOGtjUDhBcGtDOWxCMzEwUjlEV2ZiYmxzN3RmSVB2bzNlUlBrb1hPZEdyVVhkUE5SV3JVS05VbFIzOS9ha2RuNjc5RXR1M0hsN2ZjRG5NZmw4ZmtsZGJyUXVHK01LMGtmOEFvbFIvcng4a1BpZXY0SUhvb2d2S0dINGFtWUp1RGQyR3h4UzAzUnBLWGpmZHRTSDRXbUdGaDdnNkV1UURad28vdHpoT2ZQUDZlTy9jVXhXdGk0VGt0OHE2SDR5eXkxSUhJek9Oak1ZY1NOWEFJdEtHSGw4a0g3Z0hIK1dBRDZHL1MrWGN0SmRwWTJZbUt3TzQ0WllWK0NaSk8rL0daZTE2UFpZZUxmVE14VnVpVjZkNXBuSVdVNDN1WXpqN2R2a3JZaUozR0R5ZzgzYUVnK1BoWmticzlmZlFKK2gxMy9iMW0rWWZhVndyN2pwMnlHejBJTlY1SWo4b2Y4UVlvTEZZK1J1aVB5RTYrT3duWUJEUDAzOEVPUFJsUytvcFNrUWFtalVEc3NiL0FGNytwR0pzNnEvRC9NU3hNZWxLQUI4dy9sVU80TjI5UndiZXBWTGc5N3NaR05QNmhscEtyR2FKWnBKbGtoRktiN0t1V1VBZ0ZpRDVEb3FWKzE2UFprMjFacExYcTNseVlGaXRabFpvUURIRkhJT3UvSTlkUU41SS93REhqMzlIK0NUNkcva0xqYmV2YnR2V2QwRGtGYXR1TkYvTnFYS3p0TFV5OWI1SFVTd1NOOWdyMHF1amdsQ3JxU1FCNjJ5dHVTNUxHVFZ4VXM0eGJBK2Q1SSs1RTdjRStUbm9yL0tnZEFBcjlmeDM2UG9jb21OcFhMRUZKdTltSVBibkVYMXlaank2WWt2T2tpTW5nOS83TjY5bngvL1pcIixcbiAgXCIvOWovNEFBUVNrWkpSZ0FCQVFFQVNBQklBQUQvMndCREFBUURBd01EQWdRREF3TUVCQVFGQmdvR0JnVUZCZ3dJQ1FjS0Rnd1BEZzRNRFEwUEVSWVREeEFWRVEwTkV4b1RGUmNZR1JrWkR4SWJIUnNZSFJZWUdSai8yd0JEQVFRRUJBWUZCZ3NHQmdzWUVBMFFHQmdZR0JnWUdCZ1lHQmdZR0JnWUdCZ1lHQmdZR0JnWUdCZ1lHQmdZR0JnWUdCZ1lHQmdZR0JnWUdCZ1lHQmdZR0JqL3dBQVJDQUNBQUlBREFTSUFBaEVCQXhFQi84UUFIUUFBQVFRREFRRUFBQUFBQUFBQUFBQUFCZ1FGQndnQUF3a0NBZi9FQUQ4UUFBRURBd0lFQXdVR0JBVURCUUFBQUFFQ0F3UUFCUkVHSVFjU01VRVRJbEVqTW1GeGdRZ1VGWkdoc1VKU1l2QWtNME55d1JhQzRXT1NzdEh4LzhRQUdnRUFBZ01CQVFBQUFBQUFBQUFBQUFBQUFBVUJBZ1FEQnYvRUFDNFJBQUlDQVFNQ0F3Y0VBd0FBQUFBQUFBQUJBZ01SQkNFeEVrRUZFMUVpWVhHQmthR3hGVEl6UW9MQjhQL2FBQXdEQVFBQ0VRTVJBRDhBdjlXVmxaUUJsTmVvOVFXelN1bEorb3J3K0dJTUZsVDdxKytCMkhxU2NBRHVTS2RPZ3FtSDJ2ZUxBblhwcmhwWjVBTWFDcE1pNXJTb1lXOWpLR2o4RUE4eCtKSDh0UTNnbExKQTJ2dFpUTmZjUWJwcWU2dG9EazE0cURYVU5JR0VvUVA5cVFCbnZnbnZRbWJlMnRzdW9rdlJHZ1NDdEN5QVQ2SkhjL3RYMUNVUm1FeVorY09EbWJZQndwd2Z6SCtWUDZudDYwamxUM1pDOHVyQ1NCZ0JPeVVqMEE3Vnp3WEZxWkNHVWNpWEZyd2ZlZFZ6RS9ITkpWeVNUZ2tFSHAycENYenlnWnp2MXBPWHNqZFFOR0NWaE1YcWZIVTlQVTcxOFZMS2xFQWdKNlUyZU1jZTlzZXhGZVZQN2JFRDFUVjRnRUZ2bHRyVVlVbkNrTys3dnVrMGlrcGNpeTF0ckc0NkVkeDJOTkNaS2tMNWtxd29FWVBwVDFNZSsrMnhxY25BS2RsRCsvNzNydlc4QXBHdER3MkFWdFZwZnMrUjBhZTRidVg2UzB0UnVjeFQrRWtic3gvS0FQbW91MVZGaGExcUNHa2xiaE9BRTlWSHQrdFhZc09oSGJscFcyNkdnWGI4SmZidDVnaVl5MFhQQ2M1T1p4enFNK1pQci9FYUx2MnNsWWM0OVhBRVhMUlZwMUQ5cG1QckNYcU5EdHR1MStSY0pnbE1sajdoSFFDb3RMSk9GbFJTMmhLazdEZklvNzBaOW9uaUZmZnRBczZjbjJ1MkN3enJtK3l5RXNMYld6RlFoYS9GTGg2bEtVY3h5TWRSdDFwaHVIQkhqM1lGWnRkd3NHckl3emhKY0REcEh4UzRCdjhBSlJvT3VOOTFicEtVazZ5NGVYK3lMUUNQdkxUUytUQjJPRmp5NFA4QXVwVEt5Nyt5VC83NW5wLzAzdysvK0d4cC9LWDI5bC9rNkIxbFpYeFNnbEpVVGdEdWFZbmtnQTR5OFNZZkMzaFJjTlJ1TGJWT1VQdTl2WVdmODJRb0hsMjdoTzZqOEUvR3VabHd1THFaNzkzdkxwbTNhVzRaSGh2SG13cFo1aTY1NmtrNUNQcWRzQXl6OXByakFuVzNGSmJOdmZEOXJ0UE5HdHpYVkJWbnp5VkR1VkVEbEg4cVFUMTNyeTdKY1d0VGkzRkxXb2txVXBYTVZIcmsrdnpxbkxMSkMrUk5la1NGUFBPS2RjWHVWTE9TVFNaVGl6a2RGYkhIZjhxVEprRnQ0ckFTVDZIdlhzUjdndEhqeDRqaFE3bkMwam1QWCsrdFdST1Q0dVNsRzZsQVoyMzJyd3Q4alk3SzcxNlhhN3FyQ1JFZUhYQktSayt1NXJTYlZjUnpuazVTZ2N5dVlweUJnL0hmcFJnako5VThyQVZuSTlNMXFMeFZ1a2orKzFKQWR1WHhDQjJGZlFyQ0FrOUFOaWFzaVJVWGZLQ045OGp0VHJaWkhpRjJBczVTOGs0ejJQOEFmN1VQODJlK3hyY3crV1gyM1VrOHlDQ0tsRUVpY0s3WCtMOFdMU3k2a2xtTTRacjNRZVZrYy82cUNSOWF0amFMdzVFMS9wUkwwbGJTbkpEOCtRb0gvVFEwb2tIK25LMERIeHFCZUExcmJWZGIxZjFKQlNmRGlza3A2QSswV1FmbzJQclVtV2JWVm9lNDJYYUJOanlGT1I3WVljUjFwUkNXbG5EejZpQjE4b1pUdnNPcHFiSDFMQ0l6dVd1aGFnanlZTGNtSzZsNWhZeWx4QnlsUStCclhOdkxqakpiU1ZCS2hncFBRL1NvRjB2ckcvWGZoRzVlT0hFeTN6dkNlRDdxR0l2aUZ3S0FCQmIvQUlWSFk3RFBVYjdFenhibVgxYVdnVDcwMG1OTGRqTkxrTkpTUnl1cVFDVXBIWHFTTWRhVjRacmNWRmtoVUs4U2JUcVMrOEpyL1o5SXpXb2Q2bFExdFJYbmZkQ2lOeG50a1pTRDJKejJvcXJLWW1NNHozdTEzUzBYMlpiN3kwdUxQanVxYWtNU0FVclFzSEJDZ1IxcHFVNWpieFVaK2RkbUp1bU5OM0tXcVZjZFAydVcrb0FLZGtSRzNGSEhUSklKcEN2aC9vTmF1WnpSV25WRTl6YldTZjhBNDBFNU9OcmtrcDM1UW9kTTVyUXVlN2dZQ3lPZzgyd3E5UEhYaGxvRFYrcWJsZGVITnBlRGxsall2Y3F5TnBhaFIxcElBU0NQSXQ0QWtyU2xLdVVES3NIclUzVUZwRUp4YVdydkFtcEJ4eXlJYVFvZjl6ZVAycVV3eUFibHpYakttbG5HdzgxYUZYTWovVFB5NXE4M2R3Z0VOc05zbmJKYldTTmoxd1J0Vy9UdHBsWE53a3BLa0pHU1NCUkpxS3l5OElPVHdoT2JrTVk4SW4vdXJEYzhnK3lJUHpwK3UrbW5tTFd0OWh0SVcyT1lwQXh6Q2d4UzE5aGo0NXFJU1VsbEZySzNEWmpvTG1SdjRKUDFyMExsbFFCWk81NmxWTTQ4UTlWcStRRmJtOEVncUtqOHpWem1UZG9uaW9qUlhESzZSRC9pTG1xU1B1RVk5TUtUNWxxL3BHQjg5aFVnNlc4QTZHYjFhcVdvM2xkdnVEanltL2RkY2tqbHdlK3g1VWo1Vld1RjdTTzZqWXFJNm5yK2RURnB1OUNQd05iYVdvaHd2RkI3SHcwRXEvVlJINUdpSzMyS3kyV1VPWDJWT0lxTkphOE5sbFphaXlnV25YVnJJU0JrWjI3bmJZZkUxY25oYnhTdXVxT0tMdWs3elo0NjB0bDhSNThUbkRiU0c5d2c4MlFWRkpCeURuZmZhdVpkby9GSWVwWThxM05LVElaZnlFTEdCa0t6aFZkQWJieEIxWnArSnBMVks5TTNHK1JvOXFXbExrVm5LRXVPOHZpK0lodkt1Y2VHQnpjdTRQZXN1cXhDYWwyWTQwTkt2akt0cGRUVzJYajg3ZmN0dldWbGFwTWhpSkVkbFNYa01zdElMampqaXVWS0VnWkpKUFFBQW11NG5FVi8xQlp0TDZlbFgzVUZ4WXQ5dWlvNTNwRDZzSlNPZytKSk9BQU1ra2dBRTFHNllXc3VMdnRieCtJNlEwUXYzTGEycFRGenV5UDVuMWplSzBSL3BwOW9vZThVKzdYelNNQi9pdHFPUHhMMUl3NE5PeDNQRTB0WjMwNFR5aklGeGVRZmVkWDFhQi95MEVFZVpXUkxlTVVBTjFyc0Zsc21uV2JEYWJWRWgyeGxyd1c0YkxRUzBsR01GUEtOc0h2Njk2NXZmYWs0T1dqaFp4VFhjYmRka3lJVjZRdVZDdDYxa3VRTUt3c0tIUXRnbkRhdXZVSFBMazlNcWhmamY5bTdTWEd5Ukd1Tnp1MXp0RjBqdENPbVhFS1ZwVTJGRlFTcHRZeHNWRTVHRDg2QU9Wa0d4VE5RWElRN2F5dDBFKzFmS2ZLZ2R5VFV6V1BTTVMxMjVMVFl5b0FBcUkvV2krNTZQdHVscEx0bXNpeTVEaUtVeTI4UUVyZENTUnpxeHRsV00vV2tUZmtTRXFTUVFjNU5MYjczTjRYQTQwMUhTc2cvYzdDek10ejhSUjhOTGlDa3FHTWpJeFVLM3pSVjFzYjZpN0hXOUgvaGtNcEtrNCtJNnBOVDlNVzZwWHNrNEpBMzZVMUxZV3BZQ2trays4YXBWcUpWbmF6VEsxZThyeVlpbERtYldGakhZOUsxbHVRanVyYjYxTmQxME5acm1rdWVGNEQ1NlBOZVU1OVRqclFOZHRHWHUwclV0aEF1TWNkMng1eDlPOWJhOVhDZTNBdnQwVmxlL0tCZUkrK0pLRWhLQWtuQno2VWYyT2FpUGVVMng5cGJVV1N6RmV3c25sSkNnSENNOWlEazQycHk0ZEhTaXJxeTNmdEh6blpUYXVaTHJES2xwQjdjN1p3UHJuSHdwejRsYWt0Vnp1c0NQYVlLMm8xdmNVcVM0ODJFTFdsUUNTQU55RWdIUHgrbGFJeldURTR5OUR4R3N0eXRmMmg1RnF1aWt0S2t5VUZhbCtkTGpidktRdE9Pb0tWQlErRlhZTjRSRFN6SGl0TnBqeGtobHN0SklRZVh5bkhiR1FhZ004TEozRUhYOERVT21iaXhDa1BXQ0U2bFR2TThoRWhQT3lySVNDb0QySU93T01qNFUrTXhmdEw2SERWcmN0bGsxTkNaSExpRXBEam5LVDFQS1VPZXZWSk5MTmJmR0VzT1NYeGVQdTlqYlNzeHkwWDdxSitLY2wzV2VxTFZ3YXRqcXdpNkorLzZoZWFPREh0YUZETFpQWlQ2d0doL1Q0aDdVZDZ5MVphZEQ2SHVPcUwyNnBFT0UwWENsQXl0MVhSRGFCM1dwUkNVanVTS0dlRStsYnJhckxQMVpxMXBLZFhhbWVFKzZKQnlJcWNZWWlKUDhyTGVFL0ZSV2U5TXpDSDdETFVlTzJ3dzBocHB0SVFoQ0JoS1FCZ0FBZEFCV3lzcktBTXByMUhBbjNUU0Z6dHRxbmZjWnNtSzR5eEs1ZWJ3bHFTUUZZK0JOT2xaUUJ6S3ZhdFVhUjF2TDA1ZTFNejNZVGhia3BpZ3VjaEd4UE5qQnhUMURhZzNtM3BudzVMVDdLeGpuYlVGQUgwMjZHcEU0NTZlZHMvRVcvdHhuQklhblB1U1pMWkJUcytrS0dEMlVNSGVvUDBIWXBXbXI3TFVKaGNpU1VrcmJLT1ZJSTkxUUdjWitOS3JZUnc4Y29jYWF5ZTIyd1IzU0N6YjRoZldqbVNqdU90QkQrcTdZM0xLSG0zbXo2bFBXak8rWFlvUXR0ckJWbitMcFE3RGl4NzNmekVtUENLRUpKUUhFSmJEaEFPM01vWTNJL1d1RlB0N0cyeTF3VGFFaU5RV1Y5UVNsenFNamJGR3VtdEZ5ZFR5VzAyeGhMb1dmOHpPeWZYTlE5Yi9BTVNYY3BhYmxiNGJpR1RnSURISXNuUHVnakh4N2RxbnJoRGN2dys3dEpndXpXVXVrQmNiT1JrOXozSXFMNHFzNXd1bFlzamp4QzBNeHBiVElqUTIxK0lsa2wxOU94V3M5RDhoVUJXL1FNM1Y3emx2Y2xQS3V6M016SFFWQUZ6bXhzckpCSXgvZTFYdzRsVzZFM29mN3hMQ1ZCeHNxV3BROTNsVG1xMmFUMHd1MWF3aWF4VTJ1UkFoT0dlK3ZQTmdjd0NVcStaVWhQMXFOTmU0UmJPZGxQblNqRmR6NW8yeGFsbWFiVnBpN2NQWXVxQnBwMStLOU9oS2RFbEJTNWhmaE9OTENpZ0hDc3BDc0ZYVEJvaDBKeEMwM0gxY0k5NFRyVlRTUTR5aUpjcHFiaDkyUHVvUTJsOXNIenFBSG1HVWdmRW1qYTQ2OTFTdXdXcTkySitOQWtYTmhVYVMyeTJQYStFdkFVRWdnRHlxNVNyK2tkNlJhS3ZrRk4wdWlicHcyYTFiTWpJRGtsNHQrTzYwSENDZ3FKR3dBYkFUamNiOU1tdFVkVkNXZXJ2NnJZNldlRVhwWWdsbFB0SlorbWY5RTE3Y1d1T2hHUTlvN1E4cmNibHU0WGdEOGxJakpQeThSZjhBUlV4VXdhSjBoYWRDYUV0MmxiTWhYM1dFMXkrSTRjcmVXVHpMZFdlNjFLS2xFK3BwL3BvZWVNckt5c29BeXNPd3JLOHFPS0FLc2ZhRGd1c2NUMXlNZXpseEdsNzlEeTVUL3dBVkRsemhOUWJFeStubEMzMWtFbjBIL21ySmZhTHQ2bm9sam5OTmN5eXR5S1NQanlxU1B6eit0Vm0xQ3N2eTBRV3p6b1k5bW5IUW5PNStHVC94U2U5WW14eG9tcHhpQ3pyUmZmNVZnSG1HNEgvM1hwaUMwTUpVbm5TY0ozM29uZzZQdmM2S1g0Y2Z4RGtnRG9hWTRiaVhKTHpha3FTdEt5Q2dqZEpHeC9XczJXbmxEUnhVaFRDczhjeTBudzJ4bFhVanRVMzhOOU0yZVBjVzVzaHhrckl4eU40eGlvZllKYmFBQndUMzcwVzZRdWtxTE5MaUhGSEtTbmxIcnNhNFd0c2pvV053MjQ5NmpTbXdScmF5NTBiSVVoSi9mSDdVaTBqYW85bjRhSWc2cGxtRTdkSWFsdlExSnk2K2gxeElhU0U5dVVORlhxT1lVUWFZMGhKMUhyaHUrWFpBY1F5b2NpSEU1U01kUG5TWGlaY0gwOFlwQ2JPOUdLNGpMTENRcFlVVUtDQVQ1VDM4dy9LclV3bE9PRWNsZEN1eFo3Q2ppN0xzY2ZVOEdCWm1ZOFdOQmdKOFJ0bElRbHRTdk1SZ2VnQTJwaCt6NWMvdTBXNFhoODhybDhsTGs3N2V6SGthSC90VG42MUUycWJ4Y1pkNmxhZlBQSWNtSlVoK1V5dm5jQlVjSzVFOUZrY3d5QWNqY0hGU3BwQ3p5b0NtR21XK1ZxT2hMS0Vqc0VnQWZ0Vzk1VXVETlpoVXRON3Y2K3BjYXNyS3pwVGNSR1VJYXk0ajZlMFkyRzV6NGVscUI1WXpTaHpkTWptSjkzUHhxUGVLbkhGaXgrTFp0TVB0cmxKVjRic3pPUWhXY0ZLUFU5Zk4rWHJWUjlUNnptM2E2eUpjcVFwMXhEaENsTHprbnpFNXozMnJuS2ZvQmNOUDJnckZjSXpDTFZDY0VsNVBNZkdVQ2x2NEhIVTllbEdHbjlmUjcxcDFtZVdncGJpbElBYVVNS0krWjJybnphTHpJaktRUTc3VnRyQ2lvL3hLM1A2WUgwcVhPSFhFcFZwZ05RWEZBbENpRWxXL0tTT20vd0M5RVpaMlp6c2pKY0VyY2E5Y1crZHBOdUxIWVVKY1NZM0l3dFFPRStZSE9PbWNnYjFYQlYydGlIaThybVM1dVZvV04vOEF6VHZ4STFzNStMWGVJZ0lXTDdjR2tnZGNNTmpKR1R2am1JL0tnKzVmZFpNU09ua1VVaFB2TmtCd1k3Ym5lc0dxZ3V2STE4TWxMcHgzRE8wY1pHTFpFVkhpV1pib2JKQVVzOGlTY2JaelFRbVU0dVlxVWhzRmJ5eTRzanVTY245NmJsdTI0cExmM081b3p1cjJXU2Z5clloOURHQ2xtVGtaQ1ZMUmpBOUNNMWpsRkpEZHVjZVVIRmtFV2ZJYlpmeXJtVUU0VFJwYUlURU85SmpNNFBLb0hsSXlUOHo2VUo2UmpRN28zenQ1YWtOc3EzVjBLZ2ZLVCs1K1ZFYmw4aU1YSlRyYXh5bzJjZHhqblBUTlpXbTJSS2V4WWpSaTJZMXFTdVMybUtDcnpFdVo4aWVoVWRzZVhmSFlWVzNYbWhOWXZYUys2bG1XU1RJWmt5WFpCbXczRXk0NmdwUlVsVGEwRFpQTGdiOU1iMU4vRE5UK3Q3TmNDcHB3UXhHWEhiUXJ5cVhsSlNkODdaRzJjN1pvV3ZHZ2I1cGk0SC9vclYwbXp5SEI0alVPWTZ0dHA0ZWlYRTdIMHdwSngzcXlUakRMVzNxYS9DNVFWMG4xWWtsdzAybXZsdXZveUNyWmRIbUxuWm8xc2h0UkhMUWtPUHNvWVFHU3RTTVlTUm5tVWNoYXlUa3JQYkZURFl0V1JYRkplOFB3WE9xMmowQitCOUtHYm5FNGdYM1ZwZTFkcGFGWmJnNk9YbmFRa1I1QlNUNXc0M2xKVXJxVDEzcjAzYUw2d3RTRHAxNlFVN0g3bzZoZWZrQ1FhMFdhcXlWbVZGOU95OWVEUkh3dlJXYWRRZHNWYmx0dk9OMjg0MzdMaEYzS2hUamp4VFRwMjJ1NmF0RW9vbk90L3dDSWVSbkxLVDBTRDJVZjBIenFROWVheGhhSjBnOWRwUnk2cjJjZG9kVnVFRWo2REdUOHFvSHF6VUVpNFhSNlRMa3V1cmtMS2k0bzU1bEU1d1RUdVVqd3FXUmt2dCtlY2VMaW5DZWQwS2NSOGM5YUgxeVdYSk1oaGJoeDk0V1RuMDVkcy9RbXZrNTlEcVhtOHFDRmdwSlBVSHQvKzBOaVV0Mlc4NFNFTE1aSUovOEFVU3JrUDdmclZVWDZSM2pUaSs0cFhOektmZlBYNGJaL2VsN2Q4VGJwamtoU2dGSlY3TnZPNnZsOEtaSUtVUjNWdnVLU3BETFoyeGpKSFRiMXp2U2FFbERzcFV1U3J5akxoeU1ZQXFwZHgyQ0V5cE54MVZGdUU5Wlc0cFBLMm5IdXA3L3JUM0NsczNIVHc1Q2wxYUZxUXRQY0VIRkI4U1F0MmVacjdoVDFLVTQzQ1FNOWZwVEZwNjdUWU55ZWtzdWtKY1VTVURjS1BVZlhiSDFybmJVNXgyTzJubXE1NzhFbVJqSlpXRUxTNzRZejVWSzZWOWx6bEVoS0FuYzROYW1wVDBtTW1Td3RMd1drS1Nyb1NEME5lVk15M0hmRmRRRUhzRURmNTVwWktPNDQ2c3JZZHJUY1hMWkVVbExwRHpneHloWFk5ejZVdWlMZm56MElkS3NLSUlTRGtmWDFwaFlZNWlmSVVnYjVPK2FMTkx0ZURmR0hGQkpBVU1aM0lxa3RrVEd2MUxwY0lyUCtCY1BVT3VwQ1M0a0w1UnR2ai9uYWpCNkxhYnZiUkF1VVppWWs5VUxSa0FucmowK1lvWHN0MGp0YVJnUjBaOGpRZFZnNEdlZ0JwVnBTWUx2cUthKzI0Rk1RY041RzRVNHZjNFB3R0I5YWJhT0s4bEo5eEhxYkpLOXVMdzBCZW9kUGFuMGxLbFRkTWhkN3NyYXN2MjVmbmVqakFPd09mRVRnNUdQTjgrdElkTDN6UnVwRDRrRjFFR1dycXlvK1VuNFo2VkllbWJ1bTU4VDlWc3RFRnFNSXpPeC9qU2xYTnQ5ZjBvVzRqY0VvZW81Ym1vZEl5a1dXL2UrcmxHR0pSL3JTUGRVZjV4OVFheVg2R2NINW1tZVBjUE5ONGpwdFpIeWZFVmg5cHJuL0FDWGY0OC9rLzlrPVwiLFxuICBcIi85ai80QUFRU2taSlJnQUJBUUVBU0FCSUFBRC80Z0tnU1VORFgxQlNUMFpKVEVVQUFRRUFBQUtRYkdOdGN3UXdBQUJ0Ym5SeVVrZENJRmhaV2lBSDNnQUZBQllBRmdBSkFDTmhZM053UVZCUVRBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQTl0WUFBUUFBQUFEVExXeGpiWE1BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUF0a1pYTmpBQUFCQ0FBQUFEaGpjSEowQUFBQlFBQUFBRTUzZEhCMEFBQUJrQUFBQUJSamFHRmtBQUFCcEFBQUFDeHlXRmxhQUFBQjBBQUFBQlJpV0ZsYUFBQUI1QUFBQUJSbldGbGFBQUFCK0FBQUFCUnlWRkpEQUFBQ0RBQUFBQ0JuVkZKREFBQUNMQUFBQUNCaVZGSkRBQUFDVEFBQUFDQmphSEp0QUFBQ2JBQUFBQ1J0YkhWakFBQUFBQUFBQUFFQUFBQU1aVzVWVXdBQUFCd0FBQUFjQUhNQVVnQkhBRUlBSUFCaUFIVUFhUUJzQUhRQUxRQnBBRzRBQUcxc2RXTUFBQUFBQUFBQUFRQUFBQXhsYmxWVEFBQUFNZ0FBQUJ3QVRnQnZBQ0FBWXdCdkFIQUFlUUJ5QUdrQVp3Qm9BSFFBTEFBZ0FIVUFjd0JsQUNBQVpnQnlBR1VBWlFCc0FIa0FBQUFBV0ZsYUlBQUFBQUFBQVBiV0FBRUFBQUFBMHkxelpqTXlBQUFBQUFBQkRFb0FBQVhqLy8vektnQUFCNXNBQVAySC8vLzdvdi8vL2FNQUFBUFlBQURBbEZoWldpQUFBQUFBQUFCdmxBQUFPTzRBQUFPUVdGbGFJQUFBQUFBQUFDU2RBQUFQZ3dBQXRyNVlXVm9nQUFBQUFBQUFZcVVBQUxlUUFBQVkzbkJoY21FQUFBQUFBQU1BQUFBQ1ptWUFBUEtuQUFBTldRQUFFOUFBQUFwYmNHRnlZUUFBQUFBQUF3QUFBQUptWmdBQThxY0FBQTFaQUFBVDBBQUFDbHR3WVhKaEFBQUFBQUFEQUFBQUFtWm1BQUR5cHdBQURWa0FBQlBRQUFBS1cyTm9jbTBBQUFBQUFBTUFBQUFBbzljQUFGUjdBQUJNelFBQW1ab0FBQ1ptQUFBUFhQL2JBRU1BQlFNRUJBUURCUVFFQkFVRkJRWUhEQWdIQndjSER3c0xDUXdSRHhJU0VROFJFUk1XSEJjVEZCb1ZFUkVZSVJnYUhSMGZIeDhURnlJa0loNGtIQjRmSHYvYkFFTUJCUVVGQndZSERnZ0lEaDRVRVJRZUhoNGVIaDRlSGg0ZUhoNGVIaDRlSGg0ZUhoNGVIaDRlSGg0ZUhoNGVIaDRlSGg0ZUhoNGVIaDRlSGg0ZUhoNGVIdi9BQUJFSUFJQUFnQU1CSWdBQ0VRRURFUUgveEFBZEFBQUNBZ01CQVFFQUFBQUFBQUFBQUFBRUJ3VUdBZ01JQVFBSi84UUFPQkFBQWdFQ0JRRUdCUUlGQkFNQkFBQUFBUUlEQkJFQUJRWVNJVEVIRTBGUllYRVVJb0dSb1FneUkwS3h3ZEVWRmxMd0Z5Umk0Zi9FQUJzQkFBSUNBd0VBQUFBQUFBQUFBQUFBQUFVR0F3UUJBZ2NBLzhRQUxCRUFBZ0lCQkFFQ0F3a0JBQUFBQUFBQUFRSUFBeEVFRWlFeEJTSkJFMUZoQmhReWNZR1JvYkh3NGYvYUFBd0RBUUFDRVFNUkFEOEFoU21NR1hCWlQweGcwZk9PanhSekJDdU5aVEJiSmpBcGZIcG5NRktlbU1DbUNpbU1XVEdKN01FS1kwdE5UckwzVFNxckMxeHlkdnZiRWxHdmNxYW1kVVdKUCtaK1krd3QvWEM4MXZtMGExRWlVbFdHQmJkYUVXVy9teHR5Y0xldiswQzFPYXFCa2ozOXYrdzVwZkVNNkN5NDRIeTk1STU5cWFMTFpYaldFU2xlaDNFQS93QjhSMUhyMmprSkZUUlN4ODJ1akJ2OFlvbGJtTlJPL3dEN012ZWdHOW5CSis1d01KSVRMYVpWakJHMEVEa2VSd01Yek9zQnlXL2dTNDNqdFBqQUVkdVY1aFJabFRpZWpuV1ZEMUE2cjZFZUdDbEFKSThSaEdmSDFOSlVRVmxISThEc3Y4cHRjZzJQK2JldUxOa25hRlV4MU1LNWpFa3NRdXNqcUxNTCtOdkczbGczcGZPMXVBTFJnL3hCbC9qSFUrZzVqUDJZOTJZMTVUVzAyYVVTVmxISUpJV0pBSTlQREJnVEI5R0RBTXZSZ3RzcWNHYU51UFF1TjJ6SHV6eXhKaVl6SnRreGd5WU9hUEd0bzhRWm1rQ0tZeGFQQmJKNll3WlBUR016MllHWThlQ0tRN1JFbzd3c05wTEFBVzVKTi9BWUxaTVZ2VjgxYlRtTDRUWVhZQUlIUHlyY203SDJ0Z1Y1cTlxZEl4VThuaUVmRlZDM1VnTjBPWmhxcXBGTlFTYnFoV1d4VjVOeDNGajREcnh4NGVYaGhSWnJVTk1Ta0RLcUFYUE5pZmM0dnMxSjhkbHJQVjVqSk1zYkZwWm4rVU1TZWdIVzkrTGZmRlp6aktncUxGQkxERTFtSjNFTHdCY0R4Wmo2ZE1JRmVGN2pqWmxoeEtUSVdCWUVEL0dCSjVpd0Nub0Q0WU9yb1pvNURCSXRtWHFEMSt1TmNkSkxjYmdmWURGb0VTcVFZSHVjb0FRMWgwdU1lbEdJdmZrZE9jVFZQbHBsRjJHTjlWa2J0UnUwTis4QXV0djZZM1Z1Wmpaa1M2ZGlOWnVvcS9MWEIzeHlMTU9QQmhZL2tmbkRIMllXSFlSdE5abU1iTU40aVRnamtqY2YrL1hEWjd2MHcrZUpZdHBGei91WXFhOFl2YURiTWU3TUU5M2o0SmduS1daTHZWMG56Z1R4bGxOaXBiYWIvWHBpc1JaL0pQcU9LQjM3cWtEbUloYk1DOTdEa2Y4QWVSaGZuTmF6TUpLZ1p2U2tPcmJsYUtBc0NvSkROWUd4SUZqOU1FNUxVMHNjTlhWUG1rUmhVaU5MRmc1c3BPL3hDbTlsdVRicjZZNXZmNTdVMnNqZ1kyOGtBOS83OVlhVFJJb0lQdkxmUHJTa3BhcDZTcDd0NWxtMldRN1NvdjVIZytIUStPTFlxcTZxNkVNcEZ3UjRqQ0ZvTTIrRjFNbGFnRVU4VE04YXpJTzVrREN4NjlQSGpwY1ladWpjK3JOUmFnMnJtVUxVOU5DWkhpamdJMzNKVWMzSUh0ZkJmeEhsWFlpdTRsbWJyNkQ4NUJxdEtGRzVlQUphekhpaGRxTWRYSFUwRFVZL2kxRjRsc09XYS9UODRaUmk5TVJlb1VwWWFTR3NxMFVyUzFVRXlram9SSW8vb1RncDVpdjRtamY2Yy90SS9GdnMxU2ZYajk0cEo5QzY4cUpLZWhTa3JIWUVCSUkwdXhKSGpiNjgrK01zMjdQTmI1V0hhdnkyc1ZrV3pOYmNWSGowNlk3dnBFZ0R0TkdrWVp3UG5BNUk4T2NENXZsbERWcVRVckc2MjVCNXh6TWFwejdUb1IwMWVjVDg5bXlPcWdEU3lVcitJTHNwNFA4QW5IaTBZVlNXUSs5c2RsYXR5eks1c3RxSUlxS0FKR0xMWkFMWCttRjFuV2dOTlBDV2VJeE9mbDNSTmF4eE5YcWdleElyTkVSK0V4QVF4cWhIR0pDbkFKQnhONjF5S2h5YXY3aWpxcEpWQUJJa1VYL0dLK1psajRCNXhkUjg0SWxiWnNPRE1kRENUTHUxQ0dHSGhLb09yaTlyZ2pkL1VZZFlUQ1l5K01ycjNJNmxWTEdTb2lIQXVTT2h3OHhIeGg0OEUrYUNQckZEeks3YngrVUVFZnBqMFIrbUN4RmowUmM0T0F3VE9mcTRyWjFwYWdSd1NXM051czNlSUd1d0FGaU9sN2VCSFhCckpIUlpVSnN3TlMxUlV4OTFORVNvQ0JRZHR3TFhBSEk2anBpS09hMHk1aXlVOHNTMHFTRnhCTENnYlkzVlJJT2JkUllubTU2WThyb1ZNenhmR3IzTWdWeThaYWNSOEN3djQ3ZW45aHpqbFB3V0l3cDRqVm1GUzAyVTFGRFI5L1g3WnBlN2FwZDJabUtrL3dBaTI4Z0R6WWNqaytFOTJmNSttV2FrcDhzeUZZb0lhcVVyVWlxbUpqa0FOMUtrZ0ZEdEJBNjhubnFMVnlDbHA2S3VFdXFBTzRadTczZ2Q2eUx0SlZnVlliaUNPVlBOajdZM2FWelhUK1E2Z2thcW9hUFA0bVVKVHl5cVllN3UxbTNnM0JPM3BmeDhjWHRGdXJzV3pmaVJYQU1wWEdaMHFZZ1FHWGtIa0gweEQ2d3BlOTAzWEp4Y3huYUNPcEhOaDY4WWxkSVRaVm1HbktPcHlOdytYbE5zUTNYS2dIOXA5UjY4NEUxWDNkTFBRejFpTlBRTkwzVlJCdjJBcTNHOGtjOEVnK1ZnYjRhL0lYZ2FSMnhrRWYzQTJrVWpVcU00T1k3TlB6ci9BTGN5K1NhcFdObnBZeVN6V0pPd2VlSzdxZlZHV1VVY3NjdWNRcVZHMjVrSFVqZ0RGQTdTYUhXV1h4eXhaYlIxMVl6cUlxWklTTnFvQUJ1TEhoUjc0NXMxalNhM1RNWkRuR1hWOFZuNVp3V0YvVG0yT1pVMEN3OXpwMXR4cTV4bWRIMStxS2VveW1yS1ZheU13UEFlL3dDM25qRlYxTHJHbkdTWmFVZmMweTk2KzN3OThLM3NrcDgzenJWdVhaUWxOSVBpS2hZM1lLU0FoUEpJOGdPdUcxMjA5bnNlazhwaStGVlpZNG1KSkE2cWYvM0V2d3dqN1ROZmlteGNpSnZXK28xcWExNTRqdWRoWlJib1BVbkZlb0k2bXZsQmZOS2VObVBDZDZQdGdUTUtTZXNyM2FXVWJmQWJlRjlzUytUNVJsbFBFV25iNGh4eXNaSEFQbmdpdUZIRUZITHZ6MUo2aCtPeXlwbzYyMFVsUlF6aDFML3RJUEhOdkxEenk1dmljdnBxbmorTEVqOGRPUURoSlpYM2pSYkdBWUJEWlNmQURnWWR1aTNXdDBubFZVa1FqVjZWTEtPZ3NMZjJ3MC9aKzVzc2hQR013QjUrcFFxMkFjNXhDTzY5TWVpUEIvYyttUHU1OU1NNGFMT1p5UlFmNlJYWE9aMU1kRXFFQ0JZK0diY3k3aXpFRWJRdCt2ajc0MlVyVW96Q1l4VTA5WFR3MDRJWkQzWmk1SHp0c0hBdHdUK2NWeWVWcjlUdFBueWVtTmtOWkxBbTBNR1JoOHkzOCt1T2FnNEE0amNWazdtZEZOVDFzYXg1dFNWU3NvWlc3d3loQ09xK045dm4wUHRodDloMmdhTE5JM3puTnFDaXJxU1RkUzdlL3dCNlNEYUR2QXZZaTVBMjJCVWdFWVQrbDBqekhOMnk1NnFhbG9xczNxR2lwUk1Zd0FTR0NEbmczNVhrQW5EUzdHTSswN2tPYVZzNjVxWkNpU21CSERmeGJBQlQwNmtYQUhXdzVKNHhaMHJWcFlHWWNTQzVIWkNGN2o4cElzdXBLaGNucEVpZ2VPQVNpQ05iV2p2c0IrNHRpbTlxTlREUUlzeHFvMUt1Z2VPVldaTm9JTExlMjFiajY4KzJGM3FMdERxNm5YY2xSVFR0U1R5VWNVS2ltbUJDTXBKQXN3NWE3QzYzNElQWEVCbTgxWm5NenpWMVd4MkVna3pIYVV0NDM2WE51Z1A1eFByL0FDeXVocFVkKzhxVTZKcTNEa3p1Nmtla3E4dVJySThNOFlaZklxUmNmZzRvV29leUxUdW9LOTVwWmF4UXh2dFNwSVJSN1l3N0xkYlpKcWJTTkVjc25abW80WXFhcWhjRldobFdNQXFiOVJ3U0QwSXhhNi9PS2JMNktTWm1HMUJkamZwaE4zYld4T2hJQzY3bFBjeDBQb0xTK2trMlpGbGtNVTB2RXRSYThqRHkzSG0zcGlzZnFPb0pLblN0VDNJRzVvK2g5TVdUUU9wbXorQ1hNQURGQUh0Q0NMQjE1QmEvdU1RSGJsbWxIRHB5U041NDJkMUpLaHIySGtjVG9jbk13bFRDM0RmS2NiVmxDb1F5aGVDY1k1ZlM3bkZ1Y1NPWnBVVTlNWGxUYkhJUUZCSHZqWnA5RWxkZnlNRkMyQkJ6VmpkSkttcFJIU3lQc3Q4aHQ1OU1PM1NGSkxEcGJMWXBvakhJdE9vS0VXSS82TUtsOHpreUtTSE1xZUtPU2FCd3lMSUxxVDY5TUVEdFYxTksyNUk4dlZSMVZhY2tqN3RoaDhGaEZhd242UUY1MUh0MjFLT0J6bU9QdWZUR2lybHA2V0o1Wm5BQ0x1SThiZTJGMWxmYXBYMkh4ZEJTVCtlemRHZjdqOFlEem5Pb3N4cVphdW5hb1dPUnl6Unl0eUxqaXhIajVlMkMydTE5dEZXNmxOeC9yOUl2MWFCaTNyNEVSR3FhUExLbk96RHBnem1uTVNTRkpTZHdrRWUrUStnQnVQcGlCcDRKbnNFN3VWblFzTFNnV0F1RGUvdC9URFYvOGZ0SE5DckZKVWlqZEhQZnRGSklUMEpZTDRDNDljRE4yZDA2dnZqcHF5d0cxVEhWbzl2dUIwd2xMcXFUeHVqSVdXVW5TV2JaaHAvTVA5YXBxWm5LUU1GTE02TFp2bHVTaEJ0NlhGOENaZm5rOUcwNUJzMHlsWFljazgzOGZYRjhiUUVvajdzVmxkQ2JncnZwVWNyOW13R21nY3dpbER4WmswdXdteXkwRWd0Zms4QytKZmowa2ZpbUFSS1pSNWpzck8rSXVPVHlwTzBrZnVISU54NzRrTXZ6aXBqaWtsYVdWcnFVTEtCYzN2WUVrSDM4OFM3Nkp6R0NvYVNPZkt0ai91amJ2VUJVbjlvM3B4OThYM3MxMDNRVlgrM2RLWnRsOGRRODJvRnFxdDQ1a0FaSFZZVmhIODNBRzQrQjNIeEdNRTF1TWNUWVlQY2F2NlVlenpXTWVUVm10YXhvNmZKSzZrQXA2ZVFscDZ2YTF4TlljS29HNEM5eWVmQ3h3MnN3b0tXdW9wSWF4M0VGcnVvUFgwdzIwZkxjc3BxYkxZbGlnaVZCREJUeHIwVUN3VUtPZ0FINHdzOVlVTDA4bFpUUlhqSlV0RnVIZ2VSZkFyeUZBVWl3ZnJEZmk3dURYKzBHektQTEYwME1zaURVaWQxc2orSGN4dkR4WUVFZFByZkhMK3VZdFREVk5SbHREV1ZXZkNsZzczdkprQWNJUE1BN1dJL09IVE5rK3B2aCs5T3FFTXJPWEtITDFiWUQ0QTdoZTNyaWk2a09zY3NxS3VTbDFaa3NyenhNbmZTVUxSdXEyNlc1c2NRVXQ3akVPL2Rtc1RneEdUSE1heXBacGUra2NzYks1UEhwYnd4WU5PMGRSVHlzMDQybTQrWHl3RkRTWnhKV3pDYk1icUcrZWFGZHBmMko1eE41UFNKU3FTdCtmbU56ZkJObTR4QWhyMnZCZGExUmlwNHd2UDhBRUJ0NkRFTzI0Z1ZFSlBBQjl4NFkyYXJtK0lyQ2dQQ0MzMXhocDhoNk1JL093bFA4WUsrT3M5SlNETmF2ckRTVXkrUVNBUElpbHZQRTVRbzBzeXFndmZyaUlvNmZhK3dINVJ6aHI5aEdqSWRZYW9ORFZUeVFVc1VMVFROR1FIS2dnQUxmekpIUGxpK3RqTDZuUFVxRlZ4eEkyV3ZqVmU2K01sSVBWdHZQVzNoejZYOU1EeUkwVDJPWmk3RWxWWkZhM3Iwdjk4UWpHSHYxYW9xQkFXWXFVVmQrK3hJUEk1TnY3K21NR3NnZmRISTJ4Qjg1VWpaeU9TZWVuNTU0d2lCY2RTSGRKcXJob3BVSWY0WmlEeVdpRnlmSG9PdU5jZVdVY2JvMU9pS1NiOE9RQWJlL3RpT2hlb1pKTG1OcmN1Zm1RQzU4TDlSNFlPb2R6aU5VcTRYVm11VkxIMXRZMzU1c1BwajNJOTVybUZSMEt4T3hEdVNUZm1ROGZuRnY3SU1sT1k5bytTUk1Xa2pqcUJVTjE0RVlMYy9VREZPaGxtYW5ONm1KWkxXQklOaUw4L1REWi9TdGw3U2F1elN1YVZwb3FhazJJVGZobmUzajZLZnZpVFREZmFCbWJLT1JIMW1NYk4zelU2Z1QwN0xPbGgrNGtHNFBuY0E0aDlTNWRCbWNNMWFoQTNVd2xpYytEQTIybjN2YkUrSEVlYVNrbTRraEJIdXBOeCtjVmJWZFUyWDVOWFJ3dHVpc0o0UjZFaTQ5dVFmb2NITEVEcVFlb1NvWXF3S3lnWnBTU3lST1licklvSUlQQkJIbmhIYXowUnE3T014a3FZNUlTbHVFYVFyL0FHdGpwak04bm1xZEdVK2MweHZXQ0l0TXA2U2k5L293R0UvcjNVMmVaRlA4SFBwM05FcUhGN05TUFlxRHlRd0ZpUFVIQVg3dlpRL0F6RHk2dExrd1RpSktzeUhWT1VRbHF6TEpVaFUyTWdJWmZ3Y2JJcEhTamFSdjNkUmlWenpPczExQlU5M0xFOVBEeHVER3hQMHdMbUVHMm5XSlJ3dlFZdHEzSFBjcXQzNmVwVWEySzVaamNzVGNuRy9UOERDbmFRZEM3SDN4dHphSVJJV2I5d0hHSlhMS1EwK1h4Uk1QbUNDL3VlVGkvcER5VEtXb0hVTG80QUc0VWZOaHYvcDlxNDhyN1FjdE1xL0pVQjZiMkxpdy9JSDN3dE12Z3Z0NHd4K3lyS2FpcjE1azBDSXgyVktTdllkRVU3aWZzTVh5NFpTWlZZZTBXVnFpMVpIUEpTUUNGbGpFeUVudS9FMzQ5UUFmRUVZR3FLdWVsTk9XblJRaUFXWUYzTW03a0cxdUFiSHJ6aURwcTVKS1VGcW90T3NxQ1h1cWNvTEtTMjNramdnMnZ6KzBZQ3Fhaks0NjE2aHF2NGVLcW1ZeHJKVUd5cnVIQVBnQnlPUjRtL25oWUNETW9jUzFRWmxTMWtyMG9ncVhFQ3NMbFFvc09SeVRicmpjdFVrRWNrMG1ZbWtwV1lyODBTZ29TZG9HMDhpNEhXMWg3OFlxUmx5WXc5MVRWRHoxREFzUkhLMjFEdUNydTRzUEE4ZUo0OGJTT1hMU3RuTHl4bzBjVU81bTcyekVrS1N4dC95UG5ZQ3c4OFlLS09UTmVwT1MxUzFPWVMxR1h0SWxNaEN3M1lPekN3Tnpmb1d0Zmp6OExZNksvUit4a3lyVU1qbzZ5R2VBTnVXdzRSaDh2bUwzKytPVjZQTTJXdEFTaWxuZ0x0SXNoYjlwS0JqdUI2WEI2ZE9weDFoK2phbWlQWjltbWFDRXhUVmVhT2pnMjRXTkVWUng3bkZuU3JpM3FTVjl4dFo5dHBnS2dPcUZ6c1VzYkFTZnkvZTFqOU1VU3VxV3pUS0srbGhYK1BTQnBFalBWbzJCV1NQNlhKSDB4ZXRUMGxKbWVYelpaVnlDTlpsQVJ5YkZIL2xJK3VFeFU1dG1GQm5STG9pWnJSM0RBSDVLdEJ3VDdrZGNGZ0plclBFYTJVOXpWYVVrZ2g1ajdwTmgvd0Rsb3hiK3VLdjJ6MHRWVzZPeXZNYUJpSzJEbVB5ZTZYS0h6QjJrV3hMOW10ZFRaamxjNjByZndwb3J4QTlWc1Q4cDlSdUErbU05V2d0b1dGZ0xHR3BRSDBzNUg5OFFYTGxTSkpRKzIxVDlmN25NZWJaTWU1anppbWgzVTFUY25pN1JQNHFmYitsc1FWVlFDVVhVM0o4TU9KMnBzajFiVjVMVnF2OEFwdVprU3hFOUluSnNEN1g0UDB4YmNwMGpsOHRKTlQxRkRUdXpIYnVaQmUzbmZ3OThCV1psYmJHRWhOdTcybkxEWkNhaXVCa0JLeC9PMzB3VEpURVBhM2p6am82VFEybmN5U1RMc21wZTZZU2JJcGxKSm1rNnN6RS95S0JZREN4MVZwS3F5TE9aY3RxNHJTUnQrNERoeDRNUFE0TzZXdlltRDNBV3BzRmxtVjZFak96N1Q4dWQ2ankvSzQ0bmNUektyN2VxcGY1ajZXRjhkalEwZEZRUUs4Rk5FaGhoRVNNRkc0SUJZTGZyYmdZVUg2YnNua2hyTTB6Tm83UmlKSUZZanF4TzRnZlFEN2pEZHp1Y1U5QThqSGdjL1lYeHVmbEtqbmMySi8vWlwiLFxuICBcIi85ai80QUFRU2taSlJnQUJBUUVBU0FCSUFBRC8yd0JEQUFnR0JnY0dCUWdIQndjSkNRZ0tEQlFOREFzTERCa1NFdzhVSFJvZkhoMGFIQndnSkM0bklDSXNJeHdjS0RjcExEQXhORFEwSHljNVBUZ3lQQzR6TkRMLzJ3QkRBUWtKQ1F3TERCZ05EUmd5SVJ3aE1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakwvd0FBUkNBQ0FBSUFEQVNJQUFoRUJBeEVCLzhRQUhBQUFBUVFEQVFBQUFBQUFBQUFBQUFBQUJnTUVCUWNBQVFJSS84UUFQQkFBQWdFREF3SUVBZ2dEQmdjQUFBQUFBUUlEQUFRUkJSSWhCakVUUVZGaEluRUhGQ015Z1pHaHdVS3gwU1JTVTNLQzRSVVdNelJpa3ZEL3hBQWFBUUFDQXdFQkFBQUFBQUFBQUFBQUFBQUVCUUVDQXdBRy84UUFLaEVBQWdJQ0FRSUZCQUlEQUFBQUFBQUFBUUlBQXdRUklSSXhCUk1pUVhFVUkxRmhzY0ZDNGZELzJnQU1Bd0VBQWhFREVRQS9BTGFTRDRkdU9NNXBkYlllbExwSGdnMHFBQlhpQVNZZTFwaUMyNDlLNkZzQjVVdlc4Vm9vbVpzTVJXM0hwWFFnRkxWbGJxcGxTNWlRaEZkaU5SWGVEV1ZxRk1nc1p4NGErbFlZMXJ1c3JpSkhVWWtZaGp0U2JSakZPSzVJeldMU3dZaU1YaUZOWkVGU1RyVFNSYXpZd210NUd5eGdnaW9pN3RSenhVOUl0TTU0OGcxbUcwWVdPUkNYSGF1aFdxM1VLSXFnbDEvclY1b3VpeFBaWFVGckpOTHNNc3ZPMFk4dmY5cXE0NnZyU0M4a2s2MW0zMngrMFZISkRaL3VEUHhmaFJGOUt2VU9sYXhwamFMYXpNMTliWFFabTJIWUNBUXd6NjgvcFZTeDJFeWpIalJuL3dCdjZWNlRCbysxeU5INGx6aDNQNmdTUGpYOWlXN29uVVdxV3R4Ymg5Zmh1bEtlTXl5TmtQSHhrSHZodjE5cXQxU0dVRWRpTWl2THVsSzFyZVJTU1NvVVZnVGpKL2Fyemcra2JwOHdvUEd1Y2hRRC9aMjlLcGxZNTZnVkV0OUphZzl6ODYvcUdPSzF4VFBUTlR0TldzeGRXY3ZpUkVrZHNFRWR3UjVHbmxCNjFNRHNIUm04Q3RWbFpWV25UVmFOWWF3ME84a1JOeFRXUVU2YzhVM2s4NkhhYklZemtXbXJyVHlRZDZidUtvWVloazBUeFhXT2FRMy9BQW5GS2h4aXVFQUtrU2hKZE9OMTFOcnFLeFVKcUVnNFVudXh4MitWUGJicHlTNFNCbzJZaVlaR1ZaY2ZwUnQwUEdzZlgvVnlqL0h6K1p6KzlFend3UjNhdy9WTDFyaHd6Q1VNNVVjOWkrN2c4MTd6SHNSYWxCWFowUDRnbWI1M203VjlEajIvVXFhMTZkdFliMTVXVzlFc3BaQ1BpeDhQK25qT09QV245dkhiN29RSWRRSWxVdDl3L0RqeUkyOEdyZ3U0UEZ0ZkRJZGh4a0J5TWo4RHorOU5OTVJXYzNBc3ByVEs0S3luRGNIekFKSHZWemRXdzJVbVAzZ1FPc3lGNktpRVZwcVFHVC9iR1huMlJSUlBtb0RwVGFkUHVwRjVEM2tyWi9FVlBWNWpKYlZyQWZtSHQzNW15YTBTQU1tc29VMWpYUHJscGNXMWhISE92Q1NGbkdDQ2VSN2VkWUtDL0Frb2hZNkVHUHBNMTdWYkdGTG5TZFNsaWdVN0pSR2R2UGtRYUUrbXZwWjFqVDlrV290OWZ0ODk1VGlRRDJiK3VhNjYwaThIVExXMlppeHlRcTkrUDl1MVZ5dzhKdXh3RDJwcGowVnZYMHNJWTlRVlIrSjZoMExxclMrcElDOWpOOW9veThMOE92NGVZOXhVbTVyelIwanJVdW1kU1dGeEF4WDdaVWRRZnZLeHdSWHBWemlsT1pqZVEraDJNeTZBRHhFWHBGK3hwVmpTTFVBWnVzY2VJQXB5UUJqdWFxVHJENlQ3MjR2Wk5ONmNsRWNLSGExeW4zNUQ1N2M5aCtwcWUra3ZxQTZWMHRMYlF5YmJtOCt6WEI1Q2Z4SDh1UHhxbHRLWkRPWldDN1VHZWZXblBoMktwUTNPUGlUWFI1bHFwcnZDN3B2cVRXTkIxVTZsTGRNM2luTTZ1MjVwdlppZjYwYnQ5TGVxYkpKbzlOdHhib3dYeEpBZVQ2WTNacW81TG8zTDdsWUZSMkNudFNzS05OOEs5L1RQZW5hWkFBOVlqaHZBNkhBS241OTVhZHQ5S091YWplZUZiUTJZWEdTeEJLajh4bXQzdjBpYS9HNWppdWJGbndSOEtZVUgzSjdVQmFaRkN3bmcyeW5VRVU3RVFFTXZ2bnRqOURVUnFMNi9wVXhNNXZMZVAzQkNmZ2UxYUtTL0lHb3R5c1NuR1BDOVErWmFmVC9WdXM2SGJSRFZ0RG5OZ3BhUTNObjlxbVg1eXhHZTNwVmk2UDFEcHV2VzNqNmRjcE1vKzhPekw4eFZJZEY5ZHZaTE1MMWdKSTE4UlpWR0M0SGRXQTRQem9xbTFyU1lPdk5JdmRMbUZvYnpmSGVxVTJ4eTR4dDQvdkgxK1dlYVQ1VkJMblk1L0lpOFY5ZXlCTE52NXpEWVhFZ2tDRlkySWMrWEhlcXNsMU1TT0Fzb1Y5eFppRndTeC9pT081cXo3aU9HOHQzaG1SWklaRnd5bnN3cXQrcWVrYkd3M1hGaGVHTno4WDFSM3lUL0FKVDMvUDhBT2dzYXdBOUpoR0tGNnRIdVpHWHQ0SHQyaWtrUXlzQ1VrZFMyMzVZNXpWZDlXT0JmUXJzWUJJRlVNd3d6Y25rK3RIdGhHWUJ2TE1jOXdhZ1BwRitvdEZheUgvdXlOdncrYSs5TXNaZ0xRSVprQUNvcUlLYURORmI2bmJYVStmQmlrVnpnWnlRYzR4Vmx2OUoxL2VYQVczRFJxV3h1SUhuN0NxZ1dRa2p5QTdBZVZQV25rV0hmRTVWMXdlS012eDFzUFVSQk1ScWVvK2FOeTZibjZRcGhEdDhLSzJrVWJYRG5ld0k3OERpaHUrNjFudU1pUzZ1SmYvRlgyTCtsVitMeHBBR0xNU2ZVMWhrWmp4bWcxeGEwN0xIdGRXTW8ySVdhN3JLOVQ2czk1SW9XS0dNUnhwM0hxVHo4NkVydG9vSndzVVlSQ09lZUs0Z3ZUSElRRzRZYzVwdk5LWjVQbWNLS0xwcENqcEhhQTNXaXNicjlvL3RvNDl1NVBpSi9pQjVxY2dsV3h0Uk5KRmx6L3dCTUhzVDcwSVJTeTI4dVViYXlua1p5S2xwZFhlK1ZCS1FwUmNBQVlGZGJTUWRqa1E3QzhTcnRIbE1Pay96Sk8ybHVHbGU1OGRqTTV5eEJ3VFU5YTlVNmxicjRjLzJ5SHVIR2NqOTZFSXBTb0JCb2cwcTF2ZFJkSVlJNHBKSERGRWVSVlo4ZHdBVHlheURPRHhHTjMwNFFHM1d2M0pWSSttOVZsRWx4cDZRU0UvSDRMZUZ2SG1Eamo5TSs5TzdycHUydXJ6VHByYjZ2TkZFcERSektJdWZMRzM3L0FMWk9lT2MwUHpXN1c4dmhYRVVsdEtlUXNpNHo4dlg4S2NXMTNlV2JCVmNHSmpnN2psY2U5Wk96TWVUQlc4T29iMTFmNmh4TDFKWUlzMXZjNjdld1RRTGh6RUZqVkNQSlJ0SkpvTW0xelFyYWVhNGhUV0xpZHpuNnhjU29UOCszODZaWEd0MmcxZEx4MDNSajRCa1p5Qi9GZysvWWVtS0pvYitHL2ozUnlKSXJER001L1NyVllnQTZ0eFRmY21HL2xnRW4zNTFJQk9xcmF5aHVGZEpwWlltK0FZSExIK0VuOGU5QStzMzgrb2FuTE5QT0pqbkFLakNnZWdGSGV1OUoyMTdaM0YxQkdzTjJxbHcwWXdKTWM0WWUvclZiendUMnhBbWdsaWJ0dGtRcWYxbzJxcEZPeDNpcTNKZTArcWRXOHhnbldRSkhKdE9kc2k1VS9NZWRPb1prYk80Y0U1K0VmL2NWSGc0R0s3Qnd3STROYnpFR1diOUgzVFdrNjlKY2ZYQkc0UlFWUVNFT1RubmowOWFzYUhvdnA2Mk9ZOU9qUCtZazE1ODAvVUpyRzRXYUNkNHBGT1F5TVZJcTd1ZytyVzZoc3BMYTdZRzhnQU83L0VUdG41anovQ2tYaVZOeWJzVnVJYWw3Tnh1ZWZwV0tPeUh5T0RTU2tnOGQ2Y3oyeGluWkhmTEE4bkhlc2RZWW9Hd1dhVWdnWVBiM3A1QkNTZThOZXI5VzZmditrOUpiUm83ZU82U1ZoY1JyQ0kzWDRCMzlzK2RNT25OSFdhS08vbUozZ25FUkhIc2Z5cDVyL1Z0aStqV1dsYWJaVzhJOEJHbWRZRlhFbTBjOXZuejcwMTZlbmRkUEVhejdTc2pmcmloY1lGYTlhMXo3eXpIMVIzMUJad1dsbUxxS01KSVhPNEx3Q09QTDhUVWRhWDlsT0VGMUl5T2lFSUZHZHdPZU05MTdudDM5UE9uK3ZFUG93akREZTBneWQzSCsxRExSQ0NFZ3ZFZzh6dUJaajdZNXJaVUhmM21weVg2ZkxmbGYrN1E3MCs4dlliTmJPR0w2em84MG9LUk9tOEx3QTJEeVVJSnp6aklVMUJYY3pvMGtJYzdRNVVETkRzVjlQYnJ1Z0xvRHdUdXhtbDJ2OHhLU3BCSHBXVmxSSjdSbjRibVU0NFlzeDU5bzd1STN5cEIzS294U3E3NFl3OGJNamVSVWtHa0xhNGFWUVdDZ04yQThxZE5ETTluSmNScmxJU04rRHl1Zk1qMDk2a00xZnBZU2NtbWpNWTNVdm8rNE1udEppdTFFYzkzY1BjY2dpTnBjaFI4dlgrWHpva3VQK0g2ckNJWm91RDJWL2lYOGpWYmFmZnp2dk9jQmUyRDNxVlRWYnUxayswVndSMzNER1B6cXpxU2VERXVoT2RhNktsall6YWVtNWY3aW5JL3FLRUhSNFpXamtCVjBKVmxQY0VlVldkcC9VZ2tPSHd1MVM1UHBnWm9WR2hSM3ZqU1NUQkhVTSs0SElKSUo1eno5N2o4YXVqSC9BQ2xXQUVIVlpQUDlhS2VoOVVqMGpxbXl1R3VGaWdMN0ppVHhzSXdmMm9adVlQcWx5OExqSlhIYjVWcUowSjdWMWlDeENwN0dXRzFibWQzcjc3dVJ1UHZHbXJydklPZndwNXFWdkpiYWhOSElwSHhFcWZJalBCRk5BQ1R3S3NoQlVFU0hVcXhCbXkrNHFDdVNPQWNjMUphZmVTd0l5d3hHUmM1UDJaT1B5cUxKREhBT2VhWGhua2diTWJGVDUrOVRyaVYzSks5MU1YRUhoUERzNTc3Vy9lb3VSa0tia2lZREorSnUyYVZsdTVyaFFKSkNRUEttN0VrWXp3RDJxUU5Uak9kakU1eVRTdjhBRGlzVHRYZTdDbXVrUi8wK3M5MXF0dlp4SkZKSkpJRlJaVGhTVDVIMm8wdU5Edk5CMUJMand2RFdaV1dXeWtJWU12bnNic2Y1MElkSUJ2OEFtL1M5b0pQMWxEeDg2dmpWRGJ6NlpjQzRpamxSSTNjQjF6Z2hUeVBlbE9ma3RWYXFqc1lYajJCZTQySlROOXBFOXRJYnZTL3RZRHlZVysraC9lcFBVL0YxclNZcjJHQXgzdHV1MmFNOE5JZzdqM0k4dlkwSjIzVU41Q1U4VjJjZW9QUCs5U0Y3ci9pMldZSmNQSjhKeHdSNjVvcnBzMk53anFvWldJT3YxR0kxQkZ0SmlHMnZLUkhqMis4ZjVBZmpTY1Y5S2l1cXZsV1huOHdhalhHY1ZvQXFlQ2FNMUZzbHJ6VVk3dUtOTHBTTnA0a1JBVzdkdmxVV1dVTndNajE3VnkzeGNueXJBdUR4bjVWd0dweE1ObWVHNFVKTWlTTDZNQVJYVUZycHlUcUZzcmZITzRsYzl4MnFEUzhVRWZhREh6cDNEZFlPZTVMK1J6eDJwU2EyVWNSNGJxN080RWNkVlRRUjJFTU1FS1JobXlRaWdEQStYem9SRHFUM0g0MU42OVA0c01QbmduOE0wUEJNc0JrRDUwYmlMMDFDTE12UnRPbzYzeGdZSVQ1N2pYRHl4N2NESlB0VGZhZmI4NnpiNjBUQm81Z0t1d0VrbXdIejI1b29zZWk3eTlsZGZyVnNrS2JmdGNrNXlvYmdZOUNPK0tFZ2NZOUtzYnB1NHVJTk96TWVaQ3JxZmJhQi9JQ2hNdDNyVHFRemFoQTdhTUlkQTZlMHpwMG1TTE0xMlJocDVBTWdlaWp5SDYxSmF2ZmdhTmVqZGorenljLzZUVUcxK1QvRlVkcTk4VzBxN1hQZUZoMzlxUjlEMldCbk96Q3pVRlhpVmlUOEsvS3NEWUZhSnJWZW5pNktCNjYzZWRJOTZ3WnJwRVdKOVBLdEU1RmNaT2FjVzBhdktBd3lQUG1vSjBOeXdHenFmLy9aXCIsXG4gIFwiLzlqLzRBQVFTa1pKUmdBQkFRRUFTQUJJQUFELzJ3QkRBQU1DQWdJQ0FnTUNBZ0lEQXdNREJBWUVCQVFFQkFnR0JnVUdDUWdLQ2drSUNRa0tEQThNQ2dzT0N3a0pEUkVORGc4UUVCRVFDZ3dTRXhJUUV3OFFFQkQvMndCREFRTURBd1FEQkFnRUJBZ1FDd2tMRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCQVFFQkFRRUJBUUVCRC93QUFSQ0FDQUFJQURBU0lBQWhFQkF4RUIvOFFBSFFBQUFnRUZBUUVBQUFBQUFBQUFBQUFBQUFRSUFRTUZCd2tHQXYvRUFEa1FBQUVEQWdNSUFBSUpBd1FEQUFBQUFBRUNBd1FBQlFZUkV3Y0lFaUV4UVZGaGtiRVVJaU15UWxKVFlvRVZjcUVXTTNIQkY0THcvOFFBSEFFQUFnSURBUUVBQUFBQUFBQUFBQUFBQUFjRkJnRUNDQU1FLzhRQU5SRUFBUUVHQkFNR0JBY0JBUUFBQUFBQUFRSUFBd1FGQmhFaE1VRlJJbUhSRWhNeVVuR1JJMEtoc1JRVlluS0I0ZkRCMHYvYUFBd0RBUUFDRVFNUkFEOEE2cDBVVVVNTVVVVVVNTVVVVVVNTVZZbXpvZHRpdVRyaEthalIyVWxUanJxd2xLUjVKTmVkMmo3U2NLN0xNTXljVTRzdUNJOFpoSjRFWi9YZVgyUWdkeWE1bjdmdDZmSE8yaTRPd21aTHRxdzZoWkRFQmxaSEduc1hDUHZIMTBxejA3UzBYVUM3bzRYWXpVZnNOeTFkbnRTUXNqUlpmRThPU1I5enNHbG50ZTM5dG4yQ25YclJnZUtyRWx4YnpTWFVxNEl5RmYzZFZmeFVVTWM3Nk8zWEdqamlHc1JpeXhWazhMRnZRRUZQL3Y4QWUveldpK0RQelJ3K3FjMHJvNlV5dEk3THNMVnVyRSsyUS9nTXFKalZjem1LamQ1MlU3Sncvcys3Wlc4WXh4WmlCYW5MNWlHZk9VczVxTDd4V1Q4YXcyUkpxNXdWWGdxeklkb2Rqc29GaHlhdkxlS1dick55MXJJZzE2UERXMFRIV0RuMFNNTTRvdUZ1V2c1alFlS1FmK1IzckFjRkhENnJEeDBoOG5zdkVnalk0dGwyOVc2VjJrRWc4bW1Mc1EzL0FMRWxxbVI3SHRiWVRjYmV0UWIvQUtpeWdKZWFIVE5RSEpRL3pVODdCZjdQaWkwUnI3WVo3VXlETWJEakx6U3MwcUJyaVB3K3FtTHVCYmE1dHB4SzVzbXZjeFM3ZmNrcWR0K29yazA4Qm1ValBvQ08zbWxmV1ZHd3dobFRDWHA3S2s0cVNNaU5TQm9SN014S1VxeCtYNllHT1YyZ3JBS09ZT2dKMUJib0pSUlJTZFpxc1VVVlJTa3BIRXBRQUhjbWhocTFpc1U0bXRHRHNQenNTMzZVbVBCZ01xZWRXbzVjZ09nOW1uRlhLM0lPU3A4WUh3WFVqL3VvTWIrdTJ0ZHp1VWZaUmgrYURFaWdTTGt0cGVZY2NQM1d6bDJIWDRWT1NDU3ZKM0hJaFJnbk5SMkF6NkRtMFBQSnU3azhFcUpPSnlBM0p5Nmx0Qjd3bTNXLzdiOFlQWEdVOHRtenhWcVJiNFlQMVVJeis4UjNVZTVyVk9uNnBuVHFtblhTTUpDT1lGd21IaDAyU2tXQVpBUlVVOWpIeW43OVYxS3hKWmZUbzA2WTA2Tk92b2J3dXkrbjZvNFBWTTZkR25ReGRsdE9qVHJkK3dQZGd4anRxdUNKbWs1YmNQdExHdlBjU1J4anVsc2ZpTmI1MjhiaTlncytDZjY3c3NFcGR3dGJSWEtqdk9jWmtvQTVxVDRWNnF2UmxVeXlCakV3TDE1eG5EREpPM2FPbit1MDlDMDVNWXlFVkdPMGNBeDVuMEd2K3MwRjlQMVhwZG0xL2V3amp5eFlqWWNLRlFKcmIyZWZVQTh4V0VVeXBDaWhTU0ZKSkJCN0dxQkpTb0tUeUk2R3AxNjdTK2RxZHF5SUk5MmhIYnd1bGhhY3diK3pkdWFzVFowTzJ4WFowK1MzSGpzcEszSFhGQktVZ2R5VFJObXhiZEVlbnpuME14NDZDNDQ0czVCS1FNeVRYT25lZzNuTHZ0UHUwakN1Rlpqc1hETVZaYit6VVVxbHFIVlNpUHcrQlhOMVBVOUVWREVkMDZ3UVBFcmJxVG9HZjArbjBQSW5IZVBNVkh3cDMvcmN0dWpiTHYzV0REYno5ajJaUVVYaVczbWhVNTdNTUpQN1IxVlVVY1lieU8yZkd6NjNMcGphY3cwc243Q0l2UmJBOFpKeXpyWFduUnAwOUpWU3NybEtBSFRzS1Y1bEM1K3VYOE1tWmxVMHhtYWlYandoUGxUZ1A3L2xyMG0rMzZZNFhwVjVtdXJKektsUHFKK2RKUEtla09LZWtPcmNjVjFVdFJKUDhtcittYU5NMVlFb1Nud2l6UVplS1Y0aXl1bjZxdW5UT21hTk90bTF1eXVuUnAwMXAxOXNSSHBMeUk4ZGxUanJpZ2xDRWpNcUo3QVVHd1lCdXlnYVVvaEtSbVR5QUE1bXBWN3RHNXhQeG91TmpYYVRIY2gyVUVPUjRTZ1V1U3ZCVitWUHpyM202L3VmTlFVeGNmN1VZUVhJSURzSzJPRGszM0MzQjU5Vk1kdHR0cENXbWtKUWhBeVNsSXlBSGdVcDZ0cnJ1eXFCbGFzY2xMSDJUMTl0MloxTDBaMndtTW1TY013ai9xdW51eXRvczlyc0Z1WXRObWdzdzRjWkFRMHkwa0pTbEk5Q280NzAyOVRiTm5VQ1RnakJ6elV6RU1sdFRiemlUbWlHa2pJaytWZXErdDZuZWhqYk9JVDJDY0Z5VVA0aWtvS1hua25NUTBudi9kNnJudE9sVExuTWV1RndrT1B5WkN5NDY2NHJOUzFIcVNhK0NqcU9WSHFFeW1RNE0wZy9OelBMNytqZmJWZFdKZ1FaZkFIanlKSHk4aHorM3F5THZHODR0MXc1cVdvcVVmSlBNMThhZE5hZEduNnB6c3BMdFByZm0ydlA0ZnNNYlp0WkpSYmxYWk9yT1VoV1JTd0R5VC9KcUIra2V0YlMzaDhXTzQyMnZZZ3V5blN0bHVRWXpIUGxwbytxTXZoV3Q5T3E5U3NxUktaVzZkQWNTaDJsZXB4K21UVGxUVFJVMG1UeDZUd2c5bFBvT3ViSzZYcWpTOVZKYmRuM1dwTzB4eHZGMk1XbHg4T05xK3piSEpjc2pzUENmZGJKMjJia1Z2ZmpMdnV5WWZSMzJrNXJ0cmlzMHVaZmtVZWg5R3ZHSnJDVXdrZitBZXJzclUvS0RzVHY5QnEzckQwcE00cUMvSE8wWEdnK1lqY0QvRTZOQ0RTbzB1WFNzeGViQmRzUFhGNjAzcTN2UTViQ2lseHA1QlNvR2tkT3JPbFNWcENrbTRMVnhRS0NVcUZpR1YwcU5MMVRXbjZxNUdodnpKRGNXS3l0MTUxUVFoQ0JtVktQUUFWazJHSmJGeWNBeTBTM3laOGxxSERqcmVmZVVFTnRvVG1wUlBRQVZQSGRkM1VJbURXWStPOW9FTkQ5NmNTSElzTll6VEZCNkVqdXY1VXp1dGJyMGJCTVpqSGVPWWFIYjI4a0xpeGxwekVWSjZFajgzeXFUOUptczYwTVNWUytYSzRNbEtHdkljdHpyNk0yNlJwRVE0VEh4NmVQTktUcHpQUGxwNnRRQUFaQWNxMEp2UWJ4Y1BaUFpGNGZ3KysyOWlXZTJRMmtIUDZNZy9qVjc4Q3ZYYmV0dFZvMk40U2R1RHEwUFhhVWt0d0l1Zk5TOHZ2SDlvcm1iaWZFVjR4aGZaZUliOU1YSm16SEM0NHRSejY5aDRBcjRLSnBQODJlQ09peDhGSndIbVBRYTc1Tjl0WVZSK1Z1L3dBSENuNHFoaWZLT3AwMnpiRlhLYk92RTkrNTNPUzVKbFNYQzQ2NjRyTlNsRTh5VFMybDZwclRvMC9WUFJLUWtXR1RKZ3FLamM1c3JwZUtOUDFUWEI2bzAvVlpzMkx0a0pyamsyVzlMZE9hM2xsYWlmSnF4cGVxYjBxQzM2b0FBRmcyaFVTYmxwaWJvRzhKYnhBaTdLc1Z1TnhuV2MwMjJTZVNYQVQvQUxhdmZpcGQ5ZVlya0l3dDZLOGlSSGNVMjYyb0xRdEp5S1NPaEJxZE82OXZIdFkxaHM0R3hsTFNpOXhrQk1aOVp5K2xJSGIrNGY1cE8xelNCZEtWTklFY0p4V25iOVE1YjdaczJhTHFzUFVwbHNhZUlZSU8vd0NrODl0MjJWdGMyRFlIMnZXNVRkNWhKajNGS1NHSjdLUUhFSHRuK1llalVCOXJ1d0RHMnlLNEtUZFlhcFZzVW82RTlsSkxhaDI0dnluL0FKcnFEU2QyczlydjBCNjEzaUN6TGl2cEtYR25VaFNTS3JOTzFoR3lJaDByamRlVTZmdE9ucGsxa245SndrNkJlSjRIdm1HdnFOZlhOdVFTSTYzRnBiYlFWS1VRRWdETWsrS203dXA3c3JXSG1JKzBYSFVFS3VUb0RrQ0k0bi9ZU2VpMUQ4M2p4WHRjUDdvbXp6RDIwUVkwamNic0pyN1ZpMnVEaWJiZHo2NTl3T3dyZXdBU0FsSUFBNUFEdFZocXV1a3pDSEVKTFNRbFE0amtmMjlTMERURkZxZ1g1aXBpQVZKUENNeCs3b0dyV0F4MWpTeTdQOE16Y1VYNlFscU5FYktzaWVhMWRranlTYXpqenpVZHBiN3ppVU50cEtsS1VjZ0FPcE5jK2Q2YmJjOXRNeFFyRDFsa3FGZ3RMaFEyRW5rKzZPUldmSThWVTZZcDk1VUVhSFdUdE9LankyOVRwN3RaNmtucnVSUVplNXJWZ2tjOS9RTnJIYTF0S3ZtMWpGOHJFdDRkVUVLVVVSV00vcXN0Wjhrai91dkY2WE9tOUllS05MMVhSMFBEdW9WMGx3NUZrcEZnRzUrZnhEeUplcWZQVGRTamNsbE5MMVJwZXFiMDZOUDFYczNsZGxOTDFScFUyRy9WVjA2R0xzeHAwYWZxbXRLalNIVEtodk83SzZkWDRFdVpiSnJOeGdTRnNTSTZ3NDA0ZzVLU29kQ0srOVAxUnBlcXdRRkN4eWJJVVVtNExUMjNiZDRTSnRMdGJlRzhSdnRzNGhob0E1bklTa2o4U2Zma1Z2ZXVUOW11dHp3OWM0OTR0RXR5TkxpckRqVGlEa1FSWFFIZC93QnUxdTJyMlJNSzRPTng3L0RRQkpaSnkxUitkUHJ6U1ByV2tETFZHUGdrL0NPWThwLzhuNk02S09xd1RGSWdZdy9GR1I4dzYvZHR2MFVWNWZhVGp1MmJPY0lUOFVYSll5anRrTXQ1ODNIRDkxSS9tbDY0Y1BJbDZseTZGMUtOZ09aYSt2bnlJZDJwNjlOa3BGeWVRYlNPOTl0cU9GN04vd0NQY1BTK0c1WEpHY3h4QjVzc244UG9uNVZCNG9KSko1bXZRNHN4RmRNWllobllrdkR5blpNMTFUaWlUMEI2QWVoV0kwdlZkSzAzSTNjaGdVdzZmRWNWSGM5QmtHNTFxR2RQSjNHcWlGZUVZSkd3Nm5Nc3JwMGFmcW10TG5ScGp4VTgwSGRsZFAxUnAwMXArcU5QeUtHR1YwNisySWo4bDVNZU95dDF4WjRVb1FDVktQZ0NtNDhLUk1rTnhZckszWG5WQkNFSUdaVVQwQUZUWTNiTjJxUGc5aGpHdU5ZaUhidzZrTGpSbGpOTVVIdVIrYjVWQlQrZncwZ2h1K2ZtNmo0VTZrOU55MDNJcEhFejJJN2x6Z2tlSldnSFhZTkN2Z280UFZaSzYyMTYxWEtUYnBDU2x5TTRwdFFQWWcwcHdWT0pVRmdLR3JRYWdVa3BPWWF4d1VjRlgrQ2pnckxhM2F4d0NzcmhqRWw0d2ZlNDJJTERNWEdseFZoU0ZKT1dmbytRYVI0S09DdFhqdEwxQlFzWEJ3SUxib2VLZEtDMEd4R0lMZEU5aW0yaXk3VjhPcGthamNlN1JVZ1RJeFZ6Qi9NbnlrMUdQZXoyci82enhXTUpXaVR4MnV6S0tWbEorcTYvM1B2THBXa29GeHVWcmNVOWJaOGlLNG9jSlV5NlVFanh5cGRZVzRvdU9LS2xLT1pVbzVrbXFYS2FJaEpUTTFSN3RWMC9LbnlrNTQ2OG11RTByU0tta3RUQXJGbGZNcnpBWllhYzJXNEtPQ3IvQUFVY0ZYZHFZMWpnRkhBS3Y4RkhCUXcxamdxN0dodnpKRGNXS3lwMTUxUVFoQ1JtVkU5QUJWK05Ea1RIMjRzVmxicnpxZ2hDRURNcUo2QUNwb2J1ZTdqSHdnd3pqTEdVVkR0NGRTRng0NnhtSXdQYy91K1ZRTS9uOE5JSWJ2bnh1bytGT3BQVGN0T1NHUlJNK2llNWM0SkhpVm9CMTJEVzkzRGR1ajRRWVl4bmpTS2gyOE9wQzQwZFl6RVlIdWYzZktwRzBVVnp0TlpyRXptSlZGUlNyazVEUURZY202QmxjcmhwUkRDR2hoWUQzSjNMUVczcU5tVW5DV09YY1NSSXgvcGw2VnFoWUhKRHY0a241MXBIZzlWMDd4amc2eFk1c1VqRCtJSWlYNHo0NUVqNnlGZGxKUFkxRFhhVHV0WTN3akplbDRkanF2VnN6SlFwa2Zhb0hoU2Uvd0RGTitqYXhob21HUkF4cXdsNGtXQk9BVUJsanV5bHEra1ltR2lWeHNFZ3FkcU55Qm1rNjRiTm83ZzlVY0JySXpiUGNyYzZZOCtBK3c0azVGTGlDQ0tYK2p1ZnBxK0ZNWktrcUZ3Y0dYaFNwSnNReTNCNm80UE5NNkRuNmF2aFI5SGMvVFY4SzJ3YkZpeXhSNm80TTZaK2p1ZnBxK0ZHZzUrbXI0VVlNV0xMYWZxamc5VXpvTy9wcStGR2c1K21yNFVZTVdMTGNILzJWWFkwTitZKzNGaXNMZGVkVUVJUWdabFJQUUFWZllneVpMeUk3REMxdU9LQ1VKQTVrbm9LbVJ1OGJ1OGZDRWRuR0dMNHlIYnc2a0xqc0tHYVl3UGMvdStWUU0vbjhOSUlYdjN4dW8rRk9wUFRjdE9TR1F4TStpZTVjaXlSNGxhQWRkZzN4dTdidWtmQ0RET01jWXhVTzNoMUlYSGpxR2FZb1BjL3UrVlNHb29ybmFheldKbk1TcUtpbFhKeUdnR3c1TjBGSzVYRFNlR0VOREpzQjdrN25teFJSUlVhMGkzLzJRPT1cIixcbiAgXCIvOWovNEFBUVNrWkpSZ0FCQVFFQVNBQklBQUQvMndCREFBZ0dCZ2NHQlFnSEJ3Y0pDUWdLREJRTkRBc0xEQmtTRXc4VUhSb2ZIaDBhSEJ3Z0pDNG5JQ0lzSXh3Y0tEY3BMREF4TkRRMEh5YzVQVGd5UEM0ek5ETC8yd0JEQVFrSkNRd0xEQmdORFJneUlSd2hNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpML3dBQVJDQUNBQUlBREFTSUFBaEVCQXhFQi84UUFHd0FBQVFVQkFRQUFBQUFBQUFBQUFBQUFCZ0lEQkFVSEFRRC94QUEyRUFBQ0FRTUNCQVFFQkFRSEFBQUFBQUFCQWdNQUJCRUZJUVlTTVVFVElsRmhjWUdSb1FjVU1yRVdRbExSSXlSeWdwS2l3Zi9FQUJRQkFRQUFBQUFBQUFBQUFBQUFBQUFBQUFEL3hBQVVFUUVBQUFBQUFBQUFBQUFBQUFBQUFBQUEvOW9BREFNQkFBSVJBeEVBUHdEV0s5WGNWeWdTMUlOT0hyVFUwaVF4UEpJd1ZFQlppZWdBb0dMdTVoczdhVzR1SkZqaWpVc3pNY0FBVmpQRS93Q0tON3FNc2xwcEFlMXQrYnl6ajliZ2ZzS2I0cjF2VWVMTDFvMGtNT25odjhLSE9PY1o2bjFOSTBiaGlPWUtpb1gvQUsyUFQ1VUFWTEhkVFRHV1JYbGRzbG1KNWlmZk5SbmpkWHc2RlIwcmM3TGhTelJkNDErUXBON3dQWVhNYkR3Z3JkUXlqZWd4QkkyVU0wWVg0Wk5SM2tLT0NvWUh2bXRjbTREVlAwNUk2YzNXaDNWZURMcTJCZUZlZGZZZEtBVHM5UW50cFZtdDJramRTTU1weHZXNjhFY1JTNjdwWCtaSU54SHNXL3FIcldKVDZWY1FUQU5FeUhxU2Vob2o0VDFLWFRkUWhlTjhnTmhsRFl5TzlCdVJYYWtFYjA1RklzOEtTcHVyRElyakNnYnJsTHhYc2UxQmNZOXE1ZzA3aWtsYUJsaFFOK0plc0N3MFJiUU1WTnpubngxS2p0ODZPMkZZdCtNTFNuVjdlTWs4bmdqbDlPcHpRQm1tTmNhbHFLdHpFQStYYnNLMXJRNDFpdGxoVlFBQmphc3Q0VVVmbWlUMEIyclVkUEpRcmc5YUFraFh3OEdweUZIWG9NMUV0aUhRVk1DREZCR21pVTlCOXFoU3dyeWtGUWZsVm15bk9PMVJabEdNVUZCZDZUYXpSSG1qR2ZYRlovcU9ndHBXdVJUV3UwRXJad1A1V0crMWFoTXZrSzBOYTJqUlJRU3B1MGM4Ymova0Fmc1RRSGRoekhUNEN3QVlvTTQ2ZEtlSzB0SWxpaldOQmhWR0FQUVZ3aWdSeTE0clM2NGVsQmIxd2phdTE0MERaRlpEK00wV0xuVEg5WTJIL2F0ZjcxbEg0dU5GZTJkbGNRWmNRdThiTU9tVGpiN0dnRHVEYkVUSzByRHlLMzFOYUJha0JsTE1GVWR6UXB3YkdVMFRtSS9VNU5UdFJoa25ibGE0Wkl4MkZBWlI2ellXNTVIdUVCOWM3ZldyR0hVcmVaUVk1a2NIcGhoV1Eza09qUnFVbTFka2w5bXo5cW8yZ0N5aDdYVjVKUm5xR0lvTjllN2p4VFVsekdVeFdmOEFDK28zcnNsdkpJMDZqYkxISkZYZXZha2RMdHpJNDM3RDNvTGVhZFRuQkZVdXBJYmxGaVVnc3pxQmo0aWdpZlhOZjFDUXBaSWlSazllL3dCYWs2UERyeWF0YUUzQU1wbVhibXlPdmNVRzJFZGFiWVU1dnlqT005OFVrMERkY0pwV0s1aWd0NjRUWHMxN3JRTnk1OEYrWFp1VTQrbFpKeEJhb2xuSllTU096M1JNd0JHd0k3MXJjNUsyMHBIVUlmMm9EMXkxamUwa3VmRHkzTHlLZjZjQ2dvK0g3SDh0cGtFQjZqT2ZyVnJjY014WDQzbWtRRVl3cHhuNTFGMDI0VmduMG9wczVNcUIyb014MUg4TTRIZDhDNUdEbFhqWU1mbm1ySzI0VGlTM2d0L3k3UXJFb1VTWUhNM3g5YTBreGc0N2o5NlE4S0FsdVg1bWdGZFAwZURUcjRTMjZsWXM5RFhlT2RLT3BXVURRc0ZZTU91d09SVm05ekcwNWpRZ2tVNXFFTDNGZ01Iekp1UGxRWS9MdzNyVU9vOHNkOFJhRnM1NS9NQjZFVVc4QzJGNUZ4REMxMmVkRlpncEo5ampORk1OcERkUXE1alVranVLa3dXOGRuYzI3b29YbGNkTnU5QVNsYWJZVkpZZGFaWVVEV0s5Z1V1dllOQlBBcnVEWHE3bWdTeWdnZ2pJSXdSUXRxRmxjTkZOYU5ETTRjRUtVWEliMDM3VVVtbUpEMW9NanRoSlozYndTTHlzamxXSG9jMFdhZGRqYmY3MVdjVlduNWZYR25BQVc0VVA4K2hxTlozQkEyT01VQm1MeU5WeVNLb3RUMUc1dTJlM3RBV0FHV0tuN1V5OHNoaXdDUm52VWl5ZElZMlVZNXljblBlZ0VaK0tZTk9aVmFHNDhZSGxkVmpKNVBqVjMvR2RuK1FWNU9RRWpHU2NFMU0xRFRyYTlqYnhHaEV2TGhkeG1oaVhoT0szWlpaSkErK1FoYWdMZUg3MFhGbHpOZ1pZa2ZDcDB6QjdpRkFja3VvKzlVRmpNa1NpT0xBSUg2UlZ6b2F2ZWF3R09lU0VjNStQYWdMVzZtbTJHYWNha0hyUUl4WE9YMnBkY29KdWE5bXVWNmc4eHFMS2R6VWxxaVM5YUFYNHhnRDJFRStQTkZKalBzUi9jQ2hXQ1FxK1QxUFdqdlc0aE5wY3lrQTR3ZnZXZXk4MWhNRWx6NGJiSTNwN0dnSW9HOGVBRHVCc2ZTcXk3ME1BbVJicTVETnUySlRqNlU3WlhpRmNBNUI2R3JXUEV5alBROTZBV05qYVJSNW11SkVZZnpKS1RuNDVxSkpCRElENE56TXorcGx4KzFHOHVpMkVvSmtoVmllOVE1Tk5zWVJ5eFFLcEI3RHBRVjJrMlF0WS9Fa2QzWWpKTG5PVFJ0dzNibUt3TTdqRHp0emY3ZTFDOXRBYjI2U0JDUWdIbkk3Q2pXM2tDSXFZQVVEQUE3VUV0cVFhVmtHa0hyUWVyMWVyMUJNcjFkMnJ1S0JEZEtpekRlcGVDVGpIV2xMYXErY25mOXFBYTFlZEk3VjRqK3R4akhwUTVlV01kN2JGSEFPUlZ0cUZzMFdWWWtsVGduM3pVWkFBT25TZ0JMKzB2TktrUGhndkdCNWZhbmJMaWhoSUluSlUraG94bnQ0NTR5cmpPZlVVSmFydzJyTnp4cnQ4S0M0UEVLdEdWRFpPOVZ6NjJydjRhdVpKVHNBTnlhcUlkRllONWxmR2V6SEZFR2xhVEhDQXFScXJ1UW9PTjl6UUZ1ajZZOWpaanhBRE0vbWtJOWZTcmRRVkc0cWRIYnI0UkI3Q21mRDhXZmtVZHFCTWI5cWNwYTJiZ25iTzJDUFN1bUZsMjlzMENLOVhTQ08xY29KNFhQU25SRmpCTkxSQlRoWGFnaktuTHRUNkN1RlFLNGh3Mi9TZ3FOZDAvd0FXTnAwRzJQUC9BSG9UZFdqeVNOaDFyU0d4MHgxcWd2OEFRbFlzOXNBT2JyR2YvS0FVNXNqYWtTRVk2RGVwWnNudDdneFNxdzlNaW0zdHp6Y3Z2UVFWdFFXenk3VmE2SmFMUHFYTmp5d0FNZjhBVjIvdlV1eDAyU1ZRRVhyL0FERWJDcjZ4MHFDd3R2Q2pKSko1bmM5WFk5NkRrcFBKaGNlOU8yY09HNXoxcFhnS0pDTWs5Nmt4QWRhQnhFR0R0c2FhbGpCSU9QYXBBRzFjWmNpZ3JaVUFJSGMweXk0cWZKRmxzMUhrVWRxRC85az1cIixcbiAgXCIvOWovNEFBUVNrWkpSZ0FCQVFFQVNBQklBQUQvNGdLZ1NVTkRYMUJTVDBaSlRFVUFBUUVBQUFLUWJHTnRjd1F3QUFCdGJuUnlVa2RDSUZoWldpQUgzUUFLQUFrQURnQWFBQjloWTNOd1FWQlFUQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUE5dFlBQVFBQUFBRFRMV3hqYlhNQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBdGtaWE5qQUFBQkNBQUFBRGhqY0hKMEFBQUJRQUFBQUU1M2RIQjBBQUFCa0FBQUFCUmphR0ZrQUFBQnBBQUFBQ3h5V0ZsYUFBQUIwQUFBQUJSaVdGbGFBQUFCNUFBQUFCUm5XRmxhQUFBQitBQUFBQlJ5VkZKREFBQUNEQUFBQUNCblZGSkRBQUFDTEFBQUFDQmlWRkpEQUFBQ1RBQUFBQ0JqYUhKdEFBQUNiQUFBQUNSdGJIVmpBQUFBQUFBQUFBRUFBQUFNWlc1VlV3QUFBQndBQUFBY0FITUFVZ0JIQUVJQUlBQmlBSFVBYVFCc0FIUUFMUUJwQUc0QUFHMXNkV01BQUFBQUFBQUFBUUFBQUF4bGJsVlRBQUFBTWdBQUFCd0FUZ0J2QUNBQVl3QnZBSEFBZVFCeUFHa0Fad0JvQUhRQUxBQWdBSFVBY3dCbEFDQUFaZ0J5QUdVQVpRQnNBSGtBQUFBQVdGbGFJQUFBQUFBQUFQYldBQUVBQUFBQTB5MXpaak15QUFBQUFBQUJERW9BQUFYai8vL3pLZ0FBQjVzQUFQMkgvLy83b3YvLy9hTUFBQVBZQUFEQWxGaFpXaUFBQUFBQUFBQnZsQUFBT080QUFBT1FXRmxhSUFBQUFBQUFBQ1NkQUFBUGd3QUF0cjVZV1ZvZ0FBQUFBQUFBWXFVQUFMZVFBQUFZM25CaGNtRUFBQUFBQUFNQUFBQUNabVlBQVBLbkFBQU5XUUFBRTlBQUFBcGJjR0Z5WVFBQUFBQUFBd0FBQUFKbVpnQUE4cWNBQUExWkFBQVQwQUFBQ2x0d1lYSmhBQUFBQUFBREFBQUFBbVptQUFEeXB3QUFEVmtBQUJQUUFBQUtXMk5vY20wQUFBQUFBQU1BQUFBQW85Y0FBRlI3QUFCTXpRQUFtWm9BQUNabUFBQVBYUC9iQUVNQUJRTUVCQVFEQlFRRUJBVUZCUVlIREFnSEJ3Y0hEd3NMQ1F3UkR4SVNFUThSRVJNV0hCY1RGQm9WRVJFWUlSZ2FIUjBmSHg4VEZ5SWtJaDRrSEI0Zkh2L0FBQXNJQUlBQWdBRUJFUUQveEFBZEFBQUJCQU1CQVFBQUFBQUFBQUFBQUFBQUFRVUdCd0lFQ0FNSi84UUFQUkFBQVFNREF3SUVCQU1FQ0FjQUFBQUFBUUlEQkFBRkVRWVNJUWN4RXlKQlVUSmhjWUVJRkpFalVxR3hDUlVXTTBKRDBmQWtZbktEa3VIeC85b0FDQUVCQUFBL0FPeXFLS0tLS1FrQ21pMzZtc053dWNtMndickVsUzRxQXVRMnk0RitHQ2NESkhBNTlNNXB6alNHWkRmaU11dHVJempjaFFVTS9VVjYwVVVVVVVVVVVVVVZGdW91dXJEb1d6RzQzbVI1MVpERVpzZ3V2SzlrZytnOVZIZ1Z5SjFRNjNhZzFHNUpiZXVSczlwZXlFUW0zZGlkbzlGS0dGTHo2NTQrVlZwcC9xaEswdGRSYzdIcUtSRWtqQVA1ZENpbFlCeUVxQkcxU2ZrY2lycmovaVU2ZTNpMlI1TnhPb2RMNnFDUUhibGFJaVZNdUtIWXVObGVIRW4xU3BKSTlENjFQdWozNGtkTjZubHBzT29MbkFnM0pTL0RqemhscU5KOXR5RmtGcFI5aVNNbkdRZUt2RzIzZHFTK0lxd2xMeW15NDJwS3R6YnlBY0ZTRkRnZ1pHUjNHUjlhZGFLS0tLS0tLS2pmVXJWZHYwVG9xNTZtdVRqYUdZVENscFN0VzN4SE95RUQ1bFdCeHpYemI2bmRWNy9xKy9TYmk5TFV0MTQ0OFpRd1FuMFNnZGtKSG9Cejc4MVhVaDl4NXd1T3VLV3M5MUtPVCtwcnozakhKb0RnQno5cXlEZ0F4eFZtOUlPczJydW4wMksxRm5QVGJRM0lROHVBODRTa1lQSmJKK0FsSlVrNDRJVnlPeEgwbDBGcXV6NjIwbmI5VFdGOHZRSnpRY2JKR0ZJUFpTRkQwVWtnZ2ozRlB0RkZGRkZGSlh6dS9HajFTbTZ4NmtUTk1RM3lteFdCOVVkcHRKNGVrSjRjZFY3a0hLVSt3SHpOVUEybHg5MUxUU1N0YWpnSkE1SnF3TktkTnBFMG9jdUMxQUhudzBmeUovMHF5Ykowb2pMYkFidHlTZDJlRTVPUHFhZFozUzl0cHRQaVcxSUFHQmxBTlFYVTNUV0lRb3RSakhYN3RqSDhPMVZYcUN5enJMSzhHU2s3VDhDeDJQOEE3cnJuK2ppMVkrNG5VK2pYM0ZMWmJTM2NZeVNyNENUNGJtQjgvd0JtZi90ZGtVVVVVVVVVaHI1T2RickxNMDUxYTFSYUo2U2w5bTZQbk9NYmtMV1ZvVVBrVXFTZnZUNTBVMHlxNVB1emx4eXZCMkpPT3c5YTZqMEhvUXFTaDFUUkNSKzhLczZCcHN4d05xRVl4N1ZzdjJFdWNLQ0NNY2NWRTlRNkZUSjNFTm96NzR4Vkk5Y09sY3h6VFQ4dU0ybFhoK2JQcURXWDlIYlk1ekhVelU4NTlEalNZbHFTd3RCVHdvdXVncDUvN1pOZHpVVVVVVVVVaHJsSDhlSFM1bTlSclRybTFOSVJjR1hVUXJrUW9EZkhPZGpoSHFVcTh1ZlpROXE5K2tHald0TzlLYlZPWXQ2Wk11VWp4RW9QK0lrbmJrK3dBelVpbmE1MU5weUVreU5KUkhVcEdGRk05dHNnL1JWU0hSdXZ2NjliMnVXMTZJOFU3aWtLQzAvUEJGZUd0dGN5TE13b1JvN1JkS0NVcWZYdFFEOC9lcStzUFZXOFgyY3FDN3F6U2NkOEVwL0tzS1VwMC9yVmoyTmliZmJEUHRWMDhCOVRqQ2t0UHQ0d3ZjazQvUTQ1cUwvZ3Znc1FvTjluckpFcWM2M0YyNTlJKy9jZmZ1Ny9BQ3Jvd1VvcGFLS0t4TkJOVngxMXNNaTdhVWt1TnY0ak54SHhJYVVrRktpRWxiU3ZjRUxTQng3MWhhclU0M29DelFZNjFOS1RibVVCU1J5UElNbXFtNmc5SGJGZjNXamNsWG1jODI0VnA4eHlyT1BMbnRqajJCSFBOVHpwaG9oblRzaEVrUWhFS2djTkJlN0NjQVl4MkhZZmVuUFhPbUlXb2VKRWRoWjJZU0hBY0RuUHA5S2dVUHBaWmxYZVJNa2FUaE9USGlRNUpiYzI3ODl5UVJ3Zm1PZm5WbTZTc2JWa2FiUTBsU0VCWENDb3F4OHNubW0zb1ZwOWkyVDlRU0drYmRseWx0WUk3QlQyNFkrMkt0WE5LS0tVVXRJYVExaWFidFNNZm10UFhHUHQzRnlLNmtEM08wNC9qVFRZbGgreXdYTVlCak44WTdlVVY2VENHeHY0d08vRmFscWwvbjVEeTIyMUlhWlZzQ2lmaVVPK0s4cnlGdHhSSVpTVkZzYmxKSGZiNjRvdDB0dVFsTGdJd3F0eDNhUUNrK3VUbXRQcFdseExlb3lwbFNFS3ZqNWJVZXkwN1Vjajc1RlRNVVVvcGZXc3F4ckdrbzQ3RVpIclVDdHR4VEFMOXRkd2xVZVF0cEF6ank3anQvaFdGOXV6VVczcmVmZUNRQm1xRTFmMVJ1b3VFZHZTU1pKWVlkVVhtMUErRzU2SEpGTkN1cHVvM05SV3k3dXZUVld0c2hMekRhaUVyeU9RcjN4OHVlYXQvUzNVQ3pYM3hqRFM1SEtQaVF0UEgxcDVrYWpSRFM0MjgrMkZJU1ZiVmNIRldCb2hPTktRRjg1ZWJMeHllU1ZxS3MveHA2cFJSU2lsTklhUTBsYTF3bXc0RVJ5WlBsTVJZell5NDY4NEVJU1BjazhDdWVsYS9zT3JOUzNtNGFVbkxkaUpYanhGdDdFcVdsS1VxSUN1U0R4ejdIT0s4dFd6bDNxMVE0c2VVR3BVa2hDY0U0ejhKVU0rMk9QU25TTG82dzZMc2hrU05TM050dlpseFRyaURoWHFlRUg5TzFORWIreVdwSGhhMjlXWEY1YThPSUtRbHZJUHFOcllGTjgvVE9uTkQ2bmpLZ3k1WDVlVVFwWWVmSy8yZ1B4RXE5RDdmS21hNDZnWWRSYzdnN0xRc2dGQ0FGZkVNY2dmb2Z2V3gwTi9GWXhQdVVIVHVyN1pFZ3cxWWpzVDR4VWtNZ0RDUEVRYytVNEFLZ2VDZTJLNjJTUW9BZ2dnOGdnMHRLS0t5Tllta3JTdjExZzJPeXpiemRIMHg0TUpoY2lRNnJzbENRU1QvRHRYQnY0bGV0cjNVK0hFWnN6RW1CWTQ4azdJcnlodmZjRzdEaXdPM2x3UW5KeGsrcHJTNklzUzJlaWR5MVBIVW9LdGwvVTNLVW5sUllkWmJ5Zm5oUUIrOVNHSnJPVEJ1Y1YxQ1V1SmJTb2VKbmNmT1Q1dWV3d0JpcmFnWHVKcUcyUjRjbC9QaXRrcUtrOEpIT1NyanZXdER0MW8wcXBVNkc0a2tZU041K0VlZy9ubjZpcXg2bWF1ajNDZUpERW55dG9JMk9rNGNHZlQ2Vm9kSllTOVc2N3M4QnhTWEdGQVNKS1VueWh0T1NjL1VrQ3VmSEk3dHB2a3lJNHJZN0ZmVzBmK3BLaW4xN2RxN0svRGQxbzFITzA3RWczZDBTV0xjVVJOemlSdldnQUVIY0J5UWtnZllkNjZwZ3k0czZNbVREa055R1Y4cFcycklOZTlLS1UwaHFPZFFyeTlaTk9QU1lxMElrcklRMnBSK0gzUDI5L25YQTNXVFZPcVhkUno0R3Biek9sb2RXVnNwY2RYNFMyaWNvSVRuQlQ3anVNZTJLcXU0bEtHa3NzbmNrTFdwYmZmbnR1QUgwN1o0cnFiOEV6VnVuOUxOUzJaWTMvbUo1TDZWZXVXd2tENWNDcXo2bGFZdStoYnErdzB3cDYxZUp1WmR3U3BuMlNTQnlPTzlOdG42Z1RvaUVKWHZMVzhyM0s1SEI1eDcrdkZldC82blRibEdRMHpHa2xlZTIwNEF4bjcrOVJCZHdsejVUY2RUYmtsOXhRU2hnSEpVZmJqK1AwcnF2OEFEZm9tVHB5MlNMN2VHMHQzQ2FrZVFjQnRBN0lIeUZjdjlhWFk5NTZ3WFpxd3gwcWNjbGxvZUVQNzU0bkJQSHpPTTFiZWtiYWpTMm00RnFRcERqK2ZGZmRRUW9LY1VjcVVENmdkaDlCM3EyZEE2MG02ZWZSaDFCakt4NGpPY3BJLzErZlAxTlgxcFRVZHMxSkNWSnQ3aHlnZ09OcStKQlB2OHZuVHhTMGxVOStJZSsydUxCWTJYWm9USVpLbm1Fa0s4TkNoOFN2M2ZiQjk4K2xVSnFPRlpOWjI1RUM0SkpVakpZZmJJM3NrL3dDSkt1eEhwengzeUFRYW9yWEdoYjlwaFNuM0cvelZ1emdTMlU4ZXZDMDkwSGdqblBJVnlTRFVnL0Q3MVFSMDl2NzZKemJpclhjTmlaQ2s1SloyNXdzQUR6SG5HSzY5VklzR3Q5T3R5V2x4NXNXVTN2YmRSaFNWRDMvM3prVlR1cStoMW1XK3VSWjVzcTN2RlJQa1BBKzNiNzFDajBmdnJyZ2hxdnp5a3FPRkR3eDI5ZWF0VHBUMGZzR21IMFRuV2x6Wm8vem51Y2ZRVkx1dUdya2FGNlpUN3FsYVc1anFQeTBGQjdsMVF3Q0I3RHVmcFhOUFREU2dzYlIxQmZHMUc2dlpMVGJod3BoS2h5cFFJUG5VRmNoV2NKVUNVbEpVcE05dENzS1ZjWmdVZkx2YjNIQUNjL0VkeHhnNTVVb2hQb1ZFazV3azNsK1RORnZ0alMzNU80aHplQ0V0WTRKVndDRDZZeGtFRVlUanoyejBwMUcvcE9PNmxMU1pRa0FGOHFTZVNNNHdSMkhmL2ZOWExZTmJXYTZ0b0NuUkZrRTdTMDRlTS9KWGIrVk9XcE5SV3F3Unc1UGZ3dFh3TklHNXhYMEh0OHp4VlVhcjZqM080dk9NMnMvbElJQlNOaC9hdUhzU1ZlZ0hzUHVhcUxWS3hKQ3lVcDJid3Q3UGRaUHFlMlQ4Ky8xNzFHZFkyU1V3d0oybnlJejNLa3AyK1ZmSElLVDNQb2ZVZHZjRnF0R3MzVXhVaTYrR3cyNGtvOFJZM05MYzR5MnJkeG5nSzJxK0lKUEdDY3RHb3VuK210UWhMOWhkL3F1UTZRVU5KODdLeXNwQ1U0UFlsVGlFWkJ4bExxamdBQ3QzcEhmOVZkTDd5MWFic3dtUnA2YXN1TXZ0Z3JZVXRRR0ZJV1BoM0RhY0tBK0lFZ1pycGkwM3pUZDNiUXQ2UzVDVXNjcGtJd1Bzb2NHbnB0clRLRWhadXR2VWo5NHlFZnp6VGRkdFk2VXRROEdCSlJkSkpCd21PZjJhY2VxM1BoU0tvTHFUcUtMZk5jdHlkUVRVU1pzTEtMWmEwWlF4SFgrK3M5d3NrYlFUakdVcTh3NHBrY3VyVGhNcVc2Z1JrSEtTUUVGMGM3UUVuZ2M3c0pIbEMxT29DbThwcnd1THVvTHpEUzVGVXFGRUxtZkV4bGJnQndTTW5qS2Y4UkpjMnFVaGU4QUtxdzRzRzNwZ01zMjVEVFRiUVNsUENWSkJBN2VucGp2L0FBcmVnNUtVcFZ3Nk1sU0V0WlFybnVDazROUDBXVXRoU1U1SUNoazRQT0IzK1dLOExsY3BFcVN0MlM4NjRyTzVaY0ozWTkxSDBINjk2YjF1S0pVbDBZYldDRWtuNC9YQXlRRDlqVEhlZkViQ21qdGJDeGpDZzZGSlB5VHNKT2ZUQklyMkF6RUNGTktTQTJBdER1VS9JYmdzRDI0Sng4bGNiUkZYTFcwM0xsQmJUYkNNK0lsRHFteGtIMFVjakF5TS93QjRCOGpVV3Uxbm1XeG95WWk1TG00N3ZCaXhtVU1KeUZad3RMaFR1RzQ4amIzQnhtbUMxNmlrMlc1SWNjWElham5LRlIxbmVoczdnVVpTU1FRak9Ra2NIYW52aXJWMFgxRnR0NGFlaU5RVk9OUldnNDQ0NGdLRFF5Y0pLZ2NsVzBEUHVva0FBRG1XemJqWTBhYkdyZkJ0UzdRMjBIZkVLMU9KWGtnQklTbE9lU1FNZDg5NmdmVVRxT0xWRFlqeFVlR21RMXZRN0ZRZ0pRU2NLUWtEUEtlL09RcnpKVWtaQnFxYlRJbVg2NXR2clV3eVhBZGdlMitHbHRJMjdmTW9lWGxRQUtoZ0VBSGdWYU9qYkF6R2tHWTRwNjR5azUyeVZCSkhZWktkaWxwQk9CbFNTQ2NjODFKSjZHbEpKV3RDWEVubENuQnVHU09NcVVUL0FPU20vcDJwOGpDUzYwaEtrdnI4dndGRHZsSHZsYVFsWG9PU2ExSFNodFFQN010N2NrSzhNa24xSnlqajdMK2xiRVdURUtRaER5TjNDYytNeXBXUGw1MS9yajFwVVMwcGlHUWwxbExDUnl2ZW53d285aHVDa3BDcyt5MEgwMm52V3JDVTZ0ZmlJQ2xtUWNBcFNjdWtkZ01ORGZqR2VBOWovbHJRdlRzT05obDF5SXk2bFhDVnVzTkVmUkpjYnh6N0k1OXE5YmJKYlN6L0FNTklZSWIrTlRUb3dnbmp1bGZsejI1S0FTZjh6SVRYaGM0c3lHK2gvWSsyMmxKVVNwbDRFRDFWa29RQnh3T2Z2V2hNUzNkVW1JNjlIbk91SktRMnBZa0tVZmJhSFgxRS9VRG4wcXJwMWxZZDF1OVo1RElqcEFVcndnMXMyK1hQd0tRTUhQdWtldFNMU2VsSFlUaHVVTXlIMkVjcTh2Q0JuQ3ZLRUFKOXR4R1J6anVDTEJiMG80NTB6QWhSVVAycEY4SzlpY09KU29uZWxPeE85Uk81WHFlM2ZhVFZiWFd4RzZMZGx6WG15cFRtNVhuVDRuQnhqSlh2STQ3a3FwZEV0eDR1clpDMFRHV1cySXdiUXBMNlVFa2tkaVgyaVR4emhaNzhpckl0TWQ2U0hIMVJYWGd2NFY3RnVKT09NWkxMb0o0L2VKK3RiTTNQbVpJOEJlUjVTb29XRDdCS2loWFBQWnZuMUI3VmxHU3pFVCtYbEtpTXF5Q3BMaWtObk9TZmdYNFpQMUtjKytlOVozRjVMVG9EejZrTEFLd3BiK3pJOUNQMnJaUDFHQVBTc2JaZEhIVWhwVjJLeW5rajgrcFhmMElFdFhKOWNpdi8yUT09XCIsXG4gIFwiLzlqLzRBQVFTa1pKUmdBQkFRRUFTQUJJQUFELzRnS2dTVU5EWDFCU1QwWkpURVVBQVFFQUFBS1FiR050Y3dRd0FBQnRiblJ5VWtkQ0lGaFpXaUFIM3dBQkFCOEFEZ0FMQUFGaFkzTndRVkJRVEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBOXRZQUFRQUFBQURUTFd4amJYTUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQXRrWlhOakFBQUJDQUFBQURoamNISjBBQUFCUUFBQUFFNTNkSEIwQUFBQmtBQUFBQlJqYUdGa0FBQUJwQUFBQUN4eVdGbGFBQUFCMEFBQUFCUmlXRmxhQUFBQjVBQUFBQlJuV0ZsYUFBQUIrQUFBQUJSeVZGSkRBQUFDREFBQUFDQm5WRkpEQUFBQ0xBQUFBQ0JpVkZKREFBQUNUQUFBQUNCamFISnRBQUFDYkFBQUFDUnRiSFZqQUFBQUFBQUFBQUVBQUFBTVpXNVZVd0FBQUJ3QUFBQWNBSE1BVWdCSEFFSUFJQUJpQUhVQWFRQnNBSFFBTFFCcEFHNEFBRzFzZFdNQUFBQUFBQUFBQVFBQUFBeGxibFZUQUFBQU1nQUFBQndBVGdCdkFDQUFZd0J2QUhBQWVRQnlBR2tBWndCb0FIUUFMQUFnQUhVQWN3QmxBQ0FBWmdCeUFHVUFaUUJzQUhrQUFBQUFXRmxhSUFBQUFBQUFBUGJXQUFFQUFBQUEweTF6WmpNeUFBQUFBQUFCREVvQUFBWGovLy96S2dBQUI1c0FBUDJILy8vN292Ly8vYU1BQUFQWUFBREFsRmhaV2lBQUFBQUFBQUJ2bEFBQU9PNEFBQU9RV0ZsYUlBQUFBQUFBQUNTZEFBQVBnd0FBdHI1WVdWb2dBQUFBQUFBQVlxVUFBTGVRQUFBWTNuQmhjbUVBQUFBQUFBTUFBQUFDWm1ZQUFQS25BQUFOV1FBQUU5QUFBQXBiY0dGeVlRQUFBQUFBQXdBQUFBSm1aZ0FBOHFjQUFBMVpBQUFUMEFBQUNsdHdZWEpoQUFBQUFBQURBQUFBQW1abUFBRHlwd0FBRFZrQUFCUFFBQUFLVzJOb2NtMEFBQUFBQUFNQUFBQUFvOWNBQUZSN0FBQk16UUFBbVpvQUFDWm1BQUFQWFAvYkFFTUFDQVlHQndZRkNBY0hCd2tKQ0FvTUZBME1Dd3NNR1JJVER4UWRHaDhlSFJvY0hDQWtMaWNnSWl3akhCd29OeWtzTURFME5EUWZKems5T0RJOExqTTBNdi9iQUVNQkNRa0pEQXNNR0EwTkdESWhIQ0V5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU12L0FBQkVJQUlBQWdBTUJJZ0FDRVFFREVRSC94QUFjQUFBQkJBTUJBQUFBQUFBQUFBQUFBQUFDQkFVR0J3RURDQUQveEFBOUVBQUNBUU1DQXdVR0F3VUlBd0VBQUFBQkFnTUFCQkVGSVFZU01STWlRVkZoQnhReWNZR3hrYUhSRlNOU2d2QkNRMkp5b3JMQnd0TGg4ZUwveEFBWUFRQURBUUVBQUFBQUFBQUFBQUFBQUFBQkFnTUFCUC9FQUNFUkFBSUNBZ0lDQXdFQUFBQUFBQUFBQUFBQkFoRURJUkl4QkVFVFFtRlIvOW9BREFNQkFBSVJBeEVBUHdDNU1WakZIV01WSW9CaXNHanhRbkE2MWpBNHBCcWVxMmVrMnIzRjVjeFFvb3ozMngrWFUxRitNdVBJZERnZUd5Q3pYTzZrazkxVC93QW4wcWw5WTRnbDFHOUUycFhVc2prNUNBNEEvU2lsWVM1MDlwR2szYnNsdEhjc29JQmtDcmpmMHpXdSs0MzBTd2pVOXAyN1NMemdMdWZyVlFUWGdsMDB0YWlXSGxIdzh3S3NQUElwblJwbWtWbkpQTnQxcHVLQlplTnZ4N3BFa0hhQ1o0WDhVSXlGUDZldFBWanhmb2w0Z1pOVXQ4SHFIY0tSODZvaThXRklGV1NkWXlCc0FjbjZHbzdlWFFWZ2x1N01SMWJyV2NESm5XcXl4eUlySTZzckRJSU9RUldUaXVidUd1TmI3U1FGanVIQ2VNYmQ1VCtsV1ZvL3RNdDd4MGl1Q3NmZUFKTy81MGxEb3Nhc1VFRTZYTVFrak9RZkt0aG9HQnhXRFJWZzBRRHJpc0VVZUtHZ0lEVVA0eTRuL1pOdTBGdGxweXBKd2NFZjFrWjhkd0I1aVh5c0k0bWM5RkJOVXR4TGVJMDkvZlR1dUlHV08zakxieVB2djlEbHZtYUl5UkF0U3Y3aTh2SkpibGlYR2NSNDJYeUZOVUZuSkxPODBwNXNOc25YbU5ET2hhN2NCV3k3WUp6MXEzL1o5d2ZGN2l0L2VRS1hMZnUxSTZEeit0TTN4UTBZOG1WN1o4TjZ2cUdQZDdXWllTY1ljY29xVFMreS9WWnJXRHNaSXc0Qlp0K2xYakJhUXhScXFScUFPZ0FwU3NJQnp5alB5cVR5TXQ4Y1VjNlQrekxpeTNtYU5iWmJ0RGp2YzJSajY3MHo2eHdMcm1teCs4WDJsOWxDUmp0WXlUeUgxcnFiczk4NHJWY1FKTEV5U0lHVWpCREROYjVXRGhGbkdrTnpMWlhCRzNNT284NmNJOWFBT0pMVmR1akt4eUt0YmpYMlRXenpTNmxwTE5HNWJtZUFkQjU0L1Nxd3ZOQU50bm5sTWpqcUJ0ajUxV011UzBTbEhpeTRQWmh4QUw5SHNqTHo0VG1UUHAxRldPYW9iMlJxMEhHVWFESlV3dXJmUEcxWDBhVm1CTllvcUdzWWR5S3hSMEpvRXpSY0laTGFWRkFMTWhBQk8yY1Z6eHhiSGU2YnJVdHJOSXJTd2xSc05qekRtUDNGZEdHdWVQYWRleEx4YnJCalpKR2plTW5IZ1Fxakgwb3JzWk1ZTEtEbW5FMXdNc0d5RUNnREdmVCt0NnYvQUVGakpwMERsUXZNZ1BLQmdDcUI0WUl2OVRpREt3aHVXV0lucGtsaG5mMDlLNkhpZTIwdXpSSGJrUkFBbzZrL0tobEs0VVBFUnhpbEdhWmJYWDlMbllCYnlNTWZCdGpUdWswVWloa2tWbFBpcHpVa2lzZzZDUTVGRjJpRHFjRHpOTmx6eEJwa0V2WmU4ckpML0JHT1kvbFdZRW5aaTlRbEd4NVZ6bHhpQS9FVjNDNmhXVWtjeWpHZm42MTBDZFhqdUJqc0pVNWpoZVliR3FPOXFOazY4VkdTSUFHYUFNZHVoQkl6OXFiRTZkR3l4dUpyOWxON0piOFoyMExrYzB2TkM1UGpnRWo3VjBINFZ6YndUZHc2ZHhmWTM5NFRIYkJnNWZHUm5sUFQ2MTBQWlhndjR4TkdwV0lqdTh3d1Q2NDhLckxzNTBLcUUwUm9UUUNQQnJCb3F3YUJNQStuV3VYdUxkTnVGNGp2b1ZCYVdhWTkzeFlrN0N1b2pVQzQrNE1UVmxpMVN4WHM3MkJnejltTzlJTStIK0lVVTZDbVErVFFHcytHTkpRVDkrM1dJTEc0R1VmTytDUDhYWDVVOWFkclYvcll1cm1DMmhVV1JNVWhra0xGcEFkd0ZBRzNybW1lL0xSMnRyYjJ6c0kwSXlXYnZIeEpJL0g4Nmt1bFdjZHZjU1hLUXYyVjd5U09zWTM3UURsWWtlb0ErbzlhU2FwSFZCOG5vYkpidlZMMW8wYmh3RXliQ1dPVGw1Tnh1M1hBcFMydWEzdzlhKzhMby92RUFZZ1JpY2MzWEd4QTN5YWxrQWhpVG4vWnVveUxqUEtJdjFOSjVHbjFxU0JHMDE3UzBpblZuN2RsNTNLN3FBcWtnRE9EdWZDcHVYNFdTMjFZMVQ4UzY5cVdwUmFYK3d2MmJLOEJuYjNtYm1QSmtMdHlqR2NuNlUzeDIzRUZuZHE5dlpXRHNXUE04am5NWXoxd2V1UjVWTk5Uc3BKTGkxdTdReEplUVpDR1VFcXlOOFNIRytEZ0hQZ1FEUldON0xlRm9ydlRVaWtYNE15aGd3OHdjZEt5ZEdhMW9odDFQcTl4YVhzdHpkdGJYTUtuc1Bkc2NwUG5oZ2Z3cUQya1Y1cXQ3WTNXdlB6WE41R1Jod0FRdVJ5NEEyRzIrUFdyZzFHd3ZidUV3RkxXM2pZWVprY3U0QkdEeTdBQSt0US9XdFBRNnRBVlRhRFpNRWQzQUhMOUthRzNRazZTNUlwekEvYWR4YXdNVmo1MktBNXhnTmdESG4wcm9mZzIzMUMwNGN0b05UWm1uUUVkNGJnWjJHZkhhb3Z3encvcDhXdUM5dXJSWmI0TDJtNHdzTyt4OGlmdFZqK3RXbC9EbGJCTkNhSTBKb0dIbzBKb2pXRFFKZ0drdDhITm5KMmVPYmxPTjhaLzkwck5hNUJ6UmtaeG1zWXFmV2JPV05lMWRHQ29Tek9Wd1R0c0FQblVqNFkxRko5TGdibUhPRnc0OGpTUGkrRUlwaTV4M2g1N2dlbjUxRE5PMWliU0lwSEVibEZtNW1ibHdPVWRRUHlwcHh0YUxZNVU5bHNYK3IydW5XeXZkU3FpdDRaM05WdnF2RmsxenFkeTJteTNFTVNNU0dFaHh0NDh2VGZiYXRzOW5OeHJxa0ppdlZoZ01CSklYSlFEdzMyeWFjOU40SHNyYVVDNm5lYkJ5M09nNzN6ODZoR2s5bllrMzBNRjNlYTlmUldGemVUM2pXOXpHVEdRT3pVTUNkdHVwd000OGFlNHVPSmJLRkxUVUloem9SMlVpOWNkQWNmY1ZMSmswK09GWXhlRm8xR0FnY0txajZVMFhlZ2FEZDZiZDNEUXh5TXFraWJKWmdSMHdTZk9qSm9QSDNZOEpxdmI2YWx3UUVMcmtiN0g1R3E4dmIrVFVkY2tXRWdvb1BLZlhIWDh5SzFhdnhDeTZkYWFaWlNSbElvd3hrejBPYzRIM3JWdzlhSDM1NVJJZTFZRTh3NkJpU2R2VDBxbU9IdG5ObHlMcEV0MEhTUGVwQ2J4NXV6QURkbXVGVnoxd1dHN0RwdHRVME5NdW1LVWtRcnVoSHhqOVB5cDZOTkxzNTFzRTBKb2pRbWdNUFpvVFJHaE5BUmdtZ2JwUm10TThxUVJOSTVJVlJrNEdhd0NHOFQyZmJUbGp2dDhJOGVnRlZicXlHeVJBemttVU92SVR0NmsrdjZWWnZGRnlqU1J5Yy9aZzVDcWNkZkw4NnE3WEZrdXJwWGlkZVdKTWNyRW5mZjA2YkdySkdOUERlb3o2WGVzNnZ6RUQ0Vko4UDhBN1UzMXJVanFNY0lobkR5dU9WdXpINUErcHF1clFDSnBKRjV1Nm1BY2s0SFVrNCtYalQybDlQWWFjMTBnWG1YSlRiekdTUjU3VWtzU2V5K1BNNDZGdGpvN1JTU3RlWGJkb1dWa1VINFFUZ2cwNzZocXMxdm9jOFVPT2RINUNGYnB0a2ZUOWFpTm5xc3QxZkNUbVBQTTNjenNGeGpKUG9QS25DL2tsV1NhUk9RUXVuWm1QUHhnTURrajY1b2ZIYnRqU3pVcVExMmJMYzJTRlFBanQzbXlQaS9yRlNyaC93RGVXMFNrTDJzWjVXSUIrM3lxSWFOSzZYTThFakgzY0U4cUFucm5vUHBWaTJhTkEvTWhUbWp4eXFjNCtueThmV3EwY3paTXRQUlZVTXZlQkE4S1hta3RxTzZKQVZWR1VNY0h3Tk9CdG41Y3BoaGpPM1dweWl3cG9UbXNHaVpXVTRZRUgxb2FVY2ZEV3RpQU0xakRuUE0zbnNQbCtwbzJqQUpBR0FNajdDblVGN0pPUnJJWXEyeFVqT0I4cVNYc0t1SERBNFg0ZlhIL0FNcHpJdytQRC84QVZKTGtjMGJMdjNrUDA2L3JUcFVLVjE3U3JlN1RocDcyMDdza01SZGNkU0FSay9odFZjVzBqWGNVcXNRTWhXRHNkbVhHOVhoeEZIQkx3NWVDN1Y0b1VpWlhkeGpLOHU1SHB2OEFqbXFMNFd1WWIyMkdsM0dGdVl4KzVKL3ZGL2grWS9ycFdrbWx5WG9wQ20rTE5NeU1KeW9iOXpMbHVjakFZZGY2K3RLdFFtak5uTkc1Q3QyYWpDcVFCeTQ3b3B6dmJDNWhWV1ZGWlUvczR4blBYT0thNythQ1lpWnJkaWNmdkVVNDNBOFI0ZzBJeVROS0RpYUxGNG9jU3BPWGpKNzRRZDRuK0gwKzFIZTZnMXllN0dFQzVQWmtEcjVuUDQvU20rMGJsamRnb1ZTd0xCdXJBZUEvR25qVHRNdTlVdlVZV3FKR293U1dPVzIrL3dDRkZ0THMwWXVXa2UwS05lMEx0R0ZSc2x5VHVkeHY5dWxLMDE4eTY5SFpXMGJjMDkwRTUxazZEZk80cHkxU0MwNGIwdHBwT1V6TU1ReGs1SlA2Q290d2tvUEZta3ZNQmhyeVBPZlZ0L3ZUNGx6VGw2RnkxQnBleS90TmhNR2tKR2N1MFNtUG04Y0RwOWQ2ZmduSU1EWXFjRDVaSXBydFpZVmMyNzVFczBqbFJ5bmNKNjlPbVB5cDQ2a0UrUDhBNUNsWXBybFZHWHZJR0dPbjB6U0tTeVU1S1NZeDFEVTRnRE8vamo3RVVQSUdDajBBL0VZcGFUN0NtMGVicWY1dnVLODN3bi9NZjl3ckxmR1QvbSs0b1Q0ci9pLzdVUUd4aGx2Ni9pcExOMzRXOHdPWC9TYVU1dzQrbis0MXBZRHM4K0JYODhHc1lRV2hqdWJTNHRMaFVidlNLVWJmS2tuTzFVUjdSZUhvOUY0bGphekpSWllWbFJsSEtGWWQwNHg2Z0g2MWQrcmFaSTdMZFdiRlo0MjVsd3hYbXl5a2c0OEQ0MUcrTU5HbDR0MEdjTFllNzZscDVMd3hodVl5TGtnZ2JEcmo4Y1ZYRzBuK0N6VnJSWFdnY1gyN3N0cHJuY2ZvTGpIZGI1NDZmUDdWSnJ6aHJTdFJoOTR0cnFGbEl6bEpWSVA0R3F0bWpCQlIwM0J4eWtZeC93QzZUZTZJUGhaeG55TkdmaUp1NHVob2VWSktwYkpxOWxvZW0zYkxlMzBYS0QzZ0g1eWZUQzcwcHV2YUJwbW13bURSck41WEkybG5ISW8vbDZuOHFnUXRGM0FadXZuaXRpUW9qQXFBUFUwWStMSDdiQkx5cGZYUnZ1cnU4MWE4TjNxRXJTU0hZWjhCNkRvQjZWSWVFT0hMalhyeTRhM2NvMXJHSlkyQS92TTVRSHlHeDM4S2pwMkdkc0NyNjluSEQzN0g0V1NXNFRzN204YnRwUE1ML1lYOE44ZXRXeU5RaFNJUnVVclk5Nlp6R1k4c0pqV1FkckxrN2xzWStoMjhPdFBmUUQwejl4U1MzaEVNOHhBeHpubUcrZHQ2VnY4QUMvbU9iN0N1Sm5RZXh1bzhteC9xckFQL0FGLzVySnoybjg0KzlDUEgrWDdtc1kvLzJRPT1cIixcbiAgXCIvOWovNEFBUVNrWkpSZ0FCQVFFQVNBQklBQUQvMndCREFBTUNBZ0lDQWdNQ0FnSURBd01EQkFZRUJBUUVCQWdHQmdVR0NRZ0tDZ2tJQ1FrS0RBOE1DZ3NPQ3drSkRSRU5EZzhRRUJFUUNnd1NFeElRRXc4UUVCRC93QUFMQ0FDQUFJQUJBUkVBLzhRQUhnQUFBUVFEQVFFQkFBQUFBQUFBQUFBQUJ3UUZCZ2dDQXdrQkFBci94QUEvRUFBQkF3TUNCQVFEQmdRRUJRVUFBQUFCQWdNRUJRWVJBQ0VIRWpGQkNCTlJjUlFpWVFrVkl6SkNnWkdoc2NFV1ExTFJKQ1ZpY3ZBelU0S2kwdi9hQUFnQkFRQUFQd0M3MXdFRmhRWVNBVG5jZTJodDkxTGxTd1dscUNVS0pQc08ydGxibVZTSkhERlBhSUdRRkhTbWxTM3BMWEpJU1FwS2Q4Nkt2RC9rRk1aU2s1R0QvWFdxNnFjdVpOWlVscFNnam16Z2UydEROT0xUSTUyeWtEcVRzTlIyNmVJTmlXVEFmcUZ4VnhscEVkdFRxa0lQTTRRUFJJM09oTkk4VGxqVktweEtlWmJGT2Nsa29haHlwalJsUGhRK1ErU2trcFBRNyt1aHJZY2VUVlBFclR1S0U2NWFiSG9WdnJreDVxWnpvaU9OaHhuRGF3aDNDbEpKVU53Q1BycS9QeHNPWlJtSElrcHA1Q2dGcFUyb0tTcE8yNEkySTF3MjRsOFA3N1Z4TnU3NFN6YTYrMmE3T0tGdDA1NVNWSkw2eUNDRTRJMDFSK0hYRTllQTN3NXVaUjZERktmL0FQem90ZUdhMHVLZHE4VjRFcWZ3M3VWaUZLQlplZGNwanlFSUI2RWtweHJwVEhwa2w2RXlwVVYwS0xlRkFvT3gxRTc0Z00wMkdtZFZFcmp4azVDM0NuWklJNms5dEVTYzBwVVpTaTVqWW5KN2FoOElGTHlrTkFGSlZnRWFjNmhUbTNtQnNrNTNJMUhxaXNRVklaajVjS3RzcFR2N2FKWERaNG9wTFNWQTVDMVp6NzZua21SUzQ4WnlaSkNRbHBCV29rakFBSGZWVXVNWGlFaXNxZmJwakRtQVNHV3cvd0NXY0RZckFHNmg5QjEyQTNPcU5YbmZVV3VYUzNjM0ZWRSt0QitXUGhLQkhXcnltb3JmK2RJY0dlY2pzbk9CZzdkTkphMS9odWxTa08yZncwaFZTWlVlZXFTcE0wTFNobEtrN0pHQ0JsSUkyN2I5OXRDR3V1M3pMODJydlZWeUd3aDFSWVRDY1dXMXFBd1ZZV3JaUGJJMk9PbXI5K0JueHRPWEtpamNFNytqb1ZNWmlLYXAxUWpkSFVOREpiZFFjY3Fnbm9Sc2NldXIrUllWSmt4a1NXM2tsTGc1Z29IWTZ6VkJwb0d6djg5Smx4b0FWanpNajMxZ3RpQUJzc2FaN2dwVkdxMU1rVTZveDJwRVdRMnB0MXR4T1VxU1JnZzZZcXBiYXBzSnhzeTNFQWdqS2UyaGZiOVkrR2hxYW1PanprT0xCUFRQS2Nha2JVaHlveHdvTy9US2UydmwwaEMxZ3ErYkNzNUJ4alU2dEpsdHVBQWdKMlVlbXF4K09QeEl6YkFvc2pobGE4eGxtdDFWbExqN25NU3RpT1QwMjZGV0Qrdyt1cWJVSy8xMWVRM1VYRVRxblZmS0FrRkF5cHhYNVVqbko1VTR5UWxJMlNNbmM3aVFVUitxVG1ucWpXN1dWR2pvZktYU3cyRnBpdHRnY2taQk9BU280NTFqYkF3T3BJY2JscUZaRk5kcEVLZ1FhVWtvRHIxYXFnUGxyQlA1QVc4TFVuZkFRa2I1NjQxV2krRXpUTStNdUtvVTErR1Y4bmxRMjFzdnlVOXlncUN1WDIyQTlOUmUyNzVydGpYSEdyMXBWVjVvMDU5SzJHSFhQeFVvM0JBUGJZa0hHMit1ZzdQajB2Vm53cEk0bFdLM1JEY3R2VldQU3ExQm1oVGlVTk81Q0hrSTVnY0VoSTY3SE9nZTk5cUw0cFpLc3hoYXJPZXpkSEtnRCs2enBCSyswbThYMGdIeXE3YjBjZXFhSTEvY25WaVBDVDR3dU12Rmw2VlNiOHJWUGxTMmlRbFVlQWhrL1RJR3JCWFhlTjRDMEt1NC9YMHdYVXNxNVhmTEE1QmpjalJUY3FjNVZJZDVXMUlXR3poWDk5VmQ0a1RLaFFKdnhDSmEvblhnSUNkdVluUHYzMUt1Rzl4WEJPVWhNNWg1REt1K0QvSEdqVVdraUdsWkpCS2NnOHVuTzJaY1duVU9YVXFoSlMzR2llYkllY093UTJnRlNqK3dCMXhiNDY4VjUvRm5pZmNQRVdVNDRtUFU1N2k0clJLajViQStWcEtjOUFFZ2Z4T21peTd0aXdaSzAxcVU3OElocGJ5SXpIeWw5OEQ1UXBRMjZkYzl0RWFrOFpLcFhxbEZtMXlZRVV5TThscW4wR0dvcE1xU0FBSFhGOW1rRTU2Ym5Va3ZDNmFnS0xPcXRVclNIRlE0N2dpeFFySWpxVU4vay9PNHRYVXFLazRHUGJWVWE5V3BGVWtDYTk4UW9ySjVTc2tBNDIyMHdQS2tSeVFIQ2hmTDZkQWZyb2w4QnhVS2xjc2loTk91cVJXSXIwVmNkRGZuQjhsUE1FK1dkbEhLUmp1RDAzMDB6NjNTSThoNXBpTStDaGFrbEJiNVNrZzRJSVBUR21lYmNUaTBLU3hFUWdlcWpuUmg4RmQ4eUtQeHhwbFBtemkzR3FhZzN5ZzhxU3NkTTY2bzhWS1JDbFdSVWtSUEw1M1dDdElWdUNTTjlGR3JzdXFvN3NhTGhLM0VjZ1BwbnJxcTkxVzdQbjNhK2lwUHV1dHRTT1Zocy9NRHZ0dG8xV2pDaHRRRU5OdGtLUmhKSUdOZlhMZEx0TFI4STIwNFU3am1LeHRxQmNadU5IRCt4K0NVcWxjUTVGWVF4ZWlwTklRbWtxUUpZYUtSNXEwS1VNRENWQWREK2JYUG54RmNLZUdObTJyUkwzNFNYalVLcGIxYWVWRlZUcXFoS0o5T2ZTbm1LSE9YQVVNZDhhcjYyWFdjT0hDMG9WemNwL0xwd29VYW8vRW9tTnVPTnVMV09SS0NjNHowVHF4a3UwYTlONFd5M0lzWjJRODhFQ1ZVSHdBaHZtTzdUU09xbGdkVm5JQXozMVhHNjJxZkRTMGFlbEsyVXJVd2xXZW1Qb2Urb2o4V2txd3JtSkd4enZvcmVHNnNScUh4aXRpc081VEZibk5OdmtEbVQ4MnhKSHNkTS9HR21QVWJpdmVGS2tNQmxjV3R6RWNnR0JqelZFRWZRZ2cvdnFHT29IS1RyYmJsYWwyemNOUHVHQTRVUDArUWg5Q2gxeWs1MTJ2NEgzQlNPTm5DK2xYSTAraDBTWTRROEFkd3JHQ0QrK2p1NDJueWlGRDFPZzFkOU9wbHZSNmpjY2wzeXdGS2RXb2ptV3ZIWkkvc05aY09xaWlzUm01NFBsTUtVVm9Rb1lVZHYxYWRMdHA4V3BLU2ZNQ2p6N2dEYlZYdkZkWUYyWFZDdGwyMFdJN3oxS1puZkQrZmdvUTRwYU9aZS8wQ1JudG5QYlZNN3N0ZTlvWEN0TSs4NlUwdzlPckMxc09mRWhiaXlBVUhLRWpBSHlISGM2aDF2V0pjVlhobVMxVG4wdDgzSTI0cHY4TmF2VFBRYU1kbWNMVXdLQUt0VkVKVk5hM1MyU2NqMEF4MDFLYXhWYW5VYmVjcEVSOXlQR3ByZm1ocG80TDBsZXdRbjF4cXFkNFc1V0tZODdHbE5Md3l0UVdDT2lpZm0vbnFHdU1QSVVSeW5KMk9wTll0VG4wVzVLYlZhZW44VmlVMlVnOVFvS0crL1hVaDQ3M2UzZEhGNjQ2MTkzbUUvSWxZa29Lc2hiNlVoSzNCdHNGRWMyUHJxR0JhVnQ1MGxVTUU2dmY5bVR4eCs0N2luY0thMUx4SG1qNGlEenEyQ3grWkk5eC9UWFQ2VTY0ODA2R3dRT21Ub09YUkRlcjcwK216SEQ1YUNXenQwSFhBMGhwVk5rVWltL0FVK1o1WGxoU1FvN25XNnk2WmRWeVN6R2x5MWZETkt6SmtrYklTT3cvNmoyMGw0cVZmNEZkT2pVQ25JV1k4dHFNeTBwUE56TnFQejU5UVFUblBYVmIrTzNCd1RaaWFEUW9NYUhIRlJlbkxpSXlwS0ZQRk9TazlnQnpISFRmVGltTmJscjJ6Rm9VaW5zTndJcVFqbTVSZ0s5VC9BTDZiYXZSS0U1RldZOGxNWU9qOE5ZVUNoWHBqdGpRdm13WjlIZkVxUHlMa3N1bDFLaHVrN1k1Z09tZnJxRlZkVUtvZWJEcXRJVHpxQ3VkMEVFckpPY25UWFpmQVdKeFl2eWwyUmF4VWliVjMwc0JTMDVRakorWmUzUUFaT1BwcXlQamg4Sy9DSHc5OEc0ZDhXQlFwRE5WcDAySERVWDVDblduVTh1RkxLVHVDU003SHZybmRlMTNUYjN1Unk0cWcyMGw5NXR0dFJRbkJWeXBDUVZlcHdNWjc0R2tiSzhOL1RHdkVOdXZ2SllZYVc0NDRvSlFoQ1NwU2llZ0FHNU9pend1c0hpRmFGK3dxeEtpeXJkcU5JOHVjV3FneXVPc3RIb2NLQVBLZlhYZFY1WkRKNVU1T05EcGR1MTJyVDV6TklwN3NtUXBlT1JJd25idVZIWWFjclY0UlZkRDZwMTNUa01qbXltSkZYekUvOXkrM3NOVENwc1FhTFN6SGh4ME1NSUJ3aEF3UGMrcCt1Z3pPbHgvdlJVcVNoS2xGMVNteDZFZFA1YUh0eHg1TlRxSzVxMWdFcTJWK3BRQjlmWHRxSzFsaUF1TE1wTlJoS2VqeTJsTnF3QmtaR3gxU0s1NjljSERhdXpxQzFWSGx4V25sRm1MTFFwYlRxYzdFWTNTckhjYWo5dWNXYm9idU5IeFRyaGd1ckNWUlNTNkFrbjlPZHhvbDNUZGRtQ1EzR1lvOVZxTDZ5a0VNSVNFaFIvUWR5ckl6MlNkZEFmQkp3SGR0Tmh2aVZXNDFEYVhQaS84QUsyYWU2NCs0aEMrcmpycWdrRldNamxTTURmZlViKzFVaUYvd3lUWFIva1ZtRzUvOWlQNzY0MEo2alRuSGJMZ1NnRWI5OWRDdnNsTFE0WHo3cHZHNXExQlRWTHRvcUdFUTI1RVlPTVJvcXllWjVCSU9IQ3NjdWV3NmRkVGY3VTY5TFdSYzFpVWVsU29ZdWtOeXZqZkxXZk9ZZ3JDZkxDeDA1VkxDaU03L0FDblhRdWoyckllWVE1Vk1zOHdITTJOMWV4UGJVb3A5TWlVNXJ5NFVkTFNjNVBMMVY3bnZwQldJZ1NoVWxwT0NOMXBIOWRENjhWRjJsdkpRZm1BOWRWVTR1M1ZVTGVndlZpbkk4eVJUMUlub2FIVjBJUDRqZnVwQlVCOWNhMnF1R2t6YUZIcnNDU2w2UFBBZGpPWnlGTnFBSUIrdS93RExVVnE5eFI0eVF0NXNPQkpLVGs1eG9BY2Y2cmJGY2hKWmkwYVBKblJ5QXFRczhpR2VZOVZxSGJ2cmZZWGhrK0FlYnFGVGFqeUhTT1pEMGRSTENzcHpnWjZZL2dkRHZpSFM0SERXUElxZm5vL3hCVmZNYXB6WDYyR2lTRnlUL3BPUGxRZlU1SFRYVnZ3aFBGM3c5Y1AxbFJVZnVLT0NTY2tuR2hKOXB2RFhQOE1WYWJSK2lvUkZuMkM5Y1kwMDhOcVBNcnBwNHRxR3FwVnVIUjJFQlQwMTVMRGVUakNsYkRVeXNlL09Mdmg0NGl5cGZENjVaVkRxcmF6RmxjZ0NtcENBclBJNGhYeXJUbmZCMHQ0bVg5ZG5FcThaUEVhL2FtS2hXWklRaDk0Tmh0R0FNQktVRFpLUjZEWDZLRzFNUHA1MExTdEo3QTUzMW0yc0pHM2JwclEra0tTb0gvd2FHOTUwOWNScFpRa3FaY3lCL3dCUDAxVG5qUkpSU25uV1pCenpFOHB4alFjczY2eXhiOVF0bHB3cUVSMVVxQzNuOUJ5VnRKSHZ1UGM2aWwwOFQ1RldrcGdwa3QwK084bElSTFdQeWpwdm5ZSFVVV3pjTDhlWGExVnM5bTRZTW9jcmRZb0xpWEZLQ3M4cGNhQkl6azc5TlhTOEtYZys0cVV1MEhuZUtGMi9jemN1T2Z1bW5zcDg1K0tDbjhOVHdWOG94c2VUcjFHZGM2L0VQd3k0a2NKZUw5ZXRQaWhJZG0xbHQzemhVRktLa1RtRmYrbTgyZjhBU1J0ajlKQkhiWFhEd1RTVlNmRFh3L2NVZHhTVUkvZ29qVU0rMGFZZWtlR1M1MHNGS1ZKZWpxMzlBNE5jV25vOGxMZ1FwYVNUMzArMnZTWk5NdUNrMWwyUWxMRWFZMDh0UU82UWxRSjFZdmp6UkxQdWEzbDM5WlRpSDNXMXArSlVnQWs1SGZWZjYyOEhMYWtPQS9PaDlJUHNScjlHMFpvUVJpRzhVcHpubEp5TkxrU2t1bzVpa0pVRGhXRHRuV3RUNFVDQjMwMjFPTTFLWVcwNmdMU29ZSVBmVlVQRlB3cys4NkMvVW9JVWgxb0tVMlFObEVkUWZycm5SSnYyb1VHcHJnSllVSkRUaFNWWTM5OUhmdy9jTTdGNDkwU3RtODZxdW15YWM4aFNBeXlsU1hVRVpWa0tJNzZQWEFUd3c4SnJMNGgwdXUwcVZOcjAyRk1TN0hFbHBMY2VPZ0JSS3ZLQklVb1kySk8zWEdycE9wVTByeldpU2s3alZRUHRIdUVOTDRoMlJhMTZ0UlFLeFJxa2FjcDVJM1hGZlFvOHFqM3d0Q1NQYyt1aW40VUtRcTNlQjlvMFpZR1lrSGtQdnpIVWE4Y05yVmE5T0FsdzIvUTIvTWx5Vk5jaWZYQ3dkY2thdjRjdUtjQlFkZG9MM3k3NUF6cGxtMlRmdFBaK0hmb2o2UU5qOHAwVUxEbzFXcGZDV2RHblJGdHVWQ1ljWkg2UU1ZT2hQVjZTc0xxbEt3cmR2blNCM0tkZm9kRXBTVDFPc21xZ1E1aFlIekRHZGJVVEVBNVdyQUd2SEpDWFVrRCtlbUN1VWVEVzRUMENveFc1RWQ5SlM0MjRObEQreCtvM0dxTitJWHdPMWVYVUhibjRYTGhTbHJWekxwODUwUjN3TzZXM2orRzUvd0RMbFB2cUE4QXVDSEdha1hIS2hWT3hhelJZeWxKRGhlNUEwdFBjQlFWZy93QzJyMzhNckxSYTVYS2xLYU1oUThwdExTdVlOdDdaeXJ1cy9UWUQzMFRFVEFXd25INUJoSk9tSzhhRlM3c29wcHM2STI5SFU4Mi81YTA1QVduUCsrazl1MGRpZ1FXcWZEYURiTEl3bEtSZ0FhYWI4cHN5czBoMkhDYUMzRnFCd3Iwem9WVkRocFgzMlMyYVd5clByalErdUxnVFg1UVdmdVJqNWoyQTZhSHRWOFBkN3RNS2pSNk9WUlNvcUxPZmwzN2pWUk9OMWxWSGgzZTZHWmtOVEtnb3BjUW9kTWpvZGR2eXM5anJ3TFZrSHVOYkhGSlpiWElrT0JEYUJ6S1VlZ0drRGwxMEJoenlWUzFxVU92SzJmNjZRVmU5S1BBWTg1RFV5UXJsVXZ5bVdzcklIWFluUVV2YnhYUmFBNHFESDRaMUNYekhHWnNsRFNGajF3RXFKMUZiSjhSWERhdFhNeWl0V3k5YnpzdVFpT1ZzUzFQTUljVWNKNWs0MjM2NEdyU3hHSDRRL3dDSENIRW8yT0Jrajl0TDI1TFV2Q0pLT1ZRNkViRFNlVkxiaHRrcUlDZWJiU00xbU1UczhOWUdxUk83cWM2OCs4SXAvV2svdnBOSXFNTkd5M0VmeTBsRlZwcnJpV0VPTkZhamhJeU45VTcrME00TTErNnFOUTdpc3EyL3ZTcXV6VzRqa2VHd1ZTWGtuUExnRHFBZTU2YXZLaFJPdzYrbXMwcUNWRG5HQjMwcWZMQmpPTXY0TGFrRUt6M1NScXYwYTdwTlptTGtDV1lWUGFWaEFDUnp1QWQ5OEVEVXRvVlRRL05ZbVBQK1lscHhLMGdxR2VYb1I5ZHRNSEUzaGpCcU1sNk1xRzBTckxrWjVUZk5zZHdEbmJwcXVkeCtIKzRJTldwdFdiaXJmaXhLZ3hKZDhuLzIwdUpVcllmUUhWNHg1NnlKTVYzbWJkL0VRb0hxazdnNTF2VFdTMHNOMUNPU2xSd0hDTWIvQVBkMC9qclRVbjJaYkRiMGR4TGpiaWlwS2djZ2pHbTNrMi9KclV0S2MvbEg4TmExWkg1V3MrMmtNK1BJVzJvaGdIYlk1R2hGZGZGeTI3S3JEY2VwR09tV3lyUGxyY0NUb3M4TUwzWXY2ak5YSzFHUTAyc2xMT0ZCUndPK2ZycWJqbUhiSkJ6OWRibGxMalpLVGtIY0VkUWZRNjhaZTgxYlljT1FFa0VIVlk2dzNGcFZSa3ZlYjVxVzVLbXZtSlNPZm1QeWVnMit1bE1UaXpTS2JNUlNLVkMrOEpyNUhsc3cyeTQ3elkzVHRuNjdhVjNoeHh1K213cVkxTDRkVmlPbERCVTlJa01nSkNlYllEZnNQNjZaSWZpT3A1QlROZytVdkg1T1hjL1RIL25mUms0UGNSWXQ2UWFqSFphd2ltdU44bWV2STRDUU1kc0ZKMFFpOGx3RkJocFdnOVFSa0hUSzlUb3ROaVI0VUZuNGVPenpCRFpPZVhKei9YT3NlWFlFSEkxZ3RBVDh3R2RKMVBoT1FVa2F3YVdwMVJBeHkvVWE1OS9hS2NIcS9TNnRHNHQwQ1U2dW5xYUVhYTBnbjhGWVB5cng2SE9QZlZtL0NESWNnOEc3WWhTQ3NQaUNoYmdjQkNnbzc3NTk5V0xHVkpLaGpJNmpYeUNRb2dmbFZ2alNaTTFsdVFsbFNnVkZXeWU1MzF6MnJGYjR1WHJjVlVjZzB4YzJJYWkrcHBwY2x0dEF3NG9KS2gzT050ODZMZkJSZkVtMmJ1cHMrdTIxRGlRa0xLWHd3aEtqeUtCR3loMzNCMjFhV0lxQlc0OGlBL0hhZGpPRXBVaGFRUmhRM08vVFFrbVdGUkZTSmNKNmx4V1pQek11S0RZQ2xBSEhYcmoyOWRTTGczYWxOdEtvMU9EQ0hKOTR0dHF3VHNWTjU2ZnNyUlc4cFRYUldBT3VtU3FQb1hLV0hEbEkyR3ZJeVVMUVNsV0I2blhpMkZOcHp6QTZUS2E1emxSQTFyVUVObkFQOE5NZHhXaFJyM2hyb053VWRpZEJlSUx6YjZlWkpBT2VudUJvV1VTNm1LWnhHckZGWVFsbU95LzVUS0U3SlNsSUFBQUd2Ly9aXCJcbl1cbiJdfQ==
