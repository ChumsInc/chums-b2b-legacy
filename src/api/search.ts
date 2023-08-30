import {SearchResult} from "b2b-types";
import {API_PATH_SEARCH} from "@/constants/paths";
import {fetchJSON} from "@/api/fetch";

export async function fetchSearchResults(arg:string):Promise<SearchResult[]> {
    try {
        const url = API_PATH_SEARCH.replace(':term', encodeURIComponent(arg.trim()));
        const response = await fetchJSON<{result: SearchResult[]}>(url);
        return response?.result ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchSearchResults()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSearchResults()", err);
        return Promise.reject(new Error('Error in fetchSearchResults()'));
    }
}
