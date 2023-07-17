import {createReducer} from "@reduxjs/toolkit";



/**
 *
 * @param {MenuItem} a
 * @param {MenuItem} b
 * @returns {number}
 */
export const sortMenuPriority = (a, b) => a.priority === b.priority
    ? (a.title === b.title ? 0 : (a.title > b.title ? 1 : -1))
    : a.priority > b.priority ? 1 : -1;


/**
 *
 * @param {any} preload
 * @return {MenuState}
 */
export const initialMenuState = (preload = window?.__PRELOADED_STATE__ ?? {}) => ({
    items: (preload?.menu?.productMenu?.items ?? [])
        .filter(item => !!item.status)
        .sort(sortMenuPriority),
    loading: false,
})

export const selectMenuItems = (state) => state.menu.items ?? [];

const menuReducer = createReducer(initialMenuState, (builder) => {

});

export default menuReducer;
