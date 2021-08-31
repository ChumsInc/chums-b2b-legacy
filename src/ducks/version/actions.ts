import {fetchGET} from "../../utils/fetch";
import {
    ManifestFile,
    ScreenThunkAction,
    shouldCheckVersion, VersionAction,
    versionFetchFailed,
    versionFetchRequested,
    versionFetchSucceeded, versionIgnored, versionURL
} from "./index";

export const fetchVersion = (force?: boolean):ScreenThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        if (!force && !shouldCheckVersion(state)) {
            return;
        }
        dispatch({type: versionFetchRequested});
        const {version} = await fetchGET(versionURL, {cache: 'no-cache'});
        const {versionNo} = version as ManifestFile;
        dispatch({type: versionFetchSucceeded, payload: {versionNo, lastChecked: new Date().valueOf()}})
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.log("fetchVersion()", err.message);
            return dispatch({type: versionFetchFailed, payload: {error: err}});
        }
        console.error(err);
    }
};

export const ignoreVersion = ():VersionAction => ({type: versionIgnored});
