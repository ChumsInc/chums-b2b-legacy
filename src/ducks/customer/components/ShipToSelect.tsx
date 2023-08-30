import React, {SelectHTMLAttributes, useId} from 'react';
import {useSelector} from 'react-redux';
import {selectCustomerPermissions, selectPermittedShipToAddresses} from "@/ducks/customer/selectors";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from '@mui/material/FormControl'
import Select, {SelectChangeEvent} from "@mui/material/Select";

export interface ShipToSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
    value: string | null;
    defaultName?: string;
    onChange: (shipToCode: string) => void;
}


const ShipToSelect = ({value, defaultName, onChange, readOnly, required, inputProps}: {
    value: string;
    defaultName?: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    required?: boolean;
    inputProps?: InputBaseComponentProps
}) => {
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);
    const permissions = useSelector(selectCustomerPermissions);
    const id = useId();


    const changeHandler = (ev: SelectChangeEvent) => {
        onChange(ev.target.value);
    }

    if (!shipToAddresses.length) {
        return null;
    }
    return (
        <FormControl fullWidth variant="filled" size="small">
            <InputLabel id={id}>Ship-To Code</InputLabel>
           <Select onChange={changeHandler} value={value ?? ''} readOnly={readOnly} required={required} inputProps={inputProps}>
                {!!defaultName && <MenuItem value={''}>{defaultName}</MenuItem>}
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

export default ShipToSelect;
