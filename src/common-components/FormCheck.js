import React from 'react';
import classNames from 'classnames';

const FormCheck = ({label, checked, onChange, inline = false, type="radio"}) => {
    const className = {
        'form-check': true,
        'form-check-inline': inline === true
    };
    return (
        <div className={classNames(className)}>
            <input className="form-check-input" type={type} checked={checked} onChange={onChange} />
            <label className="form-check-label" onClick={onChange}>
                {!checked && (<span>{label}</span>)}
                {!!checked && (<strong>{label}</strong>)}
            </label>
        </div>
    )
};

export default FormCheck;
