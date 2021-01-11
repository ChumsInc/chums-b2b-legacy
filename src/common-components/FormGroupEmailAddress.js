import React from 'react';
import FormGroupTextInput from "./FormGroupTextInput";

const FormGroupEmailAddress = ({
                                   field, value, onChange, label = '', colWidth = 0,
                                   allowAdd = false, onAdd, forwardRef, ...props
                               }) => {
    const appendButtons = [];
    if (allowAdd && value.length > 0 && props.maxLength > 6) {
        appendButtons.push(
            <button type="button" className="input-group-text btn-outline-secondary" onClick={() => onAdd()}>
                <span className="material-icons">add</span>
            </button>
        )
    }
    if (value.length > 0) {
        appendButtons.push(
            <button type="button" className="input-group-text btn-outline-secondary" onClick={() => onChange({field, value: ''})}>
                <span className="material-icons">clear</span>
            </button>
        )
    }
    return (
        <FormGroupTextInput type="email" colWidth={colWidth} label={label}
                            value={value} onChange={onChange} field={field}
                            prepend={<span className="input-group-text ">@</span>}
                            append={appendButtons}
                            forwardRef={forwardRef}
                            {...props}/>
    )
};

export default FormGroupEmailAddress;
