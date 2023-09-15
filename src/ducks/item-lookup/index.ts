import {LoadStatus} from "@/types/generic";
import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchItemLookup} from "@/api/itemLookup";
import {RootState} from "@/app/configureStore";

export interface ItemSearchResult {
    ItemCode: string;
    ItemCodeDesc: string|null;
    StandardUnitPrice: string|number;
    SuggestedRetailPrice: number|string;
    SalesUnitOfMeasure: string;
    SalesUMConvFctr: number;
    filename: string|null;
}
export interface ItemLookupState {
    search: string;
    items: ItemSearchResult[];
    loadStatus: LoadStatus | 'fulfilled';
}

const initialItemLookupState:ItemLookupState = {
    search: '',
    items: [],
    loadStatus: 'idle',
}

export const selectSearchTerm = (state:RootState) => state.itemLookup.search;
export const selectSearchResults = (state:RootState) => state.itemLookup.items;
export const selectSearchStatus = (state:RootState) => state.itemLookup.loadStatus;
export const selectSearchLoading = (state:RootState) => state.itemLookup.loadStatus === 'pending';

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
                && selectSearchStatus(state) !== 'pending';
        }
    }
)

const itemLookupReducer = createReducer(initialItemLookupState, builder => {
    builder
        .addCase(loadItemLookup.pending, (state, action) => {
            state.loadStatus = 'pending';
            state.search = action.meta.arg;
        })
        .addCase(loadItemLookup.fulfilled, (state, action) => {
            state.loadStatus = 'fulfilled';
            state.items = action.payload;
        })
        .addCase(loadItemLookup.rejected, (state) => {
            state.loadStatus = 'idle';
            state.items = [];
        });
});

export default itemLookupReducer;
