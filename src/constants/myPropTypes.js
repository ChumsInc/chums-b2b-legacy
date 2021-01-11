import PropTypes from 'prop-types';

export const customerAccountKeyShape = {
    ARDivisionNo: PropTypes.string,
    CustomerNo: PropTypes.string,
};

export const customerAccountKeyDefaults = {
    ARDivisionNo: '',
    CustomerNo: '',
}

export const addressShape = {
    AddressLine1: PropTypes.string,
    AddressLine2: PropTypes.string,
    AddressLine3: PropTypes.string,
    City: PropTypes.string,
    State: PropTypes.string,
    ZipCode: PropTypes.string,
    CountryCode: PropTypes.string,
};

export const addressDefaults = {
    AddressLine1: '',
    AddressLine2: '',
    AddressLine3: '',
    City: '',
    State: '',
    ZipCode: '',
    CountryCode: 'USA',
};

export const telephoneShape = {
    TelephoneNo: PropTypes.string,
    TelephoneExt: PropTypes.string,
};

export const telephoneDefaults = {
    TelephoneNo: '',
    TelephoneExt: '',
};

export const accountAddressShape = {
    CustomerName: PropTypes.string,
    AddressLine1: PropTypes.string,
    AddressLine2: PropTypes.string,
    AddressLine3: PropTypes.string,
    City: PropTypes.string,
    State: PropTypes.string,
    ZipCode: PropTypes.string,
    CountryCode: PropTypes.string,
};

export const accountAddressDefaults = {
    CustomerName: '',
    AddressLine1: '',
    AddressLine2: '',
    AddressLine3: '',
    City: '',
    State: '',
    ZipCode: '',
    CountryCode: '',
};

export const billToAddressShape = {
    BillToName: PropTypes.string,
    BillToAddress1: PropTypes.string,
    BillToAddress2: PropTypes.string,
    BillToAddress3: PropTypes.string,
    BillToCity: PropTypes.string,
    BillToState: PropTypes.string,
    BillToZipCode: PropTypes.string,
    BillToCountryCode: PropTypes.string,
};

export const billToAddressDefaults = {
    BillToName: '',
    BillToAddress1: '',
    BillToAddress2: '',
    BillToAddress3: '',
    BillToCity: '',
    BillToState: '',
    BillToZipCode: '',
    BillToCountryCode: '',
};

export const shipToAddressShape = {
    ShipToName: PropTypes.string,
    ShipToAddress1: PropTypes.string,
    ShipToAddress2: PropTypes.string,
    ShipToAddress3: PropTypes.string,
    ShipToCity: PropTypes.string,
    ShipToState: PropTypes.string,
    ShipToZipCode: PropTypes.string,
    ShipToCountryCode: PropTypes.string,
};

export const shipToAddressDefaults = {
    ShipToName: '',
    ShipToAddress1: '',
    ShipToAddress2: '',
    ShipToAddress3: '',
    ShipToCity: '',
    ShipToState: '',
    ShipToZipCode: '',
    ShipToCountryCode: '',
};

export const salespersonKeyShape = {
    SalespersonDivisionNo: PropTypes.string,
    SalespersonNo: PropTypes.string,
};

export const salespersonKeyDefaults = {
    SalespersonDivisionNo: '',
    SalespersonNo: '',
};

export const pathListPropType = PropTypes.arrayOf(PropTypes.shape({
    pathname: PropTypes.string,
    title: PropTypes.string,
}));

export const locationPathType = PropTypes.shape({
    pathname: PropTypes.string,
});

export const matchPropTypes = {
    isExact: PropTypes.bool,
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
};

export const userAccountPropType = PropTypes.shape({
    id: PropTypes.number,
    Company: PropTypes.string,
    ...customerAccountKeyShape,
    CustomerName: PropTypes.string,
    ...salespersonKeyShape,
    SalespersonName: PropTypes.string,
    isRepAccount: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
});

export const customerListPropType = PropTypes.shape({
    loading: PropTypes.bool,
    list: PropTypes.array,
});

export const repListItemPropType = PropTypes.shape({
    Company: PropTypes.string,
    ...salespersonKeyShape,
    SalespersonName: PropTypes.string,
    active: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
});

export const repListPropType = PropTypes.shape({
    loading: PropTypes.bool,
    list: PropTypes.arrayOf(repListItemPropType),
});

export const customerAccountShape = {
    Company: PropTypes.string,
    ...customerAccountKeyShape,
    ...addressShape,
    ...telephoneShape,
    EmailAddress: PropTypes.string,
    ContactCode: PropTypes.string,
    ShipMethod: PropTypes.string,
    TermsCode: PropTypes.string,
    ...salespersonKeyShape,
    PriceLevel: PropTypes.string,
    CreditHold: PropTypes.string,
    PrimaryShipToCode: PropTypes.string,
    CustomerStatus: PropTypes.string,
    Reseller: PropTypes.string,
};

export const customerAccountDefaults = {
    Company: 'chums',
    ...customerAccountKeyDefaults,
    ...addressDefaults,
    ...telephoneDefaults,
    EmailAddress: '',
    ContactCode: '',
    ShipMethod: '',
    TermsCode: '',
    ...salespersonKeyDefaults,
    PriceLevel: '',
    CreditHold: '',
    PrimaryShipToCode: '',
    CustomerStatus: '',
    Reseller: '',
};

export const orderDetailPropType = PropTypes.shape({
    LineKey: PropTypes.string,
    LineSeqNo: PropTypes.string,
    ItemCode: PropTypes.string,
    ItemType: PropTypes.string,
    ItemCodeDesc: PropTypes.string,
    WarehouseCode: PropTypes.string,
    PriceLevel: PropTypes.string,
    UnitOfMeasure: PropTypes.string,
    UnitOfMeasureConvFactor: PropTypes.number,
    SalesKitLineKey: PropTypes.string,
    ExplodedKitItem: PropTypes.string,
    PromiseDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    QuantityOrdered: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    QuantityShipped: PropTypes.number,
    QuantityBackorderd: PropTypes.number,
    UnitPrice: PropTypes.number,
    LineDiscountPercent: PropTypes.number,
    ExtensionAmt: PropTypes.number,
    QuantityPerBill: PropTypes.number,
    CommentText: PropTypes.string,
    StandardUnitPrice: PropTypes.number,
    SuggestedRetailPrice: PropTypes.number,
    UDF_UPC: PropTypes.string,
    UDF_UPC_BY_COLOR: PropTypes.string,
});

export const orderHeaderPropType = PropTypes.shape({
    Company: PropTypes.string,
    SalesOrderNo: PropTypes.string,
    OrderDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    OrderType: PropTypes.string,
    OrderStatus: PropTypes.string,
    ShipExpireDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    ...customerAccountKeyShape,
    ...billToAddressShape,
    ShipToCode: PropTypes.string,
    ...shipToAddressShape,
    ShipVia: PropTypes.string,
    CustomerPONo: PropTypes.string,
    FOB: PropTypes.string,
    WarehouseCode: PropTypes.string,
    ConfirmTo: PropTypes.string,
    Comment: PropTypes.string,
    TermsCode: PropTypes.string,
    TermsCodeDesc: PropTypes.string,
    CurrentInvoiceNo: PropTypes.string,
    ...salespersonKeyShape,
    PaymentType: PropTypes.string,
    CancelReasonCode: PropTypes.string,
    AmountSubjectToDiscount: PropTypes.number,
    DiscountRate: PropTypes.number,
    DiscountAmt: PropTypes.number,
    TaxableAmt: PropTypes.number,
    NonTaxableAmt: PropTypes.number,
    SalesTaxAmt: PropTypes.number,
    TaxSchedule: PropTypes.string,
    FreightAmt: PropTypes.number,
    DepositAmt: PropTypes.number,
    UDF_CANCEL_DATE: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    UDF_IMPRINTED: PropTypes.string,
    PromotedDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
});

export const cartsPropType = PropTypes.shape({
    loading: PropTypes.bool,
    list: PropTypes.arrayOf(orderHeaderPropType)
});

export const ordersPropType = PropTypes.shape({
    loading: PropTypes.bool,
    list: PropTypes.arrayOf(orderHeaderPropType)
});

export const invoicePropType = PropTypes.shape({
    Company: PropTypes.string,
    InvoiceNo: PropTypes.string,
    InvoiceType: PropTypes.string,
    InvoiceDate: PropTypes.string,
    CustomerPONo: PropTypes.string,
    SalesOrderNo: PropTypes.string,
    OrderType: PropTypes.string,
    ShipToName: PropTypes.string,
    ShipToCity: PropTypes.string,
    ShipToState: PropTypes.string,
});

export const shipToAddressPropType = PropTypes.shape({
    ...customerAccountKeyShape,
    ShipToCode: PropTypes.string,
    ...shipToAddressShape,
    TelephoneNo: PropTypes.string,
    TelephoneExt: PropTypes.string,
    EmailAddress: PropTypes.string,
    ContactCode: PropTypes.string,
    SalespersonDivisionNo: PropTypes.string,
    SalespersonNo: PropTypes.string,
    ResidentialAddress: PropTypes.string,
    Reseller: PropTypes.string,
});

export const currentCartPropType = PropTypes.shape({
    cartNo: PropTypes.string,
    cartName: PropTypes.string,
    cartTotal: PropTypes.number,
    loading: false,
});

export const contactCodePropType = PropTypes.shape({
    ...customerAccountKeyShape,
    ContactCode: PropTypes.string,
    ContactName: PropTypes.string,
    ...addressShape,
    TelephoneNo1: PropTypes.string,
    TelephoneExt1: PropTypes.string,
    TelephoneNo2: PropTypes.string,
    TelephoneExt2: PropTypes.string,
    EmailAddress: PropTypes.string,
    ContactTitle: PropTypes.string,
});

export const customerUserShape = {
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
};

export const contentPageShape = {
    id: PropTypes.number,
    keyword: PropTypes.string,
    title: PropTypes.string,
    metaDescription: PropTypes.string,
    content: PropTypes.string,
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    lifestyle: PropTypes.string,
};

export const paymentCardShape = {
    ARDivisionNo: PropTypes.string,
    CustomerNo: PropTypes.string,
    PaymentType: PropTypes.string,
    ExpirationDateYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ExpirationDateMonth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
