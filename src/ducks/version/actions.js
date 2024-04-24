import {fetchGET} from "../../utils/fetch";
import {
    shouldCheckVersion,
    versionFetchFailed,
    versionFetchRequested,
    versionFetchSucceeded,
    versionIgnored,
    versionURL
} from "./index";

export const fetchVersion = (force) => async (dispatch, getState) => {
    try {
        const state = getState();
        if (!force && !shouldCheckVersion(state)) {
            return;
        }
        dispatch({type: versionFetchRequested});
        const {version} = await fetchGET(versionURL, {cache: 'no-cache'});
        dispatch({type: versionFetchSucceeded, payload: {version, lastChecked: new Date().valueOf()}})
    } catch (err) {
        if (err instanceof Error) {
            console.log("fetchVersion()", err.message);
            return dispatch({type: versionFetchFailed, payload: {error: err}});
        }
        console.error(err);
    }
};

export const ignoreVersion = () => ({type: versionIgnored});
