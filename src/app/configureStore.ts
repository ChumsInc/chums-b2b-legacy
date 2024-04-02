import {combineReducers, configureStore} from '@reduxjs/toolkit';
import './global-window';
import alertsReducer from "../ducks/alerts";
import appReducer from "../ducks/app";
import userReducer from "../ducks/user";
import productsReducer from "../ducks/products";
import categoryReducer from "../ducks/category";
import customerReducer from "../ducks/customer";
import cartReducer from "../ducks/cart";
import openOrdersReducer from "../ducks/open-orders";
import promoCodeReducer from "../ducks/promo-code";
import invoicesReducer from "../ducks/invoices";
import salesOrderReducer from "../ducks/sales-order";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import prepState from "./preloaded-state";
import versionReducer from "../ducks/version";
import messagesReducer from "../ducks/messages";
import searchReducer from "../ducks/search";
import menuReducer from "../ducks/menu";
import slidesReducer from "../ducks/slides";
import keywordsReducer from "../ducks/keywords";
import pageReducer from "../ducks/page";
import customersReducer from "../ducks/customers";
import repsReducer from "../ducks/reps";
import itemLookupReducer from "../ducks/item-lookup";
import bannersReducer from "../ducks/banners";
import signUpReducer from "../ducks/sign-up";


export const rootReducer = combineReducers({
    alerts: alertsReducer,
    app: appReducer,
    banners: bannersReducer,
    cart: cartReducer,
    category: categoryReducer,
    customer: customerReducer,
    customers: customersReducer,
    invoices: invoicesReducer,
    itemLookup: itemLookupReducer,
    keywords: keywordsReducer,
    menu: menuReducer,
    messages: messagesReducer,
    openOrders: openOrdersReducer,
    page: pageReducer,
    products: productsReducer,
    promo_code: promoCodeReducer,
    reps: repsReducer,
    salesOrder: salesOrderReducer,
    search: searchReducer,
    signUp: signUpReducer,
    slides: slidesReducer,
    user: userReducer,
    version: versionReducer
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }),
    preloadedState: prepState(typeof window === 'undefined' ? {} : window?.__PRELOADED_STATE__ ?? {}),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
