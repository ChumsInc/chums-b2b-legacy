import { combineReducers } from 'redux';
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
import { default as versionReducer } from './version';
var rootReducer = combineReducers({
    app: app,
    user: user,
    products: products,
    category: category,
    customer: customer,
    cart: cart,
    carts: carts,
    openOrders: openOrders,
    pastOrders: pastOrders,
    salesOrder: salesOrder,
    page: page,
    promo_code: promo_code,
    invoices: invoices,
    version: versionReducer
});
export default rootReducer;
//# sourceMappingURL=index.js.map