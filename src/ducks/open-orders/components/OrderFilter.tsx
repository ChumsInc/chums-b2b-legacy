import React, {InputHTMLAttributes, useId} from 'react';
import classNames from "classnames";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search';
import {InputAdornment} from "@mui/material";

export interface OrderFilterProps extends InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode;
}

const OrderFilter = ({value, onChange, children, placeholder, className, id, ...rest}: OrderFilterProps) => {
    return (
        <Stack direction="row" spacing={2}>
            <TextField type="search" value={value} onChange={onChange} variant="standard" size="small"
                       InputProps={{
                           startAdornment: (
                               <InputAdornment position="start"><SearchIcon /></InputAdornment>
                           )
                       }}
                       inputProps={rest}
                       placeholder={placeholder ?? 'Order or PO #'} className={className}/>
            {children}
        </Stack>
    )
};

export default OrderFilter;
