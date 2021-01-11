import React from 'react';

const toggleYN = (state) => state === 'Y' ? 'N' : 'Y';

/*
@TODO: Add way to link to intranet store map to preview location.
@TODO: Will require rework of intranet store map before going live with feature.
 */
const StoreMapToggle = ({field, value, onChange}) => {
    const onClick = () => onChange({field, value: toggleYN(value)});

    return (
        <div className="form-check form-check-inline">
            <input type="checkbox" className="form-check-input"
                   onChange={() => onClick()}
                   checked={value === 'Y'}/>
            <label className="form-check-label" onClick={() => onClick()}>Show on Chums.com store map?</label>
        </div>
    )
};

export default StoreMapToggle;
