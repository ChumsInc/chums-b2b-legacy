import {CustomerKey} from "b2b-types/src/customer";
import {EmptyObject} from "../../_types";
import {
    BasicCustomer,
    BillToCustomer,
    CustomerContact,
    CustomerPaymentCard,
    CustomerPriceRecord,
    CustomerUser,
    RecentCustomer,
    ShipToCustomer
} from "b2b-types";

export const customerContactSorter = (a: CustomerContact, b: CustomerContact) => {
    return a.ContactCode.toUpperCase() > b.ContactCode.toUpperCase() ? 1 : -1;
}

export const customerPriceRecordSorter = (a: CustomerPriceRecord, b: CustomerPriceRecord) => {
    return `${a.PriceCode}/${a.ItemCode}` > `${b.PriceCode}/${b.ItemCode}` ? 1 : -1;
}

export const customerShipToSorter = (a: ShipToCustomer, b: ShipToCustomer) => {
    return a.ShipToCode.toUpperCase() > b.ShipToCode.toUpperCase() ? 1 : -1;
}

export const customerPaymentCardSorter = (a: CustomerPaymentCard, b: CustomerPaymentCard) => {
    return a.CreditCardGUID > b.CreditCardGUID ? 1 : -1;
}

export const customerUserSorter = (a: CustomerUser, b: CustomerUser) => {
    return a.id - b.id;
}

export const shortCustomerKey = (customer: CustomerKey | EmptyObject | null) => isCustomer(customer) ? `${customer?.ARDivisionNo ?? ''}-${customer.CustomerNo ?? ''}` : '';


export const isCustomer = (customer: CustomerKey | EmptyObject | null): customer is CustomerKey => {
    return !!customer && (customer as CustomerKey).CustomerNo !== undefined;
}

export const buildRecentCustomers = (recentAccounts: RecentCustomer[] = [], customer: BasicCustomer): RecentCustomer[] => {
    if (!isCustomer(customer) || !customer.ARDivisionNo || !customer.CustomerNo) {
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
