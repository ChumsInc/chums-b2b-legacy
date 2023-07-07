import {createAsyncThunk} from "@reduxjs/toolkit";
import {selectCategoryLoading} from "./selectors";
import {fetchCategory} from "../../api/category";

export const loadCategory = createAsyncThunk(
    'category/load',
    async (arg) => {
        return await fetchCategory(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg && !selectCategoryLoading(state);
        }
    }
)
