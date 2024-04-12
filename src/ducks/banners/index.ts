import {Banner} from "b2b-types";
import {PreloadedState} from "../../types/preload";
import {createReducer} from "@reduxjs/toolkit";
import {bannerSorter} from "./utils";
import {loadBanners} from "./actions";

export interface BannersState {
    list: Banner[];
    loading: boolean;
    loaded: boolean;
    updated: number;
}

export interface LoadBannersResponse {
    list: Banner[],
    updated: number,
}

export const initialBannersState = (preloadedState: PreloadedState | null = null): BannersState => {
    return ({
        list: preloadedState?.banners?.list ?? [],
        loading: false,
        loaded: !!preloadedState?.banners?.list.length ?? false,
        updated: !!preloadedState?.banners?.list.length ? new Date().valueOf() : 0,
    });
}


const bannersReducer = createReducer(initialBannersState, (builder) => {
    builder
        .addCase(loadBanners.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadBanners.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload.list.sort(bannerSorter);
            state.updated = action.payload.updated;
        })
        .addCase(loadBanners.rejected, (state) => {
            state.loading = false;
        })
});

export default bannersReducer;
