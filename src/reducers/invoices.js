import {combineReducers} from 'redux';
import {
    FETCH_INIT,
    FETCH_INVOICE,
    FETCH_INVOICES,
    FETCH_SUCCESS,
    SELECT_INVOICE,
    SET_CUSTOMER,
    SET_USER_ACCOUNT
} from "../constants/actions";

const list = (state = [], action) => {
    const {type, status, list, invoice} = action;
    switch (type) {
    case FETCH_INVOICES:
        if (status === FETCH_SUCCESS) {
            return [...list];
        }
        return state;
    case FETCH_INVOICE:
        if (status === FETCH_SUCCESS) {
            const [inv] = state.filter(inv => inv.InvoiceNo === invoice.InvoiceNo);
            const rest = state.filter(inv => inv.InvoiceNo !== invoice.InvoiceNo);
            return [
                {...inv, ...invoice},
                ...rest
            ];
        }
        return state;
    case SET_CUSTOMER:
    case SET_USER_ACCOUNT:
        return [];
    default:
        return state;
    }
};

const invoice = (state = {}, action) => {
    const {type, status, invoice, list} = action;
    switch (type) {
    case SELECT_INVOICE:
        return {...invoice};
    case FETCH_INVOICES:
        if (status === FETCH_SUCCESS) {
            const [inv = {}] = list.filter(inv => inv.InvoiceNo === state.InvoiceNo);
            return {...state, ...inv};
        }
        return state;
    case FETCH_INVOICE:
        if (status === FETCH_SUCCESS) {
            return {...invoice};
        }
        return {...state, loading: status === FETCH_INIT};
    case SET_CUSTOMER:
    case SET_USER_ACCOUNT:
        return {};
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_INVOICES:
    case FETCH_INVOICE:
        return status === FETCH_INIT;
    default:
        return state;
    }
};


export default combineReducers({
    list,
    invoice,
    loading,
})
