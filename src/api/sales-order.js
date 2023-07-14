import {API_PATH_SALES_ORDER} from "../constants/paths";
import {fetchGET, fetchPOST} from "../utils/fetch";

/**
 *
 * @param {string} ARDivisionNo
 * @param {string} CustomerNo
 * @param {string} SalesOrderNo
 * @return {Promise<SalesOrder|null>}
 */
export async function fetchSalesOrder({ARDivisionNo, CustomerNo, SalesOrderNo}) {
    try {
        const url = API_PATH_SALES_ORDER
                .replace(':Company', 'CHI')
                .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
                .replace(':CustomerNo', encodeURIComponent(CustomerNo))
                .replace(':SalesOrderNo', encodeURIComponent(SalesOrderNo))
            + '?images=1';
        const response = await fetchGET(url, {cache: 'no-cache'});
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

/**
 *
 * @param {string} ARDivisionNo
 * @param {string} CustomerNo
 * @param {string} SalesOrderNo
 * @return {Promise<EmailResponse|null>}
 */
export async function postOrderEmail({ARDivisionNo, CustomerNo, SalesOrderNo}) {
    try {
        const url = '/node-sage/api/CHI/salesorder/:ARDivisionNo-:CustomerNo/:SalesOrderNo/email'
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo))
            .replace(':SalesOrderNo', encodeURIComponent(SalesOrderNo));
        const {result} = await fetchPOST(url);
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
