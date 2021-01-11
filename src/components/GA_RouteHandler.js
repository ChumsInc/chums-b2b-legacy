import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {ga_config, ga_screenView} from '../actions/gtag';

class GA_RouteHandler extends Component {
    static propTypes = {
        documentTitle: PropTypes.string,
        location: PropTypes.object,

        ga_config: PropTypes.func.isRequired,
        ga_screenView: PropTypes.func.isRequired,
    };

    static defaultProps = {
        documentTitle: '',
        location: {},
    };

    componentDidMount() {
        const {documentTitle, location} = this.props;
        this.props.ga_screenView({title: documentTitle, path: location.pathname});
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const {location, documentTitle} = this.props;
        // console.log([nextProps.documentTitle, documentTitle].join(' => '));
        return nextProps.documentTitle !== documentTitle;
    }

    componentDidUpdate(prevProps, prevState) {
        const {documentTitle, location} = this.props;
        this.props.ga_config({title: documentTitle, path: location.pathname});
    }


    render() {
        const {documentTitle, location} = this.props;
        const page_title = documentTitle;
        const page_path = location.pathname;
        const page_location = typeof document !== 'undefined' ? `${document.location.origin}${page_path}` : page_path;
        return (
            <div style={{display: 'none'}}>GA Info: {JSON.stringify({page_title, page_path, page_location})}</div>
        );
    }
}

const mapStateToProps = (state) => {
    const {documentTitle} = state.app;
    return {documentTitle};
};

const mapDispatchToProps = {
    ga_config,
    ga_screenView,
};

export default connect(mapStateToProps, mapDispatchToProps)(GA_RouteHandler)
