import React, {useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import Marquee from "../../components/Marquee";
import {selectActiveMessages, selectMessagesLoaded} from "./selectors";
import {useAppDispatch} from "../../app/configureStore";
import {loadMessages} from "./actions";
import {useIsSSR} from "../../hooks/is-server-side";

const messagesMaxAge  = 1000 * 60 * 30; //30 minutes

const SiteMessages = () => {
    const dispatch = useAppDispatch();
    const isSSR = useIsSSR();
    const messages = useSelector(selectActiveMessages);
    const loaded = useSelector(selectMessagesLoaded);
    const timerRef = useRef<number>(0);

    useEffect(() => {
        if (isSSR) {
            return;
        }

        timerRef.current = window.setInterval(() => {
            dispatch(loadMessages());
        }, messagesMaxAge);

        return () => {
            if (isSSR) {
                return;
            }
            if (global.window) {
                window.clearInterval(timerRef.current)
            }
        }
    }, [messages, loaded]);

    if (!messages.length) {
        return null;
    }
    return (
        <div className="site-message">
            <Marquee message={messages.map(m => m.message).join('; ')}/>
        </div>
    )
}

export default SiteMessages;
