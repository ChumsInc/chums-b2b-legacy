import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {selectSalesOrderHeader} from "@/ducks/salesOrder/selectors";
import {ButtonProps} from "@mui/material/Button";
import {Button, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {useAppDispatch} from "@/app/configureStore";
import {removeCart} from "@/ducks/cart/actions";
import {useNavigate} from "react-router";
import {selectCurrentCustomer} from "@/ducks/user/selectors";
import {generatePath} from "react-router-dom";
import {customerSlug} from "@/utils/customer";
import LinearProgress from "@mui/material/LinearProgress";

export default function DeleteCartButton({disabled, children, ...rest}: ButtonProps) {
    const dispatch = useAppDispatch();
    const header = useSelector(selectSalesOrderHeader);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const clickHandler = () => {
        setOpen(true);
    }
    const closeHandler = () => setOpen(false);

    const confirmHandler = async () => {
        console.log('confirmHandler()', header);
        setBusy(true);
        const res = await dispatch(removeCart(header!));
        console.log('confirmHandler', res);
        setOpen(false);
        setBusy(false);
        const path = generatePath('/account/:customerSlug/carts', {
            customerSlug: customerSlug(header!)
        })
        console.log('confirmHandler()', path);
        navigate(path);
    }

    if (!header || header.OrderType !== 'Q') {
        return null;
    }

    return (
        <>
            <Button type="button" variant="text" color="error"
                    onClick={clickHandler} disabled={disabled} {...rest}>
                {children ?? 'Delete Cart'}
            </Button>
            <Dialog onClose={closeHandler} open={open} maxWidth="sm">
                <DialogTitle>Delete Cart #{header.SalesOrderNo}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete cart <strong>{header.CustomerPONo}</strong>?
                    </DialogContentText>
                    {busy && <LinearProgress variant="indeterminate" />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmHandler} disabled={busy} color="error">Delete</Button>
                    <Button onClick={closeHandler} disabled={busy} autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
