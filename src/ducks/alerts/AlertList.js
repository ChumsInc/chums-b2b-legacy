import React from 'react';
import Alert from "../../common-components/Alert";
import {useDispatch, useSelector} from 'react-redux';
import {dismissAlert, selectAlerts} from "./index";

const AlertList = () => {
    const dispatch = useDispatch();
    const alerts = useSelector(selectAlerts);

    const dismissHandler = (id) => {
        dispatch(dismissAlert(id));
    }
    return (
        <>
            {alerts.map((alert) => <Alert key={alert.id} {...alert} onDismiss={dismissHandler}/>)}
        </>
    )
}

export default AlertList;
