import React from 'react';
import {generatePath, Link as RoutedLink} from 'react-router-dom';
import {OrderType} from "../types/salesorder";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "../ducks/user/selectors";
import {customerSlug} from "../utils/customer";
import Link from "@mui/material/Link";

const getSalesOrderPath = (orderType:OrderType|null):string => {
    switch (orderType) {
        case 'cart':
            return '/account/:customerSlug/carts/:salesOrderNo';
        case 'past':
        case 'invoice':
            return '/account/:customerSlug/invoices/so/:salesOrderNo';
        default:
            return '/account/:customerSlug/orders/:salesOrderNo';
    }
}

export const OrderLink = ({salesOrderNo, orderType}: {
    salesOrderNo: string | null;
    orderType: OrderType | null;
}) => {
    const customer = useSelector(selectCurrentCustomer);
    if (!customer || !salesOrderNo) {
        return null;
    }
    const basePath = getSalesOrderPath(orderType);
    const path = generatePath(basePath, {
        customerSlug: customerSlug(customer),
        salesOrderNo
    })
    return (<Link component={RoutedLink} to={path}>{salesOrderNo}</Link>)
};

export default OrderLink;
