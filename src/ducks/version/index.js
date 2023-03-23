import {AnyAction, combineReducers} from "redux";
import {RootState} from '../index';
import {fetchGET} from "../../utils/fetch";
import {ThunkAction} from "redux-thunk";

// export interface ManifestFile {
//     versionNo: string,
// }
// export interface VersionAction extends AnyAction {
//     payload?: {
//         versionNo?: string,
//         lastChecked?: number,
//         error?: Error,
//         context?: string,
//     }
// }
//
// export interface VersionState {
//     versionNo: string,
//     changed: boolean,
//     lastChecked: number,
//     loading: boolean,
//     ignored: string,
// }

export const defaultState = {
    versionNo: '',
    changed: false,
    lastChecked: new Date().valueOf(),
    loading: false,
    ignored: '',
}

// export interface ScreenThunkAction  extends ThunkAction<any, RootState, unknown, VersionAction> {}

export const minCheckInterval = 15 * 60 * 1000;
export const versionFetchRequested = 'version/fetchRequested';
export const versionFetchSucceeded = 'version/fetchSucceeded';
export const versionFetchFailed = 'version/fetchFailed';
export const versionIgnored = 'version/ignored';

export const versionURL = '/version';

export const loadingSelector = (state) => state.version.loading;
export const shouldCheckVersion = (state) => !loadingSelector(state)
    && state.version.versionNo !== ''
    && (new Date().valueOf() - state.version.lastChecked > minCheckInterval);
export const changedSelector = (state) => state.version.changed && state.version.versionNo !== state.version.ignored;
export const versionSelector = (state) => state.version.versionNo;


const versionReducer = (state = {...defaultState}, action) => {
    const {type, payload} = action;
    switch (type) {
    case versionFetchRequested:
        return {
            ...state,
            loading: true
        }
    case versionFetchFailed:
        return {
            ...state,
            loading: false,
        }
    case versionFetchSucceeded:
        if (payload?.versionNo && payload?.lastChecked) {
            return {
                versionNo: payload.versionNo,
                changed: payload.versionNo !== state.versionNo && state.versionNo !== defaultState.versionNo,
                loading: false,
                lastChecked: payload.lastChecked,
                ignored: payload.versionNo,
            }
        }
        return state;
    case versionIgnored:
        return {
            ...state,
            changed: false,
            ignored: state.versionNo,
        }
    default: return state;
    }
}

export default versionReducer;
