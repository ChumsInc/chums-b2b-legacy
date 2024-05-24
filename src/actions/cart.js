import {
    APPEND_ORDER_COMMENT,
    CREATE_NEW_CART,
    DELETE_CART,
    FETCH_CART,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_ITEM_AVAILABILITY,
    FETCH_SUCCESS,
    PROMOTE_CART,
    SAVE_CART,
    SAVE_CART_FAILURE,
    SET_CART,
    SET_CART_PROGRESS,
    SET_SHIP_DATE,
    SET_SHIPPING_ACCOUNT,
    UPDATE_CART,
    UPDATE_CART_ITEM
} from "../constants/actions";
import {isCartOrder} from "../utils/orders";
import {buildPath, fetchGET, fetchPOST} from "../utils/fetch";
import {
    API_PATH_DELETE_CART,
    API_PATH_ITEM_AVAILABILITY,
    API_PATH_PROMOTE_CART,
    API_PATH_SAVE_CART,
    CART_ACTIONS
} from "../constants/paths";
import {handleError, logError, setAlert} from "./app";
import {fetchOpenOrders, loadSalesOrder} from "./salesOrder";
import {sageCompanyCode, shipToAddressFromBillingAddress} from "../utils/customer";
import {CREDIT_CARD_PAYMENT_TYPES} from "../constants/account";
import localStore from "../utils/LocalStore";
import {STORE_CURRENT_CART, STORE_CUSTOMER_SHIPPING_ACCOUNT} from "../constants/stores";
import {NEW_CART} from "../constants/orders";
import {selectCartsList} from "../selectors/carts";
import {selectCustomerAccount} from "../selectors/customer";
import {selectCartNo} from "../selectors/cart";
import {fetchSalesOrder} from "../api/sales-order";
import {ga_addToCart, ga_purchase} from "./gtag";
import dayjs from "dayjs";

export const customerFromState = ({user}) => {
    const {Company, ARDivisionNo, CustomerNo, ShipToCode = ''} = user.currentCustomer;
    return {Company: sageCompanyCode(Company), ARDivisionNo, CustomerNo, ShipToCode};
};

/**
 *
 * @param {Partial<SalesOrderHeader>} props
 * @param checkoutInProcess
 * @return {{type: string, checkoutInProcess: boolean, props}}
 */
export const updateCart = (props, checkoutInProcess = false) => ({type: UPDATE_CART, props, checkoutInProcess});
export const updateCartItem = ({LineKey, prop}) => ({type: UPDATE_CART_ITEM, LineKey, prop});


export const newCart = () => (dispatch, getState) => {
    const {customer} = getState();
    const {Company, ARDivisionNo, CustomerNo, PrimaryShipToCode} = customer.account;
    const [shipToAddress] = customer.shipToAddresses.filter(st => st.ShipToCode === PrimaryShipToCode)
    || [shipToAddressFromBillingAddress(customer)];
    const cart = {
        Company,
        SalesOrderNo: NEW_CART,
        OrderDate: new Date().toISOString(),
        OrderType: 'Q',
        OrderStatus: 'N',
        ShipExpireDate: new Date().toISOString(),
        ARDivisionNo, CustomerNo,
        CustomerPONo: '',
        ...shipToAddress,
        detail: []
    };
    dispatch({type: CREATE_NEW_CART, cart});
    // dispatch({type: SET_CART, cart});
};

export const setCurrentCart = ({Company, SalesOrderNo, CustomerPONo}, skipLoad = false) => (dispatch, getState) => {
    const state = getState();
    const carts = selectCartsList(state);
    const account = selectCustomerAccount(state);
    if (!account) {
        return;
    }
    const {ARDivisionNo, CustomerNo} = account;
    // const [cart = {Company, SalesOrderNo, CustomerPONo}] = [...carts.list]
    //     .filter(so => so.SalesOrderNo === SalesOrderNo);
    const [cart] = carts.filter(so => so.SalesOrderNo === SalesOrderNo);
    if (!cart) {
        return;
    }
    localStore.setItem(STORE_CURRENT_CART, cart.SalesOrderNo);
    dispatch({type: SET_CART, cart});
    if (skipLoad === true || SalesOrderNo === NEW_CART) {
        return;
    }
    if (!!SalesOrderNo) {
        dispatch(loadSalesOrder(SalesOrderNo));
    }
};


export const loadCurrentCart = () => async (dispatch, getState) => {
    try {
        const state = getState();
        const customerAccount = selectCustomerAccount(state);
        const cartNo = selectCartNo(state);
        if (!customerAccount.CustomerNo || !cartNo) {
            return;
        }
        const {ARDivisionNo, CustomerNo} = customerAccount;
        const salesOrder = await fetchSalesOrder({ARDivisionNo, CustomerNo, SalesOrderNo: cartNo});
        dispatch({type: FETCH_CART, status: FETCH_SUCCESS, salesOrder});
    } catch (err) {
        dispatch({type: FETCH_CART, status: FETCH_FAILURE});
        dispatch(handleError(err, FETCH_CART));
        if (err.debug) {
            dispatch(logError({message: err.message, debug: err.debug}));
        }
    }
};

export const saveNewCart = ({cartName, itemCode, quantity = 1, comment = '', price = 0}) => (dispatch, getState) => {
    const {user, promo_code} = getState();
    if (!cartName) {
        dispatch(setAlert({message: 'Unable to save your cart without a cart name!'}));
        return;
    }

    const data = {
        action: CART_ACTIONS.newCart,
        CartName: cartName,
        ItemCode: itemCode,
        QuantityOrdered: quantity,
        Comment: comment,
        SalesOrderNo: '',
        promo_code: promo_code.code,
    };

    const customer = customerFromState({user});
    const url = buildPath(API_PATH_SAVE_CART, customer);
    dispatch({type: SAVE_CART, status: FETCH_INIT, message: 'Creating new cart'});
    ga_addToCart(itemCode, quantity, price);
    return fetchPOST(url, data)
        .then(res => {
            const {SalesOrderNo} = res;
            localStore.setItem(STORE_CURRENT_CART, SalesOrderNo);
            dispatch({type: SAVE_CART, status: FETCH_SUCCESS});
            dispatch(fetchOpenOrders(customer))
                .then(() => {
                    const {carts} = getState();
                    const [cart] = carts.list.filter(so => so.SalesOrderNo === SalesOrderNo);
                    if (!cart) {
                        return;
                    }
                    dispatch(setCurrentCart(cart, true));
                });
            return {SalesOrderNo, ...customer};
        })
        .catch(err => {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        })
};
/**
 *
 * @return Promise
 */
export const saveCart = () => (dispatch, getState) => {
    const {salesOrder, promo_code} = getState();

    if (!isCartOrder(salesOrder.header)) {
        return Promise.resolve();
    }
    const url = buildPath(API_PATH_SAVE_CART, salesOrder.header);

    const changedLines = salesOrder.detail
        .filter(line => line.changed && !line.newLine)
        .map(({LineKey, ItemCode, QuantityOrdered, CommentText}) => ({LineKey, ItemCode, QuantityOrdered, CommentText}))
        .sort((a, b) => a.LineKey > b.LineKey ? 1 : -1);

    const newLines = salesOrder.detail
        .filter(line => line.newLine)
        .map(({LineKey, CommentText}) => ({LineKey, CommentText}))
        .sort((a, b) => a.LineKey > b.LineKey ? 1 : -1);

    const {
        ShipToCode,
        ShipToName,
        ShipToAddress1,
        ShipToAddress2,
        ShipToAddress3,
        ShipToCity,
        ShipToState,
        ShipToZipCode
    } = salesOrder.header;

    const body = {
        action: CART_ACTIONS.updateCart,
        SalesOrderNo: salesOrder.header.SalesOrderNo,
        CartName: salesOrder.header.CustomerPONo,
        ShipToCode: ShipToCode || '',
        ShipToName: ShipToName || '',
        ShipToAddress1: ShipToAddress1 || '',
        ShipToAddress2: ShipToAddress2 || '',
        ShipToAddress3: ShipToAddress3 || '',
        ShipToCity: ShipToCity || '',
        ShipToState: ShipToState || '',
        ShipToZipCode: ShipToZipCode || '',
        ConfirmTo: salesOrder.header.ConfirmTo || null,
        changedLines,
        newLines,
        promo_code: promo_code.code,
    };
    dispatch({type: SAVE_CART, status: FETCH_INIT});
    return fetchPOST(url, body)
        .then(res => {
            if (res.success) {
                dispatch({type: SAVE_CART, status: FETCH_SUCCESS});
                dispatch(loadSalesOrder(salesOrder.header.SalesOrderNo));
            }
        })
        .catch(err => {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        });

};

export const promoteCart = () => (dispatch, getState) => {
    const {salesOrder, cart, promo_code} = getState();
    const {header, detail} = salesOrder;

    if (!isCartOrder(header)) {
        return;
    }

    const comment = [];
    if (cart.shippingAccount.enabled) {
        comment.push(`COL ${cart.shippingAccount.value}`);
    } else if (salesOrder.header.ARDivisionNo === '01' && CREDIT_CARD_PAYMENT_TYPES.includes(header.PaymentType)) {
        comment.push('FREE');
    }
    if (header.hold) {
        comment.push('HOLD');
    } else {
        comment.push('SWR');
    }

    const data = {
        action: CART_ACTIONS.promoteCart,
        SalesOrderNo: header.SalesOrderNo,
        CartName: header.CustomerPONo,
        ShipExpireDate: dayjs(cart.shipDate).toISOString(),
        ShipVia: header.ShipVia,
        PaymentType: header.PaymentType,
        ShipToCode: header.ShipToCode,
        Comment: comment.join(' '),
        promo_code: header.UDF_PROMO_DEAL || promo_code.promo_code || '',
    };

    const url = buildPath(API_PATH_PROMOTE_CART, header);

    dispatch({type: PROMOTE_CART, status: FETCH_INIT});
    ga_purchase(header.SalesOrderNo, header.TaxableAmt + header.NonTaxableAmt - header.DiscountAmt, detail);
    return fetchPOST(url, data)
        .then(res => {
            dispatch({type: PROMOTE_CART, status: FETCH_SUCCESS, salesOrder: header});
            dispatch(loadSalesOrder(header.SalesOrderNo));
            dispatch(fetchOpenOrders(header));
            return res.success;
        })
        .catch(err => {
            dispatch({type: PROMOTE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, PROMOTE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        })
};

export const removeCart = (cart) => (dispatch, getState) => {
    if (!isCartOrder(cart)) {
        return;
    }
    const {cartNo} = getState().cart;
    const isCart = cartNo === cart.SalesOrderNo;
    const url = buildPath(API_PATH_DELETE_CART, cart);
    const data = {
        action: CART_ACTIONS.deleteCart,
        SalesOrderNo: cart.SalesOrderNo,
    };
    dispatch({type: DELETE_CART, status: FETCH_INIT});
    return fetchPOST(url, data)
        .then(res => {
            dispatch({type: DELETE_CART, status: FETCH_SUCCESS, isCart});
            dispatch(fetchOpenOrders(cart));
        })
        .catch(err => {
            dispatch({type: DELETE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, DELETE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        });
};

export const saveCartItem = ({
                                 SalesOrderNo,
                                 LineKey,
                                 ItemCode,
                                 QuantityOrdered,
                                 CommentText = '',
                                 ItemType,
                                 price = 0,
                             }) => (dispatch, getState) => {
    if (ItemType === '4' && ItemCode === '/C') {
        return dispatch(addCommentLine({SalesOrderNo, LineKey, CommentText}));
    }
    if (QuantityOrdered === 0) {
        return dispatch(deleteCartItem({SalesOrderNo, LineKey}));
    }
    let action = CART_ACTIONS.updateCartItem;
    if (!LineKey) {
        action = CART_ACTIONS.addItem;
    }
    const {customer, salesOrder} = getState();
    const data = {
        action,
        SalesOrderNo,
        LineKey,
        ItemCode,
        QuantityOrdered,
        Comment: CommentText,
    };
    const url = buildPath(API_PATH_SAVE_CART, customer.account);
    dispatch({type: SAVE_CART, status: FETCH_INIT});
    if (!LineKey) {
        ga_addToCart(ItemCode, QuantityOrdered, price);
    }
    fetchPOST(url, data)
        .then(result => {
            if (!result.success) {
                dispatch(setAlert({message: 'Unable to update cart', context: SAVE_CART}));
                dispatch({type: SAVE_CART, status: FETCH_FAILURE});
                return;
            }
            dispatch({
                type: SAVE_CART,
                status: FETCH_SUCCESS,
                message: `Added to cart: ${ItemCode} (qty: ${QuantityOrdered})`
            });
            if (SalesOrderNo === salesOrder.salesOrderNo) {
                dispatch(loadSalesOrder(SalesOrderNo));
            } else {
                dispatch(loadCurrentCart());
            }
        })
        .catch(err => {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        });
};

export const appendCommentLine = (commentText) => ({type: APPEND_ORDER_COMMENT, commentText});

export const addCommentLine = ({SalesOrderNo, LineKey = '', CommentText = ''}) => (dispatch, getState) => {
    const action = CART_ACTIONS.setComment;
    const data = {
        action,
        SalesOrderNo,
        lineKey: LineKey,
        Comment: CommentText,
    };

    const {salesOrder} = getState();
    const url = buildPath(API_PATH_SAVE_CART, salesOrder.header);
    dispatch({type: SAVE_CART});
    return fetchPOST(url, data)
        .then(res => {
            dispatch(loadSalesOrder(SalesOrderNo));
        })
        .catch(err => {
            dispatch({type: SAVE_CART_FAILURE});
            dispatch(handleError(err));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        });
};

export const deleteCartItem = ({SalesOrderNo, LineKey}) => (dispatch, getState) => {
    const data = {
        action: CART_ACTIONS.deleteItem,
        SalesOrderNo,
        LineKey,
    };
    const state = getState();
    const currentCustomer = selectCustomerAccount(state);
    if (!currentCustomer) {
        return;
    }
    const {Company, ARDivisionNo, CustomerNo} = currentCustomer;
    const url = buildPath(API_PATH_SAVE_CART, customerFromState(getState()));
    dispatch({type: SAVE_CART});
    fetchPOST(url, data)
        .then(res => {
            dispatch(loadSalesOrder(SalesOrderNo));
        })
        .catch(err => {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        })
};

export const getItemAvailability = ({ItemCode}) => (dispatch, getState) => {
    const {customer} = getState();
    const {company} = customer;
    const url = buildPath(API_PATH_ITEM_AVAILABILITY, {Company: sageCompanyCode(company), ItemCode});
    dispatch({type: FETCH_ITEM_AVAILABILITY, status: FETCH_INIT, item: {ItemCode}});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const [item] = res.result;
            dispatch({type: FETCH_ITEM_AVAILABILITY, status: FETCH_SUCCESS, item});
        })
        .catch(err => {
            dispatch({type: FETCH_ITEM_AVAILABILITY, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_ITEM_AVAILABILITY));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        });
};

export const setCartProgress = (value) => ({type: SET_CART_PROGRESS, value});
export const setShipDate = (shipDate) => ({type: SET_SHIP_DATE, shipDate});
export const setShippingAccount = ({enabled = false, value = ''}) => (dispatch, getState) => {
    localStore.setItem(STORE_CUSTOMER_SHIPPING_ACCOUNT, {enabled, value});
    dispatch({type: SET_SHIPPING_ACCOUNT, enabled, value});
};
