import {combineReducers} from 'redux';
import app from '../reducers/app';
import user from '../reducers/user';
import products from '../reducers/products';
import category from '../reducers/category';
import customer from '../reducers/customer';
import carts from '../reducers/carts';
import openOrders from '../reducers/openOrders';
import pastOrders from '../reducers/pastOrders';
import invoices from '../reducers/invoices';
import salesOrder from '../reducers/salesOrder';
import cart from '../reducers/cart';
import page from '../reducers/page';
import promo_code from "../reducers/promo_code";
import {default as versionReducer} from './version/index';
import menuReducer from "./menu";


const rootReducer = combineReducers({
    app,
    user,
    menu: menuReducer,
    products,
    category,
    customer,
    cart,
    carts,
    openOrders,
    pastOrders,
    salesOrder,
    page,
    promo_code,
    invoices,
    version: versionReducer
});

// export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
