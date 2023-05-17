import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {fetchVersion} from '../actions/app';

function mapStateToProps({app}) {
    const {version} = app;
    return {
        version: version.versionNo
    };
}

const mapDispatchToProps = {
    fetchVersion
};

const updateCheckInterval = 30 * 60 * 1000;

class AppVersion extends Component {
    static propTypes = {
        version: PropTypes.string,
    };
    static defaultProps = {
        version: '',
        fetchVersion
    };

    state = {
        updateAvailable: false,
    }

    timer = null;

    constructor(props) {
        super(props);
        this.onClickUpdate = this.onClickUpdate.bind(this);
        this.onDismissUpdates = this.onDismissUpdates.bind(this);
        if (global.document) {
            document.addEventListener('visibilitychange', this.props.fetchVersion);
        }
    }

    componentDidMount() {
        this.props.fetchVersion();
        this.timer = setInterval(this.props.fetchVersion, updateCheckInterval);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.version !== prevProps.version && !!prevProps.version && !this.state.updateAvailable) {
            this.setState({updateAvailable: true});
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        if (global.document) {
            document.removeEventListener('visibilitychange', this.props.fetchVersion);
        }
    }

    onClickUpdate(ev) {
        ev.preventDefault();
        if (global.document) {
            document.location.reload(true);
        }
    }

    onDismissUpdates() {
        this.props.setState({dismissed: true});
    }

    render() {
        const {version} = this.props;
        const {updateAvailable, dismissed} = this.state;
        return (
            <div>
                <span onClick={this.props.fetchVersion} className="app__version">Version: {version}</span>
                {!!updateAvailable && !dismissed && (
                    <div onClick={this.onClickUpdate} className="app__version-popup">
                        <strong>Update Available! Click here to refresh</strong>
                        <span className="ms-3 close" onClick={this.onDismissUpdates}>&times;</span>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppVersion);
