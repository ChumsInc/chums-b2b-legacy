import {combineReducers} from 'redux';
import {
    FETCH_CUSTOMER,
    FETCH_INIT,
    FETCH_PROMO_CODE, FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    FETCH_VALID_PROMO_CODES,
    SET_PROMO_CODE
} from "../constants/actions";

const code = (state = '', action) => {
    const {type, status, promo_code, code, salesOrder} = action;
    switch (type) {
    case SET_PROMO_CODE:
        return code;
    case FETCH_PROMO_CODE:
        if (status === FETCH_SUCCESS) {
            return promo_code.promo_code || '';
        }
        return state;
    case FETCH_SALES_ORDER:
        if (status === FETCH_INIT) {
            return '';
        }
        if (status === FETCH_SUCCESS) {
            return salesOrder.UDF_PROMO_DEAL || '';
        }
        return state;
    default:
        return state;
    }
}

const description = (state = '', action) => {
    const {type, status, promo_code} = action;
    switch (type) {
    case SET_PROMO_CODE:
        return '';
    case FETCH_PROMO_CODE:
        if (status === FETCH_SUCCESS) {
            return promo_code.description || '';
        }
        return state;
    default:
        return state;
    }
}


const requiredItems = (state = [], action) => {
    const {type, status, promo_code} = action;
    switch (type) {
    case SET_PROMO_CODE:
        return [];
    case FETCH_PROMO_CODE:
        if (status === FETCH_SUCCESS) {
            return promo_code.requirements?.ItemCodes ?? [];
        }
        return state;
    default:
        return state;
    }
}

const validCodes = (state = [], action) => {
    const {type, status, list, promoCodes = []} = action;
    switch (type) {
    case FETCH_VALID_PROMO_CODES:
        if (status === FETCH_SUCCESS) {
            return [...list];
        }
        return state;
    case FETCH_CUSTOMER:
        if (status === FETCH_SUCCESS) {
            return [...promoCodes];
        }
        return state;
    default:
        return state;
    }
}

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_VALID_PROMO_CODES:
    case FETCH_PROMO_CODE:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

export default combineReducers({
    code,
    description,
    requiredItems,
    validCodes,
    loading,
})
