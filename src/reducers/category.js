import {combineReducers} from 'redux';
import {
    FETCH_CATEGORY,
    FETCH_INIT,
    FETCH_SUCCESS,
} from "../constants/actions";

const id = (state = 0, action) => {
    const {type, status, category} = action;
    switch (type) {
    case FETCH_CATEGORY:
        if (status === FETCH_SUCCESS) {
            return category.id || 0;
        }
        return state;
    default:
        return state;
    }
};

const title = (state = '', action) => {
    const {type, status, category} = action;
    switch (type) {
    case FETCH_CATEGORY:
        if (status === FETCH_SUCCESS) {
            return category.title || '';
        }
        return state;
    default:
        return state;
    }
};

const pageText = (state = '', action) => {
    const {type, status, category} = action;
    switch (type) {
    case FETCH_CATEGORY:
        if (status === FETCH_SUCCESS) {
            return category.pageText || '';
        }
        return state;
    default:
        return state;
    }
};

const lifestyle = (state = null, action) => {
    const {type, category} = action;
    switch (type) {
    case FETCH_CATEGORY:
        if (status === FETCH_SUCCESS) {
            return category.lifestyle || '';
        }
        return state;
    default:
        return state;
    }
};

const children = (state = [], action) => {
    const {type, status, category} = action;
    switch (type) {
    case FETCH_CATEGORY:
        if (status === FETCH_SUCCESS) {
            return [...category.children];
        }
        return state;
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_CATEGORY:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

export default combineReducers({
    id,
    title,
    pageText,
    lifestyle,
    children,
    loading,
});
