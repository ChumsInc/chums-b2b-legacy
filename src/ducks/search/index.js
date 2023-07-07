import {createReducer} from "@reduxjs/toolkit";
import {
    FETCH_INIT,
    FETCH_SEARCH_RESULTS,
    FETCH_SUCCESS,
    SELECT_SEARCH_RESULT,
    SET_SEARCH, SHOW_SEARCH
} from "../../constants/actions";

/**
 *
 * @type {SearchState}
 */
const initialSearchState = {
    term: '',
    results: [],
    loading: false,
    show: false,
}

export const selectSearchTerm = (state) => state.search.term;
export const selectSearchResults = (state) => state.search.results;
export const selectSearchLoading = (state) => state.search.loading;
export const selectShowSearch = (state) => state.search.show;



const searchReducer = createReducer(initialSearchState, builder =>  {
    builder
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SET_SEARCH:
                    state.term = action.term ?? '';
                    state.show = state.term !== '';
                    return;
                case FETCH_SEARCH_RESULTS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_INIT) {
                        state.show = true;
                    }
                    if (action.status === FETCH_SUCCESS) {
                        state.results = [...action.list];
                        state.show = action.list.length > 0;
                    }
                    return;
                case SELECT_SEARCH_RESULT:
                    state.show = false;
                    return;
                case SHOW_SEARCH:
                    state.show =  action.show === true;
                    return;
            }
        })
});

export default searchReducer;
