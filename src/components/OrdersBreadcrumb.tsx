import React from 'react';
import Breadcrumb from "./Breadcrumb";
import {useSelector} from 'react-redux';
import {PATH_CUSTOMER_ACCOUNT, PATH_PROFILE, PATH_PROFILE_ACCOUNT, PATH_SALES_ORDERS} from "@/constants/paths";
import {ORDER_TYPE_NAMES} from "@/constants/orders";
import {selectCurrentAccess, selectCurrentCustomer, selectLoggedIn, selectUserProfile} from "@/ducks/user/selectors";
import {selectSalesOrderHeader} from "@/ducks/salesOrder/selectors";
import {calcOrderType} from "@/utils/orders";
import {customerNo} from "@/utils/customer";
import {BreadcrumbPath} from "@/types/breadcrumbs";

const OrdersBreadcrumb = () => {
    const loggedIn = useSelector(selectLoggedIn);
    const profile = useSelector(selectUserProfile);
    const userAccess = useSelector(selectCurrentAccess);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const salesOrder = useSelector(selectSalesOrderHeader);

    const orderType = calcOrderType(salesOrder) ?? '';
    if (!profile || !userAccess || !currentCustomer || !salesOrder || !orderType) {
        return null;
    }


    const profilePath = PATH_PROFILE_ACCOUNT.replace(':id', encodeURIComponent(profile.id));
    const accountPath = PATH_CUSTOMER_ACCOUNT
        .replace(':ARDivisionNo', encodeURIComponent(currentCustomer.ARDivisionNo))
        .replace(':CustomerNo', encodeURIComponent(currentCustomer.CustomerNo))
        .replace(':ShipToCode?', encodeURIComponent(currentCustomer.ShipToCode ?? ''));
    const orderPath = PATH_SALES_ORDERS.replace(':orderType', encodeURIComponent(orderType));
    const invoicePath = PATH_SALES_ORDERS.replace(':orderType', 'invoice');


    const paths = [
        {title: 'Profile', pathname: PATH_PROFILE},
        userAccess.isRepAccount ? {title: 'Account List', pathname: profilePath} : null,
        {title: customerNo(currentCustomer), pathname: accountPath},
        // !!orderType && !SalesOrderNo && !InvoiceNo ? {title:ORDER_TYPE_NAMES[orderType] || 'Orders', pathname: InvoiceNo ? invoicePath : location.pathname} : null,
        {title: ORDER_TYPE_NAMES[orderType] || 'Orders', pathname: orderPath},
        {title: `SO# ${salesOrder.SalesOrderNo}`, pathname: location.pathname}
    ].filter(p => p !== null) as BreadcrumbPath[];

    return (
        <Breadcrumb paths={paths}/>
    )
}
export default OrdersBreadcrumb;
