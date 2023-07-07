import {combineReducers, configureStore} from '@reduxjs/toolkit';
import alertsReducer from "../ducks/alerts";
import app from "../ducks/app";
import user from "../reducers/user";
import productsReducer from "../ducks/products";
import categoryReducer from "../ducks/category";
import customer from "../ducks/customer";
import cartReducer from "../ducks/cart";
import carts from "../ducks/carts";
import openOrders from "../reducers/openOrders";
import page from "../reducers/page";
import promo_code from "../reducers/promo_code";
import invoices from "../ducks/invoices";
import salesOrderReducer from "../ducks/salesOrder";
import {useDispatch, useSelector} from "react-redux";
import preloadedState from "./preloaded-state";
import versionReducer from "../ducks/version";
import messagesReducer from "../ducks/messages";
import searchReducer from "../ducks/search";

export const rootReducer = combineReducers({
    alerts: alertsReducer,
    app,
    category: categoryReducer,
    customer,
    cart: cartReducer,
    carts,
    invoices,
    messages: messagesReducer,
    openOrders,
    page,
    products: productsReducer,
    promo_code,
    salesOrder: salesOrderReducer,
    search: searchReducer,
    user,
    version: versionReducer
});

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
