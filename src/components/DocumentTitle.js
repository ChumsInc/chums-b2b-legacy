import {Helmet} from 'react-helmet-async';
import React from "react";

const DocumentTitle = ({documentTitle = ''}) => {
    return (
        <Helmet>
            <title>{[documentTitle, 'Chums B2B'].join(' | ')}</title>
            <meta property="og:title" content={[documentTitle, 'Chums B2B'].join(' | ')}/>
        </Helmet>
    )
}

export default DocumentTitle;
