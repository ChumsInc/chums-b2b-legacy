import {CartItem, Keyword, Product, CartProduct} from "b2b-types";
import {EmptyObject} from "../../_types";

export interface ProductsState {
    keywords: Keyword[],
    loadingKeywords: boolean;
    product: Product | null;
    selectedProduct: Product | null;
    colorCode: string;
    variantId: number|null;
    loading: boolean;
    msrp: number[],
    customerPrice: number[],
    salesUM: string|null;
    cartItem: CartProduct|null;
}
