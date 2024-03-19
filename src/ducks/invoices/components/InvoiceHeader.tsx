import React, {useState} from 'react';
import FormGroupTextInput from "../../../common-components/FormGroupTextInput";
import FormGroup from "../../../common-components/FormGroup";
import DeliveryAddress from "../../../components/Address/DeliveryAddress";
import {duplicateOrder} from "../../../actions/salesOrder";
import {deprecated_loadInvoice} from '../actions';
import {useSelector} from "react-redux";
import ShippingMethodSelect from "../../../components/ShippingMethodSelect";
import DuplicateCartDialog from "../../cart/components/DuplicateCartDialog";
import {noop, ShippingMethods} from "../../../utils/general";
import TrackingLinkBadge from "../../../components/TrackingLinkBadge";
import {selectCurrentInvoice} from "../selectors";
import {useAppDispatch} from "../../../app/configureStore";
import {selectCartLoading, selectCartNo} from "../../cart/selectors";
import {useLocation} from "react-router-dom";
import dayjs from "dayjs";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from "@mui/material/Stack";
import {TextField} from "@mui/material";
import Alert from "@mui/material/Alert";
import ShipToSelect from "../../customer/components/ShipToSelect";
import {addressFromShipToAddress, multiLineAddress} from "../../customer/utils";
import PaidIcon from '@mui/icons-material/Paid';
import Decimal from "decimal.js";
import numeral from "numeral";
import {selectCustomerPermissions} from "../../customer/selectors";

const InvoiceHeader = () => {
    const dispatch = useAppDispatch();
    const invoice = useSelector(selectCurrentInvoice);
    const [confirmDuplicate, setConfirmDuplicate] = useState(false);
    const cartLoading = useSelector(selectCartLoading);
    const cartNo = useSelector(selectCartNo);
    const location = useLocation();
    const permissions = useSelector(selectCustomerPermissions);

    const onCancelDuplicate = () => {
        setConfirmDuplicate(false);
    }

    const onDuplicateOrder = (newCartName: string) => {
        const SalesOrderNo = invoice?.SalesOrderNo ?? null;
        if (!SalesOrderNo) {
            return;
        }
        //@TODO: redirect to new order page
        dispatch(duplicateOrder({SalesOrderNo, newCartName}));
    }

    const onReload = () => {
        if (!invoice) {
            return;
        }
        const {InvoiceNo, InvoiceType} = invoice;
        dispatch(deprecated_loadInvoice({InvoiceNo, InvoiceType}))
    }

    if (!invoice) {
        return null;
    }

    const cancelHidden = !invoice.UDF_CANCEL_DATE || dayjs(invoice.UDF_CANCEL_DATE).valueOf() === 0;

    return (
        <div className="mb-1">
            <DuplicateCartDialog open={confirmDuplicate} SalesOrderNo={invoice.SalesOrderNo ?? ''}
                                 loading={cartLoading}
                                 onCancel={onCancelDuplicate}
                                 onConfirm={onDuplicateOrder}/>
            <Grid container spacing={2}>
                <Grid xs={12} lg={6}>
                    <Stack spacing={2} direction="column">
                        <Stack spacing={2} direction={{xs: 'column', lg: 'row'}}>
                            <TextField label="Sales Order" type="text" fullWidth variant="filled" size="small"
                                       value={invoice.SalesOrderNo ?? 'Direct Invoice'} placeholder=""
                                       inputProps={{readOnly: true}}/>
                            <TextField label="Purchase Order #" type="text" fullWidth variant="filled" size="small"
                                       value={invoice.CustomerPONo} placeholder=""
                                       inputProps={{readOnly: true}}/>
                        </Stack>
                        <Stack spacing={2} direction={{xs: 'column', lg: 'row'}}>
                            {!!invoice.OrderDate && !!invoice.SalesOrderNo && (
                                <TextField label="Order Date" type="date" fullWidth variant="filled" size="small"
                                           value={dayjs(invoice.OrderDate).format('YYYY-MM-DD')} placeholder=""
                                           inputProps={{readOnly: true}}/>
                            )}
                            {!!invoice.ShipDate && (
                                <TextField label="Req. Ship Date" type="date" fullWidth variant="filled" size="small"
                                           value={dayjs(invoice.ShipDate).format('YYYY-MM-DD')} placeholder=""
                                           inputProps={{readOnly: true}}/>
                            )}
                            {!cancelHidden && (
                                <TextField label="Cancel Date" type="date" fullWidth variant="filled" size="small"
                                           value={dayjs(invoice.UDF_CANCEL_DATE).format('YYYY-MM-DD')}
                                           placeholder=""
                                           inputProps={{readOnly: true}}/>
                            )}
                        </Stack>
                        <Stack spacing={2} direction={{xs: 'column', lg: 'row'}}>
                            <TextField label="Invoice Date" type="date" fullWidth variant="filled" size="small"
                                       value={dayjs(invoice.OrderDate).format('YYYY-MM-DD')} placeholder=""
                                       inputProps={{readOnly: true}}/>
                            {!!invoice.InvoiceDueDate && (
                                <TextField label="Invoice Due Date" type="date" fullWidth variant="filled" size="small"
                                           value={dayjs(invoice.InvoiceDueDate).format('YYYY-MM-DD')} placeholder=""
                                           inputProps={{readOnly: true}}/>
                            )}
                        </Stack>
                        <Stack spacing={2} direction={{xs: 'column', lg: 'row'}}>
                            {!!invoice.UDF_PROMO_DEAL && (
                                <TextField label="Promo Code" type="text" fullWidth variant="filled" size="small"
                                           value={invoice.UDF_PROMO_DEAL} placeholder=""
                                           inputProps={{readOnly: true}}/>
                            )}
                            {permissions?.billTo && (<TextField label="Balance Due" type="text" fullWidth variant="filled" size="small"
                                        value={numeral(new Decimal(invoice.Balance ?? '0')).format('$ 0,0.00')}
                                        placeholder=""
                                        inputProps={{readOnly: true}}/>)}
                        </Stack>
                    </Stack>
                </Grid>
                <Grid xs={12} lg={6}>
                    <Stack spacing={2} direction="column">
                        <ShipToSelect value={invoice.ShipToCode} onChange={() => {}} readOnly />
                        <TextField label="Delivery Address" type="text" multiline variant="filled" size="small"
                                   value={multiLineAddress(addressFromShipToAddress(invoice), true).join('\n')}
                                   inputProps={{readOnly: true}}/>

                        <Stack spacing={2} direction={{xs: 'column', lg: 'row'}} sx={{alignItems: 'center'}} >
                            <TextField label="Ship Method" type="text" fullWidth variant="filled" size="small"
                                       value={ShippingMethods[invoice.ShipVia ?? '-']?.description ?? 'Unknown'} placeholder=""
                                       inputProps={{readOnly: true}}/>
                            {!invoice.Tracking.length && <Alert severity="info">Tracking is not available for this invoice.</Alert>}
                            {(invoice.Tracking || []).map(track => (
                                <TrackingLinkBadge key={track.PackageNo} {...track}/>)
                            )}
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
            <Stack spacing={2} direction="row" sx={{justifyContent: 'flex-end', mt: 2}}>
                <Button variant="outlined" disabled={!invoice.SalesOrderNo} onClick={() => setConfirmDuplicate(true)}>
                    Duplicate Order
                </Button>
                <Button variant="text" onClick={onReload}>
                    Reload Invoice
                </Button>
            </Stack>
        </div>
    )
}

export default InvoiceHeader;
