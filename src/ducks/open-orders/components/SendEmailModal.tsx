import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useAppDispatch} from "../../../app/configureStore";
import {selectSendEmailError, selectSendEmailResponse, selectSendEmailStatus} from "../selectors";
import {closeEmailResponse} from "../actions";
import Dialog from "@mui/material/Dialog";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function SendEmailModal() {
    const dispatch = useAppDispatch();
    const status = useSelector(selectSendEmailStatus);
    const error = useSelector(selectSendEmailError);
    const response = useSelector(selectSendEmailResponse);
    const [open, setOpen] = useState<boolean>(status !== 'idle');

    useEffect(() => {
        setOpen(status !== 'idle');
    }, [status]);

    const onClose = () => {
        dispatch(closeEmailResponse());
    }

    return (
        <Dialog onClose={onClose} open={open} maxWidth="sm">
            <DialogTitle>Sending proposed order email</DialogTitle>
            <DialogContent>
                {status === 'pending' && <LinearProgress variant="indeterminate"/>}
                {status === 'fulfilled' && <LinearProgress variant="determinate" value={100}/>}
                {!!error && <Alert severity="error">{error}</Alert>}
                {response && (
                    <table className="table table-sm">
                        <tbody>
                        <tr>
                            <th>From</th>
                            <td>{response.envelope.from}</td>
                        </tr>
                        <tr>
                            <th>To</th>
                            <td>{response.envelope.to.join(', ')}</td>
                        </tr>
                        <tr>
                            <th>Accepted</th>
                            <td>{response.accepted.length ? response.accepted.join(', ') : '-'}</td>
                        </tr>
                        <tr>
                            <th>Rejected</th>
                            <td>{response.rejected.length ? response.rejected.join(', ') : '-'}</td>
                        </tr>
                        </tbody>
                    </table>

                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
