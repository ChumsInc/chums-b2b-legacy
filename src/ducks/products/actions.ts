import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {
    selectProductCartItem,
    selectProductColorCode,
    selectProductCustomerKey,
    selectProductLoading,
    selectSelectedProduct
} from "./selectors";
import {CartProduct, Product, ProductVariant, SellAsVariantsProduct} from "b2b-types";
import {fetchProduct} from "../../api/product";
import {selectCustomerAccount, selectCustomerPricing} from "../customer/selectors";
import {defaultCartItem, defaultVariant, getMSRP, getPrices, getSalesUM, hasVariants} from "../../utils/products";
import {selectLoggedIn} from "../user/selectors";
import {isSellAsColors, isSellAsMix, updateCartProductPricing} from "./utils";
import {parseImageFilename} from "../../common/image";

export interface LoadProductResponse {
    product: Product | null;
    variant: ProductVariant | null;
    msrp: string[],
    customerPrice: string[],
    salesUM: string | null;
    cartItem: CartProduct | null;
}

export const loadProduct = createAsyncThunk<LoadProductResponse | null, string>(
    'products/current/load',
    async (arg, {getState}) => {
        const product = await fetchProduct(arg);
        const state = getState() as RootState;
        const loggedIn = selectLoggedIn(state);
        const pricing = selectCustomerPricing(state);
        const variant = hasVariants(product) ? defaultVariant(product as SellAsVariantsProduct) : null;
        const msrp = getMSRP(variant?.product ?? product);
        const customerPrice = loggedIn
            ? getPrices(variant?.product ?? product, pricing)
            : [...msrp];
        const salesUM = getSalesUM(variant?.product ?? product);
        const cartItem = defaultCartItem(variant?.product ?? product, {
            colorCode: variant?.product?.defaultColor || product?.defaultColor
        });
        if (cartItem && customerPrice.length) {
            cartItem.price = customerPrice[0];
        }

        return {
            product,
            variant,
            msrp,
            customerPrice,
            salesUM,
            cartItem,
        };
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectProductLoading(state);
        }
    }
)


export const setColorCode = createAsyncThunk<CartProduct | null, string>(
    'products/setColorCode',
    (arg, {getState}) => {
        const state = getState() as RootState;
        const existingCartItem = selectProductCartItem(state);
        const selectedProduct = selectSelectedProduct(state);
        const customerKey = selectProductCustomerKey(state);
        const customerPricing = selectCustomerPricing(state);
        const account = selectCustomerAccount(state);
        if (isSellAsColors(selectedProduct)) {
            const quantity = existingCartItem?.quantity ?? 1;
            const uom = existingCartItem?.salesUM;
            let cartItem = defaultCartItem(selectedProduct, {colorCode: arg});
            if (cartItem && cartItem?.salesUM === uom) {
                cartItem.quantity = quantity;
            }
            if (customerKey) {
                cartItem = updateCartProductPricing(cartItem, customerPricing);
                if (cartItem) {
                    cartItem.priceLevel = account?.PriceLevel ?? '';
                }
            }
            if (cartItem && !cartItem.image) {
                cartItem.image = parseImageFilename(selectedProduct.image, cartItem?.colorCode ?? selectedProduct.defaultColor);
            }
            return cartItem;
        } else if (!!existingCartItem && isSellAsMix(selectedProduct)) {
            const [item] = selectedProduct.mix.items
                .filter(item => item.color?.code === arg);
            const cartItem = {...existingCartItem};
            cartItem.priceLevel = account?.PriceLevel ?? '';
            cartItem.colorName = item?.color?.name ?? item?.color?.code ?? '';
            cartItem.colorCode = item?.color?.code ?? item.color_code ?? '';
            cartItem.image = parseImageFilename(item.additionalData?.image_filename ?? selectedProduct.image, cartItem?.colorCode ?? selectedProduct.defaultColor);
            // if (item.additionalData?.image_filename) {
            //     cartItem.image = item.additionalData.image_filename;
            // }
            return cartItem;
        }
        return null;
    });


export interface SetVariantResponse {
    variant: ProductVariant | null;
    msrp: string[],
    customerPrice: string[],
    salesUM: string | null;
    cartItem: CartProduct | null;
    colorCode?: string;
}

export const setCurrentVariant = createAsyncThunk<SetVariantResponse, ProductVariant>(
    'products/setVariant',
    (arg, {getState}) => {
        const state = getState() as RootState;
        const loggedIn = selectLoggedIn(state);
        const customerKey = selectProductCustomerKey(state);
        const priceCodes = selectCustomerPricing(state);
        const customerAccount = selectCustomerAccount(state);
        const msrp = getMSRP(arg.product);
        const customerPrice = loggedIn ? getPrices(arg.product, priceCodes) : [...msrp];
        const salesUM = getSalesUM(arg.product);
        const colorCode = selectProductColorCode(state);
        let cartItem = defaultCartItem(arg.product ?? null, {colorCode});
        if (customerKey) {
            cartItem = updateCartProductPricing(cartItem, priceCodes);
            if (cartItem) {
                cartItem.priceLevel = customerAccount?.PriceLevel ?? '';
            }
        }
        // if (cartItem && !customerPrice.length) {
        //     cartItem.price = customerPrice[0];
        // }
        // if (cartItem && loggedIn) {
        //     cartItem.priceCodeRecord = priceRecord({
        //         pricing: customerPricing,
        //         priceCode: cartItem.priceCode,
        //         itemCode: cartItem.itemCode,
        //     })
        //     cartItem.priceLevel = customerAccount?.PriceLevel ?? '';
        // }
        return {
            variant: arg,
            msrp,
            customerPrice,
            salesUM,
            cartItem
        }
    })


export const setCartItemQuantity = createAction<number>('product/cartItem/setQuantity');
