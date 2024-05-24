import {Message} from "b2b-types";
import {CreateAsyncThunk} from '@reduxjs/toolkit'

export interface MessagesState {
    list: Message[],
    loading: boolean;
}
