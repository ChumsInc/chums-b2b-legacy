import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CartSelect from "./CartSelect";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import {newCart, saveCartItem, saveNewCart, setCurrentCart, updateCart} from "../ducks/cart/actions";
import FormGroup from "../common-components/FormGroup";
import CartQuantityInput from "./CartQuantityInput";
import ProgressBar from "./ProgressBar";
import Alert from "../common-components/Alert";
import {NEW_CART} from "../constants/orders";
import {selectCartsList, selectCartsLoading} from "../ducks/carts/selectors";
import {
    selectCartLoading,
    selectCartMessage,
    selectCartName,
    selectCartNo,
    selectItemAvailabilityLoading
} from "../ducks/cart/selectors";
import {
    selectCustomerPermissions,
    selectCustomerPermissionsLoaded,
    selectCustomerPermissionsLoading
} from "../selectors/user";
import ShipToSelect from "./ShipToSelect";
import {loadCustomerPermissions} from "../actions/user";


const AddToCartForm = ({
                           itemCode,
                           quantity,
                           comment,
                           setGlobalCart,
                           season_code,
                           season_available,
                           disabled,
                           onDone,
                           onChangeQuantity
                       }) => {
    const dispatch = useDispatch();
    const cartsList = useSelector(selectCartsList);
    const cartsLoading = useSelector(selectCartsLoading);
    const cartNo = useSelector(selectCartNo);
    const cartName = useSelector(selectCartName);
    const loading = useSelector(selectCartLoading);
    const cartMessage = useSelector(selectCartMessage);
    const permissions = useSelector(selectCustomerPermissions);
    const permissionsLoading = useSelector(selectCustomerPermissionsLoading);
    const permissionsLoaded = useSelector(selectCustomerPermissionsLoaded);
    const availabilityLoading = useSelector(selectItemAvailabilityLoading);

    const [_comment, setComment] = useState(comment ?? '');
    const [_cartName, setCartName] = useState(cartName ?? '');
    const [_cartNo, setCartNo] = useState(cartNo ?? '');
    const [shipToCode, setShipToCode] = useState('');

    useEffect(() => {
        if (!permissions && !permissionsLoading) {
            dispatch(loadCustomerPermissions());
        }
    },[])
    useEffect(() => {
        setCartName(cartName ?? '');
        setCartNo(cartNo ?? '');
        setComment(comment ?? '');
    }, [cartNo, cartName, comment]);

    useEffect(() => {
        if (permissions?.billTo) {
            setShipToCode('');
        }
        setShipToCode(permissions?.shipTo[0] ?? '');
    }, [permissions])

    const cartChangeHandler = (ev) => {
        const value = ev.target.value;
        if (value === NEW_CART && setGlobalCart) {
            dispatch(newCart());
            return;
        }
        const [cart] = cartsList.filter(so => so.SalesOrderNo === value);
        if (cart && setGlobalCart) {
            dispatch(setCurrentCart(cart));
            return;
        }
        console.log(value, cart);
        setCartNo(value);
        setCartName(value === NEW_CART ? '' : cart.CustomerPONo);
        setShipToCode(value === NEW_CART ? '' : cart.ShipToCode);
    }

    const onChangeCartName = ({value}) => {
        setCartName(value)
    }

    const quantityChangeHandler = (quantity) => {
        onChangeQuantity(Number(quantity));
    }

    const submitHandler = (ev) => {
        ev.preventDefault();
        if (disabled) {
            return;
        }
        let comment = '';
        if (!!season_code && !season_available) {
            comment = [`PRE-SEASON ITEM: ${season_code}`, _comment].filter(val => !!val).join('; ');
        }
        if (!!_cartNo && _cartNo !== NEW_CART) {
            dispatch(saveCartItem({
                SalesOrderNo: _cartNo,
                ItemCode: itemCode,
                QuantityOrdered: quantity,
                CommentText: comment,
            }));
            onDone();
            return;
        }
        dispatch(saveNewCart({
            cartName: _cartName,
            itemCode,
            quantity,
            comment,
            shipToCode,
        }));
        onDone();
    }

    return (
        <form onSubmit={submitHandler} className="add-to-cart" method="post">
            {availabilityLoading && <ProgressBar striped label="Checking Availability" />}
            <FormGroup colWidth={8} label="Select Cart">
                <CartSelect cartList={cartsList} cartNo={_cartNo} onChange={cartChangeHandler}/>
            </FormGroup>
            {(!_cartNo || _cartNo === NEW_CART) && (
                <>
                    <FormGroupTextInput colWidth={8} label="Cart Name" onChange={onChangeCartName} value={_cartName}
                                        required helpText="Please name your cart."/>
                    <FormGroup colWidth={8} label="Ship To">
                        <ShipToSelect value={shipToCode} onChange={code => setShipToCode(code)} />
                    </FormGroup>
                </>
            )}
            <FormGroup colWidth={8} label="Quantity">
                <CartQuantityInput quantity={quantity} onChange={quantityChangeHandler}
                                   disabled={disabled}
                                   onAddToCart={submitHandler}/>
            </FormGroup>
            {loading && <ProgressBar striped height={5}/>}
            {!!cartMessage && <Alert type="alert-success">{cartMessage ?? null}</Alert>}
        </form>
    );
}

export default AddToCartForm;
