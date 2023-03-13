import React from 'react';
import {useSelector} from "react-redux";
import Alert from "../common-components/Alert";

const MissingTaxScheduleAlert = () => {
    const customer = useSelector(state => state.customer.account);
    if (!customer || !!customer.TaxSchedule) {
        return null;
    }
    return (
        <Alert type="alert-warning">
            <strong className="me-1">Warning:</strong>
            Missing Tax Schedule. Please contact <a href={`mailto:cs@chums.com?subject=${customer.ARDivisionNo}-${customer.CustomerNo}${encodeURIComponent(' Missing Tax Schedule (B2B)')}`} target="_blank">customer service.</a>
        </Alert>
    )
}
export default MissingTaxScheduleAlert;
