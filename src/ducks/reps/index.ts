import {Salesperson} from "b2b-types";
import {createReducer} from "@reduxjs/toolkit";
import {setLoggedIn} from "../user/actions";
import {userRepListSort} from "../user/utils";
import {loadRepList} from "./actions";

export interface RepsState {
    list: Salesperson[];
    loading: boolean;
    loaded: boolean;
}

export const initialRepState = (): RepsState => {
    return {
        list: [],
        loading: false,
        loaded: false,
    }
}

export const repsReducer = createReducer(initialRepState, builder => {
    builder
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload?.loggedIn) {
                state.list = [];
                state.loaded = false;
            }
        })
        .addCase(loadRepList.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadRepList.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = [...(action.payload ?? [])].sort(userRepListSort);
        })
        .addCase(loadRepList.rejected, (state) => {
            state.loading = false;
            state.loaded = true;
            state.list = [];
        })

});

export default repsReducer;
