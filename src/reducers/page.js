import {combineReducers} from 'redux';
import {FETCH_FAILURE, FETCH_INIT, FETCH_KEYWORDS, FETCH_PAGE, FETCH_SUCCESS} from "../constants/actions";

if (typeof window === "undefined") {
    global.window = {};
}

if (!window.__PRELOADED_STATE__) {
    window.__PRELOADED_STATE__ = {};
}
const preload = {
    list: ((window.__PRELOADED_STATE__.app && window.__PRELOADED_STATE__.app.keywords) || []).filter(kw => kw.pagetype === 'page'),
};

const list = (state = preload.list, action) => {
    const {type, status, list} = action;
    switch (type) {
    case FETCH_KEYWORDS:
        if (status === FETCH_SUCCESS) {
            return list.filter(kw => kw.pagetype === 'page');
        }
        return state;
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_KEYWORDS:
        return status === FETCH_INIT;
    case FETCH_PAGE:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const content = (state = {}, action) => {
    const {type, status, page} = action;
    switch (type) {
    case FETCH_PAGE:
        if (status === FETCH_SUCCESS) {
            return {...page};
        }
        if (status === FETCH_FAILURE) {
            return {...page};
        }
        return state;
    default:
        return state;
    }
};

export default combineReducers({
    list,
    loading,
    content,
});
