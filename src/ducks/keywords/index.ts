import {createReducer} from "@reduxjs/toolkit";
import {FETCH_INIT, FETCH_KEYWORDS, FETCH_SUCCESS} from "../../constants/actions";
import {Keyword} from "b2b-types";
import {PreloadedState} from "../../_types";

export interface KeywordsState {
    list: Keyword[],
    loading: boolean;
}

/**
 *
 * @param {any} preload
 * @return {KeywordsState}
 */
export const initialKeywordsState = (preload:PreloadedState = window?.__PRELOADED_STATE__ ?? {}):KeywordsState => ({
    list: preload?.keywords?.list ?? [],
    loading: false,
})

const keywordsReducer = createReducer(initialKeywordsState, (builder) => {
    builder
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_KEYWORDS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.list = action.list;
                    }
                    return;
            }
        })
});

export default keywordsReducer;
