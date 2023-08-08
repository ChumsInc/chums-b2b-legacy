import {fetchCustomerValidation} from "./user";
import {BillToCustomer, CustomerKey, CustomerUser, ShipToCustomer} from "b2b-types";
import {FetchCustomerResponse} from "../ducks/customer/types";
import {fetchJSON} from "./fetch";
import {
    API_PATH_ACCOUNT_USERS,
    API_PATH_SAVE_ADDRESS,
    API_PATH_SAVE_SHIPTO_ADDRESS,
    API_PATH_SET_PRIMARY_SHIPTO
} from "../constants/paths";
import {buildPath} from "../utils/path-utils";
import {sageCompanyCode} from "../utils/customer";

/**
 *
 * @param {string} Company
 * @param {string} ARDivisionNo
 * @param {string} CustomerNo
 * @returns {Promise<FetchCustomerResponse>}
 */
export async function fetchCustomerAccount({ARDivisionNo, CustomerNo}: CustomerKey): Promise<FetchCustomerResponse> {
    try {
        const url = `/api/sales/b2b/account/chums/${encodeURIComponent(ARDivisionNo)}-${encodeURIComponent(CustomerNo)}`
        const response = await fetchJSON<{ result: FetchCustomerResponse }>(url, {cache: 'no-cache'});
        if (!response.result || !response.result.customer || !response.result.customer.CustomerNo) {
            return Promise.reject(new Error('Invalid response when loading customer account'));
        }
        response.result.permissions = await fetchCustomerValidation({ARDivisionNo, CustomerNo});
        return response.result;
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchCustomerAccount()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCustomerAccount()", err);
        return Promise.reject(new Error('Error in fetchCustomerAccount()'));
    }
}

export async function postCustomerUser(arg:CustomerUser, customer:CustomerKey):Promise<CustomerUser[]> {
    try {
        const url = '/api/user/b2b/users/:Company/:ARDivisionNo-:CustomerNo/:id'
            .replace(':Company', 'chums')
            .replace(':ARDivisionNo', encodeURIComponent(customer.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(customer.CustomerNo))
            .replace(':id', !!arg.id ? encodeURIComponent(arg.id) : '');
        const method = !!arg.id ? 'PUT' : 'POST';
        const body = JSON.stringify(arg);
        const response = await fetchJSON<{users: CustomerUser[] }>(url, {method, body});
        return response.users ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postCustomerUser()", err.message);
            return Promise.reject(err);
        }
        console.debug("postCustomerUser()", err);
        return Promise.reject(new Error('Error in postCustomerUser()'));
    }
}

export async function deleteCustomerUser(arg:CustomerUser, customer:CustomerKey):Promise<CustomerUser[]> {
    try {
        const url = '/api/user/b2b/users/:Company/:ARDivisionNo-:CustomerNo/:email'
            .replace(':Company', 'chums')
            .replace(':ARDivisionNo', encodeURIComponent(customer.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(customer.CustomerNo))
            .replace(':email', encodeURIComponent(arg.email));
        const response = await fetchJSON<{users: CustomerUser[] }>(url, {method: 'delete'});
        return response.users ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("deleteCustomerUser()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteCustomerUser()", err);
        return Promise.reject(new Error('Error in deleteCustomerUser()'));
    }
}

export async function postBillingAddress(arg:BillToCustomer):Promise<void> {
    try {
        const {
            ARDivisionNo, CustomerNo, CustomerName, AddressLine1, AddressLine2, AddressLine3,
            City, State, ZipCode, CountryCode, EmailAddress, Reseller, TelephoneNo, TelephoneExt
        } = arg;
        const params = new URLSearchParams();
        params.set('co', sageCompanyCode('CHI'));
        params.set('account', `${ARDivisionNo}-${CustomerNo}`);
        const body = JSON.stringify({
            Name: CustomerName,
            AddressLine1,
            AddressLine2,
            AddressLine3,
            City,
            State,
            ZipCode,
            CountryCode,
            EmailAddress,
            Reseller,
            TelephoneNo,
            TelephoneExt
        });
        const url = `/sage/b2b/billto.php?${params.toString()}`;
        await fetchJSON(url, {method: 'POST', body});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postBillingAddress()", err.message);
            return Promise.reject(err);
        }
        console.debug("postBillingAddress()", err);
        return Promise.reject(new Error('Error in postBillingAddress()'));
    }
}

export async function postShipToAddress(arg:ShipToCustomer):Promise<void> {
    try {
        const {
            ARDivisionNo, CustomerNo, ShipToCode, ShipToName, ShipToAddress1, ShipToAddress2 = '', ShipToAddress3 = '',
            ShipToCity, ShipToState, ShipToZipCode, ShipToCountryCode, TelephoneNo, TelephoneExt = '', EmailAddress,
            ContactCode = '', Reseller = 'N',
        } = arg;
        const params = new URLSearchParams({co: 'CHI', account:`${ARDivisionNo}-${CustomerNo}-${ShipToCode}`});
        const url = `/sage/b2b/shipto.php?${params.toString()}`;
        const body = JSON.stringify({
            Name: ShipToName,
            AddressLine1: ShipToAddress1,
            AddressLine2: ShipToAddress2,
            AddressLine3: ShipToAddress3,
            City: ShipToCity,
            State: ShipToState,
            ZipCode: ShipToZipCode,
            CountryCode: ShipToCountryCode,
            EmailAddress,
            TelephoneNo,
            TelephoneExt,
            Reseller,
            ContactCode,
        });
        await fetchJSON(url, {method: 'POST', body});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postShipToAddress()", err.message);
            return Promise.reject(err);
        }
        console.debug("postShipToAddress()", err);
        return Promise.reject(new Error('Error in postShipToAddress()'));
    }
}

export async function postDefaultShipToCode(arg:string, customer:CustomerKey):Promise<void> {
    try {
        const {ARDivisionNo, CustomerNo} = customer;
        const url = '/sage/b2b/set-primary-shipto.php?co=CHI';
        const body = JSON.stringify({Company: 'chums', account:  `${ARDivisionNo}-${CustomerNo}:${arg}`});
        await fetchJSON(url, {method: 'POST', body});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postDefaultShipToCode()", err.message);
            return Promise.reject(err);
        }
        console.debug("postDefaultShipToCode()", err);
        return Promise.reject(new Error('Error in postDefaultShipToCode()'));
    }
}
