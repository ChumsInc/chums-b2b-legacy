import React from 'react';
import TextInput from "../common-components/TextInput";
import classNames from "classnames";

const ItemQuantityInput = ({QuantityOrdered, changed = false, onChange, onSave}) => {
    return (
        <div className="input-group">
            <TextInput value={QuantityOrdered} field="QuantityOrdered" type="number" min={0}
                       onChange={(({field, value}) => onChange({[field]: value}))} />
            <div className="input-group-append">
                <button className={classNames("btn btn-sm", {'btn-outline-success': !changed, 'btn-warning': changed})} onClick={() => onSave()}><span className="material-icons">check</span></button>
            </div>
        </div>
    )
};


export default ItemQuantityInput;
