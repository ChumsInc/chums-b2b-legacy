import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import App from "./app/App";
import {createRoot} from "react-dom/client";
import store from './app/configureStore';
import {HelmetProvider} from "react-helmet-async";

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <HelmetProvider>
                <BrowserRouter>
                    <Route component={App}/>
                </BrowserRouter>
            </HelmetProvider>
        </Provider>
    </React.StrictMode>
)
