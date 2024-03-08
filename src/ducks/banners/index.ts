import {Banner} from "b2b-types";
import {PreloadedState} from "../../types/preload";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {fetchBanners} from "./api";

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

export const initialBannersState = (preloadedState:PreloadedState|null = null):BannersState => {
    return ({
        list: preloadedState?.banners?.list ?? [],
        loading: false,
        loaded: !!preloadedState?.banners?.list.length ?? false,
        updated: !!preloadedState?.banners?.list.length ? new Date().valueOf() : 0,
    });
}

export const selectBannersList = (state:RootState) => state.banners.list;
export const selectBannersLoaded = (state: RootState) => state.banners.loaded;
export const selectBannersLoading = (state: RootState) => state.banners.loading;
export const selectBannersUpdated = (state:RootState) => state.banners.updated;

export const loadBanners = createAsyncThunk<LoadBannersResponse, void>(
    'banners/load',
    async () => {
        const banners = await fetchBanners();
        return {
            list: banners,
            updated: new Date().valueOf()
        }
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectBannersLoading(state);
        }
    }
)

export const bannerSorter = (a:Banner, b:Banner) => ((a.priority ?? a.id) - (b.priority ?? b.id));

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
