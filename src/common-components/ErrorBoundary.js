import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {logError} from '../actions/app';

function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {
    logError
};

class ErrorBoundary extends Component {
    static propTypes = {
        logError: PropTypes.func.isRequired,
    };
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        // console.log('componentDidCatch() error', error.valueOf());
        console.log('componentDidCatch() errorInfo', errorInfo);

        this.props.logError({componentStack: errorInfo.componentStack, message: error.message})
    }

    render() {
        if (this.state.hasError) {
            return (
                <h1>Sorry! something went wrong!</h1>
            )
        }
        return this.props.children;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ErrorBoundary);
