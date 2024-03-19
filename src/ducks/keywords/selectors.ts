import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";

export const selectKeywordsLoading = (state:RootState) => state.keywords.loading;
export const selectKeywordsLoaded = (state:RootState) => state.keywords.loaded;
export const selectKeywordsList = (state:RootState) => state.keywords.list;

export const selectProductKeywords = createSelector(
    [selectKeywordsList, () => 'products'],
    (list, pageType) => {
        return list.filter(kw => kw.pagetype === pageType);
    }
);

export const selectCategoryKeywords = createSelector(
    [selectKeywordsList, () => 'category'],
    (list, pageType) => {
        return list.filter(kw => kw.pagetype === pageType);
    }
);

export const selectPageKeywords = createSelector(
    [selectKeywordsList, () => 'page'],
    (list, pageType) => {
        return list.filter(kw => kw.pagetype === pageType);
    }
);

