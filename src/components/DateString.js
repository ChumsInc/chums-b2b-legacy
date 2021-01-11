import React, {Fragment} from 'react';
import formatDate from 'date-fns/format';
import parseDate from 'date-fns/parseJSON';

export const DateString = ({date = new Date(), format = "MM/dd/yyyy"}) => {
    if (date === null) {
        return null;
    }
    return (<Fragment>{formatDate(parseDate(date), format)}</Fragment>);
};

