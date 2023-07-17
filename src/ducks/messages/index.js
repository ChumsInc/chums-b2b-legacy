import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchMessages} from "../../api/messages";

/**
 * @param {unknown} preload
 * @return {MessagesState}
 */
export const initialMessagesState = (preload = window?.__PRELOADED_STATE__ ?? {}) => ({
    list: preload?.messages?.list ?? [],
    loading: false,
})


export const loadMessages = createAsyncThunk(
    'messages/load',
    /**
     *
     * @return {Promise<Message[]>}
     */
    async () => {
        return await fetchMessages();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !selectMessagesLoading(state);
        }
    }
)

export const selectActiveMessages = (state) => state.messages.list;
export const selectHasMessages = (state) => state.messages.list.length > 0;
export const selectMessagesLoading = (state) => state.messages.loading;

export const messagesReducer = createReducer(initialMessagesState, (builder) => {
    builder
        .addCase(loadMessages.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadMessages.rejected, (state) => {
            state.loading = true;
        })
        .addCase(loadMessages.fulfilled, (state, action) => {
            state.list = action.payload;
            state.loading = false;
        })
});

export default messagesReducer;
