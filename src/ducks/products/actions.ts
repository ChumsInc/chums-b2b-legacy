import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@/app/configureStore";
import {selectProductLoading} from "@/ducks/products/selectors";
import {CartProduct, Product, ProductVariant} from "b2b-types";
import {fetchProduct} from "@/api/product";
import {selectCustomerPricing} from "@/ducks/customer/selectors";
import {defaultCartItem, defaultVariant, getMSRP, getPrices, getSalesUM, hasVariants} from "@/utils/products";
import {SellAsVariantsProduct} from "b2b-types/src/products";
import {selectLoggedIn} from "@/ducks/user/selectors";

export interface LoadProductResponse {
    product: Product|null;
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

export const setColorCode = createAction<string>('product/setColorCode');
