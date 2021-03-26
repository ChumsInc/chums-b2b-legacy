import {combineReducers} from 'redux';
import {alertReducer} from 'chums-ducks';
import app from './app';
import user from './user';
import products from './products';
import category from './category';
import customer from './customer';
import carts from './carts';
import openOrders from './openOrders';
import pastOrders from './pastOrders';
import invoices from './invoices';
import salesOrder from './salesOrder';
import cart from './cart';
import page from './page';
import promo_code from "./promo_code";

export default combineReducers({
    alerts: alertReducer,
    app,
    user,
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
    invoices
});
