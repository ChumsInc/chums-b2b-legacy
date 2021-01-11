import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import UserProfile from "./UserProfile";
import {logout} from "../actions/user";

class Logout extends Component {
    static propTypes = {
        history: PropTypes.object,
    };

    static defaultProps = {};


    render() {
        return (
            <UserProfile />
        );
    }
}

const mapStateToProps = ({user}) => {
    const {loggedIn} = user;
    return {loggedIn};
};

const mapDispatchToProps = {
    logout
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logout))
