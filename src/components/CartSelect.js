import React from 'react';
import Select from '../common-components/Select';
import {NEW_CART} from "../constants/orders";

const CartSelect = ({cartList, cartNo = '', onChange}) => {
    // console.log({cartList});
    return (
        <Select value={cartNo} onChange={({field, value}) => onChange({field, value})} field="cartNo">
            <option value={NEW_CART}>New Cart</option>
            {cartList.map(so => (<option key={so.SalesOrderNo} value={so.SalesOrderNo}>{so.CustomerPONo}</option>))}
        </Select>
    )
};

export default CartSelect;
