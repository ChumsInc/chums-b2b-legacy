import {PRICE_FIELDS, SELECT_COLOR, SELL_AS_COLOR, SELL_AS_MIX, SELL_AS_SELF} from "../constants/actions";
import {calcPrice, priceRecord} from "./customer";

export const hasVariants = (product) => product.variants !== undefined && product.variants.length > 0;
export const defaultVariant = (product) => {
    const activeVariants = product.variants.filter(v => !!v.status);
    const [variant = activeVariants[0]] = activeVariants.filter(v => !!v.isDefaultVariant);
    return variant;
};

export const getSalesUM = (product) => {
    switch (product.sellAs) {
    case SELL_AS_COLOR:
        const um = [];
        product.items
            .filter(item => !(item.status === 0 || item.inactiveItem === 1 || item.productType === 'D' || !item.salesUM))
            .forEach(item => {
                if (!um.includes(item.salesUM)) {
                    um.push(item.salesUM);
                }
            });
        return um.join(',');
    default:
        return product.salesUM;
    }
};

export const getItemPrice = ({item, priceField = PRICE_FIELDS.standard, priceCodes = []}) => {
    if (priceField === PRICE_FIELDS.msrp) {
        return item.msrp;
    }
    const priceCode = priceRecord({pricing: priceCodes, priceCode: item.priceCode, itemCode: item.itemCode});
    return calcPrice({stdPrice:item[priceField], ...priceCode}) * item.salesUMFactor;
};

export const getPrice = ({product, priceField = PRICE_FIELDS.standard, priceCodes = []}) => {
    const priceCode = priceRecord({pricing: priceCodes, itemCode: product.itemCode, priceCode: product.priceCode});

    switch (product.sellAs) {
    case SELL_AS_SELF:
    case SELL_AS_MIX:
        return [calcPrice({stdPrice: product[priceField], ...priceCode}) * product.salesUMFactor];
    case SELL_AS_COLOR:
        const prices = [];
        product.items
            .filter(item => !(item.status === 0 || item.inactiveItem === 1 || item.productType === 'D'))
            .filter(item => !!item[priceField])
            .forEach(item => {
                const price = getItemPrice({item, priceField, priceCodes});
                if (!prices.includes(price)) {
                    prices.push(price);
                }
            });
        if (prices.length === 1) {
            return prices;
        }
        const sortedPrices = prices.sort();
        return [sortedPrices[0], sortedPrices[sortedPrices.length - 1]];
    default:
        return [];
    }
};

export const getMSRP = (product) => {
    return getPrice({product, priceField: PRICE_FIELDS.msrp});
};

export const getPrices = ({product, priceCodes = []}) => {
    return getPrice({product, priceField: PRICE_FIELDS.standard, priceCodes});
};

export const defaultCartItem = ({sellAs, itemCode, stdPrice, salesUM, salesUMFactor, QuantityAvailable, msrp, items, defaultColor, cartItemCode, season_code, season_available, mix}, preferredColor) => {
    switch (sellAs) {
    case SELL_AS_SELF:
        return {itemCode, stdPrice, salesUM, salesUMFactor, QuantityAvailable, msrp, quantity: 1, season_code, season_available};
    case SELL_AS_MIX:
        const [colorName = ''] = mix.items.filter(item => item.color.code === defaultColor)
            .map(item => item.color.name);
        return {itemCode, stdPrice, salesUM, salesUMFactor, QuantityAvailable, msrp, quantity: 1, season_code, season_available, colorName, defaultColor};
    default:
        let cartItem = {};
        if (preferredColor) {
            [cartItem = {}] = items
                .filter(item => !!item.status)
                .filter(item => !!cartItemCode ? item.itemCode === cartItemCode : item.colorCode === preferredColor);
        }
        if (!cartItem.itemCode) {
            [cartItem = {}] = items
                .filter(item => !!item.status)
                .filter(item => !!cartItemCode ? item.itemCode === cartItemCode : item.colorCode === defaultColor);
        }
        if (!cartItem.additionalData) {
            cartItem.additionalData = {season: {}};
        }
        return colorCartItem({...cartItem, season_code, season_available});
    }
};

export const getCartItem = (selectedProduct = {}, cartItem = {}, pricing = []) => {
    if (customerPrice.length) {
        cartItem.price = customerPrice[0];
    }
    if (user.loggedIn) {
        cartItem.priceCodeRecord = priceRecord({pricing: customer.pricing, priceCode: cartItem.priceCode, itemCode: cartItem.itemCode});
        cartItem.priceLevel = customer.account.PriceLevel;
    }
    return {
        ...defaultCartItem({...selectedProduct, cartItemCode: cartItem.itemCode}),
        price: !!pricing.length ? getPrices({product: selectedProduct, priceCodes: pricing}) : cartItem.msrp,
    }
}

export const colorCartItem = ({itemCode, colorName, priceCode, stdPrice, salesUM, salesUMFactor, QuantityAvailable, msrp, additionalData, season_code, season_available}) => {
    return {itemCode, colorName, priceCode, stdPrice, salesUM, salesUMFactor, QuantityAvailable, msrp, quantity: 1, additionalData, season_code, season_available}
};


export const sortVariants = (a, b) => a.priority === b.priority
        ? (a.title === b.title ? 0 : (a.title > b.title ? 1 : -1))
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
export const getDefaultColor = (product, preferredColor = '') => {
    switch (product.sellAs) {
    case SELL_AS_SELF:
        return product.defaultColor || '';
    case SELL_AS_MIX:
        return product.mix && product.mix.items.filter(item => item.color.code === preferredColor).length
            ? preferredColor
            : (product.defaultColor || '');
    case SELL_AS_COLOR:
        return !!product.items && product.items
            .filter(item => item.status === 1)
            .filter(item => item.colorCode === preferredColor).length
            ? preferredColor
            : (product.defaultColor || '');
    }
    return (product.defaultColor || '');
};

export const parseColor = (str, colorCode = '') => {
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
