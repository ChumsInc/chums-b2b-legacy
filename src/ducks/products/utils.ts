import {CartItem, CartProduct, CustomerPriceRecord, Product} from "b2b-types";
import {EmptyObject} from "@/types/generic";
import {priceRecord} from "@/utils/customer";
import {getItemPrice} from "@/utils/products";
import {PRICE_FIELDS} from "@/constants/actions";

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


export const updateCartProductPricing = (item:CartProduct|null, pricing: CustomerPriceRecord[]):CartProduct|null => {
    if (!item) {
        return null;
    }
    return {
        ...item,
        priceCodeRecord: priceRecord({
            pricing: pricing ?? [],
            itemCode: item.itemCode,
            priceCode: item.priceCode,
        }),
        priceLevel: '',
        price: getItemPrice({
            item,
            priceField: PRICE_FIELDS.standard,
            priceCodes: pricing ?? [],
        })
    }
}

export const updateCartProductImage = (item:CartProduct|null, product: Product, colorCode: string|null):CartProduct|null => {
    if (!item) {
        return null;
    }
    return null;
}
