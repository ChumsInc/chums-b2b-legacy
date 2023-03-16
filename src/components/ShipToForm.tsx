/**
 * Created by steve on 9/6/2016.
 */
import React, {FormEvent, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchCustomerAccount, saveShipToAddress, setDefaultShipTo} from '../actions/customer';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import ShipToSelect from "./ShipToSelect";
import Alert from "../common-components/Alert";
import ShipToAddressFormFields from "./ShipToAddressFormFields";
import ContactFormFields from "./ContactFormFields";
import ProgressBar from "./ProgressBar";
import {selectCurrentCustomer, selectIsEmployee, selectIssRep} from "../selectors/user";
import {selectCustomerLoading, selectCustomerShipToAddresses, selectPrimaryShipTo} from "../selectors/customer";
import {Editable, ShipToCustomer} from "b2b-types";
import {SelectChangeHandler, TextInputChangeHandler} from "../generic-types";
import StoreMapToggle from "./StoreMapToggle";

const ShipToForm = () => {
    const dispatch = useDispatch();
    const customer = useSelector(selectCurrentCustomer);
    const shipToAddresses = useSelector(selectCustomerShipToAddresses);
    const primaryShipTo = useSelector(selectPrimaryShipTo);
    const loading = useSelector(selectCustomerLoading);
    const isEmployee = useSelector(selectIsEmployee);
    const isRep = useSelector(selectIssRep);
    const readOnly = !(isEmployee || isRep);
    const [shipToCode, setShipToCode] = useState<string | null>(customer?.PrimaryShipToCode ?? null);
    const [shipTo, setShipTo] = useState<ShipToCustomer & Editable | null>(null);

    useEffect(() => {
        const [shipTo] = shipToAddresses.filter(row => row.ShipToCode === shipToCode);
        setShipTo(shipTo ?? null);
    }, [shipToCode]);

    useEffect(() => {
        const [shipTo] = shipToAddresses.filter(row => row.ShipToCode === shipToCode);
        setShipTo(shipTo ?? null)
        if (!shipTo) {
            setShipToCode(null)
        }
    }, [customer])

    const onNewShipToCustomer = () => {
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!shipTo) {
            return;
        }
        dispatch(saveShipToAddress(shipTo));
    }

    const changeHandler = ({
                               field,
                               value
                           }: TextInputChangeHandler<ShipToCustomer> | SelectChangeHandler<ShipToCustomer>) => {
        if (shipTo && field) {
            setShipTo({...shipTo, [field]: value, changed: true});
        }
    }

    const onSetDefaultShipTo = () => {
        if (shipTo && shipTo.ShipToCode !== primaryShipTo?.ShipToCode) {
            dispatch(setDefaultShipTo(shipTo.ShipToCode))
        }
    }

    const reloadHandler = () => {
        dispatch(fetchCustomerAccount());
    }


    return (
        <div>
            {loading && <ProgressBar striped={true}/>}
            <div className="row g-3">
                <div className="col-md-6">
                    <FormGroupTextInput colWidth={8} label="Default Delivery Location"
                                        className="form-control-plaintext"
                                        value={primaryShipTo?.ShipToName ?? 'Billing Address'} readOnly disabled/>
                </div>
                <div className="col-md-6">
                    {shipToAddresses.length > 0 && (
                        <FormGroup colWidth={8} label="Delivery Location">
                            <div className="input-group input-group-sm">
                                <ShipToSelect value={shipToCode} onChange={setShipToCode}
                                              defaultName={shipToAddresses.length === 0 ? 'N/A' : `Select One`}/>
                                <button className="input-group-text btn-outline-secondary" disabled={true}
                                        onClick={onNewShipToCustomer}>
                                    <span className="bi-plus-lg"/>
                                </button>
                            </div>
                        </FormGroup>
                    )}
                </div>
            </div>
            <hr/>
            {!shipTo && shipToAddresses.length > 0}
            {!!shipTo && (
                <form onSubmit={submitHandler}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <FormGroupTextInput colWidth={8} label="Location Name"
                                                value={shipTo.ShipToName || ''} field="ShipToName"
                                                maxLength={30}
                                                onChange={changeHandler} required readOnly={readOnly}/>
                        </div>
                        <div className="col-md-6">
                            <FormGroup colWidth={8}>
                                {primaryShipTo?.ShipToCode !== shipTo.ShipToCode && (
                                    <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                                            disabled={shipTo.changed || readOnly}
                                            onClick={onSetDefaultShipTo}>
                                        Set as default delivery location
                                    </button>
                                )}
                                {primaryShipTo?.ShipToCode === shipTo.ShipToCode && (
                                    <input type="text" className="form-control-plaintext"
                                           value="Default delivery location"
                                           readOnly={true}/>
                                )}
                            </FormGroup>

                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <ShipToAddressFormFields address={shipTo} readOnly={readOnly} onChange={changeHandler}
                                                     colWidth={8}/>
                        </div>
                        <div className="col-md-6">
                            <FormGroup colWidth={8} label="Store Map">
                                <StoreMapToggle value={shipTo.Reseller} field="Reseller" onChange={changeHandler}
                                                id="ship-to-store-map-toggle"
                                                readOnly={readOnly}/>
                            </FormGroup>
                            <ContactFormFields onChange={changeHandler} account={shipTo} readOnly={readOnly}/>
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6"/>
                        <div className="col-md-6">
                            <div className="row g-3">
                                <div className="col-4"/>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-sm btn-primary me-1"
                                            disabled={readOnly || loading}>
                                        Save
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                                            onClick={reloadHandler}>
                                        Reload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {shipTo.changed &&
                        <Alert type="alert-warning" title="Hey!" message="Don't forget to save your changes."/>}
                </form>
            )}        </div>
    )
}

export default ShipToForm;
