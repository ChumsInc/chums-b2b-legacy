import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {minCheckInterval, selectShouldAlertVersion, selectVersion} from "./index";
import {ignoreVersion, loadVersion} from "./actions";
import {useAppDispatch} from "../../app/configureStore";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {useIsSSR} from "../../hooks/is-server-side";


const AppVersion = () => {
    const isSSR = useIsSSR();
    const dispatch = useAppDispatch();
    const version = useSelector(selectVersion);
    const shouldAlert = useSelector(selectShouldAlertVersion);
    const [intervalId, setIntervalId] = useState(0)


    const onUpdateVersion = (force = false) => {
        dispatch(loadVersion(force));
    }

    const visibilityChangeHandler = () => {
        onUpdateVersion()
    }

    const onDismissUpdate = (ev:React.SyntheticEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        dispatch(ignoreVersion());
    }

    const onUpdate = () => {
        window.location.reload();
    }

    useEffect(() => {
        if (isSSR) {
            return;
        }

        if (!version) {
            onUpdateVersion();
        }
        const intervalId = window.setInterval(onUpdateVersion, minCheckInterval);
        setIntervalId(intervalId);
        return () => {
            if (isSSR) {
                return;
            }
            window.clearInterval(intervalId);
            window.removeEventListener('visibilityChange', visibilityChangeHandler)
        }
    }, [])

    if (isSSR) {
        return;
    }

    // if (!isSSR && global.document) {
    //     document?.addEventListener('visibilitychange', visibilityChangeHandler);
    // }

    return (
        <div>
            <span onClick={() => onUpdateVersion(true)} className="app__version">Version: {version}</span>
            <Snackbar open={shouldAlert} autoHideDuration={10000}>
                <Alert severity="info" sx={{width: '100%'}} onClose={onDismissUpdate} onClick={onUpdate}>
                    <strong>Update Available! Click here to refresh</strong>
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AppVersion;
