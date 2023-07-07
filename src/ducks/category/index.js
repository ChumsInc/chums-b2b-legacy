import {FETCH_CATEGORY, FETCH_SUCCESS,} from "../../constants/actions";
import {createReducer} from "@reduxjs/toolkit";
import {loadCategory} from "./actions";

/**
 * @type {CategoryState}
 */
const initialCategoryState = {
    category: null,
    loading: false,
}

const categoryReducer = createReducer(initialCategoryState, (builder) => {
    builder
        .addCase(loadCategory.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.category = action.payload ?? null;
        })
        .addCase(loadCategory.rejected, (state) => {
            state.loading = false;
        })
})

export default categoryReducer;
