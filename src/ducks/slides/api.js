import {fetchGET} from "../../utils/fetch";
import {API_PATH_HOME_SLIDES} from "../../constants/paths";

/**
 *
 * @returns {Promise<Slide[]>}
 */
export async function fetchSlides() {
    try {
        const res = await fetchGET(API_PATH_HOME_SLIDES, {cache: 'no-cache'});
        return res.slides ?? [];
    } catch(err) {
        if (err instanceof Error) {
            console.debug("fetchSlides()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchSlides()", err);
        return Promise.reject(new Error('Error in fetchSlides()'));
    }
}
