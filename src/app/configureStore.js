import {combineReducers, configureStore} from '@reduxjs/toolkit';
import alertsReducer from "../ducks/alerts";
import app from "../ducks/app";
import user from "../ducks/user";
import productsReducer from "../ducks/products";
import categoryReducer from "../ducks/category";
import customer from "../ducks/customer";
import cartReducer from "../ducks/cart";
import carts from "../ducks/carts";
import openOrders from "../ducks/open-orders";
import page from "../reducers/page";
import promo_code from "../ducks/promo-code";
import invoices from "../ducks/invoices";
import salesOrderReducer from "../ducks/salesOrder";
import {useDispatch, useSelector} from "react-redux";
import preloadedState from "./preloaded-state";
import versionReducer from "../ducks/version";
import messagesReducer from "../ducks/messages";
import searchReducer from "../ducks/search";
import menuReducer from "../ducks/menu";
import slidesReducer from "../ducks/slides";
import keywordsReducer from "../ducks/keywords";

export const rootReducer = combineReducers({
    alerts: alertsReducer,
    app,
    category: categoryReducer,
    customer,
    cart: cartReducer,
    carts,
    invoices,
    keywords: keywordsReducer,
    menu: menuReducer,
    messages: messagesReducer,
    openOrders,
    page,
    products: productsReducer,
    promo_code,
    salesOrder: salesOrderReducer,
    search: searchReducer,
    slides: slidesReducer,
    user,
    version: versionReducer
});
console.log('preloadedState', preloadedState, window?.__PRELOADED_STATE__);

const store = configureStore({
    reducer: rootReducer,
    preloadedState: {...preloadedState},
});

export const useAppDispatch = () => useDispatch();

/**
 *
 * @type {AppSelector}
 */
export const useAppSelector = useSelector;

export default store;
