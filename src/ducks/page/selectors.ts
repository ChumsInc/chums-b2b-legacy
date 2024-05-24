import {RootState} from "../../app/configureStore";

export const selectPageKeywords = (state: RootState) => state.page.list;
export const selectPageKeyword = (state: RootState) => state.page.keyword;
export const selectPageLoading = (state: RootState) => state.page.loading;
export const selectPageLoaded = (state: RootState) => state.page.loaded;
export const selectPageContent = (state: RootState) => state.page.content;
