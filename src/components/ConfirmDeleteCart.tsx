import React, {useId} from 'react';
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from "@mui/material/Button";

const ConfirmDeleteCart = ({open, salesOrderNo, onConfirm, onCancel}: {
    open: boolean;
    salesOrderNo: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const idTitle = useId();
    const idContent = useId();
    if (!salesOrderNo) {
        return null;
    }
    return (
        <Dialog fullScreen={fullScreen}
                open={open} onClose={onCancel} aria-labelledby={idTitle} aria-describedby={idContent}>
            <DialogTitle id={idTitle}>
                Confirm Deletion?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id={idContent}>
                    Are you sure you want to delete Cart #{salesOrderNo} from your account? This action
                    cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} autoFocus>Cancel</Button>
                <Button color="error" onClick={onConfirm}>Delete Cart</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteCart;
