import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchSlides} from "./api";

/**
 *
 * @type {SlidesState}
 */
export const initialSlidesState = {
    list: window?.__PRELOADED_STATE__?.slides ?? [],
    loading: false,
    loaded: (window?.__PRELOADED_STATE__?.slides ?? []).length > 0,
}

export const selectSlides = (state) => state.slides.list ?? [];
export const selectSlidesLoading = (state) => state.slides.loading ?? false;
export const selectSlidesLoaded = (state) => state.slides.loaded ?? false;
/**
 *
 * @param {Slide} a
 * @param {Slide} b
 * @return {number}
 */
export const slideSorter = (a, b) => {
    return a.priority === b.priority
        ? a.id - b.id
        : (a.priority > b.priority ? 1 : -1);
}

export const loadSlides = createAsyncThunk(
    'slides/load',
    async () => {
        return await fetchSlides();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !selectSlidesLoading(state);
        }
    }
)

const slidesReducer = createReducer(initialSlidesState, (builder) => {
    builder
        .addCase(loadSlides.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadSlides.fulfilled, (state, action) => {
            state.loading = false;
            state.slides = [...action.payload].sort(slideSorter);
            state.loaded = true;
        })
        .addCase(loadSlides.rejected, (state) => {
            state.loading = false;
        })
})

export default slidesReducer;
