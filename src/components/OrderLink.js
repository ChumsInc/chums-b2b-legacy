import React from 'react';
import {Link} from 'react-router-dom';
import classNames from "classnames";
import {ORDER_TYPE, PATH_CUSTOMER_ACCOUNT, PATH_INVOICE, PATH_SALES_ORDER} from "../constants/paths";
import {companyCode, longCustomerNo} from "../utils/customer";
import {calcOrderType} from "../utils/orders";
import {buildPath} from "../utils/fetch";

export const CartButton = ({Company, SalesOrderNo, selected = false, onClick}) => {
    const btnClassName = {
        'btn-outline-secondary': !selected,
        'btn-primary': selected
    };
    return (
        <button className={classNames("btn btn-sm", btnClassName)}
                title={selected ? 'Current Cart' : 'Make this the current cart'}
                onClick={() => onClick(SalesOrderNo)}>
            <span className="material-icons">shopping_cart</span>
        </button>);
};

export const OrderLink = ({Company, SalesOrderNo, OrderType, OrderStatus}) => {
    if (!Company || !SalesOrderNo) {
        return null;
    }
    Company = companyCode(Company);
    const path = buildPath(PATH_SALES_ORDER, {orderType: calcOrderType({OrderType, OrderStatus}), Company, SalesOrderNo});
    // const path = PATH_SALES_ORDER
    //     .replace(':calcOrderType?', encodeURIComponent(calcOrderType({OrderType, OrderStatus})))
    //     .replace(':Company?', encodeURIComponent(Company))
    //     .replace(':SalesOrderNo?', encodeURIComponent(SalesOrderNo));
    return (<Link to={path}>{SalesOrderNo}</Link>)
};

export const InvoiceLink = ({Company, InvoiceNo, InvoiceType}) => {
    Company = companyCode(Company);
    const path = buildPath(PATH_INVOICE, {Company, InvoiceNo, InvoiceType});
    return (<Link to={path}>{InvoiceNo}-{InvoiceType}</Link>)
}
