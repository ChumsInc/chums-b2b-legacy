import React from 'react';
import {ButtonProps} from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {selectSalesOrder, selectSalesOrderActionStatus, selectSendEmailStatus} from "../selectors";
import {Button} from "@mui/material";
import SendEmailModal from "./SendEmailModal";
import {sendOrderEmail} from "../actions";

export interface SendEmailButtonProps extends ButtonProps {
    salesOrderNo:string;
}
export default function SendEmailButton({salesOrderNo, onClick, disabled, ...props}:SendEmailButtonProps) {
    const dispatch = useAppDispatch();
    const header = useAppSelector((state) => selectSalesOrder(state, salesOrderNo));
    const loadingStatus = useAppSelector(state => selectSalesOrderActionStatus(state, salesOrderNo));
    const sendEmailStatus = useAppSelector(selectSendEmailStatus);

    const sendEmailHandler = async (ev:React.MouseEvent<HTMLButtonElement>) => {
        if (!header) {
            return;
        }
        await dispatch(sendOrderEmail(header));
        if (onClick) {
            onClick(ev);
        }
    }

    return (
        <>
            <Button type="button" variant="text" onClick={sendEmailHandler}
                    disabled={loadingStatus !== 'idle' || sendEmailStatus !== 'idle' || disabled} {...props}>
                Send Email
            </Button>
            <SendEmailModal/>
        </>
    )
}
