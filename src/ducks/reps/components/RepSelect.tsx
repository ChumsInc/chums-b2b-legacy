import React, {ChangeEventHandler, useEffect} from 'react';
import Select from '../../../common-components/Select';
import {longRepNo} from "../../../utils/customer";
import {useSelector} from "react-redux";
import {selectUserAccount} from "../../user/selectors";
import {loadRepList} from "../actions";
import {useAppDispatch} from "../../../app/configureStore";
import {FieldValue} from "../../../types/generic";
import {selectRepsList, selectRepsLoaded, selectRepsLoading} from "../selectors";


const RepSelect = ({value = '', onChange}:{
    value: string|null;
    onChange: (value:string|null) => void;
}) => {
    const dispatch = useAppDispatch();
    const userAccount = useSelector(selectUserAccount);
    const reps = useSelector(selectRepsList);
    const loading = useSelector(selectRepsLoading);
    const loaded = useSelector(selectRepsLoaded);
    const allowSelectReps = /[%_]+/.test(userAccount?.SalespersonNo ?? '');

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

    const changeHandler = ({value}:FieldValue) => {
        return onChange(value ?? null);
    }

    return (
        <Select value={value ?? ''} onChange={changeHandler} options={options}>
            <option>All Available Reps</option>
        </Select>
    )
};

export default RepSelect;
