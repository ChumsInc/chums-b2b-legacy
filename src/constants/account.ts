/**
 * Created by steve on 12/6/2016.
 */
import {
    PaymentType,
    PaymentTypeList,
    PriceLevelsDescriptionList, ShippingMethod,
    ShippingMethodList, TermsCode,
    TermsCodeList
} from "../types/customer";


export const filteredTermsCode = (code?:string|null):TermsCode|null => {
    if (!code) {
        return null;
    }
    return TERMS_CODES[code] ?? null;
};

export const TERMS_CODES:TermsCodeList = {
    '00': {description: 'No Terms', due: 0},
    '01': {description: 'COD', due: 15},
    '02': {description: 'Net 30 Days', due: 30},
    '03': {description: '2% 10 Net 30', due: 30},
    '04': {description: 'Credit Card', due: 0},
    '05': {description: 'Net', due: 1},
    '06': {description: '1% 10 Net 30', due: 30},
    '08': {description: '2% 10 Net 60', due: 60},
    '09': {description: '3% 10 Net 31', due: 31},
    '10': {description: 'COD Cash', due: 15},
    '13': {description: 'Net 15 Days', due: 15},
    '14': {description: 'Net 45 Days', due: 45},
    '15': {description: 'Net 60 Days', due: 60},
    '16': {description: 'Net 7 Days', due: 7},
    '17': {description: '2% 10 Net 15', due: 15},
    '19': {description: '10% 30 Net 31', due: 31},
    '22': {description: '5% 30 Net 31', due: 31},
    '23': {description: 'Net 10 Days', due: 10},
    '26': {description: 'Wire Tranansfer', due: 0},
    '28': {description: '5% Net 60', due: 60},
    '29': {description: '5% 60 Net 61', due: 61},
    '30': {description: '1% 15 Net 30', due: 30},
    '31': {description: '2% 10 Net 45', due: 45},
    '32': {description: '2% 10 Net 61', due: 61},
    '33': {description: '2% 60 Net 61', due: 61},
    '34': {description: 'Check In Advance', due: 0},
    '38': {description: '2% Net 40', due: 40},
    '39': {description: '2% 30 Net 90', due: 90},
    '40': {description: '2% 15 Net 50', due: 50},
    '90': {description: 'Net 90 Days', due: 90},
    '92': {description: 'Net 120 Days', due: 120},
    '98': {description: 'Cash In Advance', due: 0},
    '99': {description: '*Net 30 Days', due: 30},
};

export const getPaymentType = (paymentType:string):PaymentType => {
    return PAYMENT_TYPES[paymentType] || PAYMENT_TYPES.OTHER;
};

export const PAYMENT_TYPES:PaymentTypeList = {
    TERMS: {
        code: 'TERMS',
        sageCode: '',
        description: 'Terms',
        message: 'PO # is required.',
        allowTerms: true,
        allowCC: false,
        disabled: false,
        requirePO: true,
        prepaid: false,
    },
    OTHER: {
        code: 'OTHER',
        sageCode: 'OTHER',
        description: 'Other',
        message: 'Please arrange payment with your customer support person.',
        allowTerms: false,
        allowCC: false,
        disabled: false,
        requirePO: false,
        prepaid: false,
    },
    CHECK: {
        code: 'CHECK',
        sageCode: 'CHECK',
        description: 'Check',
        message: 'Payment must be received before order is shipped.',
        allowTerms: false,
        allowCC: false,
        disabled: false,
        requirePO: false,
        prepaid: true,
    },
    '1M/V': {
        code: '1M/V',
        sageCode: '1M/V',
        description: 'Credit Card (MC/Visa)',
        message: 'Pay with credit card on file.',
        allowTerms: false,
        allowCC: true,
        disabled: false,
        requirePO: false,
        prepaid: true,
    },
    '1AMEX': {
        code: '1AMEX',
        sageCode: '1AMEX',
        description: 'Credit Card (AmEx)',
        message: 'Pay with credit card on file.',
        allowTerms: false,
        allowCC: true,
        disabled: false,
        requirePO: false,
        prepaid: true,
    },
    '1DISC': {
        code: '1DISC',
        sageCode: '1DISC',
        description: 'Credit Card (Discovery)',
        message: 'Pay with credit card on file.',
        allowTerms: false,
        allowCC: true,
        disabled: false,
        requirePO: false,
        prepaid: true,
    }
};

export const CREDIT_CARD_PAYMENT_TYPES = [
    PAYMENT_TYPES["1AMEX"].code,
    PAYMENT_TYPES["1DISC"].code,
    PAYMENT_TYPES["1M/V"].code,
];

export const PRICE_METHODS = {
    override: 'O',
    discountPct: 'D',
    costMarkupAmt: 'C',
    costMarkupPct: 'M',
    discountAmt: 'P',
};


export const SHIPPING_METHODS:ShippingMethodList = {
    // 'CHEAPEST': {code: 'CHEAPEST', description: 'Ship cheapest way possible', allowCustomerAccount: false, carrier: 'fedex'},
    '1FEX_GROUND': {code: '1FEX_GROUND', description: 'FedEX Ground', allowCustomerAccount: true, carrier: 'fedex'},
    '1UPS_GROUND': {code: '1UPS_GROUND', description: 'UPS Ground', allowCustomerAccount: true, carrier: 'ups'},
    'APP': {code: 'APP', description: 'USPS Priority', allowCustomerAccount: false, carrier: 'usps'},

    // '1FEX_1ST_ONIGHT': {code: '1FEX_1ST_ONIGHT', description: 'FedEx 1st Overnight', allowCustomerAccount: true, carrier: 'fedex'},
    // '1FEX_DEFAIR': {code: '1FEX_DEFAIR', description: 'FedEx Defered Air', allowCustomerAccount: true, carrier: 'fedex'},
    // '1FEX_ECN_2DAY': {code: '1FEX_ECN_2DAY', description: 'FedEx Economy 2 Day', allowCustomerAccount: true, carrier: 'fedex'},
    // '1FEX_EXP_SAVER': {code: '1FEX_EXP_SAVER', description: 'FedEx Express Saver', allowCustomerAccount: true, carrier: 'fedex'},
    // '1FEX_PRI_ONIGHT': {code: '1FEX_PRI_ONIGHT', description: 'FedEx Priority Ovn', allowCustomerAccount: true, carrier: 'fedex'},
    // '1FEX_STD_ONIGHT': {code: '1FEX_STD_ONIGHT', description: 'FedEx Std Overnight', allowCustomerAccount: true, carrier: 'fedex'},
    //
    // '1UPS_2DAY': {code: '1UPS_2DAY', description: 'UPS 2nd Day Air', allowCustomerAccount: true, carrier: 'ups'},
    // '1UPS_2DAY_AM': {code: '1UPS_2DAY_AM', description: 'UPS 2nd Day Air AM', allowCustomerAccount: true, carrier: 'ups'},
    // '1UPS_3DAY': {code: '1UPS_3DAY', description: 'UPS 3 Day Select', allowCustomerAccount: true, carrier: 'ups'},
    // '1UPS_NEXT_DAY': {code: '1UPS_NEXT_DAY', description: 'UPS Next Day Air', allowCustomerAccount: true, carrier: 'ups'},
    // '1UPS_NEXT_DAY_S': {code: '1UPS_NEXT_DAY_S', description: 'UPS Next Day SAVER', allowCustomerAccount: true, carrier: 'ups'},

    'TO BE DECIDED': {code: 'TO BE DECIDED', description: 'To Be Decided', allowCustomerAccount: false, carrier: ''},
};

export const DEFAULT_SHIPPING_ACCOUNT = {enabled: false, value: ''};

export const getShippingMethod = (code:string|null|undefined):ShippingMethod|null => {
    if (!code) {
        return null;
    }
    return SHIPPING_METHODS[code] ?? null;
};

export const PRICE_LEVELS:PriceLevelsDescriptionList = {
    1: 'Wholesale 100 Pc',
    2: 'Wholesale 200 Pc',
    5: 'Wholesale 500 Pc',
    A: 'Distributor 5000 Pc',
    B: 'Distributor 10000 Pc',
    C: 'Distributor 20000 Pc',
    N: 'Safety DNS',
    S: 'Safety DSS',
    M: 'Safety DSM',
    L: 'Safety DSL',
    G: 'Safety GOV',
    X: 'International 5000',
    Y: 'International 10000',
    Z: 'International 20000',
}
