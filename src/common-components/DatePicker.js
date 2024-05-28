/**
 * Created by steve on 1/31/2017.
 */

import React from 'react';
import {DatePicker as MUIDatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import Box from "@mui/material/Box";


// export interface DatePickerProps {
//     value: string | null;
//     onChange: (arg: TextInputChangeHandler) => void;
//     readOnly?: boolean;
//     disabled?: boolean;
//     minDate?: string;
// }
//
//
// type BrowserInputProps = TextFieldProps & {
//     ownerState?: any;
// };

const BrowserInput = function BrowserInput(props) {
    const {inputProps, InputProps, ownerState, inputRef, error, ...other} = props;
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}} ref={InputProps?.ref}>
            <input ref={inputRef} {...inputProps} {...other} className="form-control form-control-sm"/>
            {InputProps?.endAdornment}
        </Box>
    );
};

const DatePicker = ({value, onChange, readOnly, disabled, minDate}) => {
    const changeHandler = (value) => {
        const returnValue = dayjs(value)?.toDate()?.toJSON() ?? null;
        onChange({value: returnValue})
    }
    return (
        <MUIDatePicker slots={{textField: BrowserInput}} value={dayjs(value)}
                       onChange={changeHandler}
                         readOnly={readOnly} disabled={disabled}
                       minDate={dayjs(minDate)}
                       maxDate={dayjs(minDate).add(1, 'year')}/>
    )
}

export default DatePicker
// export default OldDatePicker;
