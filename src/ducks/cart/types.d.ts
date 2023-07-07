import {CartProgress, ItemAvailability, ShippingAccountState} from "../../_types";


export interface CartState {
    cartNo: string;
    cartName: string;
    cartQuantity: number;
    cartTotal: number;
    loading: boolean;
    loaded: boolean;
    itemAvailability: ItemAvailability | null;
    cartProgress: CartProgress;
    shipDate: string;
    shippingAccount: ShippingAccountState;
    cartMessage: string;
}
