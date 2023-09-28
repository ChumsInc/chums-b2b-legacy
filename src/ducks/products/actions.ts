import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {selectProductLoading} from "./selectors";
import {CartProduct, Product, ProductVariant, SellAsVariantsProduct} from "b2b-types";
import {fetchProduct} from "../../api/product";
import {selectCustomerPricing} from "../customer/selectors";
import {defaultCartItem, defaultVariant, getMSRP, getPrices, getSalesUM, hasVariants} from "../../utils/products";
import {selectLoggedIn} from "../user/selectors";

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
        if (!!variant?.product && cartItem?.image) {
            variant.product.image = cartItem.image;
        } else if (!!product && cartItem?.image) {
            product.image = cartItem.image;
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

export const setColorCode = createAction<string>('product/setColorCode');
export const setCartItemQuantity = createAction<number>('product/cartItem/setQuantity');
