import {useSelector} from "react-redux";
import {selectCartLoading, selectCartNo, selectCartQuantity, selectCartTotal} from "../../cart/selectors";
import {NEW_CART} from "../../../constants/orders";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CircularProgress from "@mui/material/CircularProgress";
import numeral from "numeral";
import React from "react";
import Tooltip from "@mui/material/Tooltip";

export default function CartIcon() {
    const currentCart = useSelector(selectCartNo);
    const cartQty = useSelector(selectCartQuantity);
    const cartLoading = useSelector(selectCartLoading);
    const cartTotal = useSelector(selectCartTotal);

    if (!currentCart || (currentCart === NEW_CART && cartQty === 0)) {
        return (
            <ShoppingCartOutlinedIcon fontSize="medium"/>
        )
    }

    return (
        <>
            <Tooltip title={`Cart #${currentCart}`}>
                <Box sx={{m: 1, position: 'relative'}}>
                    <Badge badgeContent={cartQty} color="primary"
                           anchorOrigin={{vertical: "bottom", horizontal: 'right'}}>
                        <ShoppingCartIcon fontSize="medium"/>
                    </Badge>
                    {cartLoading && <CircularProgress size={36} sx={{position: 'absolute', top: -6, left: -6, zIndex: 1}}/>}
                </Box>
            </Tooltip>
            <Box sx={{ml: 2}}>{numeral(cartTotal).format('$0,0')}</Box>
        </>
    )
}
