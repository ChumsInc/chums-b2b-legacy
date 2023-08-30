"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
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
    var status, result, defaultState, initialState, state, keywords, parsedProduct, keyword, search, _keywords$filter, _keywords$filter2, found, _keywords$filter3, _keywords$filter4, _yield$loadJSON, products, product, _products, prod, variant, msrp, salesUM, cartItem, _yield$loadJSON2, categories, _categories, _categories$, category, _category$id, id, _category$title, title, _category$pageText, pageText, _category$lifestyle, lifestyle, _category$children, children, store, html, helmet, preloadedState, _yield$fs$promises$st, swatchMTime, _yield$fs$promises$st2, cssMTime, manifestFiles, css, manifest, site;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          debug('handleRender', req.ip, req.path);
          if (typeof window === 'undefined') {
            global.window = {};
          }
          status = 200; // this is only for local testing, when running on the server /api is routed to a different proxy.
          _context7.prev = 3;
          if (!/^\/api\//.test(req.path)) {
            _context7.next = 11;
            break;
          }
          _context7.next = 7;
          return loadJSON("http://localhost:".concat(API_PORT) + req.path);
        case 7:
          result = _context7.sent;
          _context7.next = 10;
          return res.json(result);
        case 10:
          return _context7.abrupt("return");
        case 11:
          _context7.next = 19;
          break;
        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](3);
          debug("handleRender() api call => 500", _context7.t0.message);
          _context7.next = 18;
          return res.status(500).json({
            error: 'invalid API content'
          });
        case 18:
          return _context7.abrupt("return");
        case 19:
          if (!(/^\/($|products|home|login|logout|signup|pages|profile|account|orders|invoices|set-password)/.test(req.path) === false)) {
            _context7.next = 24;
            break;
          }
          debug('handleRender() invalid path => 404', req.path);
          _context7.next = 23;
          return res.status(404).json({
            error: 'invalid url not found'
          });
        case 23:
          return _context7.abrupt("return");
        case 24:
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
          _context7.next = 27;
          return loadVersion();
        case 27:
          defaultState.version.versionNo = _context7.sent;
          if (!!defaultState.version.versionNo) {
            defaultState.version.lastChecked = new Date().valueOf();
          }
          initialState = _objectSpread({}, defaultState);
          _context7.prev = 30;
          _context7.next = 33;
          return loadJSON("http://localhost:".concat(API_PORT, "/preload/state/formatted"));
        case 33:
          state = _context7.sent;
          initialState = (0, _deepmerge["default"])(defaultState, state);
          // initialState = {
          //     app: {slides, messages, productMenu: menu_chums, productMenuBC: menu_bc, keywords},
          //     products: {keywords},
          //     // pages: {list: keywords.filter(kw => kw.pagetype === 'page')}
          // };
          _context7.next = 43;
          break;
        case 37:
          _context7.prev = 37;
          _context7.t1 = _context7["catch"](30);
          debug("handleRender() err: ", _context7.t1.message);
          _context7.next = 42;
          return res.json({
            error: _context7.t1.message
          });
        case 42:
          return _context7.abrupt("return");
        case 43:
          keywords = initialState.products.keywords;
          parsedProduct = categoryProductRegexp.exec(req.path);
          if (!parsedProduct) {
            _context7.next = 71;
            break;
          }
          _context7.prev = 46;
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
            _context7.next = 57;
            break;
          }
          _context7.next = 52;
          return loadJSON("http://localhost:".concat(API_PORT, "/products/v2/keyword/:product").replace(':product', encodeURIComponent(search)));
        case 52:
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
        case 57:
          if (!(keyword && keyword.pagetype === 'category')) {
            _context7.next = 65;
            break;
          }
          _context7.next = 60;
          return loadJSON("http://localhost:".concat(API_PORT, "/products/category/:category").replace(':category', encodeURIComponent(search)));
        case 60:
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
        case 65:
          if (!keyword) {
            status = 404;
          }
          _context7.next = 71;
          break;
        case 68:
          _context7.prev = 68;
          _context7.t2 = _context7["catch"](46);
          console.trace("handleRender() preload product", _context7.t2.message);
        case 71:
          _context7.prev = 71;
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
          _context7.next = 78;
          return _fs["default"].promises.stat("./public/css/swatches-2020.css");
        case 78:
          _yield$fs$promises$st = _context7.sent;
          swatchMTime = _yield$fs$promises$st.mtimeMs;
          _context7.next = 82;
          return _fs["default"].promises.stat("./public/css/chums.css");
        case 82:
          _yield$fs$promises$st2 = _context7.sent;
          cssMTime = _yield$fs$promises$st2.mtimeMs;
          _context7.next = 86;
          return loadManifest();
        case 86:
          manifestFiles = _context7.sent;
          _context7.next = 89;
          return loadMainCSS();
        case 89:
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
          res.status(status).send("<!DOCTYPE html>".concat(site));
          _context7.next = 101;
          break;
        case 95:
          _context7.prev = 95;
          _context7.t3 = _context7["catch"](71);
          debug("handleRender()", _context7.t3.message);
          _context7.next = 100;
          return res.status(500).json({
            error: _context7.t3.message
          });
        case 100:
          return _context7.abrupt("return", _context7.t3);
        case 101:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[3, 13], [30, 37], [46, 68], [71, 95]]);
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
