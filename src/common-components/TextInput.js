import React, {Fragment} from 'react';
import classNames from 'classnames';
import {noop} from '../utils/general';


const TextInput = React.forwardRef((props, ref) => {
    const {onChange = noop, field, className = '', helpText = null, ...rest} = props;
    const _className = {
        'form-control': !className.split(' ').includes('form-control-plaintext'),
        'form-control-sm': !className.split(' ').includes('form-control-lg'),
    };
    const changeValue = (ev) => {
        switch (props.type) {
        case 'number':
            return Number(ev.target.value);
        default:
            // console.log(ev.target.value);
            return ev.target.value
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"');
        }
    };

    const pattern = rest.pattern || "^[\x20-\xFF]*$"; // matches space to ÿ (seems to be the valid limit in Sage)
    let invalidCharacterMessage = null;
    if (!rest.pattern) {
        try {
            const re = new RegExp(pattern);
            if (!re.test(props.value)) {
                invalidCharacterMessage = (<span><strong>Yikes:</strong> Your input contains invalid characters</span>);
            }
        } catch(err) {
        }
    }


    return (
        <Fragment>
            <input className={classNames(_className, className)}
                   pattern={pattern}
                   onChange={ev => onChange({field, value: changeValue(ev)})} ref={ref} {...rest} />
            {helpText && <small className="form-text text-muted">{helpText}</small>}
            {invalidCharacterMessage && <small className="form-text text-danger">{invalidCharacterMessage}</small>}
        </Fragment>
    );
});

export default TextInput;
