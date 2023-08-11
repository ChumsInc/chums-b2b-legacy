import {
    BillToCustomer,
    CustomerContact, CustomerKey,
    CustomerPaymentCard,
    CustomerPriceRecord,
    CustomerUser, Editable, PromoCode,
    ShipToCustomer
} from "b2b-types";
import {EmptyObject, Selectable} from "../../_types";
import {CustomerPermissions} from "@/ducks/user/types";

export interface FetchCustomerResponse {
    contacts: CustomerContact[];
    customer: BillToCustomer;
    pricing: CustomerPriceRecord[];
    shipTo: ShipToCustomer[];
    users: CustomerUser[];
    paymentCards: CustomerPaymentCard[];
    promoCodes: PromoCode[];
    permissions: CustomerPermissions|null;
}
