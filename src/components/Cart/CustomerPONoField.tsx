import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectCartProgress} from "../../selectors/cart";
import {selectIsCart, selectSalesOrderHeader} from "../../selectors/salesOrder";
import {isSalesOrderHeader} from "../../utils/typeguards";
import {TextInputChangeHandler} from "../../generic-types";
import {updateCart} from "../../actions/cart";
import {CART_PROGRESS_STATES} from "../../constants/orders";
import Alert from "../../common-components/Alert";
import FormGroupTextInput from "../../common-components/FormGroupTextInput";


const CustomerPONoField = () => {
    const dispatch = useDispatch();
    const cartProgress = useSelector(selectCartProgress);
    const orderHeader = useSelector(selectSalesOrderHeader);
    const isCart = useSelector(selectIsCart);

    const poLabel = isCart && cartProgress < CART_PROGRESS_STATES.payment ? 'Cart Name' : 'Purchase Order #';

    if (!isSalesOrderHeader(orderHeader)) {
        return null;
    }
    const changeHandler = ({value}:TextInputChangeHandler) => {
        if (isCart) {
            dispatch(updateCart({CustomerPONo: value}));
        }
    }
    return (
        <FormGroupTextInput colWidth={8} label={poLabel} onChange={changeHandler}
                            maxLength={30} required
                            value={orderHeader.CustomerPONo ?? ''} field="CustomerPONo" readOnly={!isCart}>
            {!orderHeader.CustomerPONo && (<Alert message="A cart name is required"/>)}
        </FormGroupTextInput>
    )
}

export default CustomerPONoField;
