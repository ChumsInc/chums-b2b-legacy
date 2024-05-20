import {
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    SET_CART,
} from "../constants/actions";
import {fetchGET} from "../utils/fetch";
import {API_PATH_OPEN_ORDERS} from "../constants/paths";
import {customerSlug, isValidCustomer, sageCompanyCode} from "../utils/customer";
import {handleError} from "../ducks/app/actions";
import {setAlert} from "../ducks/alerts/actions";
import {isCartOrder} from "../utils/orders";
import {setCurrentCart} from "../ducks/cart/actions";
import {NEW_CART} from "../constants/orders";
import {selectCustomerAccount} from "../ducks/customer/selectors";
import {fetchSalesOrder} from "../api/sales-order";
import {selectCartNo} from "../ducks/cart/selectors";
import {selectSalesOrderProcessing} from "../ducks/sales-order/selectors";
import {generatePath, redirect} from "react-router-dom";


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
    const processing = selectSalesOrderProcessing(state);
    const {cart, customer} = getState();

    if (processing || !customerAccount?.CustomerNo) {
        return;
    }

    const isCart = cartNo === SalesOrderNo;
    const {ARDivisionNo, CustomerNo} = customerAccount;

    try {
        console.log('loadSalesOrder', SalesOrderNo);
        dispatch({type: FETCH_SALES_ORDER, status: FETCH_INIT, isCart});
        const salesOrder = await fetchSalesOrder({ARDivisionNo, CustomerNo, SalesOrderNo});
        if (salesOrder?.OrderStatus === 'Z') {
            redirect(generatePath(`/account/:customerSlug/carts`, {customerSlug: customerSlug(customerAccount)}));
            return;
        }
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
