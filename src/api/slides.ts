import {Slide} from "b2b-types";
import {fetchJSON} from "./fetch";

export async function fetchSlides(): Promise<Slide[]> {
    try {
        const res = await fetchJSON<{
            slides: Slide[]
        }>('/api/features/slides/active', {cache: 'no-cache'});
        return res.slides ?? [];
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchSlides()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSlides()", err);
        return Promise.reject(new Error('Error in fetchSlides()'));
    }
}
