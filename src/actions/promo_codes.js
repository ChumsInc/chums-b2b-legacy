import {buildPath, fetchGET, fetchPOST} from "../utils/fetch";
import {API_PATH_CART_ACTION, API_PATH_PROMO_CODE, API_PATH_VALID_PROMO_CODES, CART_ACTIONS} from "../constants/paths";
import {
    FETCH_APPLY_PROMO_CODE, FETCH_FAILURE,
    FETCH_INIT,
    FETCH_PROMO_CODE,
    FETCH_SUCCESS,
    FETCH_VALID_PROMO_CODES, SET_PROMO_CODE
} from "../constants/actions";
import {handleError, setAlert} from "./app";
import {customerFromState} from "./cart";
import {loadSalesOrder} from "./salesOrder";
import {selectCustomerAccount} from "../selectors/customer";

export const setPromoCode = (code) => ({type: SET_PROMO_CODE, code});

export const fetchValidPromoCodes = () => (dispatch, getState) => {
    try {
        const url = API_PATH_VALID_PROMO_CODES;
        dispatch({type: FETCH_VALID_PROMO_CODES, status: FETCH_INIT});
        fetchGET(url, {cache: 'no-cache'})
            .then(res => {
                const {promo_codes} = res;
                dispatch({type: FETCH_VALID_PROMO_CODES, status: FETCH_SUCCESS, list: promo_codes || []});
                const [promo_code] = promo_codes.filter(pc => pc.requirements.ItemCodes.length === 0);
                if (promo_code) {
                    dispatch({type: FETCH_PROMO_CODE, status: FETCH_SUCCESS, promo_code});
                }
            })
            .catch(err => {
                dispatch(handleError(err, FETCH_VALID_PROMO_CODES));
            });
    } catch(err) {
        console.log("()", err.message);
        return err;
    }
}


export const fetchPromoCode = (code) => (dispatch, getState) => {
    try {
        const url = buildPath(API_PATH_PROMO_CODE, {code});
        if (!code) {
            dispatch({type: FETCH_PROMO_CODE, status: FETCH_SUCCESS, promo_code: {code: '', description: ''}});
            return;
        }
        dispatch({type: FETCH_PROMO_CODE, status: FETCH_INIT});
        fetchGET(url, {cache: 'no-cache'})
            .then(res => {
                const promo_code = res.promo_codes[0] || {code: '', description: `'${code}' is not currently a valid code`};
                dispatch({type: FETCH_PROMO_CODE, status: FETCH_SUCCESS, promo_code});
                const {cart, salesOrder} = getState();
                if (!!promo_code.promo_code && salesOrder.header.UDF_PROMO_DEAL !== promo_code.promo_code) {
                    dispatch(applyPromoCode({Company: salesOrder.header.Company, SalesOrderNo: salesOrder.header.SalesOrderNo, discountCode: promo_code.promo_code}));
                }
            })
            .catch(err => {
                dispatch(handleError(err, FETCH_PROMO_CODE));
            });
    } catch(err) {
        console.log("()", err.message);
        return err;
    }
}


export const applyPromoCode = ({Company, SalesOrderNo, discountCode}) => (dispatch, getState) => {
    console.trace('applyPromoCode', SalesOrderNo);
    const data = {
        action: CART_ACTIONS.applyPromoCode,
        promo_code: discountCode,
        SalesOrderNo,
    };
    const state = getState();
    const account = selectCustomerAccount(state);
    if (!account) {
        return;
    }
    const {ARDivisionNo, CustomerNo} = account;
    const url = buildPath(API_PATH_CART_ACTION, customerFromState(state));
    dispatch({type: FETCH_APPLY_PROMO_CODE, status: FETCH_INIT});
    return fetchPOST(url, data)
        .then(res => {
            console.log('applyPromoCode data', data);
            dispatch({type: FETCH_APPLY_PROMO_CODE, status: FETCH_SUCCESS});
            dispatch(loadSalesOrder(SalesOrderNo));
        })
        .catch(err => {
            dispatch({type: FETCH_APPLY_PROMO_CODE, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_APPLY_PROMO_CODE));
        })
}
