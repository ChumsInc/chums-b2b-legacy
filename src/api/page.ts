import {ContentPage} from "b2b-types";
import {fetchJSON} from "./fetch";
import {CachedContentPage} from "../types/ui-features";

const maxCacheTime = 1000 * 60 * 30;
const pageCache = new Map<string, CachedContentPage>();

function clearOldPageCache() {
    const now = new Date().valueOf();
    [...pageCache.keys()].forEach(key => {
        const value = pageCache.get(key);
        if (value?.lastUsed && value.lastUsed + maxCacheTime < now) {
            pageCache.delete(key);
        }
    });
}

function updatePageCacheUsage(arg:string) {
    const page = pageCache.get(arg);
    if (page) {
        pageCache.set(arg, {...page, lastUsed: new Date().valueOf()});
    }
}

export async function fetchPage(arg:string):Promise<ContentPage|null> {
    try {
        if (pageCache.has(arg)) {
            updatePageCacheUsage(arg);
            return pageCache.get(arg)!;
        }
        const url = `/api/pages/${encodeURIComponent(arg)}`;
        const response = await fetchJSON<{pages: ContentPage[]}>(url);
        const page = response?.pages[0] ?? null;
        if (page) {
            pageCache.set(arg, {...page, lastUsed: new Date().valueOf()});
        }
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
