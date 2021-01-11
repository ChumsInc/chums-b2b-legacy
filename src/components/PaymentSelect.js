/**
 * Created by steve on 2/4/17.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {filteredTermsCode, PAYMENT_TYPES, CREDIT_CARD_PAYMENT_TYPES} from '../constants/account';
import Select from "../common-components/Select";
import {paymentCardShape} from "../constants/myPropTypes";

const PaymentOption = ({paymentType, last4, exp}) => {
    const {description, allowTerms, disabled, allowCC} = PAYMENT_TYPES[paymentType];
    const fullDescription = `${description} ${!!allowCC && !!last4 ? '#' + last4 : ''} ${!!allowCC && !!exp ? exp : ''}`;
    return (
        <option value={!!last4 ? [paymentType, last4].join(':') : paymentType} disabled={disabled}>
            {fullDescription.trim()}
        </option>
    )
};



export default class PaymentSelect extends Component {
    static propTypes = {
        value: PropTypes.string,
        field: PropTypes.string,
        customerTermsCode: PropTypes.string,
        payment: PropTypes.arrayOf(PropTypes.shape({
            PaymentType: PropTypes.string,
            last4: PropTypes.string,
            exp: PropTypes.string,
        })),
        customerPaymentCards: PropTypes.arrayOf(PropTypes.shape(paymentCardShape)),
        onChange: PropTypes.func.isRequired,
        readOnly: PropTypes.bool,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
    };

    static defaultProps = {
        value: '',
        field: '',
        customerTermsCode: '',
        payment: {},
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange({field, value}) {
        this.props.onChange({[field]: value});
    }

    render() {
        const {value, field, customerTermsCode, payment, disabled, readOnly, required, customerPaymentCards} = this.props;
        const customerAllowTerms = filteredTermsCode(customerTermsCode).due > 0;
        const customerAllowCC = CREDIT_CARD_PAYMENT_TYPES.includes(payment.PaymentType);
        const customerPaymentCardTypes = customerPaymentCards.map(cc => {
            const pt = {...PAYMENT_TYPES[cc.PaymentType]};
            pt.last4 = cc.Last4UnencryptedCreditCardNos || null;
            if (pt.last4) {
                pt.PaymentType = [pt.PaymentType, pt.last4].join(':')
            }
            return pt;
        });
        const {description, due = 0} = value === PAYMENT_TYPES.TERMS.code ? filteredTermsCode(customerTermsCode) : {};
        const {message} = PAYMENT_TYPES[value] || {};
        const subtext = [description, message].filter(v => !!v).join('; ');
        // console.log('render()', {value, description, due, customerTermsCode});
        return (
            <div>
                <Select value={value || ''} field={field} onChange={this.onChange} {...{disabled, readOnly, required}}>
                    <option value="">Select Payment Method</option>
                    {customerPaymentCardTypes.map((cc, index) => <PaymentOption key={index} paymentType={cc.code} {...cc}/>)}
                    {Object.keys(PAYMENT_TYPES)
                        .filter(key => customerAllowTerms || PAYMENT_TYPES[key].allowTerms === false)
                        .filter(key => customerAllowCC || PAYMENT_TYPES[key].allowCC === false)
                        .map(key => <PaymentOption key={key} paymentType={key} {...payment}/>)}
                </Select>
                {!!subtext && <div><small>{subtext}</small></div>}
            </div>
        )
    }
}


