import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FormGroupTextInput from '../common-components/FormGroupTextInput';
import Alert from "../common-components/Alert";
import {connect} from 'react-redux';
import {loginUser, updateLogin, resetPassword} from "../actions/user";
import ProgressBar from "./ProgressBar";
import PasswordInput from "../common-components/PasswordInput";
import FormGroup from "../common-components/FormGroup";


class LoginLocal extends Component {
    static propTypes = {
        email: PropTypes.string,
        password: PropTypes.string,
        forgotPassword: PropTypes.bool,
        loading: PropTypes.bool,

        updateLogin: PropTypes.func.isRequired,
        loginUser: PropTypes.func.isRequired,
        resetPassword: PropTypes.func.isRequired,
    };

    static defaultProps = {
        email: '',
        password: '',
        forgotPassword: false,
        loading: false,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange({field, value}) {
        this.props.updateLogin({[field]: value});
    }

    onSubmit(ev) {
        ev.preventDefault();
        const {email, password, forgotPassword} = this.props;
        if (forgotPassword) {
            return this.props.resetPassword({email});
        }
        this.props.loginUser({email, password});
    }

    render() {
        const {email, password, forgotPassword, loading} = this.props;
        return (
            <form onSubmit={this.onSubmit}>
                {loading && <ProgressBar striped={true} label="Processing Login Request"/> }
                {!forgotPassword && (<h3>Login with your credentials</h3>)}
                {!forgotPassword && (<div><small>Login with an email and password you've provided.</small></div>)}

                {forgotPassword && (<h3>Reset Your Password</h3>)}
                <FormGroupTextInput onChange={this.onChange} value={email} field="email" type="email"
                                    label="E-Mail Address" placeholder="Your email address" required/>
                {!forgotPassword && (
                    <FormGroup label="Password">
                        <PasswordInput value={password} field="password" onChange={this.onChange} required
                                       autoComplete="current-password"
                                       placeholder="Your password"/>

                    </FormGroup>
                )}
                {!forgotPassword && (<button type="submit" className="btn btn-sm btn-primary mr-1">Sign In</button>)}
                {!forgotPassword && (
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                            onClick={() => this.onChange({field: 'forgotPassword', value: true})}>
                        Forgot Password
                    </button>
                )}
                {!!forgotPassword && (<button type="submit" className="btn btn-sm btn-primary mr-1">Reset Password</button>)}
                {!!forgotPassword && (<button type="button" className="btn btn-sm btn-outline-secondary"
                                              onClick={() => this.onChange({field: 'forgotPassword', value: false})}>Cancel</button>)}
                {forgotPassword && (
                    <Alert type="alert-info">An email will be sent to you so you can reset your password.</Alert>
                )}
            </form>
        );
    }
}




const mapStateToProps = ({user}) => {
    const {email, password, forgotPassword, loading} = user.login;
    return {email, password, forgotPassword, loading};
};

const mapDispatchToProps = {
    loginUser,
    updateLogin,
    resetPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginLocal);
