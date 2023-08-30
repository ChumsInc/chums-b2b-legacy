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
import {handleError, logError} from "../app/actions";
import parseDate from "date-fns/parseJSON";
import {fetchOpenOrders, loadSalesOrder} from "../../actions/salesOrder";
import {shipToAddressFromBillingAddress} from "../../utils/customer";
import {CREDIT_CARD_PAYMENT_TYPES} from "../../constants/account";
import localStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART} from "../../constants/stores";
import {NEW_CART} from "../../constants/orders";
import {selectCartsList} from "../carts/selectors";
import {selectCustomerAccount} from "../customer/selectors";
import {
    selectCartLoading,
    selectCartNo,
    selectItemAvailabilityLoading,
    selectShipDate,
    selectShippingAccount
} from "./selectors";
import {fetchSalesOrder, postApplyPromoCode} from "../../api/sales-order";
import {fetchItemAvailability, postCartAction} from "../../api/cart";
import {selectSalesOrderDetail, selectSalesOrderHeader, selectSalesOrderNo} from "../salesOrder/selectors";
import {selectCurrentCustomer, selectLoggedIn} from "../user/selectors";
import {selectPromoCode} from "../../selectors/promo_code";
import {changedDetailLine, newCommentLine} from "../../utils/cart";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {setAlert} from "../alerts";
import {AppDispatch, RootState} from "../../app/configureStore";
import {isCustomer} from "../user/utils";
import {B2BError, PromoCode, SalesOrder, SalesOrderDetailLine, SalesOrderHeader} from "b2b-types";
import {isBillToCustomer, isSalesOrderHeader} from "../../utils/typeguards";
import {
    ApplyPromoCodeBody,
    CartActionBody,
    CartAppendCommentBody,
    CartDeleteItemBody,
    CartQuoteResponse,
    DeleteCartBody,
    DuplicateSalesOrderBody,
    NewCartBody,
    PromoteCartBody,
    UpdateCartBody,
    UpdateCartItemBody
} from "@/types/cart";
import {ItemAvailability} from "@/types/product";
import {SaveNewCartProps} from "@/ducks/cart/types";
import {selectCurrentPromoCode} from "@/ducks/promo-code/selectors";
import {CustomerShippingAccount} from "@/types/customer";

export const customerFromState = (state: RootState) => {
    if (!isCustomer(state.user.currentCustomer)) {
        return null;
    }
    const {ARDivisionNo, CustomerNo, ShipToCode = ''} = state.user.currentCustomer;
    return {ARDivisionNo, CustomerNo, ShipToCode};
};

export const updateCart = (props: Partial<SalesOrderHeader>, checkoutInProcess: boolean = false) => ({type: UPDATE_CART, props, checkoutInProcess});
export const updateCartItem = ({LineKey, prop}: {
    LineKey: string;
    prop: Partial<SalesOrderDetailLine>
}) => ({type: UPDATE_CART_ITEM, LineKey, prop});


export const newCart = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const {customer} = getState();
    if (!isBillToCustomer(customer.account)) {
        return;
    }
    const {ARDivisionNo, CustomerNo, PrimaryShipToCode} = customer.account;
    const [shipToAddress] = customer.shipToAddresses.filter(st => st.ShipToCode === PrimaryShipToCode)
    || [shipToAddressFromBillingAddress(customer.account)];
    const cart = {
        SalesOrderNo: NEW_CART,
        OrderDate: new Date().toISOString(),
        OrderType: 'Q',
        OrderStatus: 'N',
        ShipExpireDate: new Date().toISOString(),
        CustomerPONo: '',
        ...shipToAddress,
        detail: []
    };
    dispatch({type: CREATE_NEW_CART, cart});
    // dispatch({type: SET_CART, cart});
};

export const setCurrentCart = (SalesOrderNo:string, skipLoad:boolean = false) =>
    (dispatch: AppDispatch, getState: () => RootState) => {
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
        if (skipLoad || SalesOrderNo === NEW_CART) {
            return;
        }
        if (!!SalesOrderNo) {
            dispatch(loadSalesOrder(SalesOrderNo));
        }
    };


export const loadCurrentCart = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        const state = getState();
        const customerAccount = selectCustomerAccount(state);
        const cartNo = selectCartNo(state);
        if (!customerAccount?.CustomerNo || !cartNo) {
            return;
        }
        const {ARDivisionNo, CustomerNo} = customerAccount;
        const salesOrder = await fetchSalesOrder({ARDivisionNo, CustomerNo, SalesOrderNo: cartNo});
        dispatch({type: FETCH_CART, status: FETCH_SUCCESS, salesOrder});
    } catch (err) {
        dispatch({type: FETCH_CART, status: FETCH_FAILURE});
        if (err instanceof Error) {
            dispatch(handleError(err, FETCH_CART));
            dispatch(logError({message: err.message}));
        }
    }
};

export const saveNewCart = createAsyncThunk<SalesOrder|null, SaveNewCartProps>(
    'cart/save',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state);
        const promo_code = selectCurrentPromoCode(state);
        const body:NewCartBody = {
            action: 'new',
            CartName: arg.cartName,
            ItemCode: arg.itemCode,
            QuantityOrdered: arg.quantity ?? 1,
            Comment: arg.comment ?? '',
            SalesOrderNo: '',
            promo_code: promo_code?.promo_code ?? '',
        };

        const {ARDivisionNo, CustomerNo} = customer!;
        const response = await postCartAction('chums', ARDivisionNo, CustomerNo, arg.shipToCode, body);
        localStore.setItem<string|null>(STORE_CURRENT_CART, response?.SalesOrderNo ?? null);
        return response;
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const customer = selectCurrentCustomer(state);
            return !!customer?.ARDivisionNo
                && !selectCartLoading(state)
                && !!arg.cartName.trim()
                && arg.quantity > 0;
        }
    }
)

export interface DuplicateSalesOrderProps {
    cartName: string;
    salesOrderNo: string;
    shipToCode?: string|null;
}
export const duplicateSalesOrder = createAsyncThunk<SalesOrder|null,DuplicateSalesOrderProps>(
    'cart/duplicateSalesOrder',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state)!;
        const promo_code = selectCurrentPromoCode(state);
        const body:DuplicateSalesOrderBody = {
            action: 'duplicate',
            CartName: arg.cartName,
            SalesOrderNo: arg.salesOrderNo,
            promo_code: promo_code?.promo_code,
        }
        return await postCartAction('chums', customer.ARDivisionNo, customer.CustomerNo, arg.shipToCode ?? null, body);
    },

)
//
// export const _saveNewCart = ({shipToCode, cartName, itemCode, quantity = 1, comment = ''}:{
//     shipToCode: string;
//     cartName: string;
//     itemCode: string;
//     quantity: number;
//     comment?: string;
// }) =>
//     async (dispatch: AppDispatch, getState: () => RootState) => {
//         try {
//             const state = getState();
//             const customer = selectCurrentCustomer(state);
//             const promo_code = selectPromoCode(state);
//
//             if (!customer?.ARDivisionNo || !customer?.CustomerNo) {
//                 return;
//             }
//
//             if (!cartName) {
//                 dispatch(setAlert({message: 'Unable to save your cart without a cart name!'}));
//                 return;
//             }
//
//             const data:NewCartBody = {
//                 action: 'new',
//                 CartName: cartName,
//                 ItemCode: itemCode,
//                 QuantityOrdered: quantity ?? 1,
//                 Comment: comment,
//                 SalesOrderNo: '',
//                 promo_code: promo_code,
//             };
//
//             const {ARDivisionNo, CustomerNo} = customer;
//
//             const {SalesOrderNo} = await postCartAction('chums', ARDivisionNo, CustomerNo, shipToCode, data);
//             localStore.setItem(STORE_CURRENT_CART, SalesOrderNo);
//             dispatch({type: SAVE_CART, status: FETCH_SUCCESS, payload: SalesOrderNo});
//             dispatch(fetchOpenOrders(customer));
//             const {carts} = getState();
//             const [cart] = carts.list.filter(so => so.SalesOrderNo === SalesOrderNo);
//             if (!cart) {
//                 return;
//             }
//             dispatch(setCurrentCart(cart.SalesOrderNo, true));
//             return {SalesOrderNo, ...customer};
//         } catch (err) {
//             dispatch({type: SAVE_CART, status: FETCH_FAILURE});
//             if (err instanceof Error) {
//                 dispatch(handleError(err, SAVE_CART));
//                 dispatch(logError({message: err.message}));
//             }
//         }
//     };
//

export const saveCart = () => async (dispatch: AppDispatch, getState: () => RootState) => {
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
            UDF_PROMO_DEAL,
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
        const body:UpdateCartBody = {
            action: 'update',
            SalesOrderNo: SalesOrderNo,
            CartName: CustomerPONo ?? '',
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
            promo_code: UDF_PROMO_DEAL ?? promo_code ?? '',
        };

        // dispatch({type: SAVE_CART, status: FETCH_INIT});
        // const {success} = await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, body);
        // if (!success) {
        //     dispatch({type: SAVE_CART, status: FETCH_FAILURE});
        //     return;
        // }
        // dispatch({type: SAVE_CART, status: FETCH_SUCCESS});
        // dispatch(loadSalesOrder(header.SalesOrderNo));
    } catch (err) {
        dispatch({type: SAVE_CART, status: FETCH_FAILURE});
        if (err instanceof B2BError) {
            dispatch(handleError(err, SAVE_CART));
            dispatch(logError({message: err.message, debug: err.debug}));
        }
    }
};

export const promoteCart = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        const state = getState();
        const header = selectSalesOrderHeader(state);
        const promoCode = selectPromoCode(state);
        const shippingAccount = selectShippingAccount(state);
        const shipDate = selectShipDate(state);


        if (!isSalesOrderHeader(header) || !isCartOrder(header)) {
            return;
        }

        const {Company, ARDivisionNo, CustomerNo, ShipToCode} = header;

        const comment = [];
        if (shippingAccount.enabled) {
            comment.push(`COL ${shippingAccount.value}`);
        } else if (header.ARDivisionNo === '01' && CREDIT_CARD_PAYMENT_TYPES.includes(header.PaymentType ?? '')) {
            comment.push('FREE');
        }
        if (header.CancelReasonCode === 'hold') {
            comment.push('HOLD');
        } else {
            comment.push('SWR');
        }

        const data:PromoteCartBody = {
            action: 'promote',
            SalesOrderNo: header.SalesOrderNo,
            CartName: header.CustomerPONo ?? '',
            ShipExpireDate: parseDate(shipDate).toISOString(),
            ShipVia: header.ShipVia ?? '',
            PaymentType: header.PaymentType ?? '',
            ShipToCode: header.ShipToCode ?? '',
            Comment: comment.join(' '),
            promo_code: header.UDF_PROMO_DEAL || promoCode || '',
        };

        dispatch({type: PROMOTE_CART, status: FETCH_INIT});

        const response = await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, data);

        // dispatch({type: PROMOTE_CART, status: FETCH_SUCCESS, salesOrder: header});
        // dispatch(loadSalesOrder(header.SalesOrderNo));
        // dispatch(fetchOpenOrders(header));
        // return response.success;
    } catch (err) {
        dispatch({type: PROMOTE_CART, status: FETCH_FAILURE});
        if (err instanceof B2BError) {
            dispatch(handleError(err, PROMOTE_CART));
            dispatch(logError({message: err.message, debug: err.debug}));
        }
    }
};

export const removeCart = (cart: SalesOrderHeader) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            if (!isCartOrder(cart)) {
                return;
            }
            const {Company, ARDivisionNo, CustomerNo, ShipToCode} = cart;
            const state = getState();
            const _cartNo = selectCartNo(state);
            const isCart = _cartNo === cart.SalesOrderNo;

            const data:DeleteCartBody = {
                action: 'delete',
                SalesOrderNo: cart.SalesOrderNo,
            };
            dispatch({type: DELETE_CART, status: FETCH_INIT});
            await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, data);
            dispatch({type: DELETE_CART, status: FETCH_SUCCESS, isCart});
            dispatch(fetchOpenOrders({ARDivisionNo, CustomerNo}));
        } catch (err) {
            dispatch({type: DELETE_CART, status: FETCH_FAILURE});
            if (err instanceof B2BError) {
                dispatch(handleError(err, DELETE_CART));
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        }

    };


export const saveCartItem = ({
                                 SalesOrderNo,
                                 LineKey,
                                 ItemCode,
                                 QuantityOrdered,
                                 CommentText = '',
                                 ItemType = '1'
                             }: {
    SalesOrderNo: string;
    LineKey?: string;
    ItemCode: string;
    QuantityOrdered: number;
    CommentText?: string;
    ItemType?: string;
}) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const customer = selectCurrentCustomer(state);
            const _salesOrderNo = selectSalesOrderNo(state);

            if (!customer?.ARDivisionNo || !customer?.CustomerNo) {
                return;
            }

            if (ItemType === '4' && ItemCode === '/C') {
                return dispatch(addCommentLine({SalesOrderNo, LineKey, CommentText}));
            }
            if (!!LineKey && QuantityOrdered === 0) {
                return dispatch(deleteCartItem({SalesOrderNo, LineKey}));
            }

            const {ARDivisionNo, CustomerNo, ShipToCode = ''} = customer;
            /**
             *
             * @type {UpdateCartItemBody}
             */
            const data:UpdateCartItemBody = {
                action: !LineKey ? 'append' : 'update-item',
                SalesOrderNo,
                LineKey,
                ItemCode,
                QuantityOrdered,
                Comment: CommentText,
            };
            // dispatch({type: SAVE_CART, status: FETCH_INIT});
            // const response = await postCartAction('chums', ARDivisionNo, CustomerNo, ShipToCode, data);
            // if (!response?.success) {
            //     dispatch(setAlert({message: 'Unable to update cart', context: SAVE_CART}));
            //     dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            //     return;
            // }
            // dispatch({
            //     type: SAVE_CART,
            //     status: FETCH_SUCCESS,
            //     message: `Added to cart: ${ItemCode} (qty: ${QuantityOrdered})`
            // });
            // if (SalesOrderNo === _salesOrderNo) {
            //     dispatch(loadSalesOrder(SalesOrderNo));
            // } else {
            //     dispatch(loadCurrentCart());
            // }
        } catch (err) {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            if (err instanceof B2BError) {
                dispatch(handleError(err, SAVE_CART));
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        }
    };

export const appendCommentLine = (commentText:string) => ({type: APPEND_ORDER_COMMENT, commentText});

export const addCommentLine = ({SalesOrderNo, LineKey = '', CommentText = ''}:{
    SalesOrderNo: string;
    LineKey?: string;
    CommentText: string;
}) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const customer = selectCurrentCustomer(state);
            if (!SalesOrderNo || !customer?.CustomerNo) {
                return;
            }
            const {ARDivisionNo, CustomerNo, ShipToCode = ''} = customer;
            const data:CartAppendCommentBody = {
                action: 'append-comment',
                SalesOrderNo: SalesOrderNo,
                LineKey,
                Comment: CommentText,
            };
            dispatch({type: SAVE_CART});
            await postCartAction('chums', ARDivisionNo, CustomerNo, ShipToCode, data);
            dispatch(loadSalesOrder(SalesOrderNo));
        } catch (err) {
            dispatch({type: SAVE_CART_FAILURE});
            if (err instanceof B2BError) {
                dispatch(handleError(err));
                dispatch(logError({message: err.message, debug: err.debug}));
            }
        }
    };

export const deleteCartItem = ({SalesOrderNo, LineKey}:{
    SalesOrderNo: string;
    LineKey: string;
}) =>
    async (dispatch:AppDispatch, getState: () => RootState) => {
        try {
            const data: CartDeleteItemBody = {
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
            const {ARDivisionNo, CustomerNo, ShipToCode = ''} = customer;
            await postCartAction('chums', ARDivisionNo, CustomerNo, ShipToCode, data);
            dispatch(loadSalesOrder(SalesOrderNo));
        } catch (err) {
            dispatch({type: SAVE_CART, status: FETCH_FAILURE});
            if (err instanceof Error) {
                dispatch(handleError(err, SAVE_CART));
                dispatch(logError({message: err.message}));
            }
        }
    };

export const getItemAvailability = createAsyncThunk<ItemAvailability | null, string>(
    'cart/getItemAvailability',
    async (arg) => {
        return await fetchItemAvailability(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !selectItemAvailabilityLoading(state);
        }
    });

export const setCartProgress = createAction('cart/setProgress');
export const setShipDate = createAction('cart/setShipDate');
export const setShippingAccount = createAction<CustomerShippingAccount>('cart/setShippingAccount');

export const applyPromoCode = createAsyncThunk<SalesOrder|null, PromoCode>(
    'cart/applyPromoCode',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state);
        const cartNo = selectCartNo(state);
        const body:ApplyPromoCodeBody = {
            action: 'apply-discount',
            promo_code:arg.promo_code,
            SalesOrderNo: cartNo,
        }
        return await postApplyPromoCode(customer!, body);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state)
                && !!selectCurrentCustomer(state)
                && !!selectCartNo(state)
                && !selectCartLoading(state);
        }
    }
)
