import React, {Component} from 'react';
import FormGroup from "../common-components/FormGroup";
import PasswordInput from "../common-components/PasswordInput";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import PropTypes from "prop-types";
import {changeUserPassword} from "../actions/user";
import {connect} from "react-redux";
import queryString from "query-string";

class PasswordForm extends Component{
    static propTypes = {
        email: PropTypes.string,
        requireOldPassword: PropTypes.bool,
        canChangePassword: PropTypes.bool,
        oldPassword: PropTypes.string,
        newPassword: PropTypes.string,
        newPassword2: PropTypes.string,
        alertMessage: PropTypes.string,

        changeUserPassword: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
    };

    static defaultProps = {
        email: '',
        requireOldPassword: false,
        canChangePassword: false,
        oldPassword: '',
        newPassword: '',
        newPassword2: '',
        alertMessage: '',

    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onCancelChange = this.onCancelChange.bind(this);
    }

    onChange({field, value}) {
        this.props.changeUserPassword({[field]: value});
    }

    componentDidMount() {
        if (!global.zxcvbn) {
            const zxcvbn = document.createElement('script');
            zxcvbn.type = 'text/javascript';
            zxcvbn.src = 'https://intranet.chums.com/node-dev/modules/zxcvbn/dist/zxcvbn.js';
            document.body.appendChild(zxcvbn);
        }

    }

    onCancelChange() {
        this.props.changeUserPassword({oldPassword: '', newPassword: '', newPassword2: '', visible: false});
    }


    render() {
        const {email, requireOldPassword, oldPassword, newPassword, newPassword2, onSubmit} = this.props;
        const passwordsMatch = newPassword === newPassword2;
        const okToSubmit = (requireOldPassword ? !!oldPassword : true)
            && passwordsMatch
            && PasswordInput.getValidation(newPassword).score > 0;
        return (
            <form onSubmit={onSubmit} autoComplete="on">
                <h3>{requireOldPassword ? 'Change Your Password' : 'Set Your Password'}</h3>
                <FormGroupTextInput colWidth={8} label="Email Address" type="email"
                                    value={email} readOnly/>
                {requireOldPassword && (
                    <FormGroup colWidth={8} label="Old Password">
                        <PasswordInput value={oldPassword} field="oldPassword" onChange={this.onChange}
                                       autoComplete="current-password"
                                       placeholder="Old Password"/>
                    </FormGroup>
                )}
                <FormGroup colWidth={8} label="New Password">
                    <PasswordInput value={newPassword} field="newPassword" onChange={this.onChange}
                                   autoComplete="new-password"
                                   showValidation
                                   placeholder="New Password"/>
                </FormGroup>
                <FormGroup colWidth={8} label="New Password">
                    <PasswordInput value={newPassword2} field="newPassword2" onChange={this.onChange}
                                   autoComplete="new-password"
                                   helpText={newPassword2 !== '' && !passwordsMatch ? 'Your new passwords do not match!' : ''}
                                   placeholder="New Password (confirm)"/>
                </FormGroup>
                <FormGroup colWidth={8}>
                    <button type="submit" className="btn btn-sm btn-primary mr-1 mb-1"
                            disabled={!okToSubmit}>
                        {requireOldPassword ? 'Change Password' : 'Set Password'}
                    </button>
                    <button type="reset" className="btn btn-sm btn-outline-secondary mr-1 mb-1" onClick={this.onCancelChange}>Cancel</button>
                </FormGroup>
            </form>
        )
    }
}


const mapStateToProps = ({user}) => {
    const {email, googleId} = user.profile;
    const {oldPassword, newPassword, newPassword2, alertMessage} = user.passwordChange;
    const canChangePassword = !googleId;
    return {email, canChangePassword, oldPassword, newPassword, newPassword2, alertMessage};
};

const mapDispatchToProps = {
    changeUserPassword,
};

export default  connect(mapStateToProps, mapDispatchToProps)(PasswordForm)
