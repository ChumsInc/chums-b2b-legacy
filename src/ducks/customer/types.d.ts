import {
    BillToCustomer,
    CustomerContact, CustomerKey,
    CustomerPaymentCard,
    CustomerPriceRecord,
    CustomerUser, Editable, PromoCode,
    ShipToCustomer
} from "b2b-types";
import {EmptyObject, Selectable} from "../../_types";

export interface CustomerState {
    company: string;
    key:CustomerKey|null;
    account: (BillToCustomer & Editable) | EmptyObject;
    contacts: CustomerContact[];
    pricing: CustomerPriceRecord[];
    shipToAddresses: (ShipToCustomer & Editable)[];
    paymentCards: CustomerPaymentCard[];
    loading: boolean;
    loaded: boolean;
    users: (CustomerUser & Selectable & Editable)[];
}

export interface FetchCustomerResponse {
    contacts: CustomerContact[];
    customer: BillToCustomer;
    pricing: CustomerPriceRecord[];
    shipTo: ShipToCustomer[];
    users: CustomerUser[];
    paymentCards: CustomerPaymentCard[];
    promoCodes: PromoCode[];
    permissions: UserCustomerAccess;
}
