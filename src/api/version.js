import {fetchGET} from "../utils/fetch";


/**
 *
 * @return {Promise<string>}
 */
export async function fetchVersion() {
    try {
        const response = await fetchGET('/version', {cache: 'no-cache'});
        return response?.version?.versionNo ?? '';
    } catch(err) {
        if (err instanceof Error) {
            console.debug("fetchVersion()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVersion()", err);
        return Promise.reject(new Error('Error in fetchVersion()'));
    }
}
