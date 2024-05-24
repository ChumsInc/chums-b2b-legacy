import {BillToCustomer, Customer, CustomerAddress, CustomerKey, CustomerSalesperson} from "b2b-types";

export const customerBasePath = '/account/:account/:section';
export const customerDocPath = '/account/:account/:section/:document';

export const customerTableId = 'customers:list';

export const defaultCustomerKey: CustomerKey = {
    ARDivisionNo: '',
    CustomerNo: '',
    ShipToCode: null,

}
export const defaultAddress: CustomerAddress = {
    CustomerName: '',
    AddressLine1: null,
    AddressLine2: null,
    AddressLine3: null,
    City: null,
    State: null,
    CountryCode: null,
    ZipCode: null,
}
export const defaultCustomerSalesperson: CustomerSalesperson = {
    SalespersonDivisionNo: '',
    SalespersonNo: '',
}
export const defaultCustomer: Customer = {
    ...defaultCustomerKey,
    ...defaultAddress,
    ...defaultCustomerSalesperson,
    EmailAddress: '',
    TelephoneNo: '',
}
export const defaultBillToCustomer: BillToCustomer = {
    ContactCode: "",
    CreditHold: 'N',
    CustomerStatus: "",
    CustomerType: '',
    DateEstablished: "",
    DefaultPaymentType: null,
    InternetReseller: null,
    PriceLevel: null,
    PrimaryShipToCode: null,
    Reseller: null,
    ResidentialAddress: 'N',
    ShipMethod: null,
    TaxSchedule: null,
    TelephoneExt: null,
    TermsCode: null,
    URLAddress: null,
    ...defaultCustomer

}
