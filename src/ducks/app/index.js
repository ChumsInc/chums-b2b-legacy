import {
    FETCH_CATEGORY,
    FETCH_KEYWORDS,
    FETCH_PRODUCT,
    FETCH_SLIDES,
    FETCH_SUCCESS,
    SET_CUSTOMER,
    SET_CUSTOMER_TAB,
    SET_DOCUMENT_TITLE,
    SET_LIFESTYLE,
} from "../../constants/actions";
import {CUSTOMER_TABS, SUB_NAV_TYPES} from "../../constants/app";
import localStore from "../../utils/LocalStore";
import {STORE_USER_PREFS} from "../../constants/stores";
import {createReducer} from "@reduxjs/toolkit";
import {setCustomerTab, setLifestyle, setRowsPerPage, setSubNavBar, toggleXSNavBar} from "./actions";

if (typeof window === "undefined") {
    global.window = {};
}

if (!window.__PRELOADED_STATE__) {
    window.__PRELOADED_STATE__ = {};
}
const preferences = {
    version: (window.CHUMS || {}).version || {},
    keywords: window.__PRELOADED_STATE__.keywords || [],
    productMenu: window.__PRELOADED_STATE__.menu_chums || [],
    productMenuBC: window.__PRELOADED_STATE__.menu_bc || [],
    rowsPerPage: 10,
    customerTab: CUSTOMER_TABS[0].id,
    messages: window.__PRELOADED_STATE__.messages || [],
    ...localStore.getItem(STORE_USER_PREFS) || {},
};

/**
 *
 * @type {AppState}
 */
export const initialAppState = {
    productMenu: window?.__PRELOADED_STATE__?.app?.productMenu ?? null,
    showNavBar: false,
    subNav: '',
    rowsPerPage: localStore.getItem(STORE_USER_PREFS, {rowsPerPage: 10}).rowsPerPage,
    customerTab: CUSTOMER_TABS[0].id,
    documentTitle: 'Home',
    keywords: window?.__PRELOADED_STATE__?.keywords ?? [],
    lifestyle: '',
    debug: null,
}

const appReducer = createReducer(initialAppState, (builder) => {
    builder
        .addCase(toggleXSNavBar, (state) => {
            state.showNavBar = !state.showNavBar;
        })
        .addCase(setSubNavBar, (state, action) => {
            state.subNav = action.payload;
            if (action.payload === SUB_NAV_TYPES.none) {
                state.showNavBar = false;
            }
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload;
        })
        .addCase(setLifestyle, (state, action) => {
            state.lifestyle = action.payload;
        })
        .addCase(setCustomerTab, (state, action) => {
            state.customerTab = action.payload;
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SET_CUSTOMER:
                    state.customerTab = CUSTOMER_TABS[0].id;
                    return;
                case FETCH_KEYWORDS:
                    if (action.status === FETCH_SUCCESS) {
                        state.keywords = action.list;
                    }
                    return;
                case FETCH_PRODUCT:
                    if (action.status === FETCH_SUCCESS) {
                        state.lifestyle = '';
                    }
                    return;
                case FETCH_CATEGORY:
                    if (action.status === FETCH_SUCCESS) {
                        state.lifestyle = action.category?.lifestyle ?? '';
                    }
                    return;
            }
        })
})

export default appReducer;
