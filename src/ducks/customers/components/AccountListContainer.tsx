/**
 * Created by steve on 3/1/2017.
 */

import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {setUserAccess} from '../../user/actions';
import {PATH_PROFILE} from "../../../constants/paths";
import {selectAccessList, selectAccessListLoading, selectCurrentAccess} from "../../user/selectors";
import {useAppDispatch} from "../../../app/configureStore";
import {useLocation, useParams} from "react-router";
import AccountList from "./AccountList";
import {redirect} from "react-router-dom";
import {setReturnToPath} from "../../customer/actions";

const AccountListContainer = () => {
    const dispatch = useAppDispatch();
    const params = useParams<'id'>();
    const access = useSelector(selectCurrentAccess);
    const accessList = useSelector(selectAccessList);
    const accessListLoading = useSelector(selectAccessListLoading);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.returnTo) {
            dispatch(setReturnToPath(location.state.returnTo));
        }
    }, []);

    useEffect(() => {
        if (accessListLoading) {
            return;
        }
        const id = Number(params.id ?? 0);
        const [nextAccess] = accessList.filter(ca => ca.id === id);
        if (!nextAccess) {
            redirect(PATH_PROFILE);
            return;
        }
        if (nextAccess.id !== access?.id) {
            dispatch(setUserAccess(nextAccess));
        }
    }, [params, access, accessList, accessListLoading]);

    return (
        <AccountList/>
    );
}

export default AccountListContainer;
