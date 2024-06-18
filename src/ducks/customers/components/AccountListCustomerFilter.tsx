import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {useAppDispatch} from "../../../app/configureStore";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {useSelector} from "react-redux";
import {selectCustomersFilter} from "../selectors";
import {setCustomersFilter} from "../actions";
import {useIsSSR} from "../../../hooks/is-server-side";

const AccountListCustomerFilter = () => {
    const isSSR = useIsSSR();
    const dispatch = useAppDispatch();
    const filter = useSelector(selectCustomersFilter);
    const timer = useRef<number>(0);
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [value, setValue] = useState<string>(filter);

    useEffect(() => {
        dispatch(setCustomersFilter(debouncedSearch));
    }, [debouncedSearch]);

    useEffect(() => {
        setValue(filter);
        setDebouncedSearch(filter);
    }, [filter]);

    useEffect(() => {
        timer.current = window.setTimeout(() => setDebouncedSearch(value), 500);
        return () => {
            if (!isSSR) {
                window.clearTimeout(timer.current);
            }
        }
    }, [value])

    const filterChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value);
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
            <SearchIcon sx={{color: 'action.active', mr: 1, my: 0.5}}/>
            <TextField variant="standard"
                       inputProps={{maxLength: 50}}
                       value={value}
                       onChange={filterChangeHandler} label="Filter Customers" fullWidth/>
        </Box>
    )
}

export default AccountListCustomerFilter;
