import {UserCustomerAccess} from 'b2b-types'
import {fetchGET, fetchPOST} from "../utils/fetch";
import {API_PATH_LOGIN_LOCAL, API_PATH_PROFILE, API_PATH_REP_LIST} from "../constants/paths";
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

/**
 *
 * @returns {Promise<UserProfileResponse>}
 */
export async function fetchUserProfile() {
    try {
        const response = await fetchGET(API_PATH_PROFILE) ?? {};
        response.reps = await fetchRepList();
        return response;
    } catch(err) {
        if (err instanceof Error) {
            console.debug("fetchUserProfile()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchUserProfile()", err);
        return Promise.reject(new Error('Error in fetchUserProfile()'));
    }
}

/**
 *
 * @returns {Promise<Salesperson[]>}
 */
export async function fetchRepList() {
    try {
        const response =  await fetchGET(API_PATH_REP_LIST);
        return (response.list ?? []).filter(rep => !!rep.active);
    } catch(err) {
        if (err instanceof Error) {
            console.debug("fetchRepList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchRepList()", err);
        return Promise.reject(new Error('Error in fetchRepList()'));
    }
}
