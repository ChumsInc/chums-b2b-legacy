import React, {FormEvent, useState} from 'react';
import {useSelector} from 'react-redux';
import {loginUser, resetPassword} from "../actions";
import {useAppDispatch} from "../../../app/configureStore";
import {selectUserLoading} from "../selectors";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import KeyIcon from '@mui/icons-material/Key';
import Stack from "@mui/material/Stack";
import PasswordTextField from "./PasswordTextField";
import {Link as NavLink} from 'react-router-dom'
import {isErrorResponse} from "../../../utils/typeguards";
import Alert from "@mui/material/Alert";


const LoginLocal = () => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectUserLoading);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState<string | null>(null)


    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        if (forgotPassword) {
            await dispatch(resetPassword(email));
            setForgotPassword(false);
            return;
        }
        const res = await dispatch(loginUser({email, password}))
        if (isErrorResponse(res.payload)) {
            setAlert(res.payload.error ?? null);
            setPassword('');
        }
    }

    return (
        <Box component="form" onSubmit={submitHandler}>
            <Stack direction="column">
                {!!alert && (<Alert severity="warning" sx={{my: 3}}>{alert}</Alert>)}
                {loading && <LinearProgress variant="indeterminate" title="Processing Login Request"/>}
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
                    <KeyIcon sx={{color: 'action.active', mr: 1}}/>
                    <PasswordTextField variant="filled" fullWidth
                                       label="Password"
                                       onChange={ev => setPassword(ev.target.value)} value={password}
                                       autoComplete="current-password"
                                       InputLabelProps={{shrink: true}}
                                       required/>
                </Box>
                <Stack direction="row" spacing={2} useFlexGap justifyContent="flex-end">
                    <Button type="button" variant="text" component={NavLink} to="/reset-password">
                        Forgot Password
                    </Button>
                    <Button type="submit" variant="contained">Sign In</Button>
                </Stack>
            </Stack>
        </Box>
    );
}

export default LoginLocal;
