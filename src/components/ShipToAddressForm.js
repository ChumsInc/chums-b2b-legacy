/**
 * Created by steve on 9/6/2016.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StateSelect from './StateSelect';
import CountrySelect from './CountrySelect';
import ProgressBar from './ProgressBar';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import {isCanada, isUSA} from "../utils/customer";
import TextInput from "../common-components/TextInput";
import Alert from "../common-components/Alert";
import EmailAddressEditor from "./EmailAddressEditor";
import StoreMapToggle from "./StoreMapToggle";

const toggleYN = (state) => state === 'Y' ? 'N' : 'Y';

export default class ShipToAddressForm extends Component {
    static propTypes = {
        defaultShipToCode: PropTypes.string,
        ShipToCode: PropTypes.string,
        ShipToAddress1: PropTypes.string,
        ShipToAddress2: PropTypes.string,
        ShipToAddress3: PropTypes.string,
        ShipToCity: PropTypes.string,
        ShipToState: PropTypes.string,
        ShipToZipCode: PropTypes.string,
        ShipToCountryCode: PropTypes.string,
        EmailAddress: PropTypes.string,
        TelephoneNo: PropTypes.string,
        TelephoneExt: PropTypes.string,
        Reseller: PropTypes.string,
        changed: PropTypes.bool,
        readOnly: PropTypes.bool,
        loading: PropTypes.bool,
        allowStoreMapOption: PropTypes.bool,

        onSave: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        onReload: PropTypes.func,
        onSetDefault: PropTypes.func.isRequired,
    };

    static defaultProps = {
        defaultShipToCode: '',
        ShipToCode: '',
        AddressLine1: '',
        AddressLine2: '',
        AddressLine3: '',
        ShipToCity: '',
        ShipToState: '',
        ShipToCountryCode: '',
        ShipToZipCode: '',
        Reseller: 'N',
        EmailAddress: '',
        TelephoneNo: '',
        TelephoneExt: '',
        changed: false,
        readOnly: false,
        loading: false,
        allowStoreMapOption: false
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }


    onSubmit(ev) {
        ev.preventDefault();
        this.props.onSave();
    }

    render() {
        const {
            ShipToAddress1, ShipToAddress2, ShipToAddress3, ShipToCity, ShipToState, ShipToZipCode, ShipToCountryCode,
            TelephoneNo, TelephoneExt, EmailAddress, Reseller, readOnly, loading, changed, allowStoreMapOption,
            defaultShipToCode, ShipToCode,
            onChange, onReload, onSetDefault
        } = this.props;

        const requiresStateCode = isUSA(ShipToCountryCode) || isCanada(ShipToCountryCode);

        return (
            <div>
                {!!loading && <ProgressBar striped={true}/>}
                <form className="form-row" onSubmit={this.onSubmit}>
                    <div className="col-md-6">
                        <EmailAddressEditor colWidth={8} label="Email Address"
                                            required={true}
                                            autocomplete="email"
                                            value={EmailAddress} field={'EmailAddress'} onChange={onChange}/>
                    </div>
                    <div className="col-md-6">
                        <FormGroup colWidth={8} label="Telephone">
                            <div className="input-group">
                                <TextInput onChange={onChange} value={TelephoneNo || ''} field="TelephoneNo"
                                           autocomplete="tel"
                                           placeholder="Tel #"/>
                                <div className="input-group-append">
                                    <TextInput onChange={onChange} value={TelephoneExt || ''} field="TelephoneExt"
                                               className="telephone-ext" autocomplete="tel-extension"
                                               placeholder="Ext."/>
                                </div>
                            </div>
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroupTextInput onChange={onChange} value={ShipToAddress1 || ''} field="ShipToAddress1"
                                            autocomplete="address-line-1"
                                            colWidth={8} label="Address 1"/>
                        <FormGroupTextInput onChange={onChange} value={ShipToAddress2 || ''} field="ShipToAddress2"
                                            autocomplete="address-line-2"
                                            colWidth={8} label="Address 2"/>
                        <FormGroupTextInput onChange={onChange} value={ShipToAddress3 || ''} field="ShipToAddress3"
                                            autocomplete="address-line-3"
                                            colWidth={8} label="Address 3"/>
                        {allowStoreMapOption && (
                            <FormGroup colWidth={8} label="Store Map">
                                <StoreMapToggle value={Reseller} field="Reseller" onChange={onChange}/>
                            </FormGroup>
                        )}
                    </div>
                    <div className="col-md-6">
                        <FormGroupTextInput onChange={onChange} value={ShipToCity || ''} field="ShipToCity" colWidth={8}
                                            autocomplete="address-level2"
                                            label="City"/>
                        <FormGroup colWidth={8} label="State / Zip">
                            <div className="form-row mb-0">
                                <div className="col-md-6 mb-2 mb-md-0">
                                {requiresStateCode && (
                                    <StateSelect value={ShipToState || ''} countryCode={ShipToCountryCode}
                                                 field="ShipToState" required readOnly={readOnly}
                                                 autocomplete="address-level1"
                                                 onChange={onChange}/>
                                )}
                                {!requiresStateCode && (
                                    <TextInput value={ShipToState || ''} field="ShipToState"
                                               autocomplete="address-level1" placeholder="State/Territory"
                                               required readOnly={readOnly} onChange={onChange}/>
                                )}
                                </div>
                                <div className="col-md-6">
                                    <TextInput value={ShipToZipCode || ''} field="ShipToZipCode" placeholder="Zip Code"
                                               autocomplete="postal-code"
                                               onChange={onChange}/>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup colWidth={8} label="Country">
                            <CountrySelect value={ShipToCountryCode} field="ShipToCountryCode" onChange={onChange}
                                           autocomplete="country-code"/>
                        </FormGroup>
                    </div>
                    <div className="col-md-6" />
                    <div className="col-md-6">
                        <FormGroup colWidth={8} label={' '}>
                            <button type="submit" className="btn btn-primary mr-3"
                                    disabled={readOnly || loading || !changed}>Save
                            </button>
                            {onReload && (
                                <button type="button" className="btn btn-outline-secondary mr-1"
                                        onClick={() => onReload()}>
                                    Reload
                                </button>
                            )}
                        </FormGroup>
                        <FormGroup colWidth={8} label={' '}>
                            {defaultShipToCode !== ShipToCode && (
                                <button type="button" className="btn btn-outline-secondary mr-1"
                                        onClick={() => onSetDefault()}>
                                    Set as default delivery location
                                </button>
                            )}
                        </FormGroup>
                    </div>
                </form>
                {!!changed && <Alert type="alert-warning" title="Hey!" message="Don't forget to save your changes."/>}
            </div>

        )
    }
}
