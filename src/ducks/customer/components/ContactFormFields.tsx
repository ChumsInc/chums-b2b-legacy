import React from 'react';
import EmailAddressEditor from "@/components/EmailAddressEditor";
import FormGroup from "@/common-components/FormGroup";
import {BillToCustomer, ShipToCustomer} from "b2b-types";
import {FieldValue} from "@/types/generic";

export interface ContactFormFieldsProps {
    account: BillToCustomer | ShipToCustomer;
    allowMultipleEmailAddresses?: boolean;
    onChange: (arg: FieldValue<BillToCustomer | ShipToCustomer>) => void;
    readOnly?: boolean;
}

const ContactFormFields = ({account, allowMultipleEmailAddresses, readOnly, onChange}: ContactFormFieldsProps) => {
    return (
        <div>
            <EmailAddressEditor colWidth={8} label="Email Address"
                                required={true} readOnly={readOnly}
                                value={account.EmailAddress} field={'EmailAddress'} onChange={onChange}
                                allowMultiple={allowMultipleEmailAddresses}/>
            <FormGroup colWidth={8} label="Telephone">
                <div className="input-group input-group-sm">
                    <div className="input-group-text">
                        <span className="bi-telephone-fill"/>
                    </div>
                    <input type="text" className="form-control form-control-sm"
                           value={account.TelephoneNo ?? ''}
                           onChange={(ev) => onChange({field: 'TelephoneNo', value: ev.target.value})}
                           maxLength={17} autoComplete="tel" placeholder="Tel #"/>
                    <div className="input-group-text">Ext.</div>
                    <input type="text" className="form-control form-control-sm"
                           value={account.TelephoneExt ?? ''}
                           onChange={(ev) => onChange({field: 'TelephoneExt', value: ev.target.value})}
                           maxLength={17} autoComplete="tel-extension" placeholder="Ext. #"/>
                </div>
            </FormGroup>
        </div>
    )
}
export default ContactFormFields;
