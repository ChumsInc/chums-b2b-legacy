import {CustomerKey, EmailResponse, SalesOrder, SalesOrderHeader} from 'b2b-types'
import {fetchJSON} from "./fetch";
import {ApplyPromoCodeBody} from "../types/cart";


export async function fetchSalesOrder({ARDivisionNo, CustomerNo, SalesOrderNo}: {
    ARDivisionNo: string;
    CustomerNo: string;
    SalesOrderNo: string;
}): Promise<SalesOrder | null> {
    try {
        const url = '/node-sage/api/CHI/salesorder/:ARDivisionNo-:CustomerNo/:SalesOrderNo'
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

export async function fetchOpenSalesOrders({ARDivisionNo, CustomerNo}: CustomerKey): Promise<SalesOrderHeader[]> {
    try {
        const url = '/node-sage/api/CHI/salesorder/:ARDivisionNo-:CustomerNo/open'
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo));
        const {result} = await fetchJSON<{ result: SalesOrderHeader[] }>(url);
        return result;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchOpenSalesOrders()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchOpenSalesOrders()", err);
        return Promise.reject(new Error('Error in fetchOpenSalesOrders()'));
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

export async function postApplyPromoCode(customer: CustomerKey, body: ApplyPromoCodeBody): Promise<SalesOrder | null> {
    try {
        const params = new URLSearchParams();
        params.set('co', 'chums');
        params.set('account', `${customer.ARDivisionNo}-${customer.CustomerNo}`);
        const url = `/sage/b2b/cart-quote.php?${params.toString()}`
        await fetchJSON(url, {body: JSON.stringify(body), method: 'POST'});
        const soArg = {
            ARDivisionNo: customer.ARDivisionNo,
            CustomerNo: customer.CustomerNo,
            SalesOrderNo: body.SalesOrderNo,
        }
        return await fetchSalesOrder(soArg)
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postApplyPromoCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("postApplyPromoCode()", err);
        return Promise.reject(new Error('Error in postApplyPromoCode()'));
    }
}




