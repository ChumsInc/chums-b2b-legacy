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
    label?: string;
    disabledShipToLocations?: string[];
    allowAllLocations?: boolean;
    onChange: (shipToCode: string | null, address: ShipToAddress | null) => void;
    readOnly?: boolean;
    required?: boolean;
}

const allLocationsValue = '__ALL';

export default function ShipToSelect({
                                         value,
                                         defaultName, // @TODO: not sure if this is needed?
                                         label,
                                         disabledShipToLocations,
                                         allowAllLocations,
                                         onChange,
                                         readOnly,
                                         required,
                                         ...formControlProps
                                     }: ShipToSelectProps) {
    const customer = useSelector(selectCustomerAccount);
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);
    const permissions = useSelector(selectCustomerPermissions);
    const id = useId();


    const changeHandler = (ev: SelectChangeEvent) => {
        if (!customer) {
            return onChange(ev.target.value, null);
        }
        const value = ev.target.value ?? customer?.PrimaryShipToCode ?? '';
        if (allowAllLocations && value === allLocationsValue) {
            return onChange(null, null);
        }

        const [address] = shipToAddresses.filter(st => st.ShipToCode === value);

        if (!address && permissions?.billTo) {
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

    const renderValueHandler = (value: string) => {
        if (value === '' && permissions?.billTo) {
            return 'Billing Address';
        }
        if (value === allLocationsValue) {
            return 'All Locations';
        }
        const [shipTo] = shipToAddresses.filter(st => st.ShipToCode === value);
        if (shipTo) {
            return `[${shipTo?.ShipToCode}]  ${shipTo?.ShipToName}, ${shipTo?.ShipToCity} ${shipTo?.ShipToState}`;
        }
        return '';
    }

    return (
        <FormControl fullWidth variant="filled" size="small" {...formControlProps}>
            <InputLabel id={id} shrink>{label ?? 'Ship-To Location'}</InputLabel>
            <Select onChange={changeHandler}
                    value={value ?? (allowAllLocations ? allLocationsValue : '')} displayEmpty
                    renderValue={renderValueHandler}
                    readOnly={readOnly} required={required}>
                {allowAllLocations && (<MenuItem value={allLocationsValue}>All Addresses</MenuItem>)}
                {permissions?.billTo && <MenuItem value="">Billing Address</MenuItem>}
                {shipToAddresses
                    .filter(shipTo => shipTo.ShipToCode !== '' || permissions?.billTo)
                    .map(shipTo => (
                        <MenuItem key={shipTo.ShipToCode} value={shipTo.ShipToCode}
                                  disabled={disabledShipToLocations?.includes(shipTo.ShipToCode)}>
                            [{shipTo.ShipToCode || 'Billing'}] {shipTo.ShipToName}, {shipTo.ShipToCity} {shipTo.ShipToState}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    )
}

