/**
 * Created by steve on 9/6/2016.
 */
import React, {FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {saveShipToAddress, setDefaultShipTo} from '@/ducks/customer/actions';
import FormGroupTextInput from "@/common-components/FormGroupTextInput";
import FormGroup from "@/common-components/FormGroup";
import Alert from "@mui/material/Alert";
import ShipToAddressFormFields from "@/components/ShipToAddressFormFields";
import ContactFormFields from "@/ducks/customer/components/ContactFormFields";
import {selectCanEdit} from "@/ducks/user/selectors";
import {
    selectCustomerLoading,
    selectCustomerPermissions,
    selectPermittedShipToAddresses,
    selectPrimaryShipTo
} from "@/ducks/customer/selectors";
import StoreMapToggle from "@/components/StoreMapToggle";
import {Editable, ShipToCustomer} from "b2b-types";
import {useAppDispatch} from "@/app/configureStore";
import {FieldValue} from "@/types/generic";
import {useParams} from "react-router";
import DeliveryAddress from "@/components/Address/DeliveryAddress";
import LinearProgress from "@mui/material/LinearProgress";
import ReloadCustomerButton from "@/ducks/customer/components/ReloadCustomerButton";

const ShipToForm = () => {
    const dispatch = useAppDispatch();
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);
    const primaryShipTo = useSelector(selectPrimaryShipTo);
    const loading = useSelector(selectCustomerLoading);
    const canEdit = useSelector(selectCanEdit);
    const permissions = useSelector(selectCustomerPermissions);
    const params = useParams<'shipToCode'>();
    const [shipTo, setShipTo] = useState<ShipToCustomer & Editable | null>(null);

    const readOnly = !canEdit;

    useEffect(() => {
        const [shipTo] = shipToAddresses.filter(row => row.ShipToCode === params.shipToCode);
        setShipTo(shipTo ?? null);
    }, [shipToAddresses, params])


    const onNewShipToCustomer = () => {
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!shipTo || !canEdit) {
            return;
        }
        dispatch(saveShipToAddress(shipTo));
    }

    const changeHandler = ({
                               field,
                               value
                           }: FieldValue<ShipToCustomer>) => {
        if (shipTo && field) {
            setShipTo({...shipTo, [field]: value, changed: true});
        }
    }

    const onSetDefaultShipTo = () => {
        if (shipTo && shipTo.ShipToCode !== primaryShipTo?.ShipToCode) {
            dispatch(setDefaultShipTo(shipTo.ShipToCode))
        }
    }

    if (!canEdit) {
        return (
            <div>
                <h4>Delivery Address</h4>
                <LinearProgress variant="indeterminate" hidden={!loading}/>
                {shipTo && <DeliveryAddress address={shipTo}/>}
            </div>
        )
    }

    return (
        <div>
            <LinearProgress variant="indeterminate" hidden={!loading}/>
            {shipTo && (
                <form onSubmit={submitHandler}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <FormGroupTextInput colWidth={8} label="Location Name"
                                                value={shipTo.ShipToName || ''} field="ShipToName"
                                                maxLength={30}
                                                onChange={changeHandler} required readOnly={readOnly}/>
                        </div>
                        <div className="col-md-6">
                            <FormGroup label="" colWidth={8}>
                                {primaryShipTo?.ShipToCode !== shipTo.ShipToCode && (
                                    <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                                            disabled={shipTo.changed || readOnly || shipTo.ShipToCode === primaryShipTo?.ShipToCode}
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
                                    <ReloadCustomerButton/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {shipTo.changed &&
                        <Alert severity="warning" title="Hey!">Don't forget to save your changes.</Alert>}
                </form>
            )}
        </div>
    )
}

export default ShipToForm;
