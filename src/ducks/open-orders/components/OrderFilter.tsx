import React, {InputHTMLAttributes, useId} from 'react';
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from "@mui/material/InputAdornment";

export interface OrderFilterProps extends InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode;
}

const OrderFilter = ({value, onChange, children, placeholder, className, id, ...rest}: OrderFilterProps) => {
    const _id = useId();
    if (!id) {
        id = _id;
    }
    return (
        <Stack direction="row" spacing={2}>
            <TextField type="search" value={value} onChange={onChange} variant="standard" size="small" id={id}
                       InputProps={{
                           startAdornment: (
                               <InputAdornment position="start"><SearchIcon/></InputAdornment>
                           )
                       }}
                       inputProps={rest}
                       placeholder={placeholder ?? 'Order or PO #'} className={className}/>
            {children}
        </Stack>
    )
};

export default OrderFilter;
