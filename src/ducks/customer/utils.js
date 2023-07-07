/**
 *
 * @param {CustomerContact} a
 * @param {CustomerContact} b
 * @return {number}
 */
export const customerContactSorter = (a, b) => {
    return a.ContactCode.toUpperCase() > b.ContactCode.toUpperCase() ? 1 : -1;
}

/**
 *
 * @param {CustomerPriceRecord} a
 * @param {CustomerPriceRecord} b
 * @return {number}
 */
export const customerPriceRecordSorter = (a, b) => {
    return `${a.PriceCode}/${a.ItemCode}` > `${b.PriceCode}/${b.ItemCode}` ? 1 : -1;
}

/**
 *
 * @param {ShipToCustomer} a
 * @param {ShipToCustomer} b
 * @return {number}
 */
export const customerShipToSorter = (a, b) => {
    return a.ShipToCode.toUpperCase() > b.ShipToCode.toUpperCase() ? 1 : -1;
}

/**
 *
 * @param {CustomerPaymentCard} a
 * @param {CustomerPaymentCard} b
 * @return {number}
 */
export const customerPaymentCardSorter = (a, b) => {
    return a.CreditCardGUID > b.CreditCardGUID ? 1 : -1;
}

/**
 *
 * @param {CustomerUser} a
 * @param {CustomerUser} b
 * @return {number}
 */
export const customerUserSorter = (a, b) => {
    return a.id - b.id;
}


/**
 *
 * @param {CustomerKey} [customer]
 * @return {string}
 */
export const shortCustomerKey = (customer) => `${customer?.ARDivisionNo ?? ''}-${customer?.ARDivisionNo ?? ''}`;
