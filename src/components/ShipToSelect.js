import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from "../common-components/Select";
import {connect} from 'react-redux';
import {accountAddressDefaults, accountAddressShape, shipToAddressPropType} from "../constants/myPropTypes";


class ShipToSelect extends Component {

    static propTypes = {
        shipToAddresses: PropTypes.arrayOf(shipToAddressPropType),
        account: PropTypes.shape(accountAddressShape),
        value: PropTypes.string,
        field: PropTypes.string,
        defaultName: PropTypes.string,
        shipToCode: PropTypes.string,
        allowBillingAddress: PropTypes.bool,
        onChange: PropTypes.func,
        readOnly: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        shipToAddresses: [],
        account: {...accountAddressDefaults},
        value: null,
        field: 'ShipToCode',
        defaultName: 'Select One',
        shipToCode: null,
        allowBillingAddress: false,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange({field, value}) {
        const {onChange} = this.props;
        if (!onChange) {
            return;
        }
        onChange({field, value});
    }

    render() {
        // props onChange, dispatch are discarded from ...rest
        const {shipToAddresses, defaultName, readOnly, disabled, field, value, account} = this.props;
        return (
            <Select onChange={this.onChange} value={value} field={field} {...{readOnly, disabled}}>
                <option value={null}>{defaultName}</option>
                {shipToAddresses.map(({ShipToCode, ShipToName, ShipToCity, ShipToState}) => (
                    <option key={ShipToCode} value={ShipToCode}>[{ShipToCode || 'Billing'}] {ShipToName}, {ShipToCity} {ShipToState}</option>
                ))}
            </Select>
        );
    }
}

const mapStateToProps = ({customer}) => {
    const {shipToAddresses, account} = customer;
    return {shipToAddresses, account}
};

export default connect(mapStateToProps)(ShipToSelect);
