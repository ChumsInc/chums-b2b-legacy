/**
 * Created by steve on 1/31/2017.
 */

import React from 'react';
import {DatePicker as MUIDatePicker} from '@mui/x-date-pickers/DatePicker';
import {TextInputChangeHandler} from "../generic-types";
import dayjs from "dayjs";
import {TextFieldProps} from "@mui/material/TextField";
import Box from "@mui/material/Box";


export interface DatePickerProps {
    value: string | null;
    onChange: (arg: TextInputChangeHandler) => void;
    readOnly?: boolean;
    disabled?: boolean;
    minDate?: string;
}


type BrowserInputProps = TextFieldProps & {
    ownerState?: any;
};

const BrowserInput = function BrowserInput(props: BrowserInputProps) {
    const { inputProps, InputProps, ownerState, inputRef, error, ...other } = props;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }} ref={InputProps?.ref}>
            <input ref={inputRef} {...inputProps} {...(other as any)} className="form-control form-control-sm" />
            {InputProps?.endAdornment}
        </Box>
    );
};

const DatePicker = ({value, onChange, readOnly, disabled, minDate}: DatePickerProps) => {
    return (
        <MUIDatePicker slots={{textField: BrowserInput}} value={dayjs(value)}
                       onChange={(value) => onChange({value: value?.toDate()?.toJSON() ?? null})}
                       readOnly={readOnly} disabled={disabled} minDate={dayjs(minDate)}/>
    )
}

export default DatePicker
// export default OldDatePicker;
