import {createReducer} from "@reduxjs/toolkit";
import {FETCH_INIT, FETCH_KEYWORDS, FETCH_PAGE, FETCH_SUCCESS} from "../../constants/actions";
import {ContentPage, Keyword} from "b2b-types";
import {EmptyObject} from "../../_types";
import {keywordsSorter, pageKeywordsFilter} from "../keywords/utils";
import {RootState} from "../../app/configureStore";
import {loadPage} from "./actions";

export interface PageState {
    list: Keyword[],
    loading: boolean;
    content: ContentPage | null;
}

export const initialPageState = (preload = window?.__PRELOADED_STATE__ ?? {}): PageState => ({
    list: preload?.keywords?.list?.filter(pageKeywordsFilter)?.sort(keywordsSorter) ?? [],
    loading: false,
    content: preload?.page?.content ?? null,
})

export const selectPageKeywords = (state:RootState) => state.page.list;
export const selectPageLoading = (state:RootState) => state.page.loading;
export const selectPageContent = (state:RootState) => state.page.content;

const pageReducer = createReducer(initialPageState, (builder) => {
    builder
        .addCase(loadPage.pending, (state)=> {
            state.loading = true;
        })
        .addCase(loadPage.fulfilled, (state, action) => {
            state.loading = false;
            state.content = action.payload;
        })
        .addCase(loadPage.rejected, (state) => {
            state.loading = false;
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_KEYWORDS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.list = action.list?.filter(pageKeywordsFilter).sort(keywordsSorter);
                    }
                    return;
                case FETCH_PAGE:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.content = action.page ?? null;
                    }
                    return;
            }
        });
});

export default pageReducer;
