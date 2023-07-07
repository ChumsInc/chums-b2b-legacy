import React from 'react';
import SubNavColumn from "./SubNavColumn";
import {PATH_SALES_ORDERS} from "../constants/paths";
import {ORDER_TYPE} from "../constants/orders";

const OrdersSubNav = ({}) => {
    const items = [
        {
            url: PATH_SALES_ORDERS.replace(':orderType?', encodeURIComponent(ORDER_TYPE.cart)),
            title: 'Carts',
            id: 'SUB_NAV_CARTS',
        },
        {
            url: PATH_SALES_ORDERS.replace(':orderType?', encodeURIComponent(ORDER_TYPE.open)),
            title: 'Open Orders',
            id: 'SUB_NAV_OPEN_ORDERS',
        },
        {
            url: PATH_SALES_ORDERS.replace(':orderType?', encodeURIComponent(ORDER_TYPE.invoices)),
            title: 'Invoices',
            id: 'SUB_NAV_INVOICES',
        },
    ];
    return (
        <div className="chums-subnavbar-collapse collapse show">
            <ul className="navbar-nav navbar-orders">
                {items
                    .map(item => (
                        <SubNavColumn key={item.id} url={item.url} title={item.title}/>
                    ))
                }
            </ul>
        </div>
    )
};

export default OrdersSubNav;
