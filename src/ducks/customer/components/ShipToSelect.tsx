import React, {SelectHTMLAttributes} from 'react';
import Select from "@/common-components/Select";
import {useSelector} from 'react-redux';
import {selectCustomerPermissions, selectPermittedShipToAddresses} from "@/ducks/customer/selectors";
import {FieldValue} from "@/types/generic";

export interface ShipToSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
    value: string | null;
    defaultName?: string;
    onChange: (shipToCode: string) => void;
}


const ShipToSelect = ({value, defaultName, onChange, ...props}: ShipToSelectProps) => {
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);
    const permissions = useSelector(selectCustomerPermissions);


    const changeHandler = ({value}: FieldValue) => {
        onChange(value ?? null);
    }

    if (!shipToAddresses.length) {
        return null;
    }
    return (
        <Select onChange={changeHandler} value={value ?? ''} {...props}>
            {!!defaultName && <option value={''}>{defaultName}</option>}
            {shipToAddresses
                .filter(shipTo => shipTo.ShipToCode !== '' || permissions?.billTo)
                .map(shipTo => (
                    <option key={shipTo.ShipToCode} value={shipTo.ShipToCode}>
                        [{shipTo.ShipToCode || 'Billing'}] {shipTo.ShipToName}, {shipTo.ShipToCity} {shipTo.ShipToState}
                    </option>
                ))}
        </Select>
    );
}

export default ShipToSelect;
