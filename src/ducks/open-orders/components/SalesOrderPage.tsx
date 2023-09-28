import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {generatePath, redirect} from 'react-router-dom';
import {setCurrentCart} from '../../cart/actions';
import {NEW_CART} from "../../../constants/orders";
import OrderDetail from "./OrderDetail";
import Alert from "@mui/material/Alert";
import DocumentTitle from "../../../components/DocumentTitle";
import {useMatch, useNavigate} from "react-router";
import {selectCustomerAccount, selectCustomerLoading} from "../../customer/selectors";
import {
    selectAttempts,
    selectIsCart,
    selectSalesOrderNo,
    selectSalesOrderProcessing,
    selectSendEmailResponse,
    selectSendEmailStatus,
    selectSOLoaded,
    selectSOLoading
} from "../../salesOrder/selectors";
import {selectCartNo} from "../../cart/selectors";
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {loadSalesOrder} from "../actions";
import SalesOrderHeaderElement from "./SalesOrderHeaderElement";
import SalesOrderSkeleton from "./SalesOrderSkeleton";
import CartOrderHeaderElement from "../../cart/components/CartOrderHeaderElement";
import {selectSalesOrder} from "../selectors";
import SalesOrderLoadingProgress from "./SalesOrderLoadingProgress";
import {isEditableSalesOrder} from "../../salesOrder/utils";

const SalesOrderPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const match = useMatch('/account/:customerSlug/:orderType/:salesOrderNo');
    const customer = useSelector(selectCustomerAccount);
    const salesOrderNo = useSelector(selectSalesOrderNo);
    const salesOrderHeader = useAppSelector((state) => selectSalesOrder(state, match?.params.salesOrderNo ?? ''));
    const loading = useSelector(selectSOLoading);
    const loaded = useSelector(selectSOLoaded);
    const customerLoading = useSelector(selectCustomerLoading);
    const salesOrderProcessing = useSelector(selectSalesOrderProcessing)
    const isCart = useSelector(selectIsCart);
    // const sendEmailStatus = useSelector(selectSendEmailResponse);
    // const sendingEmail = useSelector(selectSendEmailStatus);
    // const attempts = useSelector(selectAttempts);
    // const cartNo = useSelector(selectCartNo);

    const processing = customerLoading || salesOrderProcessing !== 'idle' || loading;
    // const isCurrentCart = cartNo === salesOrderNo;

    useEffect(() => {
        if (customer && !!customer.CustomerNo) {
            if (!loading && !!match?.params?.salesOrderNo && (!isEditableSalesOrder(salesOrderHeader) || match?.params?.salesOrderNo !== salesOrderHeader.SalesOrderNo)) {
                dispatch(loadSalesOrder(match.params.salesOrderNo))
            }
        }
    }, [customer, match, loading, salesOrderHeader]);

    useEffect(() => {
        if (salesOrderHeader?.OrderStatus === 'Z' && match?.params?.orderType && match?.params?.customerSlug) {
            const path = generatePath(`/account/:customerSlug/:orderType`, {customerSlug: match.params.customerSlug, orderType: match.params.orderType});
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
                    <h2>Cart #{salesOrderNo}</h2>
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
                <h2>Sales Order #{salesOrderNo}</h2>
                <SalesOrderHeaderElement/>
                <SalesOrderLoadingProgress salesOrderNo={match?.params?.salesOrderNo}/>
                <OrderDetail salesOrderNo={match?.params?.salesOrderNo}/>
            </div>
        </div>
    )
}

export default SalesOrderPage;
