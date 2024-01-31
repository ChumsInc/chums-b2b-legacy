import {createReducer, UnknownAction} from "@reduxjs/toolkit";
import {FETCH_INIT, FETCH_KEYWORDS, FETCH_SUCCESS} from "../../constants/actions";
import {Keyword} from "b2b-types";
import {PreloadedState} from "../../types/preload";
import {DeprecatedAsyncAction} from "../../types/actions";
import {isDeprecatedKeywordsAction} from "./utils";

export interface KeywordsState {
    list: Keyword[],
    loading: boolean;
}

/**
 *
 * @param {any} preload
 * @return {KeywordsState}
 */
export const initialKeywordsState = (preload:PreloadedState = {}):KeywordsState => ({
    list: preload?.keywords?.list ?? [],
    loading: false,
})

const keywordsReducer = createReducer(initialKeywordsState, (builder) => {
    builder
        .addDefaultCase((state, action:UnknownAction|DeprecatedAsyncAction) => {
            switch (action.type) {
                case FETCH_KEYWORDS:
                    if (isDeprecatedKeywordsAction(action)) {
                        state.loading = action.status === FETCH_INIT;
                        if (action.status === FETCH_SUCCESS) {
                            state.list = action.list;
                        }
                    }
                    return;
            }
        })
});

export default keywordsReducer;
