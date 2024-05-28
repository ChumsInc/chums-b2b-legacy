import {ContentPage} from "b2b-types";
import {fetchJSON} from "./fetch";

export async function fetchPage(arg:string):Promise<ContentPage|null> {
    try {
        const url = `/api/pages/${encodeURIComponent(arg)}`;
        const response = await fetchJSON<{pages: ContentPage[]}>(url, {cache: 'no-cache'});
        const page = response?.pages[0] ?? null;
        return page;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchPage()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchPage()", err);
        return Promise.reject(new Error('Error in fetchPage()'));
    }
}
