import {ItemSearchResult} from "../ducks/item-lookup";
import {fetchJSON} from "./fetch";

export async function fetchItemLookup(arg:string):Promise<ItemSearchResult[]> {
    try {
        if (!arg || !arg.trim()) {
            return [];
        }
        const url = `/api/search/items/${encodeURIComponent(arg)}`;
        const res = await fetchJSON<{items: ItemSearchResult[]}>(url);
        return res.items ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchItemLookup()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchItemLookup()", err);
        return Promise.reject(new Error('Error in fetchItemLookup()'));
    }
}
