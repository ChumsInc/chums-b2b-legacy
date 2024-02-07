import React from 'react';
import {useSelector} from 'react-redux';
import AccountUserTable from "./AccountUserTable";
import {selectCustomerLoading} from "../selectors";
import EditAccountUserForm from "./EditAccountUserForm";
import LinearProgress from "@mui/material/LinearProgress";
import ReloadCustomerButton from "./ReloadCustomerButton";
import Grid2 from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AccountUserPermissions from "./AccountUserPermissions";

const AccountUsers = () => {
    const loading = useSelector(selectCustomerLoading);
    return (
        <Grid2 container spacing={2} sx={{mt: '2'}}>
            <Grid2 xs={12} sm={6}>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Typography variant="h2" component="h2">
                        User List
                    </Typography>
                    <ReloadCustomerButton/>
                </Stack>
                {loading && <LinearProgress variant={"indeterminate"} sx={{my: 1}}/>}
                <AccountUserTable/>
            </Grid2>
            <Grid2 xs={12} sm={6}>
                <EditAccountUserForm/>
                <Divider sx={{my: 3}}/>
                <AccountUserPermissions/>
            </Grid2>
        </Grid2>
    )
}

export default AccountUsers;
