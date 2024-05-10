import {PRICE_METHODS} from "../constants/account";
import Decimal from "decimal.js";
import {
    BasicCustomer,
    BillToCustomer,
    Customer,
    CustomerAddress,
    CustomerContact,
    CustomerKey,
    CustomerPaymentCard,
    CustomerPriceRecord,
    CustomerUser,
    RecentCustomer,
    ShipToAddress,
    ShipToCustomer,
    UserCustomerAccess
} from "b2b-types";
import {SortProps} from "../types/generic";

export const companyName = (code: string = ''): string => {
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

export const companyCode = (code: string = ''): string => {
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

export const sageCompanyCode = (code: string = ''): string => {
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
export const companyPriority = (code: string): number => {
    switch (companyCode(code)) {
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
export const longCustomerNo = ({ARDivisionNo, CustomerNo, ShipToCode}: CustomerKey): string => !!ShipToCode
    ? `${ARDivisionNo}-${CustomerNo}/${ShipToCode}`
    : `${ARDivisionNo}-${CustomerNo}`;

export const longRepNo = ({SalespersonDivisionNo, SalespersonNo}: {
    SalespersonDivisionNo: string;
    SalespersonNo: string;
}): string => SalespersonDivisionNo === '%' && SalespersonNo === '%'
    ? 'All Reps'
    : (SalespersonDivisionNo === '%' ? `${SalespersonNo}` : `${SalespersonDivisionNo}-${SalespersonNo}`);


export const longAccountNumber = (acct: UserCustomerAccess): string => acct.isRepAccount ? longRepNo(acct) : longCustomerNo(acct);


export const sortUserAccounts = (a: UserCustomerAccess, b: UserCustomerAccess) => {
    const acctA = longAccountNumber(a);
    const acctB = longAccountNumber(b);
    return a.Company === b.Company
        ? (acctA === acctB ? (a.id - b.id) : (acctA > acctB ? 1 : -1))
        : a.Company < b.Company ? 1 : -1;
};

export const compareCustomerAccountNumber = (a: CustomerKey, b: CustomerKey) => {
    const aCust = longCustomerNo(a);
    const bCust = longCustomerNo(b);
    return aCust === bCust ? 0 : (aCust > bCust ? 1 : -1)
};


export const isUSA = (countryCode = '') => ['USA', 'US'].includes((countryCode || '').toUpperCase());
export const isCanada = (countryCode = '') => ['CAN', 'CA'].includes((countryCode || '').toUpperCase());

export const isValidCompany = ({Company}: { Company: string }) => {
    return ['chums', 'bc'].includes(companyCode(Company).toLowerCase())
};

export const isValidARDivisionNo = (ARDivisionNo: string = ''): boolean => {
    return /^0[1-9]$/.test(ARDivisionNo);
};

/**
 *
 * @param {string} CustomerNo
 * @return {boolean}
 */
export const isValidCustomerNo = (CustomerNo: string = ''): boolean => {
    return /^[A-Z0-9]+$/i.test(CustomerNo ?? '')
};

export const isValidCustomer = (arg:CustomerKey|null):arg is CustomerKey => {
    if (!arg) {
        return false;
    }
    return isValidARDivisionNo(arg.ARDivisionNo) && isValidCustomerNo(arg.CustomerNo);
};


export const calcPrice = ({stdPrice, PricingMethod = null, DiscountMarkup1 = 0}: {
    stdPrice: string | number | null;
    PricingMethod: string | null;
    DiscountMarkup1: string | number;
}): string | number => {
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

export const priceRecord = ({pricing = [], itemCode, priceCode}: {
    pricing: CustomerPriceRecord[];
    itemCode: string;
    priceCode?: string | null;
}): CustomerPriceRecord => {
    const [itemRecord] = pricing.filter(pc => pc.ItemCode === itemCode && itemCode !== '');
    if (itemRecord) {
        return {...itemRecord};
    }
    const [priceRecord] = pricing.filter(pc => pc.PriceCode === priceCode && pc.ItemCode === '');
    return priceRecord || {PriceCode: '', PricingMethod: '', DiscountMarkup1: 0, ItemCode: ''};
};

export const itemPrice = ({pricing = [], itemCode, priceCode, stdCost = 0, stdPrice = 0}: {
    pricing: CustomerPriceRecord[];
    itemCode: string;
    priceCode: string;
    stdCost: string | number | null;
    stdPrice: string | number | null;
}) => {
    const {PricingMethod, DiscountMarkup1} = priceRecord({pricing, itemCode, priceCode});
    return calcPrice({stdPrice, DiscountMarkup1, PricingMethod});
};

export const getFirstCustomer = (accounts: UserCustomerAccess[]): BasicCustomer | null => {
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

export const getFirstUserAccount = (accounts: UserCustomerAccess[]) => {
    const [userAccount] = accounts
        .filter(acct => !!acct.isRepAccount)
        .sort((a, b) => a.Company === b.Company ? (longRepNo(a) > longRepNo(b) ? 1 : -1) : (a.Company > b.Company ? 1 : -1));
    return userAccount ?? null;
};

export const getUserAccount = (accounts: UserCustomerAccess[], id: number) => {
    const [userAccount = {}] = accounts
        .filter(acct => acct.id === id);
    return userAccount;
};

export const buildRecentAccounts = (recentAccounts: RecentCustomer[] = [], customer: BasicCustomer) => {
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
export const shipToAddressFromBillingAddress = (customer: BillToCustomer): ShipToCustomer => {
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

export const customerListSorter = ({field, ascending}: SortProps<Customer>) => (a: Customer, b: Customer) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'CustomerName':
            return (
                ((a[field] ?? a.BillToName ?? '').toLowerCase() === (b[field] ?? b.BillToName ?? '').toLowerCase())
                    ? (longCustomerNo(a) > longCustomerNo(b) ? 1 : -1)
                    : ((a[field] ?? a.BillToName ?? '').toLowerCase() > (b[field] ?? b.BillToName ?? '').toLowerCase() ? 1 : -1)
            ) * sortMod;
        case 'AddressLine1':
        case 'City':
        case 'State':
        case 'ZipCode':
        case 'TelephoneNo':
        case 'EmailAddress':
        case 'CountryCode':
            return (
                ((a[field] ?? '').toLowerCase() === (b[field] ?? '').toLowerCase())
                ? (longCustomerNo(a) > longCustomerNo(b) ? 1 : -1)
                : ((a[field] ?? '').toLowerCase() > (b[field] ?? '').toLowerCase() ? 1 : -1)
            ) * sortMod;
        default:
            return (longCustomerNo(a) > longCustomerNo(b) ? 1 : -1) * sortMod
    }
}

export const isShipToAddress = (address: ShipToAddress | CustomerAddress | null): address is ShipToAddress => {
    return !!address && (address as ShipToAddress).ShipToName !== undefined;
}

export const isCustomerAddress = (address: ShipToAddress | CustomerAddress | null): address is CustomerAddress => {
    return !!address && (address as CustomerAddress).CustomerName !== undefined;
}


export const stateCountry = (address: CustomerAddress | ShipToAddress | null): string | null => {
    if (isCustomerAddress(address)) {
        if (!address.CountryCode || address.CountryCode === 'US' || address.CountryCode === 'USA') {
            return address.State;
        }
        if (!address.State) {
            return address.CountryCode;
        }
        return `${address.State}, ${address.CountryCode}`;
    }
    if (isShipToAddress(address)) {
        if (!address.ShipToCountryCode || address.ShipToCountryCode === 'US' || address.ShipToCountryCode === 'USA') {
            return address.ShipToState;
        }
        if (!address.ShipToState) {
            return address.ShipToCountryCode;
        }
        return `${address.ShipToState}, ${address.ShipToCountryCode}`;
    }
    return null;
}


export const customerContactSorter = (a: CustomerContact, b: CustomerContact) => {
    return a.ContactCode.toUpperCase() > b.ContactCode.toUpperCase() ? 1 : -1;
}

export const customerPriceRecordSorter = (a: CustomerPriceRecord, b: CustomerPriceRecord) => {
    return `${a.PriceCode}/${a.ItemCode}` > `${b.PriceCode}/${b.ItemCode}` ? 1 : -1;
}


export const customerPaymentCardSorter = (a: CustomerPaymentCard, b: CustomerPaymentCard) => {
    return a.CreditCardGUID > b.CreditCardGUID ? 1 : -1;
}

export const customerUserSorter = (a: CustomerUser, b: CustomerUser) => {
    return a.id - b.id;
}

export const customerSlug = (customer: CustomerKey | null): string | null => {
    if (!customer) {
        return null;
    }
    return !!customer.ShipToCode
        ? shipToCustomerSlug(customer)
        : billToCustomerSlug(customer);
}

export const isSameCustomer = (a:CustomerKey|null, b:CustomerKey|null):boolean => {
    if (!a || !b) {
        return false;
    }
    return a.ARDivisionNo === b.ARDivisionNo && a.CustomerNo === b.CustomerNo;
}

export const billToCustomerSlug = (customer: CustomerKey | string | null | undefined): string | null => {
    if (!customer) {
        return null;
    }
    if (typeof customer === "string") {
        const parsed = parseCustomerSlug(customer)
        if (!parsed) {
            return null
        }
        customer = parsed;
    }
    return `${customer.ARDivisionNo}-${customer.CustomerNo}`;
}

export const shipToCustomerSlug = (customer: CustomerKey | string | null | undefined): string | null => {
    if (!customer) {
        return null;
    }
    if (typeof customer === 'string') {
        const parsed = parseCustomerSlug(customer);
        if (!parsed) {
            return null;
        }
        customer = parsed;
    }
    return `${customer.ARDivisionNo}-${customer.CustomerNo}-${customer.ShipToCode}`;
}

export const parseCustomerSlug = (slug: string): BasicCustomer | null => {
    if (!/^[0-9]{2}-[\S\s]+/.test(slug)) {
        return null;
    }
    const [ARDivisionNo, CustomerNo, ShipToCode] = slug.split('-');
    return {ARDivisionNo, CustomerNo, ShipToCode};
}

export const shortCustomerKey = (customer: CustomerKey | null) => !!customer ? `${customer?.ARDivisionNo ?? ''}-${customer.CustomerNo ?? ''}` : '';

export const customerNo = (customer: CustomerKey) => `${customer.ARDivisionNo}-${customer.CustomerNo}` + (customer.ShipToCode ? `:${customer.ShipToCode}` : '');

export const isCustomer = (customer: CustomerKey | null): customer is CustomerKey => {
    return !!customer && (customer as CustomerKey).CustomerNo !== undefined;
}

export const buildRecentCustomers = (recentAccounts: RecentCustomer[] = [], customer: BasicCustomer): RecentCustomer[] => {
    if (!customer || !customer.ARDivisionNo || !customer.CustomerNo) {
        return recentAccounts;
    }
    const key = shortCustomerKey(customer);
    return [
        ...recentAccounts.filter(_customer => shortCustomerKey(_customer) !== key),
        {...customer, ts: new Date().valueOf()}]
        .sort((a, b) => b.ts - a.ts)
        .filter((_customer, index) => index < 10);
};


export const emptyCustomer: BillToCustomer = {
    ARDivisionNo: "",
    AddressLine1: null,
    AddressLine2: null, AddressLine3: null, City: null, ContactCode: "", CountryCode: null, CreditHold: 'N',
    CustomerName: "", CustomerNo: "", CustomerStatus: "",
    CustomerType: null, DateEstablished: "",
    DefaultPaymentType: null, EmailAddress: "", InternetReseller: null, PriceLevel: null, PrimaryShipToCode: null,
    Reseller: null, ResidentialAddress: 'N', SalespersonDivisionNo: "", SalespersonNo: "", ShipMethod: null, State: null,
    TaxSchedule: null, TelephoneExt: null, TelephoneNo: null, TermsCode: null, URLAddress: null, ZipCode: null

}

export const defaultShipToSort: SortProps<ShipToCustomer> = {field: "ShipToCode", ascending: true};
export const customerShipToSorter = ({field, ascending}: SortProps<ShipToCustomer>) => (a: ShipToCustomer, b: ShipToCustomer) => {
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'ShipToName':
        case 'EmailAddress':
        case 'ShipToAddress1':
        case 'ShipToCity':
        case 'ShipToZipCode':
            return (
                (a[field] ?? '').toLowerCase() === (b[field] ?? '').toLowerCase()
                    ? (a.ShipToCode > b.ShipToCode ? 1 : -1)
                    : ((a[field] ?? '').toLowerCase() > (b[field] ?? '').toLowerCase() ? 1 : -1)
            ) * sortMod;
        case 'ShipToState':
            return ((stateCountry(a)?.toLowerCase() ?? '') === (stateCountry(b)?.toLowerCase() ?? '')
                    ? (a.ShipToCode > b.ShipToCode ? 1 : -1)
                    : ((stateCountry(a)?.toLowerCase() ?? '') > (stateCountry(b)?.toLowerCase() ?? '') ? 1 : -1)
            ) * sortMod;
        default:
            return (a.ShipToCode > b.ShipToCode ? 1 : -1) * sortMod;
    }
}
