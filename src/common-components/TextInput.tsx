import React, {ChangeEvent, InputHTMLAttributes} from 'react';
import classNames from 'classnames';
import {noop} from '../utils/general';
import {FieldValue} from "../types/generic";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    field: string;
    onChange?: (arg:FieldValue) => void;
    helpText?: string;
}
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const {type, value, onChange = noop, field, className = '', helpText = null, ...rest} = props;
    const _className = {
        'form-control': !className.split(' ').includes('form-control-plaintext'),
        'form-control-sm': !className.split(' ').includes('form-control-lg'),
    };

    const changeValue = (ev:ChangeEvent<HTMLInputElement>) => {
        switch (props.type) {
            case 'number':
            return ev.target.valueAsNumber;
        default:
            // console.log(ev.target.value);
            return ev.target.value
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"');
        }
    };

    const pattern = rest.pattern || "^[\x20-\xFF]*$"; // matches space to ÿ (seems to be the valid limit in Sage)
    let invalidCharacterMessage = null;
    if (type === 'string' && !rest.pattern) {
        try {
            const re = new RegExp(pattern);
            if (typeof value === 'string' && !re.test(value)) {
                invalidCharacterMessage = (<span><strong>Yikes:</strong> Your input contains invalid characters</span>);
            }
        } catch (err) {
        }
    }

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        onChange({field: field ?? '', value: changeValue(ev)});
    }

    return (
        <>
            <input type={type} value={value} className={classNames(_className, className)}
                   pattern={pattern}
                   onChange={changeHandler} ref={ref} {...rest} />
            {helpText && <small className="form-text text-muted">{helpText}</small>}
            {invalidCharacterMessage && <small className="form-text text-danger">{invalidCharacterMessage}</small>}
        </>
    );
});

export default TextInput;
