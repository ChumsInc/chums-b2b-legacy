import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from "../common-components/Select";
import {DEFAULT_SHIPPING_ACCOUNT, SHIPPING_METHODS} from "../constants/account";
import TextInput from "../common-components/TextInput";


const CustomerShippingAccount = ({enabled, value, readOnly = false, disabled = false, onEnable, onChange}) => {
    const onClick = () => {
        if (!readOnly) {
            onEnable();
        }
    };

    return (
        <div className="input-group input-group-sm">
            <div className="input-group-prepend">
                <div className="input-group-text">
                    <span onClick={() => onClick()}>Use your account</span>
                </div>
            </div>
            <div className="input-group-prepend">
                <div className="input-group-text">
                    <input type="checkbox" checked={enabled} onChange={() => onClick()} disabled={disabled || readOnly}/>
                </div>
            </div>
            <TextInput onChange={({value}) => onChange(value)} value={enabled ? value : ''}
                       disabled={!enabled} readOnly={readOnly} required={true}
                       placeholder="Shipping Account" />
        </div>
    )
};

export default class ShippingMethodSelect extends Component {
    static propTypes = {
        value: PropTypes.string,
        shippingAccount: PropTypes.shape({
            enabled: PropTypes.bool,
            value: PropTypes.string,
        }),
        readOnly: PropTypes.bool,
        required: PropTypes.bool,
        allowCustomerAccount: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
        onChangeShippingAccount: PropTypes.func.isRequired,
    };

    static defaultProps = {
        value: '',
        shippingAccount: DEFAULT_SHIPPING_ACCOUNT,
        allowCustomerAccount: true,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onChangeShippingAccount = this.onChangeShippingAccount.bind(this);
        this.onEnableShippingAccount = this.onEnableShippingAccount.bind(this);
    }

    onChange({field, value}) {
        this.props.onChange({field, value});
    }

    onChangeShippingAccount(value) {
        const {enabled} = this.props.shippingAccount;
        this.props.onChangeShippingAccount({enabled, value})
    }

    onEnableShippingAccount() {
        const {enabled, value} = this.props.shippingAccount;
        this.props.onChangeShippingAccount({enabled: !enabled, value});
    }


    render() {
        const {value, shippingAccount, readOnly, required, allowCustomerAccount: _allowCustomerAccount} = this.props;
        const {code = '', description = '', allowCustomerAccount = false} = SHIPPING_METHODS[value] || {};
        return (
            <div>
                <Select value={value} onChange={this.onChange} readOnly={readOnly} required={required} field="ShipVia">
                    {!readOnly && (<option value="">Select Shipping Method</option>)}
                    {!!readOnly && (<option value="" />)}
                    {Object.keys(SHIPPING_METHODS)
                        .map(key => {
                            return (
                                <option key={key} value={key}>{SHIPPING_METHODS[key].description}</option>
                            )
                        })}
                </Select>
                {_allowCustomerAccount && allowCustomerAccount && (
                    <CustomerShippingAccount {...shippingAccount}
                                             onChange={this.onChangeShippingAccount}
                                             onEnable={this.onEnableShippingAccount}
                                             readOnly={readOnly}/>
                )}
            </div>
        );
    }
}
