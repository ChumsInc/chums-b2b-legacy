import {RootState} from "../../app/configureStore";

export const selectActiveMessages = (state: RootState) => state.messages.list;
export const selectHasMessages = (state: RootState) => state.messages.list.length > 0;
export const selectMessagesLoading = (state: RootState) => state.messages.loading;
export const selectMessagesLoaded = (state:RootState) => state.messages.loaded;
