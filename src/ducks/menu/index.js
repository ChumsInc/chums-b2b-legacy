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


export const initialMenuState = {
    items: (window?.__PRELOADED_STATE__?.app?.productMenu?.items ?? [])
        .filter(item => !!item.status)
        .sort(sortMenuPriority),
}

export const selectMenuItems = (state) => state.menu.items ?? [];

const menuReducer = createReducer(initialMenuState, (builder) => {

});

export default menuReducer;
