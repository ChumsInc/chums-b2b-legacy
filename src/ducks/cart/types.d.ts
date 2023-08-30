import {CartProgress} from "@/types/cart";
import {ItemAvailability} from "@/types/product";
import {CustomerShippingAccount} from "@/types/customer";
import {CartItem} from "b2b-types";


export interface SaveNewCartProps extends CartItem {
    shipToCode: string;
    cartName: string;
}
