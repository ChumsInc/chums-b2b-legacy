import {fetchGET, fetchPOST} from "../utils/fetch";
import {CartActionBody, CartQuoteResponse, ItemAvailability} from "../_types";


export async function postCartAction(company:string, arDivisionNo:string, customerNo:string, shipToCode:string|null, body:CartActionBody):Promise<CartQuoteResponse> {
    try {
        const params = new URLSearchParams();
        params.set('co', company);
        params.set('account', `${arDivisionNo}-${customerNo}`);
        if (shipToCode) {
            params.set('account', `${arDivisionNo}-${customerNo}:${shipToCode}`);
        }
        let url = `/sage/b2b/cart-quote.php?${params.toString()}`;
        return await fetchPOST(url, body);
    } catch (err) {
        if (err instanceof Error) {
            console.debug("postCartAction()", err.message);
            return Promise.reject(err);
        }
        console.debug("postCartAction()", err);
        return Promise.reject(new Error('Error in postCartAction()'));
    }
}

export async function fetchItemAvailability(itemCode:string):Promise<ItemAvailability|null> {
    try {
        const url = '/node-sage/api/CHI/production/item/available/:ItemCode'
            .replace(':ItemCode', encodeURIComponent(itemCode));
        const response = await fetchGET(url, {cache: 'no-cache'});
        return response?.result[0] ?? null;
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchItemAvailability()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchItemAvailability()", err);
        return Promise.reject(new Error('Error in fetchItemAvailability()'));
    }
}
