import React from 'react';
import {useSelector} from "react-redux";
import Alert from "../common-components/Alert";
import {selectCustomerAccount, selectCustomerLoading} from "../selectors/customer";

const MissingTaxScheduleAlert = () => {
    const customer = useSelector(selectCustomerAccount);
    const loading = useSelector(selectCustomerLoading);


    if (!customer || !!customer.TaxSchedule || loading) {
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
