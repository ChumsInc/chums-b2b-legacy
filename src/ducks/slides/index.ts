import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchSlides} from "../../api/slides";
import {RootState} from "../../app/configureStore";
import {Slide} from "b2b-types";
import {PreloadedState} from "../../types/preload";

export interface SlidesState {
    list: Slide[];
    loading: boolean;
    loaded: boolean;
}


export const initialSlidesState = (preload:PreloadedState = {}):SlidesState => ({
    list: (preload?.slides?.list ?? []).sort(slideSorter),
    loading: false,
    loaded: (preload?.slides?.list ?? []).length > 0,
})

export const selectSlides = (state:RootState) => state.slides.list ?? [];
export const selectSlidesLoading = (state:RootState) => state.slides.loading ?? false;
export const selectSlidesLoaded = (state:RootState) => state.slides.loaded ?? false;

export const slideSorter = (a:Slide, b:Slide) => {
    return a.priority === b.priority
        ? a.id - b.id
        : (a.priority > b.priority ? 1 : -1);
}

export const loadSlides = createAsyncThunk<Slide[]>(
    'slides/load',
    async () => {
        return await fetchSlides();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
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
            state.list = action.payload.sort(slideSorter);
            state.loaded = true;
        })
        .addCase(loadSlides.rejected, (state) => {
            state.loading = false;
        })
})

export default slidesReducer;
