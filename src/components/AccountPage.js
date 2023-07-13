import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import BillToForm from "./BillToForm";
import {loadCustomerAccount, setCustomerAccount} from '../ducks/customer/actions';
import {setCustomerTab} from '../ducks/app/actions';
import Tabs from "../common-components/Tabs";
import ShipToForm from "./ShipToForm";
import {CUSTOMER_TABS} from "../constants/app";
import AccountUsers from "./AccountUsers/AccountUsers";
import AccountBreadcrumbs from "./AccountBreadcrumbs";
import {selectCustomerAccount} from "../ducks/customer/selectors";
import {selectCustomerTab} from "../selectors/app";
import {useParams} from "react-router";
import DocumentTitle from "./DocumentTitle";
import AccountTabs from "./AccountTabs";
import {loadCustomerPermissions} from "../ducks/user/actions";

const AccountPage = () => {
    const dispatch = useDispatch();
    const customer = useSelector(selectCustomerAccount);
    const customerTab = useSelector(selectCustomerTab);
    const params = useParams();

    useEffect(() => {
        if (params.ARDivisionNo === customer?.ARDivisionNo
            && params.CustomerNo === customer?.CustomerNo
            // && (params.ShipToCode ?? '') === (customer?.ShipToCode ?? '')
        ) {
            return;
        }
        dispatch(setCustomerAccount({...params}))
        dispatch(loadCustomerAccount({fetchOrders: true}));
        dispatch(loadCustomerPermissions());
    }, [params, customer])

    return (
        <div>
            <DocumentTitle documentTitle={customer?.CustomerName ?? ''}/>
            <AccountBreadcrumbs/>
            <h2>{customer.CustomerName}</h2>
            <AccountTabs  />

            {customerTab === CUSTOMER_TABS[0].id && <BillToForm/>}
            {customerTab === CUSTOMER_TABS[1].id && <ShipToForm/>}
            {customerTab === CUSTOMER_TABS[2].id && <AccountUsers/>}
        </div>
    );
};

export default AccountPage;
