import React from 'react';
import {Helmet} from 'react-helmet';

const HelmetTitle = ({title, description}) => {
    return (
        <Helmet>
            <title>{[title, 'Chums B2B'].join(' | ')}</title>
            <meta property="og:title" content={[title, 'Chums B2B'].join(' | ')} />
            {!!description && <meta property="og:description" content={description}/>}
        </Helmet>
    );
};

export default HelmetTitle;
