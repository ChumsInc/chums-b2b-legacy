import {combineReducers} from 'redux';
import {
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SEARCH_RESULTS,
    FETCH_SUCCESS, SELECT_SEARCH_RESULT,
    SET_SEARCH,
    SET_SEARCH_LOADING,
    SET_SEARCH_RESULTS, SHOW_SEARCH
} from "../constants/actions";


const term = (state = '', action) => {
    const {type, term} = action;
    switch (type) {
    case SET_SEARCH:
        return term || '';
    default:
        return state;
    }
};

const results = (state = [], action) => {
    const {type, status, list} = action;
    switch (type) {
    case FETCH_SEARCH_RESULTS:
        if (status === FETCH_SUCCESS) {
            return [...list];
        }
        return state;
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_SEARCH_RESULTS:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const show = (state = false, action) => {
    const {type, status, show, term, list} = action;
    switch (type) {
    case FETCH_SEARCH_RESULTS:
        if (status === FETCH_INIT) {
            return true;
        }
        if (status === FETCH_SUCCESS) {
            return !!list.length;
        }
        return false;
    case SELECT_SEARCH_RESULT:
        return false;
    case SHOW_SEARCH:
        return show;
    case SET_SEARCH:
        return term.trim() !== '';
    default:
        return state;
    }
}

export default combineReducers({
    term,
    results,
    loading,
    show,
})
