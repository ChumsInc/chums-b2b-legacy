/**
 * Created by steve on 9/6/2016.
 */
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {changeShipTo, fetchCustomerAccount, saveShipToAddress, setDefaultShipTo, createShipTo} from '../actions/customer';
import {customerAccountKeyDefaults, customerAccountKeyShape, shipToAddressPropType} from "../constants/myPropTypes";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import ShipToSelect from "./ShipToSelect";
import Alert from "../common-components/Alert";
import ShipToAddressFormFields from "./ShipToAddressFormFields";
import {longAccountNumber} from "../utils/customer";
import EmailAddressEditor from "./EmailAddressEditor";
import TextInput from "../common-components/TextInput";
import ContactFormFields from "./ContactFormFields";
import ProgressBar from "./ProgressBar";

const splitEmailAddresses = (emailAddress = '') => {
    const addressArray = emailAddress.split(';')
        .map(addr => addr.trim())
        .filter(addr => addr !== '');
    return [...addressArray, ''];
};

class ShipToForm extends Component {
    static propTypes = {
        ...customerAccountKeyShape,
        shipToAddresses: PropTypes.arrayOf(shipToAddressPropType),
        loading: PropTypes.bool,
        PrimaryShipToCode: PropTypes.string,
        readOnly: PropTypes.bool,

        changeShipTo: PropTypes.func.isRequired,
        saveShipToAddress: PropTypes.func.isRequired,
        fetchCustomerAccount: PropTypes.func.isRequired,
        setDefaultShipTo: PropTypes.func.isRequired,
        createShipTo: PropTypes.func.isRequired,
    };

    static defaultProps = {
        ...customerAccountKeyDefaults,
        shipToAddresses: [],
        loading: false,
        PrimaryShipToCode: '',
        readOnly: true,
    };

    state = {
        shipToCode: '',
        showNewShipTo: false,
        newShipToCode: '',
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReload = this.onReload.bind(this);
        this.onChangeShipToCode = this.onChangeShipToCode.bind(this);
        this.onSetDefaultShipTo = this.onSetDefaultShipTo.bind(this);
        this.onChangeNewShipToCode = this.onChangeNewShipToCode.bind(this);
        this.onSubmitNewShipToCode = this.onSubmitNewShipToCode.bind(this);

        this.locationRef = React.createRef();
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }


    onReload() {
        this.props.fetchCustomerAccount();
    }

    onChange({field, value}) {
        this.props.changeShipTo(this.state.shipToCode, {[field]: value});
    }

    onChangeShipToCode({value: shipToCode}) {
        this.setState({shipToCode});
    }

    onSetDefaultShipTo() {
        this.props.setDefaultShipTo(this.state.shipToCode);
    }

    onSubmitNewShipToCode(ev) {
        ev.preventDefault();
        const {ARDivisionNo, CustomerNo} = this.props;
        const {newShipToCode} = this.state;
        this.props.createShipTo({ARDivisionNo, CustomerNo, ShipToCode: newShipToCode, ShipToCountryCode: 'USA'});
        this.setState({shipToCode: newShipToCode}, () => {
            this.locationRef.current.focus();
        });
    }


    onChangeNewShipToCode({value}) {
        const {shipToCode} = this.state;
        // if the newShipToCode input is being changed and the shipToCode field is not empty,
        // then change it as well (ie, the user is also able to edit the address)
        this.setState({newShipToCode: value, shipToCode: !!shipToCode ? value : shipToCode});
        if (!!shipToCode) {
            // and update it in the redux store
            this.props.changeShipTo(shipToCode, {ShipToCode: value});
        }
    }

    onSubmit(ev) {
        ev.preventDefault();
        this.props.saveShipToAddress(this.state.shipToCode);
        if (this.state.newShipToCode) {
            this.setState({newShipToCode: '', showNewShipTo: false});
        }
    }

    render() {
        const {loading, PrimaryShipToCode, shipToAddresses, fetchCustomerAccount, readOnly} = this.props;
        const {shipToCode, showNewShipTo, newShipToCode} = this.state;
        const [selectedShipTo = {ShipToCode: newShipToCode}] = shipToCode
            ? shipToAddresses.filter(st => st.ShipToCode === shipToCode)
            : [];
        const [primaryShipTo] = shipToAddresses.filter(st => st.ShipToCode === PrimaryShipToCode) || [];
        const primaryShipToName = primaryShipTo ? `[${primaryShipTo.ShipToCode}] ${primaryShipTo.ShipToName}` : '';



        const [matchesNewShipTo] = shipToAddresses.filter(st => st.ShipToCode === newShipToCode);
        const validShipToCode = /^\S{1,4}$/.test(newShipToCode);

        const newShipToHelpText = matchesNewShipTo && !matchesNewShipTo.changed
            ? (
                <span>
                    That code already is used for <strong>[{matchesNewShipTo.ShipToCode}] {matchesNewShipTo.ShipToName}</strong>
                </span>)
            : (!validShipToCode && !!newShipToCode ? 'That code contains invalid characters' : '');

        return (
            <div>
                {!!loading && <ProgressBar striped={true}/>}
                <div className="row g-3">
                    <div className="col-md-6">
                        <FormGroupTextInput colWidth={8} label="Default Delivery Location" className="form-control-plaintext"
                                            value={primaryShipToName || 'Billing Address'} readOnly disabled/>
                    </div>
                    <div className="col-md-6">
                        <FormGroup colWidth={8} label="Delivery Location">
                            <div className="input-group input-group-sm">
                                <ShipToSelect value={shipToCode} onChange={this.onChangeShipToCode}
                                              defaultName={shipToAddresses.length === 0 ? 'N/A' : 'Select One'}/>
                                <button className="input-group-text btn-outline-secondary" disabled={readOnly}
                                        onClick={() => this.setState({showNewShipTo: true, shipToCode: ''})}>
                                    <span className="bi-plus-lg"/>
                                </button>
                            </div>
                        </FormGroup>
                    </div>
                    {showNewShipTo && (
                        <Fragment>
                            <div className="col-md-6">
                                <Alert type="alert-info" title="Hint:">
                                    Your new Ship-To code must be unique, a maximum of four characters, and cannot be
                                    changed once you have saved your new address.
                                </Alert>
                            </div>
                            <div className="col-md-6">
                                <form onSubmit={this.onSubmitNewShipToCode}>
                                    <FormGroupTextInput colWidth={8} label="New Ship-To Code" value={newShipToCode}
                                                        style={{textTransform: 'uppercase'}}
                                                        onChange={this.onChangeNewShipToCode}
                                                        maxLength={4}
                                                        helpText={newShipToHelpText}
                                                        pattern="^[0-9A-Z]{1,4}$"
                                                        required/>
                                    <FormGroup colWidth={8}>
                                        <button type="submit" className="btn btn-sm btn-primary"
                                                disabled={!validShipToCode || !!matchesNewShipTo}>
                                            Create New Delivery Address
                                        </button>
                                    </FormGroup>
                                </form>
                            </div>
                        </Fragment>
                    )}
                </div>
                <hr/>
                {shipToCode && (
                    <form onSubmit={this.onSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <FormGroupTextInput colWidth={8} label="Location Name"
                                                    value={selectedShipTo.ShipToName || ''} field="ShipToName"
                                                    forwardRef={this.locationRef}
                                                    maxLength={30}
                                                    onChange={this.onChange} required readOnly={readOnly}/>
                            </div>
                            <div className="col-md-6">
                                <FormGroup colWidth={8}>
                                    {PrimaryShipToCode !== selectedShipTo.ShipToCode && (
                                        <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                                                disabled={selectedShipTo.changed || readOnly}
                                                onClick={this.onSetDefaultShipTo}>
                                            Set as default delivery location
                                        </button>
                                    )}
                                    {PrimaryShipToCode === selectedShipTo.ShipToCode && (
                                        <input type="text" className="form-control-plaintext"
                                               value="Default delivery location"
                                               readOnly={true}/>
                                    )}
                                </FormGroup>
                            </div>
                        </div>
                        <ShipToAddressFormFields {...selectedShipTo} defaultShipToCode={PrimaryShipToCode}
                                                 showStoreMapOption
                                                 readOnly={readOnly} onChange={this.onChange}/>
                        <ContactFormFields onChange={this.onChange} {...selectedShipTo} readOnly={readOnly}/>
                        <div className="row g-3">
                            <div className="col-md-6"/>
                            <div className="col-md-6">
                                <FormGroup colWidth={8} label={' '}>
                                    <button type="submit" className="btn btn-sm btn-primary me-1"
                                            disabled={readOnly || loading || !selectedShipTo.changed}>Save
                                    </button>
                                    <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                                            onClick={fetchCustomerAccount}>
                                        Reload
                                    </button>
                                </FormGroup>
                            </div>
                        </div>

                        {!!selectedShipTo.changed &&
                        <Alert type="alert-warning" title="Hey!" message="Don't forget to save your changes."/>}
                    </form>
                )}
            </div>

        )
    }
}

const mapStateToProps = ({customer, user}) => {
    const {shipToAddresses, loading, account} = customer;
    const {PrimaryShipToCode, ARDivisionNo, CustomerNo} = account;
    const readOnly = user.roles.filter(role => role.role === 'employee').length !== 1;
    return {shipToAddresses, loading, PrimaryShipToCode, ARDivisionNo, CustomerNo, readOnly};
};

const mapDispatchToProps = {
    changeShipTo,
    saveShipToAddress,
    fetchCustomerAccount,
    setDefaultShipTo,
    createShipTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShipToForm);
