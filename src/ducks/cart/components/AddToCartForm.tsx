import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from 'react';
import {useSelector} from 'react-redux';
import CartSelect from "@/components/CartSelect";
import FormGroupTextInput from "@/common-components/FormGroupTextInput";
import {addToCart, newCart, saveCartItem, saveNewCart, setCurrentCart} from "@/ducks/cart/actions";
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
    selectCustomerAccount,
    selectCustomerPermissions,
    selectCustomerPermissionsLoaded,
    selectCustomerPermissionsLoading
} from "@/ducks/customer/selectors";
import ShipToSelect from "@/ducks/customer/components/ShipToSelect";
import {loadCustomerPermissions} from "@/ducks/customer/actions";
import {selectCurrentCustomer} from "@/ducks/user/selectors";
import {useAppDispatch} from "@/app/configureStore";
import {FieldValue} from "@/types/generic";
import Stack from "@mui/material/Stack";
import {Button} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LinearProgress from "@mui/material/LinearProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CartNameInput from "@/ducks/cart/components/CartNameInput";
import AddToCartButton from "@/ducks/cart/components/AddToCartButton";

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
    const customer = useSelector(selectCustomerAccount);
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
    const cartNameId = useId();

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
            setShipToCode(customer?.PrimaryShipToCode ?? '');
        }
        setShipToCode(permissions?.shipTo[0] ?? '');
    }, [permissions])

    const cartChangeHandler = (value:string) => {
        if (value === NEW_CART && setGlobalCart) {
            setCartName('');
            setCartNo(value);
            // dispatch(newCart());
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

    const onChangeCartName = (value:string) => {
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
            dispatch(addToCart({
                itemCode,
                quantity
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
            <Stack spacing={2} direction="column">
                <CartSelect cartNo={_cartNo} onChange={cartChangeHandler}/>
                {(!_cartNo || _cartNo === NEW_CART) && (
                    <Stack spacing={2} direction="row">
                        <CartNameInput  value={_cartName} onChange={onChangeCartName}
                        fullWidth
                                        helperText="Please name your cart." />
                        <ShipToSelect value={shipToCode} onChange={code => setShipToCode(code)}/>
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
