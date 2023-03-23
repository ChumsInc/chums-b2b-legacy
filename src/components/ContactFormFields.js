import React from 'react';
import EmailAddressEditor from "./EmailAddressEditor";
import FormGroup from "../common-components/FormGroup";
import TextInput from "../common-components/TextInput";

// export interface ContactFormFieldsProps {
//     account: BillToCustomer | ShipToCustomer;
//     allowMultipleEmailAddresses?: boolean;
//     onChange: (arg: TextInputChangeHandler) => void;
//     readOnly?: boolean;
// }

const ContactFormFields = ({account, allowMultipleEmailAddresses, readOnly, onChange}) => {
    const {EmailAddress, TelephoneNo, TelephoneExt} = account;
    return (
        <div>
            <EmailAddressEditor colWidth={8} label="Email Address"
                                required={true} readOnly={readOnly}
                                value={EmailAddress} field={'EmailAddress'} onChange={onChange}
                                allowMultiple={allowMultipleEmailAddresses}/>
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
    )
}
export default ContactFormFields;
