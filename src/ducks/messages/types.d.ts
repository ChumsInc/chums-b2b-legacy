import {Message} from "b2b-types";

export interface MessagesState {
    list: Message[],
    loading: boolean;
}
