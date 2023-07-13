import {fetchGET} from "../../utils/fetch";
import {API_PATH_INVOICE} from "../../constants/paths";
import {isValidCustomer, sageCompanyCode} from "../../utils/customer";
import {FETCH_FAILURE, FETCH_INIT, FETCH_INVOICE, FETCH_SUCCESS, SELECT_INVOICE} from "../../constants/actions";
import {handleError} from "../app/actions";
import {setAlert} from "../alerts";
import {buildPath} from "../../utils/path-utils";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {STORE_INVOICES_ROWS_PER_PAGE} from "../../constants/stores";
import localStore from "../../utils/LocalStore";
import {fetchInvoices} from "../../api/invoices";
import {selectInvoicesLoading} from "./selectors";

export const setInvoicesSort = createAction('invoices/setSort');
export const setInvoicesPage = createAction('invoices/setPage');
export const setInvoicesRowsPerPage = createAction('invoices/setRowsPerPage', (rowsPerPage) => {
    localStore.setItem(STORE_INVOICES_ROWS_PER_PAGE, rowsPerPage);
    return {
        payload: rowsPerPage
    }
});

export const setCurrentInvoice = ({Company, InvoiceNo, InvoiceType}) => (dispatch, getState) => {
    const {invoices} = getState();
    const [invoice = {
        Company,
        InvoiceNo,
        InvoiceType
    }] = invoices.list.filter(inv => inv.Company === Company && inv.InvoiceNo === InvoiceNo && inv.InvoiceType === InvoiceType);
    dispatch({type: SELECT_INVOICE, invoice});
    dispatch(loadInvoice({Company, InvoiceNo, InvoiceType}));
}

export const loadInvoice = ({Company, InvoiceNo, InvoiceType}) => (dispatch, getState) => {
    if (!InvoiceNo) {
        return;
    }
    const {customer, invoices} = getState();
    if (invoices.loading) {
        return;
    }
    InvoiceType = InvoiceType || 'IN';
    // console.log('loadInvoice', {Company, InvoiceNo});
    if (!Company) {
        Company = customer.company;
    }

    const url = buildPath(API_PATH_INVOICE, {Company: sageCompanyCode(Company), InvoiceNo, InvoiceType}) + '?images=1';
    dispatch({type: FETCH_INVOICE, status: FETCH_INIT});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const invoice = res.invoice;
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

export const loadInvoices = createAsyncThunk(
    'invoices/loadInvoices',
    /**
     *
     * @param {{Company:string, ARDivisionNo: string, CustomerNo: string, ShipToCode?: string}} arg
     * @returns {Promise<InvoiceHeader[]>}
     */
    async (arg) => {
        return await fetchInvoices(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState();
            return !selectInvoicesLoading(state) && isValidCustomer(arg);
        }
    }
)
