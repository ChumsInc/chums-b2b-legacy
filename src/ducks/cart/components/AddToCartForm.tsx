import React, {FormEvent, useEffect, useId, useState} from 'react';
import {useSelector} from 'react-redux';
import {addToCart, saveNewCart, setCurrentCart} from "../actions";

import Alert from "@mui/material/Alert";
import {NEW_CART} from "../../../constants/orders";
import {selectCartsList, selectOpenOrdersLoading} from "../../open-orders/selectors";
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
    selectCustomerPermissionsLoaded,
    selectCustomerPermissionsLoading
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
import {ShipToAddress} from "b2b-types";

const AddToCartForm = ({
                           itemCode,
                           quantity,
                           comment,
                           setGlobalCart,
                           season_code,
                           season_available,
                           disabled,
                           onDone,
                           onChangeQuantity,
                           excludeSalesOrder,
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
    excludeSalesOrder?: string;
}) => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCustomerAccount);
    const cartsList = useSelector(selectCartsList);
    const cartsLoading = useSelector(selectOpenOrdersLoading);
    const cartNo = useSelector(selectCartNo);
    const cartName = useSelector(selectCartName);
    const loading = useSelector(selectCartLoading);
    const cartMessage = useSelector(selectCartMessage);
    const permissions = useSelector(selectCustomerPermissions);
    const permissionsLoading = useSelector(selectCustomerPermissionsLoading);
    const permissionsLoaded = useSelector(selectCustomerPermissionsLoaded);
    const availabilityLoading = useSelector(selectItemAvailabilityLoading);
    const cartNameId = useId();

    const [_comment, setComment] = useState<string>(comment ?? '');
    const [localCartName, setLocalCartName] = useState<string>(cartName ?? '');
    const [localCartNo, setLocalCartNo] = useState<string>(cartNo ?? '');
    const [shipToCode, setShipToCode] = useState<string>('');

    useEffect(() => {
        if (!permissions && !permissionsLoading) {
            dispatch(loadCustomerPermissions(customer));
        }
    }, [])

    useEffect(() => {
        setLocalCartName(cartName ?? '');
        setLocalCartNo(cartNo ?? '');
        setComment(comment ?? '');
    }, [cartNo, cartName, comment]);


    useEffect(() => {
        console.log('useEffect()[customer,permissions]', customer, permissions)
        if (permissions?.billTo) {
            setShipToCode(customer?.PrimaryShipToCode ?? '');
        } else {
            setShipToCode(permissions?.shipTo[0] ?? '');
        }
    }, [customer, permissions])

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

    const shipToCodeChangeHandler = (code: string, address: ShipToAddress | null) => {
        console.log('shipToCodeChangeHandler', code, address);
        setShipToCode(code)
    }

    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        if (disabled) {
            return;
        }
        let comment = '';
        if (!!season_code && !season_available) {
            comment = [`PRE-SEASON ITEM: ${season_code}`, _comment].filter(val => !!val).join('; ');
        }
        if (!!localCartNo && localCartNo !== NEW_CART) {
            await dispatch(addToCart({
                salesOrderNo: localCartNo,
                itemCode,
                quantity
            }));
            onDone();
            return;
        }
        await dispatch(saveNewCart({
            cartName: localCartName,
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
            <Stack spacing={2} direction="column">
                <CartSelect cartNo={localCartNo} onChange={cartChangeHandler} excludeCartNo={excludeSalesOrder}/>
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
                                       disabled={disabled} required/>
                    <AddToCartButton disabled={disabled || !quantity}/>
                </Stack>
                {loading && <LinearProgress variant="indeterminate"/>}
                {!!cartMessage && <Alert severity="success">{cartMessage}</Alert>}
            </Stack>
        </form>
    );
}

export default AddToCartForm;
