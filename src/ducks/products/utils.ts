import {
    CartItem,
    CartProduct,
    CategoryChildCategory,
    CategoryChildLink,
    CategoryChildProduct,
    CategoryChildSection,
    CustomerPriceRecord,
    Product,
    ProductCategoryChild,
    SellAsColorsProduct,
    SellAsMixProduct,
    SellAsSelfProduct,
    SellAsVariantsProduct
} from "b2b-types";
import {EmptyObject} from "../../types/generic";
import {priceRecord} from "../../utils/customer";
import {getItemPrice} from "../../utils/products";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_SELF, SELL_AS_VARIANTS} from "../../constants/product";
import {PRICE_FIELDS} from "../../constants/actions";

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


export function isCategoryChildSection(child: ProductCategoryChild): child is CategoryChildSection {
    return (child as CategoryChildSection).itemType === 'section';
}

export function isCategoryChildCategory(child: ProductCategoryChild): child is CategoryChildCategory {
    return (child as CategoryChildCategory).itemType === 'category';
}

export function isCategoryChildProduct(child: ProductCategoryChild): child is CategoryChildProduct {
    return (child as CategoryChildProduct).itemType === 'product';
}

export function isCategoryChildLink(child: ProductCategoryChild): child is CategoryChildLink {
    return (child as CategoryChildLink).itemType === 'link';
}

export function isSellAsSelf(product: Product|null): product is SellAsSelfProduct {
    return !!product && (product as SellAsSelfProduct).sellAs === SELL_AS_SELF;
}

export function isSellAsVariants(product: Product|null): product is SellAsVariantsProduct {
    return !!product && (product as SellAsVariantsProduct).sellAs === SELL_AS_VARIANTS;
}

export function isSellAsMix(product: Product|null): product is SellAsMixProduct {
    return !!product && (product as SellAsMixProduct).sellAs === SELL_AS_MIX;
}

export function isSellAsColors(product: Product|null): product is SellAsColorsProduct {
    return !!product && (product as SellAsColorsProduct).sellAs === SELL_AS_COLORS;
}

