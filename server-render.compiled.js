"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _debug = _interopRequireDefault(require("debug"));
require("core-js/proposals");
require("regenerator-runtime/runtime");
require("@babel/register");
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _express = _interopRequireDefault(require("express"));
var _serveFavicon = _interopRequireDefault(require("serve-favicon"));
var _http = _interopRequireDefault(require("http"));
var _react = _interopRequireDefault(require("react"));
var _redux = require("redux");
var _reactRedux = require("react-redux");
var _ducks = _interopRequireDefault(require("./src/ducks"));
var _App = _interopRequireDefault(require("./src/components/App"));
var _HTML = _interopRequireDefault(require("./src/HTML"));
var _server = require("react-dom/server");
var _reactHelmet = require("react-helmet");
var _reactRouterDom = require("react-router-dom");
var _pathToRegexp = require("path-to-regexp");
var _products2 = require("./src/utils/products");
var _package = require("./package.json");
var _deepmerge = _interopRequireDefault(require("deepmerge"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
process.env.DEBUG = '*';
var API_PORT = process.env.API_PORT || '8081';
var PORT = process.env.PORT || 8084;
var debug = (0, _debug["default"])('chums:index');
debug.enabled = true;
var categoryProductRegexp = (0, _pathToRegexp.pathToRegexp)('/products/:category?/:product?');
var app = (0, _express["default"])();

// app.use(compression());
// serve our static stuff like index.css
app.use((0, _serveFavicon["default"])(_path["default"].join(__dirname, './public', 'favicon.ico')));
app.get('/chums.css.map', function (req, res) {
  res.redirect('/css/chums.css.map');
});
app.use('/css', _express["default"]["static"]('./public/css', {
  fallthrough: false
}));
app.use('/js', _express["default"]["static"]('./public/js', {
  fallthrough: false
}));
app.use('/build', _express["default"]["static"]('./public/build', {
  fallthrough: false
}));
app.use('/images', _express["default"]["static"]('./public/images', {
  fallthrough: false
}));
app.set('view engine', 'pug');
app.set('trust proxy', true);
function loadManifest() {
  return _loadManifest.apply(this, arguments);
}
function _loadManifest() {
  _loadManifest = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var manifestFile, manifestJSON, manifestFiles;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _fs["default"].promises.readFile('./public/build/manifest.json');
        case 3:
          manifestFile = _context4.sent;
          manifestJSON = Buffer.from(manifestFile).toString();
          manifestFiles = {};
          try {
            manifestFiles = JSON.parse(manifestJSON || '{}');
          } catch (err) {
            debug('loadManifest() error parsing manifest', err.message);
          }
          return _context4.abrupt("return", _objectSpread(_objectSpread({}, manifestFiles), {}, {
            versionNo: _package.version
          }));
        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          debug("loadManifest()", _context4.t0.message);
          return _context4.abrupt("return", Promise.reject(_context4.t0));
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 10]]);
  }));
  return _loadManifest.apply(this, arguments);
}
function loadVersion() {
  return _loadVersion.apply(this, arguments);
}
function _loadVersion() {
  _loadVersion = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
    var packageFile, packageJSON, _JSON$parse, version;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _fs["default"].promises.readFile('./package.json');
        case 3:
          packageFile = _context5.sent;
          packageJSON = Buffer.from(packageFile).toString();
          _context5.prev = 5;
          _JSON$parse = JSON.parse(packageJSON), version = _JSON$parse.version;
          return _context5.abrupt("return", version !== null && version !== void 0 ? version : '');
        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](5);
          return _context5.abrupt("return", '');
        case 13:
          _context5.next = 22;
          break;
        case 15:
          _context5.prev = 15;
          _context5.t1 = _context5["catch"](0);
          if (!(_context5.t1 instanceof Error)) {
            _context5.next = 20;
            break;
          }
          console.debug("loadVersion()", _context5.t1.message);
          return _context5.abrupt("return", Promise.reject(_context5.t1));
        case 20:
          console.debug("loadVersion()", _context5.t1);
          return _context5.abrupt("return", Promise.reject(new Error('Error in loadVersion()')));
        case 22:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 15], [5, 10]]);
  }));
  return _loadVersion.apply(this, arguments);
}
function loadMainCSS() {
  return _loadMainCSS.apply(this, arguments);
}
function _loadMainCSS() {
  _loadMainCSS = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return _fs["default"].promises.readFile('./public/css/chums.css');
        case 3:
          return _context6.abrupt("return", _context6.sent);
        case 6:
          _context6.prev = 6;
          _context6.t0 = _context6["catch"](0);
          debug("loadMainCSS()", _context6.t0.message);
          return _context6.abrupt("return", _context6.t0);
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 6]]);
  }));
  return _loadMainCSS.apply(this, arguments);
}
function handleRender(_x, _x2) {
  return _handleRender.apply(this, arguments);
}
function _handleRender() {
  _handleRender = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var result, defaultState, initialState, state, keywords, parsedProduct, keyword, search, _keywords$filter, _keywords$filter2, found, _keywords$filter3, _keywords$filter4, _yield$loadJSON, products, product, _products, prod, variant, msrp, salesUM, cartItem, _yield$loadJSON2, categories, _categories, _categories$, category, _category$id, id, _category$title, title, _category$pageText, pageText, _category$lifestyle, lifestyle, _category$children, children, store, html, helmet, preloadedState, _yield$fs$promises$st, swatchMTime, _yield$fs$promises$st2, cssMTime, manifestFiles, css, manifest, site;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          debug('handleRender', req.ip, req.path);
          if (typeof window === 'undefined') {
            global.window = {};
          }

          // this is only for local testing, when running on the server /api is routed to a different proxy.
          _context7.prev = 2;
          if (!/^\/api\//.test(req.path)) {
            _context7.next = 10;
            break;
          }
          _context7.next = 6;
          return loadJSON("http://localhost:".concat(API_PORT) + req.path);
        case 6:
          result = _context7.sent;
          _context7.next = 9;
          return res.json(result);
        case 9:
          return _context7.abrupt("return");
        case 10:
          _context7.next = 18;
          break;
        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](2);
          debug("handleRender() api call => 500", _context7.t0.message);
          _context7.next = 17;
          return res.status(500).json({
            error: 'invalid API content'
          });
        case 17:
          return _context7.abrupt("return");
        case 18:
          if (!(/^\/($|products|home|login|logout|signup|pages|profile|account|orders|invoices|set-password)/.test(req.path) === false)) {
            _context7.next = 23;
            break;
          }
          debug('handleRender() invalid path => 404', req.path);
          _context7.next = 22;
          return res.status(404).json({
            error: 'invalid url not found'
          });
        case 22:
          return _context7.abrupt("return");
        case 23:
          defaultState = {
            app: {
              keywords: [],
              messages: [],
              productMenu: {},
              slides: []
            },
            menu: {
              loaded: false,
              productMenu: {}
            },
            messages: {
              list: []
            },
            page: {
              list: []
            },
            keywords: [],
            products: {
              keywords: []
            },
            slides: {
              list: [],
              loaded: false
            },
            version: {
              versionNo: '',
              changed: false,
              lastChecked: 0,
              loading: false,
              ignored: ''
            }
          };
          _context7.next = 26;
          return loadVersion();
        case 26:
          defaultState.version.versionNo = _context7.sent;
          if (!!defaultState.version.versionNo) {
            defaultState.version.lastChecked = new Date().valueOf();
          }
          initialState = _objectSpread({}, defaultState);
          _context7.prev = 29;
          _context7.next = 32;
          return loadJSON("http://localhost:".concat(API_PORT, "/preload/state/formatted"));
        case 32:
          state = _context7.sent;
          initialState = (0, _deepmerge["default"])(defaultState, state);
          // initialState = {
          //     app: {slides, messages, productMenu: menu_chums, productMenuBC: menu_bc, keywords},
          //     products: {keywords},
          //     // pages: {list: keywords.filter(kw => kw.pagetype === 'page')}
          // };
          _context7.next = 42;
          break;
        case 36:
          _context7.prev = 36;
          _context7.t1 = _context7["catch"](29);
          debug("handleRender() err: ", _context7.t1.message);
          _context7.next = 41;
          return res.json({
            error: _context7.t1.message
          });
        case 41:
          return _context7.abrupt("return");
        case 42:
          keywords = initialState.products.keywords;
          parsedProduct = categoryProductRegexp.exec(req.path);
          if (!parsedProduct) {
            _context7.next = 69;
            break;
          }
          _context7.prev = 45;
          search = parsedProduct[2] ? parsedProduct[2] : parsedProduct[1];
          if (search) {
            _keywords$filter = keywords.filter(function (kw) {
              return kw.status === 1 && kw.keyword === search;
            }), _keywords$filter2 = _slicedToArray(_keywords$filter, 1), found = _keywords$filter2[0];
            if (!!found && !!found.redirect_to_parent) {
              _keywords$filter3 = keywords.filter(function (kw) {
                return kw.pagetype === 'product' && kw.id === found.redirect_to_parent;
              });
              _keywords$filter4 = _slicedToArray(_keywords$filter3, 1);
              found = _keywords$filter4[0];
            }
            if (!!found && found.status) {
              keyword = found;
            }
          }
          if (!(keyword && keyword.pagetype === 'product')) {
            _context7.next = 56;
            break;
          }
          _context7.next = 51;
          return loadJSON("http://localhost:".concat(API_PORT, "/products/v2/keyword/:product").replace(':product', encodeURIComponent(search)));
        case 51:
          _yield$loadJSON = _context7.sent;
          products = _yield$loadJSON.products;
          product = {};
          _products = _slicedToArray(products, 1), prod = _products[0];
          if (!!prod.status) {
            variant = (0, _products2.hasVariants)(prod) ? (0, _products2.defaultVariant)(prod) : null;
            msrp = variant ? (0, _products2.getMSRP)(variant.product) : (0, _products2.getMSRP)(prod);
            salesUM = variant ? (0, _products2.getSalesUM)(variant.product) : (0, _products2.getSalesUM)(prod);
            cartItem = variant ? (0, _products2.defaultCartItem)(variant.product) : (0, _products2.defaultCartItem)(prod);
            product.product = prod;
            product.selectedProduct = variant ? variant.product : prod;
            product.colorCode = (0, _products2.getDefaultColor)(variant ? variant.product : prod);
            product.variantId = variant ? variant.id : null;
            product.msrp = msrp;
            product.salesUM = salesUM;
            product.cartItem = cartItem;
            initialState.products = _objectSpread(_objectSpread({}, initialState.products), product);
          }
        case 56:
          if (!(keyword && keyword.pagetype === 'category')) {
            _context7.next = 64;
            break;
          }
          _context7.next = 59;
          return loadJSON("http://localhost:".concat(API_PORT, "/products/category/:category").replace(':category', encodeURIComponent(search)));
        case 59:
          _yield$loadJSON2 = _context7.sent;
          categories = _yield$loadJSON2.categories;
          _categories = _slicedToArray(categories, 1), _categories$ = _categories[0], category = _categories$ === void 0 ? {} : _categories$;
          _category$id = category.id, id = _category$id === void 0 ? '' : _category$id, _category$title = category.title, title = _category$title === void 0 ? '' : _category$title, _category$pageText = category.pageText, pageText = _category$pageText === void 0 ? '' : _category$pageText, _category$lifestyle = category.lifestyle, lifestyle = _category$lifestyle === void 0 ? null : _category$lifestyle, _category$children = category.children, children = _category$children === void 0 ? [] : _category$children;
          initialState.category = {
            id: id,
            title: title,
            pageText: pageText,
            lifestyle: lifestyle,
            children: children
          };
        case 64:
          _context7.next = 69;
          break;
        case 66:
          _context7.prev = 66;
          _context7.t2 = _context7["catch"](45);
          console.trace("handleRender() preload product", _context7.t2.message);
        case 69:
          _context7.prev = 69;
          store = (0, _redux.createStore)(_ducks["default"], initialState);
          html = (0, _server.renderToString)( /*#__PURE__*/_react["default"].createElement(_reactRedux.Provider, {
            store: store
          }, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.StaticRouter, {
            location: req.url
          }, /*#__PURE__*/_react["default"].createElement(_App["default"], null)))); // currently discarded, here to eliminate memory leak when not used
          // usage instructions don't seem compatible with Pug rendering..
          // should I switch to a plain js string template as shown in https://www.npmjs.com/package/react-helmet
          helmet = _reactHelmet.Helmet.renderStatic();
          preloadedState = store.getState();
          _context7.next = 76;
          return _fs["default"].promises.stat("./public/css/swatches-2020.css");
        case 76:
          _yield$fs$promises$st = _context7.sent;
          swatchMTime = _yield$fs$promises$st.mtimeMs;
          _context7.next = 80;
          return _fs["default"].promises.stat("./public/css/chums.css");
        case 80:
          _yield$fs$promises$st2 = _context7.sent;
          cssMTime = _yield$fs$promises$st2.mtimeMs;
          _context7.next = 84;
          return loadManifest();
        case 84:
          manifestFiles = _context7.sent;
          _context7.next = 87;
          return loadMainCSS();
        case 87:
          css = _context7.sent;
          manifest = {
            manifestFiles: manifestFiles,
            vendors: "/build".concat(manifestFiles['vendors.js']),
            chums: "/build".concat(manifestFiles['chums.js']),
            bundle: "/build".concat(manifestFiles['main.js']),
            swatchTimestamp: Math.floor(swatchMTime).toString(36),
            cssTimestamp: Math.floor(cssMTime).toString(36)
          };
          site = (0, _server.renderToString)( /*#__PURE__*/_react["default"].createElement(_HTML["default"], {
            manifestFiles: manifestFiles,
            html: html,
            css: css,
            helmet: helmet,
            state: preloadedState,
            cssTimestamp: Math.floor(cssMTime).toString(36),
            swatchTimestamp: Math.floor(swatchMTime).toString(36)
          }));
          res.send("<!DOCTYPE html>".concat(site));
          _context7.next = 99;
          break;
        case 93:
          _context7.prev = 93;
          _context7.t3 = _context7["catch"](69);
          debug("handleRender()", _context7.t3.message);
          _context7.next = 98;
          return res.status(500).json({
            error: _context7.t3.message
          });
        case 98:
          return _context7.abrupt("return", _context7.t3);
        case 99:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[2, 12], [29, 36], [45, 66], [69, 93]]);
  }));
  return _handleRender.apply(this, arguments);
}
app.get('/version', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var version;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return loadManifest();
        case 3:
          version = _context.sent;
          _context.next = 6;
          return res.json({
            version: version
          });
        case 6:
          _context.next = 13;
          break;
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          debug("app.get /version ()", _context.t0.message);
          _context.next = 13;
          return res.json({
            error: _context.t0.message
          });
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function (_x3, _x4) {
    return _ref.apply(this, arguments);
  };
}());
app.get('/version.js', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var version, js;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return loadManifest();
        case 3:
          version = _context2.sent;
          js = 'CHUMS.version = ' + JSON.stringify(version);
          _context2.next = 7;
          return res.set('Content-Type', 'application/javascript').send(js);
        case 7:
          _context2.next = 14;
          break;
        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          debug("app.get /version.js ()", _context2.t0.message);
          _context2.next = 14;
          return res.json({
            error: _context2.t0.message
          });
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 9]]);
  }));
  return function (_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
app.get('/version.json', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var version;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return loadManifest();
        case 3:
          version = _context3.sent;
          res.json({
            versionNo: version.versionNo
          });
          _context3.next = 12;
          break;
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          debug("app.get /version.json ()", _context3.t0.message);
          _context3.next = 12;
          return res.json({
            error: _context3.t0.message
          });
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function (_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());
/**
 * Test for invalid URL
 */
app.use(function (req, res, next) {
  try {
    decodeURI(req.url);
    next();
  } catch (err) {
    res.status(404).json({
      error: err.message
    });
  }
});
app.use(handleRender);
app.use(function (req, res) {
  res.status(404).json({
    error: 'Not Found',
    status: 404
  });
});
app.listen(PORT, function () {
  debug('server running at localhost:' + PORT);
});
var _default = app; // debug(process.env);
exports["default"] = _default;
function loadJSON(url) {
  //    debug('loadJSON()', {url});
  return new Promise(function (resolve, reject) {
    _http["default"].get(url, function (response) {
      var statusCode = response.statusCode;
      var contentType = response.headers['content-type'];
      var error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' + "Status Code: ".concat(statusCode));
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' + "Expected application/json but received ".concat(contentType));
      }
      if (error) {
        console.trace(error.message);
        // Consume response data to free up memory
        response.resume();
        return reject(error);
      }
      response.setEncoding('utf8');
      var rawData = '';
      response.on('data', function (chunk) {
        rawData += chunk;
      });
      response.on('end', function () {
        try {
          var parsedData = JSON.parse(rawData);
          return resolve(parsedData);
        } catch (e) {
          console.error(e.message);
          return reject(e);
        }
      });
    }).on('error', function (e) {
      console.error("Got error: ".concat(e.message));
      reject(e);
    });
  });
}
