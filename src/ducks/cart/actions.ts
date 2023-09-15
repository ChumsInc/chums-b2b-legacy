import {
    APPEND_ORDER_COMMENT,
    CREATE_NEW_CART,
    DELETE_CART,
    FETCH_CART,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SUCCESS,
    SAVE_CART,
    SAVE_CART_FAILURE,
    SET_CART,
    UPDATE_CART,
    UPDATE_CART_ITEM
} from "../../constants/actions";
import {isCartOrder} from "../../utils/orders";
import {handleError, logError} from "../app/actions";
import {fetchOpenOrders, loadSalesOrder} from "../../actions/salesOrder";
import {shipToAddressFromBillingAddress} from "../../utils/customer";
import {CREDIT_CARD_PAYMENT_TYPES} from "../../constants/account";
import localStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART} from "../../constants/stores";
import {NEW_CART} from "../../constants/orders";
import {selectCartsList} from "../carts/selectors";
import {selectCustomerAccount, selectCustomerPermissions} from "../customer/selectors";
import {selectCartLoading, selectCartNo, selectItemAvailabilityLoading, selectShippingAccount} from "./selectors";
import {fetchSalesOrder, fetchSalesOrders, postApplyPromoCode} from "../../api/sales-order";
import {fetchItemAvailability, postCartAction} from "../../api/cart";
import {
    selectSalesOrderDetail,
    selectSalesOrderHeader,
    selectSalesOrderNo,
    selectSalesOrderProcessing, selectSOLoading
} from "../salesOrder/selectors";
import {selectCurrentCustomer, selectLoggedIn} from "../user/selectors";
import {changedDetailLine, newCommentLine} from "../../utils/cart";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "../../app/configureStore";
import {isCustomer} from "../user/utils";
import {B2BError, PromoCode, SalesOrder, SalesOrderDetailLine, SalesOrderHeader} from "b2b-types";
import {isBillToCustomer} from "../../utils/typeguards";
import {
    ApplyPromoCodeBody, CartAppendBody,
    CartAppendCommentBody,
    CartDeleteItemBody,
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
import {loadOrders} from "@/ducks/open-orders/actions";

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

export const setCurrentCart = (SalesOrderNo: string, skipLoad: boolean = false) =>
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

export const saveNewCart = createAsyncThunk<SalesOrder | null, SaveNewCartProps>(
    'cart/save-new',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state);
        const promo_code = selectCurrentPromoCode(state);
        const body: NewCartBody = {
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
        localStore.setItem<string | null>(STORE_CURRENT_CART, response?.SalesOrderNo ?? null);
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

export interface AddToCartProps {
    itemCode: string;
    quantity: string|number;
}
export const addToCart = createAsyncThunk<SalesOrder|null, AddToCartProps>(
    'cart/addItem',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state)!;
        const promo_code = selectCurrentPromoCode(state);
        const header = selectSalesOrderHeader(state);
        const body:CartAppendBody = {
            action: 'append',
            SalesOrderNo: header!.SalesOrderNo,
            ItemCode: arg.itemCode,
            QuantityOrdered: arg.quantity.toString(),
            promo_code: promo_code?.promo_code ?? '',
        }
        return await postCartAction('chums', customer.ARDivisionNo, customer.CustomerNo, header!.ShipToCode, body);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.itemCode
                && +arg.quantity > 0
                && selectLoggedIn(state)
                && !!selectSalesOrderHeader(state);
        }
    }
)

export interface DuplicateSalesOrderProps {
    cartName: string;
    salesOrderNo: string;
    shipToCode?: string | null;
}

export const duplicateSalesOrder = createAsyncThunk<SalesOrder | null, DuplicateSalesOrderProps>(
    'cart/duplicateSalesOrder',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state)!;
        const promo_code = selectCurrentPromoCode(state);
        const body: DuplicateSalesOrderBody = {
            action: 'duplicate',
            CartName: arg.cartName,
            SalesOrderNo: arg.salesOrderNo,
            promo_code: promo_code?.promo_code,
        }
        return await postCartAction('chums', customer.ARDivisionNo, customer.CustomerNo, arg.shipToCode ?? null, body);
    },
)

export const saveCart = createAsyncThunk<SalesOrder | null, SalesOrderHeader>(
    'cart/save',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerAccount(state)!;
        const {ARDivisionNo, CustomerNo} = customer;
        const ShipToCode = arg.ShipToCode ?? customer.PrimaryShipToCode ?? '';
        const permissions = selectCustomerPermissions(state);
        if (!(permissions?.billTo || permissions?.shipTo.includes(ShipToCode))) {
            return Promise.reject(new Error(`Invalid permissions for ShipTo Code '${ShipToCode}'`));
        }
        const promo_code = selectCurrentPromoCode(state);
        const detail = selectSalesOrderDetail(state);
        const {
            ShipToName, ShipToAddress1, ShipToAddress2, ShipToAddress3, ShipToCity, ShipToState,
            ShipToZipCode, ShipToCountryCode, ConfirmTo
        } = arg;

        const newLines = detail
            .filter(line => line.newLine)
            .map(line => newCommentLine(line))
            .sort((a, b) => a.LineKey > b.LineKey ? 1 : -1);

        const changedLines = detail
            .filter(line => line.changed)
            .map(line => changedDetailLine(line))
            .sort((a, b) => a.LineKey > b.LineKey ? 1 : -1);

        const body: UpdateCartBody = {
            action: 'update',
            SalesOrderNo: arg.SalesOrderNo,
            CartName: arg.CustomerPONo!,
            ShipToCode: ShipToCode,
            ShipToName, ShipToAddress1, ShipToAddress2, ShipToAddress3, ShipToCity,
            ShipToState, ShipToZipCode, ShipToCountryCode,
            ConfirmTo,
            newLines,
            changedLines,
            promo_code: promo_code?.promo_code,
        }
        return await postCartAction('chums', ARDivisionNo, CustomerNo, ShipToCode, body);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            if (!selectLoggedIn(state)) {
                return false;
            }
            if (selectSalesOrderProcessing(state) !== 'idle') {
                return false;
            }
            const customer = selectCustomerAccount(state)!;
            if (!customer) {
                return false;
            }
            const ShipToCode = arg.ShipToCode ?? customer.PrimaryShipToCode ?? '';
            const permissions = selectCustomerPermissions(state);
            return permissions?.billTo || permissions?.shipTo.includes(ShipToCode);
        }

    }
)

export const promoteCart = createAsyncThunk<SalesOrder | null, SalesOrderHeader>(
    'cart/promote',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerAccount(state)!;
        const {ARDivisionNo, CustomerNo} = customer;
        const ShipToCode = arg.ShipToCode ?? customer.PrimaryShipToCode ?? '';
        const permissions = selectCustomerPermissions(state);
        const shippingAccount = selectShippingAccount(state);
        if (!(permissions?.billTo || permissions?.shipTo.includes(ShipToCode))) {
            return Promise.reject(new Error(`Invalid permissions for ShipTo Code '${ShipToCode}'`));
        }
        const promo_code = selectCurrentPromoCode(state);

        const comment: string[] = [];
        if (shippingAccount.enabled) {
            comment.push(`COL ${shippingAccount.value}`);
        } else if (arg.ARDivisionNo === '01' && CREDIT_CARD_PAYMENT_TYPES.includes(arg.PaymentType ?? '')) {
            comment.push('FREE');
        }
        if (arg.CancelReasonCode === 'hold') {
            comment.push('HOLD');
        } else {
            comment.push('SWR');
        }

        const body: PromoteCartBody = {
            action: 'promote',
            SalesOrderNo: arg.SalesOrderNo,
            CartName: arg.CustomerPONo!,
            ShipExpireDate: arg.ShipExpireDate,
            ShipVia: arg.ShipVia!,
            PaymentType: arg.PaymentType!,
            ShipToCode: arg.ShipToCode ?? customer.PrimaryShipToCode ?? '',
            promo_code: promo_code?.promo_code ?? '',
            Comment: comment.join(' '),
        }
        return await postCartAction('chums', ARDivisionNo, CustomerNo, ShipToCode, body);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state)
                && selectSalesOrderProcessing(state) === 'idle'
                && arg.OrderType === 'Q'
                && !selectCartLoading(state);
        }
    }
)

export const removeCart = createAsyncThunk<SalesOrderHeader[], SalesOrderHeader>(
    'cart/remove',
    async (arg, {dispatch}) => {
        const {Company, ARDivisionNo, CustomerNo} = arg;
        const data: DeleteCartBody = {
            action: 'delete',
            SalesOrderNo: arg.SalesOrderNo,
        };
        await postCartAction(Company, ARDivisionNo, CustomerNo, null, data);
        return await fetchSalesOrders({ARDivisionNo, CustomerNo});
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return arg.OrderType === 'Q'
                && !selectSOLoading(state)
                && selectSalesOrderProcessing(state) === 'idle';
        }
    }
)

export const _removeCart = (cart: SalesOrderHeader) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            if (!isCartOrder(cart)) {
                return;
            }
            const {Company, ARDivisionNo, CustomerNo, ShipToCode} = cart;
            const state = getState();
            const _cartNo = selectCartNo(state);
            const isCart = _cartNo === cart.SalesOrderNo;

            const data: DeleteCartBody = {
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
            const data: UpdateCartItemBody = {
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

export const appendCommentLine = (commentText: string) => ({type: APPEND_ORDER_COMMENT, commentText});

export const addCommentLine = ({SalesOrderNo, LineKey = '', CommentText = ''}: {
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
            const data: CartAppendCommentBody = {
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

export const deleteCartItem = ({SalesOrderNo, LineKey}: {
    SalesOrderNo: string;
    LineKey: string;
}) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
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

export const applyPromoCode = createAsyncThunk<SalesOrder | null, PromoCode>(
    'cart/applyPromoCode',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state);
        const cartNo = selectCartNo(state);
        const body: ApplyPromoCodeBody = {
            action: 'apply-discount',
            promo_code: arg.promo_code,
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
