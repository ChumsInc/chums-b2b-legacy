import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {CustomerKey, EmailResponse, SalesOrder, SalesOrderHeader} from "b2b-types";
import {fetchOpenSalesOrders, fetchSalesOrder, postOrderEmail} from "../../api/sales-order";
import {RootState} from "../../app/configureStore";
import {selectActionStatus, selectOpenOrdersLoading, selectSalesOrder, selectSendEmailStatus} from "./selectors";
import {SortProps} from "../../types/generic";
import LocalStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART} from "../../constants/stores";
import {DetailLineChangeProps} from "../../types/salesorder";
import {selectCurrentCustomer, selectLoggedIn} from "../user/selectors";
import {isCartOrder} from "../../utils/orders";
import {setCurrentCart} from "../cart/actions";

export const loadOpenOrders = createAsyncThunk<SalesOrderHeader[], CustomerKey>(
    'open-orders/load',
    async (arg, {dispatch}) => {
        const currentCartNo = LocalStore.getItem<string>(STORE_CURRENT_CART, '');
        const orders = await fetchOpenSalesOrders(arg);
        if (currentCartNo) {
            const [cart] = orders.filter(so => so.OrderType === 'Q' && so.SalesOrderNo === currentCartNo);
            if (!cart) {
                LocalStore.removeItem(STORE_CURRENT_CART);
            }
        }
        return orders;
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.CustomerNo && !selectOpenOrdersLoading(state);
        }
    }
)

export const setSalesOrderSort = createAction<SortProps<SalesOrderHeader>>('open-orders/setSort');
export const setOpenOrdersFilter = createAction<string>('open-orders/setOrdersFilter');
export const setCartsFilter = createAction<string>('open-orders/setCartsFilter');

export const updateDetailLine = createAction<DetailLineChangeProps>('open-orders/detail/update');

export const loadSalesOrder = createAsyncThunk<SalesOrder | null, string>(
    'open-orders/loadSalesOrder',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state)!;
        return await fetchSalesOrder({...customer, SalesOrderNo: arg});
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const customer = selectCurrentCustomer(state);
            const actionStatus = selectActionStatus(state);
            return !!arg && !!customer && (!actionStatus[arg] || actionStatus[arg] === 'idle');
        }
    }
)


export const sendOrderEmail = createAsyncThunk<EmailResponse | null, SalesOrderHeader>(
    'open-orders/sendEmail',
    async (arg) => {
        return await postOrderEmail(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state)
                && !!arg
                && selectSendEmailStatus(state) === 'idle'
                && !!selectSalesOrder(state, arg.SalesOrderNo);
        }
    }
)
export const closeEmailResponse = createAction('open-orders/sendEmail/confirmed');
