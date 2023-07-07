/**
 *
 * @param {SalesOrderDetailLine} a
 * @param {SalesOrderDetailLine} b
 * @return {number};
 */
export const defaultDetailSorter = (a, b) => {
    return +a.LineKey - +b.LineKey;
}

/**
 *
 * @param {SalesOrderHeader} a
 * @param {SalesOrderHeader} b
 * @return {number}
 */
export const salesOrderSorter = (a, b) => {
    return a.SalesOrderNo > b.SalesOrderNo ? 1 : -1;
}
