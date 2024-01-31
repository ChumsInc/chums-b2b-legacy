import {FETCH_KEYWORDS, FETCH_PRODUCT, FETCH_SUCCESS,} from "../../constants/actions";
import {CUSTOMER_TABS, SUB_NAV_TYPES} from "../../constants/app";
import localStore from "../../utils/LocalStore";
import {STORE_USER_PREFS} from "../../constants/stores";
import {createReducer} from "@reduxjs/toolkit";
import {setCustomerTab, setLifestyle, setRowsPerPage, setSubNavBar, toggleXSNavBar} from "./actions";
import {setCustomerAccount} from "../customer/actions";
import {PreloadedState} from "../../types/preload";
import {AppState} from "./types";
import {isDeprecatedKeywordsAction} from "../keywords/utils";
import {isAsyncAction} from "../../types/actions";

export const initialAppState = (preload?: PreloadedState): AppState => ({
    productMenu: preload?.app?.productMenu ?? null,
    showNavBar: false,
    subNav: '',
    rowsPerPage: localStore.getItem(STORE_USER_PREFS, {rowsPerPage: 10}).rowsPerPage,
    customerTab: CUSTOMER_TABS[0].id,
    documentTitle: 'Home',
    keywords: preload?.keywords?.list ?? [],
    lifestyle: '',
    debug: null,
})

const appReducer = createReducer(initialAppState, (builder) => {
    builder
        .addCase(setCustomerAccount.fulfilled, (state, action) => {
            state.customerTab = CUSTOMER_TABS[0].id;
        })
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
            state.lifestyle = action.payload ?? '';
        })
        .addCase(setCustomerTab, (state, action) => {
            state.customerTab = action.payload;
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_KEYWORDS:
                    if (isDeprecatedKeywordsAction(action) && action.status === FETCH_SUCCESS) {
                        state.keywords = action.list;
                    }
                    return;
                case FETCH_PRODUCT:
                    if (isAsyncAction(action) && action.status === FETCH_SUCCESS) {
                        state.lifestyle = '';
                    }
                    return;
            }
        })
})

export default appReducer;
