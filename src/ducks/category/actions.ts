import {createAsyncThunk} from "@reduxjs/toolkit";
import {selectCategoryLoading} from "./selectors";
import {fetchCategory} from "../../api/category";
import {ProductCategory} from "b2b-types";
import {RootState} from "../../app/configureStore";

export const loadCategory = createAsyncThunk<ProductCategory|null, string>(
    'category/load',
    async (arg) => {
        return await fetchCategory(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !selectCategoryLoading(state);
        }
    }
)
