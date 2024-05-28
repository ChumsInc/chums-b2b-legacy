/**
 * Created by steve on 1/31/2017.
 */

import React from 'react';
import dayjs from "dayjs";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const DatePicker = ({value, onChange, readOnly, disabled, minDate}) => {
    const changeHandler = (value) => {
        const returnValue = dayjs(value)?.toDate()?.toJSON() ?? null;
        onChange({value: returnValue})
    }
    return (
        <ReactDatePicker selected={value} onChange={changeHandler} className="form-control form-control-sm"
                         wrapperClassName="d-block"
                         readOnly={readOnly} disabled={disabled}
                         minDate={minDate} maxDate={dayjs(minDate).add(1, 'year')}/>
    )
}

export default DatePicker
// export default OldDatePicker;
