/**
 * Created by steve on 9/6/2016.
 */

import React, {useEffect, useState} from 'react';
import {STATES_USA, StateTerritory, TERRITORIES_CANADA} from '../constants/states';
import MenuItem from "@mui/material/MenuItem";
import TextField, {TextFieldProps} from "@mui/material/TextField";

export interface StateSelectProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    countryCode: string | null;
    value: string | null;
    onChange: (value: string) => void;
}

const StateSelect = ({countryCode, value, onChange, ...rest}: StateSelectProps) => {
    const [options, setOptions] = useState<StateTerritory[]>(STATES_USA);
    useEffect(() => {
        switch (countryCode) {
            case 'USA':
            case 'US':
                return setOptions(STATES_USA);
            case 'CA':
            case 'CAN':
                return setOptions(TERRITORIES_CANADA);
            default:
                return setOptions([]);
        }
    }, [countryCode]);


    const changeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        onChange(ev.target.value as string);
    }

    return (
        <TextField select label="State / Territory"
                   {...rest}
                   value={value ?? ''} onChange={changeHandler} fullWidth>
            <MenuItem>Select One</MenuItem>
            {options.map(option => (
                <MenuItem key={option.code} value={option.code}>{option.name}</MenuItem>
            ))}

        </TextField>
    )
}

export default StateSelect;
