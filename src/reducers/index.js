import {combineReducers} from 'redux';
import app from '../ducks/app';
import user from '../ducks/user';
import products from '../ducks/products';
import category from '../ducks/category';
import customer from '../ducks/customer';
import carts from '../ducks/carts';
import openOrders from '../ducks/open-orders';
import invoices from '../ducks/invoices';
import salesOrder from './salesOrder';
import cart from '../ducks/cart';
import page from './page';
import promo_code from "./promo_code";

export default combineReducers({
    app,
    user,
    products,
    category,
    customer,
    cart,
    carts,
    openOrders,
    salesOrder,
    page,
    promo_code,
    invoices
});
