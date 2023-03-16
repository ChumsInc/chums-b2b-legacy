import React, {ChangeEvent, SelectHTMLAttributes} from 'react';
import Select from "../common-components/Select";
import {useSelector} from 'react-redux';
import {selectCustomerShipToAddresses} from "../selectors/customer";
import {SelectChangeHandler} from "../generic-types";

export interface ShipToSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
    value: string | null;
    defaultName?: string;
    onChange: (shipToCode: string | null) => void;
}

const ShipToSelect = ({value, defaultName, onChange, ...props}: ShipToSelectProps) => {
    const shipToAddresses = useSelector(selectCustomerShipToAddresses);
    const changeHandler = ({value}: SelectChangeHandler) => {
        onChange(value ?? null);
    }

    if (!shipToAddresses.length) {
        return null;
    }
    return (
        <Select onChange={changeHandler} value={value ?? ''} {...props}>
            <option value="">{defaultName}</option>
            {shipToAddresses.map(shipTo => (
                <option key={shipTo.ShipToCode} value={shipTo.ShipToCode}>
                    [{shipTo.ShipToCode || 'Billing'}] {shipTo.ShipToName}, {shipTo.ShipToCity} {shipTo.ShipToState}
                </option>
            ))}
        </Select>
    );
}

export default ShipToSelect;
