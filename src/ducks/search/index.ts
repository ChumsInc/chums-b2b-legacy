import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {RootState} from "@/app/configureStore";
import {SearchResult} from "b2b-types";
import {fetchSearchResults} from "@/api/search";
import {ga_search} from "@/utils/google-analytics";

export interface SearchState {
    term: string;
    results: SearchResult[];
    loading: boolean;
    show: boolean;
}

export const initialSearchState = (): SearchState => ({
    term: '',
    results: [],
    loading: false,
    show: false,
})

export const selectSearchTerm = (state: RootState) => state.search.term;
export const selectSearchResults = (state: RootState) => state.search.results;
export const selectSearchLoading = (state: RootState) => state.search.loading;
export const selectShowSearch = (state: RootState) => state.search.show;


export const setSearchTerm = createAction<string>('search/setTerm');
export const showSearch = createAction<boolean | undefined>('search/show');

export const getSearchResults = createAsyncThunk<SearchResult[], string>(
    'search/load',
    async (arg) => {
        ga_search(arg);
        return await fetchSearchResults(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return arg.trim().length > 2 && !selectSearchLoading(state);
        }
    }
)

const searchReducer = createReducer(initialSearchState, builder => {
    builder
        .addCase(setSearchTerm, (state, action) => {
            state.term = action.payload;
        })
        .addCase(showSearch, (state, action) => {
            state.show = action.payload ?? !state.show;
        })
        .addCase(getSearchResults.pending, (state) => {
            state.loading = true;

        })
        .addCase(getSearchResults.fulfilled, (state, action) => {
            state.loading = false;
            state.results = action.payload;
            state.show = state.results.length > 0;
        })
        .addCase(getSearchResults.rejected, (state) => {
            state.loading = false;
        })
});

export default searchReducer;
