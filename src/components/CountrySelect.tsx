/**
 * Created by steve on 9/6/2016.
 */

import React, {useId} from 'react';
import {COUNTRIES} from '../constants/countries';
import MenuItem from "@mui/material/MenuItem";
import TextField, {TextFieldProps} from "@mui/material/TextField";


export interface CountrySelectProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    value: string | null;
    onChange: (value: string) => void;
}

const CountrySelect = ({value, onChange, id, ...rest}: CountrySelectProps) => {
    const _id = id ?? useId();

    const changeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        onChange(ev.target.value);
    }


    return (
        <TextField select label="Country" InputProps={{id: _id}} InputLabelProps={{htmlFor: _id}}
                   {...rest}
                   onChange={changeHandler} value={value ?? ''} fullWidth>
            <MenuItem>Select One</MenuItem>
            {COUNTRIES.map(option => (
                <MenuItem key={option.cca3} value={option.cca3}>{option.name}</MenuItem>
            ))}
        </TextField>
    )
}

export default CountrySelect;
