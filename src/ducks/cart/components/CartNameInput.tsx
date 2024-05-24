import React, {ChangeEvent, useId} from 'react';
import FormControl, {FormControlProps} from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField, {TextFieldProps} from "@mui/material/TextField";

export interface CartNameInputProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    value: string;
    onChange: (value:string) => void;
}
const CartNameInput = ({value, onChange, ...rest}:CartNameInputProps) => {
    const id = useId();
    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        onChange(ev.target.value);
    }

    return (
        <TextField id={id} label="Cart Name" value={value} onChange={changeHandler}
                   size="small" variant="filled" {...rest} />
    )
}

export default CartNameInput;
