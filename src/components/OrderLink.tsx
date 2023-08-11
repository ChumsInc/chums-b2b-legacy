import React from 'react';
import {generatePath, Link} from 'react-router-dom';
import {PATH_SALES_ORDER} from "@/constants/paths";
import {OrderType} from "@/ducks/salesOrder/types";

export const OrderLink = ({salesOrderNo, orderType}: {
    salesOrderNo: string | null;
    orderType: OrderType|null;
}) => {
    if (!salesOrderNo) {
        return null;
    }
    const path = generatePath('./:salesOrderNo', {salesOrderNo})
    return (<Link to={path}>{salesOrderNo}</Link>)
};

export default OrderLink;
