import React from 'react';
import Alert from "../../common-components/Alert";
import {useDispatch, useSelector} from 'react-redux';
import {dismissAlert, selectAlerts} from "./index";

const AlertList = () => {
    const dispatch = useDispatch();
    const alerts = useSelector(selectAlerts);

    const dismissHandler = (id:number) => {
        dispatch(dismissAlert(id));
    }
    return (
        <>
            {alerts.map((alert) => <Alert key={alert.id}
                                          id={alert.id}
                                          count={alert.count}
                                          type={alert.type}
                                          context={alert.context}
                                          title={alert.title}
                                          message={alert.message}
                                          onDismiss={dismissHandler}/>)}
        </>
    )
}

export default AlertList;
