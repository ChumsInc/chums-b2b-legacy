import React, {ChangeEvent, useEffect, useId, useState} from 'react';
import {NEW_CART} from "../../../constants/orders";
import {SalesOrderHeader} from "b2b-types";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useSelector} from "react-redux";
import {selectCartsList} from "../selectors";
import Box from "@mui/material/Box";

const checkHasCart = (list:SalesOrderHeader[], cartNo:string) => {
    return cartNo === NEW_CART || list.filter(so => so.SalesOrderNo === cartNo).length > 0;
}

const CartSelect = ({cartNo = '', shipToCode, onChange, excludeCartNo}: {
    cartNo: string;
    shipToCode?: string;
    onChange: (value:string) => void;
    excludeCartNo?: string;
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
                {cartList.map(so => (
                    <MenuItem key={so.SalesOrderNo} value={so.SalesOrderNo}
                              disabled={so.SalesOrderNo === excludeCartNo}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                            <div>{so.CustomerPONo}</div>
                            <div>[{so.ShipToCode}] {so.ShipToName}</div>
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default CartSelect;
