import React from 'react';
import {useSelector} from "react-redux";
import Marquee from "../../components/Marquee";
import {selectActiveMessages} from "./index";

const SiteMessages = () => {
    const messages = useSelector(selectActiveMessages);
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
