import React, {ChangeEvent, HTMLAttributes, InputHTMLAttributes} from 'react';
import FormGroup from "@/common-components/FormGroup";
import {FieldValue} from "@/types/generic";

const FormGroupEmailAddress = ({
                                   field, value, onChange, label = '', labelProps, colWidth = 8,
                                   allowAdd = false, onAdd, inputProps
                               }: {
    colWidth: number;
    label: string;
    labelProps?: HTMLAttributes<HTMLLabelElement>;
    field?: string;
    value: string;
    allowAdd: boolean;
    onChange: (arg: FieldValue) => void;
    onAdd: () => void;
    inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

}) => {
    const appendButtons = [];
    if (allowAdd && value.length > 0 && (inputProps?.maxLength ?? 255) > 6) {
        appendButtons.push(
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onAdd()}>
                <span className="bi-person-add"/>
            </button>
        )
    }
    if (value.length > 0) {
        appendButtons.push(
            <button type="button" className="btn btn-sm btn-outline-secondary"
                    onClick={() => onChange({field: field ?? '', value: ''})}>
                <span className="bi-x"/>
            </button>
        )
    }
    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => onChange({field: field ?? '', value: ev.target.value});

    return (
        <FormGroup colWidth={colWidth} label={label} labelProps={labelProps} sx={{my: 1}}>
            <div className="input-group input-group-sm">
                <div className="input-group-text">@</div>
                <input type="email" className="form-control form-control-sm" value={value} onChange={changeHandler} {...inputProps}/>
                {appendButtons}
            </div>
        </FormGroup>
    )
};

export default FormGroupEmailAddress;
