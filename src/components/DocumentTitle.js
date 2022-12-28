import {Helmet} from 'react-helmet';
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const DocumentTitle = ({documentTitle = ''}) => {
    return (
        <Helmet>
            <title>{[documentTitle, 'Chums B2B'].join(' | ')}</title>
            <meta property="og:title" content={[documentTitle, 'Chums B2B'].join(' | ')} />
        </Helmet>
    )
}

export default DocumentTitle;
