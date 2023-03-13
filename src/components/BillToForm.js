/**
 * Created by steve on 9/6/2016.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddressFormFields from './AddressFormFields';
import {filteredTermsCode} from '../constants/account';
import {connect} from "react-redux";
import {longAccountNumber} from "../utils/customer";
import {changeAccount, fetchCustomerAccount, saveBillingAddress} from '../actions/customer';
import {setAlert} from '../actions/app';
import ProgressBar from "./ProgressBar";
import Alert from "../common-components/Alert";
import FormGroup from "../common-components/FormGroup";
import ContactFormFields from "./ContactFormFields";
import MissingTaxScheduleAlert from "./MissingTaxScheduleAlert";

class BillToForm extends Component {
    static propTypes = {
        account: PropTypes.shape({
            AddressLine1: PropTypes.string,
            AddressLine2: PropTypes.string,
            AddressLine3: PropTypes.string,
            City: PropTypes.string,
            State: PropTypes.string,
            ZipCode: PropTypes.string,
            CountryCode: PropTypes.string,
            EmailAddress: PropTypes.string,
            TelephoneNo: PropTypes.string,
            TelephoneExt: PropTypes.string,
            TaxSchedule: PropTypes.string,
        }),
        readOnly: PropTypes.bool,
        loading: PropTypes.bool,

        changeAccount: PropTypes.func.isRequired,
        saveBillingAddress: PropTypes.func.isRequired,
        fetchCustomerAccount: PropTypes.func.isRequired,
        setAlert: PropTypes.func,
    };

    static defaultProps = {
        account: {
            AddressLine1: '',
            AddressLine2: '',
            AddressLine3: '',
            City: '',
            State: '',
            ZipCode: '',
            CountryCode: 'USA',
            EmailAddress: '',
            TelephoneNo: '',
            TelephoneExt: '',
            TaxSchedule: null,
        },
        readOnly: true,
        loading: false,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReload = this.onReload.bind(this);
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    onReload() {
        this.props.fetchCustomerAccount();
    }

    onChange({field, value}) {
        this.props.changeAccount({[field]: value});
    }

    onSubmit(ev) {
        ev.preventDefault();
        this.props.saveBillingAddress();
    }

    render() {
        const {account, loading, readOnly} = this.props;
        const {changed} = account;

        return (
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

                {!account.TaxSchedule && (<MissingTaxScheduleAlert />)}
                <hr/>
                <h4>Billing Contact &amp; Address</h4>
                <form onSubmit={this.onSubmit}>
                    <AddressFormFields {...account}
                                       showStoreMapOption
                        readOnly={readOnly}
                                       onChange={this.onChange}/>
                    <ContactFormFields {...account} allowMultipleEmailAddresses={true}
                                       readOnly={readOnly} onChange={this.onChange}/>
                    <div className="row">
                        <div className="col-md-6"/>
                        <div className="col-md-6">
                            <FormGroup colWidth={8} label={' '}>
                                <button type="submit" className="btn btn-sm btn-primary mr-1"
                                        disabled={readOnly || loading || !changed}>Save
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-secondary mr-1"
                                        onClick={this.onReload}>
                                    Reload
                                </button>
                            </FormGroup>
                        </div>
                    </div>

                    {!!account.changed &&
                    <Alert type="alert-warning" title="Hey!" message="Don't forget to save your changes."/>}
                </form>

            </div>

        )
    }
}

const mapStateToProps = ({customer, user}) => {
    const {account, loading} = customer;
    const readOnly = user.roles.filter(role => role.role === 'employee').length !== 1;
    return {account, loading, readOnly};
};

const mapDispatchToProps = {
    changeAccount,
    saveBillingAddress,
    fetchCustomerAccount,
    setAlert,
};

export default connect(mapStateToProps, mapDispatchToProps)(BillToForm);
