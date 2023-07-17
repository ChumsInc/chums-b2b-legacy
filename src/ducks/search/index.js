import {createReducer} from "@reduxjs/toolkit";
import {
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SEARCH_RESULTS,
    FETCH_SUCCESS,
    SELECT_SEARCH_RESULT,
    SET_SEARCH, SHOW_SEARCH
} from "../../constants/actions";
import {buildPath} from "../../utils/path-utils";
import {API_PATH_SEARCH} from "../../constants/paths";
import {fetchGET} from "../../utils/fetch";
import {handleError} from "../app/actions";

/**
 *
 * @type {SearchState}
 */
export const initialSearchState = () => ({
    term: '',
    results: [],
    loading: false,
    show: false,
})

export const selectSearchTerm = (state) => state.search.term;
export const selectSearchResults = (state) => state.search.results;
export const selectSearchLoading = (state) => state.search.loading;
export const selectShowSearch = (state) => state.search.show;


export const setSearchTerm = (term) => ({type: SET_SEARCH, term});
export const showSearch = (show) => ({type: SHOW_SEARCH, show});

export const getSearchResults = (term) => (dispatch, getState) => {
    if (!term) {
        dispatch({type: FETCH_SEARCH_RESULTS, status: FETCH_SUCCESS, list: []});
        return;
    }
    try {
        const re = new RegExp(term);
    } catch (err) {
        return;
    }
    const url = buildPath(API_PATH_SEARCH, {term});
    dispatch({type: FETCH_SEARCH_RESULTS, status: FETCH_INIT})
    fetchGET(url)
        .then(res => {
            dispatch({type: FETCH_SEARCH_RESULTS, status: FETCH_SUCCESS, list: res.result || []})
        })
        .catch(err => {
            dispatch({type: FETCH_SEARCH_RESULTS, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_SEARCH_RESULTS));
        });

};

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
