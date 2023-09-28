import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import FormGroupEmailAddress from "../common-components/FormGroupEmailAddress";
import {FieldValue} from "../types/generic";


const splitEmailAddresses = (emailAddress:string|null, separator:string = ';'):string[] => {
    if (!emailAddress) {
        return [];
    }
    return emailAddress
        .split(separator)
        .map(addr => addr.trim())
        .filter(addr => addr !== '');
};

const joinEmailAddresses = (emailAddresses:string[]):string => {
    return emailAddresses
        .map(addr => addr.trim())
        .filter(addr => addr !== '')
        .join('; ')
};

const EmailAddressEditor = ({
                                field = 'EmailAddress',
                                value = '',
                                allowMultiple,
                                maxEmailLength = 50,
                                maxMultipleLength = 225,
                                label = 'Email Address',
                                colWidth = 0,
                                required,
                                quantityRequired = 0,
                                readOnly,
                                onChange
                            }: {
    field?: string;
    value: string;
    allowMultiple?: boolean;
    maxEmailLength?: number;
    maxMultipleLength?: number;
    label: string;
    colWidth?: number;
    required?: boolean;
    quantityRequired?: number;
    readOnly?: boolean;
    onChange: ({field, value}: FieldValue) => void;
}) => {
    const [emailAddresses, setEmailAddresses] = useState<string[]>(splitEmailAddresses(value));

    useEffect(() => {
        if (allowMultiple) {
            setEmailAddresses([...splitEmailAddresses(value), '']);
            return;
        }
        setEmailAddresses(splitEmailAddresses(value));
    }, [value]);


    const changeHandler = (index:number) => ({value}:FieldValue) =>
    {
        if (!allowMultiple) {
            return onChange(({field, value}));
        }
        if (emailAddresses[index] === undefined) {
            return;
        }
        const addresses = [...emailAddresses];
        addresses[index] = value;
        onChange({field, value: joinEmailAddresses(addresses)})
    }

    const addAddressHandler = () => {
        onChange({field, value: joinEmailAddresses([...emailAddresses, ''])});
    }

    if (allowMultiple) {
        return (
            <div>
                {emailAddresses
                    .map((addr, index) => {
                        const otherLength = emailAddresses.filter(a => a !== addr)
                            .reduce((acc:number, val:string) => acc + val.length, 0);
                        const maxLength = Math.min(maxEmailLength, Math.max(maxMultipleLength - otherLength, addr.length));
                        return (
                            <FormGroupEmailAddress key={index} label={label} value={addr} colWidth={colWidth}
                                                   inputProps={{
                                                       readOnly,
                                                       maxLength,
                                                       required: required && (quantityRequired > index || index === 0)
                                                   }}
                                                   allowAdd={index === emailAddresses.length - 1}
                                                   onAdd={addAddressHandler}
                                                   onChange={changeHandler(index)}/>
                        )
                    })
                }
                <div>Length: {value.length}</div>
            </div>
        )
    }
    return (
        <FormGroupEmailAddress label={label} colWidth={colWidth}
                               inputProps={{
                                   readOnly,
                                   maxLength: maxEmailLength,
                                   required: required
                               }}
                               value={value ?? ''} onChange={changeHandler(0)}/>
    )
}

export default EmailAddressEditor;
