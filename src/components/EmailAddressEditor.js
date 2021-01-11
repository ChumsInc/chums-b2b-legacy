import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import FormGroupEmailAddress from "../common-components/FormGroupEmailAddress";


const splitEmailAddresses = (emailAddress = '') => {
    return emailAddress.split(';')
        .map(addr => addr.trim())
        .filter(addr => addr !== '');
};

const joinEmailAddresses = (emailAddresses) => {
    return emailAddresses
        .map(addr => addr.trim())
        .filter(addr => addr !== '')
        .join('; ')
};

export default class EmailAddressEditor extends Component {
    static propTypes = {
        field: PropTypes.string,
        value: PropTypes.string.isRequired,
        allowMultiple: PropTypes.bool,
        maxEmailLength: PropTypes.number,
        maxMultipleLength: PropTypes.number,
        label: PropTypes.string,
        colWidth: PropTypes.number,
        required: PropTypes.bool,
        quantityRequired: PropTypes.number,
        readOnly: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        field: 'EmailAddress',
        value: '',
        maxEmailLength: 50,
        maxMultipleLength: 250,
        allowMultiple: false,
        label: 'Email Address',
        colWidth: 0,
        required: false,
        quantityRequired: 0,
        readOnly: true,
    };

    state = {
        emailAddresses: [],
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange({value}, index) {
        const {onChange, allowMultiple, field} = this.props;
        if (!allowMultiple) {
            return onChange(({field, value}));
        }
        this.setState((state) => {
            const {emailAddresses} = state;
            if (emailAddresses[index] === undefined) {
                return {emailAddresses};
            }
            emailAddresses[index] = value;
            return {emailAddresses}
        }, () => {
            onChange({field, value: joinEmailAddresses(this.state.emailAddresses)});
        });
    }

    componentDidMount() {
        if (this.props.allowMultiple) {
            const emailAddresses = [...splitEmailAddresses(this.props.value), ''];
            this.setState({emailAddresses});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.allowMultiple && this.props.value !== prevProps.value) {
            const emailAddresses = [...splitEmailAddresses(this.props.value)];
            this.setState({emailAddresses});
        }
    }

    render() {
        const {allowMultiple, value, maxEmailLength, maxMultipleLength, label, colWidth, required, quantityRequired, readOnly} = this.props;
        const maxLength = allowMultiple ? maxMultipleLength : maxEmailLength;
        const {emailAddresses} = this.state;

        return allowMultiple
            ? emailAddresses.map((addr, index) => {
                const otherLength = emailAddresses.filter(a => a !== addr).reduce((acc, val) => acc + val.length, 0);
                const maxLength = maxMultipleLength - otherLength;
                return (
                    <FormGroupEmailAddress key={index} label={label} value={addr} colWidth={colWidth}
                                           readOnly={readOnly}
                                           maxLength={Math.max(maxLength, addr.length)}
                                           required={required && (quantityRequired > index || index === 0)}
                                           allowAdd={index === emailAddresses.length - 1}
                                           onAdd={() => this.setState({emailAddresses: [...emailAddresses, '']})}
                                           onChange={({field, value}) => this.onChange({field, value}, index)}/>
                )
            })
            : (
                <FormGroupEmailAddress label={label} colWidth={colWidth}
                                       readOnly={readOnly}
                                       value={value} onChange={this.onChange}
                                       maxLength={maxLength} required={required}/>
            )
    }
}
