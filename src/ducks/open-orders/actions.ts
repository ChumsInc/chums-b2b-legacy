import {createAsyncThunk} from "@reduxjs/toolkit";
import {CustomerKey, SalesOrderHeader} from "b2b-types";
import {fetchSalesOrders} from "@/api/sales-order";
import {RootState} from "@/app/configureStore";
import {selectOpenOrdersLoading} from "@/ducks/open-orders/selectors";

export const loadOrders = createAsyncThunk<SalesOrderHeader[], CustomerKey>(
    'orders/loadOrders',
    async (arg) => {
        return await fetchSalesOrders(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.CustomerNo && !selectOpenOrdersLoading(state);
        }
    }
)
