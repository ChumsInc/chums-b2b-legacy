import {Product} from "b2b-types";
import {API_PATH_PRODUCT} from "../constants/paths";
import {fetchJSON} from "./fetch";

export async function fetchProduct(arg:string):Promise<Product|null> {
    try {
        const url = API_PATH_PRODUCT
            .replace(':keyword', encodeURIComponent(arg));
        const res = await fetchJSON<{products: Product[]}>(url, {cache: 'no-cache'});
        const [product] = (res.products ?? []);
        return product ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchProduct()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchProduct()", err);
        return Promise.reject(new Error('Error in fetchProduct()'));
    }
}

