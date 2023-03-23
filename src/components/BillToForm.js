/**
 * Created by steve on 9/6/2016.
 */
import React, {useEffect, useState} from 'react';
import AddressFormFields from './AddressFormFields';
import {filteredTermsCode} from '../constants/account';
import {useDispatch, useSelector} from "react-redux";
import {longAccountNumber} from "../utils/customer";
import {fetchCustomerAccount, saveBillingAddress} from '../actions/customer';
import ProgressBar from "./ProgressBar";
import Alert from "../common-components/Alert";
import FormGroup from "../common-components/FormGroup";
import ContactFormFields from "./ContactFormFields";
import MissingTaxScheduleAlert from "./MissingTaxScheduleAlert";
import {selectCustomerAccount, selectCustomerLoading} from "../selectors/customer";
import {selectIsEmployee, selectIssRep} from "../selectors/user";
import StoreMapToggle from "./StoreMapToggle";
import ErrorBoundary from "../common-components/ErrorBoundary";
import {isBillToCustomer} from "../utils/typeguards";

const BillToForm = () => {
    const dispatch = useDispatch();
    const current = useSelector(selectCustomerAccount);
    const loading = useSelector(selectCustomerLoading);
    const isEmployee = useSelector(selectIsEmployee);
    const isRep = useSelector(selectIssRep);
    const readOnly = !(isEmployee || isRep);
    const [account, setAccount] = useState(current ?? null);

    useEffect(() => {
        if (isBillToCustomer(current)) {
            setAccount({...current});
        } else {
            setAccount(null);
        }
    }, [current])

    const changeHandler = ({field, value}) => {
        if (account && field) {
            setAccount({...account, [field]: value, changed: true});
        }
    }

    const submitHandler = (ev) => {
        ev.preventDefault();
        dispatch(saveBillingAddress(account))
    }

    const reloadHandler = () => {
        dispatch(fetchCustomerAccount());
    }

    if (!current || !account) {
        return null;
    }

    return (
        <ErrorBoundary>
            <div>
                {!!loading && <ProgressBar striped={true}/>}
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup colWidth={8} label="Account Number">
                            <input type="text" className="form-control-plaintext"
                                   value={longAccountNumber(account) || ''}
                                   readOnly={true}/>
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup colWidth={8} label="Terms">
                            <input type="text" className="form-control-plaintext"
                                   value={filteredTermsCode(account.TermsCode).description || ''}
                                   readOnly={true}/>
                        </FormGroup>
                    </div>
                </div>

                {!account.TaxSchedule && (<MissingTaxScheduleAlert/>)}
                <hr/>
                <h4>Billing Contact &amp; Address</h4>
                <form onSubmit={submitHandler}>
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <AddressFormFields address={account} colWidth={8}
                                               readOnly={readOnly}
                                               onChange={changeHandler}/>
                            <FormGroup label="Store Map" colWidth={8}>
                                <StoreMapToggle id="bill-to-store-map" value={account.Reseller} field="Reseller"
                                                onChange={changeHandler}
                                                readOnly={readOnly}/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-6">
                            <ContactFormFields account={account}
                                               allowMultipleEmailAddresses={true}
                                               readOnly={readOnly} onChange={changeHandler}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6"/>
                        <div className="col-md-6">
                            <div className="row g-3">
                                <div className="col-4"/>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-sm btn-primary mr-1"
                                            disabled={readOnly || loading}>
                                        Save
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button type="button" className="btn btn-sm btn-outline-secondary mr-1"
                                            onClick={reloadHandler}>
                                        Reload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!!account.changed &&
                        <Alert type="alert-warning" title="Hey!" message="Don't forget to save your changes."/>}
                </form>
            </div>
        </ErrorBoundary>

    )
}

export default BillToForm;
