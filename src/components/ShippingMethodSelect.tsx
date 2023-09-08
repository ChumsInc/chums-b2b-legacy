import React, {useId} from 'react';
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {SHIPPING_METHODS} from "@/constants/account";
import {InputBaseComponentProps} from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import FormControl, {FormControlProps, FormControlState} from '@mui/material/FormControl'

export interface ShippingMethodSelectProps extends Omit<FormControlProps, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
    required?: boolean;
    inputProps?: InputBaseComponentProps;
}

export default React.forwardRef(function ShippingMethodSelect({
                                                 value,
                                                 onChange,
                                                 readOnly,
                                                 required,
                                                 inputProps,
                                                 ...formControlProps
                                             }: ShippingMethodSelectProps, ref:React.Ref<HTMLDivElement>) {
    const labelId = useId();
    const selectId = useId();

    const changeHandler = (ev: SelectChangeEvent) => {
        onChange(ev.target.value);
    }

    return (
        <FormControl fullWidth variant="filled" size="small" {...formControlProps} required={required}>
            <InputLabel id={labelId}>Ship Method</InputLabel>
            <Select labelId={labelId} id={selectId} inputRef={ref}
                    value={value} onChange={changeHandler}
                    inputProps={inputProps}
                    readOnly={readOnly} required={required}>
                {!readOnly && (<MenuItem value="">Select Shipping Method</MenuItem>)}
                {readOnly && (<MenuItem value=""/>)}
                {Object.keys(SHIPPING_METHODS)
                    .map(key => {
                        return (
                            <MenuItem key={key}
                                      value={SHIPPING_METHODS[key].code}>{SHIPPING_METHODS[key].description}</MenuItem>
                        )
                    })}
            </Select>
        </FormControl>
    );
})

