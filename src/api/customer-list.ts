import {Customer, UserCustomerAccess} from "b2b-types";
import {API_PATH_CUSTOMER_LIST} from "../constants/paths";
import {fetchJSON} from "./fetch";

export async function fetchCustomerList(arg:UserCustomerAccess):Promise<Customer[]> {
    try {
        if (!arg.isRepAccount) {
            return [];
        }
        const url = API_PATH_CUSTOMER_LIST
            .replace(':Company', encodeURIComponent('chums'))
            .replace(':SalespersonDivisionNo', encodeURIComponent(arg.SalespersonDivisionNo))
            .replace(':SalespersonNo', encodeURIComponent(arg.SalespersonNo));
        const res = await fetchJSON<{result: Customer[]}>(url, {cache: 'no-cache'});
        return res.result ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchCustomerList()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCustomerList()", err);
        return Promise.reject(new Error('Error in fetchCustomerList()'));
    }
}
