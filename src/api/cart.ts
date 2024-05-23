import {fetchJSON} from "./fetch";
import {SalesOrder} from "b2b-types";
import {fetchSalesOrder} from "./sales-order";
import {CartActionBody, CartQuoteResponse} from "../types/cart";
import B2BError from "../types/generic";


export async function postCartAction(company: string, arDivisionNo: string, customerNo: string, shipToCode: string | null, body: CartActionBody): Promise<SalesOrder | null> {
    try {
        const params = new URLSearchParams();
        params.set('co', company);
        params.set('account', `${arDivisionNo}-${customerNo}`);
        if (shipToCode) {
            params.set('account', `${arDivisionNo}-${customerNo}:${shipToCode}`);
        }
        const url = `/sage/b2b/cart-quote.php?${params.toString()}`;
        const response = await fetchJSON<CartQuoteResponse>(url, {method: 'POST', body: JSON.stringify(body)});
        if (!response.success || !response.SalesOrderNo) {
            const error = new B2BError('Unable to save cart', url, response);
            return Promise.reject(error);
        }
        return await fetchSalesOrder({
            ARDivisionNo: arDivisionNo,
            CustomerNo: customerNo,
            SalesOrderNo: response.SalesOrderNo
        });
    } catch (err) {
        if (err instanceof Error) {
            console.debug("postCartAction()", err.message);
            return Promise.reject(err);
        }
        console.debug("postCartAction()", err);
        return Promise.reject(new Error('Error in postCartAction()'));
    }
}
