import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import {BrowserRouter, Route, StaticRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import App from "./app/App";

const store = createStore(reducer, compose(applyMiddleware(thunk)));

render(
    <Provider store={store}>
        <StaticRouter >
            <Route component={App} />
        </StaticRouter>
    </Provider>,
    document.getElementById('app')
);
