import {combineReducers, configureStore} from '@reduxjs/toolkit';
import './global-window';
import alertsReducer from "../ducks/alerts";
import appReducer from "../ducks/app";
import userReducer from "../ducks/user";
import productsReducer from "../ducks/products";
import categoryReducer from "../ducks/category";
import customerReducer from "../ducks/customer";
import cartReducer from "../ducks/cart";
import cartsReducer from "../ducks/carts";
import openOrdersReducer from "../ducks/open-orders";
import promoCodeReducer from "../ducks/promo-code";
import invoicesReducer from "../ducks/invoices";
import salesOrderReducer from "../ducks/salesOrder";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import prepState from "./preloaded-state";
import versionReducer from "../ducks/version";
import messagesReducer from "../ducks/messages";
import searchReducer from "../ducks/search";
import menuReducer from "../ducks/menu";
import slidesReducer from "../ducks/slides";
import keywordsReducer from "../ducks/keywords";
import pageReducer from "../ducks/page";


export const rootReducer = combineReducers({
    alerts: alertsReducer,
    app: appReducer,
    cart: cartReducer,
    carts: cartsReducer,
    category: categoryReducer,
    customer: customerReducer,
    invoices: invoicesReducer,
    keywords: keywordsReducer,
    menu: menuReducer,
    messages: messagesReducer,
    openOrders: openOrdersReducer,
    page: pageReducer,
    products: productsReducer,
    promo_code: promoCodeReducer,
    salesOrder: salesOrderReducer,
    search: searchReducer,
    slides: slidesReducer,
    user: userReducer,
    version: versionReducer
});

const store = configureStore({
    reducer: rootReducer,
    preloadedState: prepState(window?.__PRELOADED_STATE__ ?? {}),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
