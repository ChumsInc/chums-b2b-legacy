import React, {useEffect} from 'react';
import AccountButtons from "./AccountButtons";
import UserProfile from "./UserProfile";
import {documentTitles} from '../../../constants/paths';
import DocumentTitle from "../../../components/DocumentTitle";
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {
    selectAccessListLoading,
    selectCurrentAccess,
    selectCustomerAccessList,
    selectRepAccessList
} from "../selectors";
import LinearProgress from "@mui/material/LinearProgress";
import Container from "@mui/material/Container";
import {useLocation} from "react-router";
import {setReturnToPath} from "../../customer/actions";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectAccessListLoading);
    const customerAccounts = useAppSelector(selectCustomerAccessList);
    const repAccounts = useAppSelector(selectRepAccessList);
    const currentAccess = useAppSelector(selectCurrentAccess);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.returnTo) {
            dispatch(setReturnToPath(location.state.returnTo));
        }
    }, []);

    return (
        <Container maxWidth="lg">
            <DocumentTitle documentTitle={documentTitles.profile}/>
            <UserProfile/>
            {loading && <LinearProgress variant="indeterminate"/>}
            {!!customerAccounts.length && <h4>Customer Accounts</h4>}
            {!!customerAccounts.length &&
                <AccountButtons userAccounts={customerAccounts} userAccount={currentAccess}/>}

            {!!repAccounts.length && <h4>Rep Accounts</h4>}
            {!!repAccounts.length && <AccountButtons userAccounts={repAccounts} userAccount={currentAccess}/>}
        </Container>
    );
}

export default ProfilePage;
