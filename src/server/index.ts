import 'dotenv/config';
import Debug from 'debug';
import express, {Request, NextFunction, Response} from "express";
import favicon from "serve-favicon";
import path from "node:path";
import {renderApp, renderAppContentPage, renderAppProductPage} from "./render";
import {getVersion, getVersionJS} from "./version";
import {getManifest} from "./manifest";
import {getAPIRequest, handleInvalidURL} from "./utils";
import helmet from "helmet";
import * as crypto from "node:crypto";
import compression from 'compression';

const debug = Debug('chums:server:index');

const app = express();
app.use(compression());
app.use((req:Request, res:Response, next:NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(32).toString("hex");
    next();
})

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            // @ts-ignore
            "script-src": ["'self'", "accounts.google.com", "www.google-analytics.com", "www.googletagmanager.com", (req:Request, res:Response):string => `'nonce-${res.locals.cspNonce}'`],
            "connect-src": ["'self'", "www.googletagmanager.com", "www.google-analytics.com", "accounts.google.com", ],
            "img-src": ["'self'", "b2b.chums.com", "*.chums.com", "www.googletagmanager.com", "*.googleusercontent.com"],
            "frame-src": ["'self'", "accounts.google.com"],
        }
    }
}))
app.use(favicon(path.join(process.cwd(), './public', 'favicon.ico')));
app.get('/chums.css.map', (req, res) => {
    res.redirect('/css/chums.css.map');
})
app.use('/css', express.static('./public/css', {fallthrough: false}));
app.use('/js', express.static('./public/js', {fallthrough: false}));
app.use('/build', express.static('./public/build', {fallthrough: false}));
app.use('/images', express.static('./public/images', {fallthrough: false}));
app.set('trust proxy', true);
app.use((req, res, next) => {
    debug(req.ip, req.method,  req.url);
    next();
})
app.get('/manifest.json', getManifest);
app.get('/version.js', getVersionJS);
app.get('/version.json', getVersion);
app.get('/version', getVersion);
app.get('/api', getAPIRequest);

app.use(handleInvalidURL);

app.get('/products/:category?/:product?', renderAppProductPage);
app.get('/pages/:keyword', renderAppContentPage);
app.get('/*', renderApp);

app.use((req, res) => {
    res.status(404).json({error: 'Not Found', status: 404});
})

app.listen(process.env.PORT, function() {
    debug('server running at localhost:' + process.env.PORT);
});

export default app;
