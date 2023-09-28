import React from 'react';
import AccountSelector from "../../../components/AccountSelector";
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

const ProfilePage = () => {
    const loading = useAppSelector(selectAccessListLoading);
    const customerAccounts = useAppSelector(selectCustomerAccessList);
    const repAccounts = useAppSelector(selectRepAccessList);
    const currentAccess = useAppSelector(selectCurrentAccess);

    return (
        <div className="profile-page">
            <DocumentTitle documentTitle={DOCUMENT_TITLES.profile}/>
            <UserProfile/>
            {loading && <LinearProgress variant="indeterminate"/>}
            {!!customerAccounts.length && <h4>Customer Accounts</h4>}
            {!!customerAccounts.length &&
                <AccountSelector userAccounts={customerAccounts} userAccount={currentAccess}/>}

            {!!repAccounts.length && <h4>Rep Accounts</h4>}
            {!!repAccounts.length && <AccountSelector userAccounts={repAccounts} userAccount={currentAccess}/>}
        </div>
    );
}

export default ProfilePage;
