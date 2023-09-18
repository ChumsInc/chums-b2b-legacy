import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {selectSalesOrderHeader, selectSalesOrderInvoices, selectSOLoading} from "@/ducks/salesOrder/selectors";
import {Button, Chip, TextField} from "@mui/material";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import {addressFromShipToAddress, multiLineAddress} from "@/ducks/customer/utils";
import Typography from "@mui/material/Typography";
import {generatePath, NavLink} from "react-router-dom";
import {genInvoicePath} from "@/utils/path-utils";
import {selectCurrentCustomer} from "@/ducks/user/selectors";
import {getShippingMethod} from "@/constants/account";
import {useAppDispatch} from "@/app/configureStore";
import {loadSalesOrder} from "@/ducks/salesOrder/actions";
import CartOrderHeaderElement from "@/ducks/cart/components/CartOrderHeaderElement";
import SalesOrderSkeleton from "@/ducks/salesOrder/components/SalesOrderSkeleton";
import Grid from '@mui/material/Unstable_Grid2';
import {customerSlug} from "@/utils/customer";
import {useNavigate} from "react-router";

const SalesOrderHeaderElement = () => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCurrentCustomer);
    const header = useSelector(selectSalesOrderHeader);
    const invoices = useSelector(selectSalesOrderInvoices);
    const loading = useSelector(selectSOLoading);
    const navigate = useNavigate();

    const hasCancelDate = header?.UDF_CANCEL_DATE ? dayjs(header?.UDF_CANCEL_DATE).valueOf() > 0 : false;
    const cancelDate = hasCancelDate ? dayjs(header?.UDF_CANCEL_DATE).format('YYYY-MM-DD') : '';
    const orderDate = header?.OrderDate ? dayjs(header.OrderDate).format('YYYY-MM-DD') : '';
    const shipDate = header?.ShipExpireDate ? dayjs(header.ShipExpireDate).format('YYYY-MM-DD') : '';

    useEffect(() => {
        if (!!header && header?.OrderType !== 'Q' && !!header.SalesOrderNo) {
            navigate(generatePath('/account/:customerSlug/orders/:salesOrderNo', {
                customerSlug: customerSlug(customer),
                salesOrderNo: header.SalesOrderNo,
            }), {replace: true});
            return;
        }
    }, [header]);

    const reloadHandler = () => {
        if (!customer || !header) {
            return;
        }
        dispatch(loadSalesOrder(header?.SalesOrderNo))
    }
    if (!customer || !header) {
        return null;
    }
    return (
        <div>
            <Grid container spacing={2}>
                <Grid xs={12} lg={6}>
                    <Stack spacing={2} direction="column">
                        <TextField label="Order Date" type="date" fullWidth variant="filled" size="small"
                                   value={orderDate} placeholder=""
                                   inputProps={{readOnly: true}}/>
                        <TextField label="Purchase Order No" type="text" fullWidth variant="filled" size="small"
                                   value={header?.CustomerPONo ?? ''}
                                   inputProps={{readOnly: true}}/>
                        {hasCancelDate && (
                            <TextField label="Cancel Date" type="date" fullWidth
                                       value={cancelDate}
                                       variant="filled" size="small" inputProps={{readOnly: true}}/>
                        )}
                        <TextField label="Requested Ship Date" type="date" size="small" variant="filled" fullWidth
                                   value={shipDate}
                                   inputProps={{readOnly: true}}/>
                        {header?.UDF_PROMO_DEAL && (
                            <TextField label="Promo Code" type="text" fullWidth
                                       value={header?.UDF_PROMO_DEAL ?? ''}
                                       variant="filled" size="small" inputProps={{readOnly: true}}/>
                        )}
                        {!!invoices.length && (
                            <div>
                                <Typography>Invoices:</Typography>
                                {invoices.map(inv => <Chip label={inv} component={NavLink}
                                                           to={genInvoicePath(customer, inv)}/>)}
                            </div>
                        )}
                    </Stack>
                </Grid>
                <Grid xs={12} lg={6}>
                    <Stack spacing={2} direction="column">
                        <TextField label="Ship To Code" type="text" variant="filled" size="small"
                                   value={header?.ShipToCode ?? 'Default Address'}
                                   inputProps={{readOnly: true}}/>
                        <TextField label="Delivery Address" type="text" multiline variant="filled" size="small"
                                   value={multiLineAddress(addressFromShipToAddress(header), true).join('\n')}
                                   inputProps={{readOnly: true}}/>
                        <Stack spacing={2} direction={{xs: 'column', md: 'row'}}>
                            <TextField label="Ship Via" type="text" fullWidth
                                       value={getShippingMethod(header?.ShipVia)?.description ?? header?.ShipVia ?? ''}
                                       variant="filled" size="small" inputProps={{readOnly: true}}/>
                            <TextField label="Ship Comment" type="text" fullWidth
                                       value={header?.Comment ?? ''}
                                       variant="filled" size="small" inputProps={{readOnly: true}}/>
                        </Stack>
                        <Stack spacing={2} direction={{sm: 'column', md: 'row'}} sx={{justifyContent: 'flex-end'}}>
                            <Button type="button" variant="text" onClick={reloadHandler}>Reload</Button>
                            <Button type="button" variant="outlined">Duplicate Order</Button>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </div>
    )
}

export default SalesOrderHeaderElement;
