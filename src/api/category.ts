import {fetchJSON} from "./fetch";
import {ProductCategory} from "b2b-types";

export async function fetchCategory(keyword: string): Promise<ProductCategory | null> {
    try {
        if (!keyword) {
            return null;
        }
        const url = `/api/products/category/${encodeURIComponent(keyword)}`
        const response = await fetchJSON<{ categories: ProductCategory[] }>(url, {cache: 'no-cache'});
        return response?.categories?.[0] ?? null;
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchCategory()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCategory()", err);
        return Promise.reject(new Error('Error in fetchCategory()'));
    }
}
