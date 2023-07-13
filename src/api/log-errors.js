import {fetchPOST} from "../utils/fetch";

/**
 *
 * @param {string} message
 * @param {string} [componentStack]
 * @param {string} version
 * @param {number} [userId]
 * @returns {Promise<never>}
 */
export async function postErrors({message, componentStack, version, userId}){
    try {
        const body = {
            message,
            componentStack: componentStack ?? '',
            user_id: userId ?? 0,
            version,
        };
        await fetchPOST('/api/error-reporting', body);
    } catch(err) {
        if (err instanceof Error) {
            console.debug("postErrors()", err.message);
            return Promise.reject(err);
        }
        console.debug("postErrors()", err);
        return Promise.reject(new Error('Error in postErrors()'));
    }
}
