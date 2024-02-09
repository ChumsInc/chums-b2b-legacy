import React, {useState} from 'react';
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import {DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import {useAppDispatch} from "../app/configureStore";
import Stack from "@mui/material/Stack";
import ShipToSelect from "../ducks/customer/components/ShipToSelect";

const DuplicateCartAlert = ({open, SalesOrderNo, shipToCode, loading = false, onConfirm, onCancel}: {
    open: boolean;
    SalesOrderNo: string;
    shipToCode?: string|null;
    loading?: boolean;
    onConfirm: (cartName:string, shipToCode:string) => void;
    onCancel: () => void;
}) => {
    const [cartName, setCartName] = useState('');
    const [shipTo, setShipTo] = useState<string>(shipToCode ?? '');
    return (
        <Dialog open={open} onClose={onCancel} title="Confirm">
            <DialogTitle>Duplicate SO# {SalesOrderNo}?</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to duplicate order #{SalesOrderNo}?</DialogContentText>
                <Alert severity="info">
                    <div>Any discontinued items will no longer be available. Please check your new order for
                        accuracy.</div>
                    <div>Comments will not copy to the new order - you may need to add those manually, or copy them
                        from this order.</div>
                </Alert>
                {loading && <LinearProgress variant="indeterminate"/>}
                <Stack spacing={2} direction="column">
                    <TextField autoFocus label="New Cart Name" type="text" fullWidth variant="standard"
                               value={cartName} onChange={(ev) => setCartName(ev.target.value)}/>
                    <ShipToSelect value={shipTo ?? ''} onChange={(shipToCode) => setShipTo(shipToCode)} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={() => onConfirm(cartName, shipTo)} disabled={!cartName}>Duplicate Order</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DuplicateCartAlert;
