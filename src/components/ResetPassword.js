import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import PasswordForm from "./PasswordForm";
import ProgressBar from "./ProgressBar";
import {submitNewPassword, fetchSignUpUser} from "../actions/user";
import queryString from "query-string";
import {PATH_PROFILE} from "../constants/paths";

class ResetPassword extends Component {

    static propTypes = {
        email: PropTypes.string,
        loading: PropTypes.bool,

        submitNewPassword: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
    }

    componentDidMount() {
        const {h: hash, key} = queryString.parse(document.location.search || '');
        if (!!hash && !!key) {
            this.props.fetchSignUpUser({authHash: decodeURIComponent(hash), authKey: decodeURIComponent(key)});
        }
    }


    onSubmitPassword(ev) {
        ev.preventDefault();
        this.props.submitNewPassword()
            .then(({success}) => {
                if (!!success) {
                    this.props.history.push(PATH_PROFILE);
                }
            })
    }
    render() {
        const {loading, email} = this.props;
        return (
            <div>
                {loading && <ProgressBar striped={true}/>}
                <PasswordForm onSubmit={this.onSubmitPassword} requireOldPassword={false} email={email}/>
            </div>
        );
    }
}


const mapStateToProps = ({user}) => {
    const {email, loading} = user.signUp;
    return {email, loading};
};

const mapDispatchToProps = {
    submitNewPassword,
    fetchSignUpUser
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)