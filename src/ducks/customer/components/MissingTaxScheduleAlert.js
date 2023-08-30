import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import Alert from "@mui/material/Alert";
import {selectCustomerAccount, selectCustomerLoading} from "../selectors";
import {selectCustomersLoaded} from "@/ducks/customers/selectors";
import {selectLoggedIn} from "@/ducks/user/selectors";
import {useAppDispatch} from "@/app/configureStore";

const MissingTaxScheduleAlert = () => {
    const customer = useSelector(selectCustomerAccount);
    const loading = useSelector(selectCustomerLoading);
    const loaded = useSelector(selectCustomersLoaded);
    const loggedIn = useSelector(selectLoggedIn);

    if (!loggedIn || !loaded  || loading || !!customer.TaxSchedule) {
        return null;
    }

    return (
        <Alert severity="error">
            <strong className="me-1">Warning:</strong>
            Missing Tax Schedule. Please contact <a href={`mailto:cs@chums.com?subject=${customer.ARDivisionNo}-${customer.CustomerNo}${encodeURIComponent(' Missing Tax Schedule (B2B)')}`} target="_blank">customer service.</a>
        </Alert>
    )
}
export default MissingTaxScheduleAlert;
