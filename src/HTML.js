import React, {Component} from 'react';
import PropTypes from 'prop-types';
import path from 'path';

const InlineJSHeadContent = (manifestFiles = {}) => {

    const version = JSON.stringify(manifestFiles);
    return `
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'UA-3648826-6');
        
        window.Chums = {version: ${version}};
        `;
}



class Html extends Component {
    static propTypes = {
        html: PropTypes.string.isRequired,
        css: PropTypes.string.isRequired,
        helmet: PropTypes.any,
        state: PropTypes.object.isRequired,
        manifestFiles: PropTypes.shape({
            "main.js": PropTypes.string.isRequired,
            "chums.js": PropTypes.string.isRequired,
            "vendors.js": PropTypes.string.isRequired,
        }).isRequired,
        swatchTimestamp: PropTypes.string,
        cssTimestamp: PropTypes.string,
    }

    render() {
        const {html, css, helmet, state, manifestFiles, swatchTimestamp, cssTimestamp, children} = this.props;
        const preloadedState = JSON.stringify(state || {}).replace(/</g, '\\u003c');
        return (
            <html lang="en-us" dir="ltr">
                <head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="x-ua-compatible" content="ie-edge" />
                    {helmet.title.toComponent()}
                    <meta name="description" content="Chums B2B" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    <meta property="og:image" content="https://b2b.chums.com/images/logos/Chums-Logo-Badge-Red-RGB.png" />
                    <meta property="og:image:alt" content="Chums Logo" />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://b2b.chums.com/" />
                    {helmet.meta.toComponent()}

                    <link rel="apple-touch-icon" sizes="57x57" href="/images/icons/apple-touch-icon-57x57.png" />
                    <link rel="apple-touch-icon" sizes="60x60" href="/images/icons/apple-touch-icon-60x60.png" />
                    <link rel="apple-touch-icon" sizes="72x72" href="/images/icons/apple-touch-icon-72x72.png" />
                    <link rel="apple-touch-icon" sizes="76x76" href="/images/icons/apple-touch-icon-76x76.png" />
                    <link rel="apple-touch-icon" sizes="114x114" href="/images/icons/apple-touch-icon-114x114.png" />
                    <link rel="apple-touch-icon" sizes="120x120" href="/images/icons/apple-touch-icon-120x120.png" />
                    <link rel="apple-touch-icon" sizes="144x144" href="/images/icons/apple-touch-icon-144x144.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="/images/icons/apple-touch-icon-152x152.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon-180x180.png" />

                    <style dangerouslySetInnerHTML={{__html: css}}/>
                    {/*<link rel="stylesheet" href={`/css/chums.css?v=${cssTimestamp}`} media="screen,print" />*/}
                    <link rel="stylesheet" href={`/css/swatches-2020.css?v=${swatchTimestamp}`} media="screen,print" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&display=swap" media="screen" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" media="screen" />
                    <link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css" />

                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-3648826-6" />
                    <script dangerouslySetInnerHTML={{__html: InlineJSHeadContent(manifestFiles)}}  />
                    {/*<InlineJSHeadContent manifestFiles={manifestFiles}/>*/}
                    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                </head>
            <body>
            <div id="app" dangerouslySetInnerHTML={{__html: html}} />
            <script dangerouslySetInnerHTML={{__html: `window.__PRELOADED_STATE__ = ${preloadedState}`}} />
            <script src={path.join('/js', manifestFiles['vendors.js'])} />
            <script src={path.join('/js', manifestFiles['chums.js'])} />
            <script src={path.join('/js', manifestFiles['main.js'])} />
            </body>
            </html>
        );
    }
}

export default Html;
