import React, {ChangeEvent, useEffect, useState} from 'react';
import FormGroupEmailAddress from "../common-components/FormGroupEmailAddress";
import {FormHelperText} from "@mui/material";
import {BillToCustomer, ShipToCustomer} from "b2b-types";


const splitEmailAddresses = (emailAddress: string | null, separator: string = ';'): string[] => {
    if (!emailAddress) {
        return [];
    }
    return emailAddress
        .split(separator)
        .map(addr => addr.trim())
        .filter(addr => addr !== '');
};

const joinEmailAddresses = (emailAddresses: string[]): string => {
    return emailAddresses
        .map(addr => addr.trim())
        .filter(addr => addr !== '')
        .join('; ')
};

const EmailAddressEditor = ({
                                value = '',
                                allowMultiple,
                                maxEmailLength = 50,
                                maxMultipleLength = 225,
                                label = 'Email Address',
                                required,
                                readOnly,
                                onChange
                            }: {
    value: string;
    allowMultiple?: boolean;
    maxEmailLength?: number;
    maxMultipleLength?: number;
    label: string;
    required?: boolean;
    readOnly?: boolean;
    onChange: (arg: Partial<BillToCustomer & ShipToCustomer>) => void;
}) => {
    const [emailAddresses, setEmailAddresses] = useState<string[]>(splitEmailAddresses(value));

    useEffect(() => {
        if (allowMultiple) {
            setEmailAddresses([...splitEmailAddresses(value), '']);
            return;
        }
        setEmailAddresses(splitEmailAddresses(value));
    }, [value]);


    const changeHandler = (index: number) => (ev: ChangeEvent<HTMLInputElement>) => {
        if (!allowMultiple) {
            return onChange({EmailAddress: ev.target.value});
        }
        if (emailAddresses[index] === undefined) {
            return;
        }
        const addresses = [...emailAddresses];
        addresses[index] = ev.target.value;
        onChange({EmailAddress: joinEmailAddresses(addresses)})
    }

    if (allowMultiple) {
        return (
            <>
                {emailAddresses
                    .map((addr, index) => {
                        const otherLength = emailAddresses.filter(a => a !== addr)
                            .reduce((acc: number, val: string) => acc + val.length, 0);
                        const maxLength = Math.min(maxEmailLength, Math.max(maxMultipleLength - otherLength, addr.length));
                        return (
                            <FormGroupEmailAddress key={index} label={label} value={addr}
                                                   inputProps={{
                                                       readOnly,
                                                       maxLength,
                                                       required: required && index === 0
                                                   }}
                                                   onChange={changeHandler(index)}/>
                        )
                    })
                }
                <FormHelperText>Characters remaining: {maxMultipleLength - value.length}</FormHelperText>
            </>
        )
    }
    return (
        <FormGroupEmailAddress label={label}
                               inputProps={{
                                   readOnly,
                                   maxLength: maxEmailLength,
                                   required: required
                               }}
                               value={value ?? ''} onChange={changeHandler(0)}/>
    )
}

export default EmailAddressEditor;
