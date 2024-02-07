import React from 'react';
import AccountButtons from "./AccountButtons";
import UserProfile from "./UserProfile";
import {DOCUMENT_TITLES} from '../../../constants/paths';
import DocumentTitle from "../../../components/DocumentTitle";
import {useAppSelector} from "../../../app/configureStore";
import {
    selectAccessListLoading,
    selectCurrentAccess,
    selectCustomerAccessList,
    selectRepAccessList
} from "../selectors";
import LinearProgress from "@mui/material/LinearProgress";
import Container from "@mui/material/Container";

const ProfilePage = () => {
    const loading = useAppSelector(selectAccessListLoading);
    const customerAccounts = useAppSelector(selectCustomerAccessList);
    const repAccounts = useAppSelector(selectRepAccessList);
    const currentAccess = useAppSelector(selectCurrentAccess);

    return (
        <Container maxWidth="lg">
            <DocumentTitle documentTitle={DOCUMENT_TITLES.profile}/>
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
