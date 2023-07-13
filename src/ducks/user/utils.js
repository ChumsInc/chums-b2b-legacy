/**
 *
 * @param {UserCustomerAccess} a
 * @param {UserCustomerAccess} b
 * @return {number}
 */
export const userAccountSort = (a, b) => {
    return a.id - b.id;
}

/**
 *
 * @param {UserCustomerAccess[]} accountList
 * @return {UserCustomerAccess|null}
 */
export const getPrimaryAccount = (accountList) => {
    if (!accountList.length) {
        return null;
    }
    const [primary] = accountList.filter(acct => acct.primaryAccount);
    return primary ?? accountList[0];
}

/**
 *
 * @param {Salesperson} a
 * @param {Salesperson} b
 * @return number;
 */
export const userRepListSort = (a, b) => {
    return a.SalespersonNo.toUpperCase() > b.SalespersonNo.toUpperCase() ? 1 : -1;
}
