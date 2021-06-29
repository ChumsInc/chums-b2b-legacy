import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EmailAddressEditor from "./EmailAddressEditor";
import FormGroup from "../common-components/FormGroup";
import TextInput from "../common-components/TextInput";
import {telephoneDefaults, telephoneShape} from "../constants/myPropTypes";

export default class ContactFormFields extends Component {
    static propTypes = {
        ...telephoneShape,
        EmailAddress: PropTypes.string,
        allowMultipleEmailAddresses: PropTypes.bool,
        readOnly: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        ...telephoneDefaults,
        EmailAddress: '',
        allowMultipleEmailAddresses: false,
        readOnly: false,
    };

    render() {
        const {EmailAddress, TelephoneNo, TelephoneExt, onChange, allowMultipleEmailAddresses, readOnly} = this.props;
        return (
            <div className="row g-3">
                <div className="col-md-6">
                    <EmailAddressEditor colWidth={8} label="Email Address"
                                        required={true} readOnly={readOnly}
                                        value={EmailAddress} field={'EmailAddress'} onChange={onChange}
                                        allowMultiple={allowMultipleEmailAddresses}/>
                </div>
                <div className="col-md-6">
                    <FormGroup colWidth={8} label="Telephone">
                        <div className="input-group">
                            <TextInput value={TelephoneNo || ''} field="TelephoneNo"
                                       readOnly={readOnly} onChange={onChange}
                                       maxLength={17}
                                       autoComplete="tel"
                                       placeholder="Tel #"/>
                            <div className="input-group-append">
                                <TextInput value={TelephoneExt || ''} field="TelephoneExt"
                                           className="telephone-ext"
                                           maxLength={5}
                                           autoComplete="tel-extension"
                                           readOnly={readOnly} onChange={onChange}
                                           placeholder="Ext."/>
                            </div>
                        </div>
                    </FormGroup>
                </div>
            </div>
        );
    }
}
