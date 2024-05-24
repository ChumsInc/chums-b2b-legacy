import React, {ChangeEvent, FormEvent, useState} from 'react';
import Link from "@mui/material/Link";
import FormGroup from "@mui/material/FormGroup";
import {PATH_LOGIN} from "../../constants/paths";
import {USER_EXISTS} from "../../constants/app";
import AddressFormFields from "../../components/AddressFormFields";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {SignUpUser} from "../../types/user";
import {signUpUser} from "./actions";
import {selectSignUpError, selectSignUpStatus} from "./selectors";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {CustomerAddress} from "b2b-types";
import {Button, Checkbox, FormControlLabel} from "@mui/material";
import Alert from "@mui/material/Alert";
import {Link as RoutedLink} from 'react-router-dom'

const newCustomer: SignUpUser = {
    email: '',
    name: '',
    hasAccount: true,
    account: '',
    accountName: '',
    telephone: '',
    address: null,
    agreeToPolicy: false,
}

const newAddress: CustomerAddress = {
    CustomerName: '',
    AddressLine1: '',
    AddressLine2: '',
    AddressLine3: '',
    City: '',
    State: '',
    ZipCode: '',
    CountryCode: 'USA',
};

const CustomerSignUp = () => {
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<SignUpUser>(newCustomer);
    const status = useAppSelector(selectSignUpStatus);
    const error = useAppSelector(selectSignUpError);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(signUpUser(user));
    }

    const changeHandler = (field: keyof SignUpUser) => (ev: ChangeEvent<HTMLInputElement>) => {
        const update = {...user};
        switch (field) {
            case 'hasAccount':
            case 'agreeToPolicy':
                setUser({...update, [field]: ev.target.checked});
                return;
            case 'address':
                return;
            default:
                setUser({...update, [field]: ev.target.value});
        }
    }

    const addressChangeHandler = (arg: Partial<CustomerAddress>) => {
        const address = user.address ?? newAddress
        setUser({...user, address: {...address, ...arg}})
    }

    return (
        <>
            {status === 'saving' && <LinearProgress variant="indeterminate"/>}
            <form onSubmit={submitHandler}>
                <Stack spacing={1} direction="column">
                    <TextField variant="filled" label="Your Name" required
                               value={user.name} onChange={changeHandler('name')}
                               autoComplete="name"/>
                    <TextField variant="filled" label="Your Email Address" required
                               type="email" value={user.email} onChange={changeHandler('email')}
                               autoComplete="email"/>
                    <TextField label="Your Company Name" variant="filled"
                               value={user.accountName} onChange={changeHandler('accountName')} required/>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={user.hasAccount} onChange={changeHandler('hasAccount')}/>}
                            label="I have a CHUMS Account"/>
                    </FormGroup>
                    {user.hasAccount && (
                        <TextField label="Your Account Number" variant="filled"
                                   value={user.account} onChange={changeHandler('account')}
                                   helperText="Your account number will be in the format ##-XX#### and
                                                    can be found in a recent order or invoice."/>
                    )}
                    {!user.hasAccount && (
                        <AddressFormFields onChange={addressChangeHandler} address={user.address ?? newAddress}/>
                    )}
                    <TextField label="Your Telephone #" type="tel"  variant="filled"
                               autoComplete="tel" required={!user.hasAccount}
                               value={user.telephone} onChange={changeHandler('telephone')}/>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={user.agreeToPolicy} onChange={changeHandler('agreeToPolicy')}/>}
                            label="I Agree to CHUMS Minimum Advertised Price and Site Usage Policies."/>
                    </FormGroup>
                    <Button type="submit" variant="contained" disabled={!user.agreeToPolicy}>
                        Request Account
                    </Button>
                </Stack>
            </form>
            {!!error && error === USER_EXISTS && (
                <Alert severity="warning" variant="filled">
                    If you&#39;ve recently signed up and have not received an email to validate your account
                    {' '} and set your password please contact CHUMS Customer Service (800-222-2486 or
                    {' '} <Link href="mailto:cs@chums.com?subject=Problems%20signing%20up%20for%20CHUMS%20B2B"
                                target="_blank">send an email</Link>) or
                    {' '} go to the <Link component={RoutedLink} to={PATH_LOGIN}>Login Page</Link> to send a new link to
                    set
                    {' '} your password;
                </Alert>
            )}
        </>
    );
}
export default CustomerSignUp;
