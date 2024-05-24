import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {Menu, MenuItem} from "b2b-types";
import {PreloadedState} from "../../types/preload";
import {RootState} from "../../app/configureStore";
import {fetchMenu} from "../../api/menu";
import {selectCustomerAccessList, selectRepAccessList} from "../user/selectors";
import {defaultMenuItem} from "./utils";
import {accessListURL} from "../user/utils";

export interface MenuState {
    productMenu: Menu | null;
    items: MenuItem[];
    resourcesMenu: Menu | null;
    loading: boolean;
    loaded: boolean;
    isOpen: boolean;
}


export const sortMenuPriority = (a: MenuItem, b: MenuItem) => a.priority === b.priority
    ? (a.title === b.title ? 0 : (a.title > b.title ? 1 : -1))
    : a.priority > b.priority ? 1 : -1;


export const initialMenuState = (preload: PreloadedState | null = null): MenuState => ({
    productMenu: preload?.menu?.productMenu ?? null,
    items: (preload?.menu?.productMenu?.items ?? [])
        .filter(item => !!item.status)
        .sort(sortMenuPriority),
    resourcesMenu: preload?.menu?.resourcesMenu ?? null,
    loading: false,
    loaded: preload?.menu?.loaded ?? false,
    isOpen: false,
});

export const loadProductMenu = createAsyncThunk(
    'menus/productMenu',
    async () => {
        return fetchMenu(2);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const loadResourcesMenu = createAsyncThunk<Menu | null>(
    'menus/loadResourcesMenu',
    async () => {
        return await fetchMenu(122);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const selectProductMenu = (state: RootState): Menu | null => state.menu.productMenu;
export const selectResourcesMenu = (state:RootState) => state.menu.resourcesMenu;
export const selectMenuItems = (state: RootState) => state.menu.items ?? [];
export const selectLoading = (state: RootState) => state.menu.loading;
export const selectLoaded = (state: RootState) => state.menu.loaded;
export const selectIsDrawerOpen = (state: RootState) => state.menu.isOpen;
export const selectCustomerMenuItems = createSelector(
    [selectCustomerAccessList],
    (list) => list.map(row => ({
        ...defaultMenuItem,
        title: `${row.CustomerName} (${row.ARDivisionNo}-${row.CustomerNo})`,
        url: accessListURL(row)
    })));

export const selectRepMenuItems = createSelector(
    [selectRepAccessList],
    (list) => list.map(row => ({
        ...defaultMenuItem,
        title: `${row.SalespersonName} (${row.SalespersonDivisionNo}-${row.SalespersonNo})`,
        url: accessListURL(row)
    })));

export const toggleMenuDrawer = createAction<boolean | undefined>('menu/toggleDrawer');

const menuReducer = createReducer(initialMenuState, (builder) => {
    builder
        .addCase(toggleMenuDrawer, (state, action) => {
            state.isOpen = action.payload ?? !state.isOpen;
        })
});

export default menuReducer;
