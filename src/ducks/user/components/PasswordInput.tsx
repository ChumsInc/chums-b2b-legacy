import FormControl, {FormControlProps} from "@mui/material/FormControl";
import React, {ChangeEvent, useId, useState} from "react";
import Input, {InputProps} from "@mui/material/Input";
import InputLabel, {InputLabelProps} from "@mui/material/InputLabel";
import {InputBaseProps} from "@mui/material/InputBase";
import {useDebounceValue} from "usehooks-ts";


export interface PasswordInputProps extends FormControlProps {
    label?: React.ReactNode;
    InputLabelProps?: InputLabelProps;
    inputProps?: InputBaseProps['inputProps'];
    InputProps?: InputProps;
    name?: string;
    value: string;
    showPasswordScore?: boolean;
    onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void,
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    function PasswordInput(props: PasswordInputProps, ref) {
        const inputId = useId();
        const [showPassword, setShowPassword] = useState<boolean>(false);
        const [scoreValue, setScoreValue] = useDebounceValue<string>('', 500);
        const {
            id,
            label,
            InputLabelProps,
            inputProps,
            InputProps,
            name,
            onChange,
            onBlur,
            onFocus,
            showPasswordScore,
            value,
        } = props;

        const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(ev);
            }
            setScoreValue(ev.target.value);
        }
        return (
            <FormControl variant="filled">
                <InputLabel {...InputLabelProps} htmlFor={id ?? inputId}>{label}</InputLabel>
                <Input id={id ?? inputId} ref={ref} inputProps={inputProps} {...(InputProps ?? {})} onChange={changeHandler}/>
            </FormControl>
        )
    });

export default PasswordInput;
