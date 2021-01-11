import React from 'react';
import FormGroupTextInput from "../common-components/FormGroupTextInput";

const OrderFilter = ({filter = '', onChange, onReload, allowNew = false, onNew}) => {
    return (
        <div className="form-inline mb-1">
            <FormGroupTextInput onChange={({value}) => onChange(value)} value={filter} label="Search" placeholder="Order or PO #"/>
            <button className="btn btn-sm btn-primary mr-1" onClick={() => onReload()}>Refresh</button>
            {allowNew && (
                <button className="btn btn-sm btn-outline-primary mr-1" onClick={() => onNew()}>New Cart</button>
            )}
        </div>
    )
};

export default OrderFilter;
