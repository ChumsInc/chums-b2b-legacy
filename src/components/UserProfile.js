import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import LogoutButton from "./LogoutButton";
import {submitPasswordChange, changeUser, changeUserPassword, loadProfile, logout, updateLocalAuth} from "../ducks/user/actions";
import ChangePasswordForm from "./PasswordForm";
import {AUTH_LOCAL} from "../constants/app";
import {PATH_HOME, PATH_LOGIN} from "../constants/paths";

class UserProfile extends Component {
    static propTypes = {
        imageUrl: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        changed: PropTypes.bool,
        canChangePassword: PropTypes.bool,
        passwordChangeVisible: PropTypes.bool,
        authType: PropTypes.string,

        changeUser: PropTypes.func.isRequired,
        loadProfile: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired,
        submitPasswordChange: PropTypes.func.isRequired,
        updateLocalAuth: PropTypes.func.isRequired,
        changeUserPassword: PropTypes.func.isRequired,
    };

    static defaultProps = {
        imageUrl: '/images/chums/Chums_Logo_Booby.png',
        email: '',
        name: '',
        changed: false,
        canChangePassword: false,
        passwordChangeVisible: false,
    };


    constructor(props) {
        super(props);
        this.onChangeUser = this.onChangeUser.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitPasswordChange = this.onSubmitPasswordChange.bind(this);
        this.onUpdateProfile = this.onUpdateProfile.bind(this);
        this.onShowChangePasswordForm = this.onShowChangePasswordForm.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    onChangeUser({field, value}) {
        this.props.changeUser({[field]: value});
    }

    onSubmit(ev) {
        ev.preventDefault();
    }

    onSubmitPasswordChange(ev) {
        ev.preventDefault();
        this.props.submitPasswordChange();
    }

    onUpdateProfile() {
        if (this.props.authType === AUTH_LOCAL) {
            this.props.updateLocalAuth(true);
        } else {
            this.props.loadProfile();
        }
    }

    onShowChangePasswordForm() {
        this.props.changeUserPassword({visible: true});
    }

    onLogout() {
        this.props.logout();
    }


    render() {
        const {imageUrl, email, name, changed, canChangePassword, passwordChangeVisible} = this.props;

        // @TODO: Add way to change password, change name, change email

        return (
            <Fragment>

                <div className="user-profile">
                    <div className="user-profile-picture">
                        <img src={imageUrl || UserProfile.defaultProps.imageUrl}
                             alt="Profile Picture" className="img-thumbnail img-fluid"/>
                    </div>
                    <div className="user-profile-tasks">
                        <form onSubmit={this.onSubmit}>
                            <h3>Login Profile</h3>
                            <FormGroupTextInput colWidth={8} label="Name"
                                                value={name} field="name" onChange={this.onChangeUser}/>
                            <FormGroupTextInput colWidth={8} type="email" label="Email Address"
                                                value={email} field="email" onChange={this.onChangeUser}/>
                            <FormGroup colWidth={8}>
                                <button type="submit" className="btn btn-sm btn-primary me-1 mb-1" disabled={!changed}>
                                    Save Changes
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-primary me-1 mb-1"
                                        onClick={this.onUpdateProfile}>Refresh
                                </button>
                                {canChangePassword && (
                                    <button type="button" className="btn btn-sm btn-outline-secondary me-1 mb-1"
                                            onClick={this.onShowChangePasswordForm}>
                                        Change Password
                                    </button>
                                )}
                            </FormGroup>
                            <FormGroup colWidth={8} className="mt-3">
                                <LogoutButton onLogout={this.onLogout}/>
                            </FormGroup>
                        </form>
                        {passwordChangeVisible && (
                            <ChangePasswordForm requireOldPassword={true} onSubmit={this.onSubmitPasswordChange}/>
                        )}
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = ({user}) => {
    const {authType} = user;
    const {imageUrl, name, email, changed, googleId} = user.profile;
    const {visible} = user.passwordChange;
    const canChangePassword = !googleId;
    return {authType, imageUrl, name, email, changed, canChangePassword, passwordChangeVisible: visible};
};

const mapDispatchToProps = {
    logout,
    loadProfile,
    changeUser,
    submitPasswordChange,
    updateLocalAuth,
    changeUserPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
