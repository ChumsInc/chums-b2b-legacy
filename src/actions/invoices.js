import {buildPath, fetchGET} from "../utils/fetch";
import {API_PATH_INVOICE, API_PATH_INVOICES} from "../constants/paths";
import {isValidCustomer, sageCompanyCode} from "../utils/customer";
import {
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_INVOICE,
    FETCH_INVOICES,
    FETCH_SUCCESS,
    SELECT_INVOICE
} from "../constants/actions";
import {handleError, setAlert} from "./app";

export const selectInvoice = ({Company, InvoiceNo, InvoiceType}) => (dispatch, getState) => {
    const {invoices} = getState();
    const [invoice = {
        Company,
        InvoiceNo,
        InvoiceType
    }] = invoices.list.filter(inv => inv.Company === Company && inv.InvoiceNo === InvoiceNo && inv.InvoiceType === InvoiceType);
    dispatch({type: SELECT_INVOICE, invoice});
    dispatch(fetchInvoice({Company, InvoiceNo, InvoiceType}));
}

export const fetchInvoice = ({Company, InvoiceNo, InvoiceType}) => (dispatch, getState) => {
    if (!InvoiceNo) {
        return;
    }
    const {customer, invoices} = getState();
    if (invoices.loading) {
        return;
    }
    InvoiceType = InvoiceType || 'IN';
    // console.log('fetchInvoice', {Company, InvoiceNo});
    if (!Company) {
        Company = customer.company;
    }

    const url = buildPath(API_PATH_INVOICE, {Company: sageCompanyCode(Company), InvoiceNo, InvoiceType}) + '?images=1';
    dispatch({type: FETCH_INVOICE, status: FETCH_INIT});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const invoice = res.result;
            if (!invoice || !invoice.InvoiceNo) {
                dispatch(setAlert({message: 'That invoice was not found!', context: FETCH_INVOICE}));
                return;
            }
            dispatch({type: FETCH_INVOICE, status: FETCH_SUCCESS, invoice});
        })
        .catch(err => {
            console.log(err.message);
            dispatch({type: FETCH_INVOICE, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_INVOICE));
        });
}

export const fetchInvoices = ({Company, ARDivisionNo, CustomerNo}) => (dispatch, getState) => {
    if (!isValidCustomer({Company, ARDivisionNo, CustomerNo})) {
        return;
    }
    const url = buildPath(API_PATH_INVOICES, {Company, ARDivisionNo, CustomerNo});
    dispatch({type: FETCH_INVOICES, status: FETCH_INIT});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const {list} = res;
            dispatch({type: FETCH_INVOICES, status: FETCH_SUCCESS, list});
        })
        .catch(err => {
            console.log('fetchInvoices()', err.message);
            dispatch(handleError(err, FETCH_INVOICES));
            dispatch({type: FETCH_INVOICES, status: FETCH_FAILURE, message: err.message});
        });
};
