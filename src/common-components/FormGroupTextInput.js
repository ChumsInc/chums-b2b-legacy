import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FormGroup from "./FormGroup";
import TextInput from "./TextInput";


export default class FormGroupTextInput extends PureComponent {
    static propTypes = {
        label: PropTypes.string,
        formGroupClassName: PropTypes.string,
        labelClassName: PropTypes.string,
        colWidth: PropTypes.number,
        type: PropTypes.oneOf(['color', 'date', 'datetime-local', 'email', 'file', 'hidden', 'image',
            'month', 'number', 'password', 'search', 'tel', 'text', 'time', 'url', 'week'
        ]),
        onChange: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        field: PropTypes.string,
        className: PropTypes.string,
        id: PropTypes.string,
        helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        forwardRef: PropTypes.object,
    };

    static defaultProps = {
        label: FormGroup.defaultProps.label,
        colWidth: FormGroup.defaultProps.colWidth,
        formGroupClassName: FormGroup.defaultProps.className,
        labelClassName: FormGroup.defaultProps.labelClassName,
        type: 'text',
        value: '',
        field: null,
        className: '',
        id: null,
        helpText: null,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        const {onChange, colWidth, value, className, id, labelClassName, formGroupClassName, label, field, placeholder,
            children, inline, readOnly, helpText, forwardRef, ...rest} = this.props;
        return (
            <FormGroup colWidth={colWidth} inline={inline}
                       className={formGroupClassName} htmlFor={id}
                       labelClassName={labelClassName} label={label} helpText={helpText} >
                <TextInput id={id} className={className}
                           value={value} field={field}
                           onChange={this.onChange}
                           placeholder={placeholder || label || ''}
                           readOnly={readOnly}
                           ref={forwardRef}
                           {...rest}/>
                {children}
            </FormGroup>
        );
    }
}
