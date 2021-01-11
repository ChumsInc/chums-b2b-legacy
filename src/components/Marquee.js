import React from 'react';

const Marquee = ({message}) => {
    return (
        <div className="marquee">
            <span className="message">{message}</span>
        </div>
    )
};

export default Marquee;