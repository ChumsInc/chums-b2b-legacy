import { AnyAction } from "redux";
import { RootState } from '../index';
import { ThunkAction } from "redux-thunk";
export interface ManifestFile {
    versionNo: string;
}
export interface VersionAction extends AnyAction {
    payload?: {
        versionNo?: string;
        lastChecked?: number;
        error?: Error;
        context?: string;
    };
}
export interface VersionState {
    versionNo: string;
    changed: boolean;
    lastChecked: number;
    loading: boolean;
    ignored: string;
}
export declare const defaultState: {
    versionNo: string;
    changed: boolean;
    lastChecked: number;
    loading: boolean;
    ignored: string;
};
export interface ScreenThunkAction extends ThunkAction<any, RootState, unknown, VersionAction> {
}
export declare const minCheckInterval: number;
export declare const versionFetchRequested = "version/fetchRequested";
export declare const versionFetchSucceeded = "version/fetchSucceeded";
export declare const versionFetchFailed = "version/fetchFailed";
export declare const versionIgnored = "version/ignored";
export declare const versionURL = "/version";
export declare const loadingSelector: (state: RootState) => boolean;
export declare const shouldCheckVersion: (state: RootState) => boolean;
export declare const changedSelector: (state: RootState) => boolean;
export declare const versionSelector: (state: RootState) => string;
declare const versionReducer: (state: VersionState | undefined, action: VersionAction) => VersionState;
export default versionReducer;
