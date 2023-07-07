import {fetchGET} from "../utils/fetch";

/**
 *
 * @return {Promise<Message[]>}
 */
export const fetchMessages = async () => {
    try {
        const {messages} = await fetchGET('/api/messages/current');
        return messages ?? [];
    } catch(err) {
        if (err instanceof Error) {
            console.debug("fetchMessages()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchMessages()", err);
        return Promise.reject(new Error('Error in fetchMessages()'));
    }
}
