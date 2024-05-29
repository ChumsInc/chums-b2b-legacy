import React, {useEffect, useId} from 'react';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {longRepNo} from "../../../utils/customer";
import {useSelector} from "react-redux";
import {selectUserAccount} from "../../user/selectors";
import {loadRepList} from "../actions";
import {useAppDispatch} from "../../../app/configureStore";
import {selectRepsList, selectRepsLoaded, selectRepsLoading} from "../selectors";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";


const RepSelect = ({value = '', onChange}: {
    value: string | null;
    onChange: (value: string | null) => void;
}) => {
    const dispatch = useAppDispatch();
    const userAccount = useSelector(selectUserAccount);
    const reps = useSelector(selectRepsList);
    const loading = useSelector(selectRepsLoading);
    const loaded = useSelector(selectRepsLoaded);
    const allowSelectReps = /[%_]+/.test(userAccount?.SalespersonNo ?? '');
    const labelId = useId();

    useEffect(() => {
        if (!loading && !loaded && allowSelectReps) {
            dispatch(loadRepList());
        }
    }, [allowSelectReps, loading, loaded]);

    const options = reps
        .filter(rep => !!rep.active)
        .sort((a, b) => {
            const aa = longRepNo(a);
            const bb = longRepNo(b);
            return aa === bb ? 0 : (aa > bb ? 1 : -1);
        })
        .map(rep => ({value: longRepNo(rep), text: `${longRepNo(rep)} - ${rep.SalespersonName}`}));
    if (!allowSelectReps || options.length === 0) {
        return null;
    }

    const changeHandler = (ev: SelectChangeEvent) => {
        return onChange(ev.target.value ?? null);
    }

    return (
        <FormControl fullWidth>
            <InputLabel id={labelId}>Sales Rep</InputLabel>
            <Select labelId={labelId} label="Sales Rep" variant="standard"
                    onChange={changeHandler} value={value ?? ''}>
                <MenuItem value="">All Available Reps</MenuItem>
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default RepSelect;
