import {FETCH_CATEGORY, FETCH_SUCCESS,} from "../../constants/actions";
import {createReducer} from "@reduxjs/toolkit";
import {loadCategory} from "./actions";
import {categoryKeywordSorter} from "./utils";

/**
 * @return {CategoryState}
 */
export const initialCategoryState = (preload = window?.__PRELOADED_STATE__ ?? {}) => ({
    list: preload?.category?.keywords?.filter(kw => kw.pagetype === 'category').sort(categoryKeywordSorter),
    category: preload?.category?.content ?? null,
    content: preload?.category?.content ?? null,
    loading: false,
})

const categoryReducer = createReducer(initialCategoryState, (builder) => {
    builder
        .addCase(loadCategory.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.category = action.payload ?? null;
            state.content = action.payload ?? null;
        })
        .addCase(loadCategory.rejected, (state) => {
            state.loading = false;
        })
})

export default categoryReducer;
