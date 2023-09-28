import {CartItem} from "b2b-types";


export interface SaveNewCartProps extends CartItem {
    shipToCode: string;
    cartName: string;
}
