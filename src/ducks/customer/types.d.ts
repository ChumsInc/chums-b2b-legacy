import {
    BillToCustomer,
    CustomerContact,
    CustomerPaymentCard,
    CustomerPriceRecord,
    CustomerUser, Editable,
    ShipToCustomer
} from "b2b-types";
import {EmptyObject, Selectable} from "../../_types";

export interface CustomerState {
    company: string;
    account: (BillToCustomer & Editable) | EmptyObject;
    contacts: CustomerContact[];
    pricing: CustomerPriceRecord[];
    shipToAddresses: (ShipToCustomer & Editable)[];
    paymentCards: CustomerPaymentCard[];
    loading: boolean;
    loaded: boolean;
    users: (CustomerUser & Selectable & Editable)[];
}
