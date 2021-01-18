import {combineReducers} from 'redux';
import {
    ALERT_CONTEXT_LOGIN,
    DISMISS_ALERT,
    FETCH_CATEGORY,
    FETCH_KEYWORDS,
    FETCH_PRODUCT,
    FETCH_PRODUCTS_MENU,
    FETCH_SLIDES,
    FETCH_SUCCESS,
    FETCH_VERSION,
    SET_ALERT,
    SET_CUSTOMER,
    SET_CUSTOMER_TAB,
    SET_DOCUMENT_TITLE,
    SET_LIFESTYLE,
    SET_LOGGED_IN,
    SET_ROWS_PER_PAGE,
    SET_SEARCH,
    SET_SEARCH_LOADING,
    SET_SEARCH_RESULTS,
    SET_SUBNAVBAR,
    TOGGLE_XS_NAVBAR
} from "../constants/actions";
import {CUSTOMER_TABS, SUB_NAV_TYPES, VERSION_REFRESH_MESSAGE} from "../constants/app";
import localStore from "../utils/LocalStore";
import {STORE_USER_PREFS} from "../constants/stores";
import search from "./search";

if (typeof window === "undefined") {
    global.window = {};
}

if (!window.__PRELOADED_STATE__) {
    window.__PRELOADED_STATE__ = {};
}
const preferences = {
    version: (window.CHUMS || {}).version || {},
    keywords: window.__PRELOADED_STATE__.keywords || [],
    slides: window.__PRELOADED_STATE__.slides || [],
    productMenu: window.__PRELOADED_STATE__.menu_chums || [],
    productMenuBC: window.__PRELOADED_STATE__.menu_bc || [],
    rowsPerPage: 10,
    customerTab: CUSTOMER_TABS[0].id,
    messages: window.__PRELOADED_STATE__.messages || [],
    ...localStore.getItem(STORE_USER_PREFS) || {},
};

const alertSort = (a, b) => a.id - b.id;
export const now = () => new Date().valueOf();

const alerts = (state = [], action) => {
    const {type, props, id, loggedIn} = action;
    switch (type) {
    case SET_ALERT:
        if (!!props.context) {
            const [{id = now(), count = 0} = {}] = state.filter(a => a.context === props.context);
            return [
                ...state.filter(a => a.context !== props.context),
                {...props, id, count: count + 1}
            ].sort(alertSort);
        }
        return [...state, {...props, count: 1, id: now()}].sort(alertSort);
        // return [...state, {...props, id: new Date().valueOf()}];
    case DISMISS_ALERT:
        return [...state.filter(alert => alert.id !== id)];
    case SET_LOGGED_IN:
        return loggedIn ? [...state.filter(alert => alert.context !== ALERT_CONTEXT_LOGIN)] : [];
    default:
        return state;
    }
};

// const searchTerm = (state = '', action) => {
//     const {type, payload} = action;
//     switch (type) {
//     case SET_SEARCH:
//         return payload;
//     default:
//         return state;
//     }
// };
//
// const searchResults = (state = [], action) => {
//     const {type, payload} = action;
//     switch (type) {
//     case SET_SEARCH_RESULTS:
//         return [...payload];
//     default:
//         return state;
//     }
// };
//
// const searchLoading = (state = false, action) => {
//     const {type} = action;
//     switch (type) {
//     case SET_SEARCH_RESULTS:
//         return false;
//     case SET_SEARCH_LOADING:
//         return true;
//     default:
//         return state;
//     }
// };

const productMenu = (state = preferences.productMenu, action) => {
    const {type, status, menu} = action;
    switch (type) {
    case FETCH_PRODUCTS_MENU:
        return status === FETCH_SUCCESS ? {...menu} : state;
    default:
        return state;
    }
};

const productMenuBC = (state = preferences.productMenuBC, action) => {
    const {type, status, menu} = action;
    switch (type) {
    case FETCH_PRODUCTS_MENU:
        return status === FETCH_SUCCESS ? {...menu} : state;
    default:
        return state;
    }
};

const showNavBar = (state = false, action) => {
    const {type, subNav} = action;
    switch (type) {
    case TOGGLE_XS_NAVBAR:
        return !state;
    case SET_SUBNAVBAR:
        return subNav === SUB_NAV_TYPES.none ? false : state;
    default:
        return state;
    }
};

const subNav = (state = SUB_NAV_TYPES.none, action) => {
    const {type, subNav} = action;
    switch (type) {
    case SET_SUBNAVBAR:
        return subNav;
    default:
        return state;
    }
};

const rowsPerPage = (state = preferences.rowsPerPage, action) => {
    const {type, rowsPerPage} = action;
    switch (type) {
    case SET_ROWS_PER_PAGE:
        return rowsPerPage;
    default:
        return state;
    }
};

const customerTab = (state = preferences.customerTab, action) => {
    const {type, customerTab} = action;
    switch (type) {
    case SET_CUSTOMER_TAB:
        return customerTab;
    case SET_CUSTOMER:
        return CUSTOMER_TABS[0].id;
    default:
        return state;
    }
};

const slides = (state = preferences.slides, action) => {
    const {type, status, slides} = action;
    switch (type) {
    case FETCH_SLIDES:
        return status === FETCH_SUCCESS ? [...slides] : state;
    default:
        return state;
    }
};

const messages = (state = preferences.messages, action) => {
    const {type, status, version, message} = action;
    switch (type) {
    case FETCH_VERSION:
        if (status === FETCH_SUCCESS) {
            if (version.changed && state.filter(m => m.type === 'version').length === 0) {
                return [
                    ...state,
                    {type: 'version', message: VERSION_REFRESH_MESSAGE, start: null, end: null}
                ];
            }
        }
        return state;
    default:
        return state;
    }
};

const documentTitle = (state = 'Home', action) => {
    const {type, title} = action;
    switch (type) {
    case SET_DOCUMENT_TITLE:
        return title || '';
    default:
        return state;
    }
};

const keywords = (state = preferences.keywords, action) => {
    const {type, status, list} = action;
    switch (type) {
    case FETCH_KEYWORDS:
        if (status === FETCH_SUCCESS) {
            return [...list];
        }
        return state;
    default:
        return state;
    }
};

const lifestyle = (state = '', action) => {
    const {type, lifestyle, status, category} = action;
    switch (type) {
    case SET_LIFESTYLE:
        return lifestyle || '';
    case FETCH_PRODUCT:
        return status === FETCH_SUCCESS ? '' : state;
    case FETCH_CATEGORY:
        if (status === FETCH_SUCCESS) {
            return category.lifestyle || '';
        }
        return state;
    default:
        return state;
    }
};

const version = (state = preferences.version, action) => {
    const {type, status, version} = action;
    switch (type) {
    case FETCH_VERSION:
        if (status === FETCH_SUCCESS) {
            return {...version};
        }
        return state;
    default:
        return state;
    }
};

const debug = (state = null, action) => {
    // console.log('debug action', action);
    return state;
}


export default combineReducers({
    alerts,
    // searchTerm,
    // searchResults,
    // searchLoading,
    productMenu,
    productMenuBC,
    showNavBar,
    subNav,
    rowsPerPage,
    customerTab,
    slides,
    messages,
    documentTitle,
    keywords,
    lifestyle,
    version,
    debug,
    search,
});
