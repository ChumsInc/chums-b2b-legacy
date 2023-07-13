import {combineReducers} from 'redux';
import app from './app';
import user from './user';
import products from './products';
import category from './category';
import customer from './customer';
import carts from './carts';
import openOrders from './open-orders';
import invoices from './invoices';
import cart from './cart';
import page from '../reducers/page';
import promo_code from "../reducers/promo_code";
import {default as versionReducer} from './version/index';
import salesOrderReducer from "./salesOrder";


const rootReducer = combineReducers({
    app,
    user,
    products,
    category,
    customer,
    cart,
    carts,
    openOrders,
    salesOrder: salesOrderReducer,
    page,
    promo_code,
    invoices,
    version: versionReducer
});

// export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
