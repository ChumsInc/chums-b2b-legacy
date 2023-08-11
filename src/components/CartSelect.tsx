import React, {ChangeEvent} from 'react';
import {NEW_CART} from "../constants/orders";
import {SalesOrderHeader} from "b2b-types";

const CartSelect = ({cartList, cartNo = '', onChange}: {
    cartList: SalesOrderHeader[];
    cartNo: string;
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => void;
}) => {
    // console.log({cartList});
    return (
        <select className="form-select form-select-sm" value={cartNo} onChange={onChange}>
            <option value={NEW_CART}>New Cart</option>
            {cartList.map(so => (<option key={so.SalesOrderNo} value={so.SalesOrderNo}
                                         title={`Cart #${so.SalesOrderNo}`}>{so.CustomerPONo}</option>))}
        </select>
    )
};

export default CartSelect;
