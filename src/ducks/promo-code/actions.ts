import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {PromoCode} from "b2b-types";
import {fetchPromoCode, fetchPromoCodes} from "@/api/promoCodes";
import {RootState} from "@/app/configureStore";
import {selectPromoCodesLoading} from "@/ducks/promo-code/selectors";
import {setAlert} from "@/ducks/alerts";

export const loadPromoCodes = createAsyncThunk<PromoCode[]>(
    'promoCodes/load',
    async () => {
        return await fetchPromoCodes();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectPromoCodesLoading(state);
        }
    }
)

export const setPromoCode = createAction<PromoCode|null>('promoCodes/setCurrent');

export const loadPromoCode = createAsyncThunk<PromoCode|null, string>(
    'promoCodes/current/load',
    async (arg) => {
        const promoCode = await fetchPromoCode(arg);
        if (!promoCode) {
            return Promise.reject(new Error(`Sorry! '${arg}' is not a valid promo code.`));
        }
        return promoCode;
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectPromoCodesLoading(state);
        }
    }
)
