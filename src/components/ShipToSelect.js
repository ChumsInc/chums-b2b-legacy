import React from 'react';
import Select from "../common-components/Select";
import {useDispatch, useSelector} from 'react-redux';
import {selectCustomerShipToAddresses, selectPermittedShipToAddresses} from "../ducks/customer/selectors";
import {selectCustomerPermissions} from "../ducks/user/selectors";

// export interface ShipToSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
//     value: string | null;
//     defaultName?: string;
//     onChange: (shipToCode: string | null) => void;
// }
//

const ShipToSelect = ({value, defaultName, onChange, ...props}) => {
    const dispatch = useDispatch();
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);
    const permissions = useSelector(selectCustomerPermissions);


    const changeHandler = ({value}) => {
        onChange(value ?? null);
    }

    if (!shipToAddresses.length) {
        return null;
    }
    return (
        <Select onChange={changeHandler} value={value ?? ''} {...props}>
            {!!defaultName && <option value={null}>{defaultName}</option>}
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
