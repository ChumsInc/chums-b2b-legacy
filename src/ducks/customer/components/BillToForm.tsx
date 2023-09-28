/**
 * Created by steve on 9/6/2016.
 */
import React, {FormEvent, useEffect, useState} from 'react';
import AddressFormFields from '../../../components/AddressFormFields';
import {filteredTermsCode} from '../../../constants/account';
import {useSelector} from "react-redux";
import {longCustomerNo} from "../../../utils/customer";
import {saveBillingAddress} from '../actions';
import Alert from "@mui/material/Alert";
import FormGroup from "../../../common-components/FormGroup";
import ContactFormFields from "./ContactFormFields";
import MissingTaxScheduleAlert from "./MissingTaxScheduleAlert";
import {selectCustomerAccount, selectCustomerLoading, selectCustomerPermissions} from "../selectors";
import {selectCanEdit} from "../../user/selectors";
import StoreMapToggle from "../../../components/StoreMapToggle";
import ErrorBoundary from "../../../common-components/ErrorBoundary";
import {isBillToCustomer} from "../../../utils/typeguards";
import Address from "../../../components/Address/Address";
import {useAppDispatch} from "../../../app/configureStore";
import {BillToCustomer} from "b2b-types";
import LinearProgress from "@mui/material/LinearProgress";
import {FieldValue} from "../../../types/generic";
import ReloadCustomerButton from "./ReloadCustomerButton";

const BillToForm = () => {
    const dispatch = useAppDispatch();
    const current = useSelector(selectCustomerAccount);
    const loading = useSelector(selectCustomerLoading);
    const canEdit = useSelector(selectCanEdit);
    const permissions = useSelector(selectCustomerPermissions);
    const [customer, setCustomer] = useState<BillToCustomer | null>(current ?? null);

    useEffect(() => {
        if (isBillToCustomer(current)) {
            setCustomer({...current});
        } else {
            setCustomer(null);
        }
    }, [current])

    const changeHandler = ({field, value}: FieldValue<BillToCustomer>) => {
        if (customer && field) {
            setCustomer({...customer, [field]: value, changed: true});
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
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup colWidth={8} label="Account Number">
                            <input type="text" className="form-control-plaintext"
                                   value={longCustomerNo(customer) || ''}
                                   readOnly={true}/>
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup colWidth={8} label="Terms">
                            <input type="text" className="form-control-plaintext"
                                   value={filteredTermsCode(customer.TermsCode)?.description || ''}
                                   readOnly={true}/>
                        </FormGroup>
                    </div>
                </div>

                {!customer.TaxSchedule && (<MissingTaxScheduleAlert/>)}
                <hr/>
                <h4>Billing Contact &amp; Address</h4>
                <form onSubmit={submitHandler}>
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <AddressFormFields address={customer} colWidth={8}
                                               readOnly={!canEdit}
                                               onChange={changeHandler}/>
                            <FormGroup label="Store Map" colWidth={8}>
                                <StoreMapToggle id="bill-to-store-map" value={customer.Reseller} field="Reseller"
                                                onChange={changeHandler}
                                                readOnly={!canEdit}/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-6">
                            <ContactFormFields account={customer}
                                               allowMultipleEmailAddresses={true}
                                               readOnly={!canEdit} onChange={changeHandler}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6"/>
                        <div className="col-md-6">
                            <div className="row g-3">
                                <div className="col-4"/>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-sm btn-primary me-1"
                                            disabled={!canEdit || loading}>
                                        Save
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <ReloadCustomerButton/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {customer.changed &&
                        <Alert severity="warning" title="Hey!">Don't forget to save your changes.</Alert>}
                </form>
            </div>
        </ErrorBoundary>

    )
}

export default BillToForm;
