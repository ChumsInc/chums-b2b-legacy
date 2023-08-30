import {CartProduct} from "b2b-types";

export interface ItemAvailability {
    ItemCode: string;
    ItemCodeDesc: string;
    PriceCode: string;
    SalesUnitOfMeasure: string;
    StandardUnitOfMeasure: string;
    StandardUnitPrice: number | string;
    SuggestedRetailPrice: string;
    SalesUMConvFactor: number;
    QuantityAvailable: number;
}

export type CartItemDetailProps = Pick<CartProduct, 'itemCode' | 'quantity' | 'salesUM' | 'stdUM' | 'salesUMFactor'
    | 'msrp' | 'priceLevel' | 'quantityAvailable'>

export interface CartItemColorProps {
    colorCode?: string;
    itemCode?: string;
}
