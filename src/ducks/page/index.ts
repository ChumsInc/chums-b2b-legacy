import {createReducer} from "@reduxjs/toolkit";
import {FETCH_INIT, FETCH_KEYWORDS, FETCH_PAGE, FETCH_SUCCESS} from "../../constants/actions";
import {ContentPage, Keyword} from "b2b-types";
import {isDeprecatedKeywordsAction, keywordsSorter, pageKeywordsFilter} from "../keywords/utils";
import {RootState} from "../../app/configureStore";
import {loadPage} from "./actions";
import {isDeprecatedPageAction} from "./utils";

export interface PageState {
    list: Keyword[],
    keyword: string | null;
    loading: boolean;
    loaded: boolean;
    content: ContentPage | null;
}

export const initialPageState = (preload = typeof window === 'undefined' ? {} : window?.__PRELOADED_STATE__ ?? {}): PageState => ({
    list: preload?.keywords?.list?.filter(pageKeywordsFilter)?.sort(keywordsSorter) ?? [],
    keyword: null,
    loading: false,
    loaded: false,
    content: preload?.page?.content ?? null,
})

export const selectPageKeywords = (state: RootState) => state.page.list;
export const selectPageKeyword = (state:RootState) => state.page.keyword;
export const selectPageLoading = (state: RootState) => state.page.loading;
export const selectPageLoaded = (state: RootState) => state.page.loaded;
export const selectPageContent = (state: RootState) => state.page.content;

const pageReducer = createReducer(initialPageState, (builder) => {
    builder
        .addCase(loadPage.pending, (state, action) => {
            state.loading = true;
            state.loaded = false;
            state.keyword = action.meta.arg;
        })
        .addCase(loadPage.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.content = action.payload;
        })
        .addCase(loadPage.rejected, (state) => {
            state.loading = false;
            state.loaded = false;
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_KEYWORDS:
                    if (isDeprecatedKeywordsAction(action)) {
                        state.loading = action.status === FETCH_INIT;
                        if (action.status === FETCH_SUCCESS) {
                            state.list = action.list?.filter(pageKeywordsFilter).sort(keywordsSorter);
                        }
                    }
                    return;
                case FETCH_PAGE:
                    if (isDeprecatedPageAction(action)) {
                        state.loading = action.status === FETCH_INIT;
                        if (action.status === FETCH_SUCCESS) {
                            state.content = action.page ?? null;
                        }
                    }
                    return;
            }
        });
});

export default pageReducer;
