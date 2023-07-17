import {createReducer, createSelector} from "@reduxjs/toolkit";
import {ignoreVersion, loadVersion} from "./actions";

export const minCheckInterval = 15 * 60 * 1000;

export const selectVersion = (state) => state.version.versionNo;
export const selectVersionLoading = (state) => state.version.loading;
export const selectVersionChanged = (state) => state.version.changed;
export const selectLastChecked = (state) => state.version.lastChecked;
export const selectVersionIgnored = (state) => state.version.ignored;
export const selectShouldAlertVersion = createSelector(
    [selectVersion, selectVersionChanged, selectVersionIgnored],
    (version, changed, ignored) => {
        return changed && !!version && version !== ignored;
    }
)
export const selectShouldCheckVersion = createSelector(
    [selectVersion, selectLastChecked],
    (version, lastChecked) => {
        // console.log('selectShouldCheckVersion', {version, lastChecked, now: new Date().valueOf()})
        if (!version || !lastChecked) {
            return true;
        }
        return lastChecked + minCheckInterval < new Date().valueOf();
    }
)

export const initialVersionState = (preload = windows?.__PRELOADED_STATE__ ?? {}) => ({
    versionNo: preload?.version?.versionNo ?? '',
    loading: false,
    changed: false,
    ignored: '',
    lastChecked: 0,
})

const versionReducer = createReducer(initialVersionState, (builder) => {
    builder
        .addCase(loadVersion.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadVersion.fulfilled, (state, action) => {
            state.loading = false;
            state.changed = state.versionNo !== '' && action.payload.versionNo !== state.versionNo;
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
