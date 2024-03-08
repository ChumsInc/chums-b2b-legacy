import React, {ChangeEvent} from 'react';
import StateSelect from './StateSelect';
import CountrySelect from './CountrySelect';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import TextInput from "../common-components/TextInput";
import {CustomerAddress} from "b2b-types";
import {isCanada, isUSA} from "../utils/customer";
import Stack from "@mui/material/Stack";
import {TextField} from "@mui/material";

const AddressFormFields = ({address, onChange, readOnly}: {
    address: CustomerAddress;
    onChange: (arg: Partial<CustomerAddress>) => void;
    readOnly?: boolean;
}) => {
    const requiresStateCode = isUSA(address.CountryCode ?? '') || isCanada(address.CountryCode ?? '');

    const changeHandler = (field: keyof CustomerAddress) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'AddressLine1':
            case 'AddressLine2':
            case 'AddressLine3':
            case 'City':
            case 'State':
                return onChange({[field]: ev.target.value})
        }
    }

    const valueChangeHandler = (field: keyof CustomerAddress) => (value: string) => {
        switch (field) {
            case 'State':
            case 'CountryCode':
                return onChange({[field]: value});
        }
    }

    return (
        <Stack direction="column" spacing={1}>

            <TextField variant="filled" fullWidth label="Address 1" size="small"
                       onChange={changeHandler('AddressLine1')} value={address.AddressLine1 ?? ''}
                       inputProps={{readOnly, maxLength: 30, autoComplete: 'address-line-1'}} required />
            <TextField variant="filled" onChange={changeHandler('AddressLine2')} value={address.AddressLine2 ?? ''}
                       inputProps={{readOnly, maxLength: 30, autoComplete: 'address-line-2'}} size="small"
                       fullWidth label="Address 2"/>
            <TextField variant="filled" onChange={changeHandler('AddressLine3')} value={address.AddressLine3 ?? ''}
                       inputProps={{readOnly, maxLength: 30, autoComplete: 'address-line-3'}} size="small"
                       fullWidth label="Address 3"/>
            <TextField variant="filled" onChange={changeHandler('City')} value={address.City ?? ''}
                       inputProps={{readOnly, maxLength: 30, autoComplete: 'address-level2'}} size="small"
                       required fullWidth label="City"/>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={1}>
                {requiresStateCode && (
                    <StateSelect value={address.State ?? ''} countryCode={address.CountryCode}
                                 required inputProps={{readOnly, disabled: readOnly, autoComplete: 'address-level1'}}
                                 variant="filled" size="small"
                                 onChange={valueChangeHandler('State')}/>
                )}
                {!requiresStateCode && (
                    <TextField variant="filled" onChange={changeHandler('State')} value={address.State ?? ''}
                               inputProps={{readOnly, maxLength: 30, autoComplete: 'address-level1'}} size="small"
                               required fullWidth label="State"/>
                )}
                <TextField variant="filled" fullWidth label="Postal Code" size="small"
                           onChange={changeHandler('ZipCode')} value={address.ZipCode ?? ''}
                           inputProps={{readOnly, maxLength: 10, autoComplete: 'postal-code'}} required />
                <CountrySelect value={address.CountryCode ?? ''} onChange={valueChangeHandler('CountryCode')}
                               variant="filled" size="small"
                               inputProps={{autoComplete: "country-code", readOnly, disabled:readOnly}}
                               required/>

            </Stack>
        </Stack>
    )
}

export default AddressFormFields;
