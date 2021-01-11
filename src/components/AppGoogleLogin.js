import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import {loginGoogleUser, logout} from "../actions/user";
import {connect} from 'react-redux';
import {AUTH_GOOGLE} from "../constants/app";


class AppGoogleLogin extends Component {

    static propTypes = {
        loggedIn: PropTypes.bool,
        authType: PropTypes.string,

        loginGoogleUser: PropTypes.func.isRequired,
    };

    static defaultProps = {
        loggedIn: false,
        authType: '',
    };

    constructor(props) {
        super(props);
        this.responseGoogle = this.responseGoogle.bind(this);
    }

    responseGoogle(googleUser) {
        this.props.loginGoogleUser(googleUser);
    }

    render() {
        const {loggedIn, authType} = this.props;
        return (
            <div className="login-container" style={{display: 'none'}}>
                {authType === AUTH_GOOGLE && (
                    <Fragment>
                        <GoogleLogin clientId="949305513396-8tmadc840cuabrda5ucvs171be1ups1e.apps.googleusercontent.com"
                                     buttonText="Login with Google"
                                     onSuccess={this.responseGoogle}
                                     onFailure={this.responseGoogle}
                                     isSignedIn={loggedIn} />
                        <GoogleLogout/>
                    </Fragment>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {loggedIn, authType} = state.user;
    return {loggedIn, authType};
};

const mapDispatchToProps = {
    loginGoogleUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppGoogleLogin);
