import {fetchJSON} from "./fetch";

type VersionString = string;
interface VersionNo {
    versionNo?: string;
}
interface VersionResponse {
    version?: VersionString | VersionNo,
}

const isVersionResponse = (version:VersionString|VersionNo|undefined): version is VersionNo => {
    return (version as VersionNo).versionNo !== undefined;
}

export async function fetchVersion(): Promise<string|null> {
    try {
        const response = await fetchJSON<VersionResponse>('/version', {cache: 'no-cache'});
        return (isVersionResponse(response?.version)
            ? response.version.versionNo
            : response.version) ?? null
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchVersion()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchVersion()", err);
        return Promise.reject(new Error('Error in fetchVersion()'));
    }
}
