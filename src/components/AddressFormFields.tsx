import React from 'react';
import StateSelect from './StateSelect';
import CountrySelect from './CountrySelect';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import {isCanada, isUSA} from "@/utils/customer";
import TextInput from "../common-components/TextInput";
import {CustomerAddress} from "b2b-types";
import {FieldValue} from "@/types/generic";

const AddressFormFields = ({address, onChange, colWidth = 8, readOnly}:{
    address:CustomerAddress;
    onChange: (arg:FieldValue) => void;
    colWidth?: number;
    readOnly?: boolean;
}) => {
    const requiresStateCode = isUSA(address.CountryCode ?? '') || isCanada(address.CountryCode ?? '');

    return (
        <div>
            <FormGroupTextInput onChange={onChange} value={address.AddressLine1 ?? ''} field="AddressLine1"
                                required readOnly={readOnly} maxLength={30} autoComplete="address-line-1"
                                colWidth={colWidth} label="Address 1"/>
            <FormGroupTextInput onChange={onChange} value={address.AddressLine2 ?? ''} field="AddressLine2"
                                readOnly={readOnly} maxLength={30} autoComplete="address-line-2"
                                colWidth={colWidth} label="Address 2"/>
            <FormGroupTextInput onChange={onChange} value={address.AddressLine3 ?? ''} field="AddressLine3"
                                readOnly={readOnly} maxLength={30} autoComplete="address-line-3"
                                colWidth={colWidth} label="Address 3"/>
            <FormGroupTextInput onChange={onChange} value={address.City ?? ''} field="City" colWidth={colWidth}
                                required readOnly={readOnly} maxLength={30} autoComplete="address-level2"
                                label="City"/>
            <FormGroup colWidth={colWidth} label="State / Zip">
                <div className="row g-1 mb-0">
                    <div className="col-md-6 mb-2 mb-md-0">
                        {requiresStateCode && (
                            <StateSelect value={address.State || ''} countryCode={address.CountryCode} field="State"
                                         required readOnly={readOnly} disabled={readOnly}
                                         autoComplete="address-level1"
                                         onChange={onChange}/>
                        )}
                        {!requiresStateCode && (
                            <TextInput value={address.State ?? ''} field="State"
                                       maxLength={2} placeholder="State Code"
                                       autoComplete="address-level1"
                                       required readOnly={readOnly} onChange={onChange}/>
                        )}
                    </div>
                    <div className="col-md-6">
                        <TextInput value={address.ZipCode ?? ''} field="ZipCode" placeholder="Zip Code"
                                   maxLength={10}
                                   autoComplete="postal-code"
                                   required readOnly={readOnly}
                                   onChange={onChange}/>
                    </div>
                </div>
            </FormGroup>
            <FormGroup colWidth={colWidth} label="Country">
                <CountrySelect value={address.CountryCode ?? ''} field="CountryCode" onChange={onChange}
                               autoComplete="country-code" disabled={readOnly}
                               required/>
            </FormGroup>
        </div>
    )
}

export default AddressFormFields;
