import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {Button, Collapse, TextField} from "@mui/material";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import {addressFromShipToAddress, multiLineAddress} from "../../customer/utils";
import {RootState, useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {loadSalesOrder} from "../../open-orders/actions";
import {Editable, SalesOrderHeader, ShipToAddress} from "b2b-types";
import {selectCartNo} from "../selectors";
import CustomerShippingAccountControl from "./CustomerShippingAccountControl";
import {
    CartProgress,
    cartProgress_Cart,
    cartProgress_Confirm,
    cartProgress_Delivery,
    cartProgress_Payment,
    nextCartProgress
} from "../../../types/cart";
import ShipDateInput from "./ShipDateInput";
import {minShipDate, nextShipDate} from "../../../utils/orders";
import ShippingMethodSelect from "../../../components/ShippingMethodSelect";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Unstable_Grid2';
import ShipToSelect from "../../customer/components/ShipToSelect";
import CartCheckoutProgress from "./CartCheckoutProgress";
import CartPaymentSelect from "./CartPaymentSelect";
import CheckoutButton from "./CheckoutButton";
import {selectCustomerAccount} from "../../customer/selectors";
import {promoteCart, saveCart, setCurrentCart} from "../actions";
import Alert from "@mui/material/Alert";
import DeleteCartButton from "./DeleteCartButton";
import {useMatch, useNavigate} from "react-router";
import {generatePath} from "react-router-dom";
import {customerSlug} from "../../../utils/customer";
import AlertList from "../../alerts/AlertList";
import {
    selectDetailChanged,
    selectSalesOrder,
    selectSalesOrderActionStatus,
    selectSalesOrderDetail
} from "../../open-orders/selectors";
import SendEmailButton from "../../open-orders/components/SendEmailButton";
import ItemAutocomplete from "../../item-lookup/ItemAutocomplete";
import CartCommentInput from "./CartCommentInput";
import Divider from "@mui/material/Divider";
import Decimal from "decimal.js";
import {sendGtagEvent} from "../../../api/gtag";
import CartHeader from "../../../components/Cart/CartHeader";

const CartOrderHeaderElement = () => {
    const dispatch = useAppDispatch();
    const match = useMatch('/account/:customerSlug/:orderType/:salesOrderNo');
    const customer = useSelector(selectCustomerAccount);
    const cartNo = useAppSelector(selectCartNo);
    const header = useAppSelector((state) => selectSalesOrder(state, match?.params.salesOrderNo ?? ''));
    const detail = useAppSelector((state) => selectSalesOrderDetail(state, match?.params.salesOrderNo ?? ''));
    const detailChanged = useAppSelector((state: RootState) => selectDetailChanged(state, header?.SalesOrderNo ?? ''));
    const loadingStatus = useAppSelector(state => selectSalesOrderActionStatus(state, match?.params.salesOrderNo ?? ''));
    const shipDateRef = useRef<HTMLInputElement | null>(null);
    const shipMethodRef = useRef<HTMLDivElement | null>(null);
    const paymentMethodRef = useRef<HTMLDivElement | null>(null);
    const customerPORef = useRef<HTMLInputElement>();
    const navigate = useNavigate();

    const [cartHeader, setCartHeader] = useState<(SalesOrderHeader & Editable) | null>(header);
    const [cartProgress, setCartProgress] = useState<CartProgress>(cartProgress_Cart);

    const validateForm = (cartProgress: CartProgress): CartProgress => {
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


    const orderDate = cartHeader?.OrderDate ? dayjs(cartHeader.OrderDate).format('YYYY-MM-DD') : '';

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

    const shipToChangeHandler = (value: string | null, address: ShipToAddress | null) => {
        if (!cartHeader) {
            return;
        }
        if (!address) {
            setCartHeader({...cartHeader, ShipToCode: value, changed: true});
            setCartProgress(cartProgress_Cart);
            return;
        }
        setCartHeader({...cartHeader, ShipToCode: value, ...address, changed: true});
        setCartProgress(cartProgress_Cart);
    }

    const reloadHandler = () => {
        setCartProgress(cartProgress_Cart);
        if (!customer || !header) {
            return;
        }
        dispatch(loadSalesOrder(header?.SalesOrderNo))
    }

    const saveCartHandler = () => {
        if (!customer || !cartHeader) {
            return;
        }
        dispatch(saveCart(cartHeader));
    }

    const submitHandler = async (ev: FormEvent) => {
        if (!cartHeader) {
            return;
        }
        if (cartProgress < cartProgress_Confirm) {
            const next = validateForm(cartProgress);
            switch (next) {
                case cartProgress_Delivery:
                    sendGtagEvent('begin_checkout', {
                        currency: "USD",
                        value: new Decimal(cartHeader.TaxableAmt).add(cartHeader.NonTaxableAmt).sub(cartHeader.DiscountAmt).toNumber(),
                        items: detail.map(item => ({item_id: item.ItemCode, item_name: item.ItemCodeDesc}))
                    });
                    break;
                case cartProgress_Payment:
                    sendGtagEvent( 'add_shipping_info', {
                        currency: "USD",
                        value: new Decimal(cartHeader.TaxableAmt).add(cartHeader.NonTaxableAmt).sub(cartHeader.DiscountAmt).toNumber(),
                        shipping_tier: cartHeader.ShipVia,
                        items: detail.map(item => ({item_id: item.ItemCode, item_name: item.ItemCodeDesc}))
                    })
                    break;
                case cartProgress_Confirm:
                    sendGtagEvent( 'add_payment_info', {
                        currency: "USD",
                        value: new Decimal(cartHeader.TaxableAmt).add(cartHeader.NonTaxableAmt).sub(cartHeader.DiscountAmt).toNumber(),
                        payment_type: cartHeader.PaymentType,
                        items: detail.map(item => ({item_id: item.ItemCode, item_name: item.ItemCodeDesc}))
                    })
                    break;
            }
            setCartProgress(next);
            return;
        }
        sendGtagEvent('purchase', {
            currency: "USD",
            value: new Decimal(cartHeader.TaxableAmt).add(cartHeader.NonTaxableAmt).sub(cartHeader.DiscountAmt).toNumber(),
            transaction_id: cartHeader.SalesOrderNo,
            items: detail.filter(item => item.ItemType !== '4').map(item => ({
                item_id: item.ItemCode,
                item_name: item.ItemCodeDesc,
                price: +item.UnitPrice,
                quantity: +item.QuantityOrdered,
            }))
        })
        await dispatch(promoteCart(cartHeader));
        navigate(generatePath('/account/:customerSlug/orders/:salesOrderNo', {
            customerSlug: customerSlug(customer),
            salesOrderNo: header.SalesOrderNo,
        }), {replace: true});
    }

    return (
        <Box component="div">
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
                        <ShipToSelect value={cartHeader?.ShipToCode ?? ''}
                                      disabled={loadingStatus !== 'idle'}
                                      defaultName="Default Address"
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
                                           disabled={loadingStatus !== 'idle'}
                                           error={!cartHeader?.ShipExpireDate || !dayjs(cartHeader.ShipExpireDate).isValid() || dayjs(cartHeader?.ShipExpireDate).isBefore(nextShipDate())}
                                           onChange={valueChangeHandler('ShipExpireDate')}
                                           inputProps={{required: true}} ref={shipDateRef}/>
                            <Stack spacing={2} direction={{xs: 'column', md: 'row'}}>
                                <ShippingMethodSelect value={cartHeader?.ShipVia ?? ''} required
                                                      disabled={loadingStatus !== 'idle'}
                                                      error={!cartHeader?.ShipVia}
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
                            <CartPaymentSelect value={cartHeader?.PaymentType ?? ''} error={!cartHeader?.PaymentType}
                                               ref={paymentMethodRef} required
                                               disabled={loadingStatus !== 'idle'}
                                               onChange={valueChangeHandler('PaymentType')}/>
                            <TextField label="Purchase Order No" type="text" fullWidth variant="filled" size="small"
                                       disabled={loadingStatus !== 'idle'}
                                       error={!header.CustomerPONo}
                                       value={header?.CustomerPONo ?? ''} required/>
                        </Stack>
                    </Collapse>
                </Grid>
            </Grid>
            <CartCheckoutProgress current={cartProgress} disabled={loadingStatus !== 'idle'}
                                  onChange={setCartProgress}/>
            <Stack spacing={2} direction={{sm: 'column', md: 'row'}} justifyContent="space-between">
                <Stack sx={{flex: '1 1 auto'}}>
                    {(detailChanged || cartHeader?.changed) && cartProgress === cartProgress_Cart && (
                        <Alert severity="warning">Don't forget to save your changes!</Alert>
                    )}
                </Stack>
                <Stack spacing={3} direction={{sm: 'column', md: 'row'}} sx={{justifyContent: 'flex-end'}}>
                    <DeleteCartButton salesOrderNo={cartHeader?.SalesOrderNo}
                                      disabled={loadingStatus !== 'idle' || cartHeader?.changed}>
                        Delete Cart
                    </DeleteCartButton>

                    <Button type="button" variant="text" onClick={reloadHandler} disabled={loadingStatus !== 'idle'}>
                        {detailChanged || cartHeader?.changed ? 'Cancel Changes' : 'Reload'}
                    </Button>

                    <Button type="button"
                            variant={(detailChanged || cartHeader?.changed) && cartProgress === cartProgress_Cart ? 'contained' : "text"}
                            color={(detailChanged || cartHeader?.changed) ? 'warning' : 'primary'}
                            onClick={saveCartHandler}
                            disabled={loadingStatus !== 'idle' || (cartProgress !== cartProgress_Cart && !detailChanged)}>
                        Save Cart
                    </Button>
                    <SendEmailButton salesOrderNo={header.SalesOrderNo}
                                     disabled={cartProgress !== cartProgress_Cart || detailChanged}>
                        Send Email
                    </SendEmailButton>
                    <CheckoutButton cartProgress={cartProgress}
                                    onClick={submitHandler} disabled={loadingStatus !== 'idle' || detailChanged}/>
                    {!!cartHeader?.SalesOrderNo && cartHeader.SalesOrderNo !== cartNo && (
                        <Button type="button" variant="contained" disabled={loadingStatus !== 'idle'}
                                onClick={() => dispatch(setCurrentCart(cartHeader?.SalesOrderNo))}>
                            Set Current Cart
                        </Button>
                    )}
                </Stack>
            </Stack>
            <AlertList context={promoteCart.typePrefix}/>
            <hr/>
            <Stack spacing={2} direction={{sm: 'column', md: 'row'}} justifyContent="space-between"
                   divider={<Divider orientation="vertical" flexItem/>}>
                <ItemAutocomplete salesOrderNo={header.SalesOrderNo}/>
                <CartCommentInput salesOrderNo={header.SalesOrderNo}/>
            </Stack>

        </Box>
    )
}

export default CartOrderHeaderElement;
