import React, {FormEvent, useState} from 'react';
import Alert from "@mui/material/Alert";
import {useSelector} from 'react-redux';
import {loginUser, resetPassword} from "../actions";
import PasswordInput from "../../../common-components/PasswordInput";
import FormGroup from "@mui/material/FormGroup";
import {useAppDispatch} from "../../../app/configureStore";
import {selectUserLoading} from "../selectors";
import LinearProgress from "@mui/material/LinearProgress";
import {FieldValue} from "../../../types/generic";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {Button, Checkbox, FormControlLabel, InputAdornment} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import Box from "@mui/material/Box";
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

const LoginLocal = () => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectUserLoading);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (forgotPassword) {
            dispatch(resetPassword(email));
            return;
        }
        dispatch(loginUser({email, password}))
    }

    return (
        <form onSubmit={submitHandler}>
            {loading && <LinearProgress variant="indeterminate" title="Processing Login Request"/>}
            {!forgotPassword && (
                <>
                    <Typography component="h3">Login with your credentials</Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                        <AccountCircle sx={{color: 'action.active', mr: 1}}/>
                        <TextField type="email" fullWidth
                                   variant="filled" label="Email"
                                   onChange={ev => setEmail(ev.target.value)} value={email}
                                   autoComplete="username"
                                   InputLabelProps={{shrink: true}}
                                   required/>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                        <KeyIcon sx={{color: 'action.active', mr: 1}} />
                        <TextField type={showPassword ? "text" : "password"} fullWidth
                                   variant="filled" label="Password"
                                   onChange={ev => setPassword(ev.target.value)} value={password}
                                   autoComplete="current-password"
                                   InputLabelProps={{shrink: true}}
                                   required/>
                        <IconButton aria-label="show passwords" color={showPassword ? "secondary" : "default" }
                                    role="switch" aria-checked={showPassword}
                                    onClick={() => setShowPassword(!showPassword)}>
                            <VisibilityIcon sx={{ms: 1}}  />
                        </IconButton>
                    </Box>
                    <Stack direction="row" spacing={2} useFlexGap justifyContent="flex-end">
                        <Button type="submit" variant="contained">Sign In</Button>
                        <Button type="button" variant="text"
                                onClick={() => setForgotPassword(true)}>
                            Forgot Password
                        </Button>
                    </Stack>

                </>
            )}
            {forgotPassword && (
                <Stack direction="column" spacing={1}>
                    <Typography component="h3">Reset Your Password</Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <AccountCircle sx={{color: 'action.active', mr: 1}}/>
                        <TextField type="email" fullWidth
                                   variant="filled" label="Email"
                                   onChange={ev => setEmail(ev.target.value)} value={email}
                                   autoComplete="username"
                                   InputLabelProps={{shrink: true}}
                                   required/>
                    </Box>
                    <Alert severity="info">An email will be sent to you so you can reset your password.</Alert>
                    <Stack direction="row" spacing={2} useFlexGap justifyContent="flex-end">
                        <Button type="submit" variant="contained">Reset Password</Button>
                        <Button type="button" variant="text"
                                onClick={() => setForgotPassword(false)}>
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            )}
        </form>
    );
}

export default LoginLocal;
