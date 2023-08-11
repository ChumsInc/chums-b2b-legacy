import {API_PATH_OPEN_ORDERS, API_PATH_SALES_ORDER} from "@/constants/paths";
import {CustomerKey, EmailResponse, SalesOrder, SalesOrderHeader} from 'b2b-types'
import {fetchJSON} from "@/api/fetch";


export async function fetchSalesOrder({ARDivisionNo, CustomerNo, SalesOrderNo}: {
    ARDivisionNo: string;
    CustomerNo: string;
    SalesOrderNo: string;
}): Promise<SalesOrder | null> {
    try {
        const url = API_PATH_SALES_ORDER
                .replace(':Company', 'CHI')
                .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
                .replace(':CustomerNo', encodeURIComponent(CustomerNo))
                .replace(':SalesOrderNo', encodeURIComponent(SalesOrderNo))
            + '?images=1';
        const response = await fetchJSON<{ salesOrder: SalesOrder }>(url, {cache: 'no-cache'});
        return response.salesOrder ?? null;
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchSalesOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSalesOrder()", err);
        return Promise.reject(new Error('Error in fetchSalesOrder()'));
    }

}

export async function fetchSalesOrders({ARDivisionNo, CustomerNo}: CustomerKey): Promise<SalesOrderHeader[]> {
    try {
        const url = API_PATH_OPEN_ORDERS
            .replace(':Company', encodeURIComponent('CHI'))
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo));
        const {result} = await fetchJSON<{ result: SalesOrderHeader[] }>(url);
        return result;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSalesOrders()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSalesOrders()", err);
        return Promise.reject(new Error('Error in fetchSalesOrders()'));
    }
}


export async function postOrderEmail({ARDivisionNo, CustomerNo, SalesOrderNo}: {
    ARDivisionNo: string;
    CustomerNo: string;
    SalesOrderNo: string;
}): Promise<EmailResponse | null> {
    try {
        const url = '/node-sage/api/CHI/salesorder/:ARDivisionNo-:CustomerNo/:SalesOrderNo/email'
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo))
            .replace(':SalesOrderNo', encodeURIComponent(SalesOrderNo));
        const {result} = await fetchJSON<{ result: EmailResponse }>(url, {method: 'post'});
        return result ?? null;
    } catch (err) {
        if (err instanceof Error) {
            console.debug("postOrderEmail()", err.message);
            return Promise.reject(err);
        }
        console.debug("postOrderEmail()", err);
        return Promise.reject(new Error('Error in postOrderEmail()'));
    }
}

