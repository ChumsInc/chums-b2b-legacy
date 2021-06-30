"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

var _reducers = _interopRequireDefault(require("./src/reducers"));

var _App = _interopRequireDefault(require("./src/components/App"));

var _HTML = _interopRequireDefault(require("./src/HTML"));

var _server = require("react-dom/server");

var _reactHelmet = require("react-helmet");

var _reactRouterDom = require("react-router-dom");

var _pathToRegexp = require("path-to-regexp");

var _products2 = require("./src/utils/products");

var _package = require("./package.json");

var _url = _interopRequireDefault(require("url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

process.env.DEBUG = '*';
var API_PORT = process.env.API_PORT || '8081';
var PORT = process.env.PORT || 8084;

var debug = require('debug')('chums:index');

debug.enabled = true;
var categoryProductRegexp = (0, _pathToRegexp.pathToRegexp)('/products/:category?/:product?');
var app = (0, _express["default"])(); // app.use(compression());
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
  _loadManifest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var manifestFile, manifestJSON, manifestFiles;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _fs["default"].promises.readFile('./public/build/manifest.json');

          case 3:
            manifestFile = _context3.sent;
            manifestJSON = Buffer.from(manifestFile).toString();
            manifestFiles = {};

            try {
              manifestFiles = JSON.parse(manifestJSON || '{}');
            } catch (err) {
              debug('loadManifest() error parsing manifest', err.message);
            }

            return _context3.abrupt("return", _objectSpread(_objectSpread({}, manifestFiles), {}, {
              versionNo: _package.version
            }));

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            debug("loadManifest()", _context3.t0.message);
            return _context3.abrupt("return", Promise.reject(_context3.t0));

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 10]]);
  }));
  return _loadManifest.apply(this, arguments);
}

function loadMainCSS() {
  return _loadMainCSS.apply(this, arguments);
}

function _loadMainCSS() {
  _loadMainCSS = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _fs["default"].promises.readFile('./public/css/chums.css');

          case 3:
            return _context4.abrupt("return", _context4.sent);

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            debug("loadMainCSS()", _context4.t0.message);
            return _context4.abrupt("return", _context4.t0);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 6]]);
  }));
  return _loadMainCSS.apply(this, arguments);
}

function handleRender(_x, _x2) {
  return _handleRender.apply(this, arguments);
}

function _handleRender() {
  _handleRender = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var result, initialState, _yield$loadJSON, slides, messages, _keywords, menu_chums, menu_bc, keywords, parsedProduct, keyword, search, _keywords$filter, _keywords$filter2, found, _keywords$filter3, _keywords$filter4, _yield$loadJSON2, products, product, _products, prod, variant, msrp, salesUM, cartItem, _yield$loadJSON3, categories, _categories, _categories$, category, _category$id, id, _category$title, title, _category$pageText, pageText, _category$lifestyle, lifestyle, _category$children, children, store, html, helmet, preloadedState, _yield$fs$promises$st, swatchMTime, _yield$fs$promises$st2, cssMTime, manifestFiles, css, manifest, site;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            debug('handleRender', req.ip, req.path);

            if (typeof window === 'undefined') {
              global.window = {};
            } // this is only for local testing, when running on the server /api is routed to a different proxy.


            _context5.prev = 2;

            if (!/^\/api\//.test(req.path)) {
              _context5.next = 10;
              break;
            }

            _context5.next = 6;
            return loadJSON("http://localhost:".concat(API_PORT) + req.path);

          case 6:
            result = _context5.sent;
            _context5.next = 9;
            return res.json(result);

          case 9:
            return _context5.abrupt("return");

          case 10:
            _context5.next = 18;
            break;

          case 12:
            _context5.prev = 12;
            _context5.t0 = _context5["catch"](2);
            debug("handleRender() api call => 500", _context5.t0.message);
            _context5.next = 17;
            return res.status(500).json({
              error: 'invalid API content'
            });

          case 17:
            return _context5.abrupt("return");

          case 18:
            if (!(/^\/($|products|home|login|logout|signup|pages|profile|account|orders|invoices|set-password)/.test(req.path) === false)) {
              _context5.next = 23;
              break;
            }

            debug('handleRender() invalid path => 404', req.path);
            _context5.next = 22;
            return res.status(404).json({
              error: 'invalid url not found'
            });

          case 22:
            return _context5.abrupt("return");

          case 23:
            initialState = {
              products: {
                app: {},
                keywords: []
              }
            };
            _context5.prev = 24;
            _context5.next = 27;
            return loadJSON("http://localhost:".concat(API_PORT, "/preload/state"));

          case 27:
            _yield$loadJSON = _context5.sent;
            slides = _yield$loadJSON.slides;
            messages = _yield$loadJSON.messages;
            _keywords = _yield$loadJSON.keywords;
            menu_chums = _yield$loadJSON.menu_chums;
            menu_bc = _yield$loadJSON.menu_bc;
            initialState = {
              app: {
                slides: slides,
                messages: messages,
                productMenu: menu_chums,
                productMenuBC: menu_bc,
                keywords: _keywords
              },
              products: {
                keywords: _keywords
              } // pages: {list: keywords.filter(kw => kw.pagetype === 'page')}

            };
            _context5.next = 42;
            break;

          case 36:
            _context5.prev = 36;
            _context5.t1 = _context5["catch"](24);
            debug("handleRender() err: ", _context5.t1.message);
            _context5.next = 41;
            return res.json({
              error: _context5.t1.message
            });

          case 41:
            return _context5.abrupt("return");

          case 42:
            keywords = initialState.products.keywords;
            parsedProduct = categoryProductRegexp.exec(req.path);

            if (!parsedProduct) {
              _context5.next = 69;
              break;
            }

            _context5.prev = 45;
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
              _context5.next = 56;
              break;
            }

            _context5.next = 51;
            return loadJSON("http://localhost:".concat(API_PORT, "/products/v2/keyword/:product").replace(':product', encodeURIComponent(search)));

          case 51:
            _yield$loadJSON2 = _context5.sent;
            products = _yield$loadJSON2.products;
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
              _context5.next = 64;
              break;
            }

            _context5.next = 59;
            return loadJSON("http://localhost:".concat(API_PORT, "/products/category/:category").replace(':category', encodeURIComponent(search)));

          case 59:
            _yield$loadJSON3 = _context5.sent;
            categories = _yield$loadJSON3.categories;
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
            _context5.next = 69;
            break;

          case 66:
            _context5.prev = 66;
            _context5.t2 = _context5["catch"](45);
            console.trace("handleRender() preload product", _context5.t2.message);

          case 69:
            _context5.prev = 69;
            store = (0, _redux.createStore)(_reducers["default"], initialState);
            html = (0, _server.renderToString)( /*#__PURE__*/_react["default"].createElement(_reactRedux.Provider, {
              store: store
            }, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.StaticRouter, {
              location: req.url
            }, /*#__PURE__*/_react["default"].createElement(_App["default"], null)))); // currently discarded, here to eliminate memory leak when not used
            // usage instructions don't seem compatible with Pug rendering..
            // should I switch to a plain js string template as shown in https://www.npmjs.com/package/react-helmet

            helmet = _reactHelmet.Helmet.renderStatic();
            preloadedState = store.getState();
            _context5.next = 76;
            return _fs["default"].promises.stat("./public/css/swatches-2020.css");

          case 76:
            _yield$fs$promises$st = _context5.sent;
            swatchMTime = _yield$fs$promises$st.mtimeMs;
            _context5.next = 80;
            return _fs["default"].promises.stat("./public/css/chums.css");

          case 80:
            _yield$fs$promises$st2 = _context5.sent;
            cssMTime = _yield$fs$promises$st2.mtimeMs;
            _context5.next = 84;
            return loadManifest();

          case 84:
            manifestFiles = _context5.sent;
            _context5.next = 87;
            return loadMainCSS();

          case 87:
            css = _context5.sent;
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
            _context5.next = 99;
            break;

          case 93:
            _context5.prev = 93;
            _context5.t3 = _context5["catch"](69);
            debug("handleRender()", _context5.t3.message);
            _context5.next = 98;
            return res.status(500).json({
              error: _context5.t3.message
            });

          case 98:
            return _context5.abrupt("return", _context5.t3);

          case 99:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 12], [24, 36], [45, 66], [69, 93]]);
  }));
  return _handleRender.apply(this, arguments);
}

app.get('/version', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var version;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
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
            version.versionNo = _context.sent;
            _context.next = 14;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            debug("app.get /version ()", _context.t0.message);
            _context.next = 14;
            return res.json({
              error: _context.t0.message
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function (_x3, _x4) {
    return _ref.apply(this, arguments);
  };
}());
app.get('/version.js', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var version, js;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
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
            debug("app.get /version ()", _context2.t0.message);
            _context2.next = 14;
            return res.json({
              error: _context2.t0.message
            });

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 9]]);
  }));

  return function (_x5, _x6) {
    return _ref2.apply(this, arguments);
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
        console.trace(error.message); // Consume response data to free up memory

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
