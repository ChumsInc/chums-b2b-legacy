import React, {ChangeEvent, useId} from 'react';
import TextField, {TextFieldProps} from "@mui/material/TextField";

export interface CartNameInputProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
}

const CartNameInput = ({value, onChange, ...rest}: CartNameInputProps) => {
    const id = useId();
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        onChange(ev.target.value);
    }

    return (
        <TextField id={id} label="Cart Name" value={value} onChange={changeHandler} inputProps={{maxLength: 30}}
                   size="small" variant="filled" {...rest} />
    )
}

export default CartNameInput;
