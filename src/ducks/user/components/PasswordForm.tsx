import {FormEvent, useEffect, useState} from "react";
import {useIsSSR} from "../../../hooks/is-server-side";
import zxcvbn from 'zxcvbn'
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import {useDebounceValue} from 'usehooks-ts'

export type PasswordStrength = 'error'|'warning'|'secondary'|'info'|'success';
const strengths:PasswordStrength[] = ['error', 'warning', 'secondary', 'info', 'success'];

export interface PasswordFormProps {
    email?: string;
    requireOldPassword?: boolean;
    onSubmit?: () => void;
}
const PasswordForm = ({email, requireOldPassword}:PasswordFormProps) => {
    const isSSR = useIsSSR();
    const [oldPassword, setOldPassword] = useState<string>('');
    const [password1, setPassword1] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [pw, setPW] = useDebounceValue<string>('', 500);
    const [score, setScore] = useState<number>(0);
    const [feedBack, setFeedBack] = useState<string>('');


    useEffect(() => {
        if (isSSR) {
            return;
        }

    }, []);

    useEffect(() => {
        const result = zxcvbn(pw, [email ?? '', 'chums']);
        console.log(result);
        setScore(result.score);
        setFeedBack(result.feedback.suggestions.join('; '));
    }, [pw]);

    useEffect(() => {
        setPW(password1);
    }, [password1]);

    const submitHandler = (ev:FormEvent) => {
        ev.preventDefault();
    }

    return (
        <Stack direction="column" spacing={2} component="form" onSubmit={submitHandler}>
            {requireOldPassword && (
                <TextField type="password" label="Old Password" variant="filled"
                            fullWidth required
                           value={oldPassword} onChange={(ev) => setOldPassword(ev.target.value)} />
            )}
            <Stack direction={{xs: 'column', lg: 'row'}} spacing={2}>
                <Stack direction="column" spacing={1}>
                    <TextField type="password" label="New Password" variant="filled"
                               fullWidth required
                               value={password1} onChange={(ev) => setPassword1(ev.target.value)} helperText={feedBack} />
                    <LinearProgress variant="determinate" value={score * 25} color={strengths[score]}/>
                </Stack>
                <TextField type="password" label="Confirm New Password" variant="filled"
                           fullWidth required
                           value={password2} onChange={(ev) => setPassword2(ev.target.value)}
                           helperText={!!password2 && password2 !== password1 ? 'Your new passwords do not match' : ''} />
            </Stack>
        </Stack>
    )
}

export default PasswordForm;
