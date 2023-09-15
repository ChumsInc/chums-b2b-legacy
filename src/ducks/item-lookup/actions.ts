import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ItemSearchResult} from "@/ducks/item-lookup/index";
import {fetchItemLookup} from "@/api/itemLookup";
import {RootState} from "@/app/configureStore";

export const setItemSearch = createAction<string>('itemLookup/search');

export const loadItemLookup = createAsyncThunk<ItemSearchResult[], string>(
    'itemLookup/load',
    async (arg) => {
        return await fetchItemLookup(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.trim()

        }
    }
)
