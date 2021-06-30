/**
 * Created by steve on 9/6/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { STATES_USA, TERRITORIES_CANADA } from '../constants/states';
import {isUSA, isCanada} from '../utils/customer';


export default class StateSelect extends Component {
    static propTypes = {
        countryCode: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        field: PropTypes.string,
        readOnly: PropTypes.bool,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
    };
    static defaultProps = {
        countryCode: 'USA',
        value: '',
        readOnly: false,
        disabled: false,
        required: false,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }


    onChange(ev) {
        const {field} = this.props;
        this.props.onChange({field, value: ev.target.value});
    }

    render() {
        let options = [];
        const {countryCode, field, ...rest} = this.props;
        if (countryCode === 'USA' || countryCode === 'US') {
            options = STATES_USA.map(state => {
                return (
                    <option key={state.code} value={state.code}>{state.name}</option>
                );
            });
        } else if (countryCode === 'CAN' || countryCode === 'CA') {
            options = TERRITORIES_CANADA.map(territory => {
                return (
                    <option key={territory.code} value={territory.code}>{territory.name}</option>
                );
            });
        } else {
            return (
                <input {...otherProps} onChange={this.onChange.bind(this)} />
            )
        }

        return (
            <select className="form-select form-select-sm" {...rest} onChange={this.onChange.bind(this)}>
                <option value=''>Select One</option>
                {['USA', 'US'].includes(countryCode)
                    && STATES_USA.map(({code, name}) => <option key={code} value={code}>{name}</option> )}
                {['CAN', 'CA'].includes(countryCode)
                    && TERRITORIES_CANADA.map(({code, name}) => <option key={code} value={code}>{name}</option> )}
            </select>
        )
    }
}
