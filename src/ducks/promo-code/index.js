import {combineReducers} from 'redux';
import {
    FETCH_CUSTOMER,
    FETCH_INIT,
    FETCH_PROMO_CODE, FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    FETCH_VALID_PROMO_CODES,
    SET_PROMO_CODE
} from "../../constants/actions";
import {createReducer} from "@reduxjs/toolkit";

/**
 * @param {PreloadedState} [preload]
 * @return {PromoCodeState}
 */
export const initialPromoCodeState = (preload = window?.__PRELOADED_STATE__ ?? {}) => ({
    code: preload?.promo_code?.promo_code ?? '',
    description: preload?.promo_code?.description ?? '',
    requiredItems: preload?.promo_code?.requirements?.ItemCodes ?? [],
    validCodes: preload?.promo_codes ?? [],
    loading: false,
})

const promoCodeReducer = createReducer(initialPromoCodeState, (builder) => {
    builder
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SET_PROMO_CODE:
                    state.code = action.code ?? '';
                    state.description = action.promo_code?.description ?? '';
                    state.requiredItems = action.promo_code?.requirements?.ItemCodes ?? []
                    return;
            case FETCH_PROMO_CODE:
                state.loading = action.status === FETCH_INIT;
                if (action.status === FETCH_SUCCESS) {
                    state.code = action.promo_code?.promo_code ?? '';
                    state.description = action.promo_code?.description ?? '';
                    state.requiredItems = action.promo_code?.requirements?.ItemCodes ?? [];
                }
                return;
            case FETCH_SALES_ORDER:
                if (action.status === FETCH_INIT) {
                    state.code = '';
                } else if (action.status === FETCH_SUCCESS) {
                    state.code = action.salesOrder?.UDF_PROMO_DEAL ?? '';
                }
                return;
            case FETCH_VALID_PROMO_CODES:
                state.loading = action.status === FETCH_INIT;
                if (action.status === FETCH_SUCCESS) {
                    state.validCodes = action.list;
                    return;
                }
            }
        })
});

export default promoCodeReducer;
