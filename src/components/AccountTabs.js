import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectCustomerTab} from "../selectors/app";
import {setCustomerTab} from "../actions/app";
import {CUSTOMER_TABS} from "../constants/app";
import Tabs from "../common-components/Tabs";

const AccountTabs = () => {
    const dispatch = useDispatch();
    const customerTab = useSelector(selectCustomerTab);

    const tabChangeHandler = (id) => {
        dispatch(setCustomerTab(id));
    }

    return (
        <Tabs tabList={CUSTOMER_TABS} activeTab={customerTab} onSelect={tabChangeHandler}/>
    )
}

export default AccountTabs;
