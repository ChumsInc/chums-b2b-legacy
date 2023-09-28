import React, {useId} from 'react';
import {useSelector} from 'react-redux';
import {selectCustomerAccount, selectCustomerPermissions, selectPermittedShipToAddresses} from "../selectors";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl, {FormControlProps} from '@mui/material/FormControl'
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {ShipToAddress} from "b2b-types";
import {shipToAddressFromBillingAddress} from "../../../utils/customer";

export interface ShipToSelectProps extends Omit<FormControlProps, 'value' | 'onChange'> {
    value: string | null;
    defaultName?: string;
    onChange: (shipToCode: string, address: ShipToAddress | null) => void;
    readOnly?: boolean;
    required?: boolean;
    inputProps?: InputBaseComponentProps;
}


export default function ShipToSelect({
                                         value,
                                         defaultName,
                                         onChange,
                                         readOnly,
                                         required,
                                         inputProps,
                                         ...formControlProps
                                     }: ShipToSelectProps) {
    const customer = useSelector(selectCustomerAccount);
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);
    const permissions = useSelector(selectCustomerPermissions);
    const id = useId();


    const changeHandler = (ev: SelectChangeEvent) => {
        console.log('changeHandler', customer, ev.target.value);
        if (!customer) {
            return onChange(ev.target.value, null);
        }
        const value = ev.target.value ?? customer?.PrimaryShipToCode ?? '';
        const [address] = shipToAddresses.filter(st => st.ShipToCode === value);
        if (!address) {
            return onChange(value, shipToAddressFromBillingAddress(customer));
        }
        const {
            ShipToName,
            ShipToAddress1,
            ShipToAddress2,
            ShipToAddress3,
            ShipToCity,
            ShipToState,
            ShipToCountryCode,
            ShipToZipCode
        } = address;
        onChange(value, {
            ShipToName,
            ShipToAddress1,
            ShipToAddress2,
            ShipToAddress3,
            ShipToCity,
            ShipToState,
            ShipToCountryCode,
            ShipToZipCode
        });
    }

    if (!shipToAddresses.length) {
        return null;
    }

    const renderValueHandler = (value:string) => {
        if (value === '' && permissions?.billTo) {
            return 'Billing Address';
        }
        const [shipTo] = shipToAddresses.filter(st => st.ShipToCode === value);
        return `[${shipTo.ShipToCode}]  ${shipTo.ShipToName}, ${shipTo.ShipToCity} ${shipTo.ShipToState}`;
    }

    return (
        <FormControl fullWidth variant="filled" size="small" {...formControlProps}>
            <InputLabel id={id} shrink>Ship-To Location</InputLabel>
            <Select onChange={changeHandler}
                    value={value ?? ''} displayEmpty renderValue={renderValueHandler}
                    readOnly={readOnly} required={required}>
                {permissions?.billTo && <MenuItem value="">Billing Address</MenuItem>}
                {shipToAddresses
                    .filter(shipTo => shipTo.ShipToCode !== '' || permissions?.billTo)
                    .map(shipTo => (
                        <MenuItem key={shipTo.ShipToCode} value={shipTo.ShipToCode}>
                            [{shipTo.ShipToCode || 'Billing'}] {shipTo.ShipToName}, {shipTo.ShipToCity} {shipTo.ShipToState}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    )
}

