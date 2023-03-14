/**
 * Created by steve on 9/6/2016.
 */
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import StateSelect from './StateSelect';
import CountrySelect from './CountrySelect';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import {isCanada, isUSA} from "../utils/customer";
import TextInput from "../common-components/TextInput";
import EmailAddressEditor from "./EmailAddressEditor";
import StoreMapToggle from "./StoreMapToggle";
import {addressShape, addressDefaults} from "../constants/myPropTypes";
import classNames from 'classnames';

export default class AddressFormFields extends Component {
    static propTypes = {
        ...addressShape,
        colWidth: PropTypes.number,
        cols: PropTypes.oneOf([1, 2]),
        readOnly: PropTypes.bool,
        showStoreMapOption: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        ...addressDefaults,
        readOnly: false,
        colWidth: 8,
        cols: 2,
        showStoreMapOption: false,
    };

    constructor(props) {
        super(props);
    }


    render() {
        const {
            AddressLine1, AddressLine2, AddressLine3, City, State, ZipCode, CountryCode, Reseller,
            colWidth, cols,
            onChange, readOnly, showStoreMapOption,
        } = this.props;

        const requiresStateCode = isUSA(CountryCode) || isCanada(CountryCode);

        return (
            <Fragment>
                <div className="row g-3">
                    <div className={classNames({'col-md-6': cols === 2, 'col-12': cols === 1})}>
                        <FormGroupTextInput onChange={onChange} value={AddressLine1 || ''} field="AddressLine1"
                                            required readOnly={readOnly}
                                            maxLength={30}
                                            autoComplete="address-line-1"
                                            colWidth={colWidth} label="Address 1"/>
                        <FormGroupTextInput onChange={onChange} value={AddressLine2 || ''} field="AddressLine2"
                                            maxLength={30}
                                            autoComplete="address-line-2"
                                            readOnly={readOnly}
                                            colWidth={colWidth} label="Address 2"/>
                        <FormGroupTextInput onChange={onChange} value={AddressLine3 || ''} field="AddressLine3"
                                            maxLength={30}
                                            autoComplete="address-line-3"
                                            readOnly={readOnly}
                                            colWidth={colWidth} label="Address 3"/>
                        {showStoreMapOption && cols === 2 &&  (
                            <FormGroup colWidth={colWidth} label="Store Map">
                                <StoreMapToggle value={Reseller} field="Reseller" onChange={onChange}
                                                readOnly={readOnly}/>
                            </FormGroup>
                        )}
                    </div>
                    <div className={classNames({'col-md-6': cols === 2, 'col-12': cols === 1})}>
                        <FormGroupTextInput onChange={onChange} value={City || ''} field="City" colWidth={colWidth}
                                            autoComplete="address-level2"
                                            required readOnly={readOnly}
                                            maxLength={20}
                                            label="City"/>
                        <FormGroup colWidth={colWidth} label="State / Zip">
                            <div className="row g-1 mb-0">
                                <div className="col-md-6 mb-2 mb-md-0">
                                    {requiresStateCode && (
                                        <StateSelect value={State || ''} countryCode={CountryCode} field="State"
                                                     required readOnly={readOnly} disabled={readOnly}
                                                     autoComplete="address-level1"
                                                     onChange={onChange}/>
                                    )}
                                    {!requiresStateCode && (
                                        <TextInput value={State || ''} field="State"
                                                   maxLength={2} placeholder="State Code"
                                                   autoComplete="address-level1"
                                                   required readOnly={readOnly} onChange={onChange}/>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <TextInput value={ZipCode || ''} field="ZipCode" placeholder="Zip Code"
                                               maxLength={10}
                                               autoComplete="postal-code"
                                               required readOnly={readOnly}
                                               onChange={onChange}/>
                                </div>
                            </div>
                            {showStoreMapOption && cols === 1 &&  (
                                <FormGroup colWidth={colWidth} label="Store Map">
                                    <StoreMapToggle value={Reseller} field="Reseller" onChange={onChange}
                                                    readOnly={readOnly}/>
                                </FormGroup>
                            )}

                        </FormGroup>
                        <FormGroup colWidth={colWidth} label="Country">
                            <CountrySelect value={CountryCode} field="CountryCode" onChange={onChange}
                                           autoComplete="country-code" disabled={readOnly}
                                           required readOnly={readOnly}/>
                        </FormGroup>
                    </div>
                </div>
            </Fragment>

        )
    }
}
