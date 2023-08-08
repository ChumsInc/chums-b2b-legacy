import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {fetchSignUpUser, submitNewPassword, submitNewUser} from '../ducks/user/actions';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import {PATH_HOME, PATH_LOGIN} from "../constants/paths";
import ProgressBar from "./ProgressBar";
import {USER_EXISTS} from "../constants/app";
import Alert from "../common-components/Alert";
import FormCheck from "../common-components/FormCheck";
import AddressFormFields from "./AddressFormFields";
import {addressDefaults} from "../constants/myPropTypes";

class SignUpCustomer extends Component {
    static propTypes = {
        loggedIn: PropTypes.bool,
        error: PropTypes.string,
        loading: PropTypes.bool,

        fetchSignUpUser: PropTypes.func.isRequired,
        submitNewPassword: PropTypes.func.isRequired,
        submitNewUser: PropTypes.func.isRequired,
    };

    static defaultProps = {
        loggedIn: false,
        error: null,
        loading: false,
    };

    state = {
        name: '',
        email: '',
        hasAccount: true,
        account: '',
        accountName: '',
        telephone: '',
        agreeToPolicies: false,
        ...addressDefaults
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmitNewCustomer = this.onSubmitNewCustomer.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
        this.onChangeHasAccount = this.onChangeHasAccount.bind(this);
    }


    onChange({field, value}) {
        this.setState({[field]: value});
    }

    onSubmitNewCustomer(ev) {
        ev.preventDefault();
        const {email, name, account, accountName, telephone, ...address} = this.state;
        this.props.submitNewUser({email, name, account, accountName, telephone, address});
    }

    onSubmitPassword(ev) {
        ev.preventDefault();
        this.props.submitNewPassword();
    }

    onChangeHasAccount(value) {
        this.setState({hasAccount: value === true});
    }


    render() {
        const {email, name, accountName, hasAccount, account, telephone, agreeToPolicies} = this.state;
        const {loggedIn, error, loading} = this.props;
        return (
            <Fragment>
                {loading && <ProgressBar striped={true}/>}
                <form onSubmit={this.onSubmitNewCustomer}>
                    <FormGroupTextInput colWidth={8} label="Your Name"
                                        value={name} field="name" onChange={this.onChange}/>
                    <FormGroupTextInput colWidth={8} label="Your Email Address"
                                        type="email" value={email} field="email"
                                        onChange={this.onChange}/>
                    <FormGroup colWidth={8} label="Do you have a CHUMS Account?">
                        <div>
                            <FormCheck type="radio" checked={hasAccount} inline={true} label="Yes"
                                       onChange={() => this.onChangeHasAccount(true)}/>
                            <FormCheck type="radio" checked={!hasAccount} inline={true} label="No"
                                       onChange={() => this.onChangeHasAccount(false)}/>
                        </div>
                    </FormGroup>
                    <FormGroupTextInput colWidth={8} label="Your Company Name"
                                        value={accountName} field="accountName" onChange={this.onChange}/>
                    {!!hasAccount && (
                        <FormGroupTextInput colWidth={8} label="Your Account Number"
                                            value={account} field="account" onChange={this.onChange}
                                            helpText="Your account number will be in the format ##-XX#### and
                                                    can be found in a recent order or invoice."/>
                    )}
                    {!hasAccount && (
                        <AddressFormFields onChange={this.onChange} address={this.state} colWidth={8}/>
                    )}
                    <FormGroupTextInput colWidth={8} label="Your Telephone #" type="tel" autoComplete="tel"
                                        value={telephone} field="telephone" onChange={this.onChange}/>
                    <FormGroup colWidth={8}>
                        <FormCheck type="checkbox" checked={agreeToPolicies} inline={true}
                                   label="I Agree to CHUMS Minimum Advertised Price and Site Usage Policies."
                                   onChange={() => this.setState({agreeToPolicies: !agreeToPolicies})}/>
                    </FormGroup>
                    <FormGroup colWidth={8}>
                        <button type="submit" className="btn btn-primary" disabled={!agreeToPolicies}>Request Account
                        </button>
                    </FormGroup>
                </form>
                {!!error && error === USER_EXISTS && (
                    <Alert type="alert-warning">
                        If you've recently signed up and have not received an email to validate your account
                        {' '} and set your password please contact CHUMS Customer Service (800-222-2486 or
                        {' '} <a href="mailto:cs@chums.com?subject=Problems%20signing%20up%20for%20CHUMS%20B2B"
                                 target="_blank">send an email</a>) or
                        {' '} go to the <Link to={PATH_LOGIN}>Login Page</Link> to send a new link to set
                        {' '} your password;
                    </Alert>
                )}
            </Fragment>
        );
    }
}

const mapStateToProps = ({user}) => {
    const {authKey, error, loading} = user.signUp;
    const {loggedIn} = user;
    return {authKey, loggedIn, error, loading};
};

const mapDispatchToProps = {
    fetchSignUpUser,
    submitNewPassword,
    submitNewUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpCustomer)
