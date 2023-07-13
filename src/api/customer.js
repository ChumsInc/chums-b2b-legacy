import {fetchGET} from "../utils/fetch";
import {fetchCustomerValidation} from "./user";

/**
 *
 * @param {string} Company
 * @param {string} ARDivisionNo
 * @param {string} CustomerNo
 * @returns {Promise<FetchCustomerResponse>}
 */
export async function fetchCustomerAccount({Company, ARDivisionNo, CustomerNo}){
    try {
        const url = `/api/sales/b2b/account/${encodeURIComponent(Company)}/${encodeURIComponent(ARDivisionNo)}-${encodeURIComponent(CustomerNo)}`
        const response = await fetchGET(url, {cache: 'no-cache'});
        if (!response.result || !response.result.customer || !response.result.customer.CustomerNo) {
            return Promise.reject(new Error('Invalid response when loading customer account'));
        }
        response.result.permissions = await fetchCustomerValidation({ARDivisionNo, CustomerNo});
        return response.result
    } catch(err) {
        if (err instanceof Error) {
            console.debug("fetchCustomerAccount()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCustomerAccount()", err);
        return Promise.reject(new Error('Error in fetchCustomerAccount()'));
    }
}
