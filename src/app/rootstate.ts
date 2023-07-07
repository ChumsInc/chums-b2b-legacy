import store from './configureStore'
import {TypedUseSelectorHook} from "react-redux";
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export type AppSelector = TypedUseSelectorHook<RootState>;

