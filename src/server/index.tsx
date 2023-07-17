process.env.DEBUG = '*';
const API_PORT = process.env.API_PORT || '8081';
const PORT = process.env.PORT || 8084;

import Debug from 'debug';
import {getWindow} from 'ssr-window';
import "core-js/proposals"
import "regenerator-runtime/runtime";
import "@babel/register";
import path from 'path';
import fs from 'fs';
import express, {Request, Response} from 'express';
import favicon from 'serve-favicon';
import http from 'http';
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import {rootReducer} from '../app/configureStore';
import App from '../app/App';
import Html from "../HTML";
import {renderToString} from 'react-dom/server';
import {Helmet} from 'react-helmet';
import {StaticRouter} from 'react-router-dom';
import {pathToRegexp} from 'path-to-regexp';
import {hasVariants, defaultVariant, getMSRP, defaultCartItem, getSalesUM, getDefaultColor} from '../utils/products';
import {version as versionNo} from '../../package.json'
import deepmerge from 'deepmerge';


const debug = Debug('chums:index');
debug.enabled = true;


const categoryProductRegexp = pathToRegexp('/products/:category?/:product?');

const app = express();

// app.use(compression());
// serve our static stuff like index.css
app.use(favicon(path.join(__dirname, './public', 'favicon.ico')));
app.get('/chums.css.map', (req, res) => {
    res.redirect('/css/chums.css.map');
})
app.use('/css', express.static('./public/css', {fallthrough: false}));
app.use('/js', express.static('./public/js', {fallthrough: false}));
app.use('/build', express.static('./public/build', {fallthrough: false}));
app.use('/images', express.static('./public/images', {fallthrough: false}));
app.set('view engine', 'pug');
app.set('trust proxy', true);

async function loadManifest() {
    try {
        const manifestFile = await fs.promises.readFile('./public/build/manifest.json');
        const packageJSON = await fs.promises.readFile('../../package.json');
        const manifestJSON = Buffer.from(manifestFile).toString();

        let manifestFiles = {};
        let packageConfig:{version?: string} = {};
        try {
            manifestFiles = JSON.parse(manifestJSON || '{}');
            packageConfig = JSON.parse(Buffer.from(packageJSON).toString() ?? '{}');
        } catch (err:unknown) {
            if (err instanceof Error) {
                debug('loadManifest() error parsing manifest', err.message);
            }
        }
        return {...manifestFiles, versionNo: packageConfig.version ?? ''};
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("loadManifest()", err.message);
            return Promise.reject(err);
        }
        return Promise.reject(new Error(err?.toString()));
    }
}

async function loadMainCSS() {
    try {
        return await fs.promises.readFile('./public/css/chums.css');
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("loadMainCSS()", err.message);
            return Promise.reject(err);
        }
        return Promise.reject(new Error(err?.toString()));
    }
}

async function handleRender(req:Request, res:Response) {
    debug('handleRender', req.ip, req.path);

    // this is only for local testing, when running on the server /api is routed to a different proxy.
    try {
        if (/^\/api\//.test(req.path)) {
            const result = await loadJSON(`http://localhost:${API_PORT}` + req.path);
            await res.json(result);
            return;
        }
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("handleRender() api call => 500", err.message);
            await res.status(500).json({error: 'invalid API content'});
            return;
        }
        debug("handleRender() api call => 500", err);
        await res.status(500).json({error: 'invalid API content'});
        return;
    }

    if (/^\/($|products|home|login|logout|signup|pages|profile|account|orders|invoices|set-password)/.test(req.path) === false) {
        debug('handleRender() invalid path => 404', req.path);
        await res.status(404).json({error: 'invalid url not found'});
        return;
    }
    const window = getWindow() as Window & {__PRELOADED_STATE__?: any};
    window.__PRELOADED_STATE__ = {};


    const store = createStore(rootReducer);
    const html = renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    );


    try {
        window.__PRELOADED_STATE__ = await loadJSON(`http://localhost:${API_PORT}/preload/state/formatted`);

        initialState = deepmerge(defaultState, state);
        // initialState = {
        //     app: {slides, messages, productMenu: menu_chums, productMenuBC: menu_bc, keywords},
        //     products: {keywords},
        //     // pages: {list: keywords.filter(kw => kw.pagetype === 'page')}
        // };
    } catch(err) {
        debug("handleRender() err: ", err.message);
        await res.json({error: err.message});
        return;
    }
    const keywords = initialState.products.keywords;

    const parsedProduct = categoryProductRegexp.exec(req.path);
    if (parsedProduct) {
        try {
            let keyword;
            const search = parsedProduct[2] ? parsedProduct[2] : parsedProduct[1];
            if (search) {
                let [found] = keywords.filter(kw => kw.status === 1 && kw.keyword === search);
                if (!!found && !!found.redirect_to_parent) {
                    [found] = keywords.filter(kw => kw.pagetype === 'product' && kw.id === found.redirect_to_parent);
                }

                if (!!found && found.status) {
                    keyword = found;
                }
            }
            if (keyword && keyword.pagetype === 'product') {
                const {products} = await loadJSON(`http://localhost:${API_PORT}/products/v2/keyword/:product`.replace(':product', encodeURIComponent(search)));
                const product = {};
                const [prod] = products;
                if (!!prod.status) {
                    const variant = hasVariants(prod) ? defaultVariant(prod) : null;
                    const msrp = variant ? getMSRP(variant.product) :getMSRP(prod);
                    const salesUM = variant ? getSalesUM(variant.product) : getSalesUM(prod);
                    const cartItem = variant ? defaultCartItem(variant.product) : defaultCartItem(prod);
                    product.product = prod;
                    product.selectedProduct = variant ? variant.product : prod;
                    product.colorCode = getDefaultColor(variant ? variant.product : prod);
                    product.variantId = variant ? variant.id : null;
                    product.msrp = msrp;
                    product.salesUM = salesUM;
                    product.cartItem = cartItem;
                    initialState.products = {...initialState.products, ...product};
                }
            }
            if (keyword && keyword.pagetype === 'category') {
                const {categories} = await loadJSON(`http://localhost:${API_PORT}/products/category/:category`.replace(':category', encodeURIComponent(search)));
                const [category = {}] = categories;
                const {id = '', title = '', pageText = '', lifestyle = null, children = []} = category;
                initialState.category = {id, title, pageText, lifestyle, children}
            }

        } catch(err) {
            console.trace("handleRender() preload product", err.message);
        }
    }


    try {
        const store = createStore(rootReducer, initialState);

        const html = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url}>
                    <App />
                </StaticRouter>
            </Provider>
        );
        // currently discarded, here to eliminate memory leak when not used
        // usage instructions don't seem compatible with Pug rendering..
        // should I switch to a plain js string template as shown in https://www.npmjs.com/package/react-helmet
        const helmet = Helmet.renderStatic();

        const preloadedState = store.getState();

        const {mtimeMs: swatchMTime} = await fs.promises.stat("./public/css/swatches-2020.css");
        const {mtimeMs: cssMTime} = await fs.promises.stat("./public/css/chums.css");
        const manifestFiles = await loadManifest();
        const css = await loadMainCSS();

        const manifest = {
            manifestFiles,
            vendors: `/build${manifestFiles['vendors.js']}`,
            chums: `/build${manifestFiles['chums.js']}`,
            bundle: `/build${manifestFiles['main.js']}`,
            swatchTimestamp: Math.floor(swatchMTime).toString(36),
            cssTimestamp: Math.floor(cssMTime).toString(36),
        };

        const site = renderToString(
            <Html manifestFiles={manifestFiles}
                  html={html}
                  css={css}
                  helmet={helmet}
                  state={preloadedState}
                  cssTimestamp={Math.floor(cssMTime).toString(36)}
                  swatchTimestamp={Math.floor(swatchMTime).toString(36)} />
        )
        res.send(`<!DOCTYPE html>${site}`);
    } catch(err) {
        debug("handleRender()", err.message);
        await res.status(500).json({error: err.message});
        return err;
    }

    // res.render('index', {html, state: preloadedState, ...manifest});
}

app.get('/version', async (req, res) => {
    try {
        const version = await loadManifest();
        version.versionNo =
            await res.json({version});
    } catch(err) {
        debug("app.get /version ()", err.message);
        await res.json({error: err.message});
    }
});

app.get('/version.js', async (req, res) => {
    try {
        const version = await loadManifest();
        const js = 'CHUMS.version = ' + JSON.stringify(version);
        await res.set('Content-Type', 'application/javascript').send(js);
    } catch(err) {
        debug("app.get /version ()", err.message);
        await res.json({error: err.message});
    }
});
/**
 * Test for invalid URL
 */
app.use((req, res, next) => {
    try {
        decodeURI(req.url);
        next();
    } catch(err) {
        res.status(404).json({error: err.message});
    }
});

app.use(handleRender);

app.use((req, res) => {
    res.status(404).json({error: 'Not Found', status: 404});
})



app.listen(PORT, function() {
    debug('server running at localhost:' + PORT);
});

export default app;
// debug(process.env);


function loadJSON(url) {
//    debug('loadJSON()', {url});
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            const {statusCode} = response;
            const contentType = response.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.trace(error.message);
                // Consume response data to free up memory
                response.resume();
                return reject(error);
            }

            response.setEncoding('utf8');
            let rawData = '';
            response.on('data', (chunk) => {
                rawData += chunk;
            });
            response.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    return resolve(parsedData);
                } catch (e) {
                    console.error(e.message);
                    return reject(e);
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            reject(e);
        });
    })
}
