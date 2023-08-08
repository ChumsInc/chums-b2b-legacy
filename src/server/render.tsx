import 'dotenv/config';
import Debug from 'debug';
import fs from "node:fs/promises";
import {NextFunction, Request, Response} from "express";
import {createStore} from "redux";
import {rootReducer} from "../app/configureStore";
import {renderToString} from "react-dom/server";
import {Provider} from "react-redux";
import App from "../app/App";
import React from "react";
import prepState from "../app/preloaded-state";
import {API_PORT} from "./config";
import {loadJSON, loadKeywords} from "./utils";
import {loadManifest} from "./manifest";
import B2BHtml from "./B2BHTML";
import {FilledContext, HelmetProvider} from "react-helmet-async";
import {Route} from "react-router-dom";
import {StaticRouter} from "react-router-dom/server";

const debug = Debug('chums:index');

async function loadMainCSS(): Promise<string> {
    try {
        const file = await fs.readFile('./public/css/chums.css');
        return Buffer.from(file).toString();
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("loadMainCSS()", err.message);
            return Promise.reject(err);
        }
        return Promise.reject(new Error(err?.toString()));
    }
}

export async function renderApp(req: Request, res: Response, next: NextFunction) {
    try {
        if (!/^\/($|home|login|logout|signup|pages|profile|account|orders|invoices|set-password)/.test(req.path)) {
            debug('handleRender() invalid path => 404', req.path);
            next();
            return;
        }
        const manifestFiles = await loadManifest();
        const preload = await loadJSON(`http://localhost:${API_PORT}/preload/state.json`);
        const initialState = prepState(preload ?? {});
        const store = createStore(rootReducer, initialState);
        const helmetContext: Partial<FilledContext> = {};
        const app = renderToString(
            <Provider store={store}>
                <HelmetProvider context={helmetContext}>
                    <StaticRouter location={req.url}>
                        <Route element={<App />}/>
                    </StaticRouter>
                </HelmetProvider>
            </Provider>
        );
        const {mtimeMs: swatchMTime} = await fs.stat("./public/css/swatches-2020.css");
        const css = await loadMainCSS();
        const html = renderToString(<B2BHtml html={app} css={css} state={store.getState()}
                                             manifestFiles={manifestFiles} helmet={helmetContext.helmet}
                                             swatchTimestamp={swatchMTime.toString(36)}/>)
        res.send(html);
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("renderApp()", err.message);
            return res.json({error: err.message, name: err.name});
        }
        res.json({error: 'unknown error in renderApp'});
    }
}

export async function renderAppProductPage(req: Request, res: Response, next: NextFunction) {
    try {
        const manifestFiles = await loadManifest();
        const searchParams = new URLSearchParams();
        const keywords = await loadKeywords();
        if (req.params.product) {
            const [found] = keywords.filter(kw => kw.pagetype === 'product')
                .filter(kw => kw.keyword === req.params.product);
            if (!found || (!found.status && !found.redirect_to_parent)) {
                next();
                return;
            }
            if (found.redirect_to_parent) {
                const [parent] = keywords.filter(kw => kw.status).filter(kw => kw.id === found.redirect_to_parent);
                if (!parent || !parent.status) {
                    next();
                }
                res.redirect(`/products/${parent.keyword}`);
                return;
            }
            searchParams.set('product', found.keyword);
        } else if (req.params.category) {
            const [found] = keywords.filter(kw => kw.pagetype === 'product' || kw.pagetype === 'category')
                .filter(kw => kw.keyword === req.params.category);
            if (!found || (!found.status && !found.redirect_to_parent)) {
                next();
                return;
            }
            if (found.redirect_to_parent) {
                const [parent] = keywords.filter(kw => kw.status).filter(kw => kw.id === found.redirect_to_parent);
                if (!parent || !parent.status) {
                    next();
                }
                res.redirect(`/products/${parent.keyword}`);
                return;
            }
            searchParams.set('category', found.keyword);
        }
        const preload = await loadJSON(`http://localhost:${API_PORT}/preload/state.json?${searchParams.toString()}`);
        const initialState = prepState(preload ?? {});
        const store = createStore(rootReducer, initialState);
        const helmetContext: Partial<FilledContext> = {};
        const app = renderToString(
            <Provider store={store}>
                <HelmetProvider context={helmetContext}>
                    <App/>
                </HelmetProvider>
            </Provider>
        );
        const {mtimeMs: swatchMTime} = await fs.stat("./public/css/swatches-2020.css");
        const css = await loadMainCSS();
        const html = renderToString(<B2BHtml html={app} css={css} state={store.getState()}
                                             manifestFiles={manifestFiles}
                                             swatchTimestamp={swatchMTime.toString(36)}
                                             helmet={helmetContext.helmet}/>)
        res.send(html);
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("renderAppProductPage()", err.message);
            return res.json({error: err.message, name: err.name});
        }
        res.json({error: 'unknown error in renderAppProductPage'});
    }
}

export async function renderAppContentPage(req: Request, res: Response, next: NextFunction) {
    try {
        const manifestFiles = await loadManifest();
        const searchParams = new URLSearchParams();
        const keywords = await loadKeywords();
        if (req.params.keyword) {
            const [found] = keywords.filter(kw => kw.pagetype === 'page')
                .filter(kw => kw.keyword === req.params.keyword);
            if (!found || (!found.status && !found.redirect_to_parent)) {
                next();
                return;
            }
            if (found.redirect_to_parent) {
                const [parent] = keywords.filter(kw => kw.status).filter(kw => kw.id === found.redirect_to_parent);
                if (!parent || !parent.status) {
                    next();
                }
                res.redirect(`/products/${parent.keyword}`);
                return;
            }
            searchParams.set('page', found.keyword);
        }
        const preload = await loadJSON(`http://localhost:${API_PORT}/preload/state.json?${searchParams.toString()}`);
        const initialState = prepState(preload ?? {});
        const store = createStore(rootReducer, initialState);
        const helmetContext: Partial<FilledContext> = {};
        const app = renderToString(
            <Provider store={store}>
                <HelmetProvider context={helmetContext}>
                    <App/>
                </HelmetProvider>
            </Provider>
        );
        const {mtimeMs: swatchMTime} = await fs.stat("./public/css/swatches-2020.css");
        const css = await loadMainCSS();
        const html = renderToString(<B2BHtml html={app} css={css} state={store.getState()}
                                             manifestFiles={manifestFiles}
                                             swatchTimestamp={swatchMTime.toString(36)}
                                             helmet={helmetContext.helmet}/>)
        res.send(html);
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("renderAppProductPage()", err.message);
            return res.json({error: err.message, name: err.name});
        }
        res.json({error: 'unknown error in renderAppProductPage'});
    }
}
