import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchBanners} from "./api";
import {RootState} from "../../app/configureStore";
import {LoadBannersResponse} from "./index";
import {selectBannersLoading} from "./selectors";

export const loadBanners = createAsyncThunk<LoadBannersResponse, void>(
    'banners/load',
    async () => {
        const banners = await fetchBanners();
        return {
            list: banners,
            updated: new Date().valueOf()
        }
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectBannersLoading(state);
        }
    }
)
