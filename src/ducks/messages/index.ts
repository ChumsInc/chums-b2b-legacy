import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchMessages} from "@/api/messages";
import {Message} from "b2b-types";
import {RootState} from "@/app/configureStore";
import {PreloadedState} from "@/types/preload";

export interface MessagesState {
    list: Message[],
    loading: boolean;
}

export const initialMessagesState = (preload:PreloadedState|null = null) => ({
    list: preload?.messages?.list ?? [],
    loading: false,
})


export const loadMessages = createAsyncThunk<Message[]>(
    'messages/load',
    async () => {
        return await fetchMessages();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectMessagesLoading(state);
        }
    }
)

export const selectActiveMessages = (state: RootState) => state.messages.list;
export const selectHasMessages = (state: RootState) => state.messages.list.length > 0;
export const selectMessagesLoading = (state: RootState) => state.messages.loading;

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
