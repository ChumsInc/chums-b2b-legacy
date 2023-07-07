import {
    APPEND_ORDER_COMMENT,
    CREATE_NEW_CART,
    DELETE_CART,
    FETCH_CART,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SUCCESS,
    PROMOTE_CART,
    SAVE_CART,
    SAVE_CART_FAILURE,
    SET_CART,
    UPDATE_CART,
    UPDATE_CART_ITEM
} from "../../constants/actions";
import {isCartOrder} from "../../utils/orders";
import {CART_ACTIONS} from "../../constants/paths";
import {handleError, logError} from "../../actions/app";
import parseDate from "date-fns/parseJSON";
import {fetchOpenOrders, loadSalesOrder} from "../../actions/salesOrder";
import {sageCompanyCode, shipToAddressFromBillingAddress} from "../../utils/customer";
import {CREDIT_CARD_PAYMENT_TYPES} from "../../constants/account";
import localStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART} from "../../constants/stores";
import {NEW_CART} from "../../constants/orders";
import {selectCartsList} from "../carts/selectors";
import {selectCustomerAccount} from "../customer/selectors";
import {selectCartNo, selectItemAvailabilityLoading, selectShipDate, selectShippingAccount} from "./selectors";
import {fetchSalesOrder} from "../../api/sales-order";
import {fetchItemAvailability, postCartAction} from "../../api/cart";
import {selectSalesOrderDetail, selectSalesOrderHeader, selectSalesOrderNo} from "../salesOrder/selectors";
import {selectCurrentCustomer} from "../../selectors/user";
import {selectPromoCode} from "../../selectors/promo_code";
import {changedDetailLine, newCommentLine} from "../../utils/cart";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {setAlert} from "../alerts";

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

export const saveNewCart = ({shipToCode, cartName, itemCode, quantity = 1, comment = ''}) =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const customer = selectCurrentCustomer(state);
            const promo_code = selectPromoCode(state);

            if (!customer.ARDivisionNo || !customer.CustomerNo) {
                return;
            }

            if (!cartName) {
                dispatch(setAlert({message: 'Unable to save your cart without a cart name!'}));
                return;
            }

            /**
             *
             * @type {NewCartBody}
             */
            const data = {
                action: 'new',
                CartName: cartName,
                ItemCode: itemCode,
                QuantityOrdered: quantity,
                Comment: comment,
                SalesOrderNo: '',
                promo_code: promo_code,
            };

            const {Company, ARDivisionNo, CustomerNo} = customer;

            const {SalesOrderNo} = await postCartAction(Company, ARDivisionNo, CustomerNo, shipToCode, data);
            localStore.setItem(STORE_CURRENT_CART, SalesOrderNo);
            dispatch({type: SAVE_CART, status: FETCH_SUCCESS, payload: SalesOrderNo});
            dispatch(fetchOpenOrders(customer));
            const {carts} = getState();
            const [cart] = carts.list.filter(so => so.SalesOrderNo === SalesOrderNo);
            if (!cart) {
                return;
            }
            dispatch(setCurrentCart(cart, true));
            return {SalesOrderNo, ...customer};
        } catch (err) {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        }
    };


export const saveCart = () => async (dispatch, getState) => {
    try {
        const state = getState();
        const promo_code = selectPromoCode(state);
        const header = selectSalesOrderHeader(state);
        const detail = selectSalesOrderDetail(state);

        if (!header || !isCartOrder(header)) {
            return Promise.resolve();
        }

        const {
            Company,
            ARDivisionNo,
            CustomerNo,
            SalesOrderNo,
            CustomerPONo,
            ShipToCode,
            ShipToName,
            ShipToAddress1,
            ShipToAddress2,
            ShipToAddress3,
            ShipToCity,
            ShipToState,
            ShipToZipCode,
            ConfirmTo,
            UDF_PROMO_CODE
        } = header;

        const changedLines = detail
            .filter(line => line.changed && !line.newLine)
            .map(line => changedDetailLine(line))
            .sort((a, b) => a.LineKey > b.LineKey ? 1 : -1);

        const newLines = detail
            .filter(line => line.newLine)
            .map(line => newCommentLine(line))
            .sort((a, b) => a.LineKey > b.LineKey ? 1 : -1);

        /**
         *
         * @type {CartUpdateBody}
         */
        const body = {
            action: 'update',
            SalesOrderNo: SalesOrderNo,
            CartName: CustomerPONo,
            ShipToCode: ShipToCode || '',
            ShipToName: ShipToName || '',
            ShipToAddress1: ShipToAddress1 || '',
            ShipToAddress2: ShipToAddress2 || '',
            ShipToAddress3: ShipToAddress3 || '',
            ShipToCity: ShipToCity || '',
            ShipToState: ShipToState || '',
            ShipToZipCode: ShipToZipCode || '',
            ConfirmTo: ConfirmTo || null,
            changedLines,
            newLines,
            promo_code: UDF_PROMO_CODE ?? promo_code ?? '',
        };

        dispatch({type: SAVE_CART, status: FETCH_INIT});
        const {success} = await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, body);
        if (!success) {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            return;
        }
        dispatch({type: SAVE_CART, status: FETCH_SUCCESS});
        dispatch(loadSalesOrder(header.SalesOrderNo));
    } catch (err) {
        dispatch({type: SAVE_CART, status: FETCH_FAILURE});
        dispatch(handleError(err, SAVE_CART));
        if (err.debug) {
            dispatch(logError({message: err.message, debug: err.debug}));
        }
    }
};

export const promoteCart = () => async (dispatch, getState) => {
    try {
        const state = getState();
        const header = selectSalesOrderHeader(state);
        const promoCode = selectPromoCode(state);
        const shippingAccount = selectShippingAccount(state);
        const shipDate = selectShipDate(state);


        if (!isCartOrder(header)) {
            return;
        }

        const {Company, ARDivisionNo, CustomerNo, ShipToCode} = header;

        const comment = [];
        if (shippingAccount.enabled) {
            comment.push(`COL ${shippingAccount.value}`);
        } else if (header.ARDivisionNo === '01' && CREDIT_CARD_PAYMENT_TYPES.includes(header.PaymentType)) {
            comment.push('FREE');
        }
        if (header.hold) {
            comment.push('HOLD');
        } else {
            comment.push('SWR');
        }

        /**
         *
         * @type {PromoteCartBody}
         */
        const data = {
            action: CART_ACTIONS.promoteCart,
            SalesOrderNo: header.SalesOrderNo,
            CartName: header.CustomerPONo,
            ShipExpireDate: parseDate(shipDate).toISOString(),
            ShipVia: header.ShipVia,
            PaymentType: header.PaymentType,
            ShipToCode: header.ShipToCode,
            Comment: comment.join(' '),
            promo_code: header.UDF_PROMO_DEAL || promoCode || '',
        };

        dispatch({type: PROMOTE_CART, status: FETCH_INIT});

        const response = await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, data);

        dispatch({type: PROMOTE_CART, status: FETCH_SUCCESS, salesOrder: header});
        dispatch(loadSalesOrder(header.SalesOrderNo));
        dispatch(fetchOpenOrders(header));
        return response.success;
    } catch (err) {
        dispatch({type: PROMOTE_CART, status: FETCH_FAILURE});
        dispatch(handleError(err, PROMOTE_CART));
        if (err.debug) {
            dispatch(logError({message: err.message, debug: err.debug}));
        }
    }
};

/**
 *
 * @param {SalesOrderHeader} cart
 * @return {Promise<void>}
 */
export const removeCart = (cart) =>
    async (dispatch, getState) => {
        try {
            if (!isCartOrder(cart)) {
                return;
            }
            const {Company, ARDivisionNo, CustomerNo, ShipToCode} = cart;
            const state = getState();
            const _cartNo = selectCartNo(state);
            const isCart = _cartNo === cart.SalesOrderNo;
            /**
             *
             * @type {DeleteCartBody}
             */
            const data = {
                action: CART_ACTIONS.deleteCart,
                SalesOrderNo: cart.SalesOrderNo,
            };
            dispatch({type: DELETE_CART, status: FETCH_INIT});
            await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, data);
            dispatch({type: DELETE_CART, status: FETCH_SUCCESS, isCart});
            dispatch(fetchOpenOrders({Company, ARDivisionNo, CustomerNo}));
        } catch (err) {
            dispatch({type: DELETE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, DELETE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        }

    };

/**
 *
 * @param {string} SalesOrderNo
 * @param {string} LineKey
 * @param {string} ItemCode
 * @param {number} QuantityOrdered
 * @param {string} CommentText
 * @param {string} ItemType
 * @return {(function(*, *): Promise<*|undefined>)|*}
 */
export const saveCartItem = ({
                                 SalesOrderNo,
                                 LineKey,
                                 ItemCode,
                                 QuantityOrdered,
                                 CommentText = '',
                                 ItemType
                             }) =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const customer = selectCurrentCustomer(state);
            const _salesOrderNo = selectSalesOrderNo(state);

            if (!customer.ARDivisionNo || !customer.CustomerNo) {
                return;
            }

            if (ItemType === '4' && ItemCode === '/C') {
                return dispatch(addCommentLine({SalesOrderNo, LineKey, CommentText}));
            }
            if (QuantityOrdered === 0) {
                return dispatch(deleteCartItem({SalesOrderNo, LineKey}));
            }

            const {Company, ARDivisionNo, CustomerNo, ShipToCode} = customer;
            /**
             *
             * @type {UpdateCartItemBody}
             */
            const data = {
                action: !LineKey ? 'append' : 'update-item',
                SalesOrderNo,
                LineKey,
                ItemCode,
                QuantityOrdered,
                Comment: CommentText,
            };
            dispatch({type: SAVE_CART, status: FETCH_INIT});
            const response = await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, data);
            if (!response?.success) {
                dispatch(setAlert({message: 'Unable to update cart', context: SAVE_CART}));
                dispatch({type: SAVE_CART, status: FETCH_FAILURE});
                return;
            }
            dispatch({
                type: SAVE_CART,
                status: FETCH_SUCCESS,
                message: `Added to cart: ${ItemCode} (qty: ${QuantityOrdered})`
            });
            if (SalesOrderNo === _salesOrderNo) {
                dispatch(loadSalesOrder(SalesOrderNo));
            } else {
                dispatch(loadCurrentCart());
            }
        } catch (err) {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        }
    };

export const appendCommentLine = (commentText) => ({type: APPEND_ORDER_COMMENT, commentText});

/**
 *
 * @param {string} SalesOrderNo
 * @param {string} LineKey
 * @param {string} CommentText
 * @return {(function(*, *): Promise<void>)|*}
 */
export const addCommentLine = ({SalesOrderNo, LineKey = '', CommentText = ''}) =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const customer = selectCurrentCustomer(state);
            if (!SalesOrderNo || !customer.CustomerNo) {
                return;
            }
            const {Company, ARDivisionNo, CustomerNo, ShipToCode} = customer;
            /**
             *
             * @type {CartAppendCommentBody}
             */
            const data = {
                action: 'line-comment',
                SalesOrderNo: SalesOrderNo,
                LineKey,
                Comment: CommentText,
            };
            dispatch({type: SAVE_CART});
            await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, data);
            dispatch(loadSalesOrder(SalesOrderNo));
        } catch (err) {
            dispatch({type: SAVE_CART_FAILURE});
            dispatch(handleError(err));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        }
    };

export const deleteCartItem = ({SalesOrderNo, LineKey}) =>
    async (dispatch, getState) => {
        try {
            /**
             *
             * @type {CartDeleteItemBody}
             */
            const data = {
                action: 'delete-line',
                SalesOrderNo,
                LineKey,
            };
            const state = getState();
            const customer = selectCurrentCustomer(state);
            if (!customer || !customer.CustomerNo) {
                return;
            }

            dispatch({type: SAVE_CART});
            const {Company, ARDivisionNo, CustomerNo, ShipToCode} = customer;
            await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, data);
            dispatch(loadSalesOrder(SalesOrderNo));
        } catch (err) {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            dispatch(handleError(err, SAVE_CART));
            if (err.debug) {
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        }
    };

export const getItemAvailability = createAsyncThunk(
    'cart/getItemAvailability',
    /**
     *
     * @param {string} arg
     * @param getState
     * @return {Promise<ItemAvailability|null>}
     */
    async (arg, {getState}) => {
        return await fetchItemAvailability(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg && !selectItemAvailabilityLoading(state);
        }
    });

export const setCartProgress = createAction('cart/setProgress');
export const setShipDate = createAction('cart/setShipDate');
export const setShippingAccount = createAction('cart/setShippingAccount');
