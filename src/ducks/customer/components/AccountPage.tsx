import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {loadCustomer, setReturnToPath} from '../actions';
import AccountBreadcrumbs from "./AccountBreadcrumbs";
import {
    selectCustomerAccount,
    selectCustomerLoading,
    selectCustomerLoaded,
    selectCustomerLoadStatus, selectCustomerReturnToPath
} from "../selectors";
import {useLocation, useNavigate, useParams} from "react-router";
import DocumentTitle from "../../../components/DocumentTitle";
import AccountTabs from "./AccountTabs";
import {useAppDispatch} from "../../../app/configureStore";
import {generatePath, Outlet, redirect} from "react-router-dom";
import {
    billToCustomerSlug,
    customerNo,
    customerSlug,
    isSameCustomer,
    isValidCustomer,
    parseCustomerSlug
} from "../../../utils/customer";
import {PATH_PROFILE} from "../../../constants/paths";
import Typography from "@mui/material/Typography";
import ReturnToAlert from "./ReturnToAlert";
import Box from "@mui/material/Box";

const AccountPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const customer = useSelector(selectCustomerAccount);
    const params = useParams<{ customerSlug: string }>();
    const loadStatus = useSelector(selectCustomerLoadStatus);
    const loaded = useSelector(selectCustomerLoaded);
    const loading = useSelector(selectCustomerLoading);

    useEffect(() => {
        return () => {
            dispatch(setReturnToPath(null));
        }
    }, []);

    useEffect(() => {
        const nextCustomer = parseCustomerSlug(params.customerSlug ?? '');
        if (isSameCustomer(customer, nextCustomer) && loaded) {
            return;
        }
        if (!nextCustomer) {
            if (customer && !!params.customerSlug) {
                const slug = customerSlug(customer)!;
                navigate(generatePath('/account/:customerSlug/*', {customerSlug: slug, "*": params.customerSlug}));
                return;
            }
            if (customer) {
                navigate(generatePath('/account/:customerSlug', {customerSlug: customerSlug(customer)!}));
                return
            }
            navigate('/profile');
            return;
        }
        const slug = customerSlug(customer);
        const nextSlug = customerSlug(nextCustomer);
        if (!customer || !isSameCustomer(customer, nextCustomer)) {
            if (loadStatus !== 'idle') {
                return;
            }
            dispatch(loadCustomer(nextCustomer));
            return;
        }
        if (loadStatus === 'idle' && !loaded) {
            dispatch(loadCustomer(customer));
        }
    }, [params, customer, loadStatus, loaded])

    return (
        <div>
            <DocumentTitle documentTitle={customer?.CustomerName ?? ''}/>
            <AccountBreadcrumbs/>
            <ReturnToAlert />
            <Typography variant="h1" component="h1">
                {customer?.CustomerName}
            </Typography>
            <Typography variant="h2" component="h2" >
                {isValidCustomer(customer) && <Box sx={{me: 3}}>{customerNo(customer)}</Box>}
                {!isValidCustomer(customer) && !loading && <Box>Please select a customer</Box>}
            </Typography>
            <AccountTabs/>
            <Outlet/>
        </div>
    );
};

export default AccountPage;
