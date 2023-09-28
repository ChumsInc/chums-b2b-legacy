import {
    Product,
    ProductSellAsColors,
    ProductSellAsMix,
    ProductSellAsSelf,
    ProductSellAsVariants,
    ProductVariant
} from "b2b-types";

export const SELL_AS_VARIANTS: ProductSellAsVariants = 0;
export const SELL_AS_SELF: ProductSellAsSelf = 1;
export const SELL_AS_MIX: ProductSellAsMix = 3;
export const SELL_AS_COLORS: ProductSellAsColors = 4;


export const defaultProduct: Product = {
    buffer: null,
    canDome: false,
    canScreenPrint: false,
    dateAvailable: "",
    defaultCategoriesId: 0,
    defaultCategoryKeyword: null,
    defaultColor: "",
    inactiveItem: false,
    materialsId: 0,
    metaTitle: null,
    msrp: null,
    priceCode: null,
    productType: null,
    salesUM: null,
    salesUMFactor: null,
    season_active: null,
    season_available: false,
    season_code: null,
    season_description: null,
    season_teaser: null,
    shipWeight: null,
    stdPrice: null,
    stdUM: null,
    taxClassId: 0,
    upc: null,
    id: 0,
    name: '',
    itemCode: '',
    keyword: '',
    status: true,
    sellAs: SELL_AS_SELF,
    image: '',
    manufacturersId: 12,
    defaultParentProductsId: 0,
    parentProductKeyword: null,
    redirectToParent: false,
    availableForSale: true,
    product_season_id: 0,
    description: '',
    details: '',
    QuantityAvailable: 0,
}


export const defaultVariant:ProductVariant = {
    id: 0,
    parentProductID: 0,
    variantProductID: 0,
    title: '',
    isDefaultVariant: false,
    status: true,
    priority: 0,
}
