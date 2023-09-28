import {SalesOrderDetailLine} from "b2b-types";
import {ChangeDetailLine, NewCommentLine} from "../types/cart";

export const changedDetailLine = (line:SalesOrderDetailLine):ChangeDetailLine => {
    const {LineKey, ItemCode, QuantityOrdered, CommentText} = line;
    return {LineKey, ItemCode, QuantityOrdered, CommentText};
}

export const newCommentLine = (line:SalesOrderDetailLine):NewCommentLine => {
    const {LineKey, CommentText} = line;
    return {LineKey, CommentText};
}
