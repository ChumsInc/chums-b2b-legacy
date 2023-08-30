import React, {useId} from 'react';
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {SHIPPING_METHODS} from "@/constants/account";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import FormControl from '@mui/material/FormControl'

export interface ShippingMethodSelectProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    required?: boolean;
    inputProps?: InputBaseComponentProps
}

export default function ShippingMethodSelect({
                                                 value,
                                                 onChange,
                                                 readOnly,
                                                 required,
                                                 inputProps
                                             }: ShippingMethodSelectProps) {
    const id = useId();

    const changeHandler = (ev: SelectChangeEvent) => {
        onChange(ev.target.value);
    }

    return (
        <FormControl fullWidth variant="filled" size="small">
            <InputLabel id={id}>Ship Method</InputLabel>
            <Select value={value} onChange={changeHandler} readOnly={readOnly} required={required}
                    name="cart-shipping-method"
                    labelId={id} inputProps={inputProps}>
                {!readOnly && (<MenuItem value="">Select Shipping Method</MenuItem>)}
                {readOnly && (<MenuItem value=""/>)}
                {Object.keys(SHIPPING_METHODS)
                    .filter(key => SHIPPING_METHODS[key].carrier === '')
                    .map(key => {
                        return (
                            <MenuItem key={key}
                                      value={SHIPPING_METHODS[key].code}>{SHIPPING_METHODS[key].description}</MenuItem>
                        )
                    })}
                <ListSubheader>FedEx</ListSubheader>
                {Object.keys(SHIPPING_METHODS)
                    .filter(key => SHIPPING_METHODS[key].carrier === 'fedex')
                    .map(key => {
                        return (
                            <MenuItem key={key}
                                      value={SHIPPING_METHODS[key].code}>{SHIPPING_METHODS[key].description}</MenuItem>
                        )
                    })}
                <ListSubheader>UPC</ListSubheader>
                {Object.keys(SHIPPING_METHODS)
                    .filter(key => SHIPPING_METHODS[key].carrier === 'ups')
                    .map(key => {
                        return (
                            <MenuItem key={key}
                                      value={SHIPPING_METHODS[key].code}>{SHIPPING_METHODS[key].description}</MenuItem>
                        )
                    })}
                <ListSubheader>US Postal Service</ListSubheader>
                {Object.keys(SHIPPING_METHODS)
                    .filter(key => SHIPPING_METHODS[key].carrier === 'usps')
                    .map(key => {
                        return (
                            <MenuItem key={key}
                                      value={SHIPPING_METHODS[key].code}>{SHIPPING_METHODS[key].description}</MenuItem>
                        )
                    })}
            </Select>
        </FormControl>
    );
}

