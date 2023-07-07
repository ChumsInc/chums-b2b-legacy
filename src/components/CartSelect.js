import React from 'react';
import {NEW_CART} from "../constants/orders";

const CartSelect = ({cartList, cartNo = '', onChange}) => {
    // console.log({cartList});
    return (
        <select className="form-select form-select-sm" value={cartNo} onChange={onChange}>
            <option value={NEW_CART}>New Cart</option>
            {cartList.map(so => (<option key={so.SalesOrderNo} value={so.SalesOrderNo} title={`Cart #${so.SalesOrderNo}`}>{so.CustomerPONo}</option>))}
        </select>
    )
};

export default CartSelect;
