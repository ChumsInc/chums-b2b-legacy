/**
 * Created by steve on 9/6/2016.
 */

import React, {useEffect, useId, useState} from 'react';
import {STATES_USA, StateTerritory, TERRITORIES_CANADA} from '../constants/states';
import MenuItem from "@mui/material/MenuItem";
import TextField, {TextFieldProps} from "@mui/material/TextField";

export interface StateSelectProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    countryCode: string | null;
    value: string | null;
    filterList?: string[];
    allowAllStates?: boolean;
    onChange: (value: string) => void;
}

const StateSelect = ({countryCode, value, filterList, allowAllStates, onChange, id, ...rest}: StateSelectProps) => {
    const [options, setOptions] = useState<StateTerritory[]>(STATES_USA.filter(state => !filterList || !filterList.length || filterList.includes(state.code)));
    const _id = id ?? useId();

    useEffect(() => {
        switch (countryCode) {
            case 'USA':
            case 'US':
                return setOptions(STATES_USA.filter(state => !filterList || !filterList.length || filterList.includes(state.code)));
            case 'CA':
            case 'CAN':
                return setOptions(TERRITORIES_CANADA.filter(state => !filterList || !filterList.length || filterList.includes(state.code)));
            default:
                return setOptions([]);
        }
    }, [countryCode, filterList]);


    const changeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        onChange(ev.target.value as string);
    }

    return (
        <TextField select label="State / Territory" InputProps={{id: _id}} InputLabelProps={{htmlFor: _id}}
                   {...rest}
                   value={value ?? ''} onChange={changeHandler} fullWidth>
            {!allowAllStates && (<MenuItem>Select One</MenuItem>)}
            {allowAllStates && (<MenuItem>All States</MenuItem>)}
            {options.map(option => (
                <MenuItem key={option.code} value={option.code}>{option.name}</MenuItem>
            ))}

        </TextField>
    )
}

export default StateSelect;
