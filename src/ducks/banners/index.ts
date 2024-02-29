import {Banner} from "b2b-types";
import {PreloadedState} from "../../types/preload";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {fetchBanners} from "./api";

export interface BannersState {
    list: Banner[];
    loading: boolean;
    loaded: boolean;
}

export const initialBannersState = (preloadedState:PreloadedState|null = null):BannersState => {
    return ({
        list: preloadedState?.banners?.list ?? [],
        loading: false,
        loaded: !!preloadedState?.banners?.list.length ?? false,
    });
}

export const selectBannersList = (state:RootState) => state.banners.list;
export const selectBannersLoaded = (state: RootState) => state.banners.loaded;
export const selectBannersLoading = (state: RootState) => state.banners.loading;

export const loadBanners = createAsyncThunk<Banner[], void>(
    'banners/load',
    async () => {
        return await fetchBanners();
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
            state.list = action.payload.sort(bannerSorter);
        })
        .addCase(loadBanners.rejected, (state) => {
            state.loading = false;
        })
});

export default bannersReducer;
