/**
 * Created by steve on 1/31/2017.
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import format from 'date-fns/format';
import parse from 'date-fns/parseJSON';
import parseISO from 'date-fns/parseISO';
import isDate from 'date-fns/isDate';
import {noop} from "../utils/general";


class DatePicker extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
        readOnly: PropTypes.bool,
        disabled: PropTypes.bool,
        minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
        small: PropTypes.bool,
        large: PropTypes.bool,
        forwardedRef: PropTypes.any,
    };

    static defaultProps = {
        value: new Date(),
        readOnly: false,
        disabled: false,
        small: true,
        large: false,
        onChange: noop,
    };

    static format(value = new Date()) {
        return format(parse(value || new Date), 'yyyy-MM-dd');
    }


    state = {
        selected: new Date(),
        display: new Date(),
        visible: false,
        propsValue: null,
        dateMenuVisible: false,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev) {
        this.props.onChange(parseISO(ev.target.value));
    }

    render() {
        const {selected, visible} = this.state;
        const {
            className, large, small, forwardedRef, disabled, readOnly,
            value, minDate} = this.props;

        const classnames = classNames("form-control", className, {'form-control-lg': large, 'form-control-sm': small});
        const dateFormat = disabled || readOnly ? 'dd MMM yyyy' : 'yyyy-MM-dd';
        let date = value;
        let dateValue = value;
        if (!!value && !isDate(value)) {
            try {
                date = parse(value)
            } catch(err) {
                date = parseISO(value);
            }
        }
        if (isDate(date) && date.valueOf() === 0) {
            dateValue = null;
        }
        return (
            <input type={disabled || readOnly ? 'text' : 'date'}
                   ref={forwardedRef}
                   className={classnames}
                   value={!!value ? format(date, dateFormat) : ''}
                   disabled={disabled} readOnly={readOnly}
                   min={!!minDate ? format(minDate, 'yyyy-MM-dd') : null}
                   onChange={this.onChange} />
        )
    }
}

export default DatePicker;
