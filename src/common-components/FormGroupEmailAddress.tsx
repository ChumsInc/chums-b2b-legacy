import React, {ChangeEvent, InputHTMLAttributes} from 'react';
import TextField from "@mui/material/TextField";
import {InputAdornment} from "@mui/material";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const FormGroupEmailAddress = ({
                                   value,
                                   onChange,
                                   label = '',
                                   inputProps
                               }: {
    label: string;
    value: string;
    onChange: (arg: ChangeEvent<HTMLInputElement>) => void;
    inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

}) => {
    return (
        <>
            <TextField label={label} variant="filled" fullWidth size="small" type="email"
                       InputProps={{
                           startAdornment: <InputAdornment position="start"><AlternateEmailIcon/></InputAdornment>,
                       }}
                       value={value} onChange={onChange} inputProps={inputProps}/>
        </>
    )
};

export default FormGroupEmailAddress;
