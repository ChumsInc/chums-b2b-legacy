import React, {ChangeEvent} from 'react';
import {TextInputChangeHandler} from "../generic-types";

const toggleYN = (state:string) => state === 'Y' ? 'N' : 'Y';

/*
@TODO: Add way to link to intranet store map to preview location.
@TODO: Will require rework of intranet store map before going live with feature.
 */

export interface StoreMapToggleProps<T = any> {
    id: string;
    field: keyof T|null;
    value?: 'Y'|'N'|null;
    onChange: (arg:TextInputChangeHandler) => void;
    readOnly: boolean;
}
const StoreMapToggle = ({id, field, value, onChange, readOnly = false}:StoreMapToggleProps) => {
    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => onChange({field, value: ev.target.checked ? 'Y' : 'N'});
    return (
        <div className="form-check form-check-inline">
            <input type="checkbox" className="form-check-input" id={id}
                   disabled={readOnly}
                   onChange={changeHandler}
                   checked={value === 'Y'}/>
            <label className="form-check-label" htmlFor={id}>Show on Chums.com store map?</label>
        </div>
    )
};

export default StoreMapToggle;
