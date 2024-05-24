import {
    BillToCustomer,
    CustomerContact,
    CustomerPaymentCard,
    CustomerPriceRecord,
    CustomerUser,
    PromoCode, RecentCustomer,
    ShipToCustomer
} from "b2b-types";
import {CustomerPermissions} from "../../ducks/user/types";

export interface FetchCustomerResponse {
    contacts: CustomerContact[];
    customer: BillToCustomer;
    pricing: CustomerPriceRecord[];
    shipTo: ShipToCustomer[];
    users: CustomerUser[];
    paymentCards: CustomerPaymentCard[];
    promoCodes: PromoCode[];
    permissions: CustomerPermissions | null;
    recent?: RecentCustomer[];
}
