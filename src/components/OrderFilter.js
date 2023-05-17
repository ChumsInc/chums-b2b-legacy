import React from 'react';
import TextInput from "../common-components/TextInput";

const OrderFilter = ({filter = '', onChange, onReload, children}) => {
    const changeHandler = (arg) => onChange(arg.value?.toString() ?? '');

    return (
        <div className="row g-3 mb-1">
            <div className="col-auto">
                <label className="form-label" htmlFor="order-filter--search">Search</label>
            </div>
            <div className="col-auto">
                <TextInput id="order-filter--search" value={filter} field={null}
                           onChange={changeHandler}
                           placeholder={'Order or PO #'}/>
            </div>
            <div className="col-auto">
                <button className="btn btn-sm btn-primary me-1" onClick={() => onReload()}>Refresh</button>
            </div>
            {children}
        </div>
    )
};

export default OrderFilter;
