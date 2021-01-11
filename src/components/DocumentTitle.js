import {Helmet} from 'react-helmet';
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class DocumentTitle extends Component {

    static propTypes = {
        documentTitle: PropTypes.string,
    };

    static defaultProps = {
        documentTitle: '',
    };

    render() {
        const {documentTitle} = this.props;
        return (
            <Helmet>
                <title>{[documentTitle, 'Chums B2B'].join(' | ')}</title>
                <meta property="og:title" content={[documentTitle, 'Chums B2B'].join(' | ')} />
            </Helmet>
        );
    }
}

const mapStateToProps = ({app}) => {
    const {documentTitle} = app;
    return {
        documentTitle,
    }
};

export default connect(mapStateToProps)(DocumentTitle);
