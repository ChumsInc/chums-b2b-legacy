import Grid2 from "@mui/material/Unstable_Grid2";
import React from "react";
import {loadCustomerList} from "../actions";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../../app/configureStore";
import {selectUserAccount} from "../../user/selectors";
import Button from "@mui/material/Button";
import AccountListCustomerFilter from "./AccountListCustomerFilter";
import AccountListRepFilter from "./AccountListRepFilter";

const AccountListFilters = () => {
    const dispatch = useAppDispatch();
    const userAccount = useSelector(selectUserAccount);

    const reloadHandler = () => {
        dispatch(loadCustomerList(userAccount));
    }

    return (
        <Grid2 container spacing={2} alignContent="center" sx={{mt: 5, mb: 1}} justifyContent="space-between">
            <Grid2 sx={{flex: '1 1 auto'}}>
                <AccountListCustomerFilter/>
            </Grid2>
            <Grid2 sx={{flex: '1 1 auto'}}>
                <AccountListRepFilter/>
            </Grid2>
            <Grid2 xs="auto">
                <Button variant="contained" onClick={reloadHandler}>Refresh List</Button>
            </Grid2>
        </Grid2>
    )
}

export default AccountListFilters;
