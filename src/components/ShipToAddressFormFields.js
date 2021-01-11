import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddressFormFields from "./AddressFormFields";
import {shipToAddressShape, shipToAddressDefaults} from "../constants/myPropTypes";


const fieldMapper = {
    ShipToAddress1: 'AddressLine1',
    ShipToAddress2: 'AddressLine2',
    ShipToAddress3: 'AddressLine3',
    ShipToCity: 'City',
    ShipToState: 'State',
    ShipToCountryCode: 'CountryCode',
    ShipToZipCode: 'ZipCode',
    EmailAddress: 'EmailAddress',
    TelephoneNo: 'TelephoneNo',
    TelephoneExt: 'TelephoneExt',
    getField: (field) => {
        const [key] = Object.keys(fieldMapper).filter(key => fieldMapper[key] === field).map(key => key);
        return key;
    }
};

export default class ShipToAddressFormFields extends Component {
    static propTypes = {
        ...shipToAddressShape,
        readOnly: PropTypes.bool,
        showStoreMapOption: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        ...shipToAddressDefaults,
        readOnly: false,
        showStoreMapOption: false,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange({field, value}) {
        this.props.onChange({field: fieldMapper.getField(field), value});
    }

    render() {
        const {
            ShipToAddress1, ShipToAddress2, ShipToAddress3, ShipToCity, ShipToState, ShipToZipCode, ShipToCountryCode,
            ...props
        } = this.props;
        return (
            <AddressFormFields
                AddressLine1={ShipToAddress1} AddressLine2={ShipToAddress2} AddressLine3={ShipToAddress3}
                City={ShipToCity} State={ShipToState} ZipCode={ShipToZipCode} CountryCode={ShipToCountryCode}
                {...props}
                onChange={this.onChange}/>
        );
    }
}
