import {fetchGET} from "../utils/fetch";

/**
 *
 * @param {string} keyword
 * @return {Promise<ProductCategory|null>}
 */
export async function fetchCategory(keyword) {
    try {
        if (!keyword) {
            return null;
        }
        const url =  `/api/products/category/${encodeURIComponent(keyword)}`
        const response = await fetchGET(url, {cache: 'no-cache'});
        return response?.categories?.[0] ?? null;
    } catch(err) {
        if (err instanceof Error) {
            console.debug("fetchCategory()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchCategory()", err);
        return Promise.reject(new Error('Error in fetchCategory()'));
    }
}
