import React, {useState} from "react";
import TextField, {FilledTextFieldProps} from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export interface PasswordInputProps extends FilledTextFieldProps {
}

const PasswordTextField = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    function PasswordInput(props: PasswordInputProps, ref) {
        const [showPassword, setShowPassword] = useState<boolean>(false);
        const {
            InputProps,
            ...rest
        } = props;

        const handleClickShowPassword = () => setShowPassword((show) => !show);

        const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
        };

        const renderInputAdornment = () => (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end">
                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
            </InputAdornment>
        )

        return (
            <TextField InputProps={{
                ...InputProps,
                ref: ref,
                type: showPassword ? 'text' : 'password',
                endAdornment: renderInputAdornment()
            }}
                       {...rest}/>
        )
    });

export default PasswordTextField;
