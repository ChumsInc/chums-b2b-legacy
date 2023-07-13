import {PRICE_METHODS} from "../constants/account";

export const companyName = (code = '') => {
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

export const companyCode = (code = '') => {
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

export const sageCompanyCode = (code = '') => {
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
export const companyPriority = (code) => {
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
export const longCustomerNo = ({ARDivisionNo, CustomerNo, ShipToCode}) => ShipToCode
    ? `${ARDivisionNo}-${CustomerNo}:${ShipToCode}`
    : `${ARDivisionNo}-${CustomerNo}`;
export const longRepNo = ({SalespersonDivisionNo, SalespersonNo}) => SalespersonDivisionNo === '%' && SalespersonNo === '%'
    ? 'All Reps'
    : (SalespersonDivisionNo === '%' ? `${SalespersonNo}` : `${SalespersonDivisionNo}-${SalespersonNo}`);
export const longAccountNumber = (acct) => !!acct.isRepAccount ? longRepNo(acct) : longCustomerNo(acct);


export const sortUserAccounts = (a, b) => {
    const acctA = longAccountNumber(a);
    const acctB = longAccountNumber(b);
    return a.Company === b.Company
        ? (acctA === acctB ? (a.id - b.id) : (acctA > acctB ? 1 : -1))
        : a.Company < b.Company ? 1 : -1;
};

export const compareCustomerAccountNumber = (a, b) => {
    const aCust = longCustomerNo(a);
    const bCust = longCustomerNo(b);
    const aCompany = companyCode(a.Company);
    const bCompany = companyCode(b.Company);
    return aCompany === bCompany
        ? (aCust === bCust ? 0 : (aCust > bCust ? 1 : -1))
        : (aCompany > bCompany ? 1 : -1);
};


export const isUSA = (countryCode = '') => ['USA', 'US'].includes((countryCode || '').toUpperCase());
export const isCanada = (countryCode = '') => ['CAN', 'CA'].includes((countryCode || '').toUpperCase());

export const isValidCompany = ({Company}) => {
    return ['chums', 'bc'].includes(companyCode(Company))
};

export const isValidARDivisionNo = ({Company, ARDivisionNo}) => {
    switch (companyCode(Company)) {
    case 'chums':
        return /^0[1-9]$/.test(ARDivisionNo);
    case 'bc':
        return ['01', '02', '03', '04', '05', '06'].includes(ARDivisionNo);
    }
    return false;
};

/**
 *
 * @param {string} CustomerNo
 * @return {boolean}
 */
export const isValidCustomerNo = ({CustomerNo = ''}) => {
    return /^[A-Z0-9]+$/i.test(CustomerNo ?? '')
};

export const isValidCustomer = ({Company, ARDivisionNo, CustomerNo}) => {
    const valid = isValidCompany({Company})
        && isValidARDivisionNo({Company, ARDivisionNo})
        && isValidCustomerNo({CustomerNo});
    return valid === true;
};


export const isSameCustomer = (customer1 = {}, customer2 = {}) => {
    return companyCode(customer1.Company) === companyCode(customer2.Company)
        && customer1.ARDivisionNo === customer2.ARDivisionNo
        && customer1.CustomerNo === customer2.CustomerNo;
};


export const calcPrice = ({stdPrice, PricingMethod = null, DiscountMarkup1 = 0}) => {
    switch (PricingMethod) {
    case PRICE_METHODS.override:
        return DiscountMarkup1;
    case PRICE_METHODS.discountAmt:
        return +stdPrice - DiscountMarkup1;
    case PRICE_METHODS.discountPct:
        return +stdPrice * (1 - (DiscountMarkup1 / 100));
    }
    return +stdPrice;
};

export const priceRecord = ({pricing = [], itemCode, priceCode}) => {
    const [itemRecord] = pricing.filter(pc => pc.ItemCode === itemCode && itemCode !== '');
    if (itemRecord) {
        return {...itemRecord};
    }
    const [priceRecord = {}] = pricing.filter(pc => pc.PriceCode === priceCode && pc.ItemCode === '');
    return {...priceRecord};
};

export const itemPrice = ({pricing = [], itemCode, priceCode, stdCost = 0, stdPrice = 0}) => {
    const {PricingMethod, DiscountMarkup1} = priceRecord({pricing, itemCode, priceCode});
    return calcPrice({stdCost, stdPrice, DiscountMarkup1, PricingMethod});
};

export const getFirstCustomer = (accounts) => {
    const [customer] = accounts
        .filter(acct => !acct.isRepAccount)
        .sort((a, b) => a.Company === b.Company
            ? (longCustomerNo(a) > longCustomerNo(b) ? 1 : -1)
            : (companyPriority(a.Company) > companyPriority(b.Company) ? 1 : -1)
        );
    return customer ?? null;
};

export const getFirstUserAccount = (accounts) => {
    const [userAccount] = accounts
        .filter(acct => !!acct.isRepAccount)
        .sort((a, b) => a.Company === b.Company ? (longRepNo(a) > longRepNo(b) ? 1 : -1) : (a.Company > b.Company ? 1 : -1));
    return userAccount ?? null;
};

export const getUserAccount = (accounts, id) => {
    const [userAccount = {}] = accounts
        .filter(acct => acct.id === id);
    return userAccount;
};

export const buildRecentAccounts = (recentAccounts = [], customer) => {
    recentAccounts = recentAccounts.filter(acct => !(/(bc|bcs)/i.test(acct.Company)));

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
export const shipToAddressFromBillingAddress = (customer) => {
    const [EmailAddress] = (customer.EmailAddress || '').split(/;[ ]*/);
    return {
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
        Reseller: customer.Reseller,
    }
};


export const customerUserSorter = (a, b) => {
    return a.email.toLowerCase() > b.email.toLowerCase() ? 1 : -1;
}
