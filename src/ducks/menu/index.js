import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchMenu} from "./api";

const initialState = {
    productMenu: {},
    resourcesMenu: {},
    loaded: false,
    loading: false,
}

export const selectMenuLoading = (state) => state.menu.loading;
export const selectProductsMenu = (state) => state.menu.productMenu;
export const selectResourcesMenu = (state) => state.menu.resourcesMenu;

const menuReducer = createReducer(initialState, builder => {
});

export default menuReducer;
