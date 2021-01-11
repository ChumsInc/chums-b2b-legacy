import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {contactCodePropType} from "../constants/myPropTypes";
import Select from "../common-components/Select";

class ContactCodeSelect extends Component {
    static propTypes = {
        contacts: PropTypes.arrayOf(contactCodePropType),
        value: PropTypes.string,
        field: PropTypes.string,
        defaultName: PropTypes.string,

        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        contacts: [],
        value: '',
        field: 'ContactCode',
        defaultName: 'Select One',
    };

    render() {
        const {contacts, value, field, onChange, defaultName, ...props} = this.props;
        return (
            <Select onChange={onChange} value={value} field={field} {...props}>
                <option value="">{defaultName}</option>
                {contacts.map(cc => <option value={cc.ContactCode}>[{cc.ContactCode}] {cc.ContactName}</option>)}
            </Select>
        );
    }
}

const mapStateToProps = ({customer}) => {
    const {contacts} = customer;
    return {contacts};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ContactCodeSelect) 
