import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from "react-router";
import {useAppDispatch} from "../../../app/configureStore";
import {selectSignUpProfile, selectSignUpStatus} from "../../sign-up/selectors";
import {loadSignUpProfile} from "../../sign-up/actions";
import LinearProgress from "@mui/material/LinearProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PasswordForm from "./PasswordForm";
import {setNewPassword} from "../actions";
import {ChangePasswordResponse, SetNewPasswordProps} from "../types";
import Alert from "@mui/material/Alert";
import {isErrorResponse} from "../../../utils/typeguards";
import {useIsSSR} from "../../../hooks/is-server-side";

const ResetPassword = () => {
    const dispatch = useAppDispatch();
    const isSSR = useIsSSR();
    const params = useParams<{ hash: string; key: string }>();
    const [hash, setHash] = useState(params.hash ?? new URLSearchParams(document?.location?.search).get('h') ?? '')
    const [key, setKey] = useState(params.key ?? new URLSearchParams(document?.location?.search).get('key') ?? '');
    const [alert, setAlert] = useState<string | null>(null);
    const profile = useSelector(selectSignUpProfile);
    const loading = useSelector(selectSignUpStatus);
    const navigate = useNavigate();

    useEffect(() => {
        if (isSSR) {
            return;
        }
        const search = new URLSearchParams(document?.location?.search);
        if (!hash) {
            setHash(search.get('h') ?? '');
        }
        if (!key) {
            setKey(search.get('key') ?? '');
        }
    }, [document?.location?.search]);

    useEffect(() => {
        if (isSSR) {
            return;
        }
        if (!hash || !key) {
            return;
        }
        dispatch(loadSignUpProfile({hash, key}))
            .then(res => {
                const payload = res.payload;
                if (isErrorResponse(payload)) {
                    setAlert(payload.error ?? 'An error occurred while loading the request.');
                }
            })
    }, [hash, key]);

    const onSetPassword = async (arg: Pick<SetNewPasswordProps, 'newPassword'>) => {
        const res = await dispatch(setNewPassword(({...arg, hash, key})));
        const payload: ChangePasswordResponse | null = res.payload as ChangePasswordResponse | null;
        if (payload?.success) {
            navigate('/login', {state: {message: 'Your password has been updated. Please log in again.'}});
        } else if (payload?.error) {
            setAlert(payload.error);
        }
    }

    const cancelHandler = () => {
        navigate('/login');
    }


    return (
        <Container maxWidth="sm">
            <Typography component="h1" variant="h1" sx={{my: 3}}>Chums B2B Portal</Typography>
            {loading !== 'idle' && <LinearProgress variant="indeterminate"/>}
            {profile && (<Typography component="h2" variant="h2">Welcome {profile?.name}</Typography>)}
            <Stack direction="column" spacing={2}>
                {!!alert && (<Alert severity="warning" title="Reset password error:">{alert}</Alert>)}
                <PasswordForm isPasswordReset={true} disabled={!profile} email={profile?.email}
                              onSubmit={onSetPassword} onCancel={cancelHandler}/>
            </Stack>
        </Container>
    )
}

export default ResetPassword;
