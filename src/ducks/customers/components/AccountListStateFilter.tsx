import React, {useId} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {selectCustomersStateFilter, selectCustomerStates} from "../selectors";
import StateSelect from "../../../components/StateSelect";
import {setCustomersStateFilter} from "../actions";

const AccountListStateFilter = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector(selectCustomerStates);
    const stateFilter = useAppSelector(selectCustomersStateFilter);
    const id = useId();

    const changeHandler = (state:string) => {
        dispatch(setCustomersStateFilter(state));
    }

    if (states.length < 2) {
        return null;
    }
    return (
        <StateSelect countryCode="USA" value={stateFilter} filterList={states} allowAllStates id={id}
                     variant="standard" onChange={changeHandler} />
    )
}

export default AccountListStateFilter;
