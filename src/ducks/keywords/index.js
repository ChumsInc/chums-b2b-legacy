import {createReducer} from "@reduxjs/toolkit";
import {FETCH_INIT, FETCH_KEYWORDS, FETCH_SUCCESS} from "../../constants/actions";

export const initialKeywordsState = {
    list: window?.__PRELOADED_STATE__?.keywords ?? [],
    loading: false,
}

const keywordsReducer = createReducer(initialKeywordsState, (builder) => {
    builder
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_KEYWORDS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.keywords = action.list;
                    }
                    return;
            }
        })
});

export default keywordsReducer;
