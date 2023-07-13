import React, {useEffect} from 'react';
import Select from '../common-components/Select';
import {longRepNo} from "../utils/customer";
import {useSelector} from "react-redux";
import {selectUserAccount, selectUserReps, selectUserRepsLoaded, selectUserRepsLoading} from "../ducks/user/selectors";
import {loadRepList} from "../ducks/user/actions";
import {useAppDispatch} from "../app/configureStore";

// export interface RepSelectProps {
//     value: string,
//     onChange: (arg: SelectChangeHandler) => void
// }
//
const RepSelect = ({value = '', onChange}) => {
    const dispatch = useAppDispatch();
    const userAccount = useSelector(selectUserAccount);
    const reps = useSelector(selectUserReps);
    const loading = useSelector(selectUserRepsLoading);
    const loaded = useSelector(selectUserRepsLoaded);
    const allowSelectReps = /[%_]+/.test(userAccount?.SalespersonNo ?? '');

    useEffect(() => {
        if (!loading && !loaded) {
            dispatch(loadRepList());
        }
    }, [userAccount]);

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
    return (
        <Select value={value} onChange={onChange} options={options}>
            <option>All Available Reps</option>
        </Select>
    )
};

export default RepSelect;
