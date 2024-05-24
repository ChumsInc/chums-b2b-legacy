import React, {ChangeEvent, useId} from 'react';
import FormControl from '@mui/material/FormControl';
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import {InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from "@mui/material/Box";

const CartQuantityInput = ({quantity, unitOfMeasure = 'EA', onChange, min = 0, disabled, required}: {
    quantity: number;
    unitOfMeasure: string;
    onChange: (value: number) => void;
    min?: number;
    disabled?: boolean;
    required?: boolean;
}) => {
    const id = useId();

    const incrementHandler = () => {
        onChange(+quantity + 1);
    }

    const decrementHandler = () => {
        onChange(Math.max(min, +quantity - 1));
    }

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        const value = +ev.target.value;
        if (isNaN(value)) {
            return;
        }
        onChange(Math.max(+ev.target.value, 0));
    }

    return (
        <FormControl fullWidth>
            {/*<InputLabel htmlFor={id}>Quantity</InputLabel>*/}
            <FilledInput value={quantity ?? ''} size="small"
                         onChange={changeHandler}
                         inputProps={{
                             inputMode: 'numeric',
                             pattern: '[0-9]*',
                             readOnly: disabled,
                             sx: {textAlign: 'center'}
                         }}
                         startAdornment={
                             <InputAdornment position="start">
                                 <IconButton onClick={decrementHandler} size="small" edge="start"
                                             aria-label="decrease by one"
                                             disabled={disabled || +quantity === min}>
                                     <RemoveIcon/>
                                 </IconButton>
                             </InputAdornment>
                         }
                         endAdornment={
                             <InputAdornment position="end">
                                 <IconButton onClick={incrementHandler} size="small" edge="end"
                                             aria-label="increase by 1"
                                             disabled={disabled}>
                                     <AddIcon/>
                                 </IconButton>
                                 <Box sx={{ml: 1}}>{unitOfMeasure ?? 'EA'}</Box>
                             </InputAdornment>
                         }
            />
        </FormControl>
    )
};

export default CartQuantityInput;
