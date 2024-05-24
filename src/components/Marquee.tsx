import React from 'react';

const Marquee = ({message}:{message: string}) => {
    return (
        <div className="marquee">
            <span className="message">{message}</span>
        </div>
    )
};

export default Marquee;
