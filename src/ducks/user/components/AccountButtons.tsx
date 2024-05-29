import React from 'react';
import {customerSlug, longCustomerNo, longRepNo, sortUserAccounts} from '../../../utils/customer';
import {UserCustomerAccess} from "b2b-types";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button"
import {generatePath, Link as RoutedLink} from "react-router-dom";
import {PATH_CUSTOMER_ACCOUNT, PATH_PROFILE_ACCOUNT} from "../../../constants/paths";

const UserAccountButton = ({access, selected = 0}: {
    access: UserCustomerAccess;
    selected?: number;
}) => {
    const {id, CustomerName, SalespersonName, isRepAccount, ARDivisionNo, CustomerNo} = access;
    const linkPath = isRepAccount
        ? generatePath(PATH_PROFILE_ACCOUNT, {id: `${id}`})
        : generatePath(PATH_CUSTOMER_ACCOUNT, {customerSlug: customerSlug(access)});

    return (
        <Button variant={selected === id ? "contained" : "outlined"} component={RoutedLink} to={linkPath}>
            <Stack direction="column" textAlign="center">
                <div>
                    {isRepAccount
                        ? longRepNo({SalespersonDivisionNo: ARDivisionNo, SalespersonNo: CustomerNo})
                        : longCustomerNo(access)
                    }
                </div>

                <div>{isRepAccount ? SalespersonName : CustomerName}</div>
            </Stack>
        </Button>
    )
};

const AccountButtons = ({userAccounts, userAccount}: {
    userAccounts: UserCustomerAccess[],
    userAccount: UserCustomerAccess | null;
}) => {
    return (
        <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
            {userAccounts
                .sort(sortUserAccounts)
                .map(acct => <UserAccountButton key={acct.id} access={acct} selected={userAccount?.id}/>)}
        </Stack>
    )
}

export default AccountButtons
