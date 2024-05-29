import React from 'react';
import {useSelector} from "react-redux";
import Alert from "@mui/material/Alert";
import {selectCustomerAccount, selectCustomerLoaded, selectCustomerLoading} from "../selectors";
import {selectLoggedIn} from "../../user/selectors";

const MissingTaxScheduleAlert = () => {
    const customer = useSelector(selectCustomerAccount);
    const loading = useSelector(selectCustomerLoading);
    const loaded = useSelector(selectCustomerLoaded);
    const loggedIn = useSelector(selectLoggedIn);

    if (!customer) {
        return null;
    }

    if (!loggedIn || !loaded || loading || !!customer?.TaxSchedule) {
        return null;
    }

    return (
        <Alert severity="error">
            <strong className="me-1">Warning:</strong>
            Missing Tax Schedule. Please contact
            <a
                href={`mailto:cs@chums.com?subject=${customer.ARDivisionNo}-${customer.CustomerNo}${encodeURIComponent(' Missing Tax Schedule (B2B)')}`}
                rel="noreferrer"
                target="_blank">customer service.</a>
        </Alert>
    )
}
export default MissingTaxScheduleAlert;
