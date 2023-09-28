import React, {InputHTMLAttributes, useId} from 'react';
import classNames from "classnames";

export interface OrderFilterProps extends InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode;
}

const OrderFilter = ({value, onChange, children, placeholder, className, id, ...rest}: OrderFilterProps) => {
    const _id = useId();
    return (
        <div className="row g-3 mb-1">
            <div className="col-auto">
                <label className="form-label" htmlFor={id ?? _id}>Search</label>
            </div>
            <div className="col-auto">
                <input type="search" id={id ?? _id} value={value}
                       className={classNames("form-control form-control-sm", className)}
                       onChange={onChange}
                       placeholder={placeholder ?? 'Order or PO #'}
                       {...rest}
                />
            </div>
            {children}
        </div>
    )
};

export default OrderFilter;
