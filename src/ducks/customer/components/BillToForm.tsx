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
import FormGroup from "../../../common-components/FormGroup";
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
import {Button, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TelephoneFormFields from "./TelephoneFormFields";
import EmailAddressEditor from "../../../components/EmailAddressEditor";

const BillToForm = () => {
    const dispatch = useAppDispatch();
    const current = useSelector(selectCustomerAccount);
    const loading = useSelector(selectCustomerLoading);
    const canEdit = useSelector(selectCanEdit);
    const permissions = useSelector(selectCustomerPermissions);
    const [customer, setCustomer] = useState<(BillToCustomer & Editable) | null>(current ?? null);

    useEffect(() => {
        if (isBillToCustomer(current)) {
            setCustomer({...current});
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
                <Typography variant="h2" component="h2">Billing Contact &amp; Address</Typography>

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
                                <EmailAddressEditor label="Email Address"
                                                    required={true} readOnly={!canEdit}
                                                    value={customer.EmailAddress}
                                                    onChange={changeHandler}
                                                    allowMultiple/>
                                <TelephoneFormFields account={customer} onChange={changeHandler} readOnly={!canEdit}/>
                                {customer.changed &&
                                    <Alert severity="warning" title="Hey!">Don't forget to save your changes.</Alert>
                                }
                                <Stack direction="row" spacing={2} sx={{my:3}} justifyContent="flex-end">
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
