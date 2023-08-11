import React from 'react';
import dayjs, {Dayjs} from "dayjs";

export const DateString = ({date = new Date(), format = "MM/DD/YYYY"}: {
    date?: Date | string | number | Dayjs|null;
    format?: string;
}) => {
    if (date === null) {
        return null;
    }
    return (<>{dayjs(date).format(format)}</>);
};

