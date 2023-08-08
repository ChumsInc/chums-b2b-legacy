import {CartItem, CartProduct, Product} from "b2b-types";
import {EmptyObject} from "../../_types";

export const isCartItem = (item:CartItem|EmptyObject|null): item is CartItem => {
    if (!item) {
        return false;
    }
    return (item as CartItem).itemCode !== undefined;
}

export const isCartProduct = (item:CartProduct|CartItem|EmptyObject|null): item is CartProduct => {
    if (!item) {
        return false;
    }
    return isCartItem(item) && (item as CartProduct).productId !== undefined;
}

export const isProduct = (product:Product|EmptyObject|null): product is Product => {
    if (!product) {
        return false;
    }
    return (product as Product).id !== undefined;
}
