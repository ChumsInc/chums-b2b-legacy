import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect, useSelector} from 'react-redux';
import {confirmEmailSent} from "../../../actions/salesOrder";
import ModalAlert from "@/components/ModalAlert";
import ProgressBar from "@/components/ProgressBar";
import {useAppDispatch} from "@/app/configureStore";
import {selectSendEmailError, selectSendEmailResponse, selectSendEmailStatus} from "@/ducks/salesOrder/selectors";
import {closeEmailResponse} from "@/ducks/salesOrder/actions";
import Dialog from "@mui/material/Dialog";
import {Button, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

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
            <DialogTitle>Send Order Email</DialogTitle>
            <DialogContent>
                {status === 'pending' && <LinearProgress variant="indeterminate" />}
                {status === 'fulfilled' && <LinearProgress variant="determinate" value={100} /> }
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
