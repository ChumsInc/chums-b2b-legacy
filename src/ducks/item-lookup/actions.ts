import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ItemSearchResult} from "./index";
import {fetchItemLookup} from "../../api/itemLookup";
import {RootState} from "../../app/configureStore";

export const setItemSearch = createAction<string>('itemLookup/search');

export const loadItemLookup = createAsyncThunk<ItemSearchResult[], string>(
    'itemLookup/load',
    async (arg) => {
        return await fetchItemLookup(arg);
    },
    {
        condition: (arg) => {
            return !!arg.trim()

        }
    }
)
