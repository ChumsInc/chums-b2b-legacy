import React from 'react';
import TextInput from "../common-components/TextInput";
import {TextInputChangeHandler} from "../generic-types";

export interface OrderFilterProps {
    filter: string,
    onChange: (value: string) => void;
    onReload: () => void;
    children?: React.ReactNode;
}

const OrderFilter = ({filter = '', onChange, onReload, children}: OrderFilterProps) => {
    const changeHandler = (arg: TextInputChangeHandler) => onChange(arg.value.toString());

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
                <button className="btn btn-sm btn-primary mr-1" onClick={() => onReload()}>Refresh</button>
            </div>
            {children}
        </div>
    )
};

export default OrderFilter;
