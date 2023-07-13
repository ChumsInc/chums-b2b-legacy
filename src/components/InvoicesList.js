import React from 'react';
import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "../ducks/user/selectors";
import {ORDER_TYPE} from "../constants/orders";
import OrdersList from "./OrdersList";
import {selectInvoicesList, selectInvoicesLoading} from "../ducks/invoices/selectors";
import {loadInvoices} from "../ducks/invoices/actions";

const InvoicesList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectInvoicesList);
    const loading = useSelector(selectInvoicesLoading);
    const currentCustomer = useSelector(selectCurrentCustomer);

    const reloadHandler = () => {
        if (!currentCustomer) {
            return;
        }
        dispatch(loadInvoices(currentCustomer));
    }

    if (!currentCustomer || !currentCustomer.CustomerNo) {
        return null;
    }
    return (
        <OrdersList list={list} loading={loading}
                    onReload={reloadHandler}
                    orderType={ORDER_TYPE.invoices}/>
    )
}

export default InvoicesList;
