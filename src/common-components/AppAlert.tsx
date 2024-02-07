import React from 'react';
import classNames from "classnames";
import {ALERT_TYPES} from '../constants/actions';
import Badge from "@mui/material/Badge";
import numeral from 'numeral';
import {BootstrapBGColor} from "../types/colors";
import Alert, {AlertProps} from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";


const AlertDismisser = ({onDismiss}: {
    onDismiss: () => void;
}) => {
    return (
        <button type="button" className="btn-close" aria-label="Close"
                onClick={() => onDismiss()}/>
    )
};

export interface AppAlertProps extends AlertProps {
    alertId?: number;
    context?: string;
    alertTitle?: string;
    message?: string;
    count?: number;
    onDismiss?: (id: number) => void;
    onDismissContext?: (context: string) => void;
}

const AppAlert = ({
                   alertId, severity, message, alertTitle, context, count, onDismiss,
                      onDismissContext,
                   children,
               }: AppAlertProps) => {

    const dismissHandler = () => {
        if (!!context && !!onDismissContext) {
            onDismissContext(context);
            return;
        }
        if (onDismiss && !!alertId) {
            onDismiss(alertId);
        }
    }

    return (
        <Alert severity={severity} onClose={dismissHandler}>
            <AlertTitle sx={{display: 'inline-block', mr: 3}}>
                <Stack direction="row" spacing={2}>
                    {!!context && (<Typography sx={{fontWeight: 700}}>[{context}]</Typography>)}
                    {!!alertTitle && (<Typography>{alertTitle || ''}</Typography>)}
                    {(count ?? 0) > 1 && <Typography variant="caption">({count})</Typography>}
                </Stack>
            </AlertTitle>
            <Typography sx={{display: 'inline-block'}} variant="body1">{message ?? children ?? 'Undefined alert'}</Typography>
        </Alert>
    )
}

export default AppAlert;
