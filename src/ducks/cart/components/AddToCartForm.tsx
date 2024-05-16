import React, {FormEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {addToCart, saveNewCart, setCurrentCart} from "../actions";

import Alert from "@mui/material/Alert";
import {NEW_CART} from "../../../constants/orders";
import {selectCartsList} from "../../open-orders/selectors";
import {
    selectCartLoading,
    selectCartMessage,
    selectCartName,
    selectCartNo,
    selectItemAvailabilityLoading
} from "../selectors";
import {
    selectCustomerAccount,
    selectCustomerPermissions,
    selectCustomerPermissionsLoading,
    selectCustomerShipToCode
} from "../../customer/selectors";
import ShipToSelect from "../../customer/components/ShipToSelect";
import {loadCustomerPermissions} from "../../customer/actions";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import CartNameInput from "./CartNameInput";
import AddToCartButton from "./AddToCartButton";
import {useAppDispatch} from "../../../app/configureStore";
import ProgressBar from "../../../components/ProgressBar";
import CartSelect from "../../open-orders/components/CartSelect";
import CartQuantityInput from "../../../components/CartQuantityInput";
import {CartProduct, ShipToAddress} from "b2b-types";
import Decimal from "decimal.js";

const AddToCartForm = ({
                           cartItem,
                           quantity,
                           unitOfMeasure,
                           comment,
                           setGlobalCart,
                           season_code,
                           season_available,
                           disabled,
                           onDone,
                           onChangeQuantity,
                           excludeSalesOrder,
                           afterAddToCart,
                       }: {
    cartItem: CartProduct;
    quantity: number;
    unitOfMeasure: string;
    comment?: string;
    setGlobalCart?: boolean;
    season_code?: string | null;
    season_available?: boolean | null;
    disabled?: boolean;
    onDone: () => void;
    onChangeQuantity: (val: number) => void;
    excludeSalesOrder?: string;
    afterAddToCart?: (message: string) => void;
}) => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCustomerAccount);
    const cartsList = useSelector(selectCartsList);
    const cartNo = useSelector(selectCartNo);
    const cartName = useSelector(selectCartName);
    const loading = useSelector(selectCartLoading);
    const cartMessage = useSelector(selectCartMessage);
    const permissions = useSelector(selectCustomerPermissions);
    const permissionsLoading = useSelector(selectCustomerPermissionsLoading);
    const availabilityLoading = useSelector(selectItemAvailabilityLoading);
    const currentShipToCode = useSelector(selectCustomerShipToCode);

    const [_comment, setComment] = useState<string>(comment ?? '');
    const [localCartName, setLocalCartName] = useState<string>(cartName ?? '');
    const [localCartNo, setLocalCartNo] = useState<string>(cartNo ?? '');
    const [shipToCode, setShipToCode] = useState<string>(currentShipToCode ?? '');

    useEffect(() => {
        if (!permissions && !permissionsLoading) {
            dispatch(loadCustomerPermissions(customer));
        }
    }, [customer, dispatch, permissions, permissionsLoading])

    useEffect(() => {
        let shipToCode = currentShipToCode;
        if (!shipToCode) {
            if (permissions?.billTo) {
                setShipToCode(customer?.PrimaryShipToCode ?? '');
            } else {
                setShipToCode(permissions?.shipTo[0] ?? '');
            }

        }
        setShipToCode(shipToCode ?? '');
    }, [currentShipToCode, customer, permissions]);

    useEffect(() => {
        setLocalCartName(cartName ?? '');
        setLocalCartNo(cartNo ?? '');
        setComment(comment ?? '');
    }, [cartNo, cartName, comment]);


    const cartChangeHandler = (value: string) => {
        if (value === NEW_CART && setGlobalCart) {
            setLocalCartName('');
            setLocalCartNo(value);
            // dispatch(newCart());
            return;
        }
        const [cart] = cartsList.filter(so => so.SalesOrderNo === value);
        if (cart && setGlobalCart) {
            dispatch(setCurrentCart(cart.SalesOrderNo));
            return;
        }
        console.log(value, cart);
        setLocalCartNo(value);
        setLocalCartName(value === NEW_CART ? '' : cart.CustomerPONo ?? '');
        setShipToCode(value === NEW_CART ? '' : cart.ShipToCode ?? '');
    }

    const onChangeCartName = (value: string) => {
        setLocalCartName(value)
    }

    const quantityChangeHandler = (quantity: number) => {
        onChangeQuantity(quantity);
    }

    const shipToCodeChangeHandler = (code: string | null, address: ShipToAddress | null) => {
        console.log('shipToCodeChangeHandler', code, address);
        setShipToCode(code ?? '')
    }

    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        if (disabled) {
            return;
        }
        let comment = '';
        if (!!season_code && !(season_available || cartItem.seasonAvailable)) {
            comment = [`PRE-SEASON ITEM: ${season_code}`, _comment].filter(val => !!val).join('; ');
        }
        if (global?.window?.gtag) {
            const price = !!cartItem.price ? new Decimal(cartItem.price).toNumber() : undefined;
            const value = !!cartItem.price ? new Decimal(cartItem.price).times(quantity).toNumber() : undefined;
            global.window.gtag('event', 'add_to_cart', {
                currency: 'USD',
                value: value,
                items: [{item_id: cartItem.itemCode, item_name: cartItem.name, price: price, quantity}]
            })
        }
        if (!!localCartNo && localCartNo !== NEW_CART) {
            await dispatch(addToCart({
                salesOrderNo: localCartNo,
                itemCode: cartItem.itemCode,
                quantity,
                comment,
            }));
            onDone();
            if (afterAddToCart) {
                afterAddToCart(`Added to cart: ${cartItem.itemCode}; quantity: ${cartItem.quantity} ${cartItem.salesUM}`);
            }
            return;
        }
        await dispatch(saveNewCart({
            cartName: localCartName,
            itemCode: cartItem.itemCode,
            quantity,
            comment,
            shipToCode,
        }));
        onDone();
    }

    return (
        <form onSubmit={submitHandler} className="add-to-cart" method="post">
            {availabilityLoading && <ProgressBar striped label="Checking Availability"/>}
            <Stack spacing={2} direction="column">
                <CartSelect cartNo={localCartNo} shipToCode={shipToCode} onChange={cartChangeHandler}
                            excludeCartNo={excludeSalesOrder}/>
                {(!localCartNo || localCartNo === NEW_CART) && (
                    <Stack spacing={2} direction="row">
                        <CartNameInput value={localCartName} onChange={onChangeCartName}
                                       error={!localCartName}
                                       fullWidth
                                       helperText="Please name your cart."/>
                        <ShipToSelect value={shipToCode}
                                      onChange={shipToCodeChangeHandler}/>
                    </Stack>
                )}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <CartQuantityInput quantity={quantity} onChange={quantityChangeHandler}
                                       unitOfMeasure={unitOfMeasure}
                                       disabled={disabled} required/>
                    <AddToCartButton disabled={disabled || !quantity || loading}/>
                </Stack>
                {loading && <LinearProgress variant="indeterminate"/>}
                {!!cartMessage && <Alert severity="success">{cartMessage}</Alert>}
            </Stack>
        </form>
    );
}

export default AddToCartForm;
