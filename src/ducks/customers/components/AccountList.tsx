import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {loadCustomerList} from '../actions';
import {longAccountNumber} from "../../../utils/customer";
import ErrorBoundary from "../../../common-components/ErrorBoundary";
import {selectUserAccount,} from "../../user/selectors";
import {useAppDispatch} from "../../../app/configureStore";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import {DOCUMENT_TITLES, PATH_PROFILE} from "../../../constants/paths";
import DocumentTitle from "../../../components/DocumentTitle";
import Breadcrumb from "../../../components/Breadcrumb";
import {useLocation, useMatch} from "react-router";
import {selectCustomersLoaded, selectCustomersLoading} from "../selectors";
import Typography from "@mui/material/Typography";
import AccountListFilters from "./AccountListFilters";
import AccountListTable from "./AccountListTable";

const AccountList = () => {
    const dispatch = useAppDispatch();
    const match = useMatch('/profile/:id');
    const location = useLocation();
    const userAccount = useSelector(selectUserAccount);
    const loading = useSelector(selectCustomersLoading);
    const loaded = useSelector(selectCustomersLoaded);


    useEffect(() => {
        const profileId = +(match?.params.id ?? 0);
        if (!loading && !loaded && profileId === userAccount?.id) {
            dispatch(loadCustomerList(userAccount));
        }
    }, [loading, loaded, match, userAccount, dispatch]);


    if (!userAccount) {
        return (
            <div>
                <Alert severity="info">Please select a valid profile.</Alert>
            </div>
        )
    }

    const documentTitle = DOCUMENT_TITLES.accountList.replace(':name', userAccount.SalespersonName || '');

    const paths = [
        {title: 'Profile', pathname: PATH_PROFILE},
        {title: 'Account List', pathname: location.pathname}
    ];

    return (
        <ErrorBoundary>
            <DocumentTitle documentTitle={documentTitle}/>
            <Breadcrumb paths={paths}/>
            <Typography variant="h1" component="h1">Account List</Typography>
            <Typography variant="h2" component="h2">
                {userAccount?.SalespersonName ?? ''} <small className="ms-3">({longAccountNumber(userAccount)})</small>
            </Typography>

            <AccountListFilters/>

            {loading && <LinearProgress variant="indeterminate" sx={{my: 1}}/>}

            <AccountListTable/>
        </ErrorBoundary>
    );
}

export default AccountList;
