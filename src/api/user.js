import {UserCustomerAccess} from 'b2b-types'
import {fetchGET, fetchPOST} from "../utils/fetch";
import {API_PATH_LOGIN_LOCAL} from "../constants/paths";
/**
 *
 * @param {string} ARDivisionNo
 * @param {string} CustomerNo
 * @return {Promise<UserCustomerAccess>}
 */
export async function fetchCustomerValidation({ARDivisionNo, CustomerNo}) {
    try {
        const url = `/api/user/b2b/validate/customer/chums/${encodeURIComponent(ARDivisionNo)}-${encodeURIComponent(CustomerNo)}`;
        return await fetchGET(url);
    } catch(err) {
        if (err instanceof Error) {
            console.debug("fetchCustomerValidation()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCustomerValidation()", err);
        return Promise.reject(new Error('Error in fetchCustomerValidation()'));
    }
}

/**
 *
 * @param email
 * @param password
 * @return {Promise<string>}
 */
export async function postLocalLogin({email, password}) {
    try {
         const {token, error} = await fetchPOST(API_PATH_LOGIN_LOCAL, {email, password});
         if (error) {
             return Promise.reject(new Error(error));
         }
         return token;
    } catch(err) {
        if (err instanceof Error) {
            console.debug("postLocalLogin()", err.message);
            return Promise.reject(err);
        }
        console.debug("postLocalLogin()", err);
        return Promise.reject(new Error('Error in postLocalLogin()'));
    }
}

