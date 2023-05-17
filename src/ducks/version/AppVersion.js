import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changedSelector, versionSelector, minCheckInterval} from "./index";
import {fetchVersion, ignoreVersion} from "./actions";


const AppVersion = () => {
    const dispatch = useDispatch();
    const changed = useSelector(changedSelector);
    const version = useSelector(versionSelector);
    const [intervalId, setIntervalId] = useState(0)
    useEffect(() => {
        dispatch(fetchVersion(true));
        if (global.document) {
            const intervalId = window.setInterval(() => dispatch(fetchVersion()), minCheckInterval);
            setIntervalId(intervalId);
        }
        return () => {
            window.clearInterval(intervalId);
        }
    }, [])

    if (global.document) {
        document.addEventListener('visibilitychange', () => {
            dispatch(fetchVersion());
        });
    }

    const onDismissUpdate = () => {
        dispatch(ignoreVersion());
    }

    const onUpdate = () => {
        window.location.reload();
    }


    return (
        <div>
            <span onClick={() => dispatch(fetchVersion(true))} className="app__version">Version: {version}</span>
            {changed && (
                <div onClick={onUpdate} className="app__version-popup">
                    <strong>Update Available! Click here to refresh</strong>
                    <span className="ms-3 close" onClick={onDismissUpdate}/>
                </div>
            )}
        </div>
    );
}

export default AppVersion;
