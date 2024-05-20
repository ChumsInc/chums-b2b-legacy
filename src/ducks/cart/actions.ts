import {
    APPEND_ORDER_COMMENT,
    CREATE_NEW_CART,
    FETCH_FAILURE,
    SAVE_CART,
    SAVE_CART_FAILURE,
    UPDATE_CART_ITEM
} from "../../constants/actions";
import {handleError, logError} from "../app/actions";
import {loadSalesOrder} from "../../actions/salesOrder";
import {shipToAddressFromBillingAddress} from "../../utils/customer";
import {CREDIT_CARD_PAYMENT_TYPES} from "../../constants/account";
import localStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART} from "../../constants/stores";
import {NEW_CART} from "../../constants/orders";
import {
    selectCartsList,
    selectSalesOrder,
    selectSalesOrderActionStatus,
    selectSalesOrderDetail
} from "../open-orders/selectors";
import {selectCustomerAccount, selectCustomerPermissions} from "../customer/selectors";
import {selectCartLoading, selectCartNo, selectItemAvailabilityLoading, selectShippingAccount} from "./selectors";
import {fetchOpenSalesOrders, postApplyPromoCode} from "../../api/sales-order";
import {fetchItemAvailability, postCartAction} from "../../api/cart";
import {selectCurrentCustomer, selectLoggedIn} from "../user/selectors";
import {changedDetailLine, newCommentLine} from "../../utils/cart";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "../../app/configureStore";
import {isCustomer} from "../user/utils";
import {PromoCode, SalesOrder, SalesOrderDetailLine, SalesOrderHeader} from "b2b-types";
import {isBillToCustomer} from "../../utils/typeguards";
import {
    ApplyPromoCodeBody,
    CartAppendBody,
    CartAppendCommentBody,
    CartDeleteItemBody,
    DeleteCartBody,
    DuplicateSalesOrderBody,
    NewCartBody,
    PromoteCartBody,
    UpdateCartBody
} from "../../types/cart";
import {ItemAvailability} from "../../types/product";
import {SaveNewCartProps} from "./types";
import {selectCurrentPromoCode} from "../promo-code/selectors";
import {CustomerShippingAccount} from "../../types/customer";
import B2BError from "../../types/generic";

export const customerFromState = (state: RootState) => {
    if (!isCustomer(state.user.currentCustomer)) {
        return null;
    }
    const {ARDivisionNo, CustomerNo, ShipToCode = ''} = state.user.currentCustomer;
    return {ARDivisionNo, CustomerNo, ShipToCode};
};

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

export const setCurrentCart = createAsyncThunk<SalesOrderHeader | SalesOrder | null, string>(
    'cart/setCurrentCart',
    async (arg, {dispatch, getState}) => {
        const state = getState() as RootState;
        const carts = selectCartsList(state);
        const [cart] = carts.filter(so => so.SalesOrderNo === arg);
        localStore.setItem<string>(STORE_CURRENT_CART, arg);
        dispatch(loadSalesOrder(arg))
        return cart;
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const carts = selectCartsList(state);
            const [cart] = carts.filter(so => so.SalesOrderNo === arg);
            if (!cart) {
                localStore.removeItem(STORE_CURRENT_CART);
            }
            return !!cart;
        }
    }
)


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
    salesOrderNo: string;
    itemCode: string;
    quantity: string | number;
    comment?: string | null;
}

export const addToCart = createAsyncThunk<SalesOrder | null, AddToCartProps>(
    'cart/addItem',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state)!;
        const promo_code = selectCurrentPromoCode(state);
        const header = selectSalesOrder(state, arg.salesOrderNo);
        const body: CartAppendBody = {
            action: 'append',
            SalesOrderNo: header!.SalesOrderNo,
            ItemCode: arg.itemCode,
            QuantityOrdered: arg.quantity.toString(),
            promo_code: promo_code?.promo_code ?? '',
            Comment: arg.comment ?? undefined,
        }
        return await postCartAction('chums', customer.ARDivisionNo, customer.CustomerNo, header!.ShipToCode, body);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.itemCode
                && +arg.quantity > 0
                && selectLoggedIn(state)
                && !!selectSalesOrder(state, arg.salesOrderNo);
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
        const detail = selectSalesOrderDetail(state, arg.SalesOrderNo);
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
            if (selectSalesOrderActionStatus(state, arg.SalesOrderNo) !== 'idle') {
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
                && selectSalesOrderActionStatus(state, arg.SalesOrderNo) === 'idle'
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
        return await fetchOpenSalesOrders({ARDivisionNo, CustomerNo});
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return arg.OrderType === 'Q'
                && selectSalesOrderActionStatus(state, arg.SalesOrderNo) === 'idle';
        }
    }
)


export const appendCommentLine = (commentText: string) => ({type: APPEND_ORDER_COMMENT, commentText});

export interface AddCartCommentProps {
    salesOrderNo: string;
    comment: string;
}

export const addCartComment = createAsyncThunk<SalesOrder | null, AddCartCommentProps>(
    'cart/addComment',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const salesOrder = selectSalesOrder(state, arg.salesOrderNo);
        const {Company, ARDivisionNo, CustomerNo, ShipToCode} = salesOrder!;
        const data: CartAppendCommentBody = {
            SalesOrderNo: arg.salesOrderNo,
            action: 'line-comment',
            LineKey: '',
            Comment: arg.comment,
        }
        return await postCartAction(Company, ARDivisionNo, CustomerNo, ShipToCode, data);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state)
                && selectSalesOrderActionStatus(state, arg.salesOrderNo) === 'idle'
                && !!selectSalesOrder(state, arg.salesOrderNo)
                && !selectCartLoading(state);
        }
    }
)

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
                action: 'line-comment',
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
