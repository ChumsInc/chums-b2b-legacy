import {fetchJSON} from "./fetch";


export async function fetchVersion(): Promise<string|null> {
    try {
        const response = await fetchJSON<{ version?: { versionNo?: string } }>('/version', {cache: 'no-cache'});
        return response?.version?.versionNo ?? null;
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchVersion()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVersion()", err);
        return Promise.reject(new Error('Error in fetchVersion()'));
    }
}
