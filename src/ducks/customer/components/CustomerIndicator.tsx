import {useSelector} from "react-redux";
import {
    selectCustomerAccount,
    selectCustomerLoaded,
    selectCustomerLoading,
    selectCustomerLoadStatus,
    selectCustomerShipTo
} from "../selectors";
import React, {useEffect} from "react";
import {Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import {billToCustomerSlug, customerNo, customerSlug, parseCustomerSlug} from "../../../utils/customer";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router";
import {loadCustomer} from "../actions";
import {useAppDispatch} from "../../../app/configureStore";

export default function CustomerIndicator() {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCustomerAccount);
    const currentShipTo = useSelector(selectCustomerShipTo);
    const params = useParams<{ customerSlug: string }>();
    const loadStatus = useSelector(selectCustomerLoadStatus);
    const loading = useSelector(selectCustomerLoading);
    const loaded = useSelector(selectCustomerLoaded);

    useEffect(() => {
        const nextCustomer = billToCustomerSlug(params.customerSlug ?? '');
        if (!nextCustomer && !loaded && !!customer && !loading) {
            dispatch(loadCustomer(customer));
            return;
        }
        if (!nextCustomer) {
            return;
        }
        if (!customer || customerSlug(customer) !== nextCustomer) {
            if (loadStatus !== 'idle') {
                return;
            }
            dispatch(loadCustomer(parseCustomerSlug(nextCustomer)));
            return;
        }
        if (loadStatus === 'idle' && !loaded) {
            dispatch(loadCustomer(customer));
        }
    }, [params, customer, loadStatus, loaded])

    if (!customer) {
        return null;
    }

    return (
        <Tooltip title={(
            <>
                <Typography color="inherit" component="div">{customer.CustomerName}</Typography>
                {currentShipTo &&
                    <Typography color="inherit" sx={{fontSize: 'small'}}>{currentShipTo.ShipToName}</Typography>}
            </>
        )} arrow>
            <Box sx={{mx: 1, whiteSpace: 'pre'}}>
                {customerNo(customer)}
                {!!currentShipTo && <span>/{currentShipTo.ShipToCode}</span>}
            </Box>
        </Tooltip>
    )
}
