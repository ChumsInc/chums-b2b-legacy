import React, {FormEvent, useState} from 'react';
import FormGroupTextInput from '@/common-components/FormGroupTextInput';
import Alert from "@mui/material/Alert";
import {useSelector} from 'react-redux';
import {loginUser, resetPassword} from "@/ducks/user/actions";
import PasswordInput from "@/common-components/PasswordInput";
import FormGroup from "@/common-components/FormGroup";
import {useAppDispatch} from "@/app/configureStore";
import {selectUserLoading} from "@/ducks/user/selectors";
import LinearProgress from "@mui/material/LinearProgress";
import {FieldValue} from "@/types/generic";


const LoginLocal = () => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectUserLoading);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                    <h3>Login with your credentials</h3>
                    <div><small>Login with an email and password you've provided.</small></div>
                    <FormGroupTextInput type="email"
                                        onChange={({value}: FieldValue) => setEmail(value)} value={email}
                                        autoComplete="username"
                                        label="E-Mail Address" placeholder="Your email address" required/>
                    <FormGroup label="Password">
                        <PasswordInput value={password} field="password"
                                       onChange={({value}: FieldValue) => setPassword(value)}
                                       required
                                       autoComplete="current-password"
                                       placeholder="Your password"/>

                    </FormGroup>
                    <button type="submit" className="btn btn-sm btn-primary me-3">Sign In</button>
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            onClick={() => setForgotPassword(true)}>
                        Forgot Password
                    </button>
                </>
            )}
            {forgotPassword && (
                <>
                    <h3>Reset Your Password</h3>
                    <FormGroupTextInput type="email"
                                        onChange={({value}: FieldValue) => setEmail(value)} value={email}
                                        autoComplete="username"
                                        label="E-Mail Address" placeholder="Your email address" required/>
                    <div className="row g-3">
                        <div className="col-4" />
                        <div className="col-auto">
                            <button type="submit" className="btn btn-sm btn-primary me-3">Reset Password</button>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setForgotPassword(false)}>Cancel
                            </button>
                        </div>
                    </div>
                    <Alert severity="info">An email will be sent to you so you can reset your password.</Alert>
                </>
            )}
        </form>
    );
}

export default LoginLocal;
