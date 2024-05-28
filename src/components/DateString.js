import React, {Fragment} from 'react';
import dayjs from "dayjs";

export const DateString = ({date = new Date(), format = "MM/DD/YYYY"}) => {
    if (date === null || !dayjs(date).isValid()) {
        return null;
    }
    return (<Fragment>{dayjs(date).format(format)}</Fragment>)
};

