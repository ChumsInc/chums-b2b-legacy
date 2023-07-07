/**
 *
 * @param {SalesOrderDetailLine & Editable & Appendable} line
 * @return {ChangeDetailLine}
 */
export const changedDetailLine = (line) => {
    const {LineKey, ItemCode, QuantityOrdered, CommentText} = line;
    return {LineKey, ItemCode, QuantityOrdered, CommentText};
}

/**
 *
 * @param {SalesOrderDetailLine & Editable & Appendable} line
 * @return {NewCommentLine}
 */
export const newCommentLine = (line) => {
    const {LineKey, CommentText} = line;
    return {LineKey, CommentText};
}
