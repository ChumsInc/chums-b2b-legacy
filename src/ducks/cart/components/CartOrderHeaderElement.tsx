import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {
    selectSalesOrderHeader,
    selectSalesOrderInvoices,
    selectSendEmailStatus,
    selectSOLoading
} from "@/ducks/salesOrder/selectors";
import LinearProgress from "@mui/material/LinearProgress";
import {Button, Collapse, Fade, TextField} from "@mui/material";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import {addressFromShipToAddress, multiLineAddress} from "@/ducks/customer/utils";
import {selectCurrentCustomer} from "@/ducks/user/selectors";
import {useAppDispatch} from "@/app/configureStore";
import {loadSalesOrder, sendOrderEmail} from "@/ducks/salesOrder/actions";
import {Editable, SalesOrderHeader, ShipToAddress} from "b2b-types";
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
import {minShipDate, nextShipDate} from "@/utils/orders";
import ShippingMethodSelect from "@/components/ShippingMethodSelect";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Unstable_Grid2';
import ShipToSelect from "@/ducks/customer/components/ShipToSelect";
import CheckoutProgress from "@/components/CheckoutProgress";
import CartCheckoutProgress from "@/ducks/cart/components/CartCheckoutProgress";
import CartPaymentSelect from "@/ducks/cart/components/CartPaymentSelect";
import CheckoutButton from "@/ducks/cart/components/CheckoutButton";
import Paper from "@mui/material/Paper";
import {selectCustomerAccount} from "@/ducks/customer/selectors";
import {promoteCart, saveCart} from "@/ducks/cart/actions";
import SendEmailModal from "@/ducks/salesOrder/components/SendEmailModal";

const CartOrderHeaderElement = () => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCustomerAccount);
    const header = useSelector(selectSalesOrderHeader);
    const invoices = useSelector(selectSalesOrderInvoices);
    const loading = useSelector(selectSOLoading);
    const shippingAccount = useSelector(selectShippingAccount);
    const sendEmailStatus = useSelector(selectSendEmailStatus);
    const shipDateRef = useRef<HTMLInputElement|null>(null);
    const shipMethodRef = useRef<HTMLDivElement|null>(null);
    const paymentMethodRef = useRef<HTMLDivElement|null>(null);
    const customerPORef = useRef<HTMLInputElement>();

    const [cartHeader, setCartHeader] = useState<(SalesOrderHeader & Editable) | null>(header);
    const [cartProgress, setCartProgress] = useState<CartProgress>(cartProgress_Cart);

    const validateForm = (cartProgress:CartProgress):CartProgress => {
        console.log('cartProgress:', cartProgress);
        if (!cartHeader) {
            return cartProgress_Cart;
        }
        if (cartProgress >= cartProgress_Cart) {
            const shipExpireDate = dayjs(cartHeader.ShipExpireDate);
            if (!cartHeader.ShipExpireDate || !shipExpireDate.isValid() || shipExpireDate.isBefore(minShipDate())) {
                shipDateRef.current?.focus();
                return cartProgress_Delivery;
            }
            if (!cartHeader.ShipVia) {
                console.log(shipMethodRef.current);
                shipMethodRef.current?.focus();
                return cartProgress_Delivery;
            }
        }
        if (cartProgress >= cartProgress_Delivery) {
            if (!cartHeader.PaymentType) {
                paymentMethodRef.current?.focus();
                return cartProgress_Payment;
            }
            if (!cartHeader.CustomerPONo) {
                customerPORef.current?.focus();
                return cartProgress_Payment;
            }
        }
        return nextCartProgress(cartProgress);
    }

    useEffect(() => {
        if (!header) {
            setCartHeader(null);
            return;
        }
        setCartHeader({...header, ShipExpireDate: nextShipDate()});
    }, [header]);

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
            case 'PaymentType':
                setCartHeader({...cartHeader, [field]: value ?? '', changed: true});
        }
    }

    const shipToChangeHandler = (value:string|null, address: ShipToAddress|null) => {
        if (!cartHeader) {
            return;
        }
        if (!address) {
            setCartHeader({...cartHeader, ShipToCode: value, changed: true});
            return;
        }
        setCartHeader({...cartHeader, ShipToCode: value, ...address, changed: true});
    }

    const reloadHandler = () => {
        setCartProgress(cartProgress_Cart);
        if (!customer || !header) {
            return;
        }
        dispatch(loadSalesOrder(header?.SalesOrderNo))
    }

    const sendEmailHandler = () => {
        if (!cartHeader) {
            return;
        }
        dispatch(sendOrderEmail(cartHeader));
    }

    const saveCartHandler = () => {
        if (!customer || !cartHeader) {
            return;
        }
        dispatch(saveCart(cartHeader));
    }

    const submitHandler = (ev: FormEvent) => {
        if (!cartHeader) {
            return;
        }
        if (cartProgress < cartProgress_Confirm) {
            const next = validateForm(cartProgress);
            setCartProgress(next);
            return;
        }
        dispatch(promoteCart(cartHeader));
    }

    return (
        <Box component="div">
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
                                   value={cartHeader?.CustomerPONo ?? ''} required
                                   onChange={changeHandler("CustomerPONo")}
                                   inputProps={{ref: customerPORef}}/>
                        <TextField label="Promo Code" type="text" fullWidth
                                   value={cartHeader?.UDF_PROMO_DEAL ?? ''} onChange={changeHandler('UDF_PROMO_DEAL')}
                                   variant="filled" size="small"/>
                    </Stack>
                </Grid>
                <Grid xs={12} lg={6}>
                    <Stack spacing={2} direction="column">
                        <ShipToSelect value={cartHeader?.ShipToCode ?? customer.PrimaryShipToCode ?? ''} defaultName="Default Address"
                                      onChange={shipToChangeHandler}/>
                        <TextField label="Delivery Address" type="text" multiline variant="filled" size="small"
                                   value={multiLineAddress(addressFromShipToAddress(cartHeader), true).join('\n')}
                                   inputProps={{readOnly: true}}/>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid xs={12} lg={6}>
                    <Collapse in={cartProgress >= cartProgress_Delivery} collapsedSize={0}>
                        <Stack spacing={2} direction="column">
                            <ShipDateInput value={cartHeader?.ShipExpireDate ?? ''}
                                           error={!cartHeader?.ShipExpireDate || !dayjs(cartHeader.ShipExpireDate).isValid() || dayjs(cartHeader?.ShipExpireDate).isBefore(nextShipDate())}
                                           onChange={valueChangeHandler('ShipExpireDate')}
                                           inputProps={{required: true}} ref={shipDateRef} />
                            <Stack spacing={2} direction={{xs: 'column', md: 'row'}}>
                                <ShippingMethodSelect value={cartHeader?.ShipVia ?? ''} required error={!cartHeader?.ShipVia}
                                                      ref={shipMethodRef}
                                                      onChange={valueChangeHandler('ShipVia')}/>
                                <CustomerShippingAccountControl/>
                            </Stack>
                        </Stack>
                    </Collapse>
                </Grid>
                <Grid xs={12} lg={6}>
                    <Collapse in={cartProgress >= cartProgress_Payment} collapsedSize={0}>
                        <Stack spacing={2} direction="column">
                            <CartPaymentSelect value={cartHeader?.PaymentType ?? ''}  error={!cartHeader?.PaymentType}
                                               ref={paymentMethodRef} required
                                               onChange={valueChangeHandler('PaymentType')}/>
                            <TextField label="Purchase Order No" type="text" fullWidth variant="filled" size="small"
                                       error={!header.CustomerPONo}
                                       value={header?.CustomerPONo ?? ''} required/>
                        </Stack>
                    </Collapse>
                </Grid>
            </Grid>
            <CartCheckoutProgress current={cartProgress} onChange={setCartProgress}/>
            <Stack spacing={2} direction={{sm: 'column', md: 'row'}} sx={{justifyContent: 'flex-end'}}>

                <Button type="button" variant="text" onClick={saveCartHandler} disabled={loading} >
                    Save Cart
                </Button>

                <Button type="button" variant="text" onClick={reloadHandler} disabled={loading}>
                    Reload
                </Button>

                <Button type="button" variant="text" onClick={sendEmailHandler}
                        disabled={loading || sendEmailStatus !== 'idle'}>
                    Send Email
                </Button>

                <CheckoutButton cartProgress={cartProgress} onClick={submitHandler} disabled={loading}/>
            </Stack>
            <SendEmailModal />
        </Box>
    )
}

export default CartOrderHeaderElement;
