import {createReducer} from "@reduxjs/toolkit";
import {Message} from "b2b-types";
import {PreloadedState} from "../../types/preload";
import {loadMessages} from "./actions";

export interface LoadMessagesResponse {
    list: Message[],
    loaded: number,
}

export interface MessagesState {
    list: Message[],
    loading: boolean;
    loaded: number;
}

export const initialMessagesState = (preload: PreloadedState | null = null) => ({
    list: preload?.messages?.list ?? [],
    loading: false,
    loaded: preload?.messages?.list ? new Date().valueOf() : 0,
})

export const messagesReducer = createReducer(initialMessagesState, (builder) => {
    builder
        .addCase(loadMessages.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadMessages.rejected, (state) => {
            state.loading = true;
        })
        .addCase(loadMessages.fulfilled, (state, action) => {
            state.list = action.payload.list;
            state.loaded = action.payload.loaded;
            state.loading = false;
        })
});

export default messagesReducer;
