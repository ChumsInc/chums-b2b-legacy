import {fetchGET} from "../../utils/fetch";
import {
    versionFetchFailed,
    versionFetchRequested,
    versionFetchSucceeded, versionIgnored, versionURL
} from "./index";

export const fetchVersion = (force = false) => async (dispatch, getState) => {
    try {
        const state = getState();
        if (!force && !shouldCheckVersion(state)) {
            return;
        }
        dispatch({type: versionFetchRequested});
        const {version} = await fetchGET(versionURL, {cache: 'no-cache'});
        const {versionNo} = version;
        dispatch({type: versionFetchSucceeded, payload: {versionNo, lastChecked: new Date().valueOf()}})
    } catch(err) {
        console.log("fetchVersion()", err.message);
        dispatch({type: versionFetchFailed, payload: {error: err}});
    }
};

export const ignoreVersion = () => ({type: versionIgnored});
