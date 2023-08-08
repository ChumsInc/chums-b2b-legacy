import {fetchPOST} from "../utils/fetch";

export interface PostErrorsArg {
    message: string;
    componentStack?: string;
    version: string;
    userId?: number;
}

export async function postErrors({message, componentStack, version, userId}:PostErrorsArg): Promise<void> {
    try {
        const body = {
            message,
            componentStack: componentStack ?? '',
            user_id: userId ?? 0,
            version,
        };
        await fetchPOST('/api/error-reporting', body);
    } catch (err) {
        if (err instanceof Error) {
            console.debug("postErrors()", err.message);
            return Promise.reject(err);
        }
        console.debug("postErrors()", err);
        return Promise.reject(new Error('Error in postErrors()'));
    }
}
