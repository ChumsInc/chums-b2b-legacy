import React from 'react';
import {useSelector} from "react-redux";
import {PATH_SALES_ORDER} from "../../../constants/paths";
import {Link} from "react-router-dom";
import numeral from 'numeral';
import {ORDER_TYPE} from "../../../constants/orders";
import {selectCurrentCustomer, selectLoggedIn} from "../../user/selectors";
import {selectCartLoading, selectCartName, selectCartNo, selectCartQuantity, selectCartTotal} from "../selectors";
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from "@mui/material/LinearProgress";
import {isCustomer} from "../../user/utils";

const CartIndicator = () => {
    const loggedIn = useSelector(selectLoggedIn);
    const customer = useSelector(selectCurrentCustomer);
    const cartName = useSelector(selectCartName);
    const cartNo = useSelector(selectCartNo);
    const cartTotal = useSelector(selectCartTotal);
    const cartQuantity = useSelector(selectCartQuantity);
    const loading = useSelector(selectCartLoading);

    if (!loggedIn || !isCustomer(customer)) {
        return (
            <div className="nav-link mx-3 cart-icon">
                <span className="bi-person-square"/>
            </div>
        )
    }
    if (!cartNo) {
        return (
            <div className="nav-link mx-3 text-warning" title="No cart!">
                <span className="bi-bag"/>
            </div>
        )
    }

    const path = PATH_SALES_ORDER
        .replace(':orderType', ORDER_TYPE.cart)
        .replace(':Company', 'chums')
        .replace(':SalesOrderNo', encodeURIComponent(cartNo));
    return (
        <Link to={path} className="nav-link cart-icon">
            <Tooltip title={cartName} placement="bottom-end" arrow>
                <div>
                    <span className="bi-bag-fill ms-1"/>
                    {!!cartQuantity && <span className="ms-1">({numeral(cartQuantity).format('0,0')})</span>}
                    {!!cartTotal && (<span className="ms-1">{numeral(cartTotal).format('$0,0.00')}</span>)}
                </div>
            </Tooltip>
            {loading && <LinearProgress variant="indeterminate" sx={{height: '1px'}}/>}
        </Link>
    )
}

export default CartIndicator;
