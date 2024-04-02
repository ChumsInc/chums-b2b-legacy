import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {generatePath, redirect} from 'react-router-dom';
import OrderDetail from "./OrderDetail";
import Alert from "@mui/material/Alert";
import DocumentTitle from "../../../components/DocumentTitle";
import {useMatch, useNavigate} from "react-router";
import {selectCustomerAccount, selectCustomerLoading} from "../../customer/selectors";
import {selectIsCart, selectSalesOrderNo, selectSOLoading} from "../../sales-order/selectors";
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {loadSalesOrder} from "../actions";
import SalesOrderHeaderElement from "./SalesOrderHeaderElement";
import SalesOrderSkeleton from "./SalesOrderSkeleton";
import CartOrderHeaderElement from "../../cart/components/CartOrderHeaderElement";
import {selectSalesOrder} from "../selectors";
import SalesOrderLoadingProgress from "./SalesOrderLoadingProgress";
import {isEditableSalesOrder} from "../../sales-order/utils";

const SalesOrderPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const match = useMatch('/account/:customerSlug/:orderType/:salesOrderNo');
    const customer = useSelector(selectCustomerAccount);
    const salesOrderNo = useSelector(selectSalesOrderNo);
    const salesOrderHeader = useAppSelector((state) => selectSalesOrder(state, match?.params.salesOrderNo ?? ''));
    const loading = useSelector(selectSOLoading);
    const customerLoading = useSelector(selectCustomerLoading);
    const isCart = useSelector(selectIsCart);

    useEffect(() => {
        console.log('useEffect', [customer, match, loading, salesOrderHeader])
        if (customer && !!customer.CustomerNo) {
            if (!loading && !!match?.params?.salesOrderNo && (!isEditableSalesOrder(salesOrderHeader) || match?.params?.salesOrderNo !== salesOrderHeader.SalesOrderNo)) {
                dispatch(loadSalesOrder(match.params.salesOrderNo))
            }
        }
    }, [customer, match, loading, salesOrderHeader]);

    useEffect(() => {
        if (salesOrderHeader?.OrderStatus === 'Z' && match?.params?.orderType && match?.params?.customerSlug) {
            const path = generatePath(`/account/:customerSlug/:orderType`, {
                customerSlug: match.params.customerSlug,
                orderType: match.params.orderType
            });
            navigate(path, {replace: true});
        }
    }, [salesOrderHeader?.OrderStatus]);


    if (!customer && !customerLoading) {
        redirect('/profile');
        return;
    }

    const documentTitle = `${isCart ? 'Cart' : 'Order'} Info #${match?.params?.salesOrderNo}`;
    if (!salesOrderHeader || !customer) {
        return (
            <div>
                <DocumentTitle documentTitle={documentTitle}/>
                <div className="sales-order-page">
                    <SalesOrderSkeleton/>
                </div>
                <SalesOrderLoadingProgress salesOrderNo={match?.params?.salesOrderNo}/>
            </div>
        )
    }

    if (salesOrderHeader.OrderStatus === 'X') {
        return (
            <div>
                <DocumentTitle documentTitle={documentTitle}/>
                <h2>Cancelled Order #{salesOrderNo}</h2>
                <div className="sales-order-page">
                    <SalesOrderSkeleton/>
                </div>
                <Alert severity="error" title="Note:">
                    This order has been cancelled. Please contact Customer Service if you have any questions.
                </Alert>
            </div>
        )

    }

    if (salesOrderHeader.OrderType === 'Q') {
        return (
            <div>
                <DocumentTitle documentTitle={documentTitle}/>
                <div className="sales-order-page">
                    <h2>Cart #{salesOrderHeader.SalesOrderNo}</h2>
                    <CartOrderHeaderElement/>
                    <SalesOrderLoadingProgress salesOrderNo={match?.params?.salesOrderNo}/>
                    <OrderDetail salesOrderNo={match?.params?.salesOrderNo}/>
                </div>
            </div>
        )
    }
    return (
        <div>
            <DocumentTitle documentTitle={documentTitle}/>
            <div className="sales-order-page">
                <h2>Sales Order #{salesOrderHeader.SalesOrderNo}</h2>
                <SalesOrderHeaderElement/>
                <SalesOrderLoadingProgress salesOrderNo={match?.params?.salesOrderNo}/>
                <OrderDetail salesOrderNo={match?.params?.salesOrderNo}/>
            </div>
        </div>
    )
}

export default SalesOrderPage;
