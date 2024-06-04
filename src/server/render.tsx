import 'dotenv/config';
import Debug from 'debug';
import fs from "node:fs/promises";
import {NextFunction, Request, Response} from "express";
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
import {HelmetData, HelmetProvider} from "react-helmet-async";
import {StaticRouter} from "react-router-dom/server";
import {configureStore} from "@reduxjs/toolkit";
import {PreloadedState} from "../types/preload";

const debug = Debug('chums:index');

async function loadMainCSS(): Promise<string> {
    try {
        const file = await fs.readFile('./public/css/chums-b2b.css');
        return Buffer.from(file).toString();
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("loadMainCSS()", err.message);
            return Promise.reject(err);
        }
        return Promise.reject(new Error(err?.toString()));
    }
}

async function loadVersionNo(): Promise<string | null> {
    try {
        const file = await fs.readFile('./package.json');
        const packageJSON = Buffer.from(file).toString();
        const json = JSON.parse(packageJSON);
        return json?.version ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("loadVersionNo()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadVersionNo()", err);
        return Promise.reject(new Error('Error in loadVersionNo()'));
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
        const preload = await loadJSON<PreloadedState>(`http://localhost:${API_PORT}/preload/state.json`);
        if (!preload.version) {
            const versionNo = await loadVersionNo();
            preload.version = {versionNo}
        }
        const initialState = prepState(preload ?? {});
        const store = configureStore({reducer: rootReducer, preloadedState: initialState});
        const helmetData = new HelmetData({});
        const app = renderToString(
            <Provider store={store}>
                <HelmetProvider context={helmetData.context}>
                    <StaticRouter location={req.url}>
                        <App/>
                    </StaticRouter>
                </HelmetProvider>
            </Provider>
        );
        let swatchMTime = 0;
        try {
            const stat = await fs.stat("./public/b2b-swatches/swatches.css");
            swatchMTime = stat.mtimeMs ?? 0;
        } catch (err: unknown) {
            //Do nothing here
        }

        const css = await loadMainCSS();
        const _html = renderToString(<B2BHtml html={app} css={css} state={store.getState()}
                                              manifestFiles={manifestFiles} helmet={helmetData.context.helmet}
                                              swatchTimestamp={swatchMTime.toString(36)}/>);
        const html = `<!DOCTYPE html>
                    ${_html}
                    `;
        res.send(html);
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("renderApp()", err.message);
            console.trace(err.message);
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
            if (!found) {
                res.redirect(`/products/${req.params.category}`);
                return;
            }
            if (found?.redirect_to_parent) {
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
            if (!found) {
                res.redirect(`/products/all`);
                return;
            }
            if (found?.redirect_to_parent) {
                const [parent] = keywords.filter(kw => kw.status).filter(kw => kw.id === found.redirect_to_parent);
                if (!parent || !parent.status) {
                    next();
                }
                res.redirect(`/products/${parent.keyword}`);
                return;
            }
            searchParams.set('category', found.keyword);
        }
        const preload = await loadJSON<PreloadedState>(`http://localhost:${API_PORT}/preload/state.json?${searchParams.toString()}`);
        if (!preload.version) {
            const versionNo = await loadVersionNo();
            preload.version = {versionNo}
        }

        const initialState = prepState(preload ?? {});
        const store = configureStore({reducer: rootReducer, preloadedState: initialState});
        const helmetData = new HelmetData({});
        const app = renderToString(
            <Provider store={store}>
                <HelmetProvider context={helmetData.context}>
                    <StaticRouter location={req.url}>
                        <App/>
                    </StaticRouter>
                </HelmetProvider>
            </Provider>
        );
        const {mtimeMs: swatchMTime} = await fs.stat("./public/b2b-swatches/swatches.css");
        const css = await loadMainCSS();
        const _html = renderToString(<B2BHtml html={app} css={css} state={store.getState()}
                                             manifestFiles={manifestFiles}
                                             swatchTimestamp={swatchMTime.toString(36)}
                                             helmet={helmetData.context.helmet}/>);
        const html = `<!DOCTYPE html>
                    ${_html}
                    `;
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
        const store = configureStore({reducer: rootReducer, preloadedState: initialState});
        const helmetData = new HelmetData({});
        const app = renderToString(
            <Provider store={store}>
                <HelmetProvider context={helmetData.context}>
                    <StaticRouter location={req.url}>
                        <App/>
                    </StaticRouter>
                </HelmetProvider>
            </Provider>
        );
        const {mtimeMs: swatchMTime} = await fs.stat("./public/b2b-swatches/swatches.css");
        const css = await loadMainCSS();
        const _html = renderToString(<B2BHtml html={app} css={css} state={store.getState()}
                                             manifestFiles={manifestFiles}
                                             swatchTimestamp={swatchMTime.toString(36)}
                                             helmet={helmetData.context.helmet}/>);
        const html = `<!DOCTYPE html>
                    ${_html}
                    `;
        res.send(html);
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("renderAppProductPage()", err.message);
            return res.json({error: err.message, name: err.name});
        }
        res.json({error: 'unknown error in renderAppProductPage'});
    }
}
