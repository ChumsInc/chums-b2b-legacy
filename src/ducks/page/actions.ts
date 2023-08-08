import {createAsyncThunk} from "@reduxjs/toolkit";
import {ContentPage} from "b2b-types";
import {fetchPage} from "../../api/page";
import {RootState} from "../../app/configureStore";
import {selectPageLoading} from "./index";

export const loadPage = createAsyncThunk<ContentPage|null, string>(
    'page/load',
    async (arg) => {
        return await fetchPage(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectPageLoading(state);
        }
    }
)
