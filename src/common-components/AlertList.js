import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Alert from "./Alert";
import {connect} from 'react-redux';
import {dismissAlert} from "../actions/app";

class AlertList extends Component {
    static propTypes = {
        alerts: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            type: PropTypes.string,
            title: PropTypes.string,
            message: PropTypes.string.isRequired,
        })).isRequired,
        dismissAlert: PropTypes.func.isRequired,
    };

    static propDefaults = {
        alerts: []
    };

    render() {
        const {alerts, dismissAlert} = this.props;
        return (
            <Fragment>
                {alerts.map((alert) => <Alert key={alert.id} {...alert} onDismiss={dismissAlert}/>)}
            </Fragment>
        )
    }
}

const mapStateToProps = ({app}) => {
    const {alerts} = app;
    return {alerts};
};

const mapDispatchToProps = {
    dismissAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(AlertList);
