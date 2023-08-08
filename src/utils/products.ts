import {PRICE_FIELDS, PriceField, SELL_AS_COLOR, SELL_AS_MIX, SELL_AS_SELF} from "../constants/actions";
import {calcPrice, priceRecord} from "./customer";
import {
    BasicProduct,
    CartProduct,
    CustomerPriceRecord,
    isSellAsColors,
    isSellAsMix, isSellAsSelf,
    isSellAsVariants, Keyword,
    Product,
    ProductColorItem, ProductVariant
} from "b2b-types";
import {ProductAdditionalData, SellAsVariantsProduct} from "b2b-types/src/products";
import Decimal from "decimal.js";

export const hasVariants = (product: Product) => isSellAsVariants(product) && product.variants.filter(v => v.status).length > 0;

export const defaultVariant = (product: SellAsVariantsProduct) => {
    const activeVariants = product.variants.filter(v => v.status);
    const [variant = activeVariants[0]] = activeVariants.filter(v => v.isDefaultVariant);
    return variant;
};

export const getSalesUM = (product: Product): string => {
    if (isSellAsColors(product)) {
        const um: string[] = [];
        product.items
            .filter(item => !(!item.status || item.inactiveItem || item.productType === 'D' || !item.salesUM))
            .forEach(item => {
                if (!!item.salesUM && !um.includes(item.salesUM)) {
                    um.push(item.salesUM);
                }
            });
        return um.join(',');
    }
    return product.salesUM ?? '';
};

export const getItemPrice = ({item, priceField = PRICE_FIELDS.standard, priceCodes = []}: {
    item: CartProduct | ProductColorItem;
    priceField: PriceField;
    priceCodes: CustomerPriceRecord[]
}): string => {
    if (priceField === PRICE_FIELDS.msrp) {
        return new Decimal(item.msrp ?? 0).toFixed(2);
    }
    const priceCode = priceRecord({pricing: priceCodes, priceCode: item.priceCode, itemCode: item.itemCode});
    return new Decimal(calcPrice({stdPrice: (item[priceField] ?? 0), ...priceCode})).times(item.salesUMFactor ?? 1).toFixed(2);
};

export const getPrice = ({product, priceField = PRICE_FIELDS.standard, priceCodes = []}: {
    product: Product;
    priceField: PriceField;
    priceCodes?: CustomerPriceRecord[]
}): string[] => {
    const priceCode = priceRecord({pricing: priceCodes, itemCode: product.itemCode, priceCode: product.priceCode});
    if (isSellAsColors(product)) {
        const prices: string[] = [];
        product.items
            .filter(item => !(!item.status || item.inactiveItem || item.productType === 'D'))
            .filter(item => !!item[priceField])
            .forEach(item => {
                const price = getItemPrice({item, priceField, priceCodes});
                if (!prices.includes(price)) {
                    prices.push(price);
                }
            });
        if (prices.length === 0) {
            return [new Decimal(product.msrp ?? 0).toFixed(2)];
        }
        if (prices.length === 1) {
            return prices;
        }
        const sortedPrices = prices.sort((a, b) => new Decimal(a).gt(b) ? 1 : -1);
        return [sortedPrices[0], sortedPrices[sortedPrices.length - 1]];
    }

    switch (product.sellAs) {
        case SELL_AS_SELF:
        case SELL_AS_MIX:
            return [
                new Decimal(calcPrice({stdPrice: product[priceField] ?? 0, ...priceCode}))
                    .times(product.salesUMFactor ?? 1)
                    .toFixed(2)
            ];
        default:
            return [];
    }
};

export const getMSRP = (product: Product) => {
    return getPrice({product, priceField: PRICE_FIELDS.msrp});
};

export const getPrices = ({product, priceCodes = []}: {
    product: Product;
    priceCodes: CustomerPriceRecord[];
}) => {
    return getPrice({product, priceField: PRICE_FIELDS.standard, priceCodes});
};

export const defaultCartItem = (product: Product, preferredColor?: string, cartItemCode?:string): CartProduct => {
    if (isSellAsColors(product)) {
        let cartItem:ProductColorItem|undefined;
        if (cartItemCode) {
            [cartItem] = product.items
                .filter(item => item.status)
                .filter(item => item.itemCode === cartItemCode);
        }
        if (!cartItem) {
            [cartItem] = product.items
                .filter(item => item.status)
                .filter(item => item.colorCode === preferredColor);
        }
        if (!cartItem) {
            [cartItem] = product.items
                .filter(item => item.status)
                .filter(item => item.colorCode === product.defaultColor);
        }
        return colorCartItem(cartItem ?? defaultCartItem(product), product);
    }
    if (isSellAsMix(product)) {
        const [colorName = ''] = product.mix.items.filter(item => item.color?.code === product.defaultColor)
            .map(item => item.color?.name ?? '');
        const additionalData: ProductAdditionalData = {};
        const [image_filename] = product.mix.items
            .filter(item => item.color?.code === product.defaultColor)
            .map(item => {
                if (item.additionalData && item.additionalData.image_filename) {
                    return item.additionalData.image_filename;
                }
                return null;
            });
        if (image_filename) {
            additionalData.image_filename = image_filename ?? undefined;
        }
        return {
            image: image_filename ?? '',
            name: product.name,
            productId: product.id,
            itemCode: product.itemCode,
            stdPrice: product.stdPrice,
            salesUM: product.salesUM,
            salesUMFactor: product.salesUMFactor,
            quantityAvailable: product.QuantityAvailable,
            msrp: product.msrp,
            quantity: 1,
            seasonCode: product.season_code,
            seasonAvailable: product.season_available
        };
    }
    return {
        image: product.image,
        name: product.name,
        productId: product.id,
        itemCode: product.itemCode,
        stdPrice: product.stdPrice,
        salesUM: product.salesUM,
        salesUMFactor: product.salesUMFactor,
        quantityAvailable: product.QuantityAvailable,
        msrp: product.msrp,
        quantity: 1,
        seasonCode: product.season_code,
        seasonAvailable: product.season_available
    };
};

export const colorCartItem = (item:ProductColorItem, product?:BasicProduct):CartProduct => {
    return {
        image: product?.image ?? item.additionalData?.image_filename ?? '',
        name: product?.name ?? item.colorName,
        productId: item.productId,
        itemCode: item.itemCode,
        priceCode: item.priceCode,
        stdPrice: item.stdPrice,
        salesUM: item.salesUM,
        salesUMFactor: item.salesUMFactor,
        quantityAvailable: item.QuantityAvailable,
        msrp: item.msrp,
        quantity: 1,
        seasonCode: item.additionalData?.swatch_code,
        seasonAvailable: item.additionalData?.season?.product_available,
        seasonDescription: item.additionalData?.season?.description,
        seasonTeaser: item.additionalData?.season?.product_teaser
    }
};


export const sortVariants = (a:ProductVariant, b:ProductVariant) => a.priority === b.priority
    ? (a.title.toLowerCase() === b.title.toLowerCase() ? 0 : (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
    : (a.priority > b.priority ? 1 : -1);

/**
 *
 * @param {Object} product
 * @param {Number} product.sellAs
 * @param {String} product.defaultColor
 * @param {Object} product.mix
 * @param {Array} product.items
 * @param preferredColor
 * @return {string}
 */
export const getDefaultColor = (product:Product, preferredColor:string = ''):string => {
    if (isSellAsSelf(product)) {
        return product.defaultColor ?? '';
    }
    if (isSellAsMix(product)) {
        return product.mix.items.filter(item => item.color?.code === preferredColor).length
            ? preferredColor
            : (product.defaultColor ?? '');
    }
    if (isSellAsColors(product)) {
        return product.items
            .filter(item => item.status)
            .filter(item => item.colorCode === preferredColor).length
            ? preferredColor
            : (product.defaultColor ?? '');
    }
    return (product.defaultColor || '');
};

export const parseColor = (str:string, colorCode:string = ''):string => {
    if (!str) {
        return '';
    }
    colorCode = String(colorCode);

    str = str.replace(/\?/, colorCode);
    colorCode.split('').map(code => {
        str = str.replace(/\*/, code);
    });
    return str.replace(/\*/g, '');
};


export const keywordSorter = (a:Keyword, b:Keyword) => {
    return a.keyword.toLowerCase() > b.keyword.toLowerCase() ? 1 : -1;
}
