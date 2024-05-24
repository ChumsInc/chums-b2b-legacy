import {SearchResult} from "b2b-types";
import {fetchJSON} from "./fetch";
import {sendGtagEvent} from "./gtag";

export const API_PATH_SEARCH = '/api/search/v3/:term';

export async function fetchSearchResults(arg: string): Promise<SearchResult[]> {
    try {
        sendGtagEvent('search', {search_term: arg.trim()});
        const url = API_PATH_SEARCH.replace(':term', encodeURIComponent(arg.trim()));
        const response = await fetchJSON<{ result: SearchResult[] }>(url);
        return response?.result ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchSearchResults()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSearchResults()", err);
        return Promise.reject(new Error('Error in fetchSearchResults()'));
    }
}
