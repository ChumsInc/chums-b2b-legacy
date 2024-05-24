import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchKeywords} from '../../api/keywords'
import {RootState} from "../../app/configureStore";
import {selectKeywordsLoading} from "./selectors";


export const loadKeywords = createAsyncThunk(
    'keywords/load',
    async () => {
        return await fetchKeywords()
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectKeywordsLoading(state);
        }
    }
)
