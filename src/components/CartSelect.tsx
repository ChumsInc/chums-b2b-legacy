import React, {ChangeEvent, useEffect, useId, useState} from 'react';
import {NEW_CART} from "../constants/orders";
import {SalesOrderHeader} from "b2b-types";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useSelector} from "react-redux";
import {selectCartsList} from "@/ducks/carts/selectors";

const checkHasCart = (list:SalesOrderHeader[], cartNo:string) => {
    return cartNo === NEW_CART || list.filter(so => so.SalesOrderNo === cartNo).length > 0;
}
const CartSelect = ({cartNo = '', onChange}: {
    cartNo: string;
    onChange: (value:string) => void;
}) => {
    const id = useId();
    const cartList = useSelector(selectCartsList);
    const [hasCart, setHasCart] = useState(checkHasCart(cartList, cartNo));

    useEffect(() => {
        setHasCart(checkHasCart(cartList, cartNo));
    }, [cartNo, cartList]);

    const changeHandler = (ev:SelectChangeEvent) => {
        onChange(ev.target.value);
    }

    if (!cartList.length) {
        return null;
    }
    return (
        <FormControl fullWidth size="small" variant="filled">
            <InputLabel id={id}>Cart</InputLabel>
            <Select labelId={id} value={cartNo}
                    onChange={changeHandler} label="Cart">
                <MenuItem value={NEW_CART}>New Cart</MenuItem>
                {!hasCart && <MenuItem value={cartNo}>{cartNo}</MenuItem>}
                {cartList.map(so => (
                    <MenuItem key={so.SalesOrderNo} value={so.SalesOrderNo}>{so.CustomerPONo}</MenuItem>
                ))}
            </Select>
            {/*<select className="form-select form-select-sm" value={cartNo} onChange={onChange}>*/}
            {/*    <option value={NEW_CART}>New Cart</option>*/}
            {/*    {cartList.map(so => (<option key={so.SalesOrderNo} value={so.SalesOrderNo}*/}
            {/*                                 title={`Cart #${so.SalesOrderNo}`}>{so.CustomerPONo}</option>))}*/}
            {/*</select>*/}
        </FormControl>
    )
};

export default CartSelect;
