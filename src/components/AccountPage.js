import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import BillToForm from "./BillToForm";
import {fetchCustomerAccount, setCustomerAccount} from '../actions/customer';
import {setCustomerTab} from '../actions/app';
import Tabs from "../common-components/Tabs";
import ShipToForm from "./ShipToForm";
import {CUSTOMER_TABS} from "../constants/app";
import AccountUsers from "./AccountUsers";
import AccountBreadcrumbs from "./AccountBreadcrumbs";
import {selectCustomerAccount} from "../selectors/customer";
import {selectCustomerTab} from "../selectors/app";
import {useParams} from "react-router";
import DocumentTitle from "./DocumentTitle";

const AccountPage = () => {
    const dispatch = useDispatch();
    const customer = useSelector(selectCustomerAccount);
    const customerTab = useSelector(selectCustomerTab);
    const params = useParams();

    useEffect(() => {
        if (params.ARDivisionNo === customer?.ARDivisionNo && params.CustomerNo === customer.CustomerNo) {
            return;
        }
        dispatch(setCustomerAccount({...params}))
        dispatch(fetchCustomerAccount({fetchOrders: true}));
    }, [params])

    const selectHandler = (id) => {
        dispatch(setCustomerTab(id));
    }

    return (
        <div>
            <DocumentTitle documentTitle={customer?.CustomerName ?? ''}/>
            <AccountBreadcrumbs/>
            <h2>{customer.CustomerName}</h2>
            <Tabs tabList={CUSTOMER_TABS} activeTab={customerTab} onSelect={selectHandler}/>

            {customerTab === CUSTOMER_TABS[0].id && <BillToForm/>}
            {customerTab === CUSTOMER_TABS[1].id && <ShipToForm/>}
            {customerTab === CUSTOMER_TABS[2].id && <AccountUsers/>}
        </div>
    );
};

export default AccountPage;
