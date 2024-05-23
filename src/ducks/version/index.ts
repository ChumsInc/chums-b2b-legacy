import {createReducer, createSelector} from "@reduxjs/toolkit";
import {ignoreVersion, loadVersion} from "./actions";
import {RootState} from "../../app/configureStore";
import {PreloadedState} from "../../types/preload";

export interface VersionState {
    versionNo: string|null,
    loading: boolean,
    changed: boolean,
    ignored: string|null,
    lastChecked: number,
}
export interface LoadVersionResponse {
    versionNo: string|null;
    lastChecked: number;
}

export const minCheckInterval = 15 * 60 * 1000;

export const selectVersion = (state:RootState) => state.version.versionNo;
export const selectVersionLoading = (state:RootState) => state.version.loading;
export const selectVersionChanged = (state:RootState) => state.version.changed;
export const selectLastChecked = (state:RootState) => state.version.lastChecked;
export const selectVersionIgnored = (state:RootState) => state.version.ignored;

export const selectShouldAlertVersion = createSelector(
    [selectVersion, selectVersionChanged, selectVersionIgnored],
    (version, changed, ignored) => {
        return changed && !!version && version !== ignored;
    }
)
export const selectShouldCheckVersion = createSelector(
    [selectVersion, selectLastChecked],
    (version, lastChecked) => {
        if (!version || !lastChecked) {
            return true;
        }
        return lastChecked + minCheckInterval < new Date().valueOf();
    }
)

export const initialVersionState = (preload:PreloadedState = {}):VersionState => ({
    versionNo: preload?.version?.versionNo ?? null,
    loading: false,
    changed: false,
    ignored: null,
    lastChecked: 0,
})

const versionReducer = createReducer(initialVersionState, (builder) => {
    builder
        .addCase(loadVersion.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadVersion.fulfilled, (state, action) => {
            state.loading = false;
            state.changed = !!state.versionNo && action.payload.versionNo !== state.versionNo;
            state.versionNo = action.payload.versionNo;
            state.lastChecked = action.payload.lastChecked;
        })
        .addCase(loadVersion.rejected, (state) => {
            state.loading = false;
        })
        .addCase(ignoreVersion, (state) => {
            state.ignored = state.versionNo;
        })
})

export default versionReducer;
