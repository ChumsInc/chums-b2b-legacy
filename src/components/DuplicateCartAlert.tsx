import React, {useState} from 'react';
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import {DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import {useAppDispatch} from "../app/configureStore";

const DuplicateCartAlert = ({open, SalesOrderNo, loading = false, onConfirm, onCancel}: {
    open: boolean;
    SalesOrderNo: string;
    loading?: boolean;
    onConfirm: (cartName:string) => void;
    onCancel: () => void;
}) => {
    const [cartName, setCartName] = useState('');
    return (
        <Dialog open={open} onClose={onCancel} title="Confirm">
            <DialogTitle>Duplicate SO# {SalesOrderNo}?</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to duplicate order #{SalesOrderNo}?</DialogContentText>
                <DialogContentText>
                    <Alert severity="info">
                        <div>Any discontinued items will no longer be available. Please check your new order for
                            accuracy.</div>
                        <div>Comments will not copy to the new order - you may need to add those manually, or copy them
                            from this order.</div>
                    </Alert>
                    {loading && <LinearProgress variant="indeterminate"/>}
                </DialogContentText>
                <TextField autoFocus label="New Cart Name" type="text" fullWidth variant="standard"
                           value={cartName} onChange={(ev) => setCartName(ev.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={() => onConfirm(cartName)} disabled={!cartName}>Duplicate Order</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DuplicateCartAlert;
