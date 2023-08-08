import {Message} from "b2b-types";
import {fetchJSON} from "./fetch";

export const fetchMessages = async (): Promise<Message[]> => {
    try {
        const response = await fetchJSON<{ messages: Message[] }>('/api/messages/current');
        return response?.messages ?? [];
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchMessages()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchMessages()", err);
        return Promise.reject(new Error('Error in fetchMessages()'));
    }
}
