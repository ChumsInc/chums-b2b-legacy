import React from 'react';
import Alert from "../../common-components/Alert";
import {useDispatch, useSelector} from 'react-redux';
import {dismissAlert, dismissContextAlert, selectAlerts, selectContextAlerts} from "./index";
import {useAppSelector} from "../../app/configureStore";

const AlertList = ({context}:{context?:string}) => {
    const dispatch = useDispatch();
    const alerts = useAppSelector((state) => selectContextAlerts(state, context));

    const dismissHandler = (id:number) => {
        dispatch(dismissAlert(id));
    }
    const contextDismissHandler = (context:string) => {
        dispatch(dismissContextAlert(context))
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
                                          onDismiss={dismissHandler}
                                          onContextDismiss={contextDismissHandler}
            />)}
        </>
    )
}

export default AlertList;
