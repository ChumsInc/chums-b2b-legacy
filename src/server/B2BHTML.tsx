import React from 'react';
import {HelmetServerState} from "react-helmet-async";
import path from "path";
import {ManifestFiles} from "./manifest";


const InlineJSHeadContent = (versionNo: string) => {
    return `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('config', 'G-KMH9RBEF98');
        
        window.Chums = {"version": "${versionNo}"};
        `;
}


export interface B2BHtmlProps {
    html: string;
    css: string;
    state: any;
    helmet?: HelmetServerState,
    manifestFiles: ManifestFiles;
    swatchTimestamp?: string;
}

export default function B2BHtml({html, css, state, helmet, manifestFiles, swatchTimestamp}: B2BHtmlProps) {
    const preloadedState = JSON.stringify(state || {}).replace(/</g, '\\u003c');
    return (
        <html lang="en-us" dir="ltr">
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="x-ua-compatible" content="ie-edge"/>
            {!helmet && <title>CHUMS B2B</title>}
            <>{helmet?.title?.toComponent()}</>
            <meta name="description" content="Chums B2B"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>

            <meta property="og:image" content="https://b2b.chums.com/images/logos/Chums-Logo-Badge-Red-RGB.png"/>
            <meta property="og:image:alt" content="Chums Logo"/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content="https://b2b.chums.com/"/>
            <>{helmet?.meta?.toComponent()}</>

            <link rel="apple-touch-icon" sizes="57x57" href="/images/icons/apple-touch-icon-57x57.png"/>
            <link rel="apple-touch-icon" sizes="60x60" href="/images/icons/apple-touch-icon-60x60.png"/>
            <link rel="apple-touch-icon" sizes="72x72" href="/images/icons/apple-touch-icon-72x72.png"/>
            <link rel="apple-touch-icon" sizes="76x76" href="/images/icons/apple-touch-icon-76x76.png"/>
            <link rel="apple-touch-icon" sizes="114x114" href="/images/icons/apple-touch-icon-114x114.png"/>
            <link rel="apple-touch-icon" sizes="120x120" href="/images/icons/apple-touch-icon-120x120.png"/>
            <link rel="apple-touch-icon" sizes="144x144" href="/images/icons/apple-touch-icon-144x144.png"/>
            <link rel="apple-touch-icon" sizes="152x152" href="/images/icons/apple-touch-icon-152x152.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon-180x180.png"/>

            <style dangerouslySetInnerHTML={{__html: css}}/>
            {/*<link rel="stylesheet" href={`/css/chums.css?v=${cssTimestamp}`} media="screen,print" />*/}
            <link rel="stylesheet" href={`/css/swatches-2020.css?v=${swatchTimestamp}`} media="screen,print"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&display=swap"
                  media="screen"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
                  media="screen"/>
            <link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css"/>
            <script src="https://accounts.google.com/gsi/client" async defer/>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-KMH9RBEF98"/>
            <script dangerouslySetInnerHTML={{__html: InlineJSHeadContent(manifestFiles.version ?? '')}}/>
            <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
        </head>
        <body>
        <div id="app" dangerouslySetInnerHTML={{__html: html}}/>
        <script dangerouslySetInnerHTML={{__html: `window.__PRELOADED_STATE__ = ${preloadedState}`}}/>
        {manifestFiles['vendors.js'] && (<script src={manifestFiles['vendors.js']}/>)}
        {manifestFiles['chums.js'] && (<script src={manifestFiles['chums.js']}/>)}
        {manifestFiles['main.js'] && (<script src={manifestFiles['main.js']}/>)}
        </body>
        </html>
    )
}
