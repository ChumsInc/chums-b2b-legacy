import {fetchGET} from "../../utils/fetch";

/**
 *
 * @param {number} id
 * @return {Promise<Menu|null>}
 */
export async function fetchMenu(id) {
    try {
        if (!id) {
            return null;
        }

        const [menu] = await fetchGET(`/api/menus/${encodeURIComponent(id)}`);
        return menu ?? null;
    } catch(err) {
        if (err instanceof Error) {
            console.debug("loadMenu()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadMenu()", err);
        return Promise.reject(new Error('Error in loadMenu()'));
    }
}
