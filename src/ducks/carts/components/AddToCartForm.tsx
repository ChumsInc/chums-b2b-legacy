import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import CartSelect from "@/components/CartSelect";
import FormGroupTextInput from "@/common-components/FormGroupTextInput";
import {newCart, saveCartItem, saveNewCart, setCurrentCart} from "@/ducks/cart/actions";
import FormGroup from "@/common-components/FormGroup";
import CartQuantityInput from "@/components/CartQuantityInput";
import ProgressBar from "@/components/ProgressBar";
import Alert from "@mui/material/Alert";
import {NEW_CART} from "@/constants/orders";
import {selectCartsList, selectCartsLoading} from "@/ducks/carts/selectors";
import {
    selectCartLoading,
    selectCartMessage,
    selectCartName,
    selectCartNo,
    selectItemAvailabilityLoading
} from "@/ducks/cart/selectors";
import {
    selectCustomerPermissions,
    selectCustomerPermissionsLoaded,
    selectCustomerPermissionsLoading
} from "@/ducks/customer/selectors";
import ShipToSelect from "@/ducks/customer/components/ShipToSelect";
import {loadCustomerPermissions} from "@/ducks/customer/actions";
import {selectCurrentCustomer} from "@/ducks/user/selectors";
import {useAppDispatch} from "@/app/configureStore";
import {FieldValue} from "@/types/generic";


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
                       }: {
    itemCode: string;
    quantity: number;
    comment?: string;
    setGlobalCart?: boolean;
    season_code?: string | null;
    season_available?: boolean | null;
    disabled?: boolean;
    onDone: () => void;
    onChangeQuantity: (val: number) => void;
}) => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCurrentCustomer);
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

    const [_comment, setComment] = useState<string>(comment ?? '');
    const [_cartName, setCartName] = useState<string>(cartName ?? '');
    const [_cartNo, setCartNo] = useState<string>(cartNo ?? '');
    const [shipToCode, setShipToCode] = useState<string>('');

    useEffect(() => {
        if (!permissions && !permissionsLoading) {
            dispatch(loadCustomerPermissions(customer));
        }
    }, [])
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

    const cartChangeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const value = ev.target.value;
        if (value === NEW_CART && setGlobalCart) {
            dispatch(newCart());
            return;
        }
        const [cart] = cartsList.filter(so => so.SalesOrderNo === value);
        if (cart && setGlobalCart) {
            dispatch(setCurrentCart(cart.SalesOrderNo));
            return;
        }
        console.log(value, cart);
        setCartNo(value);
        setCartName(value === NEW_CART ? '' : cart.CustomerPONo ?? '');
        setShipToCode(value === NEW_CART ? '' : cart.ShipToCode ?? '');
    }

    const onChangeCartName = ({value}: FieldValue) => {
        setCartName(value)
    }

    const quantityChangeHandler = (quantity: number) => {
        onChangeQuantity(quantity);
    }

    const submitHandler = (ev: FormEvent) => {
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
            {availabilityLoading && <ProgressBar striped label="Checking Availability"/>}
            <FormGroup colWidth={8} label="Select Cart">
                <CartSelect cartList={cartsList} cartNo={_cartNo} onChange={cartChangeHandler}/>
            </FormGroup>
            {(!_cartNo || _cartNo === NEW_CART) && (
                <>
                    <FormGroupTextInput colWidth={8} label="Cart Name" onChange={onChangeCartName} value={_cartName}
                                        required helpText="Please name your cart."/>
                    <FormGroup colWidth={8} label="Ship To">
                        <ShipToSelect value={shipToCode} onChange={code => setShipToCode(code)}/>
                    </FormGroup>
                </>
            )}
            <FormGroup colWidth={8} label="Quantity">
                <div className="row g-3">
                    <div className="col">
                        <CartQuantityInput quantity={quantity} onChange={quantityChangeHandler}
                                           disabled={disabled} required/>
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-sm btn-primary" disabled={disabled || quantity === 0}>
                            <span className="me-3">Add to cart</span><span className="bi-bag-fill" title="Add to cart"/>
                        </button>
                    </div>
                </div>

            </FormGroup>
            {loading && <ProgressBar striped height={5}/>}
            {!!cartMessage && <Alert severity="success">{cartMessage}</Alert>}
        </form>
    );
}

export default AddToCartForm;
