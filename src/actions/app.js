import {
    ALERT_TYPES,
    DISMISS_ALERT,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_PAGE,
    FETCH_SEARCH_RESULTS,
    FETCH_SLIDES,
    FETCH_SUCCESS,
    FETCH_VERSION,
    SET_ALERT,
    SET_CUSTOMER_TAB,
    SET_DOCUMENT_TITLE,
    SET_LIFESTYLE,
    SET_ROWS_PER_PAGE,
    SET_SEARCH,
    SET_SUBNAVBAR,
    SHOW_SEARCH,
    TOGGLE_XS_NAVBAR
} from "../constants/actions";
import {fetchGET, fetchPOST} from '../utils/fetch';
import {API_PATH_HOME_SLIDES, API_PATH_SEARCH, API_PATH_VERSION} from "../constants/paths";
import localStore from "../utils/LocalStore";
import {STORE_USER_PREFS} from "../constants/stores";
import {buildPath} from "../utils/path-utils";


export const setAlert = ({
                             type = ALERT_TYPES.warning, title = 'Oops!',
                             message = 'There was an error', context = ''
                         }) => ({type: SET_ALERT, props: {type, title, message, context}});

export const dismissAlert = (id) => ({type: DISMISS_ALERT, id});

/**
 *
 * @param {Error} err
 * @param {String} context
 * @return {{type: string, props: {context: string, type: string, title: *, message: *}}}
 */
export const handleError = (err, context = '') => {
    console.trace(err.message);
    console.log(err.debug);
    return {
        type: SET_ALERT,
        props: {type: ALERT_TYPES.danger, title: err.name, message: err.message, context}
    };
};

export const setSearchTerm = (term) => ({type: SET_SEARCH, term});
export const showSearch = (show) => ({type: SHOW_SEARCH, show});

export const getSearchResults = (term) => (dispatch, getState) => {
    if (!term) {
        dispatch({type: FETCH_SEARCH_RESULTS, status: FETCH_SUCCESS, list: []});
        return;
    }
    try {
        const re = new RegExp(term);
    } catch (err) {
        return;
    }
    const url = buildPath(API_PATH_SEARCH, {term});
    dispatch({type: FETCH_SEARCH_RESULTS, status: FETCH_INIT})
    fetchGET(url)
        .then(res => {
            dispatch({type: FETCH_SEARCH_RESULTS, status: FETCH_SUCCESS, list: res.result || []})
        })
        .catch(err => {
            dispatch({type: FETCH_SEARCH_RESULTS, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_SEARCH_RESULTS));
        });

};

export const toggleXSNavBar = () => ({type: TOGGLE_XS_NAVBAR});

export const setSubNavBar = (subNav) => ({type: SET_SUBNAVBAR, subNav});

export const setRowsPerPage = (rowsPerPage) => (dispatch) => {
    localStore.setItem(STORE_USER_PREFS, {...localStore.getItem(STORE_USER_PREFS) || {}, rowsPerPage});
    dispatch({type: SET_ROWS_PER_PAGE, rowsPerPage});
};

export const setCustomerTab = (customerTab) => (dispatch) => {
    localStore.setItem(STORE_USER_PREFS, {...localStore.getItem(STORE_USER_PREFS) || {}, customerTab});
    dispatch({type: SET_CUSTOMER_TAB, customerTab});
};

export const setDocumentTitle = (title) => ({type: SET_DOCUMENT_TITLE, title});

export const fetchPage = (keyword) => (dispatch, getState) => {
    const {app} = getState();
    const [page] = app.keywords.filter(kw => kw.pagetype === 'page' && kw.keyword === keyword);
    if (!page) {
        return;
    }
    dispatch({type: FETCH_PAGE, status: FETCH_INIT});
};

export const setLifestyle = (lifestyle) => ({type: SET_LIFESTYLE, lifestyle});

export const fetchVersion = () => (dispatch, getState) => {
    const {app} = getState();
    // const {version: loadedVersion} = app;
    dispatch({type: FETCH_VERSION, status: FETCH_INIT});
    fetchGET(API_PATH_VERSION, {cache: 'no-cache'})
        .then(res => {
            const {version} = res;
            // version.changed = !(loadedVersion["main.js"] === version['main.js'] && loadedVersion['vendors.js'] === version['vendors.js']);
            dispatch({type: FETCH_VERSION, status: FETCH_SUCCESS, version});
        })
        .catch(err => {
            dispatch({type: FETCH_VERSION, status: FETCH_FAILURE});
            console.log(err.message);
        });
};

export const fetchSlides = () => (dispatch, getState) => {
    dispatch({type: FETCH_SLIDES, status: FETCH_INIT});
    fetchGET(API_PATH_HOME_SLIDES, {cache: 'no-cache'})
        .then(res => {
            const {slides = []} = res;
            dispatch({type: FETCH_SLIDES, status: FETCH_SUCCESS, slides});
        })
        .catch(err => {
            dispatch({type: FETCH_SLIDES, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_SLIDES));
        });
}

export const logError = ({message, componentStack, debug}) => (dispatch, getState) => {
    try {
        const {app, user} = getState();
        const {versionNo = ''} = app.version;
        const {id = 0} = user?.profile;
        const url = '/api/error-reporting';
        const body = {
            message,
            componentStack: componentStack,
            user_id: id,
            version: versionNo,
            debug,
        };
        fetchPOST(url, body)
            .then(res => console.log(res))
            .catch(err => console.log(err.message));
    } catch(err) {
        console.log("()", err.message);
    }
}
