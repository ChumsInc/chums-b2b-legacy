/**
 * Created by steve on 9/6/2016.
 */
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {saveShipToAddress, setDefaultShipTo} from '../actions';
import Alert from "@mui/material/Alert";
import ShipToAddressFormFields from "../../../components/ShipToAddressFormFields";
import {selectCanEdit} from "../../user/selectors";
import {
    selectCustomerLoading,
    selectCustomerPermissions,
    selectPermittedShipToAddresses,
    selectPrimaryShipTo
} from "../selectors";
import StoreMapToggle from "../../../components/StoreMapToggle";
import {Editable, ShipToCustomer} from "b2b-types";
import {useAppDispatch} from "../../../app/configureStore";
import {useParams} from "react-router";
import DeliveryAddress from "../../../components/Address/DeliveryAddress";
import LinearProgress from "@mui/material/LinearProgress";
import ReloadCustomerButton from "./ReloadCustomerButton";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Button, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import EmailAddressEditor from "../../../components/EmailAddressEditor";
import TelephoneFormFields from "./TelephoneFormFields";
import Box from "@mui/material/Box";
import PrimaryShipToIcon from "./PrimaryShipToIcon";

const ShipToForm = () => {
    const dispatch = useAppDispatch();
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);
    const primaryShipTo = useSelector(selectPrimaryShipTo);
    const loading = useSelector(selectCustomerLoading);
    const canEdit = useSelector(selectCanEdit);
    const permissions = useSelector(selectCustomerPermissions);
    const params = useParams<'shipToCode'>();
    const [shipTo, setShipTo] = useState<ShipToCustomer & Editable | null>(null);

    const readOnly = !canEdit;

    useEffect(() => {
        const [shipTo] = shipToAddresses.filter(row => row.ShipToCode === params.shipToCode);
        setShipTo(shipTo ?? null);
    }, [shipToAddresses, params])


    const onNewShipToCustomer = () => {
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!shipTo || !canEdit) {
            return;
        }
        dispatch(saveShipToAddress(shipTo));
    }

    const changeHandler = (arg: Partial<ShipToCustomer>) => {
        if (shipTo) {
            setShipTo({...shipTo, ...arg, changed: true});
        }
    }

    const fieldChangeHandler = (field: keyof ShipToCustomer) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'Reseller':
                return changeHandler({[field]: ev.target.checked ? 'Y' : 'N'})
            default:
                changeHandler({[field]: ev.target.value});
        }
    }

    const onSetDefaultShipTo = () => {
        if (shipTo && shipTo.ShipToCode !== primaryShipTo?.ShipToCode) {
            dispatch(setDefaultShipTo(shipTo.ShipToCode))
        }
    }

    if (!canEdit) {
        return (
            <div>
                <h4>Delivery Address</h4>
                {loading && <LinearProgress variant="indeterminate"/>}
                {shipTo && <DeliveryAddress address={shipTo}/>}
            </div>
        )
    }

    return (
        <div>
            {loading && <LinearProgress variant="indeterminate"/>}
            {shipTo && (
                <form onSubmit={submitHandler}>
                    <Grid2 container spacing={2}>
                        <Grid2 xs={12} md={6}>
                            <TextField variant="filled" label="Location Name" fullWidth size="small"
                                       type="text" value={shipTo.ShipToName ?? ''}
                                       onChange={fieldChangeHandler('ShipToName')}
                                       inputProps={{readOnly: readOnly}}/>
                        </Grid2>
                        <Grid2 xs={12} md={6} alignItems="center">
                            {primaryShipTo?.ShipToCode !== shipTo.ShipToCode && (
                                <Button type="button" variant="outlined"
                                        disabled={shipTo.changed || readOnly || shipTo.ShipToCode === primaryShipTo?.ShipToCode}
                                        onClick={onSetDefaultShipTo}>
                                    Set as default delivery location
                                </Button>
                            )}
                            {primaryShipTo?.ShipToCode === shipTo.ShipToCode && (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <PrimaryShipToIcon shipToCode={shipTo.ShipToCode} />
                                    <Typography variant="body1">Default delivery location</Typography>
                                </Stack>

                            )}
                        </Grid2>
                    </Grid2>
                    <hr/>
                    <Grid2 container spacing={2}>
                        <Grid2 xs={12} md={6}>
                            <ShipToAddressFormFields address={shipTo} readOnly={readOnly} onChange={changeHandler}
                                                     colWidth={8}/>
                        </Grid2>
                        <Grid2 xs={12} md={6}>
                            <Stack direction="column" spacing={2}>
                                <StoreMapToggle checked={shipTo.Reseller === 'Y'}
                                                onChange={fieldChangeHandler('Reseller')}
                                                readOnly={readOnly}/>
                                <EmailAddressEditor label="Email Address"
                                                    required={true} readOnly={!canEdit}
                                                    value={shipTo.EmailAddress}
                                                    onChange={changeHandler}/>
                                <TelephoneFormFields account={shipTo} onChange={changeHandler} readOnly={!canEdit}/>
                                {shipTo.changed && (
                                    <Alert severity="warning" title="Hey!">Don't forget to save your changes.</Alert>
                                )}
                            </Stack>
                            <Stack direction="row" spacing={2} sx={{my: 3}}>
                                <Button type="submit" variant="contained"
                                        disabled={readOnly || loading}>
                                    Save
                                </Button>
                                <ReloadCustomerButton/>
                            </Stack>
                        </Grid2>
                    </Grid2>
                </form>
            )}
        </div>
    )
}

export default ShipToForm;

