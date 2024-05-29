import Grid2 from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import RepSelect from "../../reps/components/RepSelect";
import React, {ChangeEvent, useEffect} from "react";
import {loadCustomerList, setCustomersFilter, setCustomersRepFilter} from "../actions";
import {useSelector} from "react-redux";
import {selectCustomersFilter, selectCustomersRepFilter} from "../selectors";
import {useAppDispatch} from "../../../app/configureStore";
import {selectCanFilterReps, selectUserAccount} from "../../user/selectors";
import {useDebounceValue} from "usehooks-ts";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const AccountListFilters = () => {
    const dispatch = useAppDispatch();
    const repFilter = useSelector(selectCustomersRepFilter);
    const filter = useSelector(selectCustomersFilter);
    const allowSelectReps = useSelector(selectCanFilterReps);
    const userAccount = useSelector(selectUserAccount);
    const [search, setSearch] = useDebounceValue(filter, 500);

    useEffect(() => {
        dispatch(setCustomersFilter(search));
    }, [dispatch, search]);

    const filterChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setSearch(ev.target.value);
    }
    const repChangeHandler = (value: string | null) => {
        dispatch(setCustomersRepFilter(value));
    }

    const reloadHandler = () => {
        dispatch(loadCustomerList(userAccount));
    }

    return (
        <Grid2 container spacing={2} alignContent="center" sx={{mt: 5, mb: 1}} justifyContent="space-between">
            <Grid2 sx={{flex: '1 1 auto'}}>
                <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                    <SearchIcon sx={{color: 'action.active', mr: 1, my: 0.5}}/>
                    <TextField variant="standard"
                               defaultValue={filter}
                               onChange={filterChangeHandler} label="Filter Customers" fullWidth/>
                </Box>
            </Grid2>
            {allowSelectReps && (
                <Grid2 sx={{flex: '1 1 auto'}}>
                    <RepSelect value={repFilter} onChange={repChangeHandler}/>
                </Grid2>
            )}
            <Grid2 xs="auto">
                <Button variant="contained" onClick={reloadHandler}>Refresh List</Button>
            </Grid2>
        </Grid2>
    )
}

export default AccountListFilters;
