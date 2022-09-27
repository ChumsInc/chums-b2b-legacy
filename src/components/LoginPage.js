import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {loginGoogleUser, loginUser, logout} from "../actions/user";
import {setDocumentTitle} from "../actions/app";
import {connect} from 'react-redux';
import LoginLocal from "./LoginLocal";
import {DOCUMENT_TITLES, PATH_HOME} from "../constants/paths";
import Alert from '../common-components/Alert';
import GoogleSignInButton from "./GoogleSignInButton";


class LoginPage extends Component {

    static propTypes = {
        location: PropTypes.object,
        loggedIn: PropTypes.bool,
        loginUser: PropTypes.func.isRequired,
        loginGoogleUser: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        setDocumentTitle: PropTypes.func.isRequired,
    };

    static defaultProps = {
        loggedIn: false,
    };


    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            forgotPassword: false,
        };
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.responseGoogle = this.responseGoogle.bind(this);
        this.loginUserPassword = this.loginUserPassword.bind(this);
    }

    componentDidMount() {
        if (this.props.documentTitle !== DOCUMENT_TITLES.login) {
            this.props.setDocumentTitle(DOCUMENT_TITLES.login);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.documentTitle !== DOCUMENT_TITLES.login) {
            this.props.setDocumentTitle(DOCUMENT_TITLES.login);
        }
    }

    onChangeField(field, ev) {
        this.setState({field: ev.target.value});
    }

    onSubmit(ev) {
        ev.preventDefault();
    }

    responseGoogle(googleUser) {
        // console.log('responseGoogle()', googleUser);
        this.props.loginGoogleUser(googleUser)
            .then(() => {
                if (this.props.history.length > 1) {
                    this.props.history.goBack()
                }
            });
    }

    loginUserPassword(email, password) {
        this.props.dispatch(loginUser({email, password}))
            .then(() => {
                if (this.props.history.length > 1) {
                    this.props.history.goBack()
                }
            });
    }

    onChangeEmail(ev) {
        this.setState({email: ev.target.value});
    }

    onChangePassword(ev) {
        this.setState({password: ev.target.value});
    }

    toggleForgotPassword() {
        this.setState({forgotPassword: !this.state.forgotPassword});
    }

    render() {
        const {loginUser, loggedIn} = this.props;

        if (!!loggedIn) {
            return (<Redirect to={PATH_HOME}/>)
        }

        // const {error} = this.props.user;
        return (
            <div>
                <div className="jumbotron">
                    <h1>Chums B2B Portal</h1>
                    <h3>Hey there friend! This site is for authorized Chums dealers only. Please login / sign up
                        here.
                    </h3>
                    <hr/>
                    <h4>Not an authorized dealer? Feel as though you've lost your way? {' '}
                        <a href="https://www.chums.com">Click here to shop chums.com</a>
                    </h4>
                </div>
                <div>
                    <div className="row">
                        <div className="col-sm-6">
                            <h3>Login with Google</h3>
                            <div><small>Login with a trusted provider.</small></div>
                            <GoogleSignInButton/>
                        </div>
                        <div className="col-sm-6">
                            <LoginLocal onSubmit={loginUser}/>
                        </div>
                    </div>
                </div>
                <Alert type="alert-danger" title="WARNING:" className="mt-5">
                    Unauthorized access to this system is forbidden and will be prosecuted
                    by law. By accessing this system, you agree that your actions may be monitored if unauthorized
                    usage is suspected.
                </Alert>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {loggedIn} = state.user;
    return {loggedIn};
};

const mapDispatchToProps = {
    loginUser,
    loginGoogleUser,
    logout,
    setDocumentTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
