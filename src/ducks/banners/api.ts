import {Banner} from "b2b-types";
import {fetchJSON} from "../../api/fetch";

export async function fetchBanners():Promise<Banner[]> {
    try {
        const res = await fetchJSON<{banners: Banner[]}>('/api/features/banners/active');
        return res.banners ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchBanners()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchBanners()", err);
        return Promise.reject(new Error('Error in fetchBanners()'));
    }
}
