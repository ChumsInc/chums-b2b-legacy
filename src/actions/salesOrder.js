import {
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_INVOICE,
    FETCH_INVOICES,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    SAVE_CART,
    SELECT_SO,
    SEND_ORDER_EMAIL,
    SEND_ORDER_EMAIL_ACK,
    SET_CART,
} from "../constants/actions";
import {buildPath, fetchGET, fetchPOST} from "../utils/fetch";
import {
    API_PATH_INVOICE,
    API_PATH_OPEN_ORDERS,
    API_PATH_PAST_ORDERS,
    API_PATH_SAVE_CART,
    CART_ACTIONS
} from "../constants/paths";
import {isValidCustomer, sageCompanyCode} from "../utils/customer";
import {handleError, setAlert} from "./app";
import {isCartOrder} from "../utils/orders";
import localStore from "../utils/LocalStore";
import {STORE_CURRENT_CART} from "../constants/stores";
import {customerFromState, setCurrentCart} from "./cart";
import {NEW_CART} from "../constants/orders";
import {selectCustomerAccount} from "../selectors/customer";
import {fetchSalesOrder, postOrderEmail} from "../api/sales-order";
import {selectCartNo} from "../selectors/cart";
import {selectIsSendingEmail, selectProcessing} from "../selectors/salesOrder";


export const fetchOpenOrders = ({Company, ARDivisionNo, CustomerNo}) => (dispatch, getState) => {
    const {user} = getState();
    if (!user.loggedIn) {
        return;
    }
    if (!isValidCustomer({Company, ARDivisionNo, CustomerNo})) {
        return;
    }
    const url = buildPath(API_PATH_OPEN_ORDERS, {Company: sageCompanyCode(Company), ARDivisionNo, CustomerNo});
    dispatch({type: FETCH_ORDERS, status: FETCH_INIT});
    return fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const {result} = res;
            const state = getState();
            const {cartNo} = state.cart;
            const {salesOrderNo} = state.salesOrder;
            dispatch({type: FETCH_ORDERS, status: FETCH_SUCCESS, orders: result, cartNo, salesOrderNo});
            const carts = result
                .filter(so => isCartOrder(so));
            const [cart] = carts.filter(so => cartNo === '' || so.SalesOrderNo === cartNo);
            if (cart) {
                dispatch(setCurrentCart(cart, true));
            }
        })
        .catch(err => {
            console.log('fetchOpenOrders()', err.message);
            // if (err.name === AUTH_ERROR || err.message === AUTH_FAILED) {
            //     dispatch(setLoggedIn({loggedIn: false}));
            // }
            dispatch(handleError(err, FETCH_ORDERS));
            dispatch({type: FETCH_ORDERS, status: FETCH_FAILURE});
        });
};

export const fetchPastOrders = ({Company, ARDivisionNo, CustomerNo}) => (dispatch, getState) => {
    if (!isValidCustomer({Company, ARDivisionNo, CustomerNo})) {
        return;
    }
    const url = buildPath(API_PATH_PAST_ORDERS, {Company, ARDivisionNo, CustomerNo});
    dispatch({type: FETCH_INVOICES, status: FETCH_INIT});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const {list} = res;
            dispatch({type: FETCH_INVOICES, status: FETCH_SUCCESS, list});
        })
        .catch(err => {
            console.log('fetchPastOrders()', err.message);
            dispatch(handleError(err, FETCH_INVOICES));
            dispatch({type: FETCH_INVOICES, status: FETCH_FAILURE, message: err.message});
        });
};
/**
 *
 * @param {string} SalesOrderNo
 * @return {(function(*, *): Promise<void>)|*}
 */
export const loadSalesOrder = (SalesOrderNo) => async (dispatch, getState) => {
    if (!SalesOrderNo || SalesOrderNo === NEW_CART) {
        return;
    }
    const state = getState();
    const customerAccount = selectCustomerAccount(state);
    const cartNo = selectCartNo(state);
    const processing = selectProcessing(state);
    const {cart, customer} = getState();

    if (processing || !customerAccount?.CustomerNo) {
        return;
    }

    const isCart = cartNo === SalesOrderNo;
    const {ARDivisionNo, CustomerNo} = customerAccount;

    try {
        dispatch({type: FETCH_SALES_ORDER, status: FETCH_INIT, isCart});
        const salesOrder = await fetchSalesOrder({ARDivisionNo, CustomerNo, SalesOrderNo});
        if (!salesOrder || !salesOrder.SalesOrderNo) {
            dispatch({type: FETCH_SALES_ORDER, status: FETCH_FAILURE, isCart});
            dispatch(setAlert({message: 'That sales order was not found!', context: FETCH_SALES_ORDER}));
            // dispatch({type: FETCH_SALES_ORDER, status: FETCH_FAILURE, isCart});
            return;
        }
        dispatch({type: FETCH_SALES_ORDER, status: FETCH_SUCCESS, salesOrder, isCart});
        // check to see if the cart was promoted to an order.
        const isStillCart = [salesOrder]
            .filter(so => so.SalesOrderNo === cartNo)
            .filter(so => isCartOrder(so))
            .length === 1;
        if (!isStillCart) {
            dispatch({type: SET_CART, cart: {}});
        } else {
            const {promo_code} = getState();
            dispatch({type: SET_CART, cart: salesOrder});
            // if (((promo_code.code || '') !== (salesOrder.UDF_PROMO_DEAL || '')) && !promo_code.loading) {
            //     dispatch(applyPromoCode({Company, SalesOrderNo, discountCode: promo_code.code}));
            // }
        }
    } catch (err) {
        if (err instanceof Error) {
            console.debug("loadSalesOrder()", err.message);
        }
        dispatch({type: FETCH_SALES_ORDER, status: FETCH_FAILURE, isCart});
        dispatch(handleError(err, FETCH_SALES_ORDER));
    }
};

export const fetchInvoice = ({Company, InvoiceNo}) => (dispatch, getState) => {
    if (!InvoiceNo) {
        return;
    }
    const url = buildPath(API_PATH_INVOICE, {Company: sageCompanyCode(Company), InvoiceNo});
    dispatch({type: FETCH_INVOICE, status: FETCH_INIT});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const invoice = res.result || {};
            if (!invoice.InvoiceNo) {
                dispatch(setAlert({message: 'That invoice was not found', context: FETCH_INVOICE}))
            }
            dispatch({type: FETCH_INVOICE, status: FETCH_SUCCESS, invoice});
        })
};

export const selectSalesOrder = ({Company, SalesOrderNo}) => (dispatch, getState) => {
    const state = getState();
    const customer = selectCustomerAccount(state);
    if (!customer) {
        return;
    }
    const {ARDivisionNo, CustomerNo} = customer;
    const {carts, openOrders, pastOrders} = state;
    const [salesOrder = {SalesOrderNo}] = [...carts.list, ...openOrders.list, pastOrders.list]
        .filter(so => so.SalespersonNo === SalesOrderNo);
    dispatch({type: SELECT_SO, salesOrder});
    dispatch(loadSalesOrder(SalesOrderNo));
};

export const sendOrderEmail = ({Company, SalesOrderNo}) => async (dispatch, getState) => {
    const state = getState();
    if (selectIsSendingEmail(state)) {
        return;
    }
    const customer = selectCustomerAccount(state);
    if (!customer || !customer.CustomerNo) {
        return;
    }

    try {
        dispatch({type: SEND_ORDER_EMAIL, status: FETCH_INIT});
        const {ARDivisionNo, CustomerNo} = customer;
        const result = await postOrderEmail({ARDivisionNo, CustomerNo, SalesOrderNo});
        if (!result) {
            dispatch({type: SEND_ORDER_EMAIL, status: FETCH_FAILURE});
            dispatch(handleError(new Error('sending email returned null'), SEND_ORDER_EMAIL));
        }
        dispatch({type: SEND_ORDER_EMAIL, status: FETCH_SUCCESS, payload: {...result, confirmed: false}});
    } catch (err) {
        dispatch({type: SEND_ORDER_EMAIL, status: FETCH_FAILURE});
        dispatch(handleError(err, SEND_ORDER_EMAIL));
        if (err instanceof Error) {
            console.debug("sendOrderEmail()", err.message);
        }
    }
};

export const confirmEmailSent = () => ({type: SEND_ORDER_EMAIL_ACK});


export const duplicateOrder = ({SalesOrderNo, newCartName}) => (dispatch, getState) => {
    const {promo_code} = getState();
    const data = {
        action: CART_ACTIONS.duplicateCart,
        CartName: newCartName,
        SalesOrderNo,
        promo_code: promo_code.code,
    };
    const customer = customerFromState(getState());
    const url = buildPath(API_PATH_SAVE_CART, customer);
    dispatch({type: SAVE_CART, status: FETCH_INIT, message: 'Creating new cart'});
    return fetchPOST(url, data)
        .then(res => {
            const {SalesOrderNo} = res;
            localStore.setItem(STORE_CURRENT_CART, SalesOrderNo);
            dispatch({
                type: SET_CART,
                status: FETCH_SUCCESS,
                cart: {SalesOrderNo}
            });
            dispatch(fetchOpenOrders(customer));
            return SalesOrderNo;
        })
        .catch(err => {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_CART));
        })

};
