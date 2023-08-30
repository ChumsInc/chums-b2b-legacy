import React, {ChangeEvent, HTMLAttributes, InputHTMLAttributes} from 'react';
import FormGroup from "./FormGroup";
import {FieldValue} from "@/types/generic";
import classNames from "classnames";


export interface FormGroupTextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    labelProps?: HTMLAttributes<HTMLLabelElement>
    colWidth?: number;
    field?: string,
    onChange: (arg: FieldValue) => void;
    helpText?: string;
    children?: React.ReactNode;
}

export default function FormGroupTextInput({
                                               label,
                                               labelProps,
                                               colWidth = 8,
                                               field,
                                               value,
                                               onChange,
                                               helpText,
                                               className,
    children,
                                               ...rest
                                           }: FormGroupTextInputProps) {

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        onChange({field: field ?? '', value: ev.target.value});
    }

    return (
        <FormGroup colWidth={colWidth} label={label} labelProps={labelProps}>
            <input value={value} onChange={changeHandler}
                   className={classNames('form-control form-control-sm', className)} {...rest}/>
            {!!helpText && <div className="text-muted">{helpText}</div>}
            {children}
        </FormGroup>
    )
}
