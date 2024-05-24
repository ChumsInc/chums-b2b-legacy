import React from 'react';
import {selectSalesOrderLoading} from "../selectors";
import {useAppSelector} from "../../../app/configureStore";
import LinearProgress from "@mui/material/LinearProgress";

export default function SalesOrderLoadingProgress({salesOrderNo}:{
    salesOrderNo?: string
}) {
    const loading = useAppSelector(state => selectSalesOrderLoading(state, salesOrderNo));
    if (!loading) {
        return null;
    }
    return (
        <LinearProgress variant="indeterminate" sx={{my: 1}} />
    )
}
