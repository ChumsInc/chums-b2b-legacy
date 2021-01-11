import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {updateLocalAuth} from "../actions/user";
import {connect} from 'react-redux';
import {AUTH_LOCAL} from "../constants/app";


class AppUpdateLocalLogin extends Component {

    static propTypes = {
        loggedIn: PropTypes.bool,
        authType: PropTypes.string,

        updateLocalAuth: PropTypes.func.isRequired,
    };

    static defaultProps = {
        loggedIn: false,
        authType: '',
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.loggedIn) {
            this.props.updateLocalAuth();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loggedIn && !prevProps.loggedIn) {
            this.props.updateLocalAuth();
        }
    }


    render() {
        const {loggedIn, authType} = this.props;
        return authType === AUTH_LOCAL && loggedIn && (
            <div className="login-container" style={{display: 'none'}} />
        )
    }
}

const mapStateToProps = state => {
    const {loggedIn, authType} = state.user;
    return {loggedIn, authType};
};

const mapDispatchToProps = {
    updateLocalAuth,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppUpdateLocalLogin);
