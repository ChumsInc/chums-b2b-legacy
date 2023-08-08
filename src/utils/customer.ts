import {PRICE_METHODS} from "../constants/account";
import Decimal from "decimal.js";
import {
    BasicCustomer,
    BillToCustomer, Customer,
    CustomerKey,
    CustomerPriceRecord, CustomerUser,
    RecentCustomer,
    ShipToCustomer,
    UserCustomerAccess
} from "b2b-types";
import {EmptyObject} from "../_types";

export const companyName = (code:string = ''):string => {
    switch (code.toLowerCase()) {
    case 'chums':
    case 'chi':
        return 'Chums';
    case 'bc':
    case 'bcs':
        return 'Beyond Coastal';
    default:
        return code;
    }
};

export const companyCode = (code:string = ''):string => {
    switch (code.toLowerCase()) {
    case 'chums':
    case 'chi':
        return 'chums';
    case 'bc':
    case 'bcs':
        return 'bc';
    default:
        return code;
    }
};

export const sageCompanyCode = (code:string = ''):string => {
    switch (code.toLowerCase()) {
    case 'chums':
    case 'chi':
        return 'CHI';
    case 'bc':
    case 'bcs':
        return 'BCS';
    default:
        return code;
    }
};
export const companyPriority = (code:string):number => {
    switch(companyCode(code)) {
    case 'chums':
        return 1;
    case 'bc':
        return 2;
    default:
        return 3;
    }
};


/**
 *
 * @param {string} ARDivisionNo
 * @param {string} CustomerNo
 * @param {string} [ShipToCode]
 * @return {string}
 */
export const longCustomerNo = ({ARDivisionNo, CustomerNo, ShipToCode}:{
    ARDivisionNo: string;
    CustomerNo: string;
    ShipToCode?: string|null;
}):string => ShipToCode
    ? `${ARDivisionNo}-${CustomerNo}:${ShipToCode}`
    : `${ARDivisionNo}-${CustomerNo}`;

export const longRepNo = ({SalespersonDivisionNo, SalespersonNo}:{
    SalespersonDivisionNo: string;
    SalespersonNo: string;
}):string => SalespersonDivisionNo === '%' && SalespersonNo === '%'
    ? 'All Reps'
    : (SalespersonDivisionNo === '%' ? `${SalespersonNo}` : `${SalespersonDivisionNo}-${SalespersonNo}`);


export const longAccountNumber = (acct:UserCustomerAccess):string => acct.isRepAccount ? longRepNo(acct) : longCustomerNo(acct);


export const sortUserAccounts = (a:UserCustomerAccess, b:UserCustomerAccess) => {
    const acctA = longAccountNumber(a);
    const acctB = longAccountNumber(b);
    return a.Company === b.Company
        ? (acctA === acctB ? (a.id - b.id) : (acctA > acctB ? 1 : -1))
        : a.Company < b.Company ? 1 : -1;
};

export const compareCustomerAccountNumber = (a:CustomerKey, b:CustomerKey) => {
    const aCust = longCustomerNo(a);
    const bCust = longCustomerNo(b);
    return aCust === bCust ? 0 : (aCust > bCust ? 1 : -1)
};


export const isUSA = (countryCode = '') => ['USA', 'US'].includes((countryCode || '').toUpperCase());
export const isCanada = (countryCode = '') => ['CAN', 'CA'].includes((countryCode || '').toUpperCase());

export const isValidCompany = ({Company}:{Company:string}) => {
    return ['chums', 'bc'].includes(companyCode(Company).toLowerCase())
};

export const isValidARDivisionNo = (ARDivisionNo:string = ''):boolean => {
    return /^0[1-9]$/.test(ARDivisionNo);
};

/**
 *
 * @param {string} CustomerNo
 * @return {boolean}
 */
export const isValidCustomerNo = (CustomerNo:string = ''):boolean => {
    return /^[A-Z0-9]+$/i.test(CustomerNo ?? '')
};

export const isValidCustomer = ({ARDivisionNo, CustomerNo}:{
    ARDivisionNo:string;
    CustomerNo: string;
}) => {
    return isValidARDivisionNo(ARDivisionNo) && isValidCustomerNo(CustomerNo);
};


export const isSameCustomer = (customer1:CustomerKey, customer2:CustomerKey) => {
    return longCustomerNo(customer1).toLowerCase() === longCustomerNo(customer2).toLowerCase();
};


export const calcPrice = ({stdPrice, PricingMethod = null, DiscountMarkup1 = 0}:{
    stdPrice:string|number|null;
    PricingMethod:string|null;
    DiscountMarkup1: string|number;
}):string|number => {
    switch (PricingMethod) {
    case PRICE_METHODS.override:
        return DiscountMarkup1;
    case PRICE_METHODS.discountAmt:
        return new Decimal(stdPrice ?? 0).sub(DiscountMarkup1).toString();
    case PRICE_METHODS.discountPct:
        return new Decimal(stdPrice ?? 0).times(new Decimal(1).sub(new Decimal(DiscountMarkup1).div(100))).toString();
    }
    return stdPrice ?? 0;
};

export const priceRecord = ({pricing = [], itemCode, priceCode}:{
    pricing: CustomerPriceRecord[];
    itemCode: string;
    priceCode?: string|null;
}):CustomerPriceRecord => {
    const [itemRecord] = pricing.filter(pc => pc.ItemCode === itemCode && itemCode !== '');
    if (itemRecord) {
        return {...itemRecord};
    }
    const [priceRecord] = pricing.filter(pc => pc.PriceCode === priceCode && pc.ItemCode === '');
    return priceRecord || {PriceCode: '', PricingMethod: '', DiscountMarkup1: 0, ItemCode: ''};
};

export const itemPrice = ({pricing = [], itemCode, priceCode, stdCost = 0, stdPrice = 0}:{
    pricing: CustomerPriceRecord[];
    itemCode: string;
    priceCode: string;
    stdCost: string|number|null;
    stdPrice: string|number|null;
}) => {
    const {PricingMethod, DiscountMarkup1} = priceRecord({pricing, itemCode, priceCode});
    return calcPrice({stdPrice, DiscountMarkup1, PricingMethod});
};

export const getFirstCustomer = (accounts:UserCustomerAccess[]):BasicCustomer|null => {
    const [customer] = accounts
        .filter(acct => !acct.isRepAccount)
        .sort((a, b) => a.Company === b.Company
            ? (longCustomerNo(a) > longCustomerNo(b) ? 1 : -1)
            : (companyPriority(a.Company) > companyPriority(b.Company) ? 1 : -1)
        );
    if (!customer) {
        return null;
    }
    const {ARDivisionNo, CustomerNo, CustomerName, ShipToCode} = customer;
    return {ARDivisionNo, CustomerNo, CustomerName: CustomerName ?? '', ShipToCode};
};

export const getFirstUserAccount = (accounts:UserCustomerAccess[]) => {
    const [userAccount] = accounts
        .filter(acct => !!acct.isRepAccount)
        .sort((a, b) => a.Company === b.Company ? (longRepNo(a) > longRepNo(b) ? 1 : -1) : (a.Company > b.Company ? 1 : -1));
    return userAccount ?? null;
};

export const getUserAccount = (accounts:UserCustomerAccess[], id:number) => {
    const [userAccount = {}] = accounts
        .filter(acct => acct.id === id);
    return userAccount;
};

export const buildRecentAccounts = (recentAccounts:RecentCustomer[] = [], customer:BasicCustomer) => {
    if (!customer.ARDivisionNo || !customer.CustomerNo) {
        return recentAccounts;
    }
    return [...recentAccounts.filter(_customer => compareCustomerAccountNumber(_customer, customer) !== 0),
        {...customer, ts: new Date().valueOf()}]
        .sort((a, b) => b.ts - a.ts)
        .filter((_customer, index) => index < 10);
};

/**
 *
 * @param {BillToCustomer} customer
 * @returns {ShipToCustomer}
 */
export const shipToAddressFromBillingAddress = (customer:BillToCustomer):ShipToCustomer => {
    const [EmailAddress] = (customer.EmailAddress || '').split(/;[ ]*/);
    return {
        ARDivisionNo: customer.ARDivisionNo,
        CustomerNo: customer.CustomerNo,
        ContactCode: customer.ContactCode,
        SalespersonDivisionNo: customer.SalespersonDivisionNo,
        SalespersonNo: customer.SalespersonNo,
        ShipToCode: '',
        ShipToName: customer.CustomerName,
        ShipToAddress1: customer.AddressLine1,
        ShipToAddress2: customer.AddressLine2,
        ShipToAddress3: customer.AddressLine3,
        ShipToCity: customer.City,
        ShipToState: customer.State,
        ShipToZipCode: customer.ZipCode,
        ShipToCountryCode: customer.CountryCode,
        TelephoneNo: customer.TelephoneNo,
        TelephoneExt: customer.TelephoneExt,
        EmailAddress,
        ResidentialAddress: customer.ResidentialAddress,
        Reseller: customer.Reseller
    }
};


export const customerUserSorter = (a:CustomerUser, b:CustomerUser) => {
    return a.email.toLowerCase() > b.email.toLowerCase() ? 1 : -1;
}
