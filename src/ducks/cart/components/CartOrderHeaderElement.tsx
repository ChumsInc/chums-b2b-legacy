import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {selectSalesOrderHeader, selectSalesOrderInvoices, selectSOLoading} from "@/ducks/salesOrder/selectors";
import LinearProgress from "@mui/material/LinearProgress";
import {Button, Fade, TextField} from "@mui/material";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import {addressFromShipToAddress, multiLineAddress} from "@/ducks/customer/utils";
import {selectCurrentCustomer} from "@/ducks/user/selectors";
import {useAppDispatch} from "@/app/configureStore";
import {loadSalesOrder} from "@/ducks/salesOrder/actions";
import {Editable, SalesOrderHeader} from "b2b-types";
import {selectShippingAccount} from "@/ducks/cart/selectors";
import CustomerShippingAccountControl from "@/ducks/cart/components/CustomerShippingAccountControl";
import {
    CartProgress,
    cartProgress_Cart,
    cartProgress_Confirm,
    cartProgress_Delivery,
    cartProgress_Payment, nextCartProgress
} from "@/types/cart";
import ShipDateInput from "@/ducks/cart/components/ShipDateInput";
import {minShipDate} from "@/utils/orders";
import ShippingMethodSelect from "@/components/ShippingMethodSelect";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Unstable_Grid2';
import ShipToSelect from "@/ducks/customer/components/ShipToSelect";
import CheckoutProgress from "@/components/CheckoutProgress";
import CartCheckoutProgress from "@/ducks/cart/components/CartCheckoutProgress";
import CartPaymentSelect from "@/ducks/cart/components/CartPaymentSelect";
import CheckoutButton from "@/ducks/cart/components/CheckoutButton";

const CartOrderHeaderElement = () => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCurrentCustomer);
    const header = useSelector(selectSalesOrderHeader);
    const invoices = useSelector(selectSalesOrderInvoices);
    const loading = useSelector(selectSOLoading);
    const shippingAccount = useSelector(selectShippingAccount);
    const shipDateRef = useRef<HTMLInputElement>();
    const shipMethodRef = useRef<HTMLDivElement|null>(null);
    const paymentMethodRef = useRef<HTMLInputElement>();
    const customerPORef = useRef<HTMLInputElement>();

    const [cartHeader, setCartHeader] = useState<(SalesOrderHeader & Editable) | null>(header);
    const [cartProgress, setCartProgress] = useState<CartProgress>(cartProgress_Cart);

    useEffect(() => {
        if (!header) {
            setCartHeader(null);
            return;
        }
        setCartHeader({...header, ShipExpireDate: minShipDate()});
    }, [header]);

    useEffect(() => {
        switch (cartProgress) {
            case cartProgress_Delivery:
                // shipDateRef.current?.focus();
                return;
            case cartProgress_Payment:
                // paymentMethodRef.current?.focus();
                return;
        }

    }, [cartProgress]);

    if (!customer || !header) {
        return null;
    }


    const hasCancelDate = cartHeader?.UDF_CANCEL_DATE ? dayjs(cartHeader?.UDF_CANCEL_DATE).valueOf() > 0 : false;
    const cancelDate = hasCancelDate ? dayjs(cartHeader?.UDF_CANCEL_DATE).format('YYYY-MM-DD') : '';
    const orderDate = cartHeader?.OrderDate ? dayjs(cartHeader.OrderDate).format('YYYY-MM-DD') : '';
    const shipDate = cartHeader?.ShipExpireDate ? dayjs(cartHeader.ShipExpireDate).format('YYYY-MM-DD') : '';

    const beginCheckoutHandler = () => {
        setCartProgress(cartProgress_Delivery);
        if (!cartHeader?.ShipVia) {
            shipMethodRef.current?.focus();
        }
    }

    const confirmDelivery = () => {
        setCartProgress(cartProgress_Payment);
        if (!cartHeader?.CustomerPONo) {
            customerPORef.current?.focus();
        }
    }

    const changeHandler = (field: keyof SalesOrderHeader) => (ev: ChangeEvent<HTMLInputElement>) => {
        if (!cartHeader) {
            return;
        }
        switch (field) {
            case 'CustomerPONo':
            case 'UDF_PROMO_DEAL':
                setCartHeader({...cartHeader, [field]: ev.target.value, changed: true});
                return;

        }
    }

    const valueChangeHandler = (field: keyof SalesOrderHeader) => (value: string | null) => {
        if (!cartHeader) {
            return;
        }
        switch (field) {
            case 'ShipVia':
            case 'ShipExpireDate':
            case 'ShipToCode':
            case 'PaymentType':
                setCartHeader({...cartHeader, [field]: value ?? ''});
        }
    }

    const reloadHandler = () => {
        setCartProgress(cartProgress_Cart);
        if (!customer || !header) {
            return;
        }
        dispatch(loadSalesOrder(header?.SalesOrderNo))
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (cartProgress < cartProgress_Confirm) {
            const next = nextCartProgress(cartProgress);
            setCartProgress(next);
            return;
        }
        console.log('submit here.')
    }

    return (
        <form onSubmit={submitHandler}>
            {loading && <LinearProgress variant="indeterminate" sx={{my: 1}}/>}
            <Grid container spacing={2}>
                <Grid xs={12} lg={6}>
                    <Stack spacing={2} direction="column">
                        <Stack spacing={2} direction={{xs: 'column', lg: 'row'}}>
                            <TextField label="Cart Created" type="date" fullWidth variant="filled" size="small"
                                       value={orderDate} placeholder=""
                                       inputProps={{readOnly: true}}/>
                            <TextField label="Cart Expires" type="date" size="small" variant="filled" fullWidth
                                       value={dayjs(header?.ShipExpireDate).format('YYYY-MM-DD')}
                                       inputProps={{readOnly: true}}/>
                        </Stack>
                        <TextField label="Cart Name" type="text" fullWidth variant="filled" size="small"
                                   value={header?.CustomerPONo ?? ''} required
                                   inputProps={{ref: customerPORef}}/>
                        <TextField label="Promo Code" type="text" fullWidth
                                   value={cartHeader?.UDF_PROMO_DEAL ?? ''} onChange={changeHandler('UDF_PROMO_DEAL')}
                                   variant="filled" size="small"/>
                    </Stack>
                </Grid>
                <Grid xs={12} lg={6}>
                    <Stack spacing={2} direction="column">
                        <ShipToSelect value={cartHeader?.ShipToCode || ''} defaultName="Default Address"
                                      onChange={valueChangeHandler('ShipToCode')}/>
                        <TextField label="Delivery Address" type="text" multiline variant="filled" size="small"
                                   value={multiLineAddress(addressFromShipToAddress(cartHeader), true).join('\n')}
                                   inputProps={{readOnly: true}}/>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid xs={12} lg={6}>
                    <Fade in={cartProgress >= cartProgress_Delivery}>
                        <Stack spacing={2} direction="column">
                            <ShipDateInput value={cartHeader?.ShipExpireDate ?? ''}
                                           onChange={valueChangeHandler('ShipExpireDate')}
                                           inputProps={{ref: shipDateRef, required: true}}/>
                            <Stack spacing={2} direction={{xs: 'column', md: 'row'}}>
                                <ShippingMethodSelect value={cartHeader?.ShipVia ?? ''} required
                                                      // ref={shipMethodRef}
                                                      onChange={valueChangeHandler('ShipVia')}/>
                                <CustomerShippingAccountControl/>
                            </Stack>
                        </Stack>
                    </Fade>
                </Grid>
                <Grid xs={12} lg={6}>
                    <Fade in={cartProgress >= cartProgress_Payment}>
                        <Stack spacing={2} direction="column">
                            {/*<CartPaymentSelect value={cartHeader?.PaymentType ?? ''}*/}
                            {/*                   inputProps={{ref: paymentMethodRef}}*/}
                            {/*                   onChange={valueChangeHandler('PaymentType')}/>*/}
                            <TextField label="Purchase Order No" type="text" fullWidth variant="filled" size="small"
                                       value={header?.CustomerPONo ?? ''} required/>
                        </Stack>
                    </Fade>
                </Grid>
            </Grid>
            <CartCheckoutProgress current={cartProgress} onChange={setCartProgress}/>
            <Stack spacing={2} direction={{sm: 'column', md: 'row'}} sx={{justifyContent: 'flex-end'}}>
                <CheckoutButton cartProgress={cartProgress}/>
                <Button type="button" variant="text" onClick={reloadHandler}>Reload</Button>
            </Stack>

        </form>
    )
}

export default CartOrderHeaderElement;
