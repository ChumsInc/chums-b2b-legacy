/**
 * Created by steve on 9/6/2016.
 */
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import AddressFormFields from '../../../components/AddressFormFields';
import {filteredTermsCode} from '../../../constants/account';
import {useSelector} from "react-redux";
import {longCustomerNo} from "../../../utils/customer";
import {saveBillingAddress} from '../actions';
import Alert from "@mui/material/Alert";
import MissingTaxScheduleAlert from "./MissingTaxScheduleAlert";
import {selectCustomerAccount, selectCustomerLoading, selectCustomerPermissions} from "../selectors";
import {selectCanEdit} from "../../user/selectors";
import StoreMapToggle from "../../../components/StoreMapToggle";
import ErrorBoundary from "../../../common-components/ErrorBoundary";
import {isBillToCustomer} from "../../../utils/typeguards";
import Address from "../../../components/Address/Address";
import {useAppDispatch} from "../../../app/configureStore";
import {BillToCustomer, Editable} from "b2b-types";
import LinearProgress from "@mui/material/LinearProgress";
import ReloadCustomerButton from "./ReloadCustomerButton";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Button, InputAdornment, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TelephoneFormFields from "./TelephoneFormFields";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const BillToForm = () => {
    const dispatch = useAppDispatch();
    const current = useSelector(selectCustomerAccount);
    const loading = useSelector(selectCustomerLoading);
    const canEdit = useSelector(selectCanEdit);
    const permissions = useSelector(selectCustomerPermissions);
    const [customer, setCustomer] = useState<(BillToCustomer & Editable) | null>(current ?? null);
    const [emailAddresses, setEmailAddresses] = useState<string[]>(current?.EmailAddress?.split(';')?.map(email => email.trim()) ?? [''])

    useEffect(() => {
        if (isBillToCustomer(current)) {
            setCustomer({...current});
            setEmailAddresses(current?.EmailAddress?.split(';')?.map(email => email.trim()) ?? ['']);
        } else {
            setCustomer(null);
        }
    }, [current])

    const changeHandler = (arg: Partial<BillToCustomer>) => {
        if (customer) {
            setCustomer({...customer, ...arg, changed: true});
        }
    }

    const fieldChangeHandler = (field: keyof BillToCustomer) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'Reseller':
                return changeHandler({[field]: ev.target.checked ? 'Y' : 'N'})
            default:
                changeHandler(({[field]: ev.target.value}));
        }
    }

    const emailChangeHandler = (index: number) => (ev: ChangeEvent<HTMLInputElement>) => {
        if (!customer) {
            return;
        }
        const email = [...emailAddresses];
        if (email[index] !== undefined) {
            email[index] = ev.target.value;
        }
        setEmailAddresses(email);
        setCustomer({...customer, EmailAddress: email.join(';')});
    }

    const addEmailAddressHandler = (after: number) => {
        if (!customer) {
            return;
        }
        const email = emailAddresses.toSpliced(after + 1, 0, '');
        setEmailAddresses(email);
        setCustomer({...customer, EmailAddress: email.join(';')});
    }

    const removeEmailAddressHandler = (index: number) => {
        if (!customer) {
            return;
        }
        if (emailAddresses[index] !== undefined) {
            const email = emailAddresses.filter((email, _index) => _index !== index);
            if (email.length === 0) {
                email.push('');
            }
            setEmailAddresses(email);
            setCustomer({...customer, EmailAddress: email.join(';')});
        }
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!customer) {
            return;
        }
        dispatch(saveBillingAddress(customer))
    }

    if (!current || !customer) {
        return null;
    }

    if (!permissions?.billTo) {
        return (
            <div>
                <h4>Billing Address</h4>
                <Address address={current}/>
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <div>
                {loading && <LinearProgress variant="indeterminate"/>}
                <Grid2 container spacing={2}>
                    <Grid2 xs={12} sm={6}>
                        <TextField variant="filled" label="Account Number" fullWidth size="small"
                                   type="text" value={longCustomerNo(customer) || ''}
                                   inputProps={{readOnly: true}}/>
                    </Grid2>
                    <Grid2 xs={12} sm={6}>
                        <TextField variant="filled" label="Payment Terms" fullWidth size="small"
                                   type="text" value={filteredTermsCode(customer.TermsCode)?.description ?? ''}
                                   inputProps={{readOnly: true}}/>
                    </Grid2>
                </Grid2>

                {!customer.TaxSchedule && (<MissingTaxScheduleAlert/>)}
                <hr/>
                <Typography variant="h3" component="h3">Billing Contact &amp; Address</Typography>

                <form onSubmit={submitHandler}>
                    <Grid2 container spacing={2}>
                        <Grid2 xs={12} sm={6}>
                            <AddressFormFields address={customer}
                                               readOnly={!canEdit}
                                               onChange={changeHandler}/>
                        </Grid2>
                        <Grid2 xs={12} sm={6}>
                            <Stack direction="column" spacing={1}>
                                <StoreMapToggle checked={customer.Reseller === 'Y'}
                                                onChange={fieldChangeHandler('Reseller')}
                                                readOnly={!canEdit}/>
                                {emailAddresses.map((email, index) => (
                                    <TextField key={index} variant="filled" label="Email Address" fullWidth size="small"
                                               type="email" value={email} onChange={emailChangeHandler(index)}
                                               inputProps={{
                                                   readOnly: !canEdit,
                                                   maxLength: 250 - emailAddresses.join(';').length
                                               }}
                                               InputProps={{
                                                   endAdornment: (
                                                       <InputAdornment position="end">
                                                           <IconButton aria-label="Add a new email address"
                                                                       disabled={!email || emailAddresses.join(';').length > 240}
                                                                       onClick={() => addEmailAddressHandler(index)}>
                                                               <AddIcon/>
                                                           </IconButton>
                                                           <IconButton aria-label="Add a new email address"
                                                                       onClick={() => removeEmailAddressHandler(index)}
                                                                       disabled={index === 0}>
                                                               <RemoveIcon/>
                                                           </IconButton>
                                                       </InputAdornment>
                                                   )
                                               }}
                                    />
                                ))}
                                {/*<EmailAddressEditor label="Email Address"*/}
                                {/*                    required={true} readOnly={!canEdit}*/}
                                {/*                    value={customer.EmailAddress}*/}
                                {/*                    onChange={changeHandler}*/}
                                {/*                    allowMultiple/>*/}
                                <TelephoneFormFields account={customer} onChange={changeHandler} readOnly={!canEdit}/>
                                {customer.changed &&
                                    <Alert severity="warning" title="Hey!">Don&#39;t forget to save your changes.</Alert>
                                }
                                <Stack direction="row" spacing={2} sx={{my: 3}} justifyContent="flex-end">
                                    <ReloadCustomerButton/>
                                    <Button type="submit" variant="contained" disabled={!canEdit || loading}>
                                        Save
                                    </Button>
                                </Stack>

                            </Stack>
                        </Grid2>
                    </Grid2>
                </form>
            </div>
        </ErrorBoundary>

    )
}

export default BillToForm;
