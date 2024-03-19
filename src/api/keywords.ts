import {Keyword} from "b2b-types";
import {fetchJSON} from "./fetch";

export async function fetchKeywords():Promise<Keyword[]> {
    try {
        const url = '/api/keywords';
        const res = await fetchJSON<{result: Keyword[]}>(url);
        return res.result ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchKeywords()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchKeywords()", err);
        return Promise.reject(new Error('Error in fetchKeywords()'));
    }
}
