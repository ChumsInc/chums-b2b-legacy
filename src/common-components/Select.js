import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Select extends PureComponent {
    static propTypes = {
        field: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        onChange: PropTypes.func.isRequired,
        className: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.any,
            text: PropTypes.string,
        }))
    };

    static defaultProps = {
        options: [],
        className: 'form-select-sm'
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev) {
        const {field, onChange} = this.props;
        onChange({field, value: ev.target.value});
    }

    render() {
        const {field, value, onChange, className, options, children, readOnly, disabled, ...rest} = this.props;
        return (
            <select className={classNames("form-select", className)}
                    value={value} disabled={readOnly || disabled}
                    onChange={this.onChange} {...rest}>
                {children}
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.text || opt.value}</option>)}
            </select>
        );
    }

}


